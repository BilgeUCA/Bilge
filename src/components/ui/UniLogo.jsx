import { useState } from 'react';
import './UniLogo.css';

// University / program logo with a monogram fallback when no image exists
// or the image fails to load.
const UniLogo = ({ src, name, shortName, color = '#2563EB', className = '' }) => {
    const [failed, setFailed] = useState(false);

    if (!src || failed) {
        return (
            <span className={`uni-logo uni-logo--monogram ${className}`} style={{ background: color }} aria-hidden="true">
                {(shortName || name).slice(0, 4)}
            </span>
        );
    }

    return (
        <span className={`uni-logo ${className}`}>
            <img src={src} alt={`${name} logo`} loading="lazy" onError={() => setFailed(true)} />
        </span>
    );
};

export default UniLogo;
