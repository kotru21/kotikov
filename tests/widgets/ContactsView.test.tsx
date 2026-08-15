import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";

import type { ContactInfo } from "@/entities/contact";
import { InteractiveTextContext } from "@/features/interactive-elements/client";
import { contactsData, sectionTitles } from "@/shared/config/content";
import { TEAL_FILL } from "@/shared/ui";
import { type ContactCanvasRef, ContactsBand, ContactsView } from "@/widgets/contacts/ui";

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
} satisfies Omit<React.ComponentProps<typeof ContactsView>, "children">;

function renderContacts(
  overrides: Partial<Omit<React.ComponentProps<typeof ContactsView>, "children">> = {},
  contactList: readonly ContactInfo[] = contacts
) {
  return render(
    <ContactsView {...viewProps} {...overrides}>
      <ContactsBand contacts={contactList} />
    </ContactsView>
  );
}

function requireContactsSection(): HTMLElement {
  const section = document.getElementById("contacts");
  if (section === null) {
    throw new Error("Expected #contacts to be rendered");
  }
  return section;
}

describe("ContactsView", () => {
  it("opens case-insensitive HTTP links in a new tab", () => {
    renderContacts();

    const httpsLink = screen.getByRole("link", {
      name: /HTTPS.*secure\.example.*откроется в новой вкладке/,
    });
    const httpLink = screen.getByRole("link", {
      name: /HTTP.*uppercase\.example.*откроется в новой вкладке/,
    });

    expect(httpsLink).toHaveAttribute("target", "_blank");
    expect(httpsLink).toHaveAttribute("rel", "noopener noreferrer");
    expect(httpLink).toHaveAttribute("target", "_blank");
    expect(httpLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("keeps mailto in-context and drops unsupported protocol hrefs", () => {
    const { container } = renderContacts();

    const emailLink = screen.getByRole("link", { name: /Email.*test@example\.com/ });

    expect(emailLink).not.toHaveAttribute("target");
    expect(emailLink).not.toHaveAttribute("rel");
    expect(container.querySelector('a[href="httpx://invalid.example"]')).toBeNull();
  });

  it("does not hide the system cursor while paint drawing is active", () => {
    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    renderContacts({ isDrawing: true, mountPaint: true, enablePaint: true });

    expect(document.getElementById("contacts")).toHaveStyle({ touchAction: "none" });
    expect(document.getElementById("contacts")).not.toHaveStyle({ cursor: "none" });
  });

  it("renders three editorial cells from contactsData without a form", () => {
    const { container } = renderContacts({}, [...contactsData]);
    const section = requireContactsSection();
    const heading = screen.getByRole("heading", {
      level: 2,
      name: sectionTitles.contacts,
    });

    expect(section).not.toHaveClass("border-2");
    expect(section).toHaveClass("min-h-[20rem]");
    expect(section.querySelector(".max-w-6xl")).toBeNull();
    expect(heading).toHaveAttribute("id", "contacts-heading");
    expect(heading).toHaveClass("sr-only", "md:not-sr-only");
    expect(heading).not.toHaveClass("border-2");
    expect(heading).not.toHaveClass("bg-[#111]", "text-[#f5f5f3]", "bg-primary-500");
    const cellGrid = heading.nextElementSibling;
    expect(cellGrid).toHaveClass("divide-y-2", "md:divide-x-2", "md:border-t-2");
    expect(cellGrid).not.toHaveClass("border-2");
    expect(heading.className).not.toMatch(/dark:bg-\[#ededed\]/);
    expect(container.querySelector("form, input, textarea")).toBeNull();

    const email = screen.getByRole("link", { name: /Email.*inbox@ktkv\.me/ });
    expect(email).toHaveAttribute("href", "mailto:inbox@ktkv.me");
    expect(email.className).toContain(TEAL_FILL);
    expect(email).toHaveClass(
      "relative",
      "z-10",
      "focus-visible:ring-2",
      "focus-visible:ring-inset",
      "focus-visible:ring-[#111]"
    );

    const telegram = screen.getByRole("link", {
      name: /Telegram.*откроется в новой вкладке/,
    });
    expect(telegram.className).toMatch(/bg-\[#f5f5f3\]/);
    expect(telegram.className).not.toContain(TEAL_FILL);
    expect(telegram).toHaveClass("relative", "z-10", "hover:bg-primary-500", "hover:text-[#111]");

    const github = screen.getByRole("link", {
      name: /GitHub.*откроется в новой вкладке/,
    });
    expect(github.className).toMatch(/bg-\[#111\]/);
    expect(github.className).toMatch(/text-\[#f5f5f3\]/);
    expect(github).toHaveClass(
      "relative",
      "z-10",
      "hover:bg-primary-500",
      "hover:text-[#111]",
      "focus-visible:ring-[#ededed]"
    );
  });

  it("registers the heading with InteractiveText for paint contrast", () => {
    const registry = { register: vi.fn(), unregister: vi.fn() };
    render(
      <InteractiveTextContext value={registry}>
    render(
      <InteractiveTextContext value={registry}>
        <ContactsView {...viewProps}>
          <ContactsBand contacts={[...contactsData]} />
        </ContactsView>
      </InteractiveTextContext>
    );
      </InteractiveTextContext>
    );

    const heading = screen.getByRole("heading", {
      level: 2,
      name: sectionTitles.contacts,
    });
    expect(heading.querySelector(".sr-only")).toHaveTextContent(sectionTitles.contacts);
    expect(heading.querySelector("[aria-hidden='true']")).not.toBeNull();
  });

  it("keeps the paw canvas behind the heading cell and contact links", () => {
    const { container } = renderContacts({ mountPaint: true }, [...contactsData]);
    const section = requireContactsSection();
    const canvas = container.querySelector("canvas");
    const heading = screen.getByRole("heading", {
      level: 2,
      name: sectionTitles.contacts,
    });
    const email = screen.getByRole("link", { name: /Email.*inbox@ktkv\.me/ });

    expect(canvas).not.toBeNull();
    if (canvas === null) {
      throw new Error("Expected contact canvas");
    }
    expect(section.contains(canvas)).toBe(true);
    expect(heading.compareDocumentPosition(canvas) & Node.DOCUMENT_POSITION_PRECEDING).toBe(
      Node.DOCUMENT_POSITION_PRECEDING
    );
    expect(email.compareDocumentPosition(canvas) & Node.DOCUMENT_POSITION_PRECEDING).toBe(
      Node.DOCUMENT_POSITION_PRECEDING
    );
    expect(heading).not.toHaveClass("bg-[#111]", "bg-primary-500");
    expect(email).toHaveClass("relative", "z-10");
    expect(canvas).toHaveClass("absolute", "inset-0", "z-0");
    expect(canvas).toHaveAttribute("aria-hidden", "true");
    expect(section).toHaveClass("min-h-[20rem]");
    expect(heading.parentElement).toHaveClass("relative", "z-10", "min-h-[20rem]");
    const paintWell = heading.parentElement?.querySelector("[data-contacts-paint-well]");
    expect(paintWell).toHaveClass("min-h-[12rem]", "flex-1");
    expect(paintWell).not.toHaveClass("md:hidden");
    const clear = screen.getByRole("button", { name: "Очистить рисунок" });
    expect(clear.parentElement).toHaveClass("absolute", "z-10", "md:static", "md:flex");
    expect(clear.parentElement).not.toHaveClass("p-4");
    expect(clear.parentElement?.className).toMatch(/md:p-4/);
    expect(heading.nextElementSibling?.contains(email)).toBe(true);
    if (!(paintWell instanceof HTMLElement)) {
      throw new Error("Expected contacts paint well");
    }
    expect(paintWell.compareDocumentPosition(email) & Node.DOCUMENT_POSITION_PRECEDING).toBe(
      Node.DOCUMENT_POSITION_PRECEDING
    );
  });

  it("keeps touchAction pan-y when not drawing", () => {
    renderContacts({ isDrawing: false });
    expect(document.getElementById("contacts")).toHaveStyle({ touchAction: "pan-y" });
  });

  it("keeps paint chrome mounted when paint is inactive to avoid layout thrash", () => {
    const { rerender } = renderContacts({ mountPaint: true, enablePaint: false });

    expect(screen.queryByText(/проведи мышью|проведи пальцем|след лапы/i)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Очистить рисунок" })).toBeDisabled();

    rerender(
      <ContactsView {...viewProps} mountPaint enablePaint>
        <ContactsBand contacts={contacts} />
      </ContactsView>
    );
    expect(screen.queryByText(/проведи мышью|проведи пальцем|след лапы/i)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Очистить рисунок" })).toBeEnabled();
  });

  it("overlays the clear control on the paint well below the contact cells", () => {
    renderContacts({ mountPaint: true }, [...contactsData]);
    const section = requireContactsSection();
    const heading = screen.getByRole("heading", {
      level: 2,
      name: sectionTitles.contacts,
    });
    const clear = screen.getByRole("button", { name: "Очистить рисунок" });
    const chrome = clear.parentElement;
    const well = section.querySelector("[data-contacts-paint-well]");
    const stack = heading.parentElement;

    expect(section).toHaveClass("relative", "min-h-[20rem]");
    expect(section.querySelector(":scope > div")).toHaveClass("relative", "min-h-[20rem]");
    expect(stack).toHaveClass("flex", "min-h-[20rem]", "flex-col", "md:block");
    expect(heading.nextElementSibling).toHaveClass("divide-y-2", "md:grid-cols-3");
    expect(well).toHaveClass("min-h-[12rem]", "flex-1", "relative");
    expect(well?.previousElementSibling).toHaveClass("divide-y-2");
    expect(chrome).toHaveClass("absolute", "top-3", "right-3", "z-10");
    expect(chrome).toHaveClass("md:static", "md:flex");
    expect(chrome?.className.split(/\s+/)).not.toContain("flex");
    expect(chrome).not.toHaveClass("p-4");
    expect(chrome).not.toHaveClass("hidden");
    expect(well?.contains(clear)).toBe(true);
  });
});
