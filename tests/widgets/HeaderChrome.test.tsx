import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { headerContent } from "@/shared/config/content";
import { HeaderBackground, HeaderHero } from "@/widgets/header/ui";

vi.mock("@/features/interactive-elements", () => ({
  InteractiveElement: ({
    children,
    href,
    as: As = "div",
    ...props
  }: {
    children?: React.ReactNode;
    href?: string;
    as?: React.ElementType;
  } & Record<string, unknown>) => {
    if (typeof href === "string") {
      return (
        <a href={href} {...props}>
          {children}
        </a>
      );
    }
    return <As {...props}>{children}</As>;
  },
  InteractiveText: ({ text }: { text: string }) => text,
}));

vi.mock("@/shared/ui", async () => {
  const actual = await vi.importActual<typeof import("@/shared/ui")>("@/shared/ui");
  return {
    ...actual,
    BauhausGridPattern: () => <div data-testid="grid-pattern" />,
    GridPaintOverlay: ({ ref }: { ref?: React.Ref<unknown> }) => {
      if (typeof ref === "function") ref({ drawOnCanvas: vi.fn() });
      else if (ref && typeof ref === "object") {
        (ref as { current: unknown }).current = { drawOnCanvas: vi.fn() };
      }
      return <canvas data-testid="paint-overlay" />;
    },
  };
});

describe("HeaderBackground", () => {
  it("renders grid guides without paint overlay by default", () => {
    render(<HeaderBackground />);
    expect(screen.getByTestId("grid-pattern")).toBeInTheDocument();
    expect(screen.queryByTestId("paint-overlay")).not.toBeInTheDocument();
  });

  it("mounts paint overlay when paintRef is provided", () => {
    const paintRef = createRef<{ drawOnCanvas: () => void }>();
    render(<HeaderBackground paintRef={paintRef} />);
    expect(screen.getByTestId("paint-overlay")).toBeInTheDocument();
  });
});

describe("HeaderHero", () => {
  it("renders eyebrow, title, subtitle, and CTAs", () => {
    render(
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
    expect(
      screen.getByRole("link", { name: headerContent.buttons.primary.text })
    ).toHaveAttribute("href", headerContent.buttons.primary.href);
    expect(
      screen.getByRole("link", { name: new RegExp(headerContent.buttons.secondary.text) })
    ).toHaveAttribute("href", headerContent.buttons.secondary.href);
  });
});
