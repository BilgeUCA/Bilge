import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        // Jump instantly: a smooth scroll would visibly travel through the old page
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, [pathname]);

    return null;
};

export default ScrollToTop;
