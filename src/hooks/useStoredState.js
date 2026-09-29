import { useCallback, useEffect, useState } from 'react';

// Same-tab broadcast so every component reading a key stays in sync;
// the native `storage` event only fires in *other* tabs.
const EVENT = 'bilge-storage';

const read = (key, fallback) => {
    try {
        const raw = window.localStorage.getItem(key);
        return raw === null ? fallback : JSON.parse(raw);
    } catch {
        return fallback;
    }
};

export const useStoredState = (key, fallback) => {
    const [value, setValue] = useState(() => read(key, fallback));

    useEffect(() => {
        const sync = (e) => {
            if (e.type === 'storage' ? e.key === key || e.key === null : e.detail === key) {
                setValue(read(key, fallback));
            }
        };
        window.addEventListener('storage', sync);
        window.addEventListener(EVENT, sync);
        return () => {
            window.removeEventListener('storage', sync);
            window.removeEventListener(EVENT, sync);
        };
        // fallback is a literal at every call site; re-subscribing on its identity is unnecessary
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key]);

    const update = useCallback(
        (next) => {
            setValue((prev) => {
                const resolved = typeof next === 'function' ? next(prev) : next;
                try {
                    if (resolved === null || resolved === undefined) window.localStorage.removeItem(key);
                    else window.localStorage.setItem(key, JSON.stringify(resolved));
                } catch {
                    // Storage blocked (private mode): keep in-memory state only
                }
                queueMicrotask(() => window.dispatchEvent(new CustomEvent(EVENT, { detail: key })));
                return resolved;
            });
        },
        [key]
    );

    return [value, update];
};

// Saved (bookmarked) ids for universities / scholarships
export const useSavedIds = (kind) => {
    const [ids, setIds] = useStoredState(`bilge.saved.${kind}`, []);
    const toggle = useCallback(
        (id) => setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])),
        [setIds]
    );
    return { ids, isSaved: (id) => ids.includes(id), toggle };
};
