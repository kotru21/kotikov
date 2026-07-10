import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { useDocumentVisibility } from "@/features/performance";

function VisibilityProbe(): React.JSX.Element {
  const isVisible = useDocumentVisibility();
  return <output>{String(isVisible)}</output>;
}

afterEach(() => {
  Object.defineProperty(document, "visibilityState", {
    configurable: true,
    value: "visible",
  });
});

describe("useDocumentVisibility", () => {
  it("updates when document visibility changes", () => {
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      value: "hidden",
    });
    render(<VisibilityProbe />);
    expect(screen.getByText("false")).toBeInTheDocument();

    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      value: "visible",
    });
    fireEvent(document, new Event("visibilitychange"));
    expect(screen.getByText("true")).toBeInTheDocument();
  });
});
