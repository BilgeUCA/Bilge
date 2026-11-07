import { useEffect, useState } from 'react';
import { api } from './client';
import { useAuth } from '../auth/authContext';
import { useTranslation } from '../i18n/useLanguage';

// Responses depend on the language and on who is signed in (isSaved, checklists)
const cache = new Map();

// GET `path` (null = skip, never loading). Refetches when the path, language or user changes.
// keepPrevious: show the last result while the next one loads (filters, paging).
export const useApi = (path, { keepPrevious = false } = {}) => {
    const { language } = useTranslation();
    const { user, ready } = useAuth();
    const key = path && ready ? `${language}|${user?.id || ''}|${path}` : null;
    const [state, setState] = useState({ key: null, data: undefined, error: null });
    const [version, setVersion] = useState(0);

    useEffect(() => {
        if (!key) return undefined;
        const controller = new AbortController();
        api(path, { signal: controller.signal, language })
            .then((data) => {
                cache.set(key, data);
                setState({ key, data, error: null });
            })
            .catch((error) => {
                if (error.name !== 'AbortError') setState((prev) => ({ key, data: prev.key === key ? prev.data : undefined, error }));
            });
        return () => controller.abort();
    }, [key, path, language, version]);

    const reload = () => setVersion((v) => v + 1);
    if (!key) return { data: undefined, error: null, loading: Boolean(path), reload };
    const settled = state.key === key;
    const data = settled ? state.data : cache.get(key) ?? (keepPrevious ? state.data : undefined);
    return {
        data,
        error: settled ? state.error : null,
        loading: !settled,
        reload,
    };
};
