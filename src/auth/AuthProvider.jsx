import { useCallback, useMemo } from 'react';
import { AuthContext, AuthError } from './authContext';
import { useStoredState } from '../hooks/useStoredState';

// Local-only accounts until the Bilge backend exists: accounts live in this
// browser's localStorage and passwords are kept as a SHA-256 digest, never in
// plain text. Replace signIn/signUp with API calls when the backend lands.
const hash = async (text) => {
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
};

export const AuthProvider = ({ children }) => {
    const [accounts, setAccounts] = useStoredState('bilge.accounts', {});
    const [session, setSession] = useStoredState('bilge.session', null);

    const signIn = useCallback(
        async (email, password) => {
            const key = email.trim().toLowerCase();
            const account = accounts[key];
            if (!account) throw new AuthError('noAccount');
            if (account.passwordHash !== (await hash(password))) throw new AuthError('wrongPassword');
            setSession({ email: key, name: account.name });
        },
        [accounts, setSession]
    );

    const signUp = useCallback(
        async (name, email, password) => {
            const key = email.trim().toLowerCase();
            if (accounts[key]) throw new AuthError('exists');
            const passwordHash = await hash(password);
            setAccounts((prev) => ({ ...prev, [key]: { name: name.trim(), passwordHash } }));
            setSession({ email: key, name: name.trim() });
        },
        [accounts, setAccounts, setSession]
    );

    const signOut = useCallback(() => setSession(null), [setSession]);

    const value = useMemo(
        () => ({ user: session, signIn, signUp, signOut }),
        [session, signIn, signUp, signOut]
    );
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
