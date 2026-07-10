import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useRafWhile } from "@/features/performance";

function RafProbe({ active, onFrame }: { active: boolean; onFrame: (time: number) => void }): null {
  useRafWhile(active, onFrame);
  return null;
}

describe("useRafWhile", () => {
  const requestAnimationFrame = vi.fn((callback: FrameRequestCallback): number => {
    void callback;
    return 1;
  });
  const cancelAnimationFrame = vi.fn();

  beforeEach(() => {
    requestAnimationFrame.mockClear();
    cancelAnimationFrame.mockClear();
    vi.stubGlobal("requestAnimationFrame", requestAnimationFrame);
    vi.stubGlobal("cancelAnimationFrame", cancelAnimationFrame);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("schedules frames only while active", () => {
    const onFrame = vi.fn();
    const { rerender, unmount } = render(<RafProbe active={false} onFrame={onFrame} />);
    expect(requestAnimationFrame).not.toHaveBeenCalled();

    rerender(<RafProbe active onFrame={onFrame} />);
    expect(requestAnimationFrame).toHaveBeenCalledTimes(1);

    rerender(<RafProbe active={false} onFrame={onFrame} />);
    expect(cancelAnimationFrame).toHaveBeenCalled();
    unmount();
  });
});
