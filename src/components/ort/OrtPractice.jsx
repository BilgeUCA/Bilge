import { useState } from 'react';
import { CheckCircle2, XCircle, RotateCcw, ArrowRight } from 'lucide-react';
import LoadState from '../ui/LoadState';
import { api } from '../../api/client';
import { useApi } from '../../api/useApi';
import { ORT_RESULTS_KEY } from '../../api/localData';
import { useAuth } from '../../auth/authContext';
import { useStoredState } from '../../hooks/useStoredState';
import { useTranslation } from '../../i18n/useLanguage';
import { fmt } from '../../utils/format';
import './OrtPractice.css';

const SUBJECTS = ['all', 'math', 'verbal'];
const FEEDBACK = { high: 'feedbackHigh', mid: 'feedbackMid', low: 'feedbackLow' };

// One question at a time. The server grades the attempt and only then reveals
// the answers; it keeps results for signed-in users, guests keep them here.
const OrtPractice = ({ initialSubject = 'all', onFinished }) => {
    const { t, language } = useTranslation();
    const { user } = useAuth();
    const { data, error, reload } = useApi('/ort/questions');
    const [subject, setSubject] = useState(SUBJECTS.includes(initialSubject) ? initialSubject : 'all');
    const [started, setStarted] = useState(false);
    const [index, setIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [, setResults] = useStoredState(ORT_RESULTS_KEY, []);

    if (!data) return <LoadState error={error} onRetry={reload} />;

    const questions = data.items.filter((q) => subject === 'all' || q.subject === subject);
    const current = questions[index];

    const start = () => {
        setAnswers({});
        setIndex(0);
        setResult(null);
        setSubmitError(null);
        setStarted(true);
    };

    const next = async () => {
        if (index < questions.length - 1) {
            setIndex(index + 1);
            return;
        }
        setSubmitting(true);
        setSubmitError(null);
        try {
            const graded = await api('/ort/attempts', { method: 'POST', body: { subject, answers }, language });
            if (!user) {
                const { date, correct, total } = graded.attempt;
                setResults((prev) => [...(Array.isArray(prev) ? prev : []), { date, subject, correct, total }].slice(-20));
            }
            setResult(graded);
            onFinished?.();
        } catch (err) {
            setSubmitError(err);
        } finally {
            setSubmitting(false);
        }
    };

    if (!started) {
        return (
            <div className="ort-practice ort-practice--intro">
                <h2 className="ort-practice__title">{t('ortPractice.title')}</h2>
                <p className="ort-practice__text">{t('ortPractice.intro')}</p>
                <fieldset className="ort-practice__subjects">
                    <legend className="sr-only">{t('ortPractice.chooseSubject')}</legend>
                    {SUBJECTS.map((s) => (
                        <label key={s} className={`ort-practice__subject ${subject === s ? 'ort-practice__subject--active' : ''}`}>
                            <input type="radio" name="ort-subject" value={s} checked={subject === s} onChange={() => setSubject(s)} />
                            {t(`ortPractice.subjects.${s}`)}
                            <small>{fmt(t('ortPractice.questionsCount'), { n: data.counts[s] ?? 0 })}</small>
                        </label>
                    ))}
                </fieldset>
                <button type="button" className="btn btn--primary btn--md" onClick={start} disabled={questions.length === 0}>
                    {t('ortPractice.start')} <ArrowRight size={16} aria-hidden="true" />
                </button>
            </div>
        );
    }

    if (result) {
        const { correct, total, percent } = result.attempt;
        return (
            <div className="ort-practice">
                <div className="ort-practice__score">
                    <span className="ort-practice__score-value">{percent}%</span>
                    <span>{fmt(t('ortPractice.scoreText'), { correct, total })}</span>
                    <p>{t(`ortPractice.${FEEDBACK[result.feedback] || 'feedbackLow'}`)}</p>
                </div>
                <ol className="ort-practice__review">
                    {result.review.map((q) => (
                        <li key={q.id} className={`ort-practice__review-item ${q.isCorrect ? 'is-correct' : 'is-wrong'}`}>
                            {q.isCorrect ? <CheckCircle2 size={18} aria-label={t('ortPractice.correct')} /> : <XCircle size={18} aria-label={t('ortPractice.wrong')} />}
                            <div>
                                <p className="ort-practice__review-q">{q.prompt}</p>
                                <p className="ort-practice__review-a">
                                    {t('ortPractice.answer')}: <strong>{q.options[q.answer]}</strong>
                                    {!q.isCorrect && <> · {t('ortPractice.yours')}: {q.options[q.chosen]}</>}
                                </p>
                                <p className="ort-practice__review-exp">{q.explanation}</p>
                            </div>
                        </li>
                    ))}
                </ol>
                <button type="button" className="btn btn--secondary btn--md" onClick={() => setStarted(false)}>
                    <RotateCcw size={16} aria-hidden="true" /> {t('ortPractice.again')}
                </button>
            </div>
        );
    }

    const chosen = answers[current.id];
    return (
        <div className="ort-practice">
            <div className="ort-practice__progress" aria-hidden="true">
                <span style={{ width: `${((index + (chosen !== undefined ? 1 : 0)) / questions.length) * 100}%` }} />
            </div>
            <p className="ort-practice__counter">
                {fmt(t('ortPractice.counter'), { n: index + 1, total: questions.length })} · {t(`ortPractice.subjects.${current.subject}`)}
            </p>
            <fieldset className="ort-practice__question">
                <legend className="ort-practice__prompt">{current.prompt}</legend>
                <div className="ort-practice__options">
                    {current.options.map((option, i) => (
                        <label key={option} className={`ort-practice__option ${chosen === i ? 'ort-practice__option--chosen' : ''}`}>
                            <input
                                type="radio"
                                name={`q-${current.id}`}
                                checked={chosen === i}
                                onChange={() => setAnswers((a) => ({ ...a, [current.id]: i }))}
                            />
                            <span className="ort-practice__letter" aria-hidden="true">{'ABCD'[i]}</span>
                            {option}
                        </label>
                    ))}
                </div>
            </fieldset>
            {submitError && (
                <p className="form-error" role="alert">
                    {t(submitError.code === 'network' ? 'common.offline' : 'auth.errors.generic')}
                </p>
            )}
            <div className="ort-practice__nav">
                <button type="button" className="btn btn--ghost btn--md" disabled={index === 0 || submitting} onClick={() => setIndex(index - 1)}>
                    {t('ortPractice.back')}
                </button>
                <button type="button" className="btn btn--primary btn--md" disabled={chosen === undefined || submitting} onClick={next}>
                    {index === questions.length - 1 ? t('ortPractice.finish') : t('ortPractice.next')}
                </button>
            </div>
        </div>
    );
};

export default OrtPractice;
