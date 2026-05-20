import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '../../i18n/useLanguage';
import './Navbar.css';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const { language, setLanguage, availableLanguages, t } = useLanguage();
    const location = useLocation();

    const navLinks = [
        { path: '/universities', label: t('navbar.universities') },
        { path: '/ort-prep', label: t('navbar.ortPrep') },
        { path: '/scholarships', label: t('navbar.scholarships') },
        { path: '/about', label: t('navbar.about') },
    ];

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
                        <div className="navbar__lang">
                            {availableLanguages.map((lang) => (
                                <button
                                    key={lang}
                                    type="button"
                                    className={`navbar__lang-btn ${language === lang ? 'navbar__lang-btn--active' : ''}`}
                                    onClick={() => setLanguage(lang)}
                                    aria-pressed={language === lang}
                                >
                                    {lang}
                                </button>
                            ))}
                        </div>
                        <Link to="/login" className="navbar__login-btn" id="login-btn-mobile">
                            {t('navbar.login')}
                        </Link>
                        <Link to="/get-started" className="navbar__cta-btn" id="get-started-btn-mobile">
                            {t('navbar.getStarted')}
                        </Link>
                    </div>
                </nav>

                <div className="navbar__actions">
                    <div className="navbar__lang">
                        {availableLanguages.map((lang) => (
                            <button
                                key={lang}
                                type="button"
                                className={`navbar__lang-btn ${language === lang ? 'navbar__lang-btn--active' : ''}`}
                                onClick={() => setLanguage(lang)}
                                aria-pressed={language === lang}
                            >
                                {lang}
                            </button>
                        ))}
                    </div>
                    <Link to="/login" className="navbar__login-btn" id="login-btn">
                        {t('navbar.login')}
                    </Link>
                    <Link to="/get-started" className="navbar__cta-btn" id="get-started-btn">
                        {t('navbar.getStarted')}
                    </Link>
                </div>

                <button
                    className="navbar__mobile-toggle"
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    aria-label="Toggle navigation menu"
                    id="mobile-toggle"
                >
                    {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {isMobileOpen && (
                <div className="navbar__overlay" onClick={() => setIsMobileOpen(false)} />
            )}
        </header>
    );
};

export default Navbar;
