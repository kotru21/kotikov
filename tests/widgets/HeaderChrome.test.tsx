/* eslint-disable @typescript-eslint/naming-convention -- vi.mock keys match component exports */
import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";

import { headerContent } from "@/shared/config/content";
import type * as SharedUi from "@/shared/ui";
import type { GridPaintOverlayRef } from "@/shared/ui";
import { colors } from "@/styles/colors";
import { HeaderBackground, HeaderHero } from "@/widgets/header/ui";

vi.mock("@/features/interactive-elements", () => {
  function InteractiveElement({
    children,
    href,
    as: Component = "div",
    ...props
  }: {
    children?: React.ReactNode;
    href?: string;
    as?: React.ElementType;
  } & Record<string, unknown>): React.JSX.Element {
    if (typeof href === "string") {
      return (
        <a href={href} {...props}>
          {children}
        </a>
      );
    }
    return <Component {...props}>{children}</Component>;
  }

  function InteractiveText({ text }: { text: string }): string {
    return text;
  }

  return { InteractiveElement, InteractiveText };
});

vi.mock("@/shared/ui", async () => {
  const actual = await vi.importActual<typeof SharedUi>("@/shared/ui");

  function BauhausGridPattern(): React.JSX.Element {
    return <div data-testid="grid-pattern" />;
  }

  function GridPaintOverlay({ ref }: { ref?: React.Ref<unknown> }): React.JSX.Element {
    if (typeof ref === "function") ref({ drawOnCanvas: vi.fn() });
    else if (ref && typeof ref === "object") {
      (ref as { current: unknown }).current = { drawOnCanvas: vi.fn() };
    }
    return <canvas data-testid="paint-overlay" />;
  }

  return {
    ...actual,
    BauhausGridPattern,
    GridPaintOverlay,
  };
});

describe("HeaderBackground", () => {
  it("renders grid guides without paint overlay by default", () => {
    const { container } = render(<HeaderBackground />);
    expect(screen.getByTestId("grid-pattern")).toBeInTheDocument();
    expect(screen.queryByTestId("paint-overlay")).not.toBeInTheDocument();
    expect(container.querySelectorAll("[data-draw-allow]")).toHaveLength(0);
  });

  it("mounts paint overlay when paintRef is provided", () => {
    const paintRef = createRef<GridPaintOverlayRef>();
    render(<HeaderBackground paintRef={paintRef} />);
    expect(screen.getByTestId("paint-overlay")).toBeInTheDocument();
  });
});

describe("HeaderHero", () => {
  it("renders eyebrow, title, subtitle, and CTAs", () => {
    const { container } = render(
      <HeaderHero
        eyebrow={headerContent.eyebrow}
        title={headerContent.title}
        subtitle={headerContent.subtitle}
        buttons={headerContent.buttons}
      />
    );

    expect(screen.getByText(headerContent.eyebrow)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: headerContent.title })).toBeInTheDocument();
    expect(screen.getByText(headerContent.subtitle)).toBeInTheDocument();
    const primaryCta = screen.getByRole("link", { name: headerContent.buttons.primary.text });
    expect(primaryCta).toHaveAttribute("href", headerContent.buttons.primary.href);
    expect(primaryCta).toHaveAttribute("data-interactive-mode", "solid");
    expect(primaryCta).toHaveAttribute("data-interactive-bg", colors.primary[500]);
    expect(primaryCta).toHaveAttribute("data-interactive-text", "black");
    expect(primaryCta).toHaveAttribute("data-interactive-shadow", "var(--shadow-hard-sm)");
    expect(
      screen.getByRole("link", { name: new RegExp(headerContent.buttons.secondary.text) })
    ).toHaveAttribute("href", headerContent.buttons.secondary.href);
    expect(container.querySelector(".blur-sm")).toBeNull();
    expect(container.querySelector(".mix-blend-multiply")).toBeNull();
  });
});
