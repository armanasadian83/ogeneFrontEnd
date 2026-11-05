import React from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MyContext } from "../../App";
import { fetchDataFromApi, updateAccountData, toStoredUser } from "../../utils/api";
import AccountPage from "./accountPage";

let mockRouteId;
jest.mock("../../App", () => ({ MyContext: require("react").createContext(null) }));
jest.mock("axios", () => ({ get: jest.fn(), put: jest.fn(), post: jest.fn() }));
jest.mock("../../utils/api", () => ({
    ...jest.requireActual("../../utils/api"), fetchDataFromApi: jest.fn(), updateAccountData: jest.fn(),
}));
jest.mock("react-router-dom", () => ({
    Link: ({ to, children, ...props }) => <a href={to} {...props}>{children}</a>,
    useParams: () => ({ id: mockRouteId }),
}), { virtual: true });
jest.mock("react-multi-date-picker", () => ({ id, value, onChange, disabled }) => (
    <input id={id} value={value || ""} disabled={disabled}
        onChange={(event) => onChange(event.target.value ? { format: () => event.target.value } : null)} />
));

const userId = "6a82201ce024f038eff0532d";
const otherId = "6a82201ce024f038eff0532e";
const profile = {
    id: userId, _id: userId, name: "آرمان", lastName: "اسدیان", phone: "09123456789", email: "arman@example.test",
    englishName: "Arman", englishLastName: "Asadian", nationalCode: "0012345678", birthdate: "1375/01/09",
    dateCreated: "۱۴۰۵/۰۱/۰۱",
};
const editButton = () => screen.getByRole("button", { name: "ویرایش اطلاعات", exact: true });
const saveButton = () => screen.getByRole("button", { name: "ذخیره تغییرات", exact: true });
const nameField = () => screen.getByRole("textbox", { name: "نام", exact: true });
const fullName = (client) => `${client.name} ${client.lastName}`;

function createContext() {
    return { setUser: jest.fn(), setIsLoggedIn: jest.fn(), setAlertBox: jest.fn() };
}

function accountElement(context) {
    return <MyContext.Provider value={context}><AccountPage /></MyContext.Provider>;
}

function renderAccount() {
    const context = createContext();
    return { ...render(accountElement(context)), context };
}

function deferred() {
    let resolve;
    let reject;
    const promise = new Promise((finish, fail) => { resolve = finish; reject = fail; });
    return { promise, resolve, reject };
}

async function startEditing() {
    fireEvent.click(await screen.findByRole("button", { name: "ویرایش اطلاعات", exact: true }));
    expect(nameField()).toHaveValue(profile.name);
}

beforeEach(() => {
    jest.clearAllMocks();
    fetchDataFromApi.mockReset();
    updateAccountData.mockReset();
    localStorage.clear();
    localStorage.setItem("token", "valid-session-token");
    localStorage.setItem("user", JSON.stringify(toStoredUser(profile)));
    mockRouteId = userId;
    fetchDataFromApi.mockResolvedValue(profile);
});

test("a failed account read shows a retry state without rendering an AxiosError as the user, then loads the real profile", async () => {
    const cached = localStorage.getItem("user");
    const load = deferred();
    fetchDataFromApi.mockReturnValueOnce(load.promise).mockResolvedValueOnce(profile);
    renderAccount();
    expect(screen.getByRole("status")).toHaveTextContent("در حال دریافت اطلاعات حساب");
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "ویرایش اطلاعات" })).not.toBeInTheDocument();
    await act(async () => { load.resolve({ name: "AxiosError", isAxiosError: true, response: { status: 500 } }); });

    expect(await screen.findByRole("alert")).toHaveTextContent("دریافت اطلاعات حساب انجام نشد");
    expect(screen.queryByText("AxiosError")).not.toBeInTheDocument();
    expect(localStorage.getItem("user")).toBe(cached);
    expect(updateAccountData).not.toHaveBeenCalled();
    expect(fetchDataFromApi).toHaveBeenCalledWith(`/api/client/${userId}`, expect.objectContaining({
        throwOnError: true, signal: expect.any(Object),
    }));

    fireEvent.click(screen.getByRole("button", { name: "تلاش دوباره", exact: true }));
    expect(await screen.findByRole("heading", { level: 5, name: fullName(profile) })).toBeVisible();
    expect(editButton()).toBeEnabled();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(fetchDataFromApi).toHaveBeenCalledTimes(2);
});

test.each([
    { reason: "network", error: new Error("Network unavailable"), expected: "دریافت اطلاعات حساب انجام نشد" },
    { reason: "rate limit", error: { status: 429 }, expected: "تعداد درخواست‌ها زیاد است" },
])("a $reason error never enables profile editing", async ({ error, expected }) => {
    fetchDataFromApi.mockRejectedValue(error);
    renderAccount();
    expect(await screen.findByRole("alert")).toHaveTextContent(expected);
    expect(screen.queryByRole("button", { name: "ویرایش اطلاعات" })).not.toBeInTheDocument();
    expect(updateAccountData).not.toHaveBeenCalled();
});

test("a deleted account clears the stale session and offers login instead of a fake profile", async () => {
    fetchDataFromApi.mockRejectedValue({ status: 404, code: "CLIENT_NOT_FOUND" });
    const { context } = renderAccount();
    expect(await screen.findByRole("alert")).toHaveTextContent("این حساب کاربری در سامانه پیدا نشد");
    expect(screen.getByRole("link", { name: "ورود دوباره", exact: true })).toHaveAttribute("href", `/logIn?returnTo=${encodeURIComponent(`/accountPage/${userId}`)}`);
    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();
    expect(context.setIsLoggedIn).toHaveBeenCalledWith(false);
    expect(context.setUser).toHaveBeenCalledWith({ name: "", lastName: "", email: "", userId: "" });
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(updateAccountData).not.toHaveBeenCalled();
});

test.each(["missing token", "corrupt user", "undefined token"])("a %s session cannot fetch or edit an account", async (state) => {
    if (state === "missing token") localStorage.removeItem("token");
    if (state === "corrupt user") localStorage.setItem("user", "not valid JSON");
    if (state === "undefined token") localStorage.setItem("token", "undefined");
    renderAccount();
    expect(await screen.findByRole("alert")).toHaveTextContent("دوباره وارد حساب کاربری خود شوید");
    expect(screen.getByRole("link", { name: "ورود دوباره", exact: true })).toBeVisible();
    expect(fetchDataFromApi).not.toHaveBeenCalled();
    expect(updateAccountData).not.toHaveBeenCalled();
    expect(localStorage.getItem("token")).toBeNull();
});

test("another account URL is denied without reading or modifying the cached owner", async () => {
    const cached = localStorage.getItem("user");
    mockRouteId = otherId;
    const { context } = renderAccount();
    expect(await screen.findByRole("alert")).toHaveTextContent("شما به اطلاعات این حساب کاربری دسترسی ندارید");
    expect(screen.getByRole("link", { name: "حساب کاربری من", exact: true })).toHaveAttribute("href", `/accountPage/${userId}`);
    expect(fetchDataFromApi).not.toHaveBeenCalled();
    expect(updateAccountData).not.toHaveBeenCalled();
    expect(localStorage.getItem("user")).toBe(cached);
    expect(context.setIsLoggedIn).not.toHaveBeenCalled();
});

test.each(["rejected", "AxiosError", "plain text", "failure body", "other client"])("a %s save response preserves user edits and cached data", async (failure) => {
    if (failure === "rejected") updateAccountData.mockRejectedValue(new Error("Network unavailable"));
    else updateAccountData.mockResolvedValue({
        AxiosError: { name: "AxiosError", isAxiosError: true },
        "plain text": "the client cannot be updated!",
        "failure body": { success: false },
        "other client": { ...profile, id: otherId, _id: otherId },
    }[failure]);
    const cached = localStorage.getItem("user");
    const { context } = renderAccount();
    await startEditing();
    fireEvent.change(nameField(), { target: { value: "نام ویرایش‌شده" } });
    fireEvent.click(saveButton());

    await waitFor(() => expect(context.setAlertBox).toHaveBeenCalledWith(expect.objectContaining({ error: true })));
    expect(context.setAlertBox).not.toHaveBeenCalledWith(expect.objectContaining({ error: false }));
    expect(nameField()).toHaveValue("نام ویرایش‌شده");
    expect(saveButton()).toBeEnabled();
    expect(localStorage.getItem("user")).toBe(cached);
    expect(localStorage.getItem("token")).toBe("valid-session-token");
    expect(context.setUser).not.toHaveBeenCalled();
    expect(screen.queryByText("AxiosError")).not.toBeInTheDocument();
});

test("a valid save uses confirmed server values and strips sensitive fields from cache and context", async () => {
    const confirmed = { ...profile, name: "نام ثبت‌شده", lastName: "نام خانوادگی تاییدشده", email: "saved@example.test", password: "private-hash", otp: "654321", resetPasswordOTP: "123456" };
    updateAccountData.mockResolvedValue(confirmed);
    const { context } = renderAccount();
    await startEditing();
    fireEvent.change(nameField(), { target: { value: "  نام ویرایش‌شده  " } });
    fireEvent.change(screen.getByRole("textbox", { name: "کد ملی", exact: true }), { target: { value: "۰۰۱۲۳۴۵۶۷۸" } });
    fireEvent.change(screen.getByRole("textbox", { name: "تاریخ تولد", exact: true }), { target: { value: "۱۳۷۵/۰۱/۰۹" } });
    fireEvent.click(saveButton());

    expect(await screen.findByRole("heading", { level: 5, name: fullName(confirmed) })).toBeVisible();
    expect(updateAccountData).toHaveBeenCalledWith(`/api/client/${userId}`, expect.objectContaining({
        name: "نام ویرایش‌شده", nationalCode: "0012345678", birthdate: "1375/01/09",
    }));
    const saved = JSON.parse(localStorage.getItem("user"));
    expect(saved).toEqual(toStoredUser(confirmed));
    expect(saved.name).toBe(confirmed.name);
    expect(saved).not.toHaveProperty("password");
    expect(saved).not.toHaveProperty("otp");
    expect(saved).not.toHaveProperty("resetPasswordOTP");
    expect(context.setUser).toHaveBeenCalledWith(saved);
    expect(context.setAlertBox).toHaveBeenCalledWith(expect.objectContaining({ error: false }));
});

test("same-tick save clicks issue one update and keep all edit controls disabled while pending", async () => {
    const saved = deferred();
    updateAccountData.mockReturnValue(saved.promise);
    renderAccount();
    await startEditing();
    const save = saveButton();
    act(() => { fireEvent.click(save); fireEvent.click(save); });
    expect(updateAccountData).toHaveBeenCalledTimes(1);
    expect(nameField()).toBeDisabled();
    expect(screen.getByRole("button", { name: "در حال ذخیره...", exact: true })).toBeDisabled();
    expect(screen.getByRole("button", { name: "انصراف", exact: true })).toBeDisabled();
    await act(async () => { saved.resolve(profile); });
    expect(editButton()).toBeEnabled();
});

test("a session changed while editing cannot write to the original account", async () => {
    const { context } = renderAccount();
    await startEditing();
    const switchedSession = JSON.stringify(toStoredUser({ ...profile, id: otherId, _id: otherId }));
    localStorage.setItem("user", switchedSession);
    fireEvent.click(saveButton());
    expect(updateAccountData).not.toHaveBeenCalled();
    expect(context.setAlertBox).toHaveBeenCalledWith(expect.objectContaining({ error: true, msg: "نشست شما تغییر کرده است. دوباره وارد حساب کاربری خود شوید." }));
    expect(localStorage.getItem("user")).toBe(switchedSession);
});

test("late profile results are ignored after navigating to a different account", async () => {
    const first = deferred();
    const second = deferred();
    const nextProfile = { ...profile, id: otherId, _id: otherId, name: "سارا", lastName: "محمدی" };
    fetchDataFromApi.mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise);
    const view = renderAccount();
    const firstSignal = fetchDataFromApi.mock.calls[0][1].signal;
    localStorage.setItem("user", JSON.stringify(toStoredUser(nextProfile)));
    mockRouteId = otherId;
    view.rerender(accountElement(view.context));
    expect(firstSignal.aborted).toBe(true);
    await act(async () => { second.resolve(nextProfile); });
    await act(async () => { first.resolve(profile); });
    expect(screen.getByRole("heading", { level: 5, name: fullName(nextProfile) })).toBeVisible();
    expect(screen.queryByRole("heading", { level: 5, name: fullName(profile) })).not.toBeInTheDocument();
});

test.each(["success", "missing-account error"])("an old pending GET %s cannot display or clear a newer account session", async (outcome) => {
    const read = deferred();
    fetchDataFromApi.mockReturnValue(read.promise);
    const { context } = renderAccount();
    expect(screen.getByRole("status")).toBeVisible();
    const newUser = toStoredUser({ ...profile, id: otherId, _id: otherId, name: "سارا", lastName: "محمدی" });
    const newCache = JSON.stringify(newUser);
    localStorage.setItem("user", newCache);
    localStorage.setItem("token", "new-account-token");

    await act(async () => {
        if (outcome === "success") read.resolve(profile);
        else read.reject({ status: 404, code: "CLIENT_NOT_FOUND" });
    });

    expect(await screen.findByRole("alert")).toHaveTextContent("نشست شما تغییر کرده است");
    expect(screen.getByRole("link", { name: "حساب کاربری من", exact: true })).toHaveAttribute("href", `/accountPage/${otherId}`);
    expect(screen.queryByRole("heading", { level: 5, name: fullName(profile) })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "ویرایش اطلاعات", exact: true })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "ورود دوباره", exact: true })).not.toBeInTheDocument();
    expect(localStorage.getItem("user")).toBe(newCache);
    expect(localStorage.getItem("token")).toBe("new-account-token");
    expect(context.setUser).not.toHaveBeenCalled();
    expect(context.setIsLoggedIn).not.toHaveBeenCalled();
    expect(updateAccountData).not.toHaveBeenCalled();
});

test("a save that finishes after a session switch cannot overwrite the new session", async () => {
    const saved = deferred();
    updateAccountData.mockReturnValue(saved.promise);
    const { context } = renderAccount();
    await startEditing();
    fireEvent.click(saveButton());
    const newUser = toStoredUser({ ...profile, id: otherId, _id: otherId, name: "سارا" });
    localStorage.setItem("user", JSON.stringify(newUser));
    localStorage.setItem("token", "new-session-token");
    await act(async () => { saved.resolve({ ...profile, name: "Old response" }); });
    expect(JSON.parse(localStorage.getItem("user"))).toEqual(newUser);
    expect(context.setUser).not.toHaveBeenCalled();
    expect(context.setAlertBox).not.toHaveBeenCalledWith(expect.objectContaining({ error: false }));
    expect(nameField()).toBeEnabled();
});
