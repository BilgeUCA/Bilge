// API validation errors name the field; reuse the matching form message
const VALIDATION_KEYS = { name: 'name', email: 'emailInvalid', password: 'passwordShort', newPassword: 'passwordShort' };

// Error codes map to the translation keys auth.errors.<code>
export const authErrorMessage = (t, err) => {
    if (err.code === 'validation' && VALIDATION_KEYS[err.field]) return t(`auth.errors.${VALIDATION_KEYS[err.field]}`);
    return t(`auth.errors.${err.code}`, t('auth.errors.generic'));
};
