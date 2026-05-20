import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { features } from '../../data/homeData';
import SectionReveal from '../ui/SectionReveal';
import { useTranslation } from '../../i18n/useLanguage';
import './FeaturesSection.css';

const FeaturesSection = () => {
    const { t } = useTranslation();

    return (
        <section className="features section" id="features-section">
            <div className="container">
                <div className="features__grid">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <SectionReveal key={feature.id} delay={index * 100}>
                                <div className="features__card" id={`feature-${feature.id}`}>
                                    <div className="features__icon-wrapper">
                                        <Icon size={24} strokeWidth={1.5} />
                                    </div>
                                    <h3 className="features__card-title">{t(feature.titleKey)}</h3>
                                    <p className="features__card-description">{t(feature.descriptionKey)}</p>
                                    <Link to={feature.linkPath} className="features__card-link">
                                        {t(feature.linkTextKey)}
                                        <ArrowRight size={14} />
                                    </Link>
                                </div>
                            </SectionReveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
