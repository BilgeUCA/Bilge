import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AuthContext } from './authContext';
import { api, fromApiLanguage, getTokens, onTokensChange, setTokens, toApiLanguage } from '../api/client';
import { clearLocalData, collectLocalData } from '../api/localData';
import { loadSaved } from '../api/savedStore';
import { useLanguage } from '../i18n/useLanguage';
import { useTheme } from '../theme/themeContext';

// Accounts from the local-only version held SHA-256 password digests; drop them
try {
    window.localStorage.removeItem('bilge.accounts');
    window.localStorage.removeItem('bilge.session');
} catch {
    // Storage blocked: nothing stored
}

const post = (path, body) => api(path, { method: 'POST', body, auth: false });

export const AuthProvider = ({ children }) => {
    const { language, setLanguage } = useLanguage();
    const { pinned, setPinned } = useTheme();
    const [user, setUser] = useState(null);
    // Until a stored session has been checked, pages should not treat the visitor as a guest
    const [ready, setReady] = useState(() => !getTokens());
    const synced = useRef(null); // preferences last known to be on the server

    // Signing in on a device takes the account's language and theme
    const adopt = useCallback(
        (account) => {
            const { language: lang, theme } = account.preferences;
            synced.current = { language: lang, theme };
            const ui = fromApiLanguage(lang);
            if (ui) setLanguage(ui);
            setPinned(theme ?? null);
            setUser(account);
        },
        [setLanguage, setPinned]
    );

    const restore = useCallback(
        () =>
            api('/auth/me')
                .then(({ user: account }) => adopt(account))
                // 401: the client already dropped the tokens. Network: stay signed out for now.
                .catch(() => {})
                .finally(() => setReady(true)),
        [adopt]
    );

    useEffect(() => {
        if (getTokens()) restore();
        return onTokensChange((tokens, external) => {
            if (!tokens) setUser(null);
            else if (external) restore(); // signed in from another tab
        });
    }, [restore]);

    useEffect(() => {
        loadSaved(user?.id ?? null);
    }, [user?.id]);

    // Keep the account's preferences in step with the UI
    useEffect(() => {
        if (!user) return;
        const next = { language: toApiLanguage(language), theme: pinned };
        if (synced.current?.language === next.language && synced.current?.theme === next.theme) return;
        synced.current = next;
        api('/me/preferences', { method: 'PATCH', body: next }).catch(() => {
            synced.current = null;
        });
    }, [user, language, pinned]);

    const finish = useCallback(
        async ({ user: account, tokens }, { isNew = false } = {}) => {
            setTokens(tokens);
            try {
                const { keys, payload } = collectLocalData();
                if (payload) await api('/me/import', { method: 'POST', body: payload });
                clearLocalData(keys);
            } catch {
                // Keep this browser's data and try again on the next sign-in
            }
            if (isNew) {
                synced.current = null; // a new account takes this device's preferences
                setUser(account);
            } else {
                adopt(account);
            }
        },
        [adopt]
    );

    const signIn = useCallback(async (email, password) => finish(await post('/auth/login', { email, password })), [finish]);

    const signUp = useCallback(
        async (name, email, password) => finish(await post('/auth/register', { name, email, password }), { isNew: true }),
        [finish]
    );

    const signOut = useCallback(async () => {
        const tokens = getTokens();
        try {
            if (tokens) await api('/auth/logout', { method: 'POST', body: { refreshToken: tokens.refreshToken }, signal: AbortSignal.timeout(5000) });
        } catch {
            // The session expires on its own; sign out locally regardless
        } finally {
            setTokens(null);
            setUser(null);
        }
    }, []);

    const requestReset = useCallback((email) => post('/auth/forgot-password', { email }), []);
    const completeReset = useCallback(async (token, password) => finish(await post('/auth/reset-password', { token, password })), [finish]);

    const deleteAccount = useCallback(async (password) => {
        await api('/me', { method: 'DELETE', body: { password } });
        setTokens(null);
        setUser(null);
    }, []);

    const value = useMemo(
        () => ({ user, ready, signIn, signUp, signOut, requestReset, completeReset, deleteAccount }),
        [user, ready, signIn, signUp, signOut, requestReset, completeReset, deleteAccount]
    );
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
