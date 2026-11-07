import { useEffect, useState } from 'react';

// `value`, once it has stopped changing for `delay` ms (search boxes)
export const useDebounced = (value, delay = 250) => {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);
    return debounced;
};
