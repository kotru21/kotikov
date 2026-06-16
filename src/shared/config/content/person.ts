import { social } from "./social";

export const personData = {
  name: "Arsenij Kotikov",
  nameRu: "Арсений Котиков",
  nickname: "Kotikov",
  jobTitle: "Frontend Developer",
  description:
    "Арсений Котиков (Kotikov) — frontend разработчик, специализирующийся на создании красивых и отзывчивых пользовательских интерфейсов",
  url: "https://ktkv.me",
  sameAs: [social.github.url, social.telegram.url, social.linkedin.url],
  email: social.email.address,
  skills: [
    "Frontend Development",
    "React",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "HTML",
    "CSS",
    "Tailwind CSS",
    "UI/UX Design",
    "Responsive Web Design",
  ],
} as const;
