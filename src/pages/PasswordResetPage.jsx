import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import ShakeField from '../components/ui/ShakeField';
import { useTranslation } from '../i18n/useLanguage';
import { useAuth } from '../auth/authContext';
import { authErrorMessage } from '../auth/errors';
import './LoginPage.css';

// /forgot-password asks for the email. The emailed link opens
// /reset-password?token=… to choose a new password, which also signs in.
const PasswordResetPage = () => {
    const { t } = useTranslation();
    const { requestReset, completeReset } = useAuth();
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const token = params.get('token');
    const field = token ? 'password' : 'email';
    const [error, setError] = useState(false);
    const [message, setMessage] = useState('');
    const [signal, setSignal] = useState(0);
    const [sent, setSent] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const fail = (text) => {
        setError(true);
        setMessage(text);
        setSignal((s) => s + 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const input = e.currentTarget.elements[field];
        if (token && input.value.length < 8) return fail(t('auth.errors.passwordShort'));
        if (!token && !input.value.trim()) return fail(t('auth.errors.emailRequired'));
        if (!token && !input.validity.valid) return fail(t('auth.errors.emailInvalid'));
        setSubmitting(true);
        try {
            if (token) {
                await completeReset(token, input.value);
                navigate('/account', { replace: true });
            } else {
                await requestReset(input.value);
                setSent(true);
            }
        } catch (err) {
            fail(authErrorMessage(t, err));
        } finally {
            setSubmitting(false);
        }
        return undefined;
    };

    return (
        <div className="page-shell auth-page">
            <div className="container">
                <div className="auth-card">
                    <Link to="/" className="auth-card__brand">BILGE</Link>
                    <h1 className="auth-card__title">{token ? t('auth.resetTitle') : t('auth.forgotTitle')}</h1>
                    <p className="auth-card__subtitle">{token ? t('auth.resetSubtitle') : t('auth.forgotSubtitle')}</p>

                    {sent ? (
                        <p className="auth-notice" role="status">
                            <CheckCircle2 size={16} aria-hidden="true" /> {t('auth.linkSent')}
                        </p>
                    ) : (
                        <form className="auth-form" onSubmit={handleSubmit} noValidate method="post">
                            <ShakeField
                                id={field}
                                label={token ? t('auth.newPassword') : t('auth.email')}
                                error={error}
                                message={message}
                                signal={signal}
                                onRevert={() => setError(false)}
                            >
                                {(aria) => (
                                    <input
                                        id={field}
                                        name={field}
                                        type={token ? 'password' : 'email'}
                                        autoComplete={token ? 'new-password' : 'username'}
                                        inputMode={token ? undefined : 'email'}
                                        minLength={token ? 8 : undefined}
                                        spellCheck={false}
                                        required
                                        onInput={() => setError(false)}
                                        {...aria}
                                    />
                                )}
                            </ShakeField>
                            {token && <p className="auth-form__hint">{t('auth.passwordHint')}</p>}
                            <button type="submit" className="btn btn--primary btn--md btn--full auth-form__submit" disabled={submitting}>
                                {token ? t('auth.setPassword') : t('auth.sendLink')}
                            </button>
                        </form>
                    )}

                    <p className="auth-card__switch">
                        <Link to="/login">{t('auth.backToSignIn')}</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PasswordResetPage;
