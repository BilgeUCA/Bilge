import { createContext, useContext } from 'react';

export const AuthContext = createContext(null);

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
    return ctx;
};

export class AuthError extends Error {
    constructor(code) {
        super(code);
        this.code = code;
    }
}
