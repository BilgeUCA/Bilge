import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useTranslation } from '../../i18n/useLanguage';
import { useAuth } from '../../auth/authContext';
import LanguageTabs from '../ui/LanguageTabs';
import ThemeToggle from '../ui/ThemeToggle';
import './Navbar.css';

const initialsOf = (name = '') =>
    name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join('') || '?';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const { t } = useTranslation();
    const { user } = useAuth();
    const location = useLocation();

    const navLinks = [
        { path: '/universities', label: t('navbar.universities') },
        { path: '/ort-prep', label: t('navbar.ortPrep') },
        { path: '/scholarships', label: t('navbar.scholarships') },
        { path: '/about', label: t('navbar.about') },
    ];

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close the drawer on navigation (state adjusted during render, not in an effect)
    const [lastPath, setLastPath] = useState(location.pathname);
    if (lastPath !== location.pathname) {
        setLastPath(location.pathname);
        setIsMobileOpen(false);
    }

    // While the drawer is open: lock page scroll, close on Escape,
    // and close automatically if the viewport grows past the mobile breakpoint
    useEffect(() => {
        if (!isMobileOpen) return undefined;
        const onKey = (e) => e.key === 'Escape' && setIsMobileOpen(false);
        const mq = window.matchMedia('(min-width: 869px)');
        const onResize = (e) => e.matches && setIsMobileOpen(false);
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', onKey);
        mq.addEventListener('change', onResize);
        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', onKey);
            mq.removeEventListener('change', onResize);
        };
    }, [isMobileOpen]);

    const accountLink = (extraClass = '') =>
        user ? (
            <Link to="/account" className={`navbar__user ${extraClass}`} title={user.email}>
                <span className="navbar__user-avatar" aria-hidden="true">{initialsOf(user.name)}</span>
                <span className="navbar__user-name">{user.name.split(' ')[0]}</span>
            </Link>
        ) : (
            <Link to="/login" className={`navbar__login-btn navbar__login-btn--colored ${extraClass}`}>
                {t('navbar.login')}
            </Link>
        );

    const renderLinks = (className) => (
        <ul className={className}>
            {navLinks.map((link) => (
                <li key={link.path}>
                    <NavLink
                        to={link.path}
                        className={({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`}
                    >
                        {link.label}
                    </NavLink>
                </li>
            ))}
        </ul>
    );

    return (
        <>
            <header className={`navbar ${isScrolled ? 'navbar--scrolled' : ''}`} id="navbar">
                <div className="container navbar__inner">
                    <Link to="/" className="navbar__logo" id="logo">
                        <span className="navbar__logo-text">BILGE</span>
                    </Link>

                    <nav className="navbar__nav" aria-label={t('navbar.mainNav')}>
                        {renderLinks('navbar__links')}
                    </nav>

                    <div className="navbar__actions">
                        <LanguageTabs />
                        <ThemeToggle />
                        {accountLink()}
                    </div>

                    <button
                        type="button"
                        className="navbar__mobile-toggle t-icon-swap"
                        onClick={() => setIsMobileOpen((open) => !open)}
                        aria-label={isMobileOpen ? t('navbar.closeMenu') : t('navbar.openMenu')}
                        aria-expanded={isMobileOpen}
                        aria-controls="mobile-menu"
                        id="mobile-toggle"
                        data-state={isMobileOpen ? 'b' : 'a'}
                    >
                        <span className="t-icon" data-icon="a" aria-hidden="true">
                            <Menu size={24} />
                        </span>
                        <span className="t-icon" data-icon="b" aria-hidden="true">
                            <X size={24} />
                        </span>
                    </button>
                </div>
            </header>

            {/* The drawer lives outside <header>: the header's backdrop-filter would
                otherwise become the containing block for these fixed elements */}
            <div
                className={`navbar__overlay ${isMobileOpen ? 'navbar__overlay--visible' : ''}`}
                onClick={() => setIsMobileOpen(false)}
                aria-hidden="true"
            />
            <nav
                id="mobile-menu"
                className={`navbar__drawer ${isMobileOpen ? 'navbar__drawer--open' : ''}`}
                aria-label={t('navbar.mainNav')}
                inert={!isMobileOpen}
            >
                {renderLinks('navbar__drawer-links')}
                <div className="navbar__drawer-footer">
                    <LanguageTabs className="navbar__lang--full" />
                    <ThemeToggle showLabel />
                    {accountLink('navbar__drawer-cta')}
                </div>
            </nav>
        </>
    );
};

export default Navbar;
