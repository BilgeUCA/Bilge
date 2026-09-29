import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
    ArrowLeft, Bookmark, CheckCircle2, ChevronDown, ExternalLink, Lightbulb, UserCheck, Wallet, Calendar, Link2,
} from 'lucide-react';
import SectionReveal from '../components/ui/SectionReveal';
import UniLogo from '../components/ui/UniLogo';
import { useTranslation } from '../i18n/useLanguage';
import { useSavedIds, useStoredState } from '../hooks/useStoredState';
import { getScholarship, scholarships } from '../data/scholarships';
import { getUniversity } from '../data/universities';
import { getAdmissionStatus, formatMonthDay } from '../utils/admission';
import { fmt } from '../utils/format';
import './UniversityDetailPage.css';
import './ScholarshipDetailPage.css';

const ScholarshipDetail = ({ id }) => {
    const { t } = useTranslation();
    const sch = getScholarship(id);
    const saved = useSavedIds('scholarships');
    const [checked, setChecked] = useStoredState(`bilge.checklist.sch.${id}`, []);
    const [openFaq, setOpenFaq] = useState(0);

    useEffect(() => {
        if (sch) document.title = `${sch.name} — BILGE`;
        return () => {
            document.title = 'BILGE — Higher Education in Kyrgyzstan';
        };
    }, [sch]);

    if (!sch) {
        return (
            <div className="unidet-page">
                <div className="container unidet-notfound">
                    <h1>{t('schDetail.notFound')}</h1>
                    <Link to="/scholarships" className="unidet-back">
                        <ArrowLeft size={16} /> {t('schDetail.back')}
                    </Link>
                </div>
            </div>
        );
    }

    const status = getAdmissionStatus(sch.window);
    const isSaved = saved.isSaved(sch.id);
    const relatedUnis = sch.universities.map(getUniversity).filter(Boolean);
    const others = scholarships.filter((s) => s.id !== sch.id).slice(0, 3);
    const toggleDoc = (doc) =>
        setChecked((prev) => (prev.includes(doc) ? prev.filter((d) => d !== doc) : [...prev, doc]));

    return (
        <div className="unidet-page">
            <div className="unidet-banner" style={{ background: `linear-gradient(135deg, ${sch.color}, ${sch.color}CC)` }}>
                {sch.photo && <img className="unidet-banner__photo" src={sch.photo} alt="" />}
                <div className="container">
                    <Link to="/scholarships" className="unidet-banner__back">
                        <ArrowLeft size={16} /> {t('schDetail.back')}
                    </Link>
                    <div className="unidet-banner__inner">
                        <UniLogo className="unidet-banner__logo" src={sch.logo} name={sch.name} shortName={sch.shortName} color={sch.color} />
                        <div className="unidet-banner__info">
                            <h1 className="unidet-banner__name">{sch.name}</h1>
                            <div className="unidet-banner__meta">
                                <span className="unidet-banner__meta-item">{sch.provider}</span>
                                <span className="unidet-banner__meta-item">
                                    <span aria-hidden="true">{sch.countryFlag}</span> {t(`scholarships.countries.${sch.countryKey}`)}
                                </span>
                            </div>
                        </div>
                        <div className="unidet-banner__badges">
                            <span className="unidet-banner__badge">{t(`scholarships.types.${sch.typeKey}`)}</span>
                            <span className="unidet-banner__badge">{t(`scholarships.funding.${sch.fundingKey}`)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container unidet-content">
                <div className="unidet-content__main">
                    <section className="unidet-section">
                        <SectionReveal>
                            <h2 className="unidet-section__title">{t('schDetail.about')}</h2>
                            <p className="unidet-section__text">{sch.about}</p>
                        </SectionReveal>
                    </section>

                    <section className="unidet-section">
                        <SectionReveal>
                            <div className="schdet-columns">
                                <div className="schdet-box">
                                    <h2 className="schdet-box__title"><Wallet size={18} aria-hidden="true" /> {t('schDetail.covers')}</h2>
                                    <ul className="schdet-list">
                                        {sch.covers.map((c) => (
                                            <li key={c}><CheckCircle2 size={16} aria-hidden="true" /> {c}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="schdet-box">
                                    <h2 className="schdet-box__title"><UserCheck size={18} aria-hidden="true" /> {t('schDetail.eligibility')}</h2>
                                    <ul className="schdet-list schdet-list--neutral">
                                        {sch.eligibility.map((c) => (
                                            <li key={c}><CheckCircle2 size={16} aria-hidden="true" /> {c}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </SectionReveal>
                    </section>

                    <section className="unidet-section">
                        <SectionReveal>
                            <h2 className="unidet-section__title">{t('uniDetail.howToApply')}</h2>
                            <ol className="unidet-steps">
                                {sch.steps.map((step, i) => (
                                    <li key={step.title} className="unidet-step">
                                        <span className="unidet-step__num">{i + 1}</span>
                                        <div>
                                            <h3 className="unidet-step__title">{step.title}</h3>
                                            <p className="unidet-step__text">{step.text}</p>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </SectionReveal>
                    </section>

                    <section className="unidet-section">
                        <SectionReveal>
                            <div className="unidet-section__header">
                                <h2 className="unidet-section__title">{t('uniDetail.requiredDocs')}</h2>
                                <span className="unidet-intake-badge">
                                    {fmt(t('uniDetail.docsProgress'), { done: checked.filter((d) => sch.documents.includes(d)).length, total: sch.documents.length })}
                                </span>
                            </div>
                            <p className="unidet-section__hint">{t('uniDetail.docsHint')}</p>
                            <ul className="unidet-checklist">
                                {sch.documents.map((doc) => (
                                    <li key={doc}>
                                        <label className="unidet-checklist__item">
                                            <input type="checkbox" checked={checked.includes(doc)} onChange={() => toggleDoc(doc)} />
                                            <span>{doc}</span>
                                        </label>
                                    </li>
                                ))}
                            </ul>

                            <div className="unidet-callout">
                                <Lightbulb size={20} aria-hidden="true" />
                                <div>
                                    <strong>{t('schDetail.tips')}</strong>
                                    <ul className="schdet-tips">
                                        {sch.tips.map((tip) => <li key={tip}>{tip}</li>)}
                                    </ul>
                                </div>
                            </div>
                        </SectionReveal>
                    </section>

                    <section className="unidet-section">
                        <SectionReveal>
                            <h2 className="unidet-section__title">{t('uniDetail.faqHeading')}</h2>
                            <div className="unidet-faqs">
                                {sch.faqs.map((faq, i) => (
                                    <div key={faq.q} className="unidet-faq">
                                        <button
                                            type="button"
                                            className="unidet-faq__question"
                                            aria-expanded={openFaq === i}
                                            aria-controls={`sch-faq-${i}`}
                                            onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                        >
                                            <strong>{faq.q}</strong>
                                            <ChevronDown size={18} className={openFaq === i ? 'unidet-faq__chevron--open' : ''} />
                                        </button>
                                        {openFaq === i && <p className="unidet-faq__answer" id={`sch-faq-${i}`}>{faq.a}</p>}
                                    </div>
                                ))}
                            </div>
                        </SectionReveal>
                    </section>

                    {relatedUnis.length > 0 && (
                        <section className="unidet-section">
                            <SectionReveal>
                                <h2 className="unidet-section__title">{t('schDetail.relatedUnis')}</h2>
                                <div className="unidet-related">
                                    {relatedUnis.map((u) => (
                                        <Link key={u.id} to={`/universities/${u.id}`} className="unidet-related__item">
                                            <UniLogo className="unidet-related__logo" src={u.logo} name={u.name} shortName={u.shortName} color={u.color} />
                                            <span>
                                                <strong>{u.name}</strong>
                                                <small>{u.city}, {t(`universitiesPage.countries.${u.country}`)}</small>
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </SectionReveal>
                        </section>
                    )}
                </div>

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
                                className={`unidet-apply-card__heart ${isSaved ? 'schdet-bookmark--active' : ''}`}
                                onClick={() => saved.toggle(sch.id)}
                                aria-pressed={isSaved}
                                aria-label={isSaved ? t('common.unsave') : t('common.save')}
                            >
                                <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} />
                            </button>
                        </div>
                        <h2 className="unidet-apply-card__title">{t('uniDetail.readyToApply')}</h2>
                        <p className="unidet-apply-card__desc schdet-window">
                            <Calendar size={14} aria-hidden="true" />
                            {fmt(t('uniDetail.windowText'), { open: formatMonthDay(sch.window.open), close: formatMonthDay(sch.window.close) })}
                        </p>
                        <a className="btn btn--primary btn--md btn--full" href={sch.officialUrl} target="_blank" rel="noopener noreferrer">
                            {t('uniDetail.officialSite')} <ExternalLink size={16} aria-hidden="true" />
                        </a>
                        <button type="button" className="unidet-apply-card__save" onClick={() => saved.toggle(sch.id)}>
                            {isSaved ? t('uniDetail.savedToList') : t('uniDetail.saveForLater')}
                        </button>
                        <p className="schdet-note">{t('schDetail.verifyNote')}</p>
                    </div>

                    {sch.extraLinks && (
                        <div className="unidet-office-card">
                            <h2 className="unidet-office-card__title">{t('schDetail.usefulLinks')}</h2>
                            {sch.extraLinks.map((l) => (
                                <div key={l.url} className="unidet-office-card__item">
                                    <Link2 size={14} aria-hidden="true" />
                                    <a href={l.url} target="_blank" rel="noopener noreferrer">{l.label}</a>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="unidet-office-card">
                        <h2 className="unidet-office-card__title">{t('schDetail.otherPrograms')}</h2>
                        <div className="unidet-similar">
                            {others.map((s) => (
                                <Link key={s.id} to={`/scholarships/${s.id}`} className="unidet-similar__item">
                                    <UniLogo className="unidet-similar__logo" src={s.logo} name={s.name} shortName={s.shortName} color={s.color} />
                                    <span>{s.name}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

const ScholarshipDetailPage = () => {
    const { id } = useParams();
    return <ScholarshipDetail key={id} id={id} />;
};

export default ScholarshipDetailPage;
