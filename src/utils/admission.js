const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const formatMonthDay = (mmdd) => {
    const [m, d] = mmdd.split('-').map(Number);
    return `${MONTHS[m - 1]} ${d}`;
};
