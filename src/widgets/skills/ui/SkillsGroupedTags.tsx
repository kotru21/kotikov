import { skillGroups } from "@/shared/config/content";
import { GRID_STROKE, GRID_SURFACE, TEAL_FILL } from "@/shared/ui";

function groupCellClassName(index: number): string {
  const fill = index === 1 ? TEAL_FILL : GRID_SURFACE;
  return `border-0 ${fill} p-5 md:p-6`;
}

const GROUP_TITLE = "mb-3 text-lg font-black uppercase";
const GROUP_ITEM = `${GRID_STROKE} px-2 py-1 text-xs font-bold`;
const GROUP_BAND = "grid border-t-2 border-[#111] md:grid-cols-3 dark:border-[#ededed]";

export default function SkillsGroupedTags(): React.JSX.Element {
  return (
    <div className={GROUP_BAND}>
      {skillGroups.map((group, index) => (
        <article key={group.title} data-nyancat-perch className={groupCellClassName(index)}>
          <h3 className={GROUP_TITLE}>{group.title}</h3>
          <ul className="flex flex-wrap gap-2">
            {group.items.map((item) => (
              <li key={item} className={GROUP_ITEM}>
                {item}
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}
