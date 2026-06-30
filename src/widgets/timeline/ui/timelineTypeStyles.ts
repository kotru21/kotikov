import type { TimelineItem } from "@/entities/timeline";

const eyebrowByType: Record<TimelineItem["type"], string> = {
  work: "border-l-4 border-primary-500 pl-3",
  education:
    "border-l-4 border-neutral-400 bg-neutral-100 pl-3 dark:border-neutral-500 dark:bg-neutral-800",
  hackathon:
    "border-l-4 border-primary-300 bg-primary-100 pl-3 dark:border-primary-700 dark:bg-primary-950",
  project: "border-l-4 border-neutral-400 pl-3",
};

const activeChipByType: Record<TimelineItem["type"], string> = {
  work: "bg-primary-500 text-white",
  education: "bg-neutral-200 text-text-primary dark:bg-neutral-700 dark:text-text-inverse",
  hackathon: "bg-primary-100 text-primary-950 dark:bg-primary-900 dark:text-primary-100",
  project: "bg-neutral-200 text-text-primary",
};

export function getTimelineTypeEyebrowClass(type: TimelineItem["type"]): string {
  return eyebrowByType[type];
}

export function getTimelineTypeChipClass(type: TimelineItem["type"], isActive: boolean): string {
  if (!isActive) return "";
  return activeChipByType[type];
}
