import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../i18n/useLanguage';

/**
 * Globe language switcher.
 * Shows a globe icon; hovering opens a dropdown with language options.
 * The currently-active language is marked with a checkmark.
 */
const LanguageGlobe = ({ className = '' }) => {
    const { language, setLanguage, availableLanguages, t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);
    const closeTimer = useRef(null);

    const openMenu = () => {
        clearTimeout(closeTimer.current);
        setIsOpen(true);
    };

    const scheduleClose = () => {
        closeTimer.current = setTimeout(() => setIsOpen(false), 120);
    };

    // Close on outside click
    useEffect(() => {
        const handleClick = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    // Close on Escape
    useEffect(() => {
        const handleKey = (e) => { if (e.key === 'Escape') setIsOpen(false); };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, []);

    // Cleanup timer on unmount
    useEffect(() => () => clearTimeout(closeTimer.current), []);

    const languageNames = t('navbar.languageNames');

    return (
        <div
            className={`lang-globe ${isOpen ? 'lang-globe--open' : ''} ${className}`}
            ref={containerRef}
            onMouseEnter={openMenu}
            onMouseLeave={scheduleClose}
        >
            {/* Trigger: globe SVG */}
            <button
                type="button"
                className="lang-globe__trigger"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-label="Change language"
                onClick={() => setIsOpen((v) => !v)}
            >
                {/* Inline globe SVG */}
                <svg
                    className="lang-globe__icon"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2a14.5 14.5 0 0 0 0 20M12 2a14.5 14.5 0 0 1 0 20" />
                    <path d="M2 12h20" />
                </svg>
                <span className="lang-globe__current">{language}</span>
            </button>

            {/* Dropdown */}
            <div className="lang-globe__dropdown" role="listbox" aria-label="Language">
                {availableLanguages.map((lang) => (
                    <button
                        key={lang}
                        type="button"
                        role="option"
                        aria-selected={language === lang}
                        className={`lang-globe__option ${language === lang ? 'lang-globe__option--active' : ''}`}
                        onClick={() => { setLanguage(lang); setIsOpen(false); }}
                        onMouseEnter={openMenu}
                        onMouseLeave={scheduleClose}
                    >
                        <span className="lang-globe__option-name">
                            {languageNames?.[lang] ?? lang}
                        </span>
                        {language === lang && (
                            <svg
                                className="lang-globe__check"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <polyline points="3 8 6.5 11.5 13 5" />
                            </svg>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default LanguageGlobe;
