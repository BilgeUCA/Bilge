import { Link } from 'react-router-dom';
import LoadState from '../components/ui/LoadState';
import { useApi } from '../api/useApi';
import { useTranslation } from '../i18n/useLanguage';
import './InfoPages.css';

const DOCS = { terms: 'footer.terms', privacy: 'footer.links.privacyPolicy', cookies: 'footer.cookies' };

const LegalPage = ({ doc }) => {
    const { t } = useTranslation();
    const { data: content, error, reload } = useApi(`/legal/${doc}`);

    if (!content) return <LoadState className="load-state--page" error={error} onRetry={reload} />;

    return (
        <div className="page-shell info-page">
            <div className="container info-page__narrow">
                <h1 className="info-page__title">{content.title}</h1>
                <p className="info-page__lead">{t('legal.updated')}: {content.updated}</p>
                <nav className="info-page__tabs" aria-label={t('footer.legal')}>
                    {Object.entries(DOCS).map(([key, label]) => (
                        <Link key={key} to={`/${key}`} className={`info-page__tab ${key === doc ? 'info-page__tab--active' : ''}`} aria-current={key === doc ? 'page' : undefined}>
                            {t(label)}
                        </Link>
                    ))}
                </nav>
                <div className="info-page__prose">
                    {content.sections.map((s) => (
                        <section key={s.heading}>
                            <h2>{s.heading}</h2>
                            <p>{s.body}</p>
                        </section>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LegalPage;
