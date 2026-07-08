import { ArrowRight } from 'lucide-react';
import Button from '../ui/Button';
import SectionReveal from '../ui/SectionReveal';
import { useTranslation } from '../../i18n/useLanguage';
import './HeroSection.css';

const HeroSection = () => {
    const { t } = useTranslation();

    return (
        <section className="hero" id="hero-section">
            <div className="hero__bg-pattern" />
            <div className="container hero__container">
                <SectionReveal>
                    <span className="hero__badge">
                        <span className="hero__badge-dot" />
                        {t('hero.badge')}
                    </span>
                </SectionReveal>

                <SectionReveal delay={100}>
                    <h1 className="hero__title">
                        {t('hero.titleLead')}{' '}
                        <span className="hero__title-highlight">{t('hero.titleHighlight')}</span>
                    </h1>
                </SectionReveal>

                <SectionReveal delay={200}>
                    <p className="hero__subtitle">
                        {t('hero.subtitle')}
                    </p>
                </SectionReveal>

                <SectionReveal delay={300}>
                    <div className="hero__actions">
                        <Button
                            to="/universities"
                            variant="primary"
                            size="lg"
                            icon={<ArrowRight size={18} />}
                            id="hero-explore-btn"
                        >
                            {t('hero.exploreBtn')}
                        </Button>
                    </div>
                </SectionReveal>
            </div>
        </section>
    );
};

export default HeroSection;
