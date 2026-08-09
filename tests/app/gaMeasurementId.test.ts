import { describe, expect, it } from "vitest";

import { resolveGaMeasurementId } from "../../app/gaMeasurementId";

describe("resolveGaMeasurementId", () => {
  it("accepts trimmed GA4 measurement IDs", () => {
    expect(resolveGaMeasurementId("G-ABC123")).toBe("G-ABC123");
    expect(resolveGaMeasurementId("  g-xyz789  ")).toBe("g-xyz789");
  });

  it("rejects missing, empty, or non-GA shapes", () => {
    expect(resolveGaMeasurementId(undefined)).toBeNull();
    expect(resolveGaMeasurementId("")).toBeNull();
    expect(resolveGaMeasurementId("   ")).toBeNull();
    expect(resolveGaMeasurementId("UA-123456-1")).toBeNull();
    expect(resolveGaMeasurementId("G-ABC<script>")).toBeNull();
    expect(resolveGaMeasurementId("not-an-id")).toBeNull();
  });
});
