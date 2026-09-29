import { useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../theme/themeContext';
import { useTranslation } from '../../i18n/useLanguage';
import './ThemeToggle.css';

const ThemeToggle = ({ showLabel = false }) => {
    const { theme, toggleTheme } = useTheme();
    const { t } = useTranslation();
    // .is-init is only added after the first interaction so the "off"
    // keyframes don't play on page load
    const [hasInteracted, setHasInteracted] = useState(false);
    const isDark = theme === 'dark';

    const handleClick = () => {
        setHasInteracted(true);
        toggleTheme();
    };

    return (
        <div className="theme-toggle">
            {showLabel && (
                <span className="theme-toggle__label" id="theme-toggle-label">
                    {t('theme.darkMode')}
                </span>
            )}
            <button
                type="button"
                role="switch"
                aria-checked={isDark}
                aria-label={showLabel ? undefined : t('theme.darkMode')}
                aria-labelledby={showLabel ? 'theme-toggle-label' : undefined}
                title={isDark ? t('theme.switchToLight') : t('theme.switchToDark')}
                className={`t-toggle ${hasInteracted ? 'is-init' : ''}`}
                data-on={isDark ? 'true' : 'false'}
                onClick={handleClick}
            >
                <span className="t-toggle-thumb">
                    {isDark ? <Moon size={10} strokeWidth={2.5} /> : <Sun size={10} strokeWidth={2.5} />}
                </span>
            </button>
        </div>
    );
};

export default ThemeToggle;
