import axios from "axios";

// These independently deployed apps share the rules in server/utils/projectRequest.js.
const PROJECT_REQUEST_LIMITS = Object.freeze({
    firstName: 100,
    lastName: 100,
    phone: 11,
    description: 2000,
});
const NAME_PATTERN = /^[\p{L}\p{M}]+(?:[ \u200c'’-][\p{L}\p{M}]+)*$/u;
// eslint-disable-next-line no-control-regex
const CONTROL_PATTERN = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/;
const FIELD_CODES = new Set([
    "REQUIRED", "INVALID_TYPE", "INVALID_NAME", "INVALID_PHONE", "TOO_LONG", "INVALID_TEXT",
]);
const RESPONSE_CODES = new Set(["VALIDATION_ERROR", "RATE_LIMITED", "REQUEST_CREATE_FAILED"]);

export function normalizeProjectDigits(value) {
    return String(value ?? "").replace(/[۰-۹٠-٩]/g, (digit) =>
        String(digit.charCodeAt(0) - (digit <= "٩" ? 0x660 : 0x6f0)));
}

export function validateProjectRequest(fields) {
    const details = {};
    const errors = {};
    if (!fields || typeof fields !== "object" || Array.isArray(fields)) {
        return { details, errors: { _form: "INVALID_TYPE" } };
    }
    for (const [field, limit] of Object.entries(PROJECT_REQUEST_LIMITS)) {
        const value = fields[field];
        if (value === undefined) {
            errors[field] = "REQUIRED";
            continue;
        }
        if (typeof value !== "string") {
            errors[field] = "INVALID_TYPE";
            continue;
        }
        details[field] = normalizeProjectDigits(value).trim();
        if (!details[field]) errors[field] = "REQUIRED";
        else if (details[field].length > limit) errors[field] = "TOO_LONG";
        else if (CONTROL_PATTERN.test(details[field])) errors[field] = "INVALID_TEXT";
    }
    for (const field of ["firstName", "lastName"]) {
        if (!errors[field] && !NAME_PATTERN.test(details[field])) errors[field] = "INVALID_NAME";
    }
    if (!errors.phone && !/^09\d{9}$/.test(details.phone)) errors.phone = "INVALID_PHONE";
    return { details, errors };
}

export async function submitProjectRequest(details) {
    try {
        const baseUrl = (process.env.REACT_APP_BASE_URL || "").replace(/\/$/, "");
        const payload = Object.fromEntries(Object.keys(PROJECT_REQUEST_LIMITS).map((field) => [field, details[field]]));
        const { data } = await axios.post(`${baseUrl}/api/project-requests`, payload, { timeout: 30000 });
        if (data?.success !== true || typeof data.request?.id !== "string" || !data.request.id.trim()) {
            throw new Error("INVALID_RESPONSE");
        }
        return {
            id: data.request.id.trim(),
            createdAt: typeof data.request.createdAt === "string" ? data.request.createdAt : undefined,
        };
    } catch (source) {
        // Axios request configuration contains personal information and stays private.
        const response = source?.response;
        const error = new Error("Project request could not be confirmed");
        error.status = Number.isInteger(response?.status) ? response.status : undefined;
        error.code = RESPONSE_CODES.has(response?.data?.code) ? response.data.code : "REQUEST_FAILED";
        error.fields = Object.fromEntries(Object.keys(PROJECT_REQUEST_LIMITS)
            .filter((field) => FIELD_CODES.has(response?.data?.errors?.[field]))
            .map((field) => [field, response.data.errors[field]]));
        throw error;
    }
}
