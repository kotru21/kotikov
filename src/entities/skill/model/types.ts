export interface SkillData {
  id: number;
  name: string;
  description: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
  category: "security" | "offensive" | "development";
}
