import React from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { MyContext } from "../../App";
import { LanguageProvider, useLanguage } from "../../i18n/LanguageContext";
import DegreeRequest from "./DegreeRequest";
import { submitDegreeRequest } from "./degreeRequestApi";
import { isValidJalaliDate, validateDegreeRequest } from "./degreeRequestValidation";

jest.mock("../../App", () => ({ MyContext: require("react").createContext(null) }));
jest.mock("./degreeRequestApi", () => ({ submitDegreeRequest: jest.fn() }));
jest.mock("react-router-dom", () => {
    const { TextEncoder, TextDecoder } = require("util");
    global.TextEncoder = TextEncoder;
    global.TextDecoder = TextDecoder;
    return jest.requireActual("react-router");
}, { virtual: true });

const details = {
    firstName: "آرمان", lastName: "اسدیان", englishName: "Arman", englishLastName: "Asadian",
    nationalCode: "0012345678", phone: "09123456789", birthdate: "1375/01/15", courseTitle: "دوره ژنتیک",
    email: "", endDate: "", notes: "",
};
function LanguageSwitch() {
    const { setLanguage } = useLanguage();
    return <button type="button" onClick={() => setLanguage("en")}>English</button>;
}
function setup(values = details) {
    const context = { setIsShowNavbar: jest.fn(), setIsShowFooter: jest.fn(), setIsShowCalenderBar: jest.fn(), setIsBaleIconShown: jest.fn() };
    const result = render(<LanguageProvider><MyContext.Provider value={context}><MemoryRouter><LanguageSwitch /><DegreeRequest /></MemoryRouter></MyContext.Provider></LanguageProvider>);
    Object.entries(values).forEach(([name, value]) => fireEvent.change(result.container.querySelector(`[name="${name}"]`), { target: { value } }));
    return result;
}
const submit = () => fireEvent.submit(screen.getByRole("form"));
beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    jest.spyOn(window, "scrollTo").mockImplementation(() => {});
});
afterEach(() => jest.restoreAllMocks());

test("sends all fields normalized, then confirms success and requires a fresh form for another request", async () => {
    submitDegreeRequest.mockResolvedValue({ id: "saved-request" });
    setup({ ...details, firstName: "  آرمان  ", nationalCode: "۰۰١۲۳۴۵۶۷۸", birthdate: "۱۳۷۵/۰۱/۱۵", email: "student@example.com", endDate: "1403/12/30", notes: " توضیح " });
    submit();
    expect(submitDegreeRequest).toHaveBeenCalledWith({ ...details, email: "student@example.com", endDate: "1403/12/30", notes: "توضیح" });
    expect(await screen.findByRole("status")).toHaveTextContent("درخواست مدرک شما با موفقیت ثبت شد.");
    expect(screen.queryByRole("form")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "ثبت درخواست دیگر" }));
    expect(screen.getByRole("textbox", { name: "نام", exact: true })).toHaveValue("");
    expect(screen.getByRole("textbox", { name: "نام", exact: true })).toHaveFocus();
    expect(submitDegreeRequest).toHaveBeenCalledTimes(1);
});

test("blocks repeated submission while saving and keeps fields disabled", async () => {
    let resolve;
    submitDegreeRequest.mockImplementation(() => new Promise((done) => { resolve = done; }));
    setup();
    submit();
    submit();
    expect(submitDegreeRequest).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: "در حال ثبت درخواست…" })).toBeDisabled();
    expect(screen.getByRole("textbox", { name: "تاریخ تولد", exact: true })).toBeDisabled();
    await act(async () => resolve({ id: "saved-request" }));
    expect(screen.getByRole("status")).toBeVisible();
});

test("failed submissions preserve all values and can be retried", async () => {
    submitDegreeRequest.mockRejectedValueOnce(new Error("offline")).mockResolvedValueOnce({ id: "saved-request" });
    setup({ ...details, notes: "اطلاعات تکمیلی" });
    submit();
    expect(await screen.findByRole("alert")).toHaveTextContent("ثبت درخواست تأیید نشد");
    expect(screen.getByRole("alert")).toHaveFocus();
    expect(screen.getByRole("textbox", { name: "توضیحات (اختیاری)" })).toHaveValue("اطلاعات تکمیلی");
    expect(screen.getByRole("textbox", { name: "کد ملی", exact: true })).toHaveValue("0012345678");
    submit();
    expect(await screen.findByRole("status")).toBeVisible();
    expect(submitDegreeRequest).toHaveBeenCalledTimes(2);
});

test("server field errors are accessible and translate when switching language without losing the draft", async () => {
    submitDegreeRequest.mockRejectedValue({ code: "VALIDATION_ERROR", fields: { nationalCode: "INVALID_NATIONAL_CODE" } });
    setup();
    submit();
    const input = screen.getByRole("textbox", { name: "کد ملی", exact: true });
    await waitFor(() => expect(input).toHaveAttribute("aria-invalid", "true"));
    expect(input).toHaveAccessibleDescription("کد ملی باید ۱۰ رقم باشد.");
    expect(input).toHaveFocus();
    fireEvent.click(screen.getByRole("button", { name: "English" }));
    expect(screen.getByRole("textbox", { name: "National ID number", exact: true })).toHaveAccessibleDescription("The national ID must contain 10 digits.");
    expect(screen.getByRole("textbox", { name: "First name", exact: true })).toHaveValue("آرمان");
    expect(screen.getByRole("alert")).toHaveTextContent("Please check the highlighted fields.");
});

test("invalid typed dates stay unchanged, receive an accessible error, and never submit", () => {
    setup({ ...details, birthdate: "1402/12/30" });
    submit();
    const input = screen.getByRole("textbox", { name: "تاریخ تولد", exact: true });
    expect(input).toHaveValue("1402/12/30");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription(/یک تاریخ شمسی معتبر/);
    expect(submitDegreeRequest).not.toHaveBeenCalled();
});

test("rate limiting has a clear message and successful submissions also work in English", async () => {
    submitDegreeRequest.mockRejectedValueOnce({ status: 429 }).mockResolvedValueOnce({ id: "saved-request" });
    setup();
    fireEvent.click(screen.getByRole("button", { name: "English" }));
    submit();
    expect(await screen.findByRole("alert")).toHaveTextContent("Too many attempts.");
    submit();
    expect(await screen.findByRole("status")).toHaveTextContent("Your certificate request was submitted successfully.");
});

test("validates Persian calendar leap days and preserves leading zeros without requiring optional fields", () => {
    expect(isValidJalaliDate("1403/12/30")).toBe(true);
    expect(isValidJalaliDate("1342/12/30")).toBe(true);
    ["1402/12/30", "1341/12/30", "1403/07/31", "1403/13/01"].forEach((value) => expect(isValidJalaliDate(value)).toBe(false));
    expect(validateDegreeRequest(details)).toEqual({ details, errors: {} });
    expect(validateDegreeRequest({ ...details, courseTitle: "x".repeat(201), email: "invalid", endDate: "1402/12/30" }).errors)
        .toEqual({ courseTitle: "TOO_LONG", email: "INVALID_EMAIL", endDate: "INVALID_DATE" });
});
