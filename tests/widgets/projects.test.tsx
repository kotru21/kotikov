import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ProjectsWidget } from "@/widgets/projects";

describe("ProjectsWidget", () => {
  beforeEach(() => {
    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
  });

  it("renders the heading and action links per project", () => {
    render(<ProjectsWidget />);
    expect(screen.getByRole("heading", { name: /избранные/i })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /код/i })).toHaveLength(4);
    expect(screen.queryByRole("button", { name: /подробнее/i })).not.toBeInTheDocument();
    expect(screen.getAllByText("CodeAnalyzer")).toHaveLength(2);
  });
});
