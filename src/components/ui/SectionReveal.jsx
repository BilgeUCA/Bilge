import { useRef, useEffect, useState } from 'react';

const SectionReveal = ({ children, className = '', delay = 0 }) => {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const [prefersReducedMotion] = useState(
        () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => setIsVisible(true), prefersReducedMotion ? 0 : delay);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [delay, prefersReducedMotion]);

    // Reduced motion keeps the feedback (a fade) but drops the travel distance
    const travel = prefersReducedMotion ? '0' : '30px';
    const duration = prefersReducedMotion ? '0.2s' : '0.6s';

    return (
        <div
            ref={ref}
            className={className}
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : `translateY(${travel})`,
                transition: `opacity ${duration} var(--ease-spring) ${delay}ms, transform ${duration} var(--ease-spring) ${delay}ms`,
            }}
        >
            {children}
        </div>
    );
};

export default SectionReveal;
