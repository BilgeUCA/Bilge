import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { LogOut, Heart, Bookmark, BarChart3, Trash2 } from 'lucide-react';
import UniLogo from '../components/ui/UniLogo';
import Button from '../components/ui/Button';
import LoadState from '../components/ui/LoadState';
import { useTranslation } from '../i18n/useLanguage';
import { useAuth } from '../auth/authContext';
import { authErrorMessage } from '../auth/errors';
import { useApi } from '../api/useApi';
import { fmt } from '../utils/format';
import './AccountPage.css';

const AccountPage = () => {
    const { t } = useTranslation();
    const { user, ready, signOut, deleteAccount } = useAuth();
    const navigate = useNavigate();
    const saved = useApi(user ? '/me/saved' : null);
    const ort = useApi(user ? '/me/ort/attempts?limit=1' : null);
    const [deleteError, setDeleteError] = useState('');
    const [deleting, setDeleting] = useState(false);

    if (!ready) return <LoadState className="load-state--page" />;
    if (!user) return <Navigate to="/login" replace state={{ from: '/account' }} />;

    const savedUnis = saved.data?.universities ?? [];
    const savedSchs = saved.data?.scholarships ?? [];
    const best = ort.data?.stats.bestPercent ?? null;

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    const handleDelete = async (e) => {
        e.preventDefault();
        const password = e.currentTarget.elements.password.value;
        if (!password) return setDeleteError(t('auth.errors.passwordRequired'));
        setDeleting(true);
        setDeleteError('');
        try {
            await deleteAccount(password);
            navigate('/', { replace: true });
        } catch (err) {
            setDeleteError(authErrorMessage(t, err));
            setDeleting(false);
        }
        return undefined;
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

                {saved.error || ort.error ? (
                    <LoadState error={saved.error || ort.error} onRetry={() => { saved.reload(); ort.reload(); }} />
                ) : !saved.data || !ort.data ? (
                    <LoadState />
                ) : (
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
                                <strong>{best}%</strong> {fmt(t('account.ortBest'), { n: ort.data.stats.count })}
                            </p>
                        )}
                        <Button variant="secondary" size="sm" to={best === null ? '/ort-prep?tab=practice' : '/ort-prep?tab=progress'}>
                            {best === null ? t('ort.startDiagnostic') : t('account.viewProgress')}
                        </Button>
                    </section>
                </div>
                )}

                <section className="account-card account-card--danger">
                    <h2 className="account-card__title"><Trash2 size={18} aria-hidden="true" /> {t('account.deleteTitle')}</h2>
                    <p className="account-card__empty">{t('account.deleteText')}</p>
                    <form className="account-delete" onSubmit={handleDelete} noValidate>
                        <label className="account-delete__field">
                            <span>{t('auth.password')}</span>
                            <input name="password" type="password" autoComplete="current-password" required />
                        </label>
                        <button type="submit" className="account-page__signout" disabled={deleting}>
                            {t('account.deleteButton')}
                        </button>
                    </form>
                    {deleteError && <p className="form-error account-delete__error" role="alert">{deleteError}</p>}
                </section>
                <p className="account-page__note">{t('auth.localNote')}</p>
            </div>
        </div>
    );
};

export default AccountPage;
