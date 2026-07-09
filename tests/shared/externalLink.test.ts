import { describe, expect, it } from "vitest";

import { formatExternalLinkLabel, isHttpUrl } from "@/shared/lib";

describe("formatExternalLinkLabel", () => {
  it("announces that the link opens in a new tab", () => {
    expect(formatExternalLinkLabel("Код")).toBe("Код (откроется в новой вкладке)");
  });
});

describe("isHttpUrl", () => {
  it.each([
    ["http://example.com", true],
    ["https://example.com", true],
    ["HTTP://example.com", true],
    ["HTTPS://example.com", true],
    ["mailto:test@example.com", false],
    ["httpx://example.com", false],
    ["/projects", false],
  ])("classifies %s as %s", (url, expected) => {
    expect(isHttpUrl(url)).toBe(expected);
  });
});
