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

// Document checklist for one university or scholarship. `serverChecked` is
// the `checklist.checked` list embedded in the detail response.
export const useChecklist = (kind, id, serverChecked) => {
    const { user } = useAuth();
    const [local, setLocal] = useStoredState(checklistKey(kind, id), []);
    const [remote, setRemote] = useState(null);
    const queue = useRef(Promise.resolve());
    const checked = user ? remote ?? serverChecked ?? [] : asList(local);

    const toggle = (doc) => {
        const next = checked.includes(doc) ? checked.filter((d) => d !== doc) : [...checked, doc];
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
    return { checked, toggle };
};
