import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Mail, Send, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '../i18n/useLanguage';
import { useAuth } from '../auth/authContext';
import { api } from '../api/client';
import './InfoPages.css';

const CONTACT_EMAIL = 'hello@bilge.kg';
const TOPICS = ['general', 'account', 'universities', 'feedback'];

// Messages go to the API; a signed-in sender is linked to the account.
const FIELD_KEYS = { name: 'contact.errors.name', email: 'auth.errors.emailInvalid', topic: 'auth.errors.generic', message: 'contact.errors.message' };
const ContactPage = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [params] = useSearchParams();
    const initialTopic = TOPICS.includes(params.get('topic')) ? params.get('topic') : 'general';
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');
    const [sending, setSending] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        const data = Object.fromEntries(new FormData(form));
        setSending(true);
        setError('');
        try {
            await api('/contact', { method: 'POST', body: data });
            setSent(true);
        } catch (err) {
            if (err.code === 'validation' && FIELD_KEYS[err.field]) setError(t(FIELD_KEYS[err.field]));
            else setError(t(`auth.errors.${err.code}`, t('auth.errors.generic')));
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="page-shell info-page">
            <div className="container info-page__narrow">
                <h1 className="info-page__title">{t('contact.title')}</h1>
                <p className="info-page__lead">{t('contact.lead')}</p>

                {sent ? (
                    <div className="info-page__success" role="status">
                        <CheckCircle2 size={22} aria-hidden="true" />
                        <div>
                            <strong>{t('contact.sentTitle')}</strong>
                            <p>
                                {t('contact.sentText')} <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                            </p>
                            <button type="button" className="info-page__link-btn" onClick={() => setSent(false)}>
                                {t('contact.again')}
                            </button>
                        </div>
                    </div>
                ) : (
                    <form key={user?.id ?? 'guest'} className="info-form" onSubmit={handleSubmit} noValidate>
                        <div className="info-form__row">
                            <label className="info-form__field">
                                <span>{t('contact.name')}</span>
                                <input name="name" type="text" autoComplete="name" required maxLength={100} defaultValue={user?.name || ''} />
                            </label>
                            <label className="info-form__field">
                                <span>{t('auth.email')}</span>
                                <input name="email" type="email" autoComplete="email" required defaultValue={user?.email || ''} />
                            </label>
                        </div>
                        <label className="info-form__field">
                            <span>{t('contact.topic')}</span>
                            <select name="topic" defaultValue={initialTopic}>
                                {TOPICS.map((topic) => (
                                    <option key={topic} value={topic}>{t(`contact.topics.${topic}`)}</option>
                                ))}
                            </select>
                        </label>
                        <label className="info-form__field">
                            <span>{t('contact.message')}</span>
                            <textarea name="message" rows={6} required minLength={10} maxLength={5000} />
                        </label>
                        {error && <p className="form-error" role="alert">{error}</p>}
                        <button type="submit" className="btn btn--primary btn--md" disabled={sending}>
                            <Send size={16} aria-hidden="true" /> {t('contact.send')}
                        </button>
                    </form>
                )}

                <p className="info-page__aside">
                    <Mail size={16} aria-hidden="true" /> {t('contact.direct')} <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                </p>
            </div>
        </div>
    );
};

export default ContactPage;
