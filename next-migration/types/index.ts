// Типы для компонентов
export interface WindowProps {
  title: string;
  children: React.ReactNode;
  isMinimized?: boolean;
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  className?: string;
}

export interface SocialLink {
  icon: string;
  url: string;
  label: string;
}

export interface TechStackItem {
  name: string;
  icon?: string;
  description?: string;
  level?: "beginner" | "intermediate" | "advanced" | "expert";
}

export interface Theme {
  name: "light" | "dark";
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    accent: string;
  };
}

// Пропсы для главных секций
export interface AboutMeProps {
  className?: string;
}

export interface CodeStackProps {
  technologies: TechStackItem[];
  className?: string;
}

export interface InterestsProps {
  className?: string;
}

// Контекст темы
export interface ThemeContextType {
  theme: Theme["name"];
  toggleTheme: () => void;
  isDark: boolean;
}

// Глобальные расширения типов
declare global {
  interface Window {
    Prism?: {
      highlightAll(): void;
      highlightElement(element: Element): void;
    };
  }
}
