import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Award, MousePointer2 } from 'lucide-react';
import Button from '../ui/Button';
import SectionReveal from '../ui/SectionReveal';
import { useTranslation } from '../../i18n/useLanguage';
import './HeroSection.css';

// Sticky notes on the mock "study board" (positions in % of the canvas)
const NOTES = [
    { id: 'ort', x: 6, y: 10, rotate: -2, tone: 'yellow' },
    { id: 'auca', x: 56, y: 6, rotate: 1.5, tone: 'blue' },
    { id: 'sh', x: 58, y: 54, rotate: -1, tone: 'green' },
    { id: 'practice', x: 8, y: 56, rotate: 2, tone: 'pink' },
    { id: 'budget', x: 33, y: 33, rotate: -0.5, tone: 'violet' },
];

// Curved connectors between notes (SVG viewBox 0 0 100 100, stretched)
const CONNECTORS = [
    'M 30 22 C 40 22, 44 16, 56 16',
    'M 22 34 C 22 42, 28 44, 33 44',
    'M 60 34 C 58 40, 56 42, 54 42',
    'M 50 54 C 54 62, 56 64, 58 64',
    'M 33 50 C 28 58, 26 60, 24 62',
];

// Remote cursors: base position + gentle Lissajous wander (in %)
const CURSORS = [
    { id: 'aida', color: '#2563EB', base: [42, 24], amp: [10, 6], speed: [0.00031, 0.00043], phase: 0 },
    { id: 'bakyt', color: '#DB2777', base: [26, 72], amp: [9, 7], speed: [0.00027, 0.00036], phase: 2 },
    { id: 'mentor', color: '#059669', base: [74, 44], amp: [8, 9], speed: [0.00035, 0.00029], phase: 4 },
];

const AVATARS = [
    { initials: 'AK', color: '#2563EB' },
    { initials: 'BT', color: '#DB2777' },
    { initials: 'NM', color: '#059669' },
    { initials: 'ZS', color: '#D97706' },
];

const TICKER_INTERVAL = 3200;

const usePrefersReducedMotion = () => {
    const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        const onChange = (e) => setReduced(e.matches);
        mq.addEventListener('change', onChange);
        return () => mq.removeEventListener('change', onChange);
    }, []);
    return reduced;
};

const HeroCanvas = () => {
    const { t } = useTranslation();
    const reducedMotion = usePrefersReducedMotion();
    const canvasRef = useRef(null);
    const cursorRefs = useRef([]);
    const [tickerIndex, setTickerIndex] = useState(0);
    const ticker = t('hero.ticker');
    const messages = Array.isArray(ticker) ? ticker : [];

    // Move cursors with requestAnimationFrame. Paused when reduced motion is
    // preferred, the tab is hidden, or the canvas is scrolled out of view.
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return undefined;
        let frame = null;
        let visible = true;

        const place = (time) => {
            CURSORS.forEach((c, i) => {
                const el = cursorRefs.current[i];
                if (!el) return;
                const x = c.base[0] + c.amp[0] * Math.sin(time * c.speed[0] + c.phase);
                const y = c.base[1] + c.amp[1] * Math.sin(time * c.speed[1] + c.phase * 1.3);
                el.style.left = `${x}%`;
                el.style.top = `${y}%`;
            });
        };

        const loop = (time) => {
            place(time);
            frame = requestAnimationFrame(loop);
        };
        const start = () => {
            if (frame === null && !reducedMotion && visible && !document.hidden) frame = requestAnimationFrame(loop);
        };
        const stop = () => {
            if (frame !== null) cancelAnimationFrame(frame);
            frame = null;
        };

        place(0); // static resting positions (also the reduced-motion state)
        start();

        const io = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            if (visible) start();
            else stop();
        });
        io.observe(canvas);
        const onVisibility = () => (document.hidden ? stop() : start());
        document.addEventListener('visibilitychange', onVisibility);

        return () => {
            stop();
            io.disconnect();
            document.removeEventListener('visibilitychange', onVisibility);
        };
    }, [reducedMotion]);

    // Cycle the activity ticker (frozen on the first message under reduced motion)
    useEffect(() => {
        if (reducedMotion || messages.length < 2) return undefined;
        const id = setInterval(() => setTickerIndex((i) => (i + 1) % messages.length), TICKER_INTERVAL);
        return () => clearInterval(id);
    }, [reducedMotion, messages.length]);

    return (
        <div className="hero-board" aria-hidden="true">
            <div className="hero-board__bar">
                <span className="hero-board__dots"><i /><i /><i /></span>
                <span className="hero-board__name">{t('hero.boardTitle')}</span>
                <span className="hero-board__avatars">
                    {AVATARS.map((a) => (
                        <span key={a.initials} className="hero-board__avatar" style={{ background: a.color }}>{a.initials}</span>
                    ))}
                    <span className="hero-board__avatar hero-board__avatar--more">+12</span>
                </span>
            </div>

            <div className="hero-board__presence">
                <span className="hero-board__presence-dot" />
                {t('hero.presence')}
            </div>

            <div className="hero-board__canvas" ref={canvasRef}>
                <svg className="hero-board__links" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {CONNECTORS.map((d) => (
                        <path key={d} d={d} vectorEffect="non-scaling-stroke" />
                    ))}
                </svg>

                {NOTES.map((note) => (
                    <div
                        key={note.id}
                        className={`hero-note hero-note--${note.tone}`}
                        style={{ left: `${note.x}%`, top: `${note.y}%`, rotate: `${note.rotate}deg` }}
                    >
                        <span className="hero-note__label">{t(`hero.notes.${note.id}.label`)}</span>
                        <span className="hero-note__text">{t(`hero.notes.${note.id}.text`)}</span>
                    </div>
                ))}

                {CURSORS.map((c, i) => (
                    <div
                        key={c.id}
                        ref={(el) => { cursorRefs.current[i] = el; }}
                        className="hero-cursor"
                        style={{ '--cursor-color': c.color }}
                    >
                        <MousePointer2 size={18} fill="currentColor" strokeWidth={1.5} />
                        <span className="hero-cursor__label">{t(`hero.cursors.${c.id}`)}</span>
                    </div>
                ))}
            </div>

            <div className="hero-board__ticker">
                <span className="hero-board__live">{t('hero.live')}</span>
                <span key={tickerIndex} className="hero-board__message">{messages[tickerIndex]}</span>
            </div>
        </div>
    );
};

const HeroSection = () => {
    const { t } = useTranslation();

    return (
        <section className="hero" id="hero-section">
            <div className="hero__bg-pattern" />
            <div className="container hero__grid">
                <div className="hero__copy">
                    <SectionReveal>
                        <span className="hero__badge">
                            <span className="hero__badge-dot" />
                            {t('hero.badge')}
                        </span>
                    </SectionReveal>

                    <SectionReveal delay={100}>
                        <h1 className="hero__title">
                            {t('hero.titleLead')}{' '}
                            <span className="hero__title-highlight">{t('hero.titleHighlight')}</span>
                        </h1>
                    </SectionReveal>

                    <SectionReveal delay={200}>
                        <p className="hero__subtitle">{t('hero.subtitle')}</p>
                    </SectionReveal>

                    <SectionReveal delay={300}>
                        <div className="hero__actions">
                            <Button to="/universities" variant="primary" size="lg" icon={<ArrowRight size={18} />} id="hero-explore-btn">
                                {t('hero.exploreBtn')}
                            </Button>
                            <Button to="/scholarships" variant="secondary" size="lg" icon={<Award size={18} />} iconPosition="left" id="hero-scholarships-btn">
                                {t('hero.scholarshipsBtn')}
                            </Button>
                        </div>
                        <p className="hero__note">{t('hero.freeLine')}</p>
                    </SectionReveal>
                </div>

                <SectionReveal delay={200} className="hero__visual">
                    <HeroCanvas />
                </SectionReveal>
            </div>
        </section>
    );
};

export default HeroSection;
