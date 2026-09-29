import { useEffect, useRef } from 'react';

const REVERT_HOLD_MS = 3000;

// Form field wrapper implementing the Transitions.dev "error state shake":
// .t-input-wrap + .t-input get .is-error, the shake restarts on every new
// error signal, and after the hold time the error fades back to neutral.
const ShakeField = ({ id, label, error, message, signal, onRevert, trailing, labelAside, children }) => {
    const boxRef = useRef(null);
    const onRevertRef = useRef(onRevert);

    useEffect(() => {
        onRevertRef.current = onRevert;
    });

    useEffect(() => {
        if (!error || !boxRef.current) return undefined;
        const box = boxRef.current;
        box.classList.remove('is-shaking');
        void box.offsetWidth; // force reflow so the animation restarts
        box.classList.add('is-shaking');
        const timer = setTimeout(() => onRevertRef.current?.(), REVERT_HOLD_MS);
        return () => clearTimeout(timer);
    }, [error, signal]);

    const errorId = `${id}-error`;

    return (
        <div className={`auth-field t-input-wrap ${error ? 'is-error' : ''}`}>
            <div className="auth-field__label-row">
                <label htmlFor={id} className="auth-field__label">{label}</label>
                {labelAside}
            </div>
            <div
                ref={boxRef}
                className={`auth-field__box t-input ${error ? 'is-error' : ''}`}
                onAnimationEnd={(e) => e.currentTarget.classList.remove('is-shaking')}
            >
                {children({ 'aria-invalid': error ? true : undefined, 'aria-describedby': errorId })}
                {trailing}
            </div>
            <p className="auth-field__error t-error-msg" id={errorId} aria-live="polite">
                {message}
            </p>
        </div>
    );
};

export default ShakeField;
