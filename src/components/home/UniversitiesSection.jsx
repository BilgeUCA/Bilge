import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { universities } from '../../data/homeData';
import SectionReveal from '../ui/SectionReveal';
import { useTranslation } from '../../i18n/useLanguage';
import './UniversitiesSection.css';

const universityLogos = {
    auca: (
        <svg viewBox="0 0 100 100" width="80" height="80">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#1B6B4A" strokeWidth="3" />
            <circle cx="50" cy="50" r="38" fill="none" stroke="#1B6B4A" strokeWidth="1.5" />
            <text x="50" y="45" textAnchor="middle" fill="#1B6B4A" fontSize="24" fontWeight="700" fontFamily="serif">AUCA</text>
            <text x="50" y="62" textAnchor="middle" fill="#1B6B4A" fontSize="7" fontWeight="500" fontFamily="sans-serif" letterSpacing="1">AMERICAN UNIVERSITY</text>
            <text x="50" y="72" textAnchor="middle" fill="#1B6B4A" fontSize="7" fontWeight="500" fontFamily="sans-serif" letterSpacing="1">OF CENTRAL ASIA</text>
        </svg>
    ),
    ktmu: (
        <svg viewBox="0 0 120 60" width="100" height="50">
            <text x="60" y="28" textAnchor="middle" fill="#374151" fontSize="20" fontWeight="700" fontFamily="serif" letterSpacing="3">MANAS</text>
            <line x1="20" y1="35" x2="100" y2="35" stroke="#374151" strokeWidth="1" />
            <text x="60" y="48" textAnchor="middle" fill="#6B7280" fontSize="5.5" fontWeight="500" fontFamily="sans-serif" letterSpacing="1.5">KYRGYZ-TURKISH</text>
            <text x="60" y="56" textAnchor="middle" fill="#6B7280" fontSize="5.5" fontWeight="500" fontFamily="sans-serif" letterSpacing="1.5">MANAS UNIVERSITY</text>
        </svg>
    ),
    'ala-too': (
        <svg viewBox="0 0 100 80" width="90" height="70">
            <text x="50" y="35" textAnchor="middle" fill="#065F46" fontSize="22" fontWeight="700" fontFamily="serif" fontStyle="italic">Ala-Too</text>
            <line x1="15" y1="42" x2="85" y2="42" stroke="#065F46" strokeWidth="0.8" />
            <text x="50" y="55" textAnchor="middle" fill="#065F46" fontSize="5" fontWeight="500" fontFamily="sans-serif" letterSpacing="2">INTERNATIONAL</text>
            <text x="50" y="63" textAnchor="middle" fill="#065F46" fontSize="5" fontWeight="500" fontFamily="sans-serif" letterSpacing="2">UNIVERSITY</text>
            {/* Leaf motif */}
            <path d="M48 68 Q50 74 52 68 Q50 72 48 68" fill="#065F46" opacity="0.6" />
        </svg>
    ),
};

const UniversitiesSection = () => {
    const { t } = useTranslation();

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
                    {universities.map((uni, index) => (
                        <SectionReveal key={uni.id} delay={index * 120}>
                            <Link
                                to={`/universities/${uni.id}`}
                                className="university-card"
                                id={`university-${uni.id}`}
                            >
                                <div className="university-card__score">
                                    {t('universitiesSection.scorePrefix')} {uni.score}
                                </div>

                                <div
                                    className="university-card__logo-area"
                                    style={{ backgroundColor: uni.logoBg }}
                                >
                                    <div className="university-card__logo">
                                        {universityLogos[uni.id]}
                                    </div>
                                </div>

                                <div className="university-card__content">
                                    <div className="university-card__info">
                                        <h3 className="university-card__name">{uni.name}</h3>
                                        {uni.subtitle && (
                                            <p className="university-card__subtitle">{uni.subtitle}</p>
                                        )}
                                        {uni.fullName && !uni.subtitle && (
                                            <p className="university-card__subtitle">{uni.fullName}</p>
                                        )}
                                    </div>

                                    <div className="university-card__location">
                                        <MapPin size={14} />
                                        <span>{uni.location}</span>
                                    </div>

                                    <div className="university-card__tags">
                                        {uni.tags.map((tag) => (
                                            <span key={tag} className="university-card__tag">
                                                {tag}
                                            </span>
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
