import { useState, useEffect, useRef } from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../../i18n/useLanguage';

// Compact language switcher: a globe+label button that opens a dropdown on click.
const LanguageTabs = ({ className = '' }) => {
    const { language, setLanguage, availableLanguages, t } = useLanguage();
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef(null);

    // Close the dropdown when clicking outside
    useEffect(() => {
        if (!open) return undefined;
        const handleClick = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        const handleKey = (e) => e.key === 'Escape' && setOpen(false);
        document.addEventListener('mousedown', handleClick);
        document.addEventListener('keydown', handleKey);
        return () => {
            document.removeEventListener('mousedown', handleClick);
            document.removeEventListener('keydown', handleKey);
        };
    }, [open]);

    const languageNames = t('navbar.languageNames');

    return (
        <div
            className={`lang-dropdown ${className}`}
            ref={wrapperRef}
        >
            <button
                type="button"
                className="lang-dropdown__trigger"
                onClick={() => setOpen((prev) => !prev)}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-label="Select language"
            >
                <Globe size={15} aria-hidden="true" />
                <span>{languageNames[language] ?? language}</span>
            </button>

            {open && (
                <ul className="lang-dropdown__menu" role="listbox" aria-label="Language">
                    {availableLanguages.map((lang) => (
                        <li key={lang} role="option" aria-selected={language === lang}>
                            <button
                                type="button"
                                className={`lang-dropdown__option ${language === lang ? 'lang-dropdown__option--active' : ''}`}
                                onClick={() => {
                                    setLanguage(lang);
                                    setOpen(false);
                                }}
                            >
                                {languageNames[lang] ?? lang}
                                {language === lang && (
                                    <span className="lang-dropdown__check" aria-hidden="true">✓</span>
                                )}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default LanguageTabs;
