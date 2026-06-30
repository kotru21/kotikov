import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ScrollRestoration, shouldResetScrollOnLoad } from "@/features/scrolling";

describe("shouldResetScrollOnLoad", () => {
  it("returns true when there is no hash", () => {
    expect(shouldResetScrollOnLoad("")).toBe(true);
  });

  it("returns true for a bare hash symbol", () => {
    expect(shouldResetScrollOnLoad("#")).toBe(true);
  });

  it("returns false when an anchor target is present", () => {
    expect(shouldResetScrollOnLoad("#skills")).toBe(false);
  });
});

describe("ScrollRestoration", () => {
  beforeEach(() => {
    window.history.scrollRestoration = "auto";
  });

  afterEach(() => {
    vi.restoreAllMocks();
    window.history.scrollRestoration = "auto";
  });

  it("scrolls to top on load when there is no hash", () => {
    vi.spyOn(window, "location", "get").mockReturnValue({
      hash: "",
    } as Location);

    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);

    render(<ScrollRestoration />);

    expect(window.history.scrollRestoration).toBe("manual");
    expect(scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it("does not override scroll when a hash is present", () => {
    vi.spyOn(window, "location", "get").mockReturnValue({
      hash: "#skills",
    } as Location);

    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);

    render(<ScrollRestoration />);

    expect(scrollTo).not.toHaveBeenCalled();
  });

  it("scrolls to top when only a bare hash symbol is present", () => {
    vi.spyOn(window, "location", "get").mockReturnValue({
      hash: "#",
    } as Location);

    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);

    render(<ScrollRestoration />);

    expect(scrollTo).toHaveBeenCalledWith(0, 0);
  });
});
