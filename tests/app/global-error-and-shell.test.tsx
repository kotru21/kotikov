import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import BackButton from "@/app/components/BackButton";
import BauhausErrorMark from "@/app/components/BauhausErrorMark";
import GlobalError from "@/app/global-error";
import { colors } from "@/styles/colors";

describe("BauhausErrorMark", () => {
  it("renders the bauhaus mark with the provided code", () => {
    render(<BauhausErrorMark code="404" />);

    expect(screen.getByTestId("bauhaus-error-mark")).toBeInTheDocument();
    expect(screen.getByTestId("bauhaus-error-mark")).toHaveTextContent("404");
  });
});

describe("BackButton", () => {
  it("calls history.back when clicked", () => {
    const back = vi.spyOn(history, "back").mockImplementation(() => undefined);

    render(<BackButton />);
    fireEvent.click(screen.getByRole("button", { name: "Назад" }));

    expect(back).toHaveBeenCalledOnce();
    back.mockRestore();
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
