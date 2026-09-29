import { useEffect, useLayoutEffect, useRef } from 'react';
import { useLanguage } from '../../i18n/useLanguage';

const PILL_TRANSITION =
    'transform 250ms cubic-bezier(0.22, 1, 0.36, 1), width 250ms cubic-bezier(0.22, 1, 0.36, 1)';

// Segmented language switcher with a sliding pill behind the active tab.
// The pill snaps on mount/resize and animates only when the language changes.
const LanguageTabs = ({ className = '' }) => {
    const { language, setLanguage, availableLanguages, t } = useLanguage();
    const tabsRef = useRef(null);
    const pillRef = useRef(null);
    const hasMounted = useRef(false);

    const place = (animate) => {
        const tabs = tabsRef.current;
        const pill = pillRef.current;
        if (!tabs || !pill) return;
        const active = tabs.querySelector('[aria-selected="true"]');
        if (!active) return;
        if (!animate) pill.style.transition = 'none';
        pill.style.transform = `translateX(${active.offsetLeft}px)`;
        pill.style.width = `${active.offsetWidth}px`;
        if (!animate) {
            void pill.offsetHeight; // force reflow before re-enabling the transition
            pill.style.transition = PILL_TRANSITION;
        }
    };

    useLayoutEffect(() => {
        place(hasMounted.current);
        hasMounted.current = true;
    }, [language]);

    // Re-snap when the container resizes (fonts loading, drawer layout, window resize)
    useEffect(() => {
        const tabs = tabsRef.current;
        if (!tabs) return undefined;
        const observer = new ResizeObserver(() => place(false));
        observer.observe(tabs);
        return () => observer.disconnect();
    }, []);

    return (
        <div className={`navbar__lang t-tabs ${className}`} ref={tabsRef} role="tablist" aria-label="Language">
            <span className="t-tabs-pill" ref={pillRef} aria-hidden="true" />
            {availableLanguages.map((lang) => (
                <button
                    key={lang}
                    type="button"
                    className="t-tab navbar__lang-btn"
                    onClick={() => setLanguage(lang)}
                    aria-selected={language === lang}
                    role="tab"
                >
                    {t('navbar.languageNames')[lang]}
                </button>
            ))}
        </div>
    );
};

export default LanguageTabs;
