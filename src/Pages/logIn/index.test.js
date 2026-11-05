import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MyContext } from "../../App";
import { postAuthData } from "../../utils/api";
import SignIn from "./index";

const mockNavigate = jest.fn();
let mockSearch = "";
jest.mock("axios", () => ({}));
jest.mock("../../App", () => ({ MyContext: require("react").createContext(null) }));
jest.mock("../../utils/api", () => ({ ...jest.requireActual("../../utils/api"), postAuthData: jest.fn() }));
jest.mock("react-router-dom", () => ({
    Link: ({ to, children, ...props }) => <a href={to} {...props}>{children}</a>,
    useNavigate: () => mockNavigate,
    useSearchParams: () => [new URLSearchParams(mockSearch)],
}), { virtual: true });

function renderLogin() {
    const context = {
        setIsShowFooter: jest.fn(), setIsShowNavbar: jest.fn(), setIsShowCalenderBar: jest.fn(),
        setAlertBox: jest.fn(), setIsLoggedIn: jest.fn(), setUser: jest.fn(),
    };
    return { ...render(<MyContext.Provider value={context}><SignIn /></MyContext.Provider>), context };
}

function fillLogin() {
    fireEvent.change(screen.getByLabelText("شماره موبایل"), { target: { value: "09123456789" } });
    fireEvent.change(screen.getByLabelText("رمز عبور"), { target: { value: "a-valid-password" } });
}

beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    postAuthData.mockReset();
    mockSearch = "";
    localStorage.clear();
});
afterEach(() => { jest.useRealTimers(); });

test("failed authentication leaves no cached credentials and always releases the loading state", async () => {
    postAuthData.mockResolvedValue({ error: true, success: false, msg: "ارتباط با سرور برقرار نشد." });
    const { context } = renderLogin();
    fillLogin();
    await act(async () => { fireEvent.click(screen.getByRole("button", { name: "ورود", exact: true })); });

    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();
    expect(context.setAlertBox).toHaveBeenLastCalledWith(expect.objectContaining({ error: true, msg: "ارتباط با سرور برقرار نشد." }));
    expect(screen.getByRole("button", { name: "ورود", exact: true })).toBeEnabled();
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
});

test.each([
    undefined,
    { token: "undefined", user: { id: "client-1" } },
    { token: "signed-token", user: {} },
    { success: false, token: "signed-token", user: { id: "client-1" } },
])("malformed success responses cannot create a fake authenticated session (%p)", async (response) => {
    postAuthData.mockResolvedValue(response);
    const { context } = renderLogin();
    fillLogin();
    await act(async () => { fireEvent.click(screen.getByRole("button", { name: "ورود", exact: true })); });

    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();
    expect(context.setIsLoggedIn).not.toHaveBeenCalledWith(true);
    expect(context.setAlertBox).toHaveBeenLastCalledWith(expect.objectContaining({ error: true }));
    expect(screen.getByRole("button", { name: "ورود", exact: true })).toBeEnabled();
});

test.each([
    { returnTo: "/course/course-1?label=100%25", destination: "/course/course-1?label=100%25" },
    { returnTo: "https://outside.example", destination: "/" },
])("confirmed login stores only public identity data and follows a local return path ($returnTo)", async ({ returnTo, destination }) => {
    mockSearch = `returnTo=${encodeURIComponent(returnTo)}`;
    const user = { id: "client-1", name: "آرمان", phone: "09123456789", password: "test-only-hash", otp: "test-only-code" };
    postAuthData.mockResolvedValue({ token: "signed-token", user });
    const { context } = renderLogin();
    fillLogin();
    await act(async () => { fireEvent.click(screen.getByRole("button", { name: "ورود", exact: true })); });

    expect(localStorage.getItem("token")).toBe("signed-token");
    const cached = JSON.parse(localStorage.getItem("user"));
    expect(cached).toMatchObject({ userId: "client-1", name: "آرمان", phone: "09123456789" });
    expect(cached).not.toHaveProperty("password");
    expect(cached).not.toHaveProperty("otp");
    expect(context.setUser).toHaveBeenCalledWith(cached);
    expect(context.setIsLoggedIn).toHaveBeenLastCalledWith(true);
    act(() => { jest.advanceTimersByTime(1000); });
    expect(mockNavigate).toHaveBeenCalledWith(destination, { replace: true });
});

test("an unverified user is sent to OTP without being cached as logged in", async () => {
    postAuthData.mockResolvedValue({ error: true, verified: false, phone: "09123456789", msg: "کد تایید ارسال شد." });
    const { context } = renderLogin();
    fillLogin();
    await act(async () => { fireEvent.click(screen.getByRole("button", { name: "ورود", exact: true })); });
    expect(localStorage.getItem("userPhone")).toBe("09123456789");
    expect(localStorage.getItem("token")).toBeNull();
    expect(context.setAlertBox).toHaveBeenLastCalledWith(expect.objectContaining({ error: false }));
    act(() => { jest.advanceTimersByTime(2000); });
    expect(mockNavigate).toHaveBeenCalledWith("/verifyOTP");
});

test("corrupt cached credentials are cleared instead of redirecting back to a broken account", () => {
    localStorage.setItem("token", "undefined");
    localStorage.setItem("user", "not valid JSON");
    renderLogin();
    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(screen.getByLabelText("شماره موبایل")).toBeVisible();
});

test("same-tick repeated submits send a single request and a thrown failure also unlocks the form", async () => {
    let reject;
    postAuthData.mockImplementation(() => new Promise((resolve, fail) => { reject = fail; }));
    renderLogin();
    fillLogin();
    const form = screen.getByLabelText("شماره موبایل").closest("form");
    act(() => { fireEvent.submit(form); fireEvent.submit(form); });
    expect(postAuthData).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: "ورود", exact: true })).toBeDisabled();
    await act(async () => { reject(new Error("Network failure")); });
    expect(screen.getByRole("button", { name: "ورود", exact: true })).toBeEnabled();
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
});
