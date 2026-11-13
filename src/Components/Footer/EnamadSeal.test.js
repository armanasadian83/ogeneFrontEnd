import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import EnamadSeal from "./EnamadSeal";

test("keeps the issued image and verification URLs with an origin referrer", () => {
    render(<EnamadSeal />);
    const image = screen.getByRole("img", { name: "نماد اعتماد الکترونیکی" });
    const link = screen.getByRole("link");
    expect(image).toHaveAttribute("src", "https://trustseal.enamad.ir/logo.aspx?id=6800848&Code=DCUvppqG13XGco7UU3cpoZFr82zDH5vY");
    expect(image).toHaveAttribute("referrerpolicy", "origin");
    expect(link).toHaveAttribute("referrerpolicy", "origin");
    expect(link).toHaveAttribute("rel", "noopener");
});

test("replaces a failed remote image with a usable official verification link", () => {
    render(<EnamadSeal />);
    const link = screen.getByRole("link");
    const issuedUrl = link.getAttribute("href");
    fireEvent.error(screen.getByRole("img"));
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /استعلام اینماد/ })).toHaveAttribute("href", issuedUrl);
});
