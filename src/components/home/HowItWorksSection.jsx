import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { howItWorks } from '../../data/homeData';
import SectionReveal from '../ui/SectionReveal';
import { useTranslation } from '../../i18n/useLanguage';
import './HowItWorksSection.css';

const HowItWorksSection = () => {
    const { t } = useTranslation();

    return (
        <section className="how-it-works section" id="how-it-works-section">
            <div className="container">
                <SectionReveal>
                    <div className="how-it-works__header">
                        <div>
                            <h2 className="how-it-works__title">{t('howItWorks.title')}</h2>
                            <p className="how-it-works__subtitle">
                                {t('howItWorks.subtitle')}
                            </p>
                        </div>
                        <Link to="/universities" className="how-it-works__guide-link">
                            {t('howItWorks.readGuide')}
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </SectionReveal>

                <div className="how-it-works__steps">
                    {howItWorks.map((item, index) => (
                        <SectionReveal key={item.step} delay={index * 150}>
                            <div className="how-it-works__step" id={`step-${item.step}`}>
                                <div className="how-it-works__step-number-wrapper">
                                    <span className="how-it-works__step-number">{item.step}</span>
                                    {index < howItWorks.length - 1 && (
                                        <div className="how-it-works__step-line" />
                                    )}
                                </div>
                                <h3 className="how-it-works__step-title">{t(item.titleKey)}</h3>
                                <p className="how-it-works__step-description">{t(item.descriptionKey)}</p>
                            </div>
                        </SectionReveal>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorksSection;
