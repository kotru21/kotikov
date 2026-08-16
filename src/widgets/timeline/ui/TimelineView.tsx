import { timelineData } from "@/shared/config/content";

import { TimelineCarousel } from "./TimelineCarousel";
import { sortTimelineItems } from "./timelineUtils";

/** Experience carousel island. Section chrome lives in TimelineWidget (RSC). */
export default function TimelineView(): React.JSX.Element {
  return <TimelineCarousel items={sortTimelineItems(timelineData)} />;
}
