import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import axios from "axios";
import { MyContext } from "../../App";
import { LanguageProvider, useLanguage } from "../../i18n/LanguageContext";
import { fetchDataFromApi, postAuthData, postDataWithAuth } from "../../utils/api";
import { redirectToGateway } from "../../utils/redirectToGateway";
import Account from "../account/accountPage";
import Login from "../logIn";
import Signup from "../signUp";
import VerifyPhone from "../verifyOTP";
import ForgotPassword from "../forgotPassword/ForgotPassword";
import VerifyResetOTP from "../forgotPassword/VerifyResetOTP";
import ResetPassword from "../forgotPassword/ResetPassword";
import ChangePassword from "../changePassword/ChangePassword";
import ChangePasswordVerifyOTP from "../changePassword/ChangePasswordVerifyOTP";
import ChangePasswordNew from "../changePassword/ChangePasswordNew";
import CompleteInfo from "../completeInfo";
import Cart from "../cart";
import Orders from "../orders";
import SuccessPayment from "../payment/success";
import FailedPayment from "../payment/fail";
import Checkout from "./index";

const mockNavigate = jest.fn();
let mockSearch = "";
const mockLocation = { pathname: "/", search: "" };
jest.mock("../../App", () => ({ MyContext: require("react").createContext(null) }));
jest.mock("axios", () => ({ get: jest.fn(), isCancel: jest.fn(() => false) }));
jest.mock("../../utils/api", () => ({
    ...jest.requireActual("../../utils/api"), fetchDataFromApi: jest.fn(), updateAccountData: jest.fn(),
    postAuthData: jest.fn(), postData: jest.fn(), postDataWithAuth: jest.fn(), editData: jest.fn(), deleteData: jest.fn(),
}));
jest.mock("../../utils/redirectToGateway", () => ({ redirectToGateway: jest.fn() }));
jest.mock("../../Components/quantityBox", () => ({ value }) => <span>{value}</span>);
jest.mock("react-router-dom", () => ({
    Link: ({ to, children, ...props }) => <a href={to} {...props}>{children}</a>,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: "507f1f77bcf86cd799439011" }),
    useSearchParams: () => [new URLSearchParams(mockSearch)],
    useLocation: () => mockLocation,
}), { virtual: true });

const userId = "507f1f77bcf86cd799439011";
const profile = { _id: userId, name: "آرمان", lastName: "اسدیان", phone: "09123456789", email: "",
    englishName: "Arman", englishLastName: "Asadian", nationalCode: "0012345678", birthdate: "1375/01/09" };
const cart = [
    { _id: "course-cart", productId: "course-1", productTitle: "دوره نمونه", productTitleEn: "Training course", typeCourse: true, price: 1500000, quantity: 1, subTotal: 1500000 },
    { _id: "product-cart", productId: "product-1", productTitle: "محصول نمونه", productTitleEn: "Laboratory kit", typeCourse: false, price: 350000, quantity: 3, subTotal: 1050000 },
];
const details = { firstName: profile.name, lastName: profile.lastName, firstNameLatin: "Arman", lastNameLatin: "Asadian",
    nationalId: "0012345678", phone: profile.phone, address: "نشانی کاربر", postalCode: "1456789012", city: "تهران", notes: "" };

function LanguageControls() {
    const { setLanguage } = useLanguage();
    return <><button onClick={() => setLanguage("en")}>Switch to English</button><button onClick={() => setLanguage("fa")}>Switch to Persian</button></>;
}

function renderPage(Page, { language = "en", controls = false } = {}) {
    localStorage.setItem("ogene.language", language);
    const context = {
        user: { ...profile, userId }, isLoggedIn: true,
        setIsShowNavbar: jest.fn(), setIsShowFooter: jest.fn(), setIsShowCalenderBar: jest.fn(), setIsBaleIconShown: jest.fn(),
        setIsLoggedIn: jest.fn(), setUser: jest.fn(), setAlertBox: jest.fn(), setProgress: jest.fn(),
    };
    return { ...render(<LanguageProvider><MyContext.Provider value={context}>{controls ? <LanguageControls /> : null}<Page /></MyContext.Provider></LanguageProvider>), context };
}

beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    localStorage.setItem("token", "signed-token");
    localStorage.setItem("user", JSON.stringify({ userId, name: profile.name, phone: profile.phone }));
    localStorage.setItem("userPhone", profile.phone);
    localStorage.setItem("resetIdentifier", profile.phone);
    localStorage.setItem("changePasswordPhone", profile.phone);
    mockSearch = "";
    mockLocation.search = "";
    fetchDataFromApi.mockReset().mockImplementation((url) => {
        if (url.startsWith("/api/client/")) return Promise.resolve(profile);
        if (url.startsWith("/api/cart")) return Promise.resolve(cart);
        if (url.startsWith("/api/orders")) return Promise.resolve([{ _id: "order-1", status: "در انتظار", items: cart, totalPrice: 2550000 }]);
        if (url.startsWith("/api/payment/status/")) return Promise.resolve({ status: "paid", orderId: "order-1", amount: 2550000, paidAt: "2026-10-31T09:30:00Z" });
        return Promise.resolve([]);
    });
    axios.get.mockReset().mockResolvedValue({ data: { success: true, cart, profile: details, checkout: null } });
    postDataWithAuth.mockReset();
    postAuthData.mockReset();
    jest.spyOn(window, "scrollTo").mockImplementation(() => {});
    jest.spyOn(console, "log").mockImplementation(() => {});
});
afterEach(() => { jest.restoreAllMocks(); });

test.each([
    ["account", Account, "Your profile"], ["login", Login, "Sign in to your account"], ["signup", Signup, "Sign up"],
    ["phone verification", VerifyPhone, "Verify your phone number"], ["forgot password", ForgotPassword, "Reset password"],
    ["recovery verification", VerifyResetOTP, "Verify recovery code"], ["password reset", ResetPassword, "Change password"],
    ["password change", ChangePassword, "Change password"], ["password change verification", ChangePasswordVerifyOTP, "Verify code"],
    ["new password", ChangePasswordNew, "New password"], ["profile completion", CompleteInfo, "Complete your profile"],
    ["checkout", Checkout, "Checkout"], ["cart", Cart, "My cart"], ["orders", Orders, "My orders"],
    ["payment success", SuccessPayment, "Your payment was successful"], ["payment failure", FailedPayment, "Payment was unsuccessful"],
])("%s renders its static heading in English", async (name, Page, heading) => {
    if (Page === SuccessPayment || Page === FailedPayment) mockSearch = "resNum=test-payment";
    if (Page === FailedPayment) fetchDataFromApi.mockResolvedValue({ status: "canceled", reason: "CanceledByUser" });
    renderPage(Page);
    expect(await screen.findByRole("heading", { name: heading, exact: true })).toBeVisible();
    expect(document.documentElement.dir).toBe("ltr");
});

test("switching checkout language keeps entered identity/address and validation state without refetching", async () => {
    renderPage(Checkout, { language: "fa", controls: true });
    const firstName = await screen.findByRole("textbox", { name: "نام", exact: true });
    fireEvent.change(firstName, { target: { value: "" } });
    fireEvent.change(screen.getByRole("textbox", { name: "آدرس کامل" }), { target: { value: "نشانی ویرایش‌شده" } });
    fireEvent.click(screen.getByRole("button", { name: "پرداخت و تکمیل سفارش" }));
    expect(screen.getByText("نام را وارد کنید.")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Switch to English" }));

    expect(screen.getByRole("textbox", { name: "Full address" })).toHaveValue("نشانی ویرایش‌شده");
    expect(screen.getByText("Enter first name.")).toBeVisible();
    expect(screen.getByRole("textbox", { name: "Phone number" })).toHaveValue(profile.phone);
    expect(screen.getByText("Laboratory kit")).toBeVisible();
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(postDataWithAuth).not.toHaveBeenCalled();
});

test("English checkout changes displayed titles/currency while keeping canonical order details and SEP start unchanged", async () => {
    const saved = { success: true, checkout: { id: "checkout-1", items: cart.map(({ _id, productTitleEn, ...item }) => item),
        cartItemIds: cart.map((item) => item._id), totalToman: 2550000 } };
    postDataWithAuth.mockResolvedValueOnce(saved)
        .mockResolvedValueOnce({ success: true, token: "sep-token", paymentUrl: "https://sep.example.test", resNum: "payment-1" })
        .mockResolvedValueOnce({ success: true });
    renderPage(Checkout);
    expect(await screen.findByRole("textbox", { name: "First name", exact: true })).toHaveValue(profile.name);
    expect(screen.getAllByText("2,550,000 Toman")).toHaveLength(2);
    expect(screen.getByText("Training course")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Pay and complete order" }));

    await waitFor(() => expect(redirectToGateway).toHaveBeenCalledWith("https://sep.example.test", "sep-token"));
    expect(postDataWithAuth).toHaveBeenNthCalledWith(1, "/api/checkout", details);
    expect(postDataWithAuth).toHaveBeenNthCalledWith(2, "/api/payment/start", {});
});

test("English order filters translate labels without changing canonical status values", async () => {
    renderPage(Orders);
    await screen.findByRole("heading", { name: "My orders", exact: true });
    expect(screen.getAllByText("Pending").length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole("button", { name: "View details" }));
    expect(screen.getByText("Laboratory kit...")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Confirmed", exact: true }));
    expect(screen.getByText("No orders match this status.")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Pending", exact: true }));
    expect(screen.getByRole("button", { name: "Close" })).toBeVisible();
    expect(fetchDataFromApi).toHaveBeenCalledTimes(1);
});

test("server authentication errors are shown in English without altering identity or session data", async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    postAuthData.mockResolvedValue({ error: true, msg: "نام کاربری یا رمز عبور نادرست است!" });
    const { context } = renderPage(Login);
    fireEvent.change(screen.getByRole("textbox", { name: "Mobile number" }), { target: { value: profile.phone } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "incorrect-password" } });
    fireEvent.click(screen.getByRole("button", { name: "Sign in", exact: true }));

    await waitFor(() => expect(context.setAlertBox).toHaveBeenLastCalledWith(expect.objectContaining({ error: true,
        msg: "The phone number or password is incorrect." })));
    expect(postAuthData).toHaveBeenCalledWith("/api/client/signin", { email: profile.phone, password: "incorrect-password" });
    expect(localStorage.getItem("token")).toBeNull();
});

test("switching password-change language preserves the entered phone number", () => {
    renderPage(ChangePassword, { language: "fa", controls: true });
    const phone = screen.getByPlaceholderText("09123456789");
    fireEvent.change(phone, { target: { value: "09129998877" } });
    fireEvent.click(screen.getByRole("button", { name: "Switch to English" }));
    expect(screen.getByPlaceholderText("09123456789")).toHaveValue("09129998877");
    expect(screen.getByRole("heading", { name: "Change password", exact: true })).toBeVisible();
});
