import type { TimelineItem } from "@/entities/timeline";
import { GIANT_LABEL, GRID_SURFACE, TEAL_FILL } from "@/shared/ui";

/** Desktop: date | copy. Mobile: date above copy. Never row-span — it unstacks slides. */
export const TIMELINE_BAND_GRID =
  "grid h-full min-h-0 min-w-0 grid-rows-[auto_1fr] md:grid-rows-none md:grid-cols-[minmax(11rem,16rem)_1fr]";

interface TimelineBandItemProps {
  item: TimelineItem;
}

function TechList({ technologies }: { technologies: readonly string[] }): React.JSX.Element | null {
  if (technologies.length === 0) {
    return null;
  }

  return (
    <ul className="flex flex-wrap gap-2">
      {technologies.map((tech) => (
        <li key={tech} className="text-xs font-bold tracking-wide uppercase">
          {tech}
        </li>
      ))}
    </ul>
  );
}

function ItemCopy({ item }: { item: TimelineItem }): React.JSX.Element {
  return (
    <div className={`${GRID_SURFACE} flex h-full min-h-0 flex-col justify-center gap-3 p-6 md:p-10`}>
      <h3 className={GIANT_LABEL}>{item.title}</h3>
      <p className="font-bold">{item.company}</p>
      <p className="text-base leading-8 font-medium">{item.description}</p>
      <TechList technologies={item.technologies} />
    </div>
  );
}

export function TimelineBandItem({ item }: TimelineBandItemProps): React.JSX.Element {
  return (
    <article className={`border-0 ${TIMELINE_BAND_GRID}`}>
      <div
        className={`${TEAL_FILL} ${GIANT_LABEL} flex h-full min-h-0 items-center justify-center p-6 text-center`}
      >
        {item.period}
      </div>
      <ItemCopy item={item} />
    </article>
  );
}
