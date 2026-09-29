// "{n} days left" + { n: 3 } → "3 days left"
export const fmt = (template, vars = {}) =>
    String(template).replace(/\{(\w+)\}/g, (_, key) => (key in vars ? vars[key] : `{${key}}`));

export const formatUsd = (value) => `$${value.toLocaleString('en-US')}`;
