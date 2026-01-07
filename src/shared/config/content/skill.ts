import { FaCss3Alt, FaGitAlt, FaNodeJs, FaReact } from "react-icons/fa";
import { SiExpress, SiMongodb, SiNextdotjs, SiTypescript } from "react-icons/si";

import { colors } from "@/styles/colors";

export const skillsData = [
  {
    id: 1,
    name: "React",
    description: "Создание современных интерактивных интерфейсов",
    icon: FaReact,
    level: 70,
    color: colors.accent[600],
  },
  {
    id: 2,
    name: "TypeScript",
    description: "Типизированный JavaScript для больших приложений",
    icon: SiTypescript,
    level: 55,
    color: colors.accent[700],
  },
  {
    id: 3,
    name: "Next.js",
    description: "Full-stack React фреймворк с SSR",
    icon: SiNextdotjs,
    level: 60,
    color: colors.accent[800],
  },
  {
    id: 4,
    name: "Node.js",
    description: "Серверная разработка на JavaScript",
    icon: FaNodeJs,
    level: 65,
    color: colors.semantic.success.DEFAULT,
  },
  {
    id: 5,
    name: "CSS/Tailwind",
    description: "Стилизация и адаптивная верстка",
    icon: FaCss3Alt,
    level: 85,
    color: colors.accent[500],
  },
  {
    id: 6,
    name: "Git",
    description: "Контроль версий и командная разработка",
    icon: FaGitAlt,
    level: 70,
    color: colors.semantic.warning.DEFAULT,
  },
  {
    id: 7,
    name: "Express.js",
    description: "Серверный фреймворк для Node.js",
    icon: SiExpress,
    level: 50,
    color: colors.semantic.warning.DEFAULT,
  },
  {
    id: 8,
    name: "MongoDB",
    description: "Документо-ориентированная NoSQL база данных",
    icon: SiMongodb,
    level: 30,
    color: colors.semantic.success.DEFAULT,
  },
];
