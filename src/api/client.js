// Thin fetch wrapper for the Bilge API (see API.md). In development Vite
// proxies /v1 to the API; set VITE_API_URL to call another origin.
const BASE = (import.meta.env.VITE_API_URL || '/v1').replace(/\/$/, '');
const TOKENS_KEY = 'bilge.auth';

export class ApiError extends Error {
    constructor(status, code, message, field = null) {
        super(message);
        this.status = status;
        this.code = code;
        this.field = field;
    }
}

// UI language codes (EN / RU / KG) ↔ API codes (en / ru / ky)
const TO_API = { EN: 'en', RU: 'ru', KG: 'ky' };
export const toApiLanguage = (ui) => TO_API[ui] || 'en';
export const fromApiLanguage = (api) => Object.keys(TO_API).find((ui) => TO_API[ui] === api) || null;

let defaultLanguage = 'en';
export const setApiLanguage = (ui) => {
    defaultLanguage = toApiLanguage(ui);
};

const readTokens = () => {
    try {
        return JSON.parse(window.localStorage.getItem(TOKENS_KEY)) || null;
    } catch {
        return null;
    }
};

let tokens = readTokens();
const listeners = new Set();
const notify = (external = false) => listeners.forEach((fn) => fn(tokens, external));

export const getTokens = () => tokens;
export const setTokens = (next) => {
    tokens = next ? { accessToken: next.accessToken, refreshToken: next.refreshToken } : null;
    try {
        if (tokens) window.localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens));
        else window.localStorage.removeItem(TOKENS_KEY);
    } catch {
        // Storage blocked: the session lasts for this tab only
    }
    notify();
};
export const onTokensChange = (fn) => {
    listeners.add(fn);
    return () => listeners.delete(fn);
};

// Another tab changed the tokens. Only signing in or out there needs a reaction
// here; its routine refreshes just replace the tokens this tab uses.
window.addEventListener('storage', (e) => {
    if (e.key !== TOKENS_KEY && e.key !== null) return;
    const wasSignedIn = Boolean(tokens);
    tokens = readTokens();
    notify(wasSignedIn !== Boolean(tokens));
});

const send = async (path, { method = 'GET', body, signal, language }, accessToken) => {
    const headers = { Accept: 'application/json', 'Accept-Language': language ? toApiLanguage(language) : defaultLanguage };
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
    let response;
    try {
        response = await fetch(BASE + path, { method, headers, signal, body: body === undefined ? undefined : JSON.stringify(body) });
    } catch (err) {
        if (err.name === 'AbortError') throw err;
        throw new ApiError(0, 'network', 'The BILGE server could not be reached.');
    }
    if (response.status === 204) return null;
    const data = await response.json().catch(() => undefined);
    if (!response.ok) {
        const error = data?.error;
        throw new ApiError(response.status, error?.code || 'generic', error?.message || response.statusText, error?.field || null);
    }
    // e.g. index.html from a static host when VITE_API_URL was not set at build time
    if (data === undefined) throw new ApiError(response.status, 'generic', 'The server sent a response that is not JSON.');
    return data;
};

// Refresh tokens rotate and a reused one revokes the session, so only one
// refresh may run at a time, across tabs too (Web Locks where available).
let refreshing = null;
const withLock = (fn) => (navigator.locks?.request ? navigator.locks.request('bilge-auth-refresh', fn) : fn());
const refresh = (failedAccessToken) => {
    refreshing ??= withLock(async () => {
        // Storage may be blocked (private mode): fall back to the tokens held in memory
        const stored = readTokens() ?? tokens;
        if (stored && stored.accessToken !== failedAccessToken) {
            tokens = stored;
            return stored;
        }
        if (!stored?.refreshToken) return null;
        try {
            const next = await send('/auth/refresh', { method: 'POST', body: { refreshToken: stored.refreshToken } });
            setTokens(next);
            return tokens;
        } catch (err) {
            if (err.status === 401) {
                setTokens(null);
                return null;
            }
            throw err;
        }
    }).finally(() => {
        refreshing = null;
    });
    return refreshing;
};

// options: { method, body, signal, language, auth = true }
export const api = async (path, options = {}) => {
    const accessToken = options.auth === false ? null : tokens?.accessToken;
    try {
        return await send(path, options, accessToken);
    } catch (err) {
        if (!(err instanceof ApiError) || err.status !== 401 || err.code !== 'unauthorized' || !accessToken) throw err;
        // Expired access token: refresh once and retry. If the session is gone,
        // retry as a guest so public pages keep working.
        const next = await refresh(accessToken);
        return send(path, options, next?.accessToken);
    }
};
