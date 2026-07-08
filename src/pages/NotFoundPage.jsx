import Button from '../components/ui/Button';
import { useTranslation } from '../i18n/useLanguage';
import './NotFoundPage.css';

const NotFoundPage = () => {
    const { t } = useTranslation();

    return (
        <div className="not-found">
            <div className="not-found__wrapper">
                <div className="not-found__content">
                    <div className="not-found__text-section">
                        <span className="not-found__code">404</span>
                        <h1 className="not-found__title">{t('notFound.title')}</h1>
                        <p className="not-found__description">
                            {t('notFound.description')}
                        </p>
                        <Button to="/" variant="primary" size="lg" id="go-home-btn">
                            {t('notFound.goHome')}
                        </Button>
                    </div>
                    
                    <div className="not-found__image-section">
                        <div className="not-found__image-container">
                            <img 
                                src={new URL('../assets/statue-404.png', import.meta.url).href}
                                alt="Thinking statue with laptop" 
                                className="not-found__statue"
                            />
                            <div className="not-found__glow"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
