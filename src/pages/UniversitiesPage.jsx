import { useMemo, useState } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import {
    Search, MapPin, Heart, DollarSign, BookOpen, ChevronLeft, ChevronRight, SlidersHorizontal, Trophy, X,
} from 'lucide-react';
import SectionReveal from '../components/ui/SectionReveal';
import UniLogo from '../components/ui/UniLogo';
import LoadState from '../components/ui/LoadState';
import { useTranslation } from '../i18n/useLanguage';
import { useAuth } from '../auth/authContext';
import { useApi } from '../api/useApi';
import { useSavedIds } from '../hooks/usePersonalData';
import { useDebounced } from '../hooks/useDebounced';
import { fmt, formatUsd } from '../utils/format';
import './UniversitiesPage.css';

const SORT_KEYS = ['topRanking', 'lowestTuition', 'highestTuition', 'nameAZ'];
const ITEMS_PER_PAGE = 6;
const NUMBER = /^\d+(\.\d+)?$/;

// Filters live in the URL so results are shareable and the back button works
const readList = (params, key) => (params.get(key) ? params.get(key).split(',') : []);

const UniversitiesPage = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [params, setParams] = useSearchParams();
    const [filtersOpen, setFiltersOpen] = useState(false);
    const saved = useSavedIds('universities');
    const { data: options } = useApi('/universities/filters');
    const countries = options?.countries.map((c) => c.value) ?? [];
    const languages = options?.languages ?? [];
    const types = options?.types ?? [];

    // `?abroad=true` (home page "Study Abroad" link) = every non-Kyrgyz country
    const selectedCountries = params.get('abroad') === 'true'
        ? countries.filter((c) => c !== 'Kyrgyzstan')
        : readList(params, 'country');
    const selectedLanguages = readList(params, 'lang');
    const selectedTypes = readList(params, 'type');
    const query = params.get('q') || '';
    const minTuition = params.get('min') || '';
    const maxTuition = params.get('max') || '';
    const sortKey = SORT_KEYS.includes(params.get('sort')) ? params.get('sort') : 'topRanking';
    const openOnly = params.get('open') === '1';
    const savedOnly = params.get('saved') === '1';
    const currentPage = Math.max(1, Math.floor(Number(params.get('page'))) || 1);
    const searchTerm = useDebounced(query.trim());
    const emptyRange = NUMBER.test(minTuition) && NUMBER.test(maxTuition) && Number(minTuition) > Number(maxTuition);
    // Guests keep saved items in this browser, so "Saved only" filters here instead of on the server
    const localSaved = savedOnly && !user;

    // The page's URL params are the API's query params
    const apiPath = useMemo(() => {
        const q = new URLSearchParams();
        if (searchTerm) q.set('q', searchTerm);
        ['country', 'lang', 'type'].forEach((key) => params.get(key) && q.set(key, params.get(key)));
        if (params.get('abroad') === 'true') q.set('abroad', 'true');
        if (NUMBER.test(minTuition)) q.set('min', minTuition);
        if (NUMBER.test(maxTuition)) q.set('max', maxTuition);
        if (sortKey !== 'topRanking') q.set('sort', sortKey);
        if (openOnly) q.set('open', '1');
        if (localSaved) {
            q.set('pageSize', '50');
        } else {
            if (savedOnly) q.set('saved', '1');
            q.set('page', String(currentPage));
            q.set('pageSize', String(ITEMS_PER_PAGE));
        }
        return `/universities?${q}`;
    }, [params, searchTerm, minTuition, maxTuition, sortKey, openOnly, savedOnly, localSaved, currentPage]);
    const results = useApi(emptyRange ? null : apiPath, { keepPrevious: true });

    // A value the API doesn't know (an old or edited link) matches nothing; it isn't a load failure
    const loadError = results.error?.code === 'validation' ? null : results.error;
    let items = emptyRange ? [] : results.data?.items ?? [];
    let totalItems = emptyRange ? 0 : results.data?.pagination.totalItems ?? 0;
    if (localSaved) {
        items = items.filter((u) => saved.ids.includes(u.id));
        totalItems = items.length;
    }
    const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
    const page = localSaved ? Math.min(currentPage, totalPages) : currentPage;
    const pageItems = localSaved ? items.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE) : items;
    const firstLoad = results.loading && !results.data;

    const toggleSave = async (id) => {
        await saved.toggle(id);
        if (savedOnly && user) results.reload();
    };

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

    const countByCountry = (country) => options?.countries.find((c) => c.value === country)?.count ?? 0;
    const catalogSize = options?.countries.reduce((sum, c) => sum + c.count, 0) ?? 0;

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

    // A page past the end (an old link, or its last saved item was removed): show the last page
    if (!results.loading && !localSaved && totalItems > 0 && currentPage > totalPages) {
        const last = new URLSearchParams(params);
        if (totalPages === 1) last.delete('page');
        else last.set('page', String(totalPages));
        return <Navigate to={{ search: `?${last}` }} replace />;
    }

    return (
        <div className="uni-page">
            <section className="uni-page__hero">
                <div className="container">
                    <SectionReveal>
                        <h1 className="uni-page__title">{t('universitiesPage.title')}</h1>
                        <p className="uni-page__subtitle">
                            {fmt(t('universitiesPage.subtitle'), {
                                kg: countByCountry('Kyrgyzstan'),
                                abroad: catalogSize - countByCountry('Kyrgyzstan'),
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
                                {countries.map((country) => (
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
                                {languages.map((lang) => (
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
                                {types.map((type) => (
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
                                {t('universitiesPage.showing')} <strong>{totalItems}</strong> {t('universitiesPage.of')}{' '}
                                <strong>{catalogSize}</strong> {t('universitiesPage.universitiesWord')}
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

                        {(firstLoad || loadError) && <LoadState error={loadError} onRetry={results.reload} />}

                        <div className="uni-page__grid" aria-busy={results.loading}>
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
                                                    onClick={() => toggleSave(uni.id)}
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

                        {!results.loading && !loadError && pageItems.length === 0 && (
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
