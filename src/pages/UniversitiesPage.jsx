import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
    Search, MapPin, Heart, DollarSign, BookOpen, ChevronLeft, ChevronRight, SlidersHorizontal, Trophy, X,
} from 'lucide-react';
import SectionReveal from '../components/ui/SectionReveal';
import UniLogo from '../components/ui/UniLogo';
import { useTranslation } from '../i18n/useLanguage';
import { useSavedIds } from '../hooks/useStoredState';
import { universities, COUNTRIES, LANGUAGES, TYPES } from '../data/universities';
import { getAdmissionStatus } from '../utils/admission';
import { fmt, formatUsd } from '../utils/format';
import './UniversitiesPage.css';

const SORT_KEYS = ['topRanking', 'lowestTuition', 'highestTuition', 'nameAZ'];
const ITEMS_PER_PAGE = 6;

// Filters live in the URL so results are shareable and the back button works
const readList = (params, key) => (params.get(key) ? params.get(key).split(',') : []);

const UniversitiesPage = () => {
    const { t } = useTranslation();
    const [params, setParams] = useSearchParams();
    const [filtersOpen, setFiltersOpen] = useState(false);
    const saved = useSavedIds('universities');

    // `?abroad=true` (home page "Study Abroad" link) = every non-Kyrgyz country
    const selectedCountries = params.get('abroad') === 'true'
        ? COUNTRIES.filter((c) => c !== 'Kyrgyzstan')
        : readList(params, 'country');
    const selectedLanguages = readList(params, 'lang');
    const selectedTypes = readList(params, 'type');
    const query = params.get('q') || '';
    const minTuition = params.get('min') || '';
    const maxTuition = params.get('max') || '';
    const sortKey = SORT_KEYS.includes(params.get('sort')) ? params.get('sort') : 'topRanking';
    const openOnly = params.get('open') === '1';
    const savedOnly = params.get('saved') === '1';
    const currentPage = Math.max(1, Number(params.get('page')) || 1);

    const update = (changes, { keepPage = false } = {}) => {
        const next = new URLSearchParams(params);
        next.delete('abroad');
        if (params.get('abroad') === 'true' && !('country' in changes)) {
            next.set('country', selectedCountries.join(','));
        }
        Object.entries(changes).forEach(([key, value]) => {
            const empty = value === '' || value === null || value === false || (Array.isArray(value) && value.length === 0);
            if (empty) next.delete(key);
            else next.set(key, Array.isArray(value) ? value.join(',') : String(value === true ? 1 : value));
        });
        if (!keepPage) next.delete('page');
        setParams(next, { replace: true });
    };

    const toggleIn = (list, value) => (list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

    const withStatus = useMemo(
        () => universities.map((uni) => ({ ...uni, status: getAdmissionStatus(uni.admissionWindow) })),
        []
    );

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        const min = minTuition === '' ? null : Number(minTuition);
        const max = maxTuition === '' ? null : Number(maxTuition);

        const list = withStatus.filter((uni) => {
            if (q) {
                const haystack = [uni.name, uni.shortName, uni.city, uni.country, ...uni.majors].join(' ').toLowerCase();
                if (!haystack.includes(q)) return false;
            }
            if (selectedCountries.length && !selectedCountries.includes(uni.country)) return false;
            if (selectedLanguages.length && !uni.languages.some((l) => selectedLanguages.includes(l))) return false;
            if (selectedTypes.length && !selectedTypes.includes(uni.type)) return false;
            if ((min !== null || max !== null) && uni.tuitionUsd === null) return false;
            if (min !== null && uni.tuitionUsd < min) return false;
            if (max !== null && uni.tuitionUsd > max) return false;
            if (openOnly && uni.status.state !== 'open') return false;
            if (savedOnly && !saved.ids.includes(uni.id)) return false;
            return true;
        });

        // Unknown tuition always sorts last
        const tuition = (u, fallback) => (u.tuitionUsd === null ? fallback : u.tuitionUsd);
        const sorters = {
            topRanking: (a, b) => a.rank - b.rank,
            lowestTuition: (a, b) => tuition(a, Infinity) - tuition(b, Infinity) || a.rank - b.rank,
            highestTuition: (a, b) => tuition(b, -Infinity) - tuition(a, -Infinity) || a.rank - b.rank,
            nameAZ: (a, b) => a.name.localeCompare(b.name),
        };
        return [...list].sort(sorters[sortKey]);
    }, [withStatus, query, selectedCountries, selectedLanguages, selectedTypes, minTuition, maxTuition, openOnly, savedOnly, saved.ids, sortKey]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
    const page = Math.min(currentPage, totalPages);
    const pageItems = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    const countByCountry = (country) => universities.filter((u) => u.country === country).length;

    const activeFilterCount =
        selectedCountries.length + selectedLanguages.length + selectedTypes.length +
        (query ? 1 : 0) + (minTuition ? 1 : 0) + (maxTuition ? 1 : 0) + (openOnly ? 1 : 0) + (savedOnly ? 1 : 0);

    const clearFilters = () => setParams(new URLSearchParams(sortKey !== 'topRanking' ? { sort: sortKey } : {}), { replace: true });

    const goToPage = (n) => {
        update({ page: n === 1 ? '' : n }, { keepPage: true });
        document.getElementById('uni-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    // Compact page list: 1 … (p-1) p (p+1) … last
    const pageNumbers = useMemo(() => {
        const set = new Set([1, totalPages, page - 1, page, page + 1]);
        const nums = [...set].filter((n) => n >= 1 && n <= totalPages).sort((a, b) => a - b);
        const out = [];
        nums.forEach((n, i) => {
            if (i > 0 && n - nums[i - 1] > 1) out.push(`gap-${n}`);
            out.push(n);
        });
        return out;
    }, [page, totalPages]);

    const renderTuition = (uni) => {
        if (uni.tuitionUsd === null) return t('universitiesPage.tuition.varies');
        if (uni.tuitionUsd === 0) return t('universitiesPage.tuition.free');
        return `≈ ${formatUsd(uni.tuitionUsd)} ${t('universitiesPage.perYear')}`;
    };

    const renderStatus = (status) =>
        status.state === 'open'
            ? fmt(t('universitiesPage.statusOpen'), { n: status.daysLeft })
            : fmt(t('universitiesPage.statusOpens'), { date: status.opensOn });

    return (
        <div className="uni-page">
            <section className="uni-page__hero">
                <div className="container">
                    <SectionReveal>
                        <h1 className="uni-page__title">{t('universitiesPage.title')}</h1>
                        <p className="uni-page__subtitle">
                            {fmt(t('universitiesPage.subtitle'), {
                                kg: countByCountry('Kyrgyzstan'),
                                abroad: universities.length - countByCountry('Kyrgyzstan'),
                            })}
                        </p>
                    </SectionReveal>
                </div>
            </section>

            <section className="uni-page__content">
                <div className="container uni-page__layout">
                    <button
                        type="button"
                        className="uni-page__filters-toggle"
                        aria-expanded={filtersOpen}
                        aria-controls="filters-sidebar"
                        onClick={() => setFiltersOpen((o) => !o)}
                    >
                        <SlidersHorizontal size={16} />
                        {t('universitiesPage.filters')}
                        {activeFilterCount > 0 && <span className="uni-page__filters-count">{activeFilterCount}</span>}
                    </button>

                    <aside className={`uni-filters ${filtersOpen ? 'uni-filters--open' : ''}`} id="filters-sidebar">
                        <div className="uni-filters__header">
                            <h2 className="uni-filters__title">{t('universitiesPage.filters')}</h2>
                            <button
                                type="button"
                                className="uni-filters__clear"
                                onClick={clearFilters}
                                disabled={activeFilterCount === 0}
                            >
                                {t('universitiesPage.clearAll')}
                            </button>
                        </div>

                        <div className="uni-filters__group">
                            <label className="uni-filters__label" htmlFor="university-search">
                                {t('universitiesPage.keyword')}
                            </label>
                            <div className="uni-filters__search">
                                <Search size={16} aria-hidden="true" />
                                <input
                                    type="search"
                                    placeholder={t('universitiesPage.keywordPlaceholder')}
                                    value={query}
                                    onChange={(e) => update({ q: e.target.value })}
                                    id="university-search"
                                    enterKeyHint="search"
                                />
                            </div>
                        </div>

                        <fieldset className="uni-filters__group">
                            <legend className="uni-filters__label">{t('universitiesPage.country')}</legend>
                            <div className="uni-filters__checkboxes">
                                {COUNTRIES.map((country) => (
                                    <label key={country} className="uni-filters__checkbox">
                                        <input
                                            type="checkbox"
                                            checked={selectedCountries.includes(country)}
                                            onChange={() => update({ country: toggleIn(selectedCountries, country) })}
                                        />
                                        <span className="uni-filters__checkbox-label">
                                            {t(`universitiesPage.countries.${country}`)}
                                        </span>
                                        <span className="uni-filters__checkbox-count">{countByCountry(country)}</span>
                                    </label>
                                ))}
                            </div>
                        </fieldset>

                        <fieldset className="uni-filters__group">
                            <legend className="uni-filters__label">{t('universitiesPage.annualTuition')}</legend>
                            <div className="uni-filters__range">
                                <label className="uni-filters__range-input">
                                    <span aria-hidden="true">$</span>
                                    <span className="sr-only">{t('universitiesPage.min')}</span>
                                    <input
                                        type="number"
                                        inputMode="numeric"
                                        min="0"
                                        step="100"
                                        placeholder={t('universitiesPage.min')}
                                        value={minTuition}
                                        onChange={(e) => update({ min: e.target.value })}
                                    />
                                </label>
                                <span className="uni-filters__range-sep" aria-hidden="true">–</span>
                                <label className="uni-filters__range-input">
                                    <span aria-hidden="true">$</span>
                                    <span className="sr-only">{t('universitiesPage.max')}</span>
                                    <input
                                        type="number"
                                        inputMode="numeric"
                                        min="0"
                                        step="100"
                                        placeholder={t('universitiesPage.max')}
                                        value={maxTuition}
                                        onChange={(e) => update({ max: e.target.value })}
                                    />
                                </label>
                            </div>
                            <div className="uni-filters__presets">
                                <button type="button" className="uni-filters__preset" onClick={() => update({ min: '', max: 0 })}>
                                    {t('universitiesPage.tuition.free')}
                                </button>
                                <button type="button" className="uni-filters__preset" onClick={() => update({ min: '', max: 1000 })}>
                                    ≤ $1,000
                                </button>
                                <button type="button" className="uni-filters__preset" onClick={() => update({ min: '', max: 3000 })}>
                                    ≤ $3,000
                                </button>
                            </div>
                        </fieldset>

                        <fieldset className="uni-filters__group">
                            <legend className="uni-filters__label">{t('universitiesPage.languageOfInstruction')}</legend>
                            <div className="uni-filters__tags">
                                {LANGUAGES.map((lang) => (
                                    <button
                                        type="button"
                                        key={lang}
                                        aria-pressed={selectedLanguages.includes(lang)}
                                        className={`uni-filters__tag ${selectedLanguages.includes(lang) ? 'uni-filters__tag--active' : ''}`}
                                        onClick={() => update({ lang: toggleIn(selectedLanguages, lang) })}
                                    >
                                        {t(`universitiesPage.languages.${lang}`)}
                                    </button>
                                ))}
                            </div>
                        </fieldset>

                        <fieldset className="uni-filters__group">
                            <legend className="uni-filters__label">{t('universitiesPage.typeLabel')}</legend>
                            <div className="uni-filters__tags">
                                {TYPES.map((type) => (
                                    <button
                                        type="button"
                                        key={type}
                                        aria-pressed={selectedTypes.includes(type)}
                                        className={`uni-filters__tag ${selectedTypes.includes(type) ? 'uni-filters__tag--active' : ''}`}
                                        onClick={() => update({ type: toggleIn(selectedTypes, type) })}
                                    >
                                        {t(`universitiesPage.types.${type}`)}
                                    </button>
                                ))}
                            </div>
                        </fieldset>

                        <fieldset className="uni-filters__group">
                            <legend className="uni-filters__label">{t('universitiesPage.more')}</legend>
                            <div className="uni-filters__checkboxes">
                                <label className="uni-filters__checkbox">
                                    <input type="checkbox" checked={openOnly} onChange={(e) => update({ open: e.target.checked })} />
                                    <span className="uni-filters__checkbox-label">{t('universitiesPage.openOnly')}</span>
                                </label>
                                <label className="uni-filters__checkbox">
                                    <input type="checkbox" checked={savedOnly} onChange={(e) => update({ saved: e.target.checked })} />
                                    <span className="uni-filters__checkbox-label">{t('universitiesPage.savedOnly')}</span>
                                    <span className="uni-filters__checkbox-count">{saved.ids.length}</span>
                                </label>
                            </div>
                        </fieldset>
                    </aside>

                    <div className="uni-page__main" id="uni-results">
                        <div className="uni-page__toolbar">
                            <p className="uni-page__results-count" aria-live="polite">
                                {t('universitiesPage.showing')} <strong>{filtered.length}</strong> {t('universitiesPage.of')}{' '}
                                <strong>{universities.length}</strong> {t('universitiesPage.universitiesWord')}
                            </p>
                            <label className="uni-page__sort">
                                <span>{t('universitiesPage.sortBy')}</span>
                                <select value={sortKey} onChange={(e) => update({ sort: e.target.value === 'topRanking' ? '' : e.target.value })} id="sort-select">
                                    {SORT_KEYS.map((key) => (
                                        <option key={key} value={key}>{t(`universitiesPage.sortOptions.${key}`)}</option>
                                    ))}
                                </select>
                            </label>
                        </div>

                        {activeFilterCount > 0 && (
                            <div className="uni-page__chips">
                                {selectedCountries.map((c) => (
                                    <button type="button" key={c} className="uni-page__chip" onClick={() => update({ country: toggleIn(selectedCountries, c) })}>
                                        {t(`universitiesPage.countries.${c}`)} <X size={12} aria-hidden="true" />
                                    </button>
                                ))}
                                {selectedLanguages.map((l) => (
                                    <button type="button" key={l} className="uni-page__chip" onClick={() => update({ lang: toggleIn(selectedLanguages, l) })}>
                                        {t(`universitiesPage.languages.${l}`)} <X size={12} aria-hidden="true" />
                                    </button>
                                ))}
                                {selectedTypes.map((ty) => (
                                    <button type="button" key={ty} className="uni-page__chip" onClick={() => update({ type: toggleIn(selectedTypes, ty) })}>
                                        {t(`universitiesPage.types.${ty}`)} <X size={12} aria-hidden="true" />
                                    </button>
                                ))}
                                {(minTuition || maxTuition) && (
                                    <button type="button" className="uni-page__chip" onClick={() => update({ min: '', max: '' })}>
                                        ${minTuition || 0} – {maxTuition === '' ? '∞' : `$${maxTuition}`} <X size={12} aria-hidden="true" />
                                    </button>
                                )}
                            </div>
                        )}

                        <p className="uni-page__disclaimer">{t('universitiesPage.disclaimer')}</p>

                        <div className="uni-page__grid">
                            {pageItems.map((uni, index) => {
                                const isSaved = saved.isSaved(uni.id);
                                return (
                                    <SectionReveal key={uni.id} delay={index * 60}>
                                        <article className="uni-card" id={`uni-card-${uni.id}`}>
                                            <div
                                                className="uni-card__image"
                                                style={{ background: `linear-gradient(135deg, ${uni.color}, ${uni.color}CC)` }}
                                            >
                                                {uni.photo && <img className="uni-card__photo" src={uni.photo} alt="" loading="lazy" />}
                                                <span className="uni-card__rank" title={t('universitiesPage.rankHint')}>
                                                    <Trophy size={12} aria-hidden="true" /> #{uni.rank}
                                                </span>
                                                <button
                                                    type="button"
                                                    className={`uni-card__fav ${isSaved ? 'uni-card__fav--active' : ''}`}
                                                    onClick={() => saved.toggle(uni.id)}
                                                    aria-pressed={isSaved}
                                                    aria-label={`${isSaved ? t('common.unsave') : t('common.save')}: ${uni.name}`}
                                                >
                                                    <Heart size={18} fill={isSaved ? 'currentColor' : 'none'} />
                                                </button>
                                                <UniLogo
                                                    className="uni-card__logo"
                                                    src={uni.logo}
                                                    name={uni.name}
                                                    shortName={uni.shortName}
                                                    color={uni.color}
                                                />
                                            </div>
                                            <div className="uni-card__body">
                                                <h3 className="uni-card__name">
                                                    <Link to={`/universities/${uni.id}`} className="uni-card__name-link">{uni.name}</Link>
                                                </h3>
                                                <div className="uni-card__detail">
                                                    <MapPin size={14} aria-hidden="true" />
                                                    <div className="uni-card__detail-content">
                                                        <span className="uni-card__detail-label">{t('universitiesPage.cardLabels.location')}</span>
                                                        <span className="uni-card__detail-value">
                                                            {uni.city}, {t(`universitiesPage.countries.${uni.country}`)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="uni-card__detail">
                                                    <DollarSign size={14} aria-hidden="true" />
                                                    <div className="uni-card__detail-content">
                                                        <span className="uni-card__detail-label">{t('universitiesPage.cardLabels.tuition')}</span>
                                                        <span className={`uni-card__detail-value ${uni.tuitionUsd === 0 ? 'uni-card__free' : ''}`}>
                                                            {renderTuition(uni)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="uni-card__detail">
                                                    <BookOpen size={14} aria-hidden="true" />
                                                    <div className="uni-card__detail-content">
                                                        <span className="uni-card__detail-label">{t('universitiesPage.cardLabels.majors')}</span>
                                                        <span className="uni-card__detail-value">{uni.majors.slice(0, 3).join(', ')}</span>
                                                    </div>
                                                </div>
                                                <div className="uni-card__bottom">
                                                    <div className="uni-card__languages">
                                                        {uni.languages.map((lang) => (
                                                            <span key={lang} className="uni-card__lang-tag" title={t(`universitiesPage.languages.${lang}`)}>
                                                                {lang.slice(0, 2).toUpperCase()}
                                                            </span>
                                                        ))}
                                                    </div>
                                                    <span className={`uni-card__deadline ${uni.status.state === 'open' ? 'uni-card__deadline--success' : ''}`}>
                                                        {renderStatus(uni.status)}
                                                    </span>
                                                </div>
                                                <Link to={`/universities/${uni.id}`} className="uni-card__view-btn" tabIndex={-1} aria-hidden="true">
                                                    {t('universitiesPage.viewDetails')}
                                                </Link>
                                            </div>
                                        </article>
                                    </SectionReveal>
                                );
                            })}
                        </div>

                        {filtered.length === 0 && (
                            <div className="uni-page__empty">
                                <p>{savedOnly && saved.ids.length === 0 ? t('universitiesPage.noSaved') : t('universitiesPage.emptyMessage')}</p>
                                <button type="button" onClick={clearFilters} className="uni-page__empty-btn">
                                    {t('universitiesPage.clearFilters')}
                                </button>
                            </div>
                        )}

                        {totalPages > 1 && (
                            <nav className="uni-page__pagination" aria-label={t('universitiesPage.pagination')}>
                                <button
                                    type="button"
                                    className="uni-page__page-btn uni-page__page-arrow"
                                    disabled={page === 1}
                                    onClick={() => goToPage(page - 1)}
                                    aria-label={t('universitiesPage.prevPage')}
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                {pageNumbers.map((n) =>
                                    typeof n === 'string' ? (
                                        <span key={n} className="uni-page__page-dots" aria-hidden="true">…</span>
                                    ) : (
                                        <button
                                            type="button"
                                            key={n}
                                            className={`uni-page__page-btn ${page === n ? 'uni-page__page-btn--active' : ''}`}
                                            aria-current={page === n ? 'page' : undefined}
                                            onClick={() => goToPage(n)}
                                        >
                                            {n}
                                        </button>
                                    )
                                )}
                                <button
                                    type="button"
                                    className="uni-page__page-btn uni-page__page-arrow"
                                    disabled={page === totalPages}
                                    onClick={() => goToPage(page + 1)}
                                    aria-label={t('universitiesPage.nextPage')}
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </nav>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default UniversitiesPage;
