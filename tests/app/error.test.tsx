import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import ErrorPage from "../../app/error";

describe("ErrorPage", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("offers retry and home recovery without emoji", () => {
    const reset = vi.fn();
    const error = Object.assign(new Error("test failure"), { digest: "test-digest" });
    const { container } = render(<ErrorPage error={error} reset={reset} />);

    fireEvent.click(screen.getByRole("button", { name: "Попробовать снова" }));
    expect(reset).toHaveBeenCalledOnce();
    expect(screen.getByRole("link", { name: "На главную" })).toHaveAttribute("href", "/");
    expect(container).not.toHaveTextContent("🚨");
    expect(screen.getByTestId("bauhaus-error-mark")).toBeInTheDocument();
  });
});
