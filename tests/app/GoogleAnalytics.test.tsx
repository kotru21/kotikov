import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { GoogleAnalytics } from "@/app/components/GoogleAnalytics";

vi.mock("next/script", () => ({
  default: ({ src, id }: { src?: string; id?: string }): React.JSX.Element => (
    <script data-testid={id ?? "ga-script"} data-src={src} />
  ),
}));

describe("GoogleAnalytics", () => {
  it("loads gtag for the given measurement id", () => {
    render(<GoogleAnalytics measurementId="G-TEST1234" />);

    expect(screen.getByTestId("ga-script")).toHaveAttribute(
      "data-src",
      "https://www.googletagmanager.com/gtag/js?id=G-TEST1234"
    );
    expect(screen.getByTestId("ga-init")).toBeInTheDocument();
  });
});
