import { useCallback, useEffect, useMemo, useState } from 'react';
import { ThemeContext } from './themeContext';

const STORAGE_KEY = 'bilge.theme';
const media = () => window.matchMedia('(prefers-color-scheme: dark)');

const readPinned = () => {
    try {
        const v = window.localStorage.getItem(STORAGE_KEY);
        return v === 'light' || v === 'dark' ? v : null;
    } catch {
        return null;
    }
};

// Two states: follow the system, or pin the opposite. Toggling back to what
// the system already shows clears the pin, so the site follows the OS again.
export const ThemeProvider = ({ children }) => {
    const [pinned, setPinned] = useState(readPinned);
    const [systemDark, setSystemDark] = useState(() => media().matches);

    useEffect(() => {
        const mq = media();
        const onChange = (e) => setSystemDark(e.matches);
        mq.addEventListener('change', onChange);
        return () => mq.removeEventListener('change', onChange);
    }, []);

    useEffect(() => {
        const root = document.documentElement;
        const meta = document.querySelector('meta[name="color-scheme"]');
        if (pinned) root.setAttribute('data-theme', pinned);
        else root.removeAttribute('data-theme');
        if (meta) meta.content = pinned || 'light dark';
        try {
            if (pinned) window.localStorage.setItem(STORAGE_KEY, pinned);
            else window.localStorage.removeItem(STORAGE_KEY);
        } catch {
            // Storage blocked: the choice lasts for this visit only
        }
    }, [pinned]);

    const theme = pinned || (systemDark ? 'dark' : 'light');

    const toggleTheme = useCallback(() => {
        const next = theme === 'dark' ? 'light' : 'dark';
        const system = systemDark ? 'dark' : 'light';
        setPinned(next === system ? null : next);
    }, [theme, systemDark]);

    const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);
    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
