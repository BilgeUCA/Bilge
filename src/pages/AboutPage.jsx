import { Users, Target, Heart, Mail } from 'lucide-react';
import Button from '../components/ui/Button';
import SectionReveal from '../components/ui/SectionReveal';
import { useTranslation } from '../i18n/useLanguage';
import './AboutPage.css';

const values = [
    { icon: Target, titleKey: 'accessibilityTitle', descKey: 'accessibilityDesc' },
    { icon: Users, titleKey: 'communityTitle', descKey: 'communityDesc' },
    { icon: Heart, titleKey: 'empowermentTitle', descKey: 'empowermentDesc' },
];

const stats = [
    { value: '50+', labelKey: 'universities' },
    { value: '10K+', labelKey: 'students' },
    { value: '200+', labelKey: 'scholarships' },
    { value: '15+', labelKey: 'partners' },
];

const team = [
    { name: 'Kairat Kubatov', roleKey: 'Founder & CEO', initials: 'KK' },
    { name: 'Asylbek Zhunusov', roleKey: 'Backend Developer', initials: 'AZ' },
    { name: 'Aizhigit Zhigitekov', roleKey: 'Backend Developer', initials: 'AZ' },
    { name: 'Emir Sakiev', roleKey: 'Frontend Developer', initials: 'ES' },
];

const AboutPage = () => {
    const { t } = useTranslation();

    return (
        <div className="about-page">
            <section className="about-page__hero">
                <div className="container">
                    <SectionReveal>
                        <h1 className="about-page__title">{t('about.title')}</h1>
                        <p className="about-page__subtitle">
                            {t('about.subtitle')}
                        </p>
                    </SectionReveal>
                </div>
            </section>

            <section className="about-page__stats section">
                <div className="container">
                    <div className="about-page__stats-grid">
                        {stats.map((stat, index) => (
                            <SectionReveal key={stat.labelKey} delay={index * 100}>
                                <div className="about-stat-card">
                                    <span className="about-stat-card__value">{stat.value}</span>
                                    <span className="about-stat-card__label">
                                        {t(`about.statValues.${stat.labelKey}`)}
                                    </span>
                                </div>
                            </SectionReveal>
                        ))}
                    </div>
                </div>
            </section>

            <section className="about-page__values section">
                <div className="container">
                    <SectionReveal>
                        <h2 className="about-page__section-title">{t('about.ourValues')}</h2>
                    </SectionReveal>
                    <div className="about-page__values-grid">
                        {values.map((value, index) => {
                            const Icon = value.icon;
                            return (
                                <SectionReveal key={value.titleKey} delay={index * 120}>
                                    <div className="about-value-card">
                                        <div className="about-value-card__icon">
                                            <Icon size={24} />
                                        </div>
                                        <h3 className="about-value-card__title">
                                            {t(`about.valuesData.${value.titleKey}`)}
                                        </h3>
                                        <p className="about-value-card__description">
                                            {t(`about.valuesData.${value.descKey}`)}
                                        </p>
                                    </div>
                                </SectionReveal>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="about-page__team section">
                <div className="container">
                    <SectionReveal>
                        <h2 className="about-page__section-title">{t('about.ourTeam')}</h2>
                        <p className="about-page__section-subtitle">
                            {t('about.teamSubtitle')}
                        </p>
                    </SectionReveal>
                    <div className="about-page__team-grid">
                        {team.map((member, index) => (
                            <SectionReveal key={member.name} delay={index * 100}>
                                <div className="about-team-card">
                                    <div className="about-team-card__avatar">
                                        {member.initials}
                                    </div>
                                    <h3 className="about-team-card__name">{member.name}</h3>
                                    <p className="about-team-card__role">
                                        {t(`about.roles.${member.roleKey}`)}
                                    </p>
                                </div>
                            </SectionReveal>
                        ))}
                    </div>
                </div>
            </section>

            <section className="about-page__cta section">
                <div className="container">
                    <SectionReveal>
                        <div className="about-cta-card">
                            <Mail size={32} className="about-cta-card__icon" />
                            <h2 className="about-cta-card__title">{t('about.getInTouch')}</h2>
                            <p className="about-cta-card__description">
                                {t('about.getInTouchDesc')}
                            </p>
                            <Button variant="primary" size="lg" href="mailto:hello@bilge.kg" id="contact-btn">
                                {t('about.contactUs')}
                            </Button>
                        </div>
                    </SectionReveal>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
