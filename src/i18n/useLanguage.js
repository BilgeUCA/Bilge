import { useContext } from 'react';
import { LanguageContext } from './context';

export const useLanguage = () => {
    const ctx = useContext(LanguageContext);
    if (!ctx) throw new Error('useLanguage must be used inside <LanguageProvider>');
    return ctx;
};

export const useTranslation = () => {
    const { t, language } = useLanguage();
    return { t, language };
};
