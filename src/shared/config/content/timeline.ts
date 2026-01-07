export const timelineData = [
  {
    id: 1,
    title: "ByChange Hackathon",
    company: "ByCahnge",
    period: "2023",
    description:
      "Создание фулстек приложения для мониторинга здоровья. Реализация взаимодействия с API, разработка пользовательского интерфейса и интеграция с бэкендом.",
    technologies: ["React", "API", "Node.js"],
    type: "hackathon" as const,
  },
  {
    id: 2,
    title: "Высшее образование",
    company: "БГУИР",
    period: "2024 - тудэй",
    description: "Обучение на факультете информационной безопасности.",
    technologies: ["InfoSec", "Cryptography"],
    type: "education" as const,
  },
  {
    id: 3,
    title: "Web Messenger",
    company: "Личный проект",
    period: "2024",
    description:
      "Создание веб-мессенджера с использованием React и Node.js. Реализация функционала чата, авторизации и управления пользователями.",
    technologies: [
      "JavaScript",
      "Tailwind",
      "Node.js",
      "Socket.IO",
      "MongoDB",
      "Express",
      "JWT",
    ],
    type: "project" as const,
    githubUrl: "https://github.com/kotru21/webchat",
  },
  {
    id: 4,
    title: "Trainee Frontend Developer",
    company: "Innowise",
    period: "май 2025 - тудэй",
    description:
      "Разработка современных веб-приложений с использованием React и TypeScript. Стажировка.",
    technologies: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Jest"],
    type: "work" as const,
  },
  {
    id: 5,
    title: "Tiktok Analyzer",
    company: "Личный проект",
    period: "2025",
    description:
      "Анализатор TikTok аккаунтов с использованием Dynamic HTML и Node.js. Анализ чатов и статистика по ним",
    technologies: ["HTML", "CSS", "JavaScript", "React", "Git"],
    type: "project" as const,
    githubUrl: "https://github.com/kotru21/tiktok-chats-visualizer",
  },
];
