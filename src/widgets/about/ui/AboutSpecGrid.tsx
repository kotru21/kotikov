import { aboutContent } from "@/shared/config/content";
import { GRID_SURFACE, TEAL_FILL } from "@/shared/ui";

function specCellClassName(index: number): string {
  const fill = index % 2 === 0 ? TEAL_FILL : GRID_SURFACE;
  return `border-0 ${fill} flex h-full min-h-0 min-w-0 flex-col justify-center gap-1 p-4 md:p-6`;
}

export function AboutSpecGrid(): React.JSX.Element {
  return (
    <div className="h-full min-h-0 min-w-0">
      <div className="grid h-full min-h-0 min-w-0 grid-cols-2 grid-rows-3">
        {aboutContent.spec.fields.map((field, index) => (
          <div key={field.key} className={specCellClassName(index)}>
            <p className="min-w-0 font-mono text-xs font-bold tracking-[0.18em] break-words uppercase">
              {field.key}
            </p>
            <p className="min-w-0 text-base font-medium break-words">{field.value}</p>
          </div>
        ))}
      </div>
      <p className="sr-only">Принципы: {aboutContent.principles.join(". ")}</p>
    </div>
  );
}
