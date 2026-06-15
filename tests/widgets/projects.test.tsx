import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProjectsWidget } from "@/widgets/projects";

describe("ProjectsWidget", () => {
  it("renders the heading and a code link per project", () => {
    render(<ProjectsWidget />);
    expect(screen.getByRole("heading", { name: /избранные/i })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /код/i })).toHaveLength(3);
    expect(screen.getByText("File Manager")).toBeInTheDocument();
  });
});
