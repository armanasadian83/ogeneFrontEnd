import React from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MyContext } from "../../App";
import { LanguageProvider, useLanguage } from "../../i18n/LanguageContext";
import { fetchDataFromApi } from "../../utils/api";
import { submitProjectRequest } from "./projectRequest";
import ProjectRequestForm from "./ProjectRequestForm";

jest.mock("../../App", () => ({ MyContext: require("react").createContext(null) }));
jest.mock("axios", () => ({ get: jest.fn(), post: jest.fn() }));
jest.mock("../../utils/api", () => ({
    ...jest.requireActual("../../utils/api"),
    fetchDataFromApi: jest.fn(),
}));
jest.mock("./projectRequest", () => ({
    ...jest.requireActual("./projectRequest"),
    submitProjectRequest: jest.fn(),
}));

const values = { firstName: "آرمان", lastName: "اسدیان", phone: "09123456789", description: "تحلیل داده‌های پروژه پژوهشی" };
const labels = { firstName: "نام", lastName: "نام خانوادگی", phone: "شماره همراه", description: "توضیح کوتاه پروژه" };
const clientId = "6123456789abcdef01234567";
const storedUser = { userId: clientId, name: "نام قدیمی", lastName: "خانوادگی قدیمی", phone: "۰۹۱۲۳۴۵۶۷۸۹" };
const freshProfile = { _id: clientId, name: "نام تازه", lastName: "خانوادگی تازه", phone: "09129876543" };

function deferred() {
    let resolve;
    const promise = new Promise((done) => { resolve = done; });
    return { promise, resolve };
}

function LanguageSwitch() {
    const { setLanguage } = useLanguage();
    return <button type="button" onClick={() => setLanguage("en")}>English</button>;
}

function FormHarness({ loggedIn = false }) {
    return <LanguageProvider><MyContext.Provider value={{ isLoggedIn: loggedIn }}>
        <LanguageSwitch /><ProjectRequestForm />
    </MyContext.Provider></LanguageProvider>;
}

function fillFields(nextValues = values) {
    Object.entries(nextValues).forEach(([name, value]) => {
        fireEvent.change(screen.getByRole("textbox", { name: labels[name], exact: true }), { target: { value } });
    });
}

function storeSession() {
    localStorage.setItem("token", "existing-client-token");
    localStorage.setItem("user", JSON.stringify(storedUser));
}

beforeEach(() => {
    jest.resetAllMocks();
    localStorage.clear();
    fetchDataFromApi.mockResolvedValue(null);
});

test("guests make no profile read and required or invalid fields block submission with accessible errors", () => {
    render(<FormHarness />);
    fireEvent.click(screen.getByRole("button", { name: "ثبت درخواست پروژه", exact: true }));
    for (const label of Object.values(labels)) {
        const input = screen.getByRole("textbox", { name: label, exact: true });
        expect(input).toBeRequired();
        expect(input).toHaveAttribute("aria-invalid", "true");
        expect(input).toHaveAccessibleDescription("تکمیل این قسمت الزامی است.");
    }
    expect(screen.getByRole("textbox", { name: "نام", exact: true })).toHaveFocus();
    fillFields({ ...values, phone: "08123456789" });
    fireEvent.submit(screen.getByRole("form"));
    expect(screen.getByRole("textbox", { name: "شماره همراه" })).toHaveAccessibleDescription(/با ۰۹ شروع شود/);
    expect(screen.getByRole("textbox", { name: "توضیح کوتاه پروژه" })).toHaveAttribute("maxlength", "2000");
    expect(submitProjectRequest).not.toHaveBeenCalled();
    expect(fetchDataFromApi).not.toHaveBeenCalled();
});

test("pending saves disable every field and reject duplicate clicks until confirmed success", async () => {
    const save = deferred();
    submitProjectRequest.mockReturnValue(save.promise);
    render(<FormHarness />);
    fillFields({ ...values, firstName: "  آرمان  ", phone: "٠٩۱۲۳۴۵۶۷۸۹" });
    fireEvent.click(screen.getByRole("button", { name: "ثبت درخواست پروژه", exact: true }));
    fireEvent.submit(screen.getByRole("form"));
    expect(submitProjectRequest).toHaveBeenCalledTimes(1);
    expect(submitProjectRequest).toHaveBeenCalledWith(values);
    expect(screen.getByRole("button", { name: "در حال ثبت درخواست…", exact: true })).toBeDisabled();
    screen.getAllByRole("textbox").forEach((input) => expect(input).toBeDisabled());
    await act(async () => save.resolve({ id: "saved-request", createdAt: "2026-11-06T10:00:00.000Z" }));
    expect(screen.getByRole("status")).toHaveTextContent("درخواست پروژه شما ثبت شد");
    expect(screen.getByRole("status")).toHaveFocus();
    expect(screen.queryByRole("form")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "ثبت درخواست دیگر", exact: true }));
    screen.getAllByRole("textbox").forEach((input) => expect(input).toHaveValue(""));
    expect(screen.getByRole("textbox", { name: "نام", exact: true })).toHaveFocus();
});

test("failed submissions preserve the draft and retry saves the same details", async () => {
    submitProjectRequest.mockRejectedValueOnce({ code: "REQUEST_FAILED", fields: {} }).mockResolvedValueOnce({ id: "saved-request" });
    render(<FormHarness />);
    fillFields();
    fireEvent.submit(screen.getByRole("form"));
    expect(await screen.findByRole("alert")).toHaveTextContent("اطلاعات شما حفظ شده است");
    expect(screen.getByRole("alert")).toHaveFocus();
    for (const [name, value] of Object.entries(values)) expect(screen.getByRole("textbox", { name: labels[name], exact: true })).toHaveValue(value);
    fireEvent.submit(screen.getByRole("form"));
    expect(await screen.findByRole("status")).toHaveTextContent("درخواست پروژه شما ثبت شد");
    expect(submitProjectRequest).toHaveBeenNthCalledWith(2, values);
});

test("late profile refresh fills untouched fields while preserving manual edits and a deliberately cleared phone", async () => {
    storeSession();
    const profileRead = deferred();
    fetchDataFromApi.mockReturnValue(profileRead.promise);
    render(<FormHarness loggedIn />);
    expect(screen.getByRole("textbox", { name: "نام", exact: true })).toHaveValue(storedUser.name);
    expect(screen.getByRole("textbox", { name: "شماره همراه" })).toHaveValue("09123456789");
    expect(fetchDataFromApi).toHaveBeenCalledWith(`/api/client/${clientId}`, { throwOnError: true, signal: expect.any(AbortSignal) });
    fillFields({ firstName: "نگار", phone: "", description: values.description });
    await act(async () => profileRead.resolve(freshProfile));
    expect(screen.getByRole("textbox", { name: "نام", exact: true })).toHaveValue("نگار");
    expect(screen.getByRole("textbox", { name: "شماره همراه" })).toHaveValue("");
    expect(screen.getByRole("textbox", { name: "نام خانوادگی", exact: true })).toHaveValue(freshProfile.lastName);
    expect(screen.getByRole("textbox", { name: "توضیح کوتاه پروژه" })).toHaveValue(values.description);
});

test("invalid profile responses cannot replace editable contact details from a valid stored session", async () => {
    storeSession();
    fetchDataFromApi.mockResolvedValue({ ...freshProfile, _id: "different-client" });
    render(<FormHarness loggedIn />);
    await waitFor(() => expect(fetchDataFromApi).toHaveBeenCalledTimes(1));
    expect(screen.getByRole("textbox", { name: "نام", exact: true })).toHaveValue(storedUser.name);
    expect(screen.getByRole("textbox", { name: "نام خانوادگی", exact: true })).toHaveValue(storedUser.lastName);
    expect(screen.getByRole("textbox", { name: "شماره همراه" })).toBeEnabled();
    fillFields({ phone: values.phone, description: values.description });
    expect(screen.getByRole("textbox", { name: "شماره همراه" })).toHaveValue(values.phone);
});

test("server field errors translate when language changes and a corrected request can succeed in English", async () => {
    submitProjectRequest.mockRejectedValueOnce({ code: "VALIDATION_ERROR", fields: { phone: "INVALID_PHONE" } }).mockResolvedValueOnce({ id: "saved-request" });
    render(<FormHarness />);
    fillFields();
    fireEvent.submit(screen.getByRole("form"));
    const phone = screen.getByRole("textbox", { name: "شماره همراه" });
    await waitFor(() => expect(phone).toHaveAttribute("aria-invalid", "true"));
    expect(phone).toHaveFocus();
    fireEvent.click(screen.getByRole("button", { name: "English", exact: true }));
    expect(screen.getByRole("textbox", { name: "Mobile number" })).toHaveAccessibleDescription("Enter an 11-digit mobile number starting with 09.");
    expect(screen.getByRole("textbox", { name: "First name", exact: true })).toHaveValue(values.firstName);
    expect(screen.getByRole("alert")).toHaveTextContent("Please check the highlighted fields.");
    fireEvent.change(screen.getByRole("textbox", { name: "Mobile number" }), { target: { value: "09129876543" } });
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    fireEvent.submit(screen.getByRole("form", { name: "Project request form" }));
    expect(await screen.findByRole("status")).toHaveTextContent("Your project request has been submitted");
});

test("logging out and leaving the form abort profile reads and late responses cannot refill the guest draft", async () => {
    storeSession();
    const firstRead = deferred();
    const secondRead = deferred();
    fetchDataFromApi.mockReturnValueOnce(firstRead.promise).mockReturnValueOnce(secondRead.promise);
    const view = render(<FormHarness loggedIn />);
    const firstSignal = fetchDataFromApi.mock.calls[0][1].signal;
    expect(firstSignal.aborted).toBe(false);
    view.rerender(<FormHarness />);
    expect(firstSignal.aborted).toBe(true);
    await act(async () => firstRead.resolve(freshProfile));
    expect(screen.getByRole("textbox", { name: "نام خانوادگی", exact: true })).toHaveValue(storedUser.lastName);
    view.rerender(<FormHarness loggedIn />);
    const secondSignal = fetchDataFromApi.mock.calls[1][1].signal;
    expect(secondSignal.aborted).toBe(false);
    view.unmount();
    expect(secondSignal.aborted).toBe(true);
    await act(async () => secondRead.resolve(freshProfile));
});
