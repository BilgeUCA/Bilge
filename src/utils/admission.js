const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY = 24 * 60 * 60 * 1000;

const toDate = (mmdd, year) => {
    const [m, d] = mmdd.split('-').map(Number);
    return new Date(year, m - 1, d);
};

export const formatMonthDay = (mmdd) => {
    const [m, d] = mmdd.split('-').map(Number);
    return `${MONTHS[m - 1]} ${d}`;
};

// Works out where "today" sits in a yearly admission window such as
// { open: '06-20', close: '08-25' }. Windows may wrap the new year
// (e.g. Nov → Jan). Returns { state: 'open' | 'upcoming', daysLeft?, opensOn? }.
export const getAdmissionStatus = (window, today = new Date()) => {
    if (!window) return { state: 'unknown' };
    const now = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const year = now.getFullYear();

    // Check the window that started last year (for wrap-around) and this year
    for (const startYear of [year - 1, year]) {
        const open = toDate(window.open, startYear);
        let close = toDate(window.close, startYear);
        if (close < open) close = toDate(window.close, startYear + 1);
        if (now >= open && now <= close) {
            return { state: 'open', daysLeft: Math.round((close - now) / DAY) };
        }
    }

    let nextOpen = toDate(window.open, year);
    if (nextOpen <= now) nextOpen = toDate(window.open, year + 1);
    return {
        state: 'upcoming',
        opensOn: `${MONTHS[nextOpen.getMonth()]} ${nextOpen.getDate()}, ${nextOpen.getFullYear()}`,
        daysUntil: Math.round((nextOpen - now) / DAY),
    };
};
