import { Link } from 'react-router-dom';
import { useTranslation } from '../../i18n/useLanguage';
import './Footer.css';

const Footer = () => {
    const { t } = useTranslation();

    const footerLinks = {
        resources: [
            { label: t('footer.links.universityDatabase'), path: '/universities' },
            { label: t('footer.links.scholarshipGuide'), path: '/scholarships' },
            { label: t('footer.links.studentBlog'), path: '/blog' },
        ],
        platform: [
            { label: t('footer.links.aboutUs'), path: '/about' },
            { label: t('footer.links.contactSupport'), path: '/contact' },
            { label: t('footer.links.forUniversities'), path: '/for-universities' },
        ],
        legal: [
            { label: t('footer.terms'), path: '/terms' },
            { label: t('footer.cookies'), path: '/cookies' },
            { label: t('footer.links.privacyPolicy'), path: '/privacy' },
            { label: t('footer.sitemap'), path: '/sitemap' },
        ],
    };

    return (
        <footer className="footer" id="footer">
            <div className="container">
                <div className="footer__top">
                    <div className="footer__brand">
                        <Link to="/" className="footer__logo">
                            <span className="footer__logo-text">BILGE</span>
                        </Link>
                        <p className="footer__description">
                            {t('footer.description')}
                        </p>
                    </div>

                    <div className="footer__columns">
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

                        <div className="footer__col">
                            <h4 className="footer__heading">{t('footer.legal', 'Legal')}</h4>
                            <ul className="footer__links">
                                {footerLinks.legal.map((link) => (
                                    <li key={link.path}>
                                        <Link to={link.path} className="footer__link">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="footer__bottom">
                    <p className="footer__copyright">
                        {t('footer.copyright')}
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
