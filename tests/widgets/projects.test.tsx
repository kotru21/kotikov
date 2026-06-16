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

  it("renders the heading and a code link per project", () => {
    render(<ProjectsWidget />);
    expect(screen.getByRole("heading", { name: /избранные/i })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /код/i })).toHaveLength(4);
    expect(screen.getAllByText("File Manager")).toHaveLength(2);
  });
});
