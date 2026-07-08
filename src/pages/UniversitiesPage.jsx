import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Heart, DollarSign, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import SectionReveal from '../components/ui/SectionReveal';
import { useTranslation } from '../i18n/useLanguage';
import './UniversitiesPage.css';

const allUniversities = [
    {
        id: 'uca',
        name: 'University of Central Asia',
        location: 'Naryn / Bishkek, Kyrgyzstan',
        tuition: '$4,500 / year',
        tuitionNum: 4500,
        majors: 'CS, Economics, Earth Sciences',
        languages: ['EN'],
        deadline: 'Deadline: Jun 10',
        deadlineType: 'warning',
        country: 'Kyrgyzstan',
        langFilter: 'English',
        gradient: 'linear-gradient(135deg, #1E3A5F 0%, #2D6A9F 50%, #4A90C4 100%)',
    },
    {
        id: 'auca',
        name: 'American University of Central Asia',
        location: 'Bishkek, Kyrgyzstan',
        tuition: '$6,000 / year',
        tuitionNum: 6000,
        majors: 'Liberal Arts, Business, CS',
        languages: ['EN', 'RU'],
        deadline: 'Deadline: Aug 25',
        deadlineType: 'warning',
        country: 'Kyrgyzstan',
        langFilter: 'English',
        gradient: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 50%, #93C5FD 100%)',
    },
    {
        id: 'manas',
        name: 'Manas University',
        location: 'Bishkek, Kyrgyzstan',
        tuition: 'Free (Scholarship based)',
        tuitionNum: 0,
        tuitionKey: 'freeScholarship',
        majors: 'Engineering, Medicine',
        languages: ['TR', 'KG'],
        deadline: 'Closing Soon',
        deadlineType: 'danger',
        country: 'Kyrgyzstan',
        langFilter: 'Turkish',
        gradient: 'linear-gradient(135deg, #10B981 0%, #34D399 50%, #6EE7B7 100%)',
    },
    {
        id: 'krsu',
        name: 'Kyrgyz Russian Slavic University',
        location: 'Bishkek, Kyrgyzstan',
        tuition: '$1,200 / year',
        tuitionNum: 1200,
        majors: 'Law, Economics, Medicine',
        languages: ['RU'],
        deadline: 'Rolling Admission',
        deadlineType: 'normal',
        country: 'Kyrgyzstan',
        langFilter: 'Russian',
        gradient: 'linear-gradient(135deg, #1E3A5F 0%, #2D5A87 50%, #3B7AB5 100%)',
    },
    {
        id: 'ala-too',
        name: 'Ala-Too International',
        location: 'Bishkek, Kyrgyzstan',
        tuition: '$2,500 / year',
        tuitionNum: 2500,
        majors: 'IT, Business, Design',
        languages: ['EN'],
        deadline: 'Open Now',
        deadlineType: 'success',
        country: 'Kyrgyzstan',
        langFilter: 'English',
        gradient: 'linear-gradient(135deg, #6366F1 0%, #818CF8 50%, #A5B4FC 100%)',
    },
    {
        id: 'osh-state',
        name: 'Osh State University',
        location: 'Osh, Kyrgyzstan',
        tuition: '$900 / year',
        tuitionNum: 900,
        majors: 'Medical, Pedagogy',
        languages: ['KG', 'RU'],
        deadline: 'Apply by: Sep 1',
        deadlineType: 'warning',
        country: 'Kyrgyzstan',
        langFilter: 'Kyrgyz',
        gradient: 'linear-gradient(135deg, #F43F5E 0%, #FB7185 50%, #FDA4AF 100%)',
    },
    {
        id: 'kimep',
        name: 'KIMEP (Kazakhstan Institute of Management, Economics and Strategic Research) University',
        location: 'Almaty, Kazakhstan',
        tuition: '$9,000 / year',
        tuitionNum: 9000,
        majors: 'Finance, Marketing',
        languages: ['EN'],
        deadline: 'Waitlist Only',
        deadlineType: 'normal',
        country: 'Kazakhstan',
        langFilter: 'English',
        gradient: 'linear-gradient(135deg, #0D9488 0%, #2DD4BF 50%, #5EEAD4 100%)',
    },
    {
        id: 'knu',
        name: 'Kyrgyz National University',
        location: 'Bishkek, Kyrgyzstan',
        tuition: '$800 / year',
        tuitionNum: 800,
        majors: 'Sciences, Humanities',
        languages: ['KG', 'RU'],
        deadline: 'Open Now',
        deadlineType: 'success',
        country: 'Kyrgyzstan',
        langFilter: 'Kyrgyz',
        gradient: 'linear-gradient(135deg, #7C3AED 0%, #A78BFA 50%, #C4B5FD 100%)',
    },
    {
        id: 'ktmu',
        name: 'Kyrgyz-Turkish Manas University',
        location: 'Bishkek, Kyrgyzstan',
        tuition: 'Free',
        tuitionNum: 0,
        tuitionKey: 'free',
        majors: 'Engineering, Social Sciences',
        languages: ['TR', 'KG'],
        deadline: 'Apply by: Jul 15',
        deadlineType: 'warning',
        country: 'Kyrgyzstan',
        langFilter: 'Turkish',
        gradient: 'linear-gradient(135deg, #DC2626 0%, #F87171 50%, #FCA5A5 100%)',
    },
    {
        id: 'sdu',
        name: 'Suleyman Demirel University',
        location: 'Almaty, Kazakhstan',
        tuition: '$3,500 / year',
        tuitionNum: 3500,
        majors: 'Business, IT, Law',
        languages: ['EN', 'RU'],
        deadline: 'Rolling Admission',
        deadlineType: 'normal',
        country: 'Kazakhstan',
        langFilter: 'English',
        gradient: 'linear-gradient(135deg, #EA580C 0%, #FB923C 50%, #FDBA74 100%)',
    },
    {
        id: 'iitu',
        name: 'International Information Technology University',
        location: 'Almaty, Kazakhstan',
        tuition: '$4,200 / year',
        tuitionNum: 4200,
        majors: 'Computer Science, AI',
        languages: ['EN'],
        deadline: 'Open Now',
        deadlineType: 'success',
        country: 'Kazakhstan',
        langFilter: 'English',
        gradient: 'linear-gradient(135deg, #0369A1 0%, #38BDF8 50%, #7DD3FC 100%)',
    },
    {
        id: 'yeditepe',
        name: 'Yeditepe University',
        location: 'Istanbul, Turkey',
        tuition: '$7,000 / year',
        tuitionNum: 7000,
        majors: 'Medicine, Engineering',
        languages: ['EN', 'TR'],
        deadline: 'Deadline: Jun 30',
        deadlineType: 'warning',
        country: 'Turkey',
        langFilter: 'English',
        gradient: 'linear-gradient(135deg, #B91C1C 0%, #EF4444 50%, #F87171 100%)',
    },
    {
        id: 'bilkent',
        name: 'Bilkent University',
        location: 'Ankara, Turkey',
        tuition: '$5,500 / year',
        tuitionNum: 5500,
        majors: 'Engineering, Business, Arts',
        languages: ['EN'],
        deadline: 'Apply by: May 20',
        deadlineType: 'warning',
        country: 'Turkey',
        langFilter: 'English',
        gradient: 'linear-gradient(135deg, #4338CA 0%, #6366F1 50%, #818CF8 100%)',
    },
];

const countries = [
    { name: 'Kyrgyzstan', count: 32 },
    { name: 'Kazakhstan', count: 15 },
    { name: 'Turkey', count: 8 },
];

const languageOptions = ['English', 'Russian', 'Kyrgyz', 'Turkish'];
const sortOptionKeys = ['topRanking', 'lowestTuition', 'highestTuition', 'nameAZ'];

const ITEMS_PER_PAGE = 6;

const UniversitiesPage = () => {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCountries, setSelectedCountries] = useState(['Kyrgyzstan']);
    const [selectedLanguages, setSelectedLanguages] = useState([]);
    const [minTuition, setMinTuition] = useState('');
    const [maxTuition, setMaxTuition] = useState('');
    const [sortByKey, setSortByKey] = useState('topRanking');
    const [currentPage, setCurrentPage] = useState(1);
    const [favorites, setFavorites] = useState([]);

    const filteredUniversities = useMemo(() => {
        let filtered = allUniversities.filter((uni) => {
            const matchesSearch =
                !searchQuery || uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                uni.majors.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCountry =
                selectedCountries.length === 0 || selectedCountries.includes(uni.country);
            const matchesLanguage =
                selectedLanguages.length === 0 || selectedLanguages.includes(uni.langFilter);
            const matchesTuition =
                (!minTuition || uni.tuitionNum >= parseInt(minTuition)) &&
                (!maxTuition || uni.tuitionNum <= parseInt(maxTuition));
            return matchesSearch && matchesCountry && matchesLanguage && matchesTuition;
        });

        // Apply sorting
        const sorted = [...filtered];
        switch (sortByKey) {
            case 'lowestTuition':
                sorted.sort((a, b) => a.tuitionNum - b.tuitionNum);
                break;
            case 'highestTuition':
                sorted.sort((a, b) => b.tuitionNum - a.tuitionNum);
                break;
            case 'nameAZ':
                sorted.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'topRanking':
            default:
                // Keep original order for top ranking
                break;
        }

        return sorted;
    }, [searchQuery, selectedCountries, selectedLanguages, minTuition, maxTuition, sortByKey]);

    const totalPages = Math.ceil(filteredUniversities.length / ITEMS_PER_PAGE);
    const paginatedUniversities = filteredUniversities.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const toggleCountry = (country) => {
        setSelectedCountries((prev) =>
            prev.includes(country) ? prev.filter((c) => c !== country) : [...prev, country]
        );
        setCurrentPage(1);
    };

    const toggleLanguage = (lang) => {
        setSelectedLanguages((prev) =>
            prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
        );
        setCurrentPage(1);
    };

    const toggleFavorite = (id) => {
        setFavorites((prev) =>
            prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
        );
    };

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedCountries([]);
        setSelectedLanguages([]);
        setMinTuition('');
        setMaxTuition('');
        setCurrentPage(1);
    };

    const getDeadlineClass = (type) => {
        switch (type) {
            case 'danger': return 'uni-card__deadline--danger';
            case 'warning': return 'uni-card__deadline--warning';
            case 'success': return 'uni-card__deadline--success';
            default: return '';
        }
    };

    const renderTuition = (uni) => {
        if (uni.tuitionKey) return t(`universitiesPage.tuition.${uni.tuitionKey}`);
        return uni.tuition;
    };

    return (
        <div className="uni-page">
            <section className="uni-page__hero">
                <div className="container">
                    <SectionReveal>
                        <h1 className="uni-page__title">{t('universitiesPage.title')}</h1>
                        <p className="uni-page__subtitle">
                            {t('universitiesPage.subtitle')}
                        </p>
                    </SectionReveal>
                </div>
            </section>

            <section className="uni-page__content">
                <div className="container uni-page__layout">
                    {/* Sidebar Filters */}
                    <aside className="uni-filters" id="filters-sidebar">
                        <div className="uni-filters__header">
                            <h3 className="uni-filters__title">{t('universitiesPage.filters')}</h3>
                            <button className="uni-filters__clear" onClick={clearFilters}>
                                {t('universitiesPage.clearAll')}
                            </button>
                        </div>

                        <div className="uni-filters__group">
                            <label className="uni-filters__label">{t('universitiesPage.keyword')}</label>
                            <div className="uni-filters__search">
                                <Search size={16} />
                                <input
                                    type="text"
                                    placeholder={t('universitiesPage.keywordPlaceholder')}
                                    value={searchQuery}
                                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                                    id="university-search"
                                />
                            </div>
                        </div>

                        <div className="uni-filters__group">
                            <label className="uni-filters__label">{t('universitiesPage.country')}</label>
                            <div className="uni-filters__checkboxes">
                                {countries.map((c) => (
                                    <label key={c.name} className="uni-filters__checkbox">
                                        <input
                                            type="checkbox"
                                            checked={selectedCountries.includes(c.name)}
                                            onChange={() => toggleCountry(c.name)}
                                        />
                                        <span className="uni-filters__checkmark" />
                                        <span className="uni-filters__checkbox-label">
                                            {t(`universitiesPage.countries.${c.name}`)}
                                        </span>
                                        <span className="uni-filters__checkbox-count">{c.count}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="uni-filters__group">
                            <label className="uni-filters__label">{t('universitiesPage.annualTuition')}</label>
                            <div className="uni-filters__range">
                                <div className="uni-filters__range-input">
                                    <span>$</span>
                                    <input
                                        type="number"
                                        placeholder={t('universitiesPage.min')}
                                        value={minTuition}
                                        onChange={(e) => { setMinTuition(e.target.value); setCurrentPage(1); }}
                                    />
                                </div>
                                <span className="uni-filters__range-sep">–</span>
                                <div className="uni-filters__range-input">
                                    <span>$</span>
                                    <input
                                        type="number"
                                        placeholder={t('universitiesPage.max')}
                                        value={maxTuition}
                                        onChange={(e) => { setMaxTuition(e.target.value); setCurrentPage(1); }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="uni-filters__group">
                            <label className="uni-filters__label">{t('universitiesPage.languageOfInstruction')}</label>
                            <div className="uni-filters__tags">
                                {languageOptions.map((lang) => (
                                    <button
                                        key={lang}
                                        className={`uni-filters__tag ${selectedLanguages.includes(lang) ? 'uni-filters__tag--active' : ''}`}
                                        onClick={() => toggleLanguage(lang)}
                                    >
                                        {t(`universitiesPage.languages.${lang}`)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="uni-page__main">
                        <div className="uni-page__toolbar">
                            <p className="uni-page__results-count">
                                {t('universitiesPage.showing')} <strong>{filteredUniversities.length}</strong> {t('universitiesPage.of')} <strong>58</strong> {t('universitiesPage.universitiesWord')}
                            </p>
                            <div className="uni-page__sort">
                                <span>{t('universitiesPage.sortBy')}</span>
                                <select
                                    value={sortByKey}
                                    onChange={(e) => setSortByKey(e.target.value)}
                                    id="sort-select"
                                >
                                    {sortOptionKeys.map((key) => (
                                        <option key={key} value={key}>
                                            {t(`universitiesPage.sortOptions.${key}`)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="uni-page__grid">
                            {paginatedUniversities.map((uni, index) => (
                                <SectionReveal key={uni.id} delay={index * 80}>
                                    <div className="uni-card" id={`uni-card-${uni.id}`}>
                                        <div className="uni-card__image" style={{ background: uni.gradient }}>
                                            <button
                                                className={`uni-card__fav ${favorites.includes(uni.id) ? 'uni-card__fav--active' : ''}`}
                                                onClick={() => toggleFavorite(uni.id)}
                                                aria-label="Toggle favorite"
                                            >
                                                <Heart size={18} fill={favorites.includes(uni.id) ? '#fff' : 'none'} />
                                            </button>
                                            <div className="uni-card__logo-badge">
                                                <span>{uni.name.charAt(0)}</span>
                                            </div>
                                        </div>
                                        <div className="uni-card__body">
                                            <h3 className="uni-card__name">{uni.name}</h3>
                                            <div className="uni-card__detail">
                                                <MapPin size={14} />
                                                <div className="uni-card__detail-content">
                                                    <span className="uni-card__detail-label">{t('universitiesPage.cardLabels.location')}</span>
                                                    <span className="uni-card__detail-value">{uni.location}</span>
                                                </div>
                                            </div>
                                            <div className="uni-card__detail">
                                                <DollarSign size={14} />
                                                <div className="uni-card__detail-content">
                                                    <span className="uni-card__detail-label">{t('universitiesPage.cardLabels.tuition')}</span>
                                                    <span className={`uni-card__detail-value ${uni.tuitionNum === 0 ? 'uni-card__free' : ''}`}>{renderTuition(uni)}</span>
                                                </div>
                                            </div>
                                            <div className="uni-card__detail">
                                                <BookOpen size={14} />
                                                <div className="uni-card__detail-content">
                                                    <span className="uni-card__detail-label">{t('universitiesPage.cardLabels.majors')}</span>
                                                    <span className="uni-card__detail-value">{uni.majors}</span>
                                                </div>
                                            </div>
                                            <div className="uni-card__bottom">
                                                <div className="uni-card__languages">
                                                    {uni.languages.map((lang) => (
                                                        <span key={lang} className="uni-card__lang-tag">{lang}</span>
                                                    ))}
                                                </div>
                                                <span className={`uni-card__deadline ${getDeadlineClass(uni.deadlineType)}`}>
                                                    {t(`universitiesPage.deadlines.${uni.deadline}`)}
                                                </span>
                                            </div>
                                            <Link to={`/universities/${uni.id}`} className="uni-card__view-btn" id={`view-${uni.id}`}>
                                                {t('universitiesPage.viewDetails')}
                                            </Link>
                                        </div>
                                    </div>
                                </SectionReveal>
                            ))}
                        </div>

                        {filteredUniversities.length === 0 && (
                            <div className="uni-page__empty">
                                <p>{t('universitiesPage.emptyMessage')}</p>
                                <button onClick={clearFilters} className="uni-page__empty-btn">
                                    {t('universitiesPage.clearFilters')}
                                </button>
                            </div>
                        )}

                        {totalPages > 1 && (
                            <div className="uni-page__pagination">
                                <button
                                    className="uni-page__page-btn uni-page__page-arrow"
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage((p) => p - 1)}
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        className={`uni-page__page-btn ${currentPage === page ? 'uni-page__page-btn--active' : ''}`}
                                        onClick={() => setCurrentPage(page)}
                                    >
                                        {page}
                                    </button>
                                ))}
                                {totalPages > 4 && <span className="uni-page__page-dots">...</span>}
                                {totalPages > 3 && (
                                    <button
                                        className={`uni-page__page-btn ${currentPage === totalPages ? 'uni-page__page-btn--active' : ''}`}
                                        onClick={() => setCurrentPage(totalPages)}
                                    >
                                        {totalPages}
                                    </button>
                                )}
                                <button
                                    className="uni-page__page-btn uni-page__page-arrow"
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage((p) => p + 1)}
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default UniversitiesPage;
