import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { HeaderNyancat } from "@/widgets/header/ui/HeaderNyancat";

vi.mock("@/features/nyancat/client", () => ({
  // eslint-disable-next-line @typescript-eslint/naming-convention -- mock mirrors export
  FlyingNyancat: ({
    isMotionActive,
    testId,
  }: {
    isMotionActive?: boolean;
    testId?: string;
  }) => (
    <div
      data-testid={testId}
      data-motion-active={isMotionActive === true ? "true" : "false"}
    />
  ),
}));

describe("HeaderNyancat", () => {
  it("forwards paused motion state to FlyingNyancat", () => {
    render(<HeaderNyancat isMotionActive={false} />);
    expect(screen.getByTestId("header-nyancat")).toHaveAttribute("data-motion-active", "false");
  });

  it("forwards active motion state to FlyingNyancat", () => {
    render(<HeaderNyancat isMotionActive />);
    expect(screen.getByTestId("header-nyancat")).toHaveAttribute("data-motion-active", "true");
  });
});
