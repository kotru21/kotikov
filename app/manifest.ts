import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kotikov - Frontend Developer",
    short_name: "Kotikov",
    description:
      "Frontend разработчик, специализирующийся на создании красивых и отзывчивых пользовательских интерфейсов",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#00ffb9",
    icons: [
      {
        src: "/logo_mobile.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/logo_mobile.svg",
        sizes: "192x192",
        type: "image/svg+xml",
      },
      {
        src: "/logo_pc.svg",
        sizes: "512x512",
        type: "image/svg+xml",
      },
    ],
  };
}
