import type { TimelineItem } from "@/entities/timeline";
import { GRID_RULE_TOP } from "@/shared/ui";

import { TimelineCarousel } from "./TimelineCarousel";

interface TimelineDesktopProps {
  items: TimelineItem[];
}

/** Heading is visible above the band — keep the top rule, drop the extra bottom. */
export function TimelineDesktop({ items }: TimelineDesktopProps): React.JSX.Element {
  return <TimelineCarousel items={items} strokeClassName={GRID_RULE_TOP} />;
}
