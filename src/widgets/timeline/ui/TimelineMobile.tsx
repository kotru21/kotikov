import type { TimelineItem } from "@/entities/timeline";
import { GRID_STROKE_OMIT_Y } from "@/shared/ui";

import { TimelineCarousel } from "./TimelineCarousel";

interface TimelineMobileProps {
  items: TimelineItem[];
}

/** Section divide supplies horizontal rules — sides only, so junctions do not double. */
export function TimelineMobile({ items }: TimelineMobileProps): React.JSX.Element {
  return <TimelineCarousel items={items} strokeClassName={GRID_STROKE_OMIT_Y} />;
}
