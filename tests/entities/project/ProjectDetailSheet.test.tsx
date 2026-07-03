import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React, { useRef, useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { ProjectDetailSheet } from "@/entities/project";
import { projectsData } from "@/shared/config/content";

function FocusRestoreHarness(): React.JSX.Element {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <button ref={triggerRef} type="button">
        Подробнее
      </button>
      <ProjectDetailSheet
        project={projectsData[1]}
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
        returnFocusRef={triggerRef}
        reducedMotion
      />
    </>
  );
}

describe("ProjectDetailSheet", () => {
  it("calls onClose when escape is pressed", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const project = projectsData[1];

    render(
      <ProjectDetailSheet project={project} isOpen onClose={onClose} reducedMotion />,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("calls onClose when overlay is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <ProjectDetailSheet project={projectsData[1]} isOpen onClose={onClose} reducedMotion />,
    );

    await user.click(screen.getByTestId("project-detail-overlay"));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("applies motion transition classes when reducedMotion is disabled", () => {
    render(
      <ProjectDetailSheet project={projectsData[1]} isOpen onClose={vi.fn()} reducedMotion={false} />,
    );

    expect(screen.getByTestId("project-detail-overlay").className).toContain("transition-opacity");
    expect(screen.getByRole("dialog", { hidden: true }).className).toContain("transition-transform");
    expect(screen.getByRole("dialog", { hidden: true }).className).toContain("translate-y-full");
  });

  it("does not focus the trigger on initial mount when closed", async () => {
    const triggerRef = React.createRef<HTMLButtonElement>();

    render(
      <>
        <button ref={triggerRef} type="button">
          Подробнее
        </button>
        <ProjectDetailSheet
          project={projectsData[1]}
          isOpen={false}
          onClose={vi.fn()}
          returnFocusRef={triggerRef}
          reducedMotion
        />
      </>,
    );

    await waitFor(() => {
      expect(triggerRef.current).not.toHaveFocus();
    });
  });

  it("returns focus to the trigger on close", async () => {
    const user = userEvent.setup();

    render(<FocusRestoreHarness />);

    const trigger = screen.getByRole("button", { name: /подробнее/i });
    const dialogClose = screen.getAllByRole("button", { name: /закрыть подробности проекта/i })[1];

    await user.click(dialogClose);

    await waitFor(() => {
      expect(trigger).toHaveFocus();
    });
  });

  it("keeps tab focus inside the dialog", async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });

    render(
      <ProjectDetailSheet project={projectsData[1]} isOpen onClose={vi.fn()} reducedMotion />,
    );

    const dialogClose = screen.getAllByRole("button", { name: /закрыть подробности проекта/i })[1];
    dialogClose.focus();

    await user.tab();

    expect(dialogClose).toHaveFocus();
  });
});
