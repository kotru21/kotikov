import { describe, expect, it } from "vitest";

import {
  computeNavIslandStyle,
  DESKTOP_NAV_ISLAND_PRESET,
  MOBILE_NAV_ISLAND_PRESET,
} from "@/features/scrolling/navIslandStyle";

describe("computeNavIslandStyle", () => {
  it("returns full-width transparent island at progress 0", () => {
    const desktop = computeNavIslandStyle(DESKTOP_NAV_ISLAND_PRESET, 0);
    const mobile = computeNavIslandStyle(MOBILE_NAV_ISLAND_PRESET, 0);

    expect(desktop.islandStyle.width).toBe("100vw");
    expect(desktop.islandStyle.backgroundColor).toBe("transparent");
    expect(desktop.islandStyle.borderWidth).toBe(0);
    expect(desktop.topOffset).toBe(0);

    expect(mobile.islandStyle.width).toBe("100%");
    expect(mobile.islandStyle.paddingInline).toBe("0px");
    expect(mobile.islandStyle.paddingBlock).toBe("0px");
    expect(mobile.islandStyle.backgroundColor).toBe("transparent");
    expect(mobile.topOffset).toBe(0);
  });

  it("desktop preset reaches 58vw island at progress 1", () => {
    const desktop = computeNavIslandStyle(DESKTOP_NAV_ISLAND_PRESET, 1);

    expect(desktop.islandStyle.width).toBe("58vw");
    expect(desktop.islandStyle.paddingInline).toBe("16px");
    expect(desktop.islandStyle.paddingBlock).toBe("10px");
    expect(desktop.topOffset).toBe(12);
    expect(desktop.accentBarHeight).toBe(32);
  });

  it("mobile preset reaches 85vw island at progress 1", () => {
    const mobile = computeNavIslandStyle(MOBILE_NAV_ISLAND_PRESET, 1);

    expect(mobile.islandStyle.width).toBe("85vw");
    expect(mobile.islandStyle.paddingInline).toBe("12px");
    expect(mobile.islandStyle.paddingBlock).toBe("8px");
    expect(mobile.topOffset).toBe(8);
    expect(mobile.accentBarHeight).toBe(24);
  });
});
