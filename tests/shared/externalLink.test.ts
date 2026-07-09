import { describe, expect, it } from "vitest";

import { formatExternalLinkLabel } from "@/shared/lib";

describe("formatExternalLinkLabel", () => {
  it("announces that the link opens in a new tab", () => {
    expect(formatExternalLinkLabel("Код")).toBe("Код (откроется в новой вкладке)");
  });
});
