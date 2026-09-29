import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { BookOpen, Download, ChevronRight, FileText, BarChart3, PlayCircle, Library, ArrowRight, ExternalLink } from 'lucide-react';
import Button from '../components/ui/Button';
import SectionReveal from '../components/ui/SectionReveal';
import OrtPractice from '../components/ort/OrtPractice';
import { useTranslation } from '../i18n/useLanguage';
import { useAuth } from '../auth/authContext';
import { useStoredState } from '../hooks/useStoredState';
import { ORT_RESULTS_KEY } from '../data/ortPractice';
import { fmt } from '../utils/format';
import './ORTPrepPage.css';

// Official ORT organiser: Center for Educational Assessment and Teaching Methods
const TESTING_KG = 'https://testing.kg';
const MINISTRY = 'https://edu.gov.kg';
const TABS = ['guide', 'practice', 'progress'];

const tocItems = [
    { id: 'overview', labelKey: 'overview' },
    { id: 'exam-structure', labelKey: 'examStructure' },
    { id: 'subject-breakdown', labelKey: 'subjectBreakdown' },
    { id: 'preparation-timeline', labelKey: 'preparationTimeline' },
    { id: 'study-tips', labelKey: 'studyTips' },
    { id: 'resources', labelKey: 'resources' },
];

const studyTips = [
    { icon: '⏱️', titleKey: 'tipTimeTitle', descKey: 'tipTimeDesc', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.14)' },
    { icon: '🧠', titleKey: 'tipLogicTitle', descKey: 'tipLogicDesc', color: '#3B82F6', bg: 'rgba(37, 99, 235, 0.1)' },
    { icon: '✂️', titleKey: 'tipElimTitle', descKey: 'tipElimDesc', color: '#8B5CF6', bg: 'rgba(124, 58, 237, 0.1)' },
];

const resources = [
    { titleKey: 'officialExam', type: 'WEB', sizeKey: 'externalLink', href: TESTING_KG },
    { titleKey: 'guidelines', type: 'WEB', sizeKey: 'externalLink', href: MINISTRY },
    { titleKey: 'diagnostic', type: 'QUIZ', sizeKey: 'interactive', tab: 'practice' },
];

const ORTPrepPage = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [params, setParams] = useSearchParams();
    const tab = TABS.includes(params.get('tab')) ? params.get('tab') : 'guide';
    const [practiceSubject, setPracticeSubject] = useState(params.get('subject') || 'all');
    const [results] = useStoredState(ORT_RESULTS_KEY, []);
    const [activeSection, setActiveSection] = useState('overview');

    const openTab = (next, subject) => {
        if (subject) setPracticeSubject(subject);
        setParams(next === 'guide' ? {} : { tab: next }, { replace: false });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        const handleScroll = () => {
            const sections = tocItems.map((item) => document.getElementById(item.id));
            const scrollPos = window.scrollY + 150;

            for (let i = sections.length - 1; i >= 0; i--) {
                const section = sections[i];
                if (section && section.offsetTop <= scrollPos) {
                    setActiveSection(tocItems[i].id);
                    break;
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id) => {
        const el = document.getElementById(id);
        if (el) {
            window.scrollTo({ top: el.offsetTop - 100, behavior: 'smooth' });
        }
    };

    return (
        <div className="ort-page">
            {/* Top nav tabs */}
            <div className="ort-page__tabs">
                <div className="container ort-page__tabs-inner" role="tablist" aria-label={t('navbar.ortPrep')}>
                    {TABS.map((key) => (
                        <button
                            type="button"
                            role="tab"
                            key={key}
                            aria-selected={tab === key}
                            className={`ort-page__tab ${tab === key ? 'ort-page__tab--active' : ''}`}
                            onClick={() => openTab(key)}
                        >
                            {t(`ort.tabs.${key}`)}
                        </button>
                    ))}
                    <div className="ort-page__tabs-right">
                        {user ? (
                            <Button variant="secondary" size="sm" to="/account">{t('ort.myAccount')}</Button>
                        ) : (
                            <Button variant="primary" size="sm" to="/login" state={{ from: '/ort-prep?tab=progress' }} id="sign-in-btn">
                                {t('ort.signIn')}
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {tab === 'practice' && (
                <div className="container ort-page__single">
                    <OrtPractice initialSubject={practiceSubject} />
                </div>
            )}

            {tab === 'progress' && (
                <div className="container ort-page__single">
                    <div className="ort-progress">
                        <h2 className="ort-progress__title">{t('ort.progressTitle')}</h2>
                        {results.length === 0 ? (
                            <>
                                <p className="ort-progress__empty">{t('ort.progressEmpty')}</p>
                                <Button variant="primary" size="md" onClick={() => openTab('practice')}>{t('ort.startDiagnostic')}</Button>
                            </>
                        ) : (
                            <>
                                <p className="ort-progress__best">
                                    {fmt(t('ort.progressBest'), {
                                        pct: Math.max(...results.map((r) => Math.round((r.correct / r.total) * 100))),
                                        n: results.length,
                                    })}
                                </p>
                                <ul className="ort-progress__list">
                                    {[...results].reverse().map((r) => {
                                        const pct = Math.round((r.correct / r.total) * 100);
                                        return (
                                            <li key={r.date} className="ort-progress__row">
                                                <span className="ort-progress__date">
                                                    {new Date(r.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                <span className="ort-progress__subject">{t(`ortPractice.subjects.${r.subject}`)}</span>
                                                <span className="ort-progress__bar" aria-hidden="true"><span style={{ width: `${pct}%` }} /></span>
                                                <strong className="ort-progress__pct">{pct}%</strong>
                                            </li>
                                        );
                                    })}
                                </ul>
                                <Button variant="primary" size="md" onClick={() => openTab('practice')}>{t('ortPractice.again')}</Button>
                            </>
                        )}
                        {!user && <p className="ort-progress__note">{t('ort.progressNote')} <Link to="/login">{t('ort.signIn')}</Link></p>}
                    </div>
                </div>
            )}

            {tab === 'guide' && (
            <div className="container ort-page__layout">
                {/* Sidebar TOC */}
                <aside className="ort-toc" id="ort-toc">
                    <h4 className="ort-toc__title">{t('ort.contents')}</h4>
                    <nav className="ort-toc__nav">
                        {tocItems.map((item) => (
                            <button
                                key={item.id}
                                className={`ort-toc__link ${activeSection === item.id ? 'ort-toc__link--active' : ''}`}
                                onClick={() => scrollToSection(item.id)}
                            >
                                {t(`ort.toc.${item.labelKey}`)}
                            </button>
                        ))}
                    </nav>
                    <div className="ort-toc__cta">
                        <p className="ort-toc__cta-title">{t('ort.ctaTitle')}</p>
                        <p className="ort-toc__cta-text">{t('ort.ctaText')}</p>
                        <Button variant="primary" size="sm" id="start-diagnostic-btn" onClick={() => openTab('practice')}>
                            {t('ort.startDiagnostic')}
                        </Button>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="ort-page__main">
                    {/* Overview Section */}
                    <section id="overview" className="ort-section">
                        <SectionReveal>
                            <div className="ort-hero-card">
                                <span className="ort-hero-card__badge">{t('ort.heroBadge')}</span>
                                <h1 className="ort-hero-card__title">
                                    {t('ort.heroTitle')}
                                </h1>
                                <p className="ort-hero-card__desc">
                                    {t('ort.heroDesc')}
                                </p>
                                <div className="ort-hero-card__actions">
                                    <Button variant="primary" size="md" icon={<ArrowRight size={16} />} id="start-studying-btn" onClick={() => scrollToSection('exam-structure')}>
                                        {t('ort.startStudying')}
                                    </Button>
                                    <Button variant="secondary" size="md" icon={<Download size={16} />} id="download-syllabus-btn" href={TESTING_KG}>
                                        {t('ort.downloadSyllabus')}
                                    </Button>
                                </div>
                            </div>
                        </SectionReveal>
                    </section>

                    {/* Exam Structure */}
                    <section id="exam-structure" className="ort-section">
                        <SectionReveal>
                            <h2 className="ort-section__title">
                                <span className="ort-section__title-bar" />
                                {t('ort.toc.examStructure')}
                            </h2>
                        </SectionReveal>
                        <div className="ort-exam-grid">
                            <SectionReveal delay={80}>
                                <div className="ort-exam-card">
                                    <div className="ort-exam-card__header">
                                        <div className="ort-exam-card__icon" style={{ background: 'rgba(37, 99, 235, 0.1)' }}>
                                            <FileText size={20} color="#2563EB" />
                                        </div>
                                        <span className="ort-exam-card__badge ort-exam-card__badge--required">{t('ort.compulsory')}</span>
                                    </div>
                                    <h3 className="ort-exam-card__name">{t('ort.mainTest')}</h3>
                                    <p className="ort-exam-card__desc">{t('ort.mainTestDesc')}</p>
                                    <div className="ort-exam-card__stats">
                                        <div className="ort-exam-card__stat">
                                            <span className="ort-exam-card__stat-label">{t('ort.duration')}</span>
                                            <span className="ort-exam-card__stat-value">{t('ort.durationMain')}</span>
                                        </div>
                                        <div className="ort-exam-card__stat">
                                            <span className="ort-exam-card__stat-label">{t('ort.maxScore')}</span>
                                            <span className="ort-exam-card__stat-value">241 pts</span>
                                        </div>
                                        <div className="ort-exam-card__stat">
                                            <span className="ort-exam-card__stat-label">{t('ort.sections')}</span>
                                            <span className="ort-exam-card__stat-value">{t('ort.mathVerbal')}</span>
                                        </div>
                                    </div>
                                </div>
                            </SectionReveal>
                            <SectionReveal delay={160}>
                                <div className="ort-exam-card">
                                    <div className="ort-exam-card__header">
                                        <div className="ort-exam-card__icon" style={{ background: 'rgba(124, 58, 237, 0.1)' }}>
                                            <BookOpen size={20} color="#7C3AED" />
                                        </div>
                                        <span className="ort-exam-card__badge ort-exam-card__badge--elective">{t('ort.elective')}</span>
                                    </div>
                                    <h3 className="ort-exam-card__name">{t('ort.subjectTests')}</h3>
                                    <p className="ort-exam-card__desc">{t('ort.subjectTestsDesc')}</p>
                                    <div className="ort-exam-card__stats">
                                        <div className="ort-exam-card__stat">
                                            <span className="ort-exam-card__stat-label">{t('ort.duration')}</span>
                                            <span className="ort-exam-card__stat-value">{t('ort.durationSubject')}</span>
                                        </div>
                                        <div className="ort-exam-card__stat">
                                            <span className="ort-exam-card__stat-label">{t('ort.maxScore')}</span>
                                            <span className="ort-exam-card__stat-value">150 pts</span>
                                        </div>
                                        <div className="ort-exam-card__stat">
                                            <span className="ort-exam-card__stat-label">{t('ort.subjects')}</span>
                                            <span className="ort-exam-card__stat-value">{t('ort.subjectsList')}</span>
                                        </div>
                                    </div>
                                </div>
                            </SectionReveal>
                        </div>
                    </section>

                    {/* Subject Breakdown */}
                    <section id="subject-breakdown" className="ort-section">
                        <SectionReveal>
                            <h2 className="ort-section__title">
                                <span className="ort-section__title-bar" />
                                {t('ort.toc.subjectBreakdown')}
                            </h2>
                        </SectionReveal>
                        <div className="ort-subjects-list">
                            <SectionReveal delay={80}>
                                <button type="button" className="ort-subject-row" onClick={() => openTab('practice', 'math')}>
                                    <div className="ort-subject-row__icon ort-icon--blue">
                                        <BarChart3 size={20} />
                                    </div>
                                    <div className="ort-subject-row__info">
                                        <h4 className="ort-subject-row__name">{t('ort.mathematics')}</h4>
                                        <p className="ort-subject-row__meta">{t('ort.questionsMeta')} · {t('ort.practiceNow')}</p>
                                    </div>
                                    <ChevronRight size={20} className="ort-subject-row__arrow" />
                                </button>
                            </SectionReveal>
                            <SectionReveal delay={160}>
                                <button type="button" className="ort-subject-row" onClick={() => openTab('practice', 'verbal')}>
                                    <div className="ort-subject-row__icon ort-icon--violet">
                                        <BookOpen size={20} />
                                    </div>
                                    <div className="ort-subject-row__info">
                                        <h4 className="ort-subject-row__name">{t('ort.verbalReasoning')}</h4>
                                        <p className="ort-subject-row__meta">{t('ort.questionsMeta')} · {t('ort.practiceNow')}</p>
                                    </div>
                                    <ChevronRight size={20} className="ort-subject-row__arrow" />
                                </button>
                            </SectionReveal>
                        </div>
                    </section>

                    {/* Preparation Timeline */}
                    <section id="preparation-timeline" className="ort-section">
                        <SectionReveal>
                            <h2 className="ort-section__title">
                                <span className="ort-section__title-bar" />
                                {t('ort.toc.preparationTimeline')}
                            </h2>
                        </SectionReveal>
                        <div className="ort-timeline">
                            <div className="ort-timeline__line" />

                            <SectionReveal delay={80}>
                                <div className="ort-timeline__item ort-timeline__item--right">
                                    <div className="ort-timeline__dot" />
                                    <div className="ort-timeline__card">
                                        <span className="ort-timeline__badge" style={{ background: 'rgba(37, 99, 235, 0.12)', color: '#2563EB' }}>{t('ort.foundationBadge')}</span>
                                        <h4 className="ort-timeline__card-title">{t('ort.foundationTitle')}</h4>
                                        <p className="ort-timeline__card-desc">{t('ort.foundationDesc')}</p>
                                    </div>
                                </div>
                            </SectionReveal>

                            <SectionReveal delay={160}>
                                <div className="ort-timeline__item ort-timeline__item--left">
                                    <div className="ort-timeline__dot" />
                                    <div className="ort-timeline__card">
                                        <span className="ort-timeline__badge" style={{ background: 'rgba(16, 185, 129, 0.14)', color: '#059669' }}>{t('ort.practiceBadge')}</span>
                                        <h4 className="ort-timeline__card-title">{t('ort.practiceTitle')}</h4>
                                        <p className="ort-timeline__card-desc">{t('ort.practiceDesc')}</p>
                                    </div>
                                </div>
                            </SectionReveal>

                            <SectionReveal delay={240}>
                                <div className="ort-timeline__item ort-timeline__item--right">
                                    <div className="ort-timeline__dot" />
                                    <div className="ort-timeline__card">
                                        <span className="ort-timeline__badge" style={{ background: 'rgba(239, 68, 68, 0.14)', color: '#DC2626' }}>{t('ort.reviewBadge')}</span>
                                        <h4 className="ort-timeline__card-title">{t('ort.reviewTitle')}</h4>
                                        <p className="ort-timeline__card-desc">{t('ort.reviewDesc')}</p>
                                    </div>
                                </div>
                            </SectionReveal>
                        </div>
                    </section>

                    {/* Study Tips */}
                    <section id="study-tips" className="ort-section">
                        <SectionReveal>
                            <h2 className="ort-section__title">
                                <span className="ort-section__title-bar" />
                                {t('ort.essentialTips')}
                            </h2>
                        </SectionReveal>
                        <div className="ort-tips-grid">
                            {studyTips.map((tip, index) => (
                                <SectionReveal key={index} delay={index * 100}>
                                    <div className="ort-tip-card">
                                        <div className="ort-tip-card__icon" style={{ background: tip.bg, color: tip.color }}>
                                            {tip.icon}
                                        </div>
                                        <h4 className="ort-tip-card__title">{t(`ort.${tip.titleKey}`)}</h4>
                                        <p className="ort-tip-card__desc">{t(`ort.${tip.descKey}`)}</p>
                                    </div>
                                </SectionReveal>
                            ))}
                        </div>
                    </section>

                    {/* Resources */}
                    <section id="resources" className="ort-section">
                        <SectionReveal>
                            <div className="ort-resources">
                                <div className="ort-resources__header">
                                    <div>
                                        <h2 className="ort-resources__title">{t('ort.studyResources')}</h2>
                                        <p className="ort-resources__desc">
                                            {t('ort.resourcesDesc')}
                                        </p>
                                    </div>
                                    <Button variant="primary" size="sm" icon={<Library size={16} />} id="browse-library-btn" href={TESTING_KG}>
                                        {t('ort.browseLibrary')}
                                    </Button>
                                </div>
                                <div className="ort-resources__list">
                                    {resources.map((res, index) => (
                                        <div key={index} className="ort-resource-item">
                                            <div className="ort-resource-item__icon">
                                                <span className={`ort-resource-item__type ort-resource-item__type--${res.type.toLowerCase()}`}>
                                                    {res.type}
                                                </span>
                                                <span className="ort-resource-item__size">
                                                    {t(`ort.resourceItems.${res.sizeKey}`)}
                                                </span>
                                            </div>
                                            <div className="ort-resource-item__info">
                                                <h4>
                                                    {res.href ? (
                                                        <a href={res.href} target="_blank" rel="noopener noreferrer" className="ort-resource-item__link">
                                                            {t(`ort.resourceItems.${res.titleKey}`)}
                                                        </a>
                                                    ) : (
                                                        <button type="button" className="ort-resource-item__link" onClick={() => openTab(res.tab)}>
                                                            {t(`ort.resourceItems.${res.titleKey}`)}
                                                        </button>
                                                    )}
                                                </h4>
                                            </div>
                                            <span className="ort-resource-item__dl" aria-hidden="true">
                                                {res.href ? <ExternalLink size={20} /> : <PlayCircle size={20} />}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </SectionReveal>
                    </section>
                </div>
            </div>
            )}
        </div>
    );
};

export default ORTPrepPage;
