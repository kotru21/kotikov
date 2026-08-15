import type { TimelineItem } from "@/entities/timeline";
import { GIANT_LABEL, GRID_STROKE, GRID_SURFACE, TEAL_FILL } from "@/shared/ui";

interface TimelineBandItemProps {
  item: TimelineItem;
  strokeClassName?: string;
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
    <div className={`${GRID_SURFACE} flex flex-col justify-center gap-3 p-6 md:p-10`}>
      <h3 className={GIANT_LABEL}>{item.title}</h3>
      <p className="font-bold">{item.company}</p>
      <p className="text-base leading-8 font-medium">{item.description}</p>
      <TechList technologies={item.technologies} />
    </div>
  );
}

export function TimelineBandItem({
  item,
  strokeClassName = GRID_STROKE,
}: TimelineBandItemProps): React.JSX.Element {
  return (
    <article className={`${strokeClassName} grid md:grid-cols-[minmax(11rem,16rem)_1fr]`}>
      <div
        className={`${TEAL_FILL} ${GIANT_LABEL} flex items-center justify-center p-6 text-center`}
      >
        {item.period}
      </div>
      <ItemCopy item={item} />
    </article>
  );
}
