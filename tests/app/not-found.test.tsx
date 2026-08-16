import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { GRID_TYPE } from "@/shared/ui";

import NotFound from "../../app/not-found";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    back: vi.fn(),
    push: vi.fn(),
  }),
}));

describe("NotFound", () => {
  it("renders a static Russian recovery surface", () => {
    const { container } = render(<NotFound />);

    expect(screen.getByRole("heading", { name: "Страница не найдена" })).toBeInTheDocument();
    expect(container.querySelector("main#main-content")).not.toBeNull();
    expect(screen.getByRole("link", { name: "На главную" })).toHaveAttribute("href", "/");
    expect(screen.queryAllByTestId("flying-nyancat")).toHaveLength(0);
    expect(container).toHaveTextContent("404");
  });

  it("uses grid type and K instead of the Bauhaus illustration", () => {
    const { container } = render(<NotFound />);
    const svg = container.querySelector("svg");

    expect(screen.queryByTestId("bauhaus-error-mark")).not.toBeInTheDocument();
    expect(container.innerHTML).not.toMatch(/clip-path|clipPath/i);
    expect(svg).not.toBeNull();
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg?.querySelector("rect")).toHaveAttribute("fill", "currentColor");
  });

  it("uses grid type colors that flip in dark theme", () => {
    render(<NotFound />);

    expect(screen.getByRole("heading", { name: "Страница не найдена" }).className).toContain(
      GRID_TYPE,
    );
    expect(screen.getByText(/не существует или была перемещена/).className).toContain(GRID_TYPE);
    expect(screen.getByText("Может быть, вас заинтересует:").className).toContain(GRID_TYPE);
    expect(screen.getByRole("link", { name: "Навыки" }).className).toContain(GRID_TYPE);
  });
});
