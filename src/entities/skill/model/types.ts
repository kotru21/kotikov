export interface SkillData {
  id: number;
  name: string;
  description: string;
  level: number;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}
