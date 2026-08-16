import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { GRID_TYPE } from "@/shared/ui";

import ErrorPage from "../../app/error";

describe("ErrorPage", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it("offers retry and home recovery without emoji", () => {
    const reset = vi.fn();
    const error = Object.assign(new Error("test failure"), { digest: "test-digest" });
    const { container } = render(<ErrorPage error={error} reset={reset} />);
    const svg = container.querySelector("svg");

    fireEvent.click(screen.getByRole("button", { name: "Попробовать снова" }));
    expect(reset).toHaveBeenCalledOnce();
    expect(screen.getByRole("link", { name: "На главную" })).toHaveAttribute("href", "/");
    expect(container.querySelector("main#main-content")).not.toBeNull();
    expect(container).not.toHaveTextContent("🚨");
    expect(container).toHaveTextContent("error");
    expect(screen.queryByTestId("bauhaus-error-mark")).not.toBeInTheDocument();
    expect(svg).not.toBeNull();
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  it("keeps copy readable in both themes and gaps recovery actions", () => {
    const reset = vi.fn();
    const error = Object.assign(new Error("test failure"), { digest: "test-digest" });
    render(<ErrorPage error={error} reset={reset} />);

    const heading = screen.getByRole("heading", { name: "Произошла ошибка" });
    const body = screen.getByText(/Попробуйте еще раз/);
    const retry = screen.getByRole("button", { name: "Попробовать снова" });
    const home = screen.getByRole("link", { name: "На главную" });

    expect(heading.className).toContain(GRID_TYPE);
    expect(body.className).toContain(GRID_TYPE);
    expect(retry.parentElement).toBe(home.parentElement);
    expect(retry.parentElement?.className).toContain("flex");
    expect(retry.parentElement?.className).toContain("gap-3");
    expect(retry.parentElement?.className).not.toContain("space-y-4");
    expect(retry.className).toContain("bg-primary-500");
    expect(retry.className).toMatch(/text-black|text-\[#111\]/);
  });

  it("keeps the development details summary on grid type", () => {
    vi.stubEnv("NODE_ENV", "development");
    const reset = vi.fn();
    const error = Object.assign(new Error("test failure"), { digest: "test-digest" });
    render(<ErrorPage error={error} reset={reset} />);

    expect(screen.getByText("Подробности ошибки (dev)").className).toContain(GRID_TYPE);
  });
});
