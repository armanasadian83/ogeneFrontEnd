import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import axios from "axios";
import * as api from "../../utils/api";
import { MyContext } from "../../App";
import DegreeGuide from "./index";
import DegreeRequest from "./DegreeRequest";

jest.mock("../../App", () => ({ MyContext: require("react").createContext(null) }));
jest.mock("axios", () => ({ get: jest.fn(), post: jest.fn(), put: jest.fn(), delete: jest.fn(), request: jest.fn() }));
jest.mock("../../utils/api", () => ({
    fetchDataFromApi: jest.fn(), postData: jest.fn(), postDataWithAuth: jest.fn(), postAuthData: jest.fn(),
    updateAccountData: jest.fn(), editData: jest.fn(), deleteData: jest.fn(),
}));
// CRA's Jest resolver follows a missing legacy react-router-dom entry. These are
// the same real router exports, so MemoryRouter and Link still navigate normally.
jest.mock("react-router-dom", () => {
    const { TextEncoder, TextDecoder } = require("util");
    global.TextEncoder = TextEncoder;
    global.TextDecoder = TextDecoder;
    return jest.requireActual("react-router");
}, { virtual: true });

const originalFetch = global.fetch;
let storageWrites;
let storageRemovals;
let storageClears;

function LocationProbe() {
    const location = useLocation();
    return <output data-testid="degree-location">{location.pathname}{location.search}</output>;
}

function renderDegree(path = "/degree/request") {
    const context = {
        setIsShowNavbar: jest.fn(), setIsShowFooter: jest.fn(), setIsShowCalenderBar: jest.fn(), setIsBaleIconShown: jest.fn(),
    };
    return render(
        <MyContext.Provider value={context}>
            <MemoryRouter initialEntries={[path]}>
                <LocationProbe />
                <Routes>
                    <Route path="/degree" element={<DegreeGuide />} />
                    <Route path="/degree/request" element={<DegreeRequest />} />
                </Routes>
            </MemoryRouter>
        </MyContext.Provider>,
    );
}

beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    localStorage.setItem("existing-session", "unchanged");
    storageWrites = jest.spyOn(Storage.prototype, "setItem");
    storageRemovals = jest.spyOn(Storage.prototype, "removeItem");
    storageClears = jest.spyOn(Storage.prototype, "clear");
    jest.spyOn(window, "scrollTo").mockImplementation(() => {});
    global.fetch = jest.fn();
});

afterEach(() => {
    Object.values(api).filter(jest.isMockFunction).forEach((request) => expect(request).not.toHaveBeenCalled());
    Object.values(axios).filter(jest.isMockFunction).forEach((request) => expect(request).not.toHaveBeenCalled());
    expect(global.fetch).not.toHaveBeenCalled();
    expect(storageWrites).not.toHaveBeenCalled();
    expect(storageRemovals).not.toHaveBeenCalled();
    expect(storageClears).not.toHaveBeenCalled();
    expect(localStorage.getItem("existing-session")).toBe("unchanged");
    jest.restoreAllMocks();
    global.fetch = originalFetch;
});

test("the guide's دریافت مدرک action opens the request route and its back link returns to the guide", async () => {
    renderDegree("/degree");
    const action = screen.getByRole("link", { name: "دریافت مدرک", exact: true });
    expect(action).toHaveAttribute("href", "/degree/request");
    fireEvent.click(action);

    expect(await screen.findByRole("heading", { level: 1, name: "درخواست مدرک", exact: true })).toBeVisible();
    expect(screen.getByTestId("degree-location")).toHaveTextContent("/degree/request");
    fireEvent.click(screen.getByRole("link", { name: "بازگشت به راهنمای مدرک", exact: true }));
    expect(screen.getByTestId("degree-location").textContent).toBe("/degree");
    expect(screen.getByRole("link", { name: "دریافت مدرک", exact: true })).toBeVisible();
});

test("the preserved certificate guide can be expanded and collapsed through a named native disclosure", () => {
    renderDegree("/degree");
    const disclosure = screen.getByRole("group", { name: "انواع گواهینامه", exact: true });
    const heading = within(disclosure).getByText("مدارک رسمی فنی و حرفه‌ای", { exact: true });
    const summary = within(disclosure).getByText("انواع گواهینامه", { exact: true });
    expect(summary.textContent).toMatch(/[\u0600-\u06ff]/);
    if (disclosure.open) fireEvent.click(summary);
    expect(heading).not.toBeVisible();

    fireEvent.click(summary);
    expect(disclosure).toHaveAttribute("open");
    expect(heading).toBeVisible();
    expect(within(disclosure).getByText(/گرفتن گواهینامه رسمی فنی و حرفه‌ای نیازمند شرکت در آزمون‌هایی/)).toBeVisible();
    fireEvent.click(summary);
    expect(heading).not.toBeVisible();
});

test("request fields keep editable personal and course information in local UI state", () => {
    renderDegree();
    const values = [
        ["نام", "آرمان"], ["نام خانوادگی", "اسدیان"], ["نام به انگلیسی", "Arman"],
        ["نام خانوادگی به انگلیسی", "Asadian"], ["کد ملی", "۰۰١۲۳۴۵۶۷۸"],
        ["شماره همراه", "٠٩۱۲۳۴۵۶۷۸۹"], ["عنوان دوره", "دوره ژنتیک مولکولی"],
        ["توضیحات (اختیاری)", "برای دریافت مدرک راهنمایی می‌خواهم."],
    ];
    values.forEach(([label, value]) => {
        fireEvent.change(screen.getByRole("textbox", { name: label, exact: true }), { target: { value } });
    });
    expect(screen.getByRole("textbox", { name: "نام", exact: true })).toHaveValue("آرمان");
    expect(screen.getByRole("textbox", { name: "نام خانوادگی به انگلیسی", exact: true })).toHaveValue("Asadian");
    expect(screen.getByRole("textbox", { name: "کد ملی", exact: true })).toHaveValue("0012345678");
    expect(screen.getByRole("textbox", { name: "شماره همراه", exact: true })).toHaveValue("09123456789");
    expect(screen.getByRole("textbox", { name: "عنوان دوره", exact: true })).toHaveValue("دوره ژنتیک مولکولی");
    expect(screen.getByRole("textbox", { name: "توضیحات (اختیاری)", exact: true })).toHaveValue("برای دریافت مدرک راهنمایی می‌خواهم.");
    expect(screen.getByRole("textbox", { name: "تاریخ تولد", exact: true })).toBeEnabled();
    expect(screen.getByRole("textbox", { name: "تاریخ پایان دوره (اختیاری)", exact: true })).toBeEnabled();
    expect(screen.getByRole("textbox", { name: "ایمیل (اختیاری)", exact: true })).not.toBeRequired();
});

test("the request button and Enter/native form submission stay inert without API, storage, or navigation effects", () => {
    renderDegree();
    const firstName = screen.getByRole("textbox", { name: "نام", exact: true });
    fireEvent.change(firstName, { target: { value: "آرمان" } });
    fireEvent.click(screen.getByRole("button", { name: "ثبت درخواست مدرک", exact: true }));
    fireEvent.keyDown(firstName, { key: "Enter", code: "Enter" });
    // JSDOM does not emulate implicit Enter submission, so also exercise the
    // native submit event that a browser would dispatch for the form.
    const submission = new Event("submit", { bubbles: true, cancelable: true });
    fireEvent(screen.getByRole("form", { name: "درخواست مدرک", exact: true }), submission);

    expect(submission.defaultPrevented).toBe(true);
    expect(screen.getByTestId("degree-location").textContent).toBe("/degree/request");
    expect(firstName).toHaveValue("آرمان");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});
