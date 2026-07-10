import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import CatPaw from "@/widgets/contacts/ui/CatPaw";

vi.mock("@/features/paw", () => {
  function PawCursorIcon({ className }: { className?: string }): React.JSX.Element {
    return <svg data-testid="paw-icon" className={className} />;
  }
  return { PawCursorIcon };
});

describe("CatPaw", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    document.getElementById("contacts")?.remove();
  });

  it("renders when active and inside the contacts section bounds", () => {
    const section = document.createElement("section");
    section.id = "contacts";
    section.getBoundingClientRect = (): DOMRect => ({
      left: 0,
      top: 0,
      right: 400,
      bottom: 400,
      width: 400,
      height: 400,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });
    document.body.appendChild(section);

    render(<CatPaw x={100} y={100} isActive velocity={{ x: 10, y: 5 }} />);

    expect(screen.getByTestId("paw-icon")).toBeInTheDocument();
  });

  it("hides when inactive or outside bounds", () => {
    const { rerender } = render(
      <CatPaw x={100} y={100} isActive={false} velocity={{ x: 0, y: 0 }} />
    );
    expect(screen.queryByTestId("paw-icon")).not.toBeInTheDocument();

    const section = document.createElement("section");
    section.id = "contacts";
    section.getBoundingClientRect = (): DOMRect => ({
      left: 0,
      top: 0,
      right: 50,
      bottom: 50,
      width: 50,
      height: 50,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });
    document.body.appendChild(section);

    rerender(<CatPaw x={500} y={500} isActive velocity={{ x: 0, y: 0 }} />);
    expect(screen.queryByTestId("paw-icon")).not.toBeInTheDocument();
  });

  it("rechecks bounds on scroll and resize", () => {
    const section = document.createElement("section");
    section.id = "contacts";
    section.getBoundingClientRect = (): DOMRect => ({
      left: 0,
      top: 0,
      right: 400,
      bottom: 400,
      width: 400,
      height: 400,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });
    document.body.appendChild(section);

    render(<CatPaw x={100} y={100} isActive velocity={{ x: 2, y: 2 }} />);
    expect(screen.getByTestId("paw-icon")).toBeInTheDocument();

    act(() => {
      window.dispatchEvent(new Event("scroll"));
      vi.advanceTimersByTime(60);
      window.dispatchEvent(new Event("resize"));
      vi.advanceTimersByTime(160);
    });

    expect(screen.getByTestId("paw-icon")).toBeInTheDocument();
  });
});
