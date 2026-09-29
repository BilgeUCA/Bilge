import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Info } from 'lucide-react';
import ShakeField from '../components/ui/ShakeField';
import { useTranslation } from '../i18n/useLanguage';
import { useAuth } from '../auth/authContext';
import './LoginPage.css';

const GoogleMark = () => (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
        <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
        <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
        <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
        <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
);

const AppleMark = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M16.37 12.64c-.02-2.3 1.88-3.4 1.96-3.46-1.07-1.56-2.73-1.77-3.32-1.8-1.41-.14-2.76.83-3.47.83-.72 0-1.82-.81-2.99-.79-1.54.02-2.96.9-3.75 2.27-1.6 2.78-.41 6.89 1.15 9.14.76 1.1 1.67 2.34 2.86 2.3 1.15-.05 1.58-.74 2.97-.74 1.38 0 1.77.74 2.98.72 1.24-.02 2.02-1.12 2.77-2.23.87-1.28 1.23-2.52 1.25-2.58-.03-.01-2.4-.92-2.41-3.66zM14.1 5.9c.63-.77 1.06-1.83.94-2.9-.91.04-2.02.61-2.67 1.37-.58.67-1.1 1.76-.96 2.8 1.02.08 2.06-.52 2.69-1.27z" />
    </svg>
);

const EMPTY = { name: null, email: null, password: null };

// Sign in (/login) and create account (/signup) share this page
const LoginPage = ({ mode = 'signin' }) => {
    const isSignUp = mode === 'signup';
    const { t } = useTranslation();
    const { user, signIn, signUp } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const redirectTo = location.state?.from || '/account';

    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState(EMPTY); // active error flags
    const [messages, setMessages] = useState(EMPTY); // text kept during the fade-out
    const [signal, setSignal] = useState(0);
    const [notice, setNotice] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const formRef = useRef(null);

    // Already signed in: skip the form
    useEffect(() => {
        if (user) navigate(redirectTo, { replace: true });
    }, [user, navigate, redirectTo]);

    const fail = (field, message) => {
        setErrors({ ...EMPTY, [field]: true });
        setMessages((m) => ({ ...m, [field]: message }));
        setSignal((s) => s + 1);
        formRef.current?.elements[field]?.focus();
    };

    const clearError = (field) => setErrors((e) => (e[field] ? { ...e, [field]: null } : e));

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const { email, password } = form.elements;
        const name = form.elements.name;

        if (isSignUp && !name.value.trim()) return fail('name', t('auth.errors.name'));
        if (!email.value.trim()) return fail('email', t('auth.errors.emailRequired'));
        if (!email.validity.valid) return fail('email', t('auth.errors.emailInvalid'));
        if (!password.value) return fail('password', t('auth.errors.passwordRequired'));
        if (isSignUp && password.value.length < 8) return fail('password', t('auth.errors.passwordShort'));

        setSubmitting(true);
        try {
            if (isSignUp) await signUp(name.value, email.value, password.value);
            else await signIn(email.value, password.value);
        } catch (err) {
            const field = err.code === 'wrongPassword' ? 'password' : 'email';
            fail(field, t(`auth.errors.${err.code}`, t('auth.errors.generic')));
        } finally {
            setSubmitting(false);
        }
        return undefined;
    };

    const federated = (provider) => setNotice(`${provider}: ${t('auth.federatedSoon')}`);

    return (
        <div className="page-shell auth-page">
            <div className="container">
                <div className="auth-card">
                    <Link to="/" className="auth-card__brand">BILGE</Link>
                    <h1 className="auth-card__title">{isSignUp ? t('auth.signUpTitle') : t('auth.signInTitle')}</h1>
                    <p className="auth-card__subtitle">{isSignUp ? t('auth.signUpSubtitle') : t('auth.signInSubtitle')}</p>

                    <div className="auth-federated">
                        <button type="button" className="auth-federated__btn" onClick={() => federated('Google')}>
                            <GoogleMark /> {t('auth.google')}
                        </button>
                        <button type="button" className="auth-federated__btn" onClick={() => federated('Apple')}>
                            <AppleMark /> {t('auth.apple')}
                        </button>
                    </div>
                    {notice && (
                        <p className="auth-notice" role="status">
                            <Info size={16} aria-hidden="true" /> {notice}
                        </p>
                    )}

                    <div className="auth-divider" role="separator">
                        <span>{t('auth.or')}</span>
                    </div>

                    <form ref={formRef} className="auth-form" onSubmit={handleSubmit} noValidate method="post">
                        {isSignUp && (
                            <ShakeField
                                id="name"
                                label={t('auth.name')}
                                error={errors.name}
                                message={messages.name}
                                signal={signal}
                                onRevert={() => clearError('name')}
                            >
                                {(aria) => (
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        autoComplete="name"
                                        enterKeyHint="next"
                                        required
                                        onInput={() => clearError('name')}
                                        {...aria}
                                    />
                                )}
                            </ShakeField>
                        )}

                        <ShakeField
                            id="email"
                            label={t('auth.email')}
                            error={errors.email}
                            message={messages.email}
                            signal={signal}
                            onRevert={() => clearError('email')}
                        >
                            {(aria) => (
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="username"
                                    inputMode="email"
                                    enterKeyHint="next"
                                    spellCheck={false}
                                    required
                                    onInput={() => clearError('email')}
                                    {...aria}
                                />
                            )}
                        </ShakeField>

                        <ShakeField
                            id={isSignUp ? 'new-password' : 'current-password'}
                            label={t('auth.password')}
                            error={errors.password}
                            message={messages.password}
                            signal={signal}
                            onRevert={() => clearError('password')}
                            labelAside={
                                !isSignUp && (
                                    <Link to="/contact?topic=account" className="auth-field__aside">
                                        {t('auth.forgot')}
                                    </Link>
                                )
                            }
                            trailing={
                                <button
                                    type="button"
                                    className="auth-field__reveal"
                                    aria-label={t('auth.showPassword')}
                                    aria-pressed={showPassword}
                                    aria-controls={isSignUp ? 'new-password' : 'current-password'}
                                    title={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
                                    onClick={() => setShowPassword((s) => !s)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            }
                        >
                            {(aria) => (
                                <input
                                    id={isSignUp ? 'new-password' : 'current-password'}
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete={isSignUp ? 'new-password' : 'current-password'}
                                    minLength={isSignUp ? 8 : undefined}
                                    enterKeyHint="done"
                                    required
                                    onInput={() => clearError('password')}
                                    {...aria}
                                />
                            )}
                        </ShakeField>
                        {isSignUp && <p className="auth-form__hint">{t('auth.passwordHint')}</p>}

                        <button type="submit" className="btn btn--primary btn--md btn--full auth-form__submit" disabled={submitting}>
                            {isSignUp ? t('auth.createAccount') : t('auth.signIn')}
                        </button>
                    </form>

                    <p className="auth-card__switch">
                        {isSignUp ? t('auth.haveAccount') : t('auth.noAccount')}{' '}
                        <Link to={isSignUp ? '/login' : '/signup'} state={location.state}>
                            {isSignUp ? t('auth.signIn') : t('auth.createOne')}
                        </Link>
                    </p>
                    <p className="auth-card__fineprint">{t('auth.localNote')}</p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
