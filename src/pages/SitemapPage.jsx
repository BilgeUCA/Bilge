import { Link } from 'react-router-dom';
import { useTranslation } from '../i18n/useLanguage';
import { useApi } from '../api/useApi';
import './InfoPages.css';

const SitemapPage = () => {
    const { t } = useTranslation();
    const universities = useApi('/universities?pageSize=50').data?.items ?? [];
    const scholarships = useApi('/scholarships').data?.items ?? [];

    const groups = [
        {
            title: t('sitemap.main'),
            links: [
                { to: '/', label: t('sitemap.home') },
                { to: '/universities', label: t('navbar.universities') },
                { to: '/scholarships', label: t('navbar.scholarships') },
                { to: '/ort-prep', label: t('navbar.ortPrep') },
                { to: '/ort-prep?tab=practice', label: t('ort.tabs.practice') },
                { to: '/about', label: t('navbar.about') },
                { to: '/contact', label: t('footer.links.contactSupport') },
                { to: '/login', label: t('navbar.login') },
                { to: '/signup', label: t('auth.createAccount') },
            ],
        },
        {
            title: t('navbar.universities'),
            links: universities.map((u) => ({ to: `/universities/${u.id}`, label: u.name })),
        },
        {
            title: t('navbar.scholarships'),
            links: scholarships.map((s) => ({ to: `/scholarships/${s.id}`, label: s.name })),
        },
        {
            title: t('footer.legal'),
            links: [
                { to: '/terms', label: t('footer.terms') },
                { to: '/privacy', label: t('footer.links.privacyPolicy') },
                { to: '/cookies', label: t('footer.cookies') },
            ],
        },
    ];

    return (
        <div className="page-shell info-page">
            <div className="container">
                <h1 className="info-page__title">{t('footer.sitemap')}</h1>
                <div className="sitemap">
                    {groups.map((g) => (
                        <section key={g.title}>
                            <h2 className="sitemap__title">{g.title}</h2>
                            <ul className="sitemap__list">
                                {g.links.map((l) => (
                                    <li key={l.to}><Link to={l.to}>{l.label}</Link></li>
                                ))}
                            </ul>
                        </section>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SitemapPage;
