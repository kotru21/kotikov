import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import BackButton from "@/app/components/BackButton";
import { GridErrorMark } from "@/app/components/GridErrorMark";
import GlobalError from "@/app/global-error";
import { colors } from "@/styles/colors";

const routerBack = vi.fn();
const routerPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    back: routerBack,
    push: routerPush,
  }),
}));

describe("GridErrorMark", () => {
  it("renders giant code and the geometric K", () => {
    const { container } = render(<GridErrorMark code="404" />);
    const svg = container.querySelector("svg");

    expect(container).toHaveTextContent("404");
    expect(screen.queryByTestId("bauhaus-error-mark")).not.toBeInTheDocument();
    expect(svg).not.toBeNull();
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg?.querySelector("rect")).toHaveAttribute("fill", "currentColor");
  });

  it("renders the error code", () => {
    const { container } = render(<GridErrorMark code="error" />);

    expect(container).toHaveTextContent("error");
  });

  it("centers the plaque in the column without overflowing", () => {
    const { container } = render(<GridErrorMark code="error" />);
    const wrap = container.firstElementChild;
    const plaque = wrap?.firstElementChild;

    expect(wrap).toHaveStyle({ display: "flex", justifyContent: "center", width: "100%" });
    expect(plaque).toHaveStyle({ maxWidth: "100%", minWidth: 0, width: "fit-content" });
  });
});

describe("BackButton", () => {
  beforeEach(() => {
    routerBack.mockReset();
    routerPush.mockReset();
  });

  it("calls router.back when history has prior entries", () => {
    Object.defineProperty(window.history, "length", { configurable: true, value: 3 });

    render(<BackButton />);
    fireEvent.click(screen.getByRole("button", { name: "Назад" }));

    expect(routerBack).toHaveBeenCalledOnce();
    expect(routerPush).not.toHaveBeenCalled();
  });

  it("navigates home when there is no history to go back to", () => {
    Object.defineProperty(window.history, "length", { configurable: true, value: 1 });

    render(<BackButton />);
    fireEvent.click(screen.getByRole("button", { name: "Назад" }));

    expect(routerPush).toHaveBeenCalledWith("/");
    expect(routerBack).not.toHaveBeenCalled();
  });
});

describe("GlobalError", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("offers reload and home recovery", () => {
    const reset = vi.fn();
    const error = Object.assign(new Error("critical"), { digest: "global-digest" });
    const { container } = render(<GlobalError error={error} reset={reset} />);
    const svg = container.querySelector("svg");

    fireEvent.click(screen.getByRole("button", { name: "Перезагрузить" }));
    expect(reset).toHaveBeenCalledOnce();
    expect(screen.getByRole("link", { name: "На главную" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("heading", { name: "Критическая ошибка" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Критическая ошибка" })).toHaveStyle({
      color: colors.text.onDark,
    });
    expect(container).toHaveTextContent("error");
    expect(screen.queryByTestId("bauhaus-error-mark")).not.toBeInTheDocument();
    expect(svg).not.toBeNull();
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByRole("button", { name: "Перезагрузить" }).parentElement?.className).toBe(
      "global-error-actions",
    );
  });
});

describe("global-error palette parity", () => {
  it("keeps inlined criticalColors hexes aligned with shared palette tokens", async () => {
    const { readFile } = await import("node:fs/promises");
    const source = await readFile("app/global-error.tsx", "utf8");

    expect(source).toContain(`background: "${colors.background.dark}"`);
    expect(source).toContain(`primary: "${colors.text.onDark}"`);
    expect(source).toContain(`bg: "${colors.primary[500]}"`);
    expect(source).toContain(`hover: "${colors.primary[600]}"`);
    expect(source).toContain(`text: "${colors.neutral[900]}"`);
  });
});
