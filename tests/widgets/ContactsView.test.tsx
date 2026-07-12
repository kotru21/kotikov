import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";

import type { ContactInfo } from "@/entities/contact";
import { contactsData } from "@/shared/config/content";
import { type ContactCanvasRef, ContactsView } from "@/widgets/contacts/ui";

function DummyIcon(): React.JSX.Element {
  return <svg />;
}

const contacts: ContactInfo[] = [
  {
    label: "HTTPS",
    value: "secure.example",
    link: "https://secure.example",
    icon: DummyIcon,
    layout: "hero",
  },
  {
    label: "HTTP",
    value: "uppercase.example",
    link: "HTTP://uppercase.example",
    icon: DummyIcon,
    layout: "secondary-light",
  },
  {
    label: "Email",
    value: "test@example.com",
    link: "mailto:test@example.com",
    icon: DummyIcon,
    layout: "secondary-dark",
  },
  {
    label: "HTTPX",
    value: "invalid.example",
    link: "httpx://invalid.example",
    icon: DummyIcon,
    layout: "secondary-light",
  },
];

const inertPointerHandler = vi.fn();
const viewProps = {
  contacts,
  isDrawing: false,
  mountPaint: false,
  enablePaint: false,
  onClearCanvas: vi.fn(),
  canvasRef: createRef<ContactCanvasRef>(),
  onPointerEnter: inertPointerHandler,
  onPointerMove: inertPointerHandler,
  onPointerLeave: inertPointerHandler,
  onPointerDown: inertPointerHandler,
  onPointerUp: inertPointerHandler,
  onPointerCancel: inertPointerHandler,
} satisfies React.ComponentProps<typeof ContactsView>;

describe("ContactsView", () => {
  it("opens case-insensitive HTTP links in a new tab", () => {
    render(<ContactsView {...viewProps} />);

    const httpsLink = screen.getByRole("link", {
      name: "HTTPS (откроется в новой вкладке)",
    });
    const httpLink = screen.getByRole("link", {
      name: "HTTP (откроется в новой вкладке)",
    });

    expect(httpsLink).toHaveAttribute("target", "_blank");
    expect(httpsLink).toHaveAttribute("rel", "noopener noreferrer");
    expect(httpLink).toHaveAttribute("target", "_blank");
    expect(httpLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("does not announce a new tab for mailto or unsupported protocols", () => {
    const { container } = render(<ContactsView {...viewProps} />);

    const emailLink = screen.getByRole("link", { name: "Написать: test@example.com" });
    const httpxLink = container.querySelector('a[href="httpx://invalid.example"]');

    expect(emailLink).not.toHaveAttribute("target");
    expect(emailLink).not.toHaveAttribute("rel");
    expect(httpxLink).toBeInTheDocument();
    expect(httpxLink).not.toHaveAttribute("target");
    expect(httpxLink).not.toHaveAttribute("rel");
    expect(httpxLink).not.toHaveAccessibleName(/откроется в новой вкладке/i);
  });

  it("does not render the paw cursor while paint is enabled", () => {
    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    render(<ContactsView {...viewProps} isDrawing mountPaint enablePaint />);

    expect(screen.queryByTestId("paw-icon")).not.toBeInTheDocument();
  });

  it("locks production contact layouts by label identity (S7-07)", () => {
    const { container } = render(
      <ContactsView {...viewProps} contacts={[...contactsData]} />
    );

    const emailCell = container.querySelector("#contacts")?.querySelector(".md\\:row-span-2");
    expect(emailCell).toBeTruthy();
    expect(emailCell?.textContent).toContain("Email");

    const telegramLink = screen.getByRole("link", {
      name: "Telegram (откроется в новой вкладке)",
    });
    expect(telegramLink.className).not.toMatch(/bg-neutral-950/);

    const githubLink = screen.getByRole("link", {
      name: "GitHub (откроется в новой вкладке)",
    });
    expect(githubLink.className).toMatch(/bg-neutral-950/);
  });

  it("keeps touchAction pan-y when not drawing", () => {
    render(<ContactsView {...viewProps} isDrawing={false} />);
    expect(document.getElementById("contacts")).toHaveStyle({ touchAction: "pan-y" });
  });
});
