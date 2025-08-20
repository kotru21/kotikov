export interface TimelineItem {
  id: number;
  title: string;
  company: string;
  period: string;
  description: string;
  technologies: string[];
  type: "work" | "education" | "project" | "hackathon";
  githubUrl?: string;
}
