// Keep validation aligned with server/utils/degreeRequest.js; each app deploys independently.
const DEGREE_REQUEST_LIMITS = Object.freeze({
    firstName: 100, lastName: 100, englishName: 100, englishLastName: 100,
    nationalCode: 10, phone: 11, birthdate: 10, courseTitle: 200,
    email: 254, endDate: 10, notes: 2000
});
const OPTIONAL_FIELDS = new Set(['email', 'endDate', 'notes']);
const persianCalendar = new Intl.DateTimeFormat('en-US-u-ca-persian', {
    year: 'numeric', month: 'numeric', day: 'numeric', numberingSystem: 'latn', timeZone: 'UTC'
});

function normalizeDigits(value) {
    return value.replace(/[۰-۹٠-٩]/g, (digit) => String(digit.charCodeAt(0) - (digit <= '٩' ? 0x660 : 0x6f0)));
}

function isValidJalaliDate(value) {
    if (typeof value !== 'string' || !/^\d{4}\/\d{2}\/\d{2}$/.test(value)) return false;
    const [year, month, day] = value.split('/').map(Number);
    if (year < 1 || month < 1 || month > 12 || day < 1 || day > (month <= 6 ? 31 : 30)) return false;
    // Round-trip through the runtime's Persian calendar rather than accepting a
    // date library's automatic month/day rollover, including Esfand leap days.
    const monthOffset = month <= 6 ? (month - 1) * 31 : 186 + (month - 7) * 30;
    const estimate = Date.UTC(year + 621, 2, 21, 12) + (monthOffset + day - 1) * 86400000;
    for (let shift = -7; shift <= 7; shift += 1) {
        const parts = Object.fromEntries(persianCalendar.formatToParts(new Date(estimate + shift * 86400000))
            .filter((part) => ['year', 'month', 'day'].includes(part.type)).map((part) => [part.type, Number(part.value)]));
        if (parts.year === year && parts.month === month && parts.day === day) return true;
    }
    return false;
}

function validateDegreeRequest(body) {
    const details = {};
    const errors = {};
    if (!body || typeof body !== 'object' || Array.isArray(body)) return { details, errors: { _form: 'INVALID_TYPE' } };
    for (const [field, limit] of Object.entries(DEGREE_REQUEST_LIMITS)) {
        const value = body[field];
        if (value === undefined) {
            if (OPTIONAL_FIELDS.has(field)) details[field] = '';
            else errors[field] = 'REQUIRED';
            continue;
        }
        if (typeof value !== 'string') { errors[field] = 'INVALID_TYPE'; continue; }
        details[field] = normalizeDigits(value).trim();
        if (!details[field] && !OPTIONAL_FIELDS.has(field)) errors[field] = 'REQUIRED';
        else if (details[field].length > limit) errors[field] = 'TOO_LONG';
        // eslint-disable-next-line no-control-regex
        else if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(details[field])) errors[field] = 'INVALID_TEXT';
    }
    const check = (field, valid, code) => {
        if (!errors[field] && details[field] && !valid(details[field])) errors[field] = code;
    };
    for (const field of ['firstName', 'lastName']) {
        check(field, (value) => /^[\p{L}\p{M}]+(?:[ \u200c'’-][\p{L}\p{M}]+)*$/u.test(value), 'INVALID_NAME');
    }
    for (const field of ['englishName', 'englishLastName']) {
        check(field, (value) => /^[A-Za-z]+(?:[ '’-][A-Za-z]+)*$/.test(value), 'INVALID_LATIN_NAME');
    }
    check('nationalCode', (value) => /^\d{10}$/.test(value), 'INVALID_NATIONAL_CODE');
    check('phone', (value) => /^09\d{9}$/.test(value), 'INVALID_PHONE');
    check('birthdate', isValidJalaliDate, 'INVALID_DATE');
    check('endDate', isValidJalaliDate, 'INVALID_DATE');
    check('email', (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), 'INVALID_EMAIL');
    return { details, errors };
}

export { DEGREE_REQUEST_LIMITS, OPTIONAL_FIELDS, normalizeDigits, isValidJalaliDate, validateDegreeRequest };
