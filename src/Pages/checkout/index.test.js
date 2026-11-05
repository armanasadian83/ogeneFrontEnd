import React from "react";
import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import axios from "axios";
import { MyContext } from "../../App";
import { postDataWithAuth } from "../../utils/api";
import { redirectToGateway } from "../../utils/redirectToGateway";
import Checkout from "./index";

const mockNavigate = jest.fn();

jest.mock("../../App", () => ({ MyContext: require("react").createContext(null) }));
jest.mock("axios", () => ({ get: jest.fn(), isCancel: jest.fn(() => false) }));
jest.mock("../../utils/api", () => ({ postDataWithAuth: jest.fn() }));
jest.mock("../../utils/redirectToGateway", () => ({ redirectToGateway: jest.fn() }));
jest.mock("react-router-dom", () => ({
    Link: ({ to, children, ...props }) => <a href={to} {...props}>{children}</a>,
    useNavigate: () => mockNavigate,
}), { virtual: true });

const details = {
    firstName: "آرمان",
    lastName: "اسدیان",
    firstNameLatin: "Arman",
    lastNameLatin: "Asadian",
    nationalId: "0012345678",
    phone: "09123456789",
    address: "تهران، خیابان ولیعصر، پلاک ۸۲، واحد ۴",
    postalCode: "1456789012",
    city: "تهران",
    notes: "لطفاً پیش از ارسال تماس بگیرید.",
};
const cart = [
    { _id: "course-cart", productId: "course-1", productTitle: "دوره آموزشی نمونه", typeCourse: true, price: 1500000, quantity: 1, subTotal: 1500000 },
    { _id: "product-cart", productId: "product-1", productTitle: "محصول نمونه", typeCourse: false, price: 350000, quantity: 3, subTotal: 1050000 },
];
const payment = { success: true, token: "sep-token", paymentUrl: "https://sep.example.test/payment", resNum: "a1b2c3d4e5f67890" };
const labels = {
    firstName: "نام", lastName: "نام خانوادگی", firstNameLatin: "نام به لاتین", lastNameLatin: "نام خانوادگی به لاتین",
    nationalId: "کد ملی", phone: "شماره تماس", address: "آدرس کامل", postalCode: "کد پستی", city: "شهر", notes: "توضیحات سفارش (اختیاری)",
};

function checkoutResponse(overrides = {}) {
    return { data: { success: true, cart, profile: details, checkout: null, ...overrides } };
}

function savedResponse(items = cart) {
    return { success: true, checkout: {
        id: "checkout-1",
        items: items.map(({ _id, ...item }) => ({ ...item, image: item.image || "" })),
        cartItemIds: items.map((item) => item._id),
        totalToman: items.reduce((total, item) => total + item.price * item.quantity, 0),
    } };
}

function deferred() {
    let resolve;
    const promise = new Promise((finish) => { resolve = finish; });
    return { promise, resolve };
}

function renderCheckout() {
    const context = {
        setIsShowNavbar: jest.fn(), setIsShowFooter: jest.fn(),
        setIsShowCalenderBar: jest.fn(), setIsBaleIconShown: jest.fn(),
    };
    return { ...render(<MyContext.Provider value={context}><Checkout /></MyContext.Provider>), context };
}

async function ready() {
    await screen.findByRole("textbox", { name: labels.firstName, exact: true });
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
}

const payButton = () => screen.getByRole("button", { name: "پرداخت و تکمیل سفارش" });
const getField = (label) => screen.getByRole("textbox", { name: label, exact: true });

beforeEach(() => {
    jest.clearAllMocks();
    axios.get.mockReset();
    postDataWithAuth.mockReset();
    localStorage.clear();
    localStorage.setItem("token", "signed-in-token");
    localStorage.setItem("user", JSON.stringify({ userId: "current-user" }));
    axios.get.mockResolvedValue(checkoutResponse());
});

test("prefills saved delivery details over the profile and displays database course/product quantities and totals", async () => {
    axios.get.mockResolvedValue(checkoutResponse({ checkout: {
        firstName: "نیما", phone: "۰۹١۲۳۴۵۶۷۸۹", address: "نشانی ذخیره‌شده", city: "شیراز", postalCode: "١۴۵۶۷۸۹۰١۲",
    } }));
    renderCheckout();
    await ready();

    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining("/api/checkout"), expect.objectContaining({
        headers: { Authorization: "Bearer signed-in-token" }, signal: expect.any(Object),
    }));
    expect(getField(labels.firstName)).toHaveValue("نیما");
    expect(getField(labels.lastName)).toHaveValue(details.lastName);
    expect(getField(labels.phone)).toHaveValue("09123456789");
    expect(getField(labels.address)).toHaveValue("نشانی ذخیره‌شده");
    expect(getField(labels.postalCode)).toHaveValue("1456789012");
    expect(getField(labels.city)).toHaveValue("شیراز");

    const summary = within(screen.getByRole("complementary", { name: "خلاصه سفارش" }));
    expect(summary.getByText("دوره آموزشی نمونه")).toBeVisible();
    expect(summary.getByText("۱ آیتم (دوره)")).toBeVisible();
    expect(summary.getByText("تعداد: ۳")).toBeVisible();
    expect(summary.getByText("۱٬۰۵۰٬۰۰۰ تومان")).toBeVisible();
    expect(summary.getAllByText("۲٬۵۵۰٬۰۰۰ تومان")).toHaveLength(2);
    expect(screen.getByRole("link", { name: /بازگشت و ویرایش سبد خرید/ })).toHaveAttribute("href", "/cart/current-user");
});

test.each([
    { type: "mixed course and product cart", items: cart, shipping: true, total: "۲٬۵۵۰٬۰۰۰ تومان" },
    { type: "course-only cart", items: [cart[0]], shipping: false, total: "۱٬۵۰۰٬۰۰۰ تومان" },
    { type: "product-only cart", items: [cart[1]], shipping: true, total: "۱٬۰۵۰٬۰۰۰ تومان" },
    { type: "empty cart", items: [], shipping: false, total: "۰ تومان" },
])("shows postpaid shipping only for physical products without changing payable totals ($type)", async ({ items, shipping, total }) => {
    axios.get.mockResolvedValue(checkoutResponse({ cart: items }));
    renderCheckout();
    await ready();

    const summary = within(screen.getByRole("complementary", { name: "خلاصه سفارش" }));
    if (shipping) {
        const shippingRow = summary.getByText("هزینه ارسال").parentElement;
        expect(within(shippingRow).getByText("پس کرایه")).toBeVisible();
    } else {
        expect(summary.queryByText("هزینه ارسال")).not.toBeInTheDocument();
        expect(summary.queryByText("پس کرایه")).not.toBeInTheDocument();
    }
    expect(summary.queryByText("رایگان")).not.toBeInTheDocument();
    expect(within(summary.getByText("جمع جزء").parentElement).getByText(total)).toBeVisible();
    expect(within(summary.getByText("مبلغ قابل پرداخت").parentElement).getByText(total)).toBeVisible();
    if (!items.length) expect(payButton()).toBeDisabled();
});

test("displays the Saman Bank logo as an accessible image in the payment option", async () => {
    renderCheckout();
    await ready();

    const paymentOption = screen.getByRole("radio", { name: "روش پرداخت درگاه پرداخت امن بانک سامان" }).closest("label");
    const logo = within(paymentOption).getByRole("img", { name: "بانک سامان" });
    expect(logo).toBeVisible();
    expect(logo.tagName).toBe("IMG");
    expect(logo.getAttribute("src")).toBeTruthy();
});

test("keeps the website navbar and footer visible on checkout", async () => {
    const { context } = renderCheckout();
    await ready();

    expect(context.setIsShowNavbar).toHaveBeenLastCalledWith(true);
    expect(context.setIsShowFooter).toHaveBeenLastCalledWith(true);
    expect(context.setIsShowCalenderBar).toHaveBeenLastCalledWith(false);
    expect(context.setIsBaleIconShown).toHaveBeenLastCalledWith(false);
});

test("shows required-field errors, focuses the first missing field, and never calls a mutation for an incomplete form", async () => {
    axios.get.mockResolvedValue(checkoutResponse({ profile: {} }));
    renderCheckout();
    await ready();
    fireEvent.click(payButton());

    const firstName = getField(labels.firstName);
    expect(firstName).toHaveFocus();
    Object.entries(labels).filter(([field]) => field !== "notes").forEach(([, label]) => {
        const input = getField(label);
        expect(input).toBeRequired();
        expect(input).toHaveAttribute("aria-invalid", "true");
    });
    expect(screen.getByText("آدرس کامل را وارد کنید.")).toBeVisible();
    expect(getField(labels.notes)).not.toBeRequired();
    expect(getField(labels.notes)).toHaveAttribute("aria-invalid", "false");
    expect(postDataWithAuth).not.toHaveBeenCalled();
    expect(redirectToGateway).not.toHaveBeenCalled();
});

test("rejects whitespace-only values in all nine required fields before saving or starting payment", async () => {
    renderCheckout();
    await ready();
    Object.entries(labels).filter(([field]) => field !== "notes").forEach(([, label]) => {
        fireEvent.change(getField(label), { target: { value: "   " } });
    });
    fireEvent.click(payButton());

    Object.entries(labels).filter(([field]) => field !== "notes").forEach(([, label]) => {
        expect(getField(label)).toHaveAttribute("aria-invalid", "true");
    });
    expect(getField(labels.firstName)).toHaveFocus();
    expect(postDataWithAuth).not.toHaveBeenCalled();
    expect(redirectToGateway).not.toHaveBeenCalled();
});

test("allows empty optional notes while saving all required details and continuing to the existing gateway", async () => {
    postDataWithAuth.mockResolvedValueOnce(savedResponse())
        .mockResolvedValueOnce(payment)
        .mockResolvedValueOnce({ success: true });
    renderCheckout();
    await ready();
    const notes = getField(labels.notes);
    expect(notes).not.toBeRequired();
    fireEvent.change(notes, { target: { value: "" } });
    fireEvent.click(payButton());

    await waitFor(() => expect(redirectToGateway).toHaveBeenCalledWith(payment.paymentUrl, payment.token));
    expect(postDataWithAuth).toHaveBeenNthCalledWith(1, "/api/checkout", { ...details, notes: "" });
    expect(postDataWithAuth).toHaveBeenNthCalledWith(2, "/api/payment/start", {});
    expect(postDataWithAuth).toHaveBeenNthCalledWith(3, "/api/checkout/checkout-1/payment", { resNum: payment.resNum });
    expect(notes).toHaveAttribute("aria-invalid", "false");
});

test("persists all normalized fields before starting SEP with an empty body, links the saved checkout, then redirects", async () => {
    const save = deferred();
    const link = deferred();
    postDataWithAuth.mockImplementation((url) => {
        if (url === "/api/checkout") return save.promise;
        if (url === "/api/payment/start") return Promise.resolve(payment);
        return link.promise;
    });
    renderCheckout();
    await ready();
    fireEvent.change(getField(labels.nationalId), { target: { value: "۰۰١۲۳۴۵۶۷۸" } });
    fireEvent.change(getField(labels.phone), { target: { value: "٠٩۱۲۳۴۵۶۷۸۹" } });
    fireEvent.change(getField(labels.postalCode), { target: { value: "١۴۵۶۷۸۹۰۱۲" } });
    fireEvent.click(payButton());

    expect(postDataWithAuth).toHaveBeenCalledTimes(1);
    expect(postDataWithAuth).toHaveBeenNthCalledWith(1, "/api/checkout", details);
    expect(redirectToGateway).not.toHaveBeenCalled();
    await act(async () => { save.resolve(savedResponse()); });

    expect(postDataWithAuth).toHaveBeenNthCalledWith(2, "/api/payment/start", {});
    expect(postDataWithAuth).toHaveBeenNthCalledWith(3, "/api/checkout/checkout-1/payment", { resNum: payment.resNum });
    expect(redirectToGateway).not.toHaveBeenCalled();
    await act(async () => { link.resolve({ success: true }); });
    expect(redirectToGateway).toHaveBeenCalledTimes(1);
    expect(redirectToGateway).toHaveBeenCalledWith(payment.paymentUrl, payment.token);
    expect(screen.getByRole("button", { name: "در حال اتصال به درگاه..." })).toBeDisabled();
});

test("retains entered delivery details and never starts payment when saving fails", async () => {
    postDataWithAuth.mockResolvedValue({ success: false, message: "ذخیره اطلاعات انجام نشد." });
    renderCheckout();
    await ready();
    fireEvent.change(getField(labels.address), { target: { value: "نشانی جدید کاربر" } });
    fireEvent.click(payButton());

    expect(await screen.findByRole("alert")).toHaveTextContent("ذخیره اطلاعات انجام نشد.");
    expect(postDataWithAuth).toHaveBeenCalledTimes(1);
    expect(postDataWithAuth).toHaveBeenCalledWith("/api/checkout", expect.objectContaining({ address: "نشانی جدید کاربر" }));
    expect(getField(labels.address)).toHaveValue("نشانی جدید کاربر");
    expect(payButton()).toBeEnabled();
    expect(redirectToGateway).not.toHaveBeenCalled();
});

test("refreshes a changed database price without replacing user edits or automatically retrying payment", async () => {
    const refreshedCart = [cart[0], { ...cart[1], price: 400000, subTotal: 1200000 }];
    axios.get.mockResolvedValueOnce(checkoutResponse()).mockResolvedValueOnce(checkoutResponse({ cart: refreshedCart }));
    postDataWithAuth.mockResolvedValueOnce(savedResponse())
        .mockResolvedValueOnce({ success: false, code: "PRICE_CHANGED", message: "قیمت تغییر کرده است؛ سفارش را بررسی کنید." });
    renderCheckout();
    await ready();
    fireEvent.change(getField(labels.notes), { target: { value: "درخواست تازه کاربر" } });
    fireEvent.click(payButton());

    expect(await screen.findByRole("alert")).toHaveTextContent("قیمت تغییر کرده است");
    expect(screen.getAllByText("۲٬۷۰۰٬۰۰۰ تومان")).toHaveLength(2);
    expect(getField(labels.notes)).toHaveValue("درخواست تازه کاربر");
    expect(axios.get).toHaveBeenCalledTimes(2);
    expect(postDataWithAuth).toHaveBeenCalledTimes(2);
    expect(postDataWithAuth).toHaveBeenLastCalledWith("/api/payment/start", {});
    expect(payButton()).toBeEnabled();
    expect(redirectToGateway).not.toHaveBeenCalled();
});

test("locks concurrent form submissions and retains fields for a retry after a gateway failure", async () => {
    const save = deferred();
    postDataWithAuth.mockReturnValueOnce(save.promise)
        .mockResolvedValueOnce({ success: false, message: "اتصال به درگاه برقرار نشد." });
    renderCheckout();
    await ready();
    const form = document.getElementById("checkout-form");
    act(() => {
        fireEvent.submit(form);
        fireEvent.submit(form);
    });

    expect(postDataWithAuth).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: "در حال اتصال به درگاه..." })).toBeDisabled();
    expect(getField(labels.address)).toBeDisabled();
    await act(async () => { save.resolve(savedResponse()); });
    expect(await screen.findByRole("alert")).toHaveTextContent("اتصال به درگاه برقرار نشد.");
    expect(postDataWithAuth).toHaveBeenCalledTimes(2);
    expect(getField(labels.address)).toHaveValue(details.address);
    expect(payButton()).toBeEnabled();
    expect(redirectToGateway).not.toHaveBeenCalled();
});

test("does not redirect when checkout/payment association fails and refreshes the persisted cart", async () => {
    postDataWithAuth.mockResolvedValueOnce(savedResponse())
        .mockResolvedValueOnce(payment)
        .mockResolvedValueOnce({ success: false, message: "اطلاعات سبد خرید تغییر کرده است." });
    renderCheckout();
    await ready();
    fireEvent.click(payButton());

    expect(await screen.findByRole("alert")).toHaveTextContent("اطلاعات سبد خرید تغییر کرده است.");
    expect(axios.get).toHaveBeenCalledTimes(2);
    expect(postDataWithAuth).toHaveBeenCalledTimes(3);
    expect(redirectToGateway).not.toHaveBeenCalled();
    expect(payButton()).toBeEnabled();
});

test.each([
    { change: "quantity", items: [cart[0], { ...cart[1], quantity: 2, subTotal: 700000 }], total: "۲٬۲۰۰٬۰۰۰ تومان" },
    { change: "replacement item at the same total", items: [cart[0], { ...cart[1], _id: "replacement-cart", productId: "product-2", productTitle: "محصول جایگزین" }], total: "۲٬۵۵۰٬۰۰۰ تومان" },
])("requires review before payment if the saved database cart has a new $change", async ({ items, total }) => {
    postDataWithAuth.mockResolvedValueOnce(savedResponse(items));
    renderCheckout();
    await ready();
    fireEvent.change(getField(labels.notes), { target: { value: "یادداشت کاربر هنگام تغییر سبد" } });
    fireEvent.click(payButton());

    expect(await screen.findByRole("alert")).toHaveTextContent(/سبد خرید.*تغییر/);
    expect(screen.getAllByText(total)).toHaveLength(2);
    if (items[1].productId !== cart[1].productId) {
        expect(screen.getByText("محصول جایگزین")).toBeVisible();
        expect(screen.queryByText("محصول نمونه")).not.toBeInTheDocument();
    } else expect(screen.getByText("تعداد: ۲")).toBeVisible();
    expect(getField(labels.notes)).toHaveValue("یادداشت کاربر هنگام تغییر سبد");
    expect(postDataWithAuth).toHaveBeenCalledTimes(1);
    expect(postDataWithAuth).toHaveBeenCalledWith("/api/checkout", expect.any(Object));
    expect(redirectToGateway).not.toHaveBeenCalled();
    expect(payButton()).toBeEnabled();
});

test("blocks payment until a failed changed-price refresh is successfully retried", async () => {
    const refreshedCart = [cart[0], { ...cart[1], price: 400000, subTotal: 1200000 }];
    axios.get.mockResolvedValueOnce(checkoutResponse())
        .mockRejectedValueOnce(new Error("Temporary connection failure"))
        .mockResolvedValueOnce(checkoutResponse({ cart: refreshedCart }));
    postDataWithAuth.mockResolvedValueOnce(savedResponse())
        .mockResolvedValueOnce({ success: false, code: "PRICE_CHANGED", message: "قیمت تغییر کرده است؛ سفارش را بررسی کنید." });
    renderCheckout();
    await ready();
    fireEvent.change(getField(labels.notes), { target: { value: "یادداشت پیش از خطای شبکه" } });
    fireEvent.click(payButton());

    const retry = await screen.findByRole("button", { name: "به‌روزرسانی سبد خرید" });
    expect(payButton()).toBeDisabled();
    expect(getField(labels.notes)).toHaveValue("یادداشت پیش از خطای شبکه");
    fireEvent.submit(document.getElementById("checkout-form"));
    expect(postDataWithAuth).toHaveBeenCalledTimes(2);
    expect(redirectToGateway).not.toHaveBeenCalled();

    fireEvent.click(retry);
    await waitFor(() => expect(screen.getAllByText("۲٬۷۰۰٬۰۰۰ تومان")).toHaveLength(2));
    expect(payButton()).toBeEnabled();
    expect(getField(labels.notes)).toHaveValue("یادداشت پیش از خطای شبکه");
    expect(postDataWithAuth).toHaveBeenCalledTimes(2);
    expect(axios.get).toHaveBeenCalledTimes(3);
});

test.each(["missing token", "expired token"])("returns an unauthenticated user to login with the checkout return path (%s)", async (state) => {
    if (state === "missing token") localStorage.removeItem("token");
    else axios.get.mockRejectedValue({ response: { status: 401, data: { message: "نشست منقضی شده است." } } });
    renderCheckout();

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/logIn?returnTo=%2Fcheckout", { replace: true }));
    expect(axios.get).toHaveBeenCalledTimes(state === "missing token" ? 0 : 1);
    expect(localStorage.getItem("token")).toBeNull();
    if (state === "expired token") expect(localStorage.getItem("user")).toBeNull();
    expect(postDataWithAuth).not.toHaveBeenCalled();
    expect(redirectToGateway).not.toHaveBeenCalled();
});
