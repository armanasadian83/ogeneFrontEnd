import axios from "axios";
import { normalizeProjectDigits, submitProjectRequest, validateProjectRequest } from "./projectRequest";

jest.mock("axios", () => ({ post: jest.fn() }));

const details = {
    firstName: "آرمان",
    lastName: "حسین‌زاده",
    phone: "09123456789",
    description: "توضیح پروژه",
};
const originalBaseUrl = process.env.REACT_APP_BASE_URL;
beforeEach(() => {
    jest.resetAllMocks();
    process.env.REACT_APP_BASE_URL = "https://api.example.test/";
});
afterAll(() => {
    if (originalBaseUrl === undefined) delete process.env.REACT_APP_BASE_URL;
    else process.env.REACT_APP_BASE_URL = originalBaseUrl;
});

test("normalizes mixed Persian and Arabic digits, trims strings and retains only the four request fields", () => {
    expect(normalizeProjectDigits("۰١۲٣۴٥۶٧۸٩")).toBe("0123456789");
    const result = validateProjectRequest({
        firstName: "  آرمان  ", lastName: "حسین‌زاده", phone: " ٠٩۱۲۳۴۵۶۷۸۹ ",
        description: "  بررسی ۲ نمونه\nو تحلیل داده ٣  ", userId: "ignored", createdAt: "ignored",
    });
    expect(result).toEqual({
        details: { ...details, description: "بررسی 2 نمونه\nو تحلیل داده 3" }, errors: {},
    });
});

test("required, type, length, name and phone errors have stable codes without coercing values", () => {
    expect(validateProjectRequest({}).errors).toEqual({ firstName: "REQUIRED", lastName: "REQUIRED", phone: "REQUIRED", description: "REQUIRED" });
    expect(validateProjectRequest([])).toEqual({ details: {}, errors: { _form: "INVALID_TYPE" } });
    expect(validateProjectRequest({ firstName: 12, lastName: "x".repeat(101), phone: "08123456789", description: "  " }).errors)
        .toEqual({ firstName: "INVALID_TYPE", lastName: "TOO_LONG", description: "REQUIRED", phone: "INVALID_PHONE" });
    expect(validateProjectRequest({ ...details, firstName: "Arman 2", phone: 9123456789 }).errors)
        .toEqual({ phone: "INVALID_TYPE", firstName: "INVALID_NAME" });
    expect(validateProjectRequest({ ...details, description: "x".repeat(2001) }).errors.description).toBe("TOO_LONG");
    expect(validateProjectRequest({ ...details, firstName: "Élodie", lastName: "O'Neil-Smith", description: "line 1\nline 2\ttab" }).errors).toEqual({});
});

test("control characters are rejected in every field while ordinary multiline descriptions are supported", () => {
    for (const field of Object.keys(details)) {
        const result = validateProjectRequest({ ...details, [field]: `a\u0000b` });
        expect(result.errors[field]).toBe("INVALID_TEXT");
    }
});

test("posts only request fields and returns only a confirmed identifier and creation date", async () => {
    axios.post.mockResolvedValue({ data: { success: true, request: { id: "saved-id", createdAt: "2026-11-06T10:00:00.000Z", phone: details.phone } } });
    await expect(submitProjectRequest({ ...details, userId: "private-user" })).resolves.toEqual({ id: "saved-id", createdAt: "2026-11-06T10:00:00.000Z" });
    expect(axios.post).toHaveBeenCalledWith("https://api.example.test/api/project-requests", details, { timeout: 30000 });
});

test("malformed and unsuccessful responses cannot become successful submissions", async () => {
    for (const data of [null, "<html>error</html>", { success: false }, { success: true, request: {} }, { success: true, request: { id: " " } }]) {
        axios.post.mockResolvedValue({ data });
        await expect(submitProjectRequest(details)).rejects.toMatchObject({ code: "REQUEST_FAILED", fields: {} });
    }
});

test("failure errors retain safe status and field codes without exposing identity data or logging Axios errors", async () => {
    const errorLog = jest.spyOn(console, "error").mockImplementation(() => {});
    const infoLog = jest.spyOn(console, "log").mockImplementation(() => {});
    try {
        axios.post.mockRejectedValue({
            message: "private request body", config: { data: details },
            response: { status: 400, data: { code: "VALIDATION_ERROR", errors: { phone: "INVALID_PHONE", firstName: details.firstName, userId: "INVALID_TYPE" } } },
        });
        const error = await submitProjectRequest(details).catch((reason) => reason);
        expect(error).toBeInstanceOf(Error);
        expect(error).toMatchObject({ status: 400, code: "VALIDATION_ERROR", fields: { phone: "INVALID_PHONE" } });
        expect(error.config).toBeUndefined();
        expect(error.message).not.toContain("private");
        expect(errorLog).not.toHaveBeenCalled();
        expect(infoLog).not.toHaveBeenCalled();
        axios.post.mockRejectedValue(null);
        await expect(submitProjectRequest(details)).rejects.toMatchObject({ code: "REQUEST_FAILED", fields: {} });
    } finally {
        errorLog.mockRestore();
        infoLog.mockRestore();
    }
});
