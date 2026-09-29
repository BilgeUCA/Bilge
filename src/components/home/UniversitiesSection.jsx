import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { getUniversity } from '../../data/universities';
import SectionReveal from '../ui/SectionReveal';
import UniLogo from '../ui/UniLogo';
import { useTranslation } from '../../i18n/useLanguage';
import './UniversitiesSection.css';

const FEATURED = ['auca', 'manas', 'ala-too'];

const UniversitiesSection = () => {
    const { t } = useTranslation();
    const featured = FEATURED.map(getUniversity);

    return (
        <section className="universities section" id="universities-section">
            <div className="container">
                <SectionReveal>
                    <div className="universities__header">
                        <h2 className="universities__title">{t('universitiesSection.featured')}</h2>
                        <Link to="/universities" className="universities__view-all">
                            {t('universitiesSection.viewAll')}
                        </Link>
                    </div>
                </SectionReveal>

                <div className="universities__grid">
                    {featured.map((uni, index) => (
                        <SectionReveal key={uni.id} delay={index * 120}>
                            <Link to={`/universities/${uni.id}`} className="university-card" id={`university-${uni.id}`}>
                                {uni.ortScore && (
                                    <div className="university-card__score">
                                        ORT ≈ {uni.ortScore}+
                                    </div>
                                )}

                                <div className="university-card__logo-area">
                                    {uni.photo && <img className="university-card__photo" src={uni.photo} alt="" loading="lazy" />}
                                    <UniLogo className="university-card__logo" src={uni.logo} name={uni.name} shortName={uni.shortName} color={uni.color} />
                                </div>

                                <div className="university-card__content">
                                    <div className="university-card__info">
                                        <h3 className="university-card__name">{uni.shortName}</h3>
                                        <p className="university-card__subtitle">{uni.name}</p>
                                    </div>

                                    <div className="university-card__location">
                                        <MapPin size={14} aria-hidden="true" />
                                        <span>{uni.city}, {t(`universitiesPage.countries.${uni.country}`)}</span>
                                    </div>

                                    <div className="university-card__tags">
                                        <span className="university-card__tag">{t(`universitiesPage.types.${uni.type}`)}</span>
                                        {uni.tuitionUsd === 0 && <span className="university-card__tag">{t('universitiesPage.tuition.free')}</span>}
                                        {uni.languages.slice(0, 2).map((l) => (
                                            <span key={l} className="university-card__tag">{t(`universitiesPage.languages.${l}`)}</span>
                                        ))}
                                    </div>
                                </div>
                            </Link>
                        </SectionReveal>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default UniversitiesSection;
