// Guests keep saved items, checklists and practice results in localStorage.
// On sign-in they are moved to the account with POST /me/import, then cleared.
export const savedKey = (kind) => `bilge.saved.${kind}`;
export const checklistKey = (kind, id) => (kind === 'scholarships' ? `bilge.checklist.sch.${id}` : `bilge.checklist.${id}`);
export const ORT_RESULTS_KEY = 'bilge.ort.results';

const SUBJECTS = ['all', 'math', 'verbal'];

const read = (key) => {
    try {
        return JSON.parse(window.localStorage.getItem(key));
    } catch {
        return null;
    }
};
const strings = (value) => (Array.isArray(value) ? value.filter((x) => typeof x === 'string') : []);
const localKeys = () => {
    try {
        return Object.keys(window.localStorage);
    } catch {
        return [];
    }
};

// Builds the /me/import body from whatever valid data this browser holds
export const collectLocalData = () => {
    const keys = [];
    const saved = {};
    for (const kind of ['universities', 'scholarships']) {
        const ids = strings(read(savedKey(kind)));
        if (ids.length) saved[kind] = ids.slice(0, 500);
        if (window.localStorage.getItem(savedKey(kind)) !== null) keys.push(savedKey(kind));
    }
    const checklists = { universities: {}, scholarships: {} };
    for (const key of localKeys()) {
        if (!key.startsWith('bilge.checklist.')) continue;
        keys.push(key);
        const [kind, id] = key.startsWith('bilge.checklist.sch.')
            ? ['scholarships', key.slice('bilge.checklist.sch.'.length)]
            : ['universities', key.slice('bilge.checklist.'.length)];
        const docs = strings(read(key));
        if (id && docs.length) checklists[kind][id] = docs.slice(0, 500);
    }
    const ortResults = (Array.isArray(read(ORT_RESULTS_KEY)) ? read(ORT_RESULTS_KEY) : [])
        .filter((r) => r && typeof r.date === 'string' && !Number.isNaN(Date.parse(r.date)) && SUBJECTS.includes(r.subject)
            && Number.isInteger(r.correct) && Number.isInteger(r.total) && r.total >= 1 && r.total <= 100 && r.correct >= 0 && r.correct <= r.total
            && Date.parse(r.date) <= Date.now() + 86_400_000)
        .slice(-500);
    if (window.localStorage.getItem(ORT_RESULTS_KEY) !== null) keys.push(ORT_RESULTS_KEY);

    const hasData = Object.keys(saved).length || Object.keys(checklists.universities).length
        || Object.keys(checklists.scholarships).length || ortResults.length;
    return { keys, payload: hasData ? { saved, checklists, ortResults } : null };
};

export const clearLocalData = (keys) => {
    try {
        keys.forEach((key) => window.localStorage.removeItem(key));
    } catch {
        // Storage blocked: nothing to clear
    }
};
