import { describe, expect, it } from "vitest";

import { applyPaintContrast, clearPaintInlineStyles } from "@/features/interactive-elements/lib/applyPaintContrast";

describe("applyPaintContrast", () => {
  it("clears styles when coverage is below threshold", () => {
    const el = document.createElement("button");
    el.style.color = "rgb(1, 2, 3)";
    applyPaintContrast(el, { coverage: 0.1, luminance: 0.2, preferDarkText: true }, 0.7);
    expect(el.style.color).toBe("");
  });

  it("falls back when dataset threshold is not finite", () => {
    const el = document.createElement("button");
    el.dataset.interactiveThreshold = "not-a-number";
    el.style.color = "rgb(1, 2, 3)";
    applyPaintContrast(el, { coverage: 0.5, luminance: 0.2, preferDarkText: true }, 0.7);
    expect(el.style.color).toBe("");
  });

  it("applies solid mode colors above threshold", () => {
    const el = document.createElement("button");
    el.dataset.interactiveMode = "solid";
    el.dataset.interactiveBg = "rgb(10, 20, 30)";
    el.dataset.interactiveText = "rgb(240, 240, 240)";
    applyPaintContrast(el, { coverage: 0.9, luminance: 0.1, preferDarkText: false }, 0.7);
    expect(el.style.backgroundColor).toBe("rgb(10, 20, 30)");
    expect(el.style.color).toBe("rgb(240, 240, 240)");
  });
});

describe("clearPaintInlineStyles", () => {
  it("removes paint contrast inline styles", () => {
    const el = document.createElement("a");
    el.style.color = "red";
    el.style.backgroundColor = "blue";
    el.style.borderColor = "green";
    el.style.boxShadow = "1px 1px black";
    clearPaintInlineStyles(el);
    expect(el.style.color).toBe("");
    expect(el.style.backgroundColor).toBe("");
    expect(el.style.borderColor).toBe("");
    expect(el.style.boxShadow).toBe("");
  });
});
