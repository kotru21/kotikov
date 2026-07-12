import { describe, expect, it } from "vitest";

import { aboutContent } from "@/shared/config/content";
import { toCommentLines } from "@/widgets/about/lib/toCommentLines";

describe("toCommentLines", () => {
  it("splits the about body into sentence comment lines", () => {
    const lines = toCommentLines(aboutContent.body);

    expect(lines.length).toBeGreaterThan(1);
    expect(lines.join(" ")).toBe(aboutContent.body);
    expect(lines.every((line) => line.length > 0)).toBe(true);
  });

  it("trims and drops empty segments", () => {
    expect(toCommentLines("One.  Two!")).toEqual(["One.", "Two!"]);
    expect(toCommentLines("  Alone.  ")).toEqual(["Alone."]);
  });

  it("keeps a single segment when there is no sentence boundary", () => {
    expect(toCommentLines("no terminator")).toEqual(["no terminator"]);
  });
});
