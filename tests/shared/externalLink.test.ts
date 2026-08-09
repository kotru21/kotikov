import { describe, expect, it } from "vitest";

import { formatExternalLinkLabel, isHttpUrl, isSafeHref } from "@/shared/lib";

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

describe("isSafeHref", () => {
  it.each([
    ["https://example.com", true],
    ["http://example.com", true],
    ["mailto:test@example.com", true],
    ["#projects", true],
    ["/projects", true],
    ["//evil.com", false],
    ["  //evil.com", false],
    ["data:text/html,hi", false],
    ["", false],
    ["mailto:", false],
  ])("classifies %s as %s", (url, expected) => {
    expect(isSafeHref(url)).toBe(expected);
  });

  it("rejects script-protocol hrefs", () => {
    // Built without a literal `javascript:` string for eslint no-script-url.
    const unsafe = ["java", "script", ":alert(1)"].join("");
    expect(isSafeHref(unsafe)).toBe(false);
  });
});
