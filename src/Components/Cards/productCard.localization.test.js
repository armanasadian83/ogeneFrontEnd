import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProductCard from "./productCard";
import { LanguageProvider, LANGUAGE_STORAGE_KEY, useLanguage } from "../../i18n/LanguageContext";

jest.mock("react-router-dom", () => ({
    Link: ({ to, children, ...props }) => <a href={to} {...props}>{children}</a>,
}), { virtual: true });

function LanguageControl() {
    const { language, setLanguage } = useLanguage();
    return <button onClick={() => setLanguage(language === "fa" ? "en" : "fa")}>Switch language</button>;
}

beforeEach(() => {
    localStorage.clear();
    localStorage.setItem(LANGUAGE_STORAGE_KEY, "fa");
});

test("switching language reformats current and old prices and renders the English discount in the correct order", () => {
    const item = { id: "book1", name: "کتاب آموزشی", nameEn: "Training book", price: 150000, oldPrice: 200000, images: ["book.png"] };
    render(<LanguageProvider><LanguageControl /><ProductCard item={item} /></LanguageProvider>);
    expect(screen.getByText("۱۵۰٬۰۰۰ تومان")).toBeVisible();
    expect(screen.getByText("۲۰۰٬۰۰۰ تومان")).toBeVisible();
    expect(screen.getByText("٪۲۵ تخفیف")).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "Switch language" }));
    expect(screen.getByText("150,000 toman")).toBeVisible();
    expect(screen.getByText("200,000 toman")).toBeVisible();
    expect(screen.getByText("25% off")).toBeVisible();
    expect(screen.getByText("Training book")).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "Switch language" }));
    expect(screen.getByText("۱۵۰٬۰۰۰ تومان")).toBeVisible();
    expect(screen.getByText("کتاب آموزشی")).toBeVisible();
});
