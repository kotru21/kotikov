import { SkillData } from "../types";
import { colors } from "../styles/colors";
import { FaReact, FaNodeJs, FaGitAlt, FaCss3Alt } from "react-icons/fa";
import {
  SiTypescript,
  SiNextdotjs,
  SiExpress,
  SiMongodb,
} from "react-icons/si";

export const skillsData: SkillData[] = [
  {
    id: 1,
    name: "React",
    description: "Создание современных интерактивных интерфейсов",
    icon: FaReact,
    level: 40,
    color: colors.accent.blue[500],
  },
  {
    id: 2,
    name: "TypeScript",
    description: "Типизированный JavaScript для больших приложений",
    icon: SiTypescript,
    level: 25,
    color: colors.accent.blue[600],
  },
  {
    id: 3,
    name: "Next.js",
    description: "Full-stack React фреймворк с SSR",
    icon: SiNextdotjs,
    level: 40,
    color: colors.neutral[800],
  },
  {
    id: 4,
    name: "Node.js",
    description: "Серверная разработка на JavaScript",
    icon: FaNodeJs,
    level: 55,
    color: colors.semantic.success.DEFAULT,
  },
  {
    id: 5,
    name: "CSS/Tailwind",
    description: "Стилизация и адаптивная верстка",
    icon: FaCss3Alt,
    level: 65,
    color: colors.accent.purple[500],
  },
  {
    id: 6,
    name: "Git",
    description: "Контроль версий и командная разработка",
    icon: FaGitAlt,
    level: 60,
    color: colors.semantic.warning.DEFAULT,
  },
  {
    id: 7,
    name: "Express.js",
    description: "Серверный фреймворк для Node.js",
    icon: SiExpress,
    level: 30,
    color: colors.semantic.warning.DEFAULT,
  },
  {
    id: 8,
    name: "MongoDB",
    description: "Документо-ориентированная NoSQL база данных",
    icon: SiMongodb,
    level: 20,
    color: colors.semantic.success.DEFAULT,
  },
];
