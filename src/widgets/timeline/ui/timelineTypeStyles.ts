import type { TimelineItem } from "@/entities/timeline";

const eyebrowByType: Record<TimelineItem["type"], string> = {
  work: "text-primary-800 dark:text-primary-400",
  education: "text-neutral-600 dark:text-neutral-400",
  hackathon: "text-primary-700 dark:text-primary-400",
  project: "text-neutral-600 dark:text-neutral-400",
};

const activeChipByType: Record<TimelineItem["type"], string> = {
  work: "bg-primary-500 text-white",
  education: "bg-neutral-200 text-text-primary dark:bg-neutral-700 dark:text-text-inverse",
  hackathon: "bg-primary-100 text-primary-950 dark:bg-primary-900 dark:text-primary-100",
  project: "bg-neutral-200 text-text-primary",
};

const inactiveChipBorderByType: Record<TimelineItem["type"], string> = {
  work: "border-l-4 border-l-primary-500",
  education: "border-l-4 border-l-neutral-400 dark:border-l-neutral-500",
  hackathon: "border-l-4 border-l-primary-300 dark:border-l-primary-600",
  project: "border-l-4 border-l-neutral-400",
};

const cardAccentBarByType: Record<TimelineItem["type"], string> = {
  work: "bg-primary-500",
  education: "bg-neutral-400 dark:bg-neutral-500",
  hackathon: "bg-primary-300 dark:bg-primary-600",
  project: "bg-neutral-400",
};

const nodeClassByType: Record<TimelineItem["type"], string> = {
  work: "bg-primary-500",
  education: "bg-neutral-200 dark:bg-neutral-600",
  hackathon: "bg-primary-200 dark:bg-primary-800",
  project: "bg-neutral-300",
};

const surfaceClassByType: Record<TimelineItem["type"], string> = {
  work: "from-white to-primary-50/50 dark:from-black dark:to-primary-950/20",
  education: "from-white to-neutral-50 dark:from-black dark:to-neutral-950/30",
  hackathon: "from-white to-primary-50/30 dark:from-black dark:to-primary-950/15",
  project: "from-white to-neutral-50 dark:from-black dark:to-neutral-950/20",
};

export function getTimelineTypeEyebrowClass(type: TimelineItem["type"]): string {
  return eyebrowByType[type];
}

export function getTimelineTypeChipClass(type: TimelineItem["type"], isActive: boolean): string {
  if (!isActive) return "";
  return activeChipByType[type];
}

export function getTimelineTypeChipBorderClass(type: TimelineItem["type"]): string {
  return inactiveChipBorderByType[type];
}

export function getTimelineTypeAccentBarClass(type: TimelineItem["type"]): string {
  return cardAccentBarByType[type];
}

export function getTimelineTypeNodeClass(type: TimelineItem["type"]): string {
  return nodeClassByType[type];
}

export function getTimelineTypeSurfaceClass(type: TimelineItem["type"]): string {
  return surfaceClassByType[type];
}
