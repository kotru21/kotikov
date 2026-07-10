import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";

import type { ContactInfo } from "@/entities/contact";
import { type ContactCanvasRef, ContactsView } from "@/widgets/contacts/ui";

function DummyIcon(): React.JSX.Element {
  return <svg />;
}

const contacts: ContactInfo[] = [
  { label: "HTTPS", value: "secure.example", link: "https://secure.example", icon: DummyIcon },
  { label: "HTTP", value: "uppercase.example", link: "HTTP://uppercase.example", icon: DummyIcon },
  { label: "Email", value: "test@example.com", link: "mailto:test@example.com", icon: DummyIcon },
  { label: "HTTPX", value: "invalid.example", link: "httpx://invalid.example", icon: DummyIcon },
];

const inertPointerHandler = vi.fn();
const viewProps = {
  contacts,
  pawPos: { x: 0, y: 0 },
  pawVelocity: { x: 0, y: 0 },
  isDrawing: false,
  showPaw: false,
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
});
