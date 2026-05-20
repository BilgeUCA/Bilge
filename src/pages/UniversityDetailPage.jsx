import { useParams, Link } from 'react-router-dom';
import { MapPin, Globe, Mail, Phone, Clock, Calendar, ChevronDown, ChevronUp, Heart, CheckCircle2, FileText } from 'lucide-react';
import { useState } from 'react';
import Button from '../components/ui/Button';
import SectionReveal from '../components/ui/SectionReveal';
import { useTranslation } from '../i18n/useLanguage';
import './UniversityDetailPage.css';

const universitiesData = {
    'uca': {
        id: 'uca',
        name: 'University of Central Asia',
        shortName: 'UCA',
        location: 'Naryn / Bishkek, Kyrgyzstan',
        badges: ['Aga Khan Network', 'Accredited'],
        gradient: 'linear-gradient(135deg, #1E3A5F 0%, #2D6A9F 50%, #4A90C4 100%)',
        aboutKey: 'uniDetail.ucaAbout',
        stats: [
            { value: '800+', labelKey: 'STUDENTS' },
            { value: '12:1', labelKey: 'STUDENT-FACULTY RATIO' },
            { value: '15+', labelKey: 'COUNTRIES' },
            { value: '95%', labelKey: 'EMPLOYMENT RATE' },
        ],
        ortScoreMin: 'Min: 170 Points',
        englishProfMin: 'IELTS 6.0+ / equivalent',
        englishProfDescKey: 'englishProfDescUCA',
        ortSubjects: [
            { programKey: 'Computer Science', subjectKey: 'Mathematics', minScore: '60+' },
            { programKey: 'Economics', subjectKey: 'Mathematics', minScore: '55+' },
            { programKey: 'Communications', subjectKey: 'English / History', minScore: '50+' },
            { programKey: 'Earth & Environmental Sciences', subjectKey: 'Biology / Chemistry', minScore: '55+' },
        ],
        documentKeys: [
            'Original ORT Certificate (Gold/Yellow certificates accepted)',
            'High School Diploma (Attestat) with transcripts',
            'Copy of Passport (ID Page)',
            '4 Color photos (3x4 cm)',
        ],
        tuition: {
            annual: '$4,500',
            financialAidPercent: '75',
            meritBasedKey: 'meritBasedUCA',
        },
        faqs: [
            { questionKey: 'q_ort', answerKey: 'a_ort' },
            { questionKey: 'q_dorm', answerKey: 'a_dorm_uca' },
            { questionKey: 'q_abroad', answerKey: 'a_abroad' },
        ],
        timeline: [
            { date: 'APR 15', titleKey: 'earlyReg' },
            { date: 'MAY 15 - 20', titleKey: 'nationalOrt', descKey: 'mainTestingDates' },
            { date: 'JUN 10', titleKey: 'regularDeadline' },
        ],
        admissionsOffice: {
            email: 'admissions@ucentralasia.org',
            phone: '+996 (312) 910-822',
        },
    },
    'auca': {
        id: 'auca',
        name: 'American University of Central Asia',
        shortName: 'AUCA',
        location: 'Bishkek, Kyrgyzstan',
        badges: ['US Accredited', 'Accredited'],
        gradient: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 50%, #93C5FD 100%)',
        aboutKey: 'uniDetail.aucaAbout',
        stats: [
            { value: '1,500+', labelKey: 'STUDENTS' },
            { value: '14:1', labelKey: 'STUDENT-FACULTY RATIO' },
            { value: '25+', labelKey: 'COUNTRIES' },
            { value: '92%', labelKey: 'EMPLOYMENT RATE' },
        ],
        ortScoreMin: 'Min: 190 Points',
        englishProfMin: 'TOEFL IBT 60+ / IELTS 5.5+',
        englishProfDescKey: 'englishProfDescAUCA',
        ortSubjects: [
            { programKey: 'Software Engineering', subjectKey: 'Mathematics / Physics', minScore: '60+' },
            { programKey: 'Economics', subjectKey: 'Mathematics', minScore: '60+' },
            { programKey: 'Psychology', subjectKey: 'History / Biology', minScore: '60+' },
        ],
        documentKeys: [
            'Original ORT Certificate (Gold/Yellow certificates accepted)',
            'High School Diploma (Attestat) with transcripts',
            'Copy of Passport (ID Page)',
            '4 Color photos (3x4 cm)',
        ],
        tuition: {
            annual: '$6,000',
            financialAidPercent: '85',
            meritBasedKey: 'meritBasedAUCA',
        },
        faqs: [
            { questionKey: 'q_ort', answerKey: 'a_ort' },
            { questionKey: 'q_dorm', answerKey: 'a_dorm_auca' },
        ],
        timeline: [
            { date: 'APR 15', titleKey: 'earlyReg' },
            { date: 'MAY 15 - 20', titleKey: 'nationalOrt', descKey: 'mainTestingDates' },
            { date: 'JUN 10', titleKey: 'regularDeadline' },
        ],
        admissionsOffice: {
            email: 'admissions@auca.kg',
            phone: '+996 (312) 915-000',
        },
    },
};

const tabKeys = ['overview', 'admissions', 'documents', 'tuition', 'faq'];

const UniversityDetailPage = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const uni = universitiesData[id];
    const [activeTab, setActiveTab] = useState('overview');
    const [openAccordion, setOpenAccordion] = useState('general');
    const [openFaq, setOpenFaq] = useState(null);
    const [saved, setSaved] = useState(false);

    if (!uni) {
        return (
            <div className="unidet-page">
                <div className="container" style={{ paddingTop: '120px', textAlign: 'center' }}>
                    <h2>{t('uniDetail.notFound')}</h2>
                    <p style={{ marginTop: '1rem', color: '#6B7280' }}>{t('uniDetail.notFoundDesc')}</p>
                    <Link to="/universities" style={{ display: 'inline-block', marginTop: '1.5rem', color: '#2563EB', fontWeight: 600 }}>
                        {t('uniDetail.backToUnis')}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="unidet-page">
            {/* Banner */}
            <div className="unidet-banner" style={{ background: uni.gradient }}>
                <div className="container unidet-banner__inner">
                    <div className="unidet-banner__logo">
                        {uni.shortName}
                    </div>
                    <div className="unidet-banner__info">
                        <h1 className="unidet-banner__name">{uni.name}</h1>
                        <div className="unidet-banner__meta">
                            <span className="unidet-banner__meta-item">
                                <MapPin size={14} /> {uni.location}
                            </span>
                            <span className="unidet-banner__meta-item">
                                <Globe size={14} /> {t('uniDetail.mediumEnglish')}
                            </span>
                        </div>
                    </div>
                    <div className="unidet-banner__badges">
                        {uni.badges.map((badge) => (
                            <span key={badge} className="unidet-banner__badge">
                                {t(`uniDetail.badges.${badge}`)}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="unidet-tabs">
                <div className="container unidet-tabs__inner">
                    {tabKeys.map((key) => (
                        <button
                            key={key}
                            className={`unidet-tabs__tab ${activeTab === key ? 'unidet-tabs__tab--active' : ''}`}
                            onClick={() => setActiveTab(key)}
                        >
                            {t(`uniDetail.tabs.${key}`)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="container unidet-content">
                <div className="unidet-content__main">
                    {/* About */}
                    <SectionReveal>
                        <section className="unidet-section" id="about">
                            <h2 className="unidet-section__title">{t('uniDetail.aboutHeading')}</h2>
                            <p className="unidet-section__text">{t(uni.aboutKey)}</p>
                            <div className="unidet-stats">
                                {uni.stats.map((stat, i) => (
                                    <div key={i} className="unidet-stat">
                                        <span className="unidet-stat__value">{stat.value}</span>
                                        <span className="unidet-stat__label">
                                            {t(`uniDetail.statsLabels.${stat.labelKey}`)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </SectionReveal>

                    {/* Admission Requirements */}
                    <SectionReveal>
                        <section className="unidet-section" id="admissions">
                            <div className="unidet-section__header">
                                <h2 className="unidet-section__title">{t('uniDetail.admissionRequirements')}</h2>
                                <span className="unidet-intake-badge">{t('uniDetail.intake')}</span>
                            </div>
                            <div className="unidet-req-grid">
                                <div className="unidet-req-card">
                                    <div className="unidet-req-card__icon" style={{ background: '#EFF6FF' }}>
                                        <FileText size={20} color="#2563EB" />
                                    </div>
                                    <h4 className="unidet-req-card__title">{t('uniDetail.ortScoreLabel')}</h4>
                                    <p className="unidet-req-card__desc">{t('uniDetail.ortScoreDesc')}</p>
                                    <span className="unidet-req-card__min">{uni.ortScoreMin}</span>
                                </div>
                                <div className="unidet-req-card">
                                    <div className="unidet-req-card__icon" style={{ background: '#FDF2F8' }}>
                                        <Globe size={20} color="#DB2777" />
                                    </div>
                                    <h4 className="unidet-req-card__title">{t('uniDetail.englishProfLabel')}</h4>
                                    <p className="unidet-req-card__desc">{t(`uniDetail.${uni.englishProfDescKey}`)}</p>
                                    <span className="unidet-req-card__min">{uni.englishProfMin}</span>
                                </div>
                            </div>
                        </section>
                    </SectionReveal>

                    {/* Department Specific ORT Subjects */}
                    <SectionReveal>
                        <section className="unidet-section" id="ort-subjects">
                            <h2 className="unidet-section__title">{t('uniDetail.ortSubjectsHeading')}</h2>
                            <div className="unidet-table">
                                <div className="unidet-table__head">
                                    <span>{t('uniDetail.tableProgram')}</span>
                                    <span>{t('uniDetail.tableSubject')}</span>
                                    <span>{t('uniDetail.tableScore')}</span>
                                </div>
                                {uni.ortSubjects.map((row, i) => (
                                    <div key={i} className="unidet-table__row">
                                        <span className="unidet-table__program">
                                            {t(`uniDetail.programs.${row.programKey}`)}
                                        </span>
                                        <span className="unidet-table__subject">
                                            {t(`uniDetail.subjects.${row.subjectKey}`)}
                                        </span>
                                        <span className="unidet-table__score">{row.minScore}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </SectionReveal>

                    {/* Required Documents */}
                    <SectionReveal>
                        <section className="unidet-section" id="documents">
                            <h2 className="unidet-section__title">{t('uniDetail.requiredDocs')}</h2>

                            <div className="unidet-accordion">
                                <button
                                    className={`unidet-accordion__trigger ${openAccordion === 'general' ? 'unidet-accordion__trigger--open' : ''}`}
                                    onClick={() => setOpenAccordion(openAccordion === 'general' ? null : 'general')}
                                >
                                    <FileText size={18} />
                                    <span>{t('uniDetail.generalDocs')}</span>
                                    {openAccordion === 'general' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                </button>
                                {openAccordion === 'general' && (
                                    <div className="unidet-accordion__content">
                                        {uni.documentKeys.map((docKey, i) => (
                                            <div key={i} className="unidet-accordion__item">
                                                <CheckCircle2 size={16} className="unidet-accordion__check" />
                                                <span>{t(`uniDetail.documents.${docKey}`)}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="unidet-accordion">
                                <button
                                    className={`unidet-accordion__trigger ${openAccordion === 'financial' ? 'unidet-accordion__trigger--open' : ''}`}
                                    onClick={() => setOpenAccordion(openAccordion === 'financial' ? null : 'financial')}
                                >
                                    <FileText size={18} />
                                    <span>{t('uniDetail.financialDocs')}</span>
                                    {openAccordion === 'financial' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                </button>
                                {openAccordion === 'financial' && (
                                    <div className="unidet-accordion__content">
                                        <div className="unidet-accordion__item">
                                            <CheckCircle2 size={16} className="unidet-accordion__check" />
                                            <span>{t('uniDetail.familyIncomeDoc')}</span>
                                        </div>
                                        <div className="unidet-accordion__item">
                                            <CheckCircle2 size={16} className="unidet-accordion__check" />
                                            <span>{t('uniDetail.financialNeedDoc')}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>
                    </SectionReveal>

                    {/* Tuition & Financial Aid */}
                    <SectionReveal>
                        <section className="unidet-section" id="tuition">
                            <div className="unidet-tuition-card">
                                <div className="unidet-tuition-card__header">
                                    <h2 className="unidet-section__title" style={{ marginBottom: 0 }}>{t('uniDetail.tuitionHeading')}</h2>
                                    <span className="unidet-tuition-card__badge">
                                        ✨ {uni.tuition.financialAidPercent}{t('uniDetail.aidBadge')}
                                    </span>
                                </div>
                                <div className="unidet-tuition-card__body">
                                    <div className="unidet-tuition-card__left">
                                        <span className="unidet-tuition-card__label">{t('uniDetail.annualTuitionLabel')}</span>
                                        <div className="unidet-tuition-card__amount">
                                            {uni.tuition.annual} <span>{t('uniDetail.perYear')}</span>
                                        </div>
                                        <p className="unidet-tuition-card__note">{t('uniDetail.tuitionNote')}</p>
                                    </div>
                                    <div className="unidet-tuition-card__right">
                                        <div className="unidet-tuition-card__aid-item">
                                            <h4>{t('uniDetail.needBased')}</h4>
                                            <p>{t('uniDetail.needBasedDesc')}</p>
                                        </div>
                                        <div className="unidet-tuition-card__aid-item">
                                            <h4>{t('uniDetail.meritBased')}</h4>
                                            <p>{t(`uniDetail.${uni.tuition.meritBasedKey}`)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </SectionReveal>

                    {/* FAQs */}
                    <SectionReveal>
                        <section className="unidet-section" id="faq">
                            <h2 className="unidet-section__title">{t('uniDetail.faqHeading')}</h2>
                            <div className="unidet-faqs">
                                {uni.faqs.map((faq, i) => (
                                    <div key={i} className="unidet-faq">
                                        <button
                                            className="unidet-faq__question"
                                            onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                        >
                                            <strong>{t(`uniDetail.faqs.${faq.questionKey}`)}</strong>
                                            {openFaq === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                        </button>
                                        {openFaq === i && (
                                            <p className="unidet-faq__answer">{t(`uniDetail.faqs.${faq.answerKey}`)}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    </SectionReveal>
                </div>

                {/* Sidebar */}
                <aside className="unidet-sidebar">
                    {/* Application CTA */}
                    <SectionReveal>
                        <div className="unidet-apply-card">
                            <div className="unidet-apply-card__header">
                                <span className="unidet-apply-card__status">{t('uniDetail.applicationStatus')}</span>
                                <button
                                    className={`unidet-apply-card__heart ${saved ? 'unidet-apply-card__heart--active' : ''}`}
                                    onClick={() => setSaved(!saved)}
                                >
                                    <Heart size={18} fill={saved ? '#EF4444' : 'none'} color={saved ? '#EF4444' : '#9CA3AF'} />
                                </button>
                            </div>
                            <h3 className="unidet-apply-card__title">{t('uniDetail.readyToApply')}</h3>
                            <p className="unidet-apply-card__desc">{t('uniDetail.applyDesc')}</p>
                            <Button variant="primary" size="md" id="start-planning-btn" style={{ width: '100%' }}>
                                {t('uniDetail.startPlanning')}
                            </Button>
                            <button className="unidet-apply-card__save">{t('uniDetail.saveForLater')}</button>
                        </div>
                    </SectionReveal>

                    {/* Timeline */}
                    <SectionReveal delay={100}>
                        <div className="unidet-timeline-card">
                            <h4 className="unidet-timeline-card__title">
                                <Calendar size={16} /> {t('uniDetail.timeline')}
                            </h4>
                            <div className="unidet-timeline-card__list">
                                {uni.timeline.map((item, i) => (
                                    <div key={i} className="unidet-timeline-item">
                                        <div className="unidet-timeline-item__dot" />
                                        <div>
                                            <span className="unidet-timeline-item__date">{item.date}</span>
                                            <h5 className="unidet-timeline-item__title">
                                                {t(`uniDetail.timelineItems.${item.titleKey}`)}
                                            </h5>
                                            {item.descKey && (
                                                <p className="unidet-timeline-item__desc">
                                                    {t(`uniDetail.timelineItems.${item.descKey}`)}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </SectionReveal>

                    {/* Admissions Office */}
                    <SectionReveal delay={200}>
                        <div className="unidet-office-card">
                            <h4 className="unidet-office-card__title">{t('uniDetail.officeHeading')}</h4>
                            <div className="unidet-office-card__item">
                                <Mail size={14} color="#2563EB" />
                                <a href={`mailto:${uni.admissionsOffice.email}`}>{uni.admissionsOffice.email}</a>
                            </div>
                            <div className="unidet-office-card__item">
                                <Phone size={14} color="#2563EB" />
                                <span>{uni.admissionsOffice.phone}</span>
                            </div>
                            <div className="unidet-office-card__item">
                                <Clock size={14} color="#2563EB" />
                                <span>{t('uniDetail.officeHours')}</span>
                            </div>
                        </div>
                    </SectionReveal>
                </aside>
            </div>
        </div>
    );
};

export default UniversityDetailPage;
