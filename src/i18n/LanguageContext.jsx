import { useCallback, useEffect, useMemo, useState } from 'react';
import translations, { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from './translations';
import { LanguageContext } from './context';

const STORAGE_KEY = 'bilge.lang';

const readInitialLanguage = () => {
    if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved && SUPPORTED_LANGUAGES.includes(saved)) return saved;
    return DEFAULT_LANGUAGE;
};

const lookup = (dict, key) => {
    if (!dict) return undefined;
    const parts = key.split('.');
    let cursor = dict;
    for (const part of parts) {
        if (cursor && typeof cursor === 'object' && part in cursor) {
            cursor = cursor[part];
        } else {
            return undefined;
        }
    }
    return cursor;
};

export const LanguageProvider = ({ children }) => {
    const [language, setLanguageState] = useState(readInitialLanguage);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        window.localStorage.setItem(STORAGE_KEY, language);
        document.documentElement.setAttribute(
            'lang',
            language === 'EN' ? 'en' : language === 'RU' ? 'ru' : 'ky'
        );
    }, [language]);

    const setLanguage = useCallback((next) => {
        if (SUPPORTED_LANGUAGES.includes(next)) {
            setLanguageState(next);
        }
    }, []);

    const t = useCallback(
        (key, fallback) => {
            const value = lookup(translations[language], key);
            if (value !== undefined) return value;
            const enValue = lookup(translations.EN, key);
            if (enValue !== undefined) return enValue;
            return fallback !== undefined ? fallback : key;
        },
        [language]
    );

    const value = useMemo(
        () => ({
            language,
            setLanguage,
            t,
            availableLanguages: SUPPORTED_LANGUAGES,
        }),
        [language, setLanguage, t]
    );

    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};
