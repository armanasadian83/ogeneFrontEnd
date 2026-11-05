import React from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { fetchDataFromApi, postData } from "./utils/api";
import App from "./App";

jest.mock("axios", () => ({}));
jest.mock("./utils/api", () => ({ ...jest.requireActual("./utils/api"), fetchDataFromApi: jest.fn(), postData: jest.fn() }));
jest.mock("react-router-dom", () => ({
    BrowserRouter: ({ children }) => children,
    Routes: ({ children }) => children,
    Route: ({ path, element }) => path === "/" ? element : null,
}), { virtual: true });
jest.mock("@mui/material", () => ({
    Snackbar: ({ open, children }) => open ? children : null,
    Alert: ({ severity, children }) => <div role="alert" data-severity={severity}>{children}</div>,
}));
jest.mock("react-top-loading-bar", () => () => null);
jest.mock("./Navbar", () => () => null);
jest.mock("./Components/Footer", () => () => null);
jest.mock("./Components/CalenderHome/calenderBar", () => () => null);
jest.mock("./Components/baleAlert", () => () => null);
jest.mock("./Pages/Home", () => function CartHarness() {
    const context = require("react").useContext(require("./App").MyContext);
    return <>
        <span data-testid="session-state">{context.isLoggedIn ? `signed-in:${context.user.userId}` : "signed-out"}</span>
        <span data-testid="cart-count">{Array.isArray(context.cartData) ? context.cartData.length : "invalid"}</span>
        <button disabled={context.addingInCart} onClick={() => context.addtoCart({ productId: "product-1", userId: "client-1" })}>Add item</button>
    </>;
});
jest.mock("./Pages/CourseDetails", () => () => null);
jest.mock("./Pages/Service", () => () => null);
jest.mock("./Pages/aboutUs", () => () => null);
jest.mock("./Pages/logIn", () => () => null);
jest.mock("./Pages/signUp", () => () => null);
jest.mock("./Pages/fieldsPages/fieldOne", () => () => null);
jest.mock("./Pages/fieldsPages/fieldTwo", () => () => null);
jest.mock("./Pages/fieldsPages/fieldThree", () => () => null);
jest.mock("./Pages/fieldsPages/fieldFour", () => () => null);
jest.mock("./Pages/fieldsPages/fieldFive", () => () => null);
jest.mock("./Pages/fieldsPages/fieldSix", () => () => null);
jest.mock("./Pages/FaniHerfeiDegree", () => () => null);
jest.mock("./Pages/Listing/courseShop", () => () => null);
jest.mock("./Pages/Listing/shop", () => () => null);
jest.mock("./Pages/ProductDetails", () => () => null);
jest.mock("./Pages/cart", () => () => null);
jest.mock("./Pages/checkout", () => () => null);
jest.mock("./Pages/verifyOTP", () => () => null);
jest.mock("./Pages/account/accountPage", () => () => null);
jest.mock("./Pages/Blog", () => () => null);
jest.mock("./Pages/orders", () => () => null);
jest.mock("./Pages/forgotPassword/ForgotPassword", () => () => null);
jest.mock("./Pages/forgotPassword/VerifyResetOTP", () => () => null);
jest.mock("./Pages/forgotPassword/ResetPassword", () => () => null);
jest.mock("./Pages/changePassword/ChangePassword", () => () => null);
jest.mock("./Pages/changePassword/ChangePasswordVerifyOTP", () => () => null);
jest.mock("./Pages/changePassword/ChangePasswordNew", () => () => null);
jest.mock("./Pages/payment/fail", () => () => null);
jest.mock("./Pages/payment/success", () => () => null);
jest.mock("./Pages/completeInfo", () => () => null);

beforeEach(() => {
    jest.clearAllMocks();
    fetchDataFromApi.mockReset().mockResolvedValue([]);
    postData.mockReset();
    localStorage.clear();
});

function session() {
    localStorage.setItem("token", "signed-token");
    localStorage.setItem("user", JSON.stringify({ userId: "client-1", name: "آرمان" }));
}

test("corrupt stored user JSON cannot crash application startup or fetch an invalid cart", () => {
    localStorage.setItem("token", "signed-token");
    localStorage.setItem("user", "invalid JSON");
    render(<App />);
    expect(screen.getByTestId("session-state")).toHaveTextContent("signed-out");
    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();
    expect(fetchDataFromApi).not.toHaveBeenCalled();
});

test.each([null, "unavailable", { success: false }, { isAxiosError: true, status: 500 }])("failed add-to-cart responses never announce success or pollute cart state (%p)", async (response) => {
    session();
    postData.mockResolvedValue(response);
    render(<App />);
    await waitFor(() => expect(screen.getByTestId("session-state")).toHaveTextContent("signed-in:client-1"));
    await act(async () => { fireEvent.click(screen.getByRole("button", { name: "Add item" })); });

    expect(screen.getByRole("alert")).toHaveAttribute("data-severity", "error");
    expect(screen.getByTestId("cart-count")).toHaveTextContent("0");
    expect(screen.getByRole("button", { name: "Add item" })).toBeEnabled();
});

test("only a persisted matching cart item produces a success notification and updates the cart", async () => {
    session();
    postData.mockResolvedValue({ _id: "cart-item-1", productId: "product-1", userId: "client-1" });
    render(<App />);
    await waitFor(() => expect(screen.getByTestId("session-state")).toHaveTextContent("signed-in:client-1"));
    await act(async () => { fireEvent.click(screen.getByRole("button", { name: "Add item" })); });

    expect(screen.getByRole("alert")).toHaveAttribute("data-severity", "success");
    expect(screen.getByTestId("cart-count")).toHaveTextContent("1");
    expect(postData).toHaveBeenCalledWith("/api/cart/add", { productId: "product-1", userId: "client-1" });
});

test("a failed initial cart read stays an empty array rather than becoming an error object", async () => {
    session();
    fetchDataFromApi.mockRejectedValue(new Error("Network failure"));
    render(<App />);
    await waitFor(() => expect(fetchDataFromApi).toHaveBeenCalled());
    expect(screen.getByTestId("cart-count")).toHaveTextContent("0");
    expect(fetchDataFromApi).toHaveBeenCalledWith("/api/cart?userId=client-1", expect.objectContaining({ throwOnError: true, signal: expect.any(Object) }));
});
