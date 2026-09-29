import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    MapPin, Globe, Mail, Calendar, ChevronDown, Heart, CheckCircle2, FileText, ExternalLink,
    ArrowLeft, Building2, Languages, Trophy, Handshake, GraduationCap, ArrowRight,
} from 'lucide-react';
import SectionReveal from '../components/ui/SectionReveal';
import UniLogo from '../components/ui/UniLogo';
import { useTranslation } from '../i18n/useLanguage';
import { useSavedIds, useStoredState } from '../hooks/useStoredState';
import { getUniversity, universities } from '../data/universities';
import { getScholarship } from '../data/scholarships';
import { getAdmissionStatus, formatMonthDay } from '../utils/admission';
import { fmt, formatUsd } from '../utils/format';
import './UniversityDetailPage.css';

const SECTIONS = ['overview', 'admissions', 'documents', 'tuition', 'faq'];

// Highlight the tab whose section is currently under the sticky header
const useActiveSection = (ids) => {
    const [active, setActive] = useState(ids[0]);
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries.filter((e) => e.isIntersecting);
                if (visible.length) setActive(visible[0].target.id);
            },
            { rootMargin: '-140px 0px -60% 0px' }
        );
        ids.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
    }, [ids]);
    return [active, setActive];
};

const UniversityDetail = ({ id }) => {
    const { t } = useTranslation();
    const uni = getUniversity(id);
    const saved = useSavedIds('universities');
    const [checked, setChecked] = useStoredState(`bilge.checklist.${id}`, []);
    const [openFaq, setOpenFaq] = useState(0);
    const [activeTab, setActiveTab] = useActiveSection(SECTIONS);

    useEffect(() => {
        if (uni) document.title = `${uni.shortName} — BILGE`;
        return () => {
            document.title = 'BILGE — Higher Education in Kyrgyzstan';
        };
    }, [uni]);

    if (!uni) {
        return (
            <div className="unidet-page">
                <div className="container unidet-notfound">
                    <h1>{t('uniDetail.notFound')}</h1>
                    <p>{t('uniDetail.notFoundDesc')}</p>
                    <Link to="/universities" className="unidet-back">
                        <ArrowLeft size={16} /> {t('uniDetail.backToUnis')}
                    </Link>
                </div>
            </div>
        );
    }

    const status = getAdmissionStatus(uni.admissionWindow);
    const isSaved = saved.isSaved(uni.id);
    const relatedScholarships = uni.scholarships.map(getScholarship).filter(Boolean);
    const similar = universities
        .filter((u) => u.id !== uni.id && u.country === uni.country)
        .slice(0, 3);

    const scrollTo = (sectionId) => {
        setActiveTab(sectionId);
        const el = document.getElementById(sectionId);
        if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 130, behavior: 'smooth' });
    };

    const toggleDoc = (doc) =>
        setChecked((prev) => (prev.includes(doc) ? prev.filter((d) => d !== doc) : [...prev, doc]));

    const tuitionText =
        uni.tuitionUsd === null
            ? t('universitiesPage.tuition.varies')
            : uni.tuitionUsd === 0
                ? t('universitiesPage.tuition.free')
                : `≈ ${formatUsd(uni.tuitionUsd)}`;

    const stats = [
        { icon: Calendar, label: t('uniDetail.statFounded'), value: uni.founded },
        { icon: Building2, label: t('uniDetail.statType'), value: t(`universitiesPage.types.${uni.type}`) },
        { icon: Languages, label: t('uniDetail.statLanguages'), value: uni.languages.map((l) => t(`universitiesPage.languages.${l}`)).join(', ') },
        { icon: Trophy, label: t('uniDetail.statRank'), value: `#${uni.rank}` },
    ];

    return (
        <div className="unidet-page">
            {/* Banner */}
            <div className="unidet-banner" style={{ background: `linear-gradient(135deg, ${uni.color}, ${uni.color}CC)` }}>
                {uni.photo && <img className="unidet-banner__photo" src={uni.photo} alt="" />}
                <div className="container">
                    <Link to="/universities" className="unidet-banner__back">
                        <ArrowLeft size={16} /> {t('uniDetail.backToUnis')}
                    </Link>
                    <div className="unidet-banner__inner">
                        <UniLogo className="unidet-banner__logo" src={uni.logo} name={uni.name} shortName={uni.shortName} color={uni.color} />
                        <div className="unidet-banner__info">
                            <h1 className="unidet-banner__name">{uni.name}</h1>
                            <div className="unidet-banner__meta">
                                <span className="unidet-banner__meta-item">
                                    <MapPin size={14} /> {uni.city}, {t(`universitiesPage.countries.${uni.country}`)}
                                </span>
                                <a className="unidet-banner__meta-item unidet-banner__meta-link" href={uni.website} target="_blank" rel="noopener noreferrer">
                                    <Globe size={14} /> {uni.website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/.*$/, '')}
                                </a>
                            </div>
                        </div>
                        <div className="unidet-banner__badges">
                            <span className="unidet-banner__badge">{t(`universitiesPage.types.${uni.type}`)}</span>
                            {uni.tuitionUsd === 0 && <span className="unidet-banner__badge">{t('universitiesPage.tuition.free')}</span>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Section tabs */}
            <div className="unidet-tabs">
                <div className="container unidet-tabs__inner" role="tablist" aria-label={t('uniDetail.sections')}>
                    {SECTIONS.map((key) => (
                        <button
                            type="button"
                            role="tab"
                            aria-selected={activeTab === key}
                            key={key}
                            className={`unidet-tabs__tab ${activeTab === key ? 'unidet-tabs__tab--active' : ''}`}
                            onClick={() => scrollTo(key)}
                        >
                            {t(`uniDetail.tabs.${key}`)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="container unidet-content">
                <div className="unidet-content__main">
                    {/* Overview */}
                    <section className="unidet-section" id="overview">
                        <SectionReveal>
                            <h2 className="unidet-section__title">{t('uniDetail.aboutHeading')}</h2>
                            <p className="unidet-section__text">{uni.about}</p>
                            <div className="unidet-stats">
                                {stats.map(({ icon: Icon, label, value }) => (
                                    <div key={label} className="unidet-stat">
                                        <Icon size={16} className="unidet-stat__icon" aria-hidden="true" />
                                        <span className="unidet-stat__value">{value}</span>
                                        <span className="unidet-stat__label">{label}</span>
                                    </div>
                                ))}
                            </div>

                            {uni.partnership && (
                                <div className="unidet-callout">
                                    <Handshake size={20} aria-hidden="true" />
                                    <div>
                                        <strong>{t('uniDetail.whyKg')}</strong>
                                        <p>{uni.partnership}</p>
                                    </div>
                                </div>
                            )}

                            <ul className="unidet-highlights">
                                {uni.highlights.map((h) => (
                                    <li key={h}><CheckCircle2 size={16} aria-hidden="true" /> {h}</li>
                                ))}
                            </ul>

                            <h3 className="unidet-subtitle">{t('uniDetail.programsHeading')}</h3>
                            <div className="unidet-programs">
                                {uni.majors.map((m) => (
                                    <span key={m} className="unidet-program"><GraduationCap size={14} aria-hidden="true" /> {m}</span>
                                ))}
                            </div>
                        </SectionReveal>
                    </section>

                    {/* Admissions */}
                    <section className="unidet-section" id="admissions">
                        <SectionReveal>
                            <div className="unidet-section__header">
                                <h2 className="unidet-section__title">{t('uniDetail.admissionRequirements')}</h2>
                                <span className="unidet-intake-badge">{t('uniDetail.intake')}</span>
                            </div>
                            <div className="unidet-req-grid">
                                {uni.requirements.map((req) => (
                                    <div key={req.label} className="unidet-req-card">
                                        <div className="unidet-req-card__icon"><FileText size={20} /></div>
                                        <h3 className="unidet-req-card__title">{req.label}</h3>
                                        <p className="unidet-req-card__min">{req.value}</p>
                                    </div>
                                ))}
                                {uni.ortScore && (
                                    <div className="unidet-req-card">
                                        <div className="unidet-req-card__icon"><Trophy size={20} /></div>
                                        <h3 className="unidet-req-card__title">{t('uniDetail.ortCompetitive')}</h3>
                                        <p className="unidet-req-card__min">≈ {uni.ortScore}+</p>
                                        <p className="unidet-req-card__desc">{t('uniDetail.ortEstimateNote')}</p>
                                    </div>
                                )}
                            </div>

                            <h3 className="unidet-subtitle">{t('uniDetail.howToApply')}</h3>
                            <ol className="unidet-steps">
                                {uni.steps.map((step, i) => (
                                    <li key={step.title} className="unidet-step">
                                        <span className="unidet-step__num">{i + 1}</span>
                                        <div>
                                            <h4 className="unidet-step__title">{step.title}</h4>
                                            <p className="unidet-step__text">{step.text}</p>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </SectionReveal>
                    </section>

                    {/* Documents checklist */}
                    <section className="unidet-section" id="documents">
                        <SectionReveal>
                            <div className="unidet-section__header">
                                <h2 className="unidet-section__title">{t('uniDetail.requiredDocs')}</h2>
                                <span className="unidet-intake-badge">
                                    {fmt(t('uniDetail.docsProgress'), { done: checked.filter((d) => uni.documents.includes(d)).length, total: uni.documents.length })}
                                </span>
                            </div>
                            <p className="unidet-section__hint">{t('uniDetail.docsHint')}</p>
                            <ul className="unidet-checklist">
                                {uni.documents.map((doc) => (
                                    <li key={doc}>
                                        <label className="unidet-checklist__item">
                                            <input type="checkbox" checked={checked.includes(doc)} onChange={() => toggleDoc(doc)} />
                                            <span>{doc}</span>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </SectionReveal>
                    </section>

                    {/* Tuition */}
                    <section className="unidet-section" id="tuition">
                        <SectionReveal>
                            <div className="unidet-tuition-card">
                                <div className="unidet-tuition-card__header">
                                    <h2 className="unidet-section__title">{t('uniDetail.tuitionHeading')}</h2>
                                </div>
                                <div className="unidet-tuition-card__body">
                                    <div className="unidet-tuition-card__left">
                                        <span className="unidet-tuition-card__label">{t('uniDetail.annualTuitionLabel')}</span>
                                        <div className="unidet-tuition-card__amount">
                                            {tuitionText}
                                            {uni.tuitionUsd > 0 && <span> {t('uniDetail.perYear')}</span>}
                                        </div>
                                        <p className="unidet-tuition-card__note">{uni.tuitionNote || t('uniDetail.tuitionApprox')}</p>
                                    </div>
                                    <div className="unidet-tuition-card__right">
                                        <div className="unidet-tuition-card__aid-item">
                                            <h3>{t('uniDetail.aidHeading')}</h3>
                                            <p>{uni.aid}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {relatedScholarships.length > 0 && (
                                <>
                                    <h3 className="unidet-subtitle">{t('uniDetail.relatedScholarships')}</h3>
                                    <div className="unidet-related">
                                        {relatedScholarships.map((s) => (
                                            <Link key={s.id} to={`/scholarships/${s.id}`} className="unidet-related__item">
                                                <UniLogo className="unidet-related__logo" src={s.logo} name={s.name} shortName={s.shortName} color={s.color} />
                                                <span>
                                                    <strong>{s.name}</strong>
                                                    <small>{s.provider}</small>
                                                </span>
                                                <ArrowRight size={16} aria-hidden="true" />
                                            </Link>
                                        ))}
                                    </div>
                                </>
                            )}
                        </SectionReveal>
                    </section>

                    {/* FAQ */}
                    <section className="unidet-section" id="faq">
                        <SectionReveal>
                            <h2 className="unidet-section__title">{t('uniDetail.faqHeading')}</h2>
                            <div className="unidet-faqs">
                                {uni.faqs.map((faq, i) => (
                                    <div key={faq.q} className="unidet-faq">
                                        <button
                                            type="button"
                                            className="unidet-faq__question"
                                            aria-expanded={openFaq === i}
                                            aria-controls={`faq-${i}`}
                                            onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                        >
                                            <strong>{faq.q}</strong>
                                            <ChevronDown size={18} className={openFaq === i ? 'unidet-faq__chevron--open' : ''} />
                                        </button>
                                        {openFaq === i && <p className="unidet-faq__answer" id={`faq-${i}`}>{faq.a}</p>}
                                    </div>
                                ))}
                            </div>
                        </SectionReveal>
                    </section>
                </div>

                {/* Sidebar */}
                <aside className="unidet-sidebar">
                    <div className="unidet-apply-card">
                        <div className="unidet-apply-card__header">
                            <span className={`unidet-apply-card__status ${status.state === 'open' ? '' : 'unidet-apply-card__status--closed'}`}>
                                {status.state === 'open'
                                    ? fmt(t('universitiesPage.statusOpen'), { n: status.daysLeft })
                                    : fmt(t('universitiesPage.statusOpens'), { date: status.opensOn })}
                            </span>
                            <button
                                type="button"
                                className={`unidet-apply-card__heart ${isSaved ? 'unidet-apply-card__heart--active' : ''}`}
                                onClick={() => saved.toggle(uni.id)}
                                aria-pressed={isSaved}
                                aria-label={isSaved ? t('common.unsave') : t('common.save')}
                            >
                                <Heart size={18} fill={isSaved ? 'currentColor' : 'none'} />
                            </button>
                        </div>
                        <h2 className="unidet-apply-card__title">{t('uniDetail.readyToApply')}</h2>
                        <p className="unidet-apply-card__desc">
                            {fmt(t('uniDetail.windowText'), {
                                open: formatMonthDay(uni.admissionWindow.open),
                                close: formatMonthDay(uni.admissionWindow.close),
                            })}
                        </p>
                        <a className="btn btn--primary btn--md btn--full" href={uni.website} target="_blank" rel="noopener noreferrer">
                            {t('uniDetail.officialSite')} <ExternalLink size={16} aria-hidden="true" />
                        </a>
                        <button type="button" className="unidet-apply-card__save" onClick={() => saved.toggle(uni.id)}>
                            {isSaved ? t('uniDetail.savedToList') : t('uniDetail.saveForLater')}
                        </button>
                        {uni.ortScore !== null && uni.country === 'Kyrgyzstan' && (
                            <Link to="/ort-prep" className="unidet-apply-card__ort">{t('uniDetail.prepareOrt')} →</Link>
                        )}
                    </div>

                    <div className="unidet-office-card">
                        <h2 className="unidet-office-card__title">{t('uniDetail.officeHeading')}</h2>
                        <div className="unidet-office-card__item">
                            <Globe size={14} aria-hidden="true" />
                            <a href={uni.website} target="_blank" rel="noopener noreferrer">{uni.website.replace(/^https?:\/\//, '')}</a>
                        </div>
                        {uni.contact.email && (
                            <div className="unidet-office-card__item">
                                <Mail size={14} aria-hidden="true" />
                                <a href={`mailto:${uni.contact.email}`}>{uni.contact.email}</a>
                            </div>
                        )}
                        <div className="unidet-office-card__item">
                            <MapPin size={14} aria-hidden="true" />
                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${uni.name}, ${uni.contact.address}`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {uni.contact.address}
                            </a>
                        </div>
                    </div>

                    {similar.length > 0 && (
                        <div className="unidet-office-card">
                            <h2 className="unidet-office-card__title">{t('uniDetail.similar')}</h2>
                            <div className="unidet-similar">
                                {similar.map((u) => (
                                    <Link key={u.id} to={`/universities/${u.id}`} className="unidet-similar__item">
                                        <UniLogo className="unidet-similar__logo" src={u.logo} name={u.name} shortName={u.shortName} color={u.color} />
                                        <span>{u.name}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </aside>
            </div>
        </div>
    );
};

// Keyed by id so per-university state (checklist, open FAQ) resets when
// navigating from one university to another
const UniversityDetailPage = () => {
    const { id } = useParams();
    return <UniversityDetail key={id} id={id} />;
};

export default UniversityDetailPage;
