import { api } from './client';

// Saved ids of the signed-in user, shared by every heart/bookmark on the page
const KINDS = ['universities', 'scholarships'];
let snapshot = { userId: null, universities: null, scholarships: null };
let version = 0; // bumped by every toggle
const queues = new Map(); // per item, so a quick double-click reaches the server in order
const listeners = new Set();
const update = (patch) => {
    snapshot = { ...snapshot, ...patch };
    listeners.forEach((fn) => fn());
};

export const subscribeSaved = (fn) => {
    listeners.add(fn);
    return () => listeners.delete(fn);
};
export const getSavedSnapshot = () => snapshot;

export const loadSaved = async (userId) => {
    update({ userId, universities: null, scholarships: null });
    if (!userId) return;
    try {
        let lists;
        let started;
        do {
            started = version;
            lists = await Promise.all(KINDS.map((kind) => api(`/me/saved/${kind}`)));
        } while (started !== version && snapshot.userId === userId); // a toggle happened meanwhile
        if (snapshot.userId === userId) update({ universities: lists[0].ids, scholarships: lists[1].ids });
    } catch {
        // Leave the hearts empty; the next sign-in or reload tries again
    }
};

const setMembership = (kind, id, saved) => {
    const ids = snapshot[kind] ?? [];
    update({ [kind]: saved ? (ids.includes(id) ? ids : [...ids, id]) : ids.filter((x) => x !== id) });
};

// Optimistic: flips immediately, reverts if the request fails
export const toggleSaved = async (kind, id) => {
    const wasSaved = (snapshot[kind] ?? []).includes(id);
    version += 1;
    setMembership(kind, id, !wasSaved);
    const key = `${kind}/${id}`;
    const request = (queues.get(key) ?? Promise.resolve())
        .catch(() => {})
        .then(() => api(`/me/saved/${kind}/${encodeURIComponent(id)}`, { method: wasSaved ? 'DELETE' : 'PUT' }));
    queues.set(key, request);
    try {
        await request;
    } catch (err) {
        setMembership(kind, id, wasSaved);
        throw err;
    } finally {
        if (queues.get(key) === request) queues.delete(key);
    }
};
