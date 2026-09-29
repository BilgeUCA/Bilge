import { Link, Navigate, useNavigate } from 'react-router-dom';
import { LogOut, Heart, Bookmark, BarChart3 } from 'lucide-react';
import UniLogo from '../components/ui/UniLogo';
import Button from '../components/ui/Button';
import { useTranslation } from '../i18n/useLanguage';
import { useAuth } from '../auth/authContext';
import { useSavedIds, useStoredState } from '../hooks/useStoredState';
import { getUniversity } from '../data/universities';
import { getScholarship } from '../data/scholarships';
import { ORT_RESULTS_KEY } from '../data/ortPractice';
import { fmt } from '../utils/format';
import './AccountPage.css';

const AccountPage = () => {
    const { t } = useTranslation();
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const savedUnis = useSavedIds('universities').ids.map(getUniversity).filter(Boolean);
    const savedSchs = useSavedIds('scholarships').ids.map(getScholarship).filter(Boolean);
    const [results] = useStoredState(ORT_RESULTS_KEY, []);

    if (!user) return <Navigate to="/login" replace state={{ from: '/account' }} />;

    const best = results.length ? Math.max(...results.map((r) => Math.round((r.correct / r.total) * 100))) : null;

    const handleSignOut = () => {
        signOut();
        navigate('/');
    };

    return (
        <div className="page-shell account-page">
            <div className="container">
                <header className="account-page__header">
                    <div>
                        <h1 className="account-page__title">{fmt(t('account.hello'), { name: user.name.split(' ')[0] })}</h1>
                        <p className="account-page__email">{user.email}</p>
                    </div>
                    <button type="button" className="account-page__signout" onClick={handleSignOut}>
                        <LogOut size={16} aria-hidden="true" /> {t('account.signOut')}
                    </button>
                </header>

                <div className="account-page__grid">
                    <section className="account-card">
                        <h2 className="account-card__title"><Heart size={18} aria-hidden="true" /> {t('account.savedUnis')}</h2>
                        {savedUnis.length === 0 ? (
                            <p className="account-card__empty">
                                {t('account.noSavedUnis')} <Link to="/universities">{t('account.browse')}</Link>
                            </p>
                        ) : (
                            <ul className="account-card__list">
                                {savedUnis.map((u) => (
                                    <li key={u.id}>
                                        <Link to={`/universities/${u.id}`} className="account-card__item">
                                            <UniLogo className="account-card__logo" src={u.logo} name={u.name} shortName={u.shortName} color={u.color} />
                                            <span>{u.name}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>

                    <section className="account-card">
                        <h2 className="account-card__title"><Bookmark size={18} aria-hidden="true" /> {t('account.savedSchs')}</h2>
                        {savedSchs.length === 0 ? (
                            <p className="account-card__empty">
                                {t('account.noSavedSchs')} <Link to="/scholarships">{t('account.browse')}</Link>
                            </p>
                        ) : (
                            <ul className="account-card__list">
                                {savedSchs.map((s) => (
                                    <li key={s.id}>
                                        <Link to={`/scholarships/${s.id}`} className="account-card__item">
                                            <UniLogo className="account-card__logo" src={s.logo} name={s.name} shortName={s.shortName} color={s.color} />
                                            <span>{s.name}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>

                    <section className="account-card">
                        <h2 className="account-card__title"><BarChart3 size={18} aria-hidden="true" /> {t('account.ortTitle')}</h2>
                        {best === null ? (
                            <p className="account-card__empty">{t('ort.progressEmpty')}</p>
                        ) : (
                            <p className="account-card__stat">
                                <strong>{best}%</strong> {fmt(t('account.ortBest'), { n: results.length })}
                            </p>
                        )}
                        <Button variant="secondary" size="sm" to={best === null ? '/ort-prep?tab=practice' : '/ort-prep?tab=progress'}>
                            {best === null ? t('ort.startDiagnostic') : t('account.viewProgress')}
                        </Button>
                    </section>
                </div>
                <p className="account-page__note">{t('auth.localNote')}</p>
            </div>
        </div>
    );
};

export default AccountPage;
