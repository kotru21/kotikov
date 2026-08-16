import { contactsData } from "@/shared/config/content";

import { ContactsBand } from "./ui/ContactsBand";
import { ContactsPaintSurface } from "./ui/ContactsPaintSurface";

/** Contacts section composition root (Server Component). Paint lives in ContactsPaintSurface. */
export default function ContactsWidget(): React.JSX.Element {
  return (
    <ContactsPaintSurface>
      <ContactsBand contacts={contactsData} />
    </ContactsPaintSurface>
  );
}
