export interface SkillData {
  id: number;
  name: string;
  description: string;
  level: number;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface TimelineItem {
  id: number;
  title: string;
  company: string;
  period: string;
  description: string;
  technologies: string[];
  type: "work" | "education" | "project";
}

export interface ContactInfo {
  label: string;
  value: string;
  link?: string;
  icon: string;
}

export interface NavigationItem {
  name: string;
  href: string;
}

// Типы для компонентов
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface SkillCardProps extends BaseComponentProps {
  skill: SkillData;
  index?: number;
}

export interface TimelineCardProps extends BaseComponentProps {
  item: TimelineItem;
  index: number;
}

export interface ContactCardProps extends BaseComponentProps {
  contact: ContactInfo;
  index: number;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}

// Утилитарные типы
export type ThemeMode = "light" | "dark" | "system";
export type AnimationSpeed = "slow" | "normal" | "fast" | "disabled";
