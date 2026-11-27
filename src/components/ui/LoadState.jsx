import { useTranslation } from '../../i18n/useLanguage';

// Placeholder while API data loads, or the error with a retry button
const LoadState = ({ error, onRetry, className = '' }) => {
    const { t } = useTranslation();
    if (error) {
        return (
            <div className={`load-state ${className}`} role="alert">
                <p>{t(error.code === 'network' ? 'common.offline' : 'common.loadError')}</p>
                {onRetry && (
                    <button type="button" className="btn btn--secondary btn--sm" onClick={onRetry}>
                        {t('common.retry')}
                    </button>
                )}
            </div>
        );
    }
    return (
        <div className={`load-state ${className}`} aria-busy="true">
            <p>{t('common.loading')}</p>
        </div>
    );
};

export default LoadState;
