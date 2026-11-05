import React from "react";
import { fireEvent, render, screen, within, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { MyContext } from "../../App";
import { LanguageProvider, LANGUAGE_STORAGE_KEY, useLanguage } from "../../i18n/LanguageContext";
import { fetchDataFromApi } from "../../utils/api";
import DegreeGuide from "./index";
import DegreeRequest from "./DegreeRequest";
import { degreeGuideGroups } from "./degreeGuideData";
import FieldOne from "../fieldsPages/fieldOne";
import AboutUs from "../aboutUs";

jest.mock("../../App", () => ({ MyContext: require("react").createContext(null) }));
jest.mock("../../utils/api", () => ({ fetchDataFromApi: jest.fn() }));
jest.mock("../../Components/Cards/courseCard", () => () => null);
jest.mock("react-router-dom", () => {
  const { TextEncoder, TextDecoder } = require("util");
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
  return jest.requireActual("react-router");
}, { virtual: true });

function LanguageControl() {
  const { language, setLanguage } = useLanguage();
  return <><output data-testid="language">{language}</output><button onClick={() => setLanguage(language === "en" ? "fa" : "en")}>Switch language</button></>;
}

function renderPage(element, path = "/") {
  const context = {
    setIsShowNavbar: jest.fn(), setIsShowFooter: jest.fn(), setIsShowCalenderBar: jest.fn(), setIsBaleIconShown: jest.fn(),
  };
  return render(<LanguageProvider><MyContext.Provider value={context}><MemoryRouter initialEntries={[path]}>
    <LanguageControl />{element}
  </MemoryRouter></MyContext.Provider></LanguageProvider>);
}

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
  localStorage.setItem(LANGUAGE_STORAGE_KEY, "en");
  jest.spyOn(window, "scrollTo").mockImplementation(() => {});
});
afterEach(() => jest.restoreAllMocks());

test("every original guide section, paragraph and list item has a paired English translation", () => {
  let paragraphs = 0;
  for (const group of degreeGuideGroups) {
    expect(group.title).toMatch(/[\u0600-\u06ff]/);
    expect(group.titleEn).toMatch(/[a-z]/i);
    for (const section of group.sections) {
      expect(section.title).toMatch(/[\u0600-\u06ff]/);
      expect(section.titleEn).toMatch(/[a-z]/i);
      expect(section.paragraphsEn).toHaveLength(section.paragraphs.length);
      section.paragraphsEn.forEach((paragraph) => {
        expect(paragraph).toMatch(/[a-z]/i);
        expect(paragraph).not.toMatch(/[\u0600-\u06ff]/);
      });
      expect(section.itemsEn ?? []).toHaveLength(section.items?.length ?? 0);
      paragraphs += section.paragraphs.length;
    }
  }
  expect(paragraphs).toBe(33);
});

test("the English guide has translated disclosures and an accessible comparison of the existing image ratings", () => {
  renderPage(<DegreeGuide />);
  expect(screen.getByRole("main")).toHaveAttribute("dir", "ltr");
  expect(screen.getByRole("heading", { level: 1, name: "Technical and vocational certificate" })).toBeVisible();
  const disclosure = screen.getByRole("group", { name: "Types of certificate" });
  fireEvent.click(within(disclosure).getByText("Types of certificate", { exact: true }));
  expect(within(disclosure).getByRole("heading", { name: "Official technical and vocational certificates" })).toBeVisible();
  expect(within(disclosure).getByText(/Obtaining an official certificate requires/)).toBeVisible();
  const table = screen.getByRole("table", { name: /Comparison shown in the institute/ });
  const vocational = within(table).getByRole("row", { name: /^Technical and vocational certificate / });
  expect(within(vocational).getAllByRole("cell", { name: "Recognized" })).toHaveLength(5);
  expect(within(table).getAllByRole("cell", { name: "Discretionary" })).toHaveLength(3);
});

test("English navigation opens the editable request and switching language preserves client-entered values", () => {
  renderPage(<Routes><Route path="/degree" element={<DegreeGuide />} /><Route path="/degree/request" element={<DegreeRequest />} /></Routes>, "/degree");
  fireEvent.click(screen.getByRole("link", { name: "Request a certificate" }));
  const name = screen.getByRole("textbox", { name: "First name", exact: true });
  fireEvent.change(name, { target: { value: "آرمان" } });
  fireEvent.change(screen.getByRole("textbox", { name: "Course title", exact: true }), { target: { value: "PCR workshop" } });
  expect(screen.getByRole("textbox", { name: "Email (optional)" })).not.toBeRequired();
  expect(screen.getByRole("textbox", { name: "Date of birth" })).toBeRequired();
  expect(screen.getByRole("textbox", { name: "First name", exact: true })).toHaveAttribute("dir", "ltr");
  fireEvent.click(screen.getByRole("button", { name: "Switch language" }));
  expect(screen.getByRole("main")).toHaveAttribute("dir", "rtl");
  expect(screen.getByRole("textbox", { name: "نام", exact: true })).toHaveValue("آرمان");
  expect(screen.getByRole("textbox", { name: "عنوان دوره", exact: true })).toHaveValue("PCR workshop");
  expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe("fa");
  fireEvent.click(screen.getByRole("button", { name: "Switch language" }));
  const write = jest.spyOn(Storage.prototype, "setItem");
  const submission = new Event("submit", { bubbles: true, cancelable: true });
  fireEvent.click(screen.getByRole("button", { name: "Submit certificate request" }));
  fireEvent(screen.getByRole("form", { name: "Certificate request" }), submission);
  expect(submission.defaultPrevented).toBe(true);
  expect(write).not.toHaveBeenCalled();
  expect(fetchDataFromApi).not.toHaveBeenCalled();
});

test("field language switching localizes service content while keeping API filters and request links canonical", async () => {
  fetchDataFromApi.mockImplementation((url) => Promise.resolve(url.startsWith("/api/service")
    ? [{ _id: "service1", name: "خدمت آزمایشگاهی", nameEn: "Laboratory service" }] : []));
  renderPage(<FieldOne />);
  await waitFor(() => expect(fetchDataFromApi).toHaveBeenCalledTimes(2));
  expect(fetchDataFromApi).toHaveBeenCalledWith("/api/service?filterKey=سلولی، مولکولی و ژنتیک");
  expect(fetchDataFromApi).toHaveBeenCalledWith("/api/course?filterKey=سلولی، مولکولی و ژنتیک");
  fireEvent.click(screen.getByRole("button", { name: /^Services/ }));
  expect(await screen.findByText("Laboratory service")).toBeVisible();
  expect(screen.getByRole("link", { name: "Submit a request" })).toHaveAttribute("href", `/service?fieldName=${encodeURIComponent("سلولی، مولکولی و ژنتیک")}`);
  fireEvent.click(screen.getByRole("button", { name: "Switch language" }));
  expect(screen.getByText("خدمت آزمایشگاهی")).toBeVisible();
  expect(fetchDataFromApi).toHaveBeenCalledTimes(2);
});

test("the About page follows the shared language selection and its existing toggle updates that selection", () => {
  renderPage(<AboutUs />);
  expect(screen.getByRole("heading", { name: "About Ogene", exact: true })).toBeVisible();
  fireEvent.click(screen.getByRole("button", { name: "فارسی", exact: true }));
  expect(screen.getByRole("heading", { name: "درباره اوژن", exact: true })).toBeVisible();
  expect(screen.getByTestId("language")).toHaveTextContent("fa");
  expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe("fa");
});
