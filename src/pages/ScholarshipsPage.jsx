import { useState } from 'react';
import { Search, Bookmark, Calendar, Globe, Award, ChevronDown, SlidersHorizontal, ArrowRight } from 'lucide-react';
import SectionReveal from '../components/ui/SectionReveal';
import { useTranslation } from '../i18n/useLanguage';
import './ScholarshipsPage.css';

const scholarships = [
    {
        id: 'flex',
        nameKey: 'flex_name',
        descKey: 'flex_desc',
        typeKey: 'High School',
        fundingKey: 'Fully Funded',
        fundingColor: 'success',
        countryKey: 'USA',
        countryFlag: '🇺🇸',
        deadlineKey: 'Oct 15, 2023',
        meta: { labelKey: 'GRADE', valueKey: '9 - 10' },
        statusKey: 'Accepting applications',
        gradient: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 60%, #93C5FD 100%)',
    },
    {
        id: 'ugrad',
        nameKey: 'ugrad_name',
        descKey: 'ugrad_desc',
        typeKey: 'Undergraduate',
        fundingKey: 'Fully Funded',
        fundingColor: 'success',
        countryKey: 'USA',
        countryFlag: '🇺🇸',
        deadlineKey: 'Jan 06, 2024',
        deadlineUrgent: true,
        meta: { labelKey: 'LANGUAGE', valueKey: 'TOEFL req.' },
        statusKey: 'Closing soon',
        statusDanger: true,
        gradient: 'linear-gradient(135deg, #0f766e 0%, #2dd4bf 60%, #5eead4 100%)',
    },
    {
        id: 'daad',
        nameKey: 'daad_name',
        descKey: 'daad_desc',
        typeKey: "Master's",
        fundingKey: 'Stipend + Tuition',
        fundingColor: 'warning',
        countryKey: 'Germany',
        countryFlag: '🇩🇪',
        deadlineKey: 'Varies',
        meta: { labelKey: 'EXPERIENCE', valueKey: '2 Years Min' },
        statusKey: 'Multiple intakes',
        gradient: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 60%, #c4b5fd 100%)',
    },
    {
        id: 'erasmus',
        nameKey: 'erasmus_name',
        descKey: 'erasmus_desc',
        typeKey: 'Bachelor/Master',
        fundingKey: 'Partial Funding',
        fundingColor: 'info',
        countryKey: 'Europe',
        countryFlag: '🇪🇺',
        deadlineKey: 'Feb 2024',
        meta: { labelKey: 'TYPE', valueKey: 'Exchange' },
        statusKey: 'Check local coordinators',
        gradient: 'linear-gradient(135deg, #166534 0%, #22c55e 60%, #86efac 100%)',
    },
    {
        id: 'hungaricum',
        nameKey: 'hungaricum_name',
        descKey: 'hungaricum_desc',
        typeKey: 'Bachelor/Master',
        fundingKey: 'Fully Funded',
        fundingColor: 'success',
        countryKey: 'Hungary',
        countryFlag: '🇭🇺',
        deadlineKey: 'Jan 15, 2024',
        meta: { labelKey: 'REQUIREMENT', valueKey: 'ORT Score' },
        statusKey: 'Apply via MoE',
        gradient: 'linear-gradient(135deg, #9a3412 0%, #ea580c 60%, #fb923c 100%)',
    },
    {
        id: 'chevening',
        nameKey: 'chevening_name',
        descKey: 'chevening_desc',
        typeKey: 'PhD / Research',
        fundingKey: 'Grant',
        fundingColor: 'warning',
        countryKey: 'Worldwide',
        countryFlag: '🌍',
        deadlineKey: 'Nov 07, 2023',
        meta: { labelKey: 'LOCATION', valueKey: 'United Kingdom' },
        statusKey: 'Competitive',
        gradient: 'linear-gradient(135deg, #1e3a5f 0%, #3b82f6 60%, #93c5fd 100%)',
    },
];

const ScholarshipsPage = () => {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [bookmarks, setBookmarks] = useState([]);

    const toggleBookmark = (id) => {
        setBookmarks((prev) =>
            prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
        );
    };

    const filtered = scholarships.filter((s) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
            t(`scholarships.programs.${s.nameKey}`).toLowerCase().includes(q) ||
            s.countryKey.toLowerCase().includes(q) ||
            s.typeKey.toLowerCase().includes(q)
        );
    });

    const getFundingClass = (color) => {
        switch (color) {
            case 'success': return 'sch-card__tag--success';
            case 'warning': return 'sch-card__tag--warning';
            case 'info': return 'sch-card__tag--info';
            default: return '';
        }
    };

    const renderMetaIcon = (labelKey) => {
        switch (labelKey) {
            case 'GRADE': return <Award size={13} />;
            case 'LANGUAGE': return <Globe size={13} />;
            case 'EXPERIENCE': return '🎓';
            case 'TYPE': return '📋';
            case 'REQUIREMENT': return '📝';
            case 'LOCATION': return <Globe size={13} />;
            default: return null;
        }
    };

    return (
        <div className="sch-page">
            <section className="sch-page__hero">
                <div className="container">
                    <SectionReveal>
                        <div className="sch-page__hero-content">
                            <div>
                                <h1 className="sch-page__title">{t('scholarships.title')}</h1>
                                <p className="sch-page__subtitle">
                                    {t('scholarships.subtitle')}
                                </p>
                            </div>
                            <div className="sch-page__ort-banner">
                                <div className="sch-page__ort-icon">📝</div>
                                <div>
                                    <strong>{t('scholarships.prepareOrt')}</strong>
                                    <span>{t('scholarships.prepareOrtSub')}</span>
                                </div>
                                <button className="sch-page__ort-btn">{t('scholarships.start')}</button>
                            </div>
                        </div>
                    </SectionReveal>

                    <SectionReveal delay={150}>
                        <div className="sch-page__controls">
                            <div className="sch-page__search">
                                <Search size={18} />
                                <input
                                    type="text"
                                    placeholder={t('scholarships.searchPlaceholder')}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    id="scholarship-search"
                                />
                            </div>
                            <div className="sch-page__dropdowns">
                                <button className="sch-page__dropdown">
                                    {t('scholarships.destinationAll')} <ChevronDown size={16} />
                                </button>
                                <button className="sch-page__dropdown">
                                    {t('scholarships.levelAll')} <ChevronDown size={16} />
                                </button>
                                <button className="sch-page__dropdown">
                                    {t('scholarships.fundingAny')} <ChevronDown size={16} />
                                </button>
                                <button className="sch-page__dropdown sch-page__dropdown--icon">
                                    <SlidersHorizontal size={16} />
                                    {t('scholarships.moreFilters')}
                                </button>
                            </div>
                        </div>
                    </SectionReveal>
                </div>
            </section>

            <section className="sch-page__list">
                <div className="container">
                    <div className="sch-page__grid">
                        {filtered.map((sch, index) => (
                            <SectionReveal key={sch.id} delay={index * 80}>
                                <div className="sch-card" id={`scholarship-${sch.id}`}>
                                    <div className="sch-card__image" style={{ background: sch.gradient }}>
                                        <span className="sch-card__country">
                                            {sch.countryFlag} {t(`scholarships.countries.${sch.countryKey}`)}
                                        </span>
                                        <button
                                            className={`sch-card__bookmark ${bookmarks.includes(sch.id) ? 'sch-card__bookmark--active' : ''}`}
                                            onClick={() => toggleBookmark(sch.id)}
                                            aria-label="Bookmark"
                                        >
                                            <Bookmark
                                                size={16}
                                                fill={bookmarks.includes(sch.id) ? '#fff' : 'none'}
                                            />
                                        </button>
                                    </div>
                                    <div className="sch-card__body">
                                        <div className="sch-card__tags">
                                            <span className="sch-card__tag sch-card__tag--type">
                                                {t(`scholarships.types.${sch.typeKey}`)}
                                            </span>
                                            <span className={`sch-card__tag ${getFundingClass(sch.fundingColor)}`}>
                                                {t(`scholarships.funding.${sch.fundingKey}`)}
                                            </span>
                                        </div>
                                        <h3 className="sch-card__name">{t(`scholarships.programs.${sch.nameKey}`)}</h3>
                                        <p className="sch-card__desc">{t(`scholarships.programs.${sch.descKey}`)}</p>
                                        <div className="sch-card__meta-row">
                                            <div className="sch-card__meta-item">
                                                <span className="sch-card__meta-label">
                                                    <Calendar size={13} /> {t('scholarships.metaLabels.DEADLINE')}
                                                </span>
                                                <span className={`sch-card__meta-value ${sch.deadlineUrgent ? 'sch-card__meta-value--urgent' : ''}`}>
                                                    {sch.deadlineUrgent && '⚠ '}{t(`scholarships.deadlines.${sch.deadlineKey}`)}
                                                </span>
                                            </div>
                                            <div className="sch-card__meta-item">
                                                <span className="sch-card__meta-label">
                                                    {renderMetaIcon(sch.meta.labelKey)}
                                                    {' '}{t(`scholarships.metaLabels.${sch.meta.labelKey}`)}
                                                </span>
                                                <span className="sch-card__meta-value">
                                                    {t(`scholarships.metaValues.${sch.meta.valueKey}`)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="sch-card__footer">
                                            <span className={`sch-card__status ${sch.statusDanger ? 'sch-card__status--danger' : ''}`}>
                                                {t(`scholarships.statuses.${sch.statusKey}`)}
                                            </span>
                                            <button className="sch-card__view-btn" id={`view-${sch.id}`}>
                                                {t('scholarships.viewDetails')} <ArrowRight size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </SectionReveal>
                        ))}
                    </div>

                    {filtered.length === 0 && (
                        <div className="sch-page__empty">
                            <p>{t('scholarships.emptyMessage')}</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default ScholarshipsPage;
