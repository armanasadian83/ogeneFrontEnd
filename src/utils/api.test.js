import axios from "axios";
import {
    fetchDataFromApi, isClientResponse, postAuthData, postDataWithAuth, readStoredSession,
    safeReturnTo, toStoredUser, updateAccountData,
} from "./api";

jest.mock("axios", () => ({ get: jest.fn(), put: jest.fn(), post: jest.fn(), delete: jest.fn() }));

const client = { _id: "client-1", name: "آرمان", lastName: "اسدیان", phone: "09123456789", nationalCode: "0012345678" };
const originalFetch = global.fetch;

beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    global.fetch = jest.fn();
});
afterAll(() => { global.fetch = originalFetch; });

test("legacy GET callers still receive transport errors while strict callers reject a safe error", async () => {
    const failure = Object.assign(new Error("Network Error"), { code: "ERR_NETWORK", config: { internal: "not for UI" } });
    axios.get.mockRejectedValue(failure);
    await expect(fetchDataFromApi("/api/client/client-1")).resolves.toBe(failure);
    await expect(fetchDataFromApi("/api/client/client-1", { throwOnError: true })).rejects.toMatchObject({
        code: "ERR_NETWORK", msg: "دریافت اطلاعات انجام نشد. دوباره تلاش کنید.",
    });
});

test("strict GET forwards cancellation signals and preserves successful lists", async () => {
    const controller = new AbortController();
    const items = [{ id: "item-1" }];
    axios.get.mockResolvedValue({ data: items });
    await expect(fetchDataFromApi("/api/cart", { signal: controller.signal, throwOnError: true })).resolves.toBe(items);
    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining("/api/cart"), { signal: controller.signal });
    axios.get.mockRejectedValue({ code: "ERR_CANCELED" });
    await expect(fetchDataFromApi("/api/cart", { throwOnError: true })).rejects.toMatchObject({ code: "ERR_CANCELED" });
});

test("strict GET preserves domain status/code/field without exposing the raw Axios error", async () => {
    axios.get.mockRejectedValue({ code: "ERR_BAD_REQUEST", response: { status: 404,
        data: { code: "CLIENT_NOT_FOUND", field: "userId", message: "حساب کاربری پیدا نشد." } } });
    await expect(fetchDataFromApi("/api/client/client-1", { throwOnError: true })).rejects.toMatchObject({
        status: 404, code: "CLIENT_NOT_FOUND", field: "userId", msg: "حساب کاربری پیدا نشد.",
    });
});

test("strict GET rejects business failures while the legacy success-body contract stays unchanged", async () => {
    const body = { success: false, message: "دریافت اطلاعات انجام نشد." };
    axios.get.mockResolvedValue({ data: body });
    await expect(fetchDataFromApi("/api/client/client-1")).resolves.toBe(body);
    await expect(fetchDataFromApi("/api/client/client-1", { throwOnError: true })).rejects.toBeInstanceOf(Error);
});

test.each([null, "the client cannot be updated!", [], { error: true }, { success: false }, new Error("failure")])(
    "profile updates reject unsuccessful or malformed response bodies (%p)", async (body) => {
        axios.put.mockResolvedValue({ data: body });
        await expect(updateAccountData("/api/client/client-1", { name: "آرمان" })).rejects.toBeInstanceOf(Error);
    },
);

test("profile updates return confirmed data and reject HTTP failures with server field context", async () => {
    axios.put.mockResolvedValueOnce({ data: client }).mockRejectedValueOnce({ code: "ERR_BAD_REQUEST",
        response: { status: 409, data: { error: true, code: "DUPLICATE_NATIONAL_CODE", field: "nationalCode", msg: "این کد ملی قبلاً ثبت شده است." } } });
    await expect(updateAccountData("/api/client/client-1", {})).resolves.toBe(client);
    await expect(updateAccountData("/api/client/client-1", {})).rejects.toMatchObject({
        status: 409, code: "DUPLICATE_NATIONAL_CODE", field: "nationalCode", msg: "این کد ملی قبلاً ثبت شده است.",
    });
});

test("authentication HTTP errors return a usable failure result instead of undefined", async () => {
    global.fetch.mockResolvedValue({ ok: false, status: 429, json: async () => ({ msg: "کمی بعد دوباره تلاش کنید.", code: "RATE_LIMITED" }) });
    await expect(postAuthData("/api/client/signin", {})).resolves.toMatchObject({
        error: true, success: false, status: 429, code: "RATE_LIMITED", msg: "کمی بعد دوباره تلاش کنید.",
    });
});

test("authentication preserves the verification flow and successful response data", async () => {
    const verification = { error: true, verified: false, phone: client.phone, msg: "شماره موبایل خود را تایید کنید." };
    const signedIn = { token: "signed-token", user: { id: "client-1", name: client.name } };
    global.fetch.mockResolvedValueOnce({ ok: true, status: 200, json: async () => verification })
        .mockResolvedValueOnce({ ok: true, status: 200, json: async () => signedIn });
    await expect(postAuthData("/api/client/signin", {})).resolves.toMatchObject(verification);
    await expect(postAuthData("/api/client/signin", {})).resolves.toBe(signedIn);
});

test("network and non-JSON authentication failures never return raw Error objects", async () => {
    global.fetch.mockRejectedValueOnce(new TypeError("Failed to fetch"))
        .mockResolvedValueOnce({ ok: false, status: 502, json: async () => { throw new SyntaxError("HTML response"); } });
    const network = await postAuthData("/api/client/signin", {});
    expect(network).toMatchObject({ error: true, success: false, code: "NETWORK_ERROR" });
    expect(network).not.toBeInstanceOf(Error);
    expect(network.msg).toMatch(/[\u0600-\u06ff]/);
    await expect(postAuthData("/api/client/signin", {})).resolves.toMatchObject({ error: true, success: false, status: 502 });
});

test("SEP start keeps the existing empty body, authorization header and error-code contract", async () => {
    const payment = { success: true, token: "sep-token", paymentUrl: "https://sep.example.test", resNum: "a1b2" };
    const changed = { success: false, code: "PRICE_CHANGED", message: "قیمت تغییر کرده است." };
    localStorage.setItem("token", "signed-token");
    axios.post.mockResolvedValueOnce({ data: payment }).mockRejectedValueOnce({ response: { data: changed } });
    await expect(postDataWithAuth("/api/payment/start", {})).resolves.toBe(payment);
    expect(axios.post).toHaveBeenNthCalledWith(1, expect.stringContaining("/api/payment/start"), {}, { headers: { Authorization: "Bearer signed-token" } });
    const log = jest.spyOn(console, "log").mockImplementation(() => {});
    try { await expect(postDataWithAuth("/api/payment/start", {})).resolves.toBe(changed); } finally { log.mockRestore(); }
});

test.each([
    { token: "undefined", user: JSON.stringify({ userId: "client-1" }) },
    { token: "null", user: JSON.stringify({ userId: "client-1" }) },
    { token: "signed-token", user: "malformed JSON" },
    { token: "signed-token", user: "null" },
    { token: "signed-token", user: JSON.stringify({ userId: "undefined" }) },
])("invalid cached sessions are rejected safely (%p)", ({ token, user }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", user);
    expect(readStoredSession()).toBeNull();
});

test("cached users are canonical and omit server-only credentials or arbitrary fields", () => {
    const response = { ...client, englishName: "Arman", password: "not-a-real-hash", otp: "test-code", resetPasswordOTP: "test-reset", arbitrary: "ignore" };
    localStorage.setItem("token", "signed-token");
    localStorage.setItem("user", JSON.stringify(response));
    const cached = toStoredUser(response);
    expect(cached).toMatchObject({ userId: "client-1", phone: client.phone, nationalCode: "0012345678" });
    expect(cached).not.toHaveProperty("password");
    expect(cached).not.toHaveProperty("otp");
    expect(cached).not.toHaveProperty("resetPasswordOTP");
    expect(cached).not.toHaveProperty("arbitrary");
    expect(readStoredSession()).toEqual({ token: "signed-token", user: cached });
    expect(isClientResponse(response, "client-1")).toBe(true);
    expect(isClientResponse({ ...response, _id: "another-client" }, "client-1")).toBe(false);
    expect(isClientResponse({ ...response, success: false }, "client-1")).toBe(false);
});

test("return paths stay local and are not decoded twice", () => {
    ["https://outside.example", "//outside.example", "/\\outside.example", "javascript:alert(1)", "/\ninvalid"].forEach((path) => {
        expect(safeReturnTo(path, "/accountPage/client-1")).toBe("/accountPage/client-1");
    });
    expect(safeReturnTo("/course/course-1?label=100%25")).toBe("/course/course-1?label=100%25");
});
