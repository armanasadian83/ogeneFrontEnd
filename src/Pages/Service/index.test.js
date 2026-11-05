import React from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MyContext } from "../../App";
import { fetchDataFromApi, postData } from "../../utils/api";
import Service from "./index";

jest.mock("../../App", () => ({ MyContext: require("react").createContext(null) }));
jest.mock("../../utils/api", () => ({ fetchDataFromApi: jest.fn(), postData: jest.fn() }));
jest.mock("react-router-dom", () => ({ useSearchParams: () => [new URLSearchParams()] }), { virtual: true });

const services = [{ id: "service-one", name: "خدمت آزمایشی" }];
const contact = { name: "کاربر نمونه", phone: "09123456789", description: "توضیح درخواست" };
const savedRequest = { id: "saved-request", reqName: [services[0].name], ...contact };
const nameField = () => screen.getByLabelText("نام و نام خانوادگی");
const phoneField = () => screen.getByLabelText("شماره تماس");
const notesField = () => screen.getByLabelText("توضیحات (اختیاری)");
const submitButton = () => screen.getByRole("button", { name: /ثبت درخواست/ });

function renderService(isLoggedIn = false) {
    const context = {
        isLoggedIn, setIsShowFooter: jest.fn(), setIsShowNavbar: jest.fn(),
        setIsShowCalenderBar: jest.fn(), setAlertBox: jest.fn(),
    };
    render(<MyContext.Provider value={context}><Service /></MyContext.Provider>);
    return context;
}

function deferred() {
    let resolve;
    const promise = new Promise((finish) => { resolve = finish; });
    return { promise, resolve };
}

async function selectService() {
    fireEvent.click(screen.getByRole("button", { name: "خدمات عمومی", exact: true }));
    fireEvent.click(await screen.findByRole("button", { name: services[0].name, exact: true }));
    fireEvent.click(screen.getByRole("button", { name: "مرحله بعدی", exact: true }));
    fireEvent.change(nameField(), { target: { value: contact.name } });
    fireEvent.change(phoneField(), { target: { value: contact.phone } });
    fireEvent.change(notesField(), { target: { value: contact.description } });
}

beforeEach(() => {
    jest.clearAllMocks();
    fetchDataFromApi.mockReset();
    postData.mockReset();
    localStorage.clear();
    window.scrollTo = jest.fn();
    fetchDataFromApi.mockResolvedValue(services);
});

test.each(["rejected request", "error returned as data"])("service-list %s is retryable and never reaches array rendering", async (failure) => {
    if (failure === "rejected request") fetchDataFromApi.mockRejectedValueOnce(new Error("network unavailable"));
    else fetchDataFromApi.mockResolvedValueOnce({ name: "AxiosError", isAxiosError: true });
    fetchDataFromApi.mockResolvedValueOnce([null, { name: 123 }, ...services]);
    renderService();
    fireEvent.click(screen.getByRole("button", { name: "خدمات عمومی", exact: true }));

    expect(await screen.findByRole("alert")).toHaveTextContent("دریافت خدمات انجام نشد");
    expect(screen.queryByText("AxiosError")).not.toBeInTheDocument();
    expect(postData).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "تلاش دوباره", exact: true }));
    expect(await screen.findByRole("button", { name: services[0].name, exact: true })).toBeVisible();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(fetchDataFromApi).toHaveBeenCalledTimes(2);
    expect(fetchDataFromApi.mock.calls[0][1]).toEqual(expect.objectContaining({ throwOnError: true, signal: expect.any(Object) }));
});

test("a late service response cannot overwrite the newer field selection", async () => {
    const first = deferred();
    const second = deferred();
    fetchDataFromApi.mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise);
    renderService();
    fireEvent.click(screen.getByRole("button", { name: "خدمات عمومی", exact: true }));
    fireEvent.click(screen.getByRole("button", { name: "میکروبیولوژی", exact: true }));
    await act(async () => { second.resolve([{ name: "خدمت جدید" }]); });
    await act(async () => { first.resolve([{ name: "خدمت قدیمی" }]); });
    expect(screen.getByRole("button", { name: "خدمت جدید", exact: true })).toBeVisible();
    expect(screen.queryByRole("button", { name: "خدمت قدیمی", exact: true })).not.toBeInTheDocument();
});

test.each(["rejected", "error object", "success false", "plain text", "empty response"])("a %s create response retains edits, permits retry, and never starts cooldown", async (failure) => {
    if (failure === "rejected") postData.mockRejectedValue(new Error("network unavailable"));
    else postData.mockResolvedValue({
        "error object": { name: "AxiosError", isAxiosError: true },
        "success false": { success: false, message: "Failed" },
        "plain text": "Internal server error",
        "empty response": null,
    }[failure]);
    const context = renderService();
    await selectService();
    fireEvent.click(submitButton());

    await waitFor(() => expect(context.setAlertBox).toHaveBeenCalledWith(expect.objectContaining({ error: true })));
    expect(context.setAlertBox).not.toHaveBeenCalledWith(expect.objectContaining({ error: false }));
    expect(nameField()).toHaveValue(contact.name);
    expect(phoneField()).toHaveValue(contact.phone);
    expect(notesField()).toHaveValue(contact.description);
    expect(screen.getByRole("button", { name: services[0].name, exact: true })).toHaveAttribute("aria-pressed", "true");
    expect(submitButton()).toBeEnabled();
    expect(localStorage.getItem("formCooldown:anon")).toBeNull();
    expect(screen.queryByText(/برای ارسال دوباره/)).not.toBeInTheDocument();
});

test("only a confirmed save starts cooldown and duplicate pending submissions are ignored", async () => {
    const saved = deferred();
    postData.mockReturnValue(saved.promise);
    const context = renderService();
    await selectService();
    const form = submitButton().closest("form");
    fireEvent.submit(form);
    fireEvent.submit(form);

    expect(postData).toHaveBeenCalledTimes(1);
    expect(postData).toHaveBeenCalledWith("/api/request/create", expect.objectContaining({
        ...contact, reqName: [services[0].name], userId: "",
    }));
    expect(submitButton()).toBeDisabled();
    expect(localStorage.getItem("formCooldown:anon")).toBeNull();
    await act(async () => { saved.resolve(savedRequest); });

    expect(context.setAlertBox).toHaveBeenCalledWith(expect.objectContaining({ error: false, msg: "درخواست با موفقیت ثبت شد!" }));
    expect(Number(localStorage.getItem("formCooldown:anon"))).toBeGreaterThan(Date.now());
    expect(screen.getByText(/برای ارسال دوباره/)).toBeVisible();
    expect(notesField()).toHaveValue("");
    expect(screen.getByRole("button", { name: services[0].name, exact: true })).toHaveAttribute("aria-pressed", "false");
});

test("oversized descriptions are blocked before sending and preserve the entered text", async () => {
    const context = renderService();
    await selectService();
    expect(notesField()).toHaveAttribute("maxlength", "2000");
    const oversized = "x".repeat(2001);
    fireEvent.change(notesField(), { target: { value: oversized } });
    fireEvent.click(submitButton());
    expect(context.setAlertBox).toHaveBeenCalledWith(expect.objectContaining({ error: true, msg: "توضیحات باید حداکثر ۲۰۰۰ کاراکتر باشد." }));
    expect(postData).not.toHaveBeenCalled();
    expect(notesField()).toHaveValue(oversized);
    expect(localStorage.getItem("formCooldown:anon")).toBeNull();
});

test("failed profile prefill keeps contact fields usable instead of inserting undefined phone data", async () => {
    localStorage.setItem("user", JSON.stringify({ userId: "profile-user", name: "Cached name" }));
    fetchDataFromApi.mockImplementation((url) => url.startsWith("/api/client/")
        ? Promise.resolve({ name: "AxiosError", isAxiosError: true }) : Promise.resolve(services));
    postData.mockResolvedValue(savedRequest);
    const context = renderService(true);
    await selectService();
    fireEvent.click(submitButton());
    await waitFor(() => expect(context.setAlertBox).toHaveBeenCalledWith(expect.objectContaining({ error: false })));
    expect(postData).toHaveBeenCalledWith("/api/request/create", expect.objectContaining({ ...contact, userId: "" }));
});

test("corrupt cached user data does not crash or fetch an undefined client", async () => {
    localStorage.setItem("user", "not valid JSON");
    renderService(true);
    expect(nameField()).toHaveValue("");
    expect(phoneField()).toHaveValue("");
    await selectService();
    expect(fetchDataFromApi).toHaveBeenCalledTimes(1);
    expect(fetchDataFromApi).not.toHaveBeenCalledWith(expect.stringContaining("/api/client/"), expect.anything());
});
