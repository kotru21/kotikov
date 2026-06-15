export interface SkillData {
  id: number;
  name: string;
  description: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
  category: "frontend" | "backend" | "tools";
}
