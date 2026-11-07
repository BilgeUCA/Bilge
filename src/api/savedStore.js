import { api } from './client';

// Saved ids of the signed-in user, shared by every heart/bookmark on the page
const KINDS = ['universities', 'scholarships'];
let snapshot = { userId: null, universities: null, scholarships: null };
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
        const [universities, scholarships] = await Promise.all(KINDS.map((kind) => api(`/me/saved/${kind}`)));
        if (snapshot.userId === userId) update({ universities: universities.ids, scholarships: scholarships.ids });
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
    setMembership(kind, id, !wasSaved);
    try {
        await api(`/me/saved/${kind}/${encodeURIComponent(id)}`, { method: wasSaved ? 'DELETE' : 'PUT' });
    } catch (err) {
        setMembership(kind, id, wasSaved);
        throw err;
    }
};
