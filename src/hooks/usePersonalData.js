import { useCallback, useRef, useState, useSyncExternalStore } from 'react';
import { useAuth } from '../auth/authContext';
import { api } from '../api/client';
import { checklistKey, savedKey } from '../api/localData';
import { getSavedSnapshot, subscribeSaved, toggleSaved } from '../api/savedStore';
import { useStoredState } from './useStoredState';

const asList = (value) => (Array.isArray(value) ? value : []);

// Saved (bookmarked) ids: the account when signed in, this browser for guests
export const useSavedIds = (kind) => {
    const { user } = useAuth();
    const signedIn = Boolean(user);
    const [localIds, setLocalIds] = useStoredState(savedKey(kind), []);
    const remote = useSyncExternalStore(subscribeSaved, getSavedSnapshot);
    const ids = signedIn ? remote[kind] ?? [] : asList(localIds);

    const toggle = useCallback(
        async (id) => {
            if (signedIn) {
                await toggleSaved(kind, id).catch(() => {});
                return;
            }
            setLocalIds((prev) => (asList(prev).includes(id) ? asList(prev).filter((x) => x !== id) : [...asList(prev), id]));
        },
        [signedIn, kind, setLocalIds]
    );
    return { ids, isSaved: (id) => ids.includes(id), toggle };
};

// Document checklist for one university or scholarship. `serverChecked` is the
// `checklist.checked` list of the detail response; `stale` means that response may
// be outdated (cached, or from before sign-in) and a fresh one is loading.
export const useChecklist = (kind, id, documents, serverChecked, stale) => {
    const { user } = useAuth();
    const [local, setLocal] = useStoredState(checklistKey(kind, id), []);
    const [remote, setRemote] = useState(null);
    const queue = useRef(Promise.resolve());
    const checked = user ? remote ?? serverChecked ?? [] : asList(local);
    // The server replaces the whole list, so wait for fresh data before the first change
    const editable = !user || remote !== null || !stale;

    const toggle = (doc) => {
        if (!editable) return;
        // Ticks for documents no longer listed would be rejected by the server
        const next = (checked.includes(doc) ? checked.filter((d) => d !== doc) : [...checked, doc]).filter((d) => documents.includes(d));
        if (!user) {
            setLocal(next);
            return;
        }
        setRemote(next);
        // The server replaces the whole list, so send updates one after another
        queue.current = queue.current
            .then(() => api(`/me/checklists/${kind}/${encodeURIComponent(id)}`, { method: 'PUT', body: { checked: next } }))
            .catch(() => setRemote((current) => (current === next ? checked : current)));
    };
    return { checked, toggle, editable };
};
