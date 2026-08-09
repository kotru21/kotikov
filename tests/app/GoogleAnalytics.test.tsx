import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { GoogleAnalytics } from "@/app/components/GoogleAnalytics";

vi.mock("next/script", () => ({
  default: ({ src, id }: { src?: string; id?: string }): React.JSX.Element => (
    <script data-testid={id ?? "ga-script"} data-src={src} />
  ),
}));

describe("GoogleAnalytics", () => {
  afterEach(() => {
    window.localStorage.clear();
  });

  it("asks for consent before loading gtag", () => {
    render(<GoogleAnalytics measurementId="G-TEST1234" />);

    expect(screen.getByRole("dialog", { name: "Согласие на аналитику" })).toBeInTheDocument();
    expect(screen.queryByTestId("ga-script")).not.toBeInTheDocument();
  });

  it("loads gtag after consent is granted", () => {
    render(<GoogleAnalytics measurementId="G-TEST1234" />);

    fireEvent.click(screen.getByRole("button", { name: "Принять" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByTestId("ga-script")).toHaveAttribute(
      "data-src",
      "https://www.googletagmanager.com/gtag/js?id=G-TEST1234"
    );
    expect(window.localStorage.getItem("ktkv-ga-consent")).toBe("granted");
  });

  it("hides the banner when consent is denied", () => {
    render(<GoogleAnalytics measurementId="G-TEST1234" />);

    fireEvent.click(screen.getByRole("button", { name: "Отклонить" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.queryByTestId("ga-script")).not.toBeInTheDocument();
    expect(window.localStorage.getItem("ktkv-ga-consent")).toBe("denied");
  });
});
