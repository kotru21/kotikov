/* eslint-disable @typescript-eslint/naming-convention -- vi.mock factory keys must match the PascalCase named widget exports */
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Home from "@/app/page";

vi.mock("@/app/components/StructuredData", () => ({ default: () => null }));
vi.mock("@/widgets/header", () => ({ HeaderWidget: () => <section id="header" /> }));
vi.mock("@/widgets/about", () => ({ AboutWidget: () => <section id="about" /> }));
vi.mock("@/widgets/projects", () => ({ ProjectsWidget: () => <section id="projects" /> }));
vi.mock("@/widgets/skills", () => ({ SkillsWidget: () => <section id="skills" /> }));
vi.mock("@/widgets/timeline", () => ({ TimelineWidget: () => <section id="experience" /> }));
vi.mock("@/widgets/contacts", () => ({ ContactsWidget: () => <section id="contacts" /> }));
vi.mock("@/widgets/footer", () => ({ FooterWidget: () => <footer id="footer" /> }));

describe("home page composition", () => {
  it("renders sections in the agreed order", () => {
    const { container } = render(<Home />);
    const ids = Array.from(container.querySelectorAll("section, footer")).map((n) => n.id);
    expect(ids).toEqual([
      "header",
      "about",
      "projects",
      "skills",
      "experience",
      "contacts",
      "footer",
    ]);
  });
});
