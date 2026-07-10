import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import NotFound from "../../app/not-found";

vi.mock("@/features/nyancat", () => ({
  // eslint-disable-next-line @typescript-eslint/naming-convention -- matches feature export name
  FlyingNyancat: () => <div data-testid="flying-nyancat" />,
}));

describe("NotFound", () => {
  it("renders a static Russian recovery surface", () => {
    render(<NotFound />);

    expect(screen.getByRole("heading", { name: "Страница не найдена" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "На главную" })).toHaveAttribute("href", "/");
    expect(screen.queryAllByTestId("flying-nyancat")).toHaveLength(0);
  });
});
