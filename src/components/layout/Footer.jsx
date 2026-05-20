import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../i18n/useLanguage';
import './Footer.css';

const Footer = () => {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);
    const { t } = useTranslation();

    const footerLinks = {
        resources: [
            { label: t('footer.links.universityDatabase'), path: '/universities' },
            { label: t('footer.links.ortPracticeTests'), path: '/ort-prep' },
            { label: t('footer.links.scholarshipGuide'), path: '/scholarships' },
            { label: t('footer.links.studentBlog'), path: '/blog' },
        ],
        platform: [
            { label: t('footer.links.aboutUs'), path: '/about' },
            { label: t('footer.links.contactSupport'), path: '/contact' },
            { label: t('footer.links.forUniversities'), path: '/for-universities' },
            { label: t('footer.links.privacyPolicy'), path: '/privacy' },
        ],
    };

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email.trim()) {
            setSubscribed(true);
            setEmail('');
            setTimeout(() => setSubscribed(false), 3000);
        }
    };

    return (
        <footer className="footer" id="footer">
            <div className="container">
                <div className="footer__grid">
                    <div className="footer__brand">
                        <Link to="/" className="footer__logo">
                            <span className="footer__logo-text">BILGE</span>
                        </Link>
                        <p className="footer__description">
                            {t('footer.description')}
                        </p>
                    </div>

                    <div className="footer__col">
                        <h4 className="footer__heading">{t('footer.resourcesHeading')}</h4>
                        <ul className="footer__links">
                            {footerLinks.resources.map((link) => (
                                <li key={link.path}>
                                    <Link to={link.path} className="footer__link">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="footer__col">
                        <h4 className="footer__heading">{t('footer.platformHeading')}</h4>
                        <ul className="footer__links">
                            {footerLinks.platform.map((link) => (
                                <li key={link.path}>
                                    <Link to={link.path} className="footer__link">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="footer__col footer__newsletter">
                        <h4 className="footer__heading">{t('footer.newsletterHeading')}</h4>
                        <p className="footer__newsletter-text">
                            {t('footer.newsletterText')}
                        </p>
                        <form className="footer__form" onSubmit={handleSubscribe}>
                            <input
                                type="email"
                                className="footer__input"
                                placeholder={t('footer.emailPlaceholder')}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                id="newsletter-email"
                            />
                            <button
                                type="submit"
                                className={`footer__submit-btn ${subscribed ? 'footer__submit-btn--success' : ''}`}
                                id="newsletter-submit"
                            >
                                {subscribed ? t('footer.subscribed') : t('footer.subscribe')}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="footer__bottom">
                    <p className="footer__copyright">
                        {t('footer.copyright')}
                    </p>
                    <div className="footer__bottom-links">
                        <Link to="/terms" className="footer__bottom-link">{t('footer.terms')}</Link>
                        <Link to="/cookies" className="footer__bottom-link">{t('footer.cookies')}</Link>
                        <Link to="/sitemap" className="footer__bottom-link">{t('footer.sitemap')}</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
