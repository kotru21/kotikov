import { readFile } from "node:fs/promises";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import StructuredData from "@/app/components/StructuredData";

describe("StructuredData", () => {
  it("renders three JSON-LD script tags", () => {
    const { container } = render(<StructuredData />);
    expect(container.querySelectorAll('script[type="application/ld+json"]')).toHaveLength(3);
  });

  it("escapes < as a six-char \\\\u003c sequence, not a no-op < character", () => {
    const escaped = JSON.stringify({ x: "</script>" }).replace(/</g, "\\u003c");
    expect(escaped).toBe('{"x":"\\u003c/script>"}');
    expect(escaped.includes("<")).toBe(false);
  });

  it("applies the literal \\\\u003c replacement in source", async () => {
    const source = await readFile("app/components/StructuredData.tsx", "utf8");
    expect(source).toMatch(/\.replace\(\/<\/g,\s*"\\\\u003c"\)/);
    expect(source).not.toMatch(/\.replace\(\/<\/g,\s*"\\u003c"\)/);
  });
});
