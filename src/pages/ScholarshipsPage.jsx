import { Link, useSearchParams } from 'react-router-dom';
import { Search, Bookmark, Calendar, Globe, Award, ArrowRight, Briefcase, FileCheck, Layers, BookOpen } from 'lucide-react';
import SectionReveal from '../components/ui/SectionReveal';
import UniLogo from '../components/ui/UniLogo';
import { useTranslation } from '../i18n/useLanguage';
import { useSavedIds } from '../hooks/useStoredState';
import { scholarships, DESTINATIONS, LEVELS, FUNDING } from '../data/scholarships';
import { getAdmissionStatus, formatMonthDay } from '../utils/admission';
import { fmt } from '../utils/format';
import './ScholarshipsPage.css';

const FUNDING_CLASS = {
    success: 'sch-card__tag--success',
    warning: 'sch-card__tag--warning',
    info: 'sch-card__tag--info',
};

const META_ICONS = {
    AGE: Award,
    LANGUAGE: Globe,
    EXPERIENCE: Briefcase,
    TYPE: Layers,
    REQUIREMENT: FileCheck,
};

const ScholarshipsPage = () => {
    const { t } = useTranslation();
    const [params, setParams] = useSearchParams();
    const saved = useSavedIds('scholarships');

    const query = params.get('q') || '';
    const destination = params.get('destination') || '';
    const level = params.get('level') || '';
    const funding = params.get('funding') || '';
    const savedOnly = params.get('saved') === '1';

    const update = (key, value) => {
        const next = new URLSearchParams(params);
        if (value) next.set(key, value);
        else next.delete(key);
        setParams(next, { replace: true });
    };

    const filtered = scholarships.filter((s) => {
        const q = query.trim().toLowerCase();
        if (q) {
            const haystack = [s.name, s.shortName, s.provider, s.summary, t(`scholarships.countries.${s.countryKey}`), t(`scholarships.types.${s.typeKey}`)]
                .join(' ')
                .toLowerCase();
            if (!haystack.includes(q)) return false;
        }
        if (destination && s.countryKey !== destination) return false;
        // "Bachelor/Master" programs also match a Master's or Undergraduate search
        if (level) {
            const matchesCombined = s.typeKey === 'Bachelor/Master' && (level === "Master's" || level === 'Undergraduate');
            if (s.typeKey !== level && !matchesCombined) return false;
        }
        if (funding && s.fundingKey !== funding) return false;
        if (savedOnly && !saved.ids.includes(s.id)) return false;
        return true;
    });

    const hasFilters = Boolean(query || destination || level || funding || savedOnly);

    return (
        <div className="sch-page">
            <section className="sch-page__hero">
                <div className="container">
                    <SectionReveal>
                        <div className="sch-page__hero-content">
                            <div>
                                <h1 className="sch-page__title">{t('scholarships.title')}</h1>
                                <p className="sch-page__subtitle">{t('scholarships.subtitle')}</p>
                            </div>
                            <div className="sch-page__ort-banner">
                                <div className="sch-page__ort-icon" aria-hidden="true"><BookOpen size={22} /></div>
                                <div>
                                    <strong>{t('scholarships.prepareOrt')}</strong>
                                    <span>{t('scholarships.prepareOrtSub')}</span>
                                </div>
                                <Link to="/ort-prep" className="sch-page__ort-btn">{t('scholarships.start')}</Link>
                            </div>
                        </div>
                    </SectionReveal>

                    <SectionReveal delay={150}>
                        <div className="sch-page__controls">
                            <label className="sch-page__search">
                                <Search size={18} aria-hidden="true" />
                                <span className="sr-only">{t('scholarships.searchLabel')}</span>
                                <input
                                    type="search"
                                    placeholder={t('scholarships.searchPlaceholder')}
                                    value={query}
                                    onChange={(e) => update('q', e.target.value)}
                                    id="scholarship-search"
                                    enterKeyHint="search"
                                />
                            </label>
                            <div className="sch-page__dropdowns">
                                <label className="sch-page__select">
                                    <span className="sr-only">{t('scholarships.destination')}</span>
                                    <select value={destination} onChange={(e) => update('destination', e.target.value)}>
                                        <option value="">{t('scholarships.destinationAll')}</option>
                                        {DESTINATIONS.map((d) => (
                                            <option key={d} value={d}>{t(`scholarships.countries.${d}`)}</option>
                                        ))}
                                    </select>
                                </label>
                                <label className="sch-page__select">
                                    <span className="sr-only">{t('scholarships.level')}</span>
                                    <select value={level} onChange={(e) => update('level', e.target.value)}>
                                        <option value="">{t('scholarships.levelAll')}</option>
                                        {LEVELS.map((l) => (
                                            <option key={l} value={l}>{t(`scholarships.types.${l}`)}</option>
                                        ))}
                                    </select>
                                </label>
                                <label className="sch-page__select">
                                    <span className="sr-only">{t('scholarships.fundingLabel')}</span>
                                    <select value={funding} onChange={(e) => update('funding', e.target.value)}>
                                        <option value="">{t('scholarships.fundingAny')}</option>
                                        {FUNDING.map((f) => (
                                            <option key={f} value={f}>{t(`scholarships.funding.${f}`)}</option>
                                        ))}
                                    </select>
                                </label>
                                <button
                                    type="button"
                                    className={`sch-page__dropdown sch-page__dropdown--icon ${savedOnly ? 'sch-page__dropdown--active' : ''}`}
                                    aria-pressed={savedOnly}
                                    onClick={() => update('saved', savedOnly ? '' : '1')}
                                >
                                    <Bookmark size={16} fill={savedOnly ? 'currentColor' : 'none'} />
                                    {t('scholarships.savedOnly')} ({saved.ids.length})
                                </button>
                            </div>
                        </div>
                    </SectionReveal>
                </div>
            </section>

            <section className="sch-page__list">
                <div className="container">
                    <p className="sch-page__count" aria-live="polite">
                        {fmt(t('scholarships.countText'), { n: filtered.length, total: scholarships.length })}
                        {hasFilters && (
                            <button type="button" className="sch-page__clear" onClick={() => setParams({}, { replace: true })}>
                                {t('universitiesPage.clearAll')}
                            </button>
                        )}
                    </p>
                    <div className="sch-page__grid">
                        {filtered.map((sch, index) => {
                            const status = getAdmissionStatus(sch.window);
                            const isSaved = saved.isSaved(sch.id);
                            const MetaIcon = META_ICONS[sch.meta.labelKey] || Globe;
                            return (
                                <SectionReveal key={sch.id} delay={index * 80}>
                                    <article className="sch-card" id={`scholarship-${sch.id}`}>
                                        <div className="sch-card__image" style={{ background: `linear-gradient(135deg, ${sch.color}, ${sch.color}BB)` }}>
                                            {sch.photo && <img className="sch-card__photo" src={sch.photo} alt="" loading="lazy" />}
                                            <span className="sch-card__country">
                                                <span aria-hidden="true">{sch.countryFlag}</span> {t(`scholarships.countries.${sch.countryKey}`)}
                                            </span>
                                            <button
                                                type="button"
                                                className={`sch-card__bookmark ${isSaved ? 'sch-card__bookmark--active' : ''}`}
                                                onClick={() => saved.toggle(sch.id)}
                                                aria-pressed={isSaved}
                                                aria-label={`${isSaved ? t('common.unsave') : t('common.save')}: ${sch.name}`}
                                            >
                                                <Bookmark size={16} fill={isSaved ? 'currentColor' : 'none'} />
                                            </button>
                                            <UniLogo className="sch-card__logo" src={sch.logo} name={sch.name} shortName={sch.shortName} color={sch.color} />
                                        </div>
                                        <div className="sch-card__body">
                                            <div className="sch-card__tags">
                                                <span className="sch-card__tag sch-card__tag--type">{t(`scholarships.types.${sch.typeKey}`)}</span>
                                                <span className={`sch-card__tag ${FUNDING_CLASS[sch.fundingColor]}`}>{t(`scholarships.funding.${sch.fundingKey}`)}</span>
                                            </div>
                                            <h3 className="sch-card__name">
                                                <Link to={`/scholarships/${sch.id}`} className="sch-card__name-link">{sch.name}</Link>
                                            </h3>
                                            <p className="sch-card__desc">{sch.summary}</p>
                                            <div className="sch-card__meta-row">
                                                <div className="sch-card__meta-item">
                                                    <span className="sch-card__meta-label">
                                                        <Calendar size={13} aria-hidden="true" /> {t('scholarships.metaLabels.WINDOW')}
                                                    </span>
                                                    <span className="sch-card__meta-value">
                                                        {formatMonthDay(sch.window.open)} – {formatMonthDay(sch.window.close)}
                                                    </span>
                                                </div>
                                                <div className="sch-card__meta-item">
                                                    <span className="sch-card__meta-label">
                                                        <MetaIcon size={13} aria-hidden="true" /> {t(`scholarships.metaLabels.${sch.meta.labelKey}`)}
                                                    </span>
                                                    <span className="sch-card__meta-value">
                                                        {sch.meta.valueKey ? t(`scholarships.metaValues.${sch.meta.valueKey}`) : sch.meta.value}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="sch-card__footer">
                                                <span className={`sch-card__status ${status.state === 'open' ? 'sch-card__status--open' : ''}`}>
                                                    {status.state === 'open'
                                                        ? fmt(t('universitiesPage.statusOpen'), { n: status.daysLeft })
                                                        : fmt(t('universitiesPage.statusOpens'), { date: status.opensOn })}
                                                </span>
                                                <Link to={`/scholarships/${sch.id}`} className="sch-card__view-btn" aria-label={`${t('scholarships.viewDetails')}: ${sch.name}`}>
                                                    {t('scholarships.viewDetails')} <ArrowRight size={14} aria-hidden="true" />
                                                </Link>
                                            </div>
                                        </div>
                                    </article>
                                </SectionReveal>
                            );
                        })}
                    </div>

                    {filtered.length === 0 && (
                        <div className="sch-page__empty">
                            <p>{t('scholarships.emptyMessage')}</p>
                            <button type="button" className="uni-page__empty-btn" onClick={() => setParams({}, { replace: true })}>
                                {t('universitiesPage.clearFilters')}
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default ScholarshipsPage;
