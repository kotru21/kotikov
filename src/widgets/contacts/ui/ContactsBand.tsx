import { InteractiveText } from "@/features/interactive-elements/client";
import { type ContactInfo, type ContactLayout, sectionTitles } from "@/shared/config/content";
import { isHttpUrl, isSafeHref } from "@/shared/lib";
import { CELL_HOVER, GIANT_LABEL, TEAL_FILL } from "@/shared/ui";

const FOCUS_RING =
  "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#111] dark:focus-visible:ring-[#ededed]";
const FOCUS_RING_ON_INK =
  "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#ededed]";
const CELL_BASE = `border-0 relative z-10 flex min-h-40 flex-col justify-center gap-3 p-6 md:p-10 ${CELL_HOVER}`;
const PAPER_CELL = "bg-[#f5f5f3] text-[#111] dark:bg-[#0a0a0a] dark:text-[#f5f5f3]";
const GITHUB_CELL = "bg-[#111] text-[#f5f5f3]";

function surfaceClass(layout: ContactLayout): string {
  if (layout === "hero") return TEAL_FILL;
  if (layout === "secondary-dark") return GITHUB_CELL;
  return PAPER_CELL;
}

function focusRingClass(layout: ContactLayout): string {
  return layout === "secondary-dark" ? FOCUS_RING_ON_INK : FOCUS_RING;
}

function safeContactHref(contact: ContactInfo): string | undefined {
  if (contact.link === undefined || !isSafeHref(contact.link)) return undefined;
  return contact.link;
}

function ContactCellBody({ contact }: { contact: ContactInfo }): React.JSX.Element {
  const Icon = contact.icon;
  return (
    <>
      <Icon className="size-8 shrink-0" aria-hidden />
      <p className={GIANT_LABEL}>{contact.label}</p>
      <p className="font-mono text-sm font-bold">{contact.value}</p>
    </>
  );
}

function ContactCell({ contact }: { contact: ContactInfo }): React.JSX.Element {
  const className = `${CELL_BASE} ${surfaceClass(contact.layout)} ${focusRingClass(contact.layout)}`;
  const href = safeContactHref(contact);
  const body = <ContactCellBody contact={contact} />;
  if (href === undefined) {
    return <div className={className}>{body}</div>;
  }
  const opensNewTab = isHttpUrl(href);
  return (
    <a
      href={href}
      className={className}
      target={opensNewTab ? "_blank" : undefined}
      rel={opensNewTab ? "noopener noreferrer" : undefined}
    >
      {body}
      {opensNewTab ? <span className="sr-only"> (откроется в новой вкладке)</span> : null}
    </a>
  );
}

interface ContactsBandProps {
  contacts: readonly ContactInfo[];
}

export function ContactsBand({ contacts }: ContactsBandProps): React.JSX.Element {
  return (
    <>
      <h2 id="contacts-heading" className={`${GIANT_LABEL} p-6 md:p-10`}>
        <InteractiveText contrast="solid" text={sectionTitles.contacts} />
      </h2>
      <div className="grid divide-y-2 divide-[#111] border-[#111] md:grid-cols-4 md:divide-x-2 md:divide-y-0 md:border-t-2 dark:divide-[#ededed] dark:border-[#ededed]">
        {contacts.map((contact) => (
          <ContactCell key={contact.label} contact={contact} />
        ))}
      </div>
    </>
  );
}
