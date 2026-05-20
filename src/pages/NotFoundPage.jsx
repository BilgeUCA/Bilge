import Button from '../components/ui/Button';
import { useTranslation } from '../i18n/useLanguage';
import './NotFoundPage.css';

const NotFoundPage = () => {
    const { t } = useTranslation();

    return (
        <div className="not-found">
            <div className="container not-found__container">
                <span className="not-found__code">404</span>
                <h1 className="not-found__title">{t('notFound.title')}</h1>
                <p className="not-found__description">
                    {t('notFound.description')}
                </p>
                <Button to="/" variant="primary" size="lg" id="go-home-btn">
                    {t('notFound.goHome')}
                </Button>
            </div>
        </div>
    );
};

export default NotFoundPage;
