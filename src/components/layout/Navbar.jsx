import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '../../i18n/useLanguage';
import './Navbar.css';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const { language, setLanguage, availableLanguages, t } = useLanguage();
    const location = useLocation();
    const langTabsRef = useRef(null);
    const langPillRef = useRef(null);
    const mobileLangPillRef = useRef(null);

    const navLinks = [
        { path: '/universities', label: t('navbar.universities') },
        { path: '/ort-prep', label: t('navbar.ortPrep') },
        { path: '/scholarships', label: t('navbar.scholarships') },
        { path: '/about', label: t('navbar.about') },
    ];

    // Update language button pill position
    const updatePillPosition = (tabsContainer, pillElement) => {
        if (!tabsContainer || !pillElement) return;

        const activeTab = tabsContainer.querySelector('[aria-selected="true"]');
        if (!activeTab) return;

        // Disable transition for snap to position
        pillElement.style.transition = 'none';
        pillElement.style.transform = `translateX(${activeTab.offsetLeft}px)`;
        pillElement.style.width = `${activeTab.offsetWidth}px`;

        // Force reflow
        void pillElement.offsetHeight;

        // Re-enable transition
        pillElement.style.transition =
            'transform 250ms cubic-bezier(0.22, 1, 0.36, 1), width 250ms cubic-bezier(0.22, 1, 0.36, 1)';
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsMobileOpen(false);
    }, [location]);

    // Initialize and update pill position for desktop
    useEffect(() => {
        updatePillPosition(langTabsRef.current, langPillRef.current);
    }, [language]);

    // Initialize and update pill position for mobile
    useEffect(() => {
        const mobileLangTabs = document.querySelector('.navbar__lang-mobile');
        updatePillPosition(mobileLangTabs, mobileLangPillRef.current);
    }, [language, isMobileOpen]);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            updatePillPosition(langTabsRef.current, langPillRef.current);
            const mobileLangTabs = document.querySelector('.navbar__lang-mobile');
            updatePillPosition(mobileLangTabs, mobileLangPillRef.current);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <header className={`navbar ${isScrolled ? 'navbar--scrolled' : ''}`} id="navbar">
            <div className="container navbar__inner">
                <Link to="/" className="navbar__logo" id="logo">
                    <span className="navbar__logo-text">BILGE</span>
                </Link>

                <nav className={`navbar__nav ${isMobileOpen ? 'navbar__nav--open' : ''}`} id="main-nav">
                    <ul className="navbar__links">
                        {navLinks.map((link) => (
                            <li key={link.path}>
                                <NavLink
                                    to={link.path}
                                    className={({ isActive }) =>
                                        `navbar__link ${isActive ? 'navbar__link--active' : ''}`
                                    }
                                    id={`nav-${link.path.slice(1)}`}
                                >
                                    {link.label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>

                    <div className="navbar__actions-mobile">
                        <div className="navbar__lang navbar__lang-mobile" role="tablist">
                            <span className="t-tabs-pill" ref={mobileLangPillRef}></span>
                            {availableLanguages.map((lang) => (
                                <button
                                    key={lang}
                                    type="button"
                                    className="t-tab navbar__lang-btn"
                                    onClick={() => setLanguage(lang)}
                                    aria-pressed={language === lang}
                                    aria-selected={language === lang}
                                    role="tab"
                                >
                                    {t('navbar.languageNames')[lang]}
                                </button>
                            ))}
                        </div>
                        <Link to="/login" className="navbar__login-btn navbar__login-btn--colored" id="login-btn-mobile">
                            {t('navbar.login')}
                        </Link>
                    </div>
                </nav>

                <div className="navbar__actions">
                    <div className="navbar__lang t-tabs" ref={langTabsRef} role="tablist">
                        <span className="t-tabs-pill" ref={langPillRef}></span>
                        {availableLanguages.map((lang) => (
                            <button
                                key={lang}
                                type="button"
                                className="t-tab navbar__lang-btn"
                                onClick={() => setLanguage(lang)}
                                aria-pressed={language === lang}
                                aria-selected={language === lang}
                                role="tab"
                            >
                                {t('navbar.languageNames')[lang]}
                            </button>
                        ))}
                    </div>
                    <Link to="/login" className="navbar__login-btn navbar__login-btn--colored" id="login-btn">
                        {t('navbar.login')}
                    </Link>
                </div>

                <button
                    className="navbar__mobile-toggle t-icon-swap"
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    aria-label="Toggle navigation menu"
                    id="mobile-toggle"
                    data-state={isMobileOpen ? 'b' : 'a'}
                >
                    <span className="t-icon" data-icon="a">
                        <Menu size={24} />
                    </span>
                    <span className="t-icon" data-icon="b">
                        <X size={24} />
                    </span>
                </button>
            </div>

            {isMobileOpen && (
                <div className="navbar__overlay" onClick={() => setIsMobileOpen(false)} />
            )}
        </header>
    );
};

export default Navbar;
