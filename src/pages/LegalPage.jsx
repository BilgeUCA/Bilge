import { Link } from 'react-router-dom';
import { legalDocs } from '../data/legal';
import { useTranslation } from '../i18n/useLanguage';
import './InfoPages.css';

const LegalPage = ({ doc }) => {
    const { t } = useTranslation();
    const content = legalDocs[doc];

    return (
        <div className="page-shell info-page">
            <div className="container info-page__narrow">
                <h1 className="info-page__title">{content.title}</h1>
                <p className="info-page__lead">{t('legal.updated')}: {content.updated}</p>
                <nav className="info-page__tabs" aria-label={t('footer.legal')}>
                    {Object.entries(legalDocs).map(([key, d]) => (
                        <Link key={key} to={`/${key}`} className={`info-page__tab ${key === doc ? 'info-page__tab--active' : ''}`} aria-current={key === doc ? 'page' : undefined}>
                            {d.title}
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
