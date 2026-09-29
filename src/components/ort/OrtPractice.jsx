import { useState } from 'react';
import { CheckCircle2, XCircle, RotateCcw, ArrowRight } from 'lucide-react';
import { ortQuestions, ORT_RESULTS_KEY } from '../../data/ortPractice';
import { useStoredState } from '../../hooks/useStoredState';
import { useTranslation } from '../../i18n/useLanguage';
import { fmt } from '../../utils/format';
import './OrtPractice.css';

// One question at a time; the result screen reviews every answer and the
// score is saved to localStorage for the Progress tab and the account page.
const OrtPractice = ({ initialSubject = 'all', onFinished }) => {
    const { t } = useTranslation();
    const [subject, setSubject] = useState(initialSubject);
    const [started, setStarted] = useState(false);
    const [index, setIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [finished, setFinished] = useState(false);
    const [, setResults] = useStoredState(ORT_RESULTS_KEY, []);

    const questions = ortQuestions.filter((q) => subject === 'all' || q.subject === subject);
    const current = questions[index];
    const correctCount = questions.filter((q) => answers[q.id] === q.answer).length;

    const start = () => {
        setAnswers({});
        setIndex(0);
        setFinished(false);
        setStarted(true);
    };

    const next = () => {
        if (index < questions.length - 1) {
            setIndex(index + 1);
            return;
        }
        const correct = questions.filter((q) => answers[q.id] === q.answer).length;
        setResults((prev) => [
            ...prev,
            { date: new Date().toISOString(), subject, correct, total: questions.length },
        ].slice(-20));
        setFinished(true);
        onFinished?.();
    };

    if (!started) {
        return (
            <div className="ort-practice ort-practice--intro">
                <h2 className="ort-practice__title">{t('ortPractice.title')}</h2>
                <p className="ort-practice__text">{t('ortPractice.intro')}</p>
                <fieldset className="ort-practice__subjects">
                    <legend className="sr-only">{t('ortPractice.chooseSubject')}</legend>
                    {['all', 'math', 'verbal'].map((s) => (
                        <label key={s} className={`ort-practice__subject ${subject === s ? 'ort-practice__subject--active' : ''}`}>
                            <input type="radio" name="ort-subject" value={s} checked={subject === s} onChange={() => setSubject(s)} />
                            {t(`ortPractice.subjects.${s}`)}
                            <small>{fmt(t('ortPractice.questionsCount'), { n: ortQuestions.filter((q) => s === 'all' || q.subject === s).length })}</small>
                        </label>
                    ))}
                </fieldset>
                <button type="button" className="btn btn--primary btn--md" onClick={start}>
                    {t('ortPractice.start')} <ArrowRight size={16} aria-hidden="true" />
                </button>
            </div>
        );
    }

    if (finished) {
        const pct = Math.round((correctCount / questions.length) * 100);
        return (
            <div className="ort-practice">
                <div className="ort-practice__score">
                    <span className="ort-practice__score-value">{pct}%</span>
                    <span>{fmt(t('ortPractice.scoreText'), { correct: correctCount, total: questions.length })}</span>
                    <p>{pct >= 80 ? t('ortPractice.feedbackHigh') : pct >= 50 ? t('ortPractice.feedbackMid') : t('ortPractice.feedbackLow')}</p>
                </div>
                <ol className="ort-practice__review">
                    {questions.map((q) => {
                        const ok = answers[q.id] === q.answer;
                        return (
                            <li key={q.id} className={`ort-practice__review-item ${ok ? 'is-correct' : 'is-wrong'}`}>
                                {ok ? <CheckCircle2 size={18} aria-label={t('ortPractice.correct')} /> : <XCircle size={18} aria-label={t('ortPractice.wrong')} />}
                                <div>
                                    <p className="ort-practice__review-q">{q.prompt}</p>
                                    <p className="ort-practice__review-a">
                                        {t('ortPractice.answer')}: <strong>{q.options[q.answer]}</strong>
                                        {!ok && answers[q.id] !== undefined && <> · {t('ortPractice.yours')}: {q.options[answers[q.id]]}</>}
                                    </p>
                                    <p className="ort-practice__review-exp">{q.explanation}</p>
                                </div>
                            </li>
                        );
                    })}
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
            <div className="ort-practice__nav">
                <button type="button" className="btn btn--ghost btn--md" disabled={index === 0} onClick={() => setIndex(index - 1)}>
                    {t('ortPractice.back')}
                </button>
                <button type="button" className="btn btn--primary btn--md" disabled={chosen === undefined} onClick={next}>
                    {index === questions.length - 1 ? t('ortPractice.finish') : t('ortPractice.next')}
                </button>
            </div>
        </div>
    );
};

export default OrtPractice;
