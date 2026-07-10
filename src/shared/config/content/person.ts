import { social } from "./social";

export const personData = {
  name: "Arsenij Kotikov",
  nameRu: "Арсений Котиков",
  nickname: "Kotikov",
  jobTitle: "SOC / AppSec",
  description:
    "Арсений Котиков (Kotikov) — студент информационной безопасности, Intern SOC и практик AppSec: DFIR, SAST и разбор уязвимостей приложений",
  url: "https://ktkv.me",
  sameAs: [social.github.url, social.telegram.url, social.linkedin.url],
  email: social.email.address,
  skills: [
    "SOC",
    "AppSec",
    "Incident Response",
    "Digital Forensics",
    "SAST",
    "OWASP Top 10",
    "Python",
    "TypeScript",
    "React",
    "FastAPI",
  ],
} as const;
