import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MyContext } from "../../App";
import { fetchDataFromApi, updateAccountData } from "../../utils/api";
import CompleteInfo from "./index";

const mockNavigate = jest.fn();
let mockId = "client-1";
let mockSearch = "";
jest.mock("axios", () => ({}));
jest.mock("../../App", () => ({ MyContext: require("react").createContext(null) }));
jest.mock("../../utils/api", () => ({
    ...jest.requireActual("../../utils/api"), fetchDataFromApi: jest.fn(), updateAccountData: jest.fn(),
}));
jest.mock("react-router-dom", () => ({
    Link: ({ to, children, ...props }) => <a href={to} {...props}>{children}</a>,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: mockId }),
    useSearchParams: () => [new URLSearchParams(mockSearch)],
}), { virtual: true });
jest.mock("react-multi-date-picker", () => ({ id, value, onChange, required, disabled }) => (
    <input id={id} value={value} required={required} disabled={disabled}
        onChange={(event) => onChange(event.target.value ? { format: () => event.target.value } : null)} />
));

const profile = { _id: "client-1", name: "آرمان", lastName: "اسدیان", phone: "09123456789", email: "",
    englishName: "Arman", englishLastName: "Asadian", nationalCode: "0012345678", birthdate: "1375/01/09" };
const cached = { userId: "client-1", name: profile.name, phone: profile.phone };

function renderComplete() {
    const context = { setAlertBox: jest.fn(), setIsLoggedIn: jest.fn(), setUser: jest.fn() };
    return { ...render(<MyContext.Provider value={context}><CompleteInfo /></MyContext.Provider>), context };
}
const saveButton = () => screen.getByRole("button", { name: "ذخیره تغییرات", exact: true });
async function ready() { await screen.findByLabelText("نام به انگلیسی"); }

beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    fetchDataFromApi.mockReset().mockResolvedValue(profile);
    updateAccountData.mockReset().mockResolvedValue(profile);
    mockId = "client-1";
    mockSearch = "";
    localStorage.clear();
    localStorage.setItem("token", "signed-token");
    localStorage.setItem("user", JSON.stringify(cached));
});
afterEach(() => { jest.useRealTimers(); });

test("failed profile reads show a retry instead of an editable empty profile", async () => {
    fetchDataFromApi.mockRejectedValueOnce({ msg: "ارتباط با سرور برقرار نشد." });
    renderComplete();
    expect(await screen.findByRole("alert")).toHaveTextContent("ارتباط با سرور برقرار نشد.");
    expect(screen.queryByRole("button", { name: "ذخیره تغییرات" })).not.toBeInTheDocument();
    expect(localStorage.getItem("user")).toBe(JSON.stringify(cached));
    fireEvent.click(screen.getByRole("button", { name: "تلاش دوباره" }));
    await ready();
    expect(screen.getByLabelText("کد ملی")).toHaveValue("0012345678");
    expect(fetchDataFromApi).toHaveBeenLastCalledWith("/api/client/client-1", expect.objectContaining({ throwOnError: true, signal: expect.any(Object) }));
    expect(updateAccountData).not.toHaveBeenCalled();
});

test("all four completion fields must be present before saving", async () => {
    renderComplete();
    await ready();
    ["نام به انگلیسی", "نام خانوادگی به انگلیسی", "کد ملی", "تاریخ تولد"].forEach((label) => {
        const input = screen.getByLabelText(label);
        expect(input).toBeRequired();
        fireEvent.change(input, { target: { value: "" } });
    });
    fireEvent.click(saveButton());
    expect(screen.getByText("نام به انگلیسی را وارد کنید.")).toBeVisible();
    expect(screen.getByText("نام خانوادگی به انگلیسی را وارد کنید.")).toBeVisible();
    expect(screen.getByText("کد ملی باید ۱۰ رقم باشد.")).toBeVisible();
    expect(screen.getByText("تاریخ تولد را کامل و معتبر وارد کنید.")).toBeVisible();
    expect(updateAccountData).not.toHaveBeenCalled();
    expect(localStorage.getItem("user")).toBe(JSON.stringify(cached));
});

test("failed saves preserve entered fields and cached identity without showing success", async () => {
    updateAccountData.mockRejectedValue({ msg: "ذخیره اطلاعات انجام نشد." });
    const { context } = renderComplete();
    await ready();
    fireEvent.change(screen.getByLabelText("نام به انگلیسی"), { target: { value: "NewName" } });
    await act(async () => { fireEvent.click(saveButton()); });

    expect(screen.getByLabelText("نام به انگلیسی")).toHaveValue("NewName");
    expect(saveButton()).toBeEnabled();
    expect(localStorage.getItem("user")).toBe(JSON.stringify(cached));
    expect(context.setUser).not.toHaveBeenCalled();
    expect(context.setAlertBox).toHaveBeenLastCalledWith(expect.objectContaining({ error: true }));
    expect(mockNavigate).not.toHaveBeenCalled();
});

test.each([{ success: false }, { ...profile, _id: "another-client" }])("a failed or different-client save response cannot overwrite the session (%p)", async (body) => {
    updateAccountData.mockResolvedValue(body);
    const { context } = renderComplete();
    await ready();
    await act(async () => { fireEvent.click(saveButton()); });
    expect(localStorage.getItem("user")).toBe(JSON.stringify(cached));
    expect(context.setUser).not.toHaveBeenCalled();
    expect(context.setAlertBox).toHaveBeenLastCalledWith(expect.objectContaining({ error: true }));
    expect(saveButton()).toBeEnabled();
});

test("a confirmed save caches only server-confirmed public fields and returns to the local course", async () => {
    mockSearch = `returnTo=${encodeURIComponent("/course/course-1?label=100%25")}`;
    updateAccountData.mockResolvedValue({ ...profile, englishName: "ARMAN", password: "test-only-hash", otp: "test-only-code" });
    const { context } = renderComplete();
    await ready();
    fireEvent.change(screen.getByLabelText("نام به انگلیسی"), { target: { value: "RequestedName" } });
    fireEvent.change(screen.getByLabelText("کد ملی"), { target: { value: "۰۰١۲۳۴۵۶۷۸" } });
    await act(async () => { fireEvent.click(saveButton()); });

    expect(updateAccountData).toHaveBeenCalledWith("/api/client/client-1", {
        englishName: "RequestedName", englishLastName: "Asadian", nationalCode: "0012345678", birthdate: "1375/01/09",
    });
    const stored = JSON.parse(localStorage.getItem("user"));
    expect(stored).toMatchObject({ userId: "client-1", englishName: "ARMAN", nationalCode: "0012345678", phone: profile.phone });
    expect(stored).not.toHaveProperty("password");
    expect(stored).not.toHaveProperty("otp");
    expect(context.setUser).toHaveBeenCalledWith(stored);
    act(() => { jest.advanceTimersByTime(1500); });
    expect(mockNavigate).toHaveBeenCalledWith("/course/course-1?label=100%25", { replace: true });
});

test("a different account URL cannot fetch or update another client's profile", async () => {
    mockId = "another-client";
    renderComplete();
    expect(await screen.findByRole("alert")).toHaveTextContent("شما دسترسی به اطلاعات این حساب کاربری ندارید.");
    expect(fetchDataFromApi).not.toHaveBeenCalled();
    expect(updateAccountData).not.toHaveBeenCalled();
});

test("external return paths fall back to the current user's account", async () => {
    mockSearch = "returnTo=https%3A%2F%2Foutside.example";
    renderComplete();
    await ready();
    fireEvent.click(screen.getByRole("button", { name: "انصراف" }));
    expect(mockNavigate).toHaveBeenCalledWith("/accountPage/client-1");
});

test("a pending strict profile read is canceled when the page unmounts", async () => {
    let finish;
    fetchDataFromApi.mockImplementation(() => new Promise((resolve) => { finish = resolve; }));
    const { unmount, context } = renderComplete();
    const options = fetchDataFromApi.mock.calls[0][1];
    unmount();
    expect(options.signal.aborted).toBe(true);
    await act(async () => { finish(profile); });
    expect(context.setUser).not.toHaveBeenCalled();
    expect(updateAccountData).not.toHaveBeenCalled();
});
