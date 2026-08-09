import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import BackButton from "@/app/components/BackButton";
import BauhausErrorMark from "@/app/components/BauhausErrorMark";
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

describe("BauhausErrorMark", () => {
  it("renders the bauhaus mark with the provided code", () => {
    render(<BauhausErrorMark code="404" />);

    expect(screen.getByTestId("bauhaus-error-mark")).toBeInTheDocument();
    expect(screen.getByTestId("bauhaus-error-mark")).toHaveTextContent("404");
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

    render(<GlobalError error={error} reset={reset} />);

    fireEvent.click(screen.getByRole("button", { name: "Перезагрузить" }));
    expect(reset).toHaveBeenCalledOnce();
    expect(screen.getByRole("link", { name: "На главную" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("heading", { name: "Критическая ошибка" })).toBeInTheDocument();
  });
});

describe("global-error palette parity", () => {
  it("keeps inlined criticalColors hexes aligned with shared palette tokens", async () => {
    const { readFile } = await import("node:fs/promises");
    const source = await readFile("app/global-error.tsx", "utf8");

    expect(source).toContain(`bg: "${colors.primary[500]}"`);
    expect(source).toContain(`hover: "${colors.primary[600]}"`);
    expect(source).toContain(`text: "${colors.neutral[900]}"`);
    expect(source).toContain(`primary: "${colors.primary[500]}"`);
    expect(source).toContain(`badge: "${colors.neutral[900]}"`);
  });
});
