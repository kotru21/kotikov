import type { MetadataRoute } from "next";

import { personData } from "@/shared/config/content";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${personData.name} — SOC / AppSec`,
    short_name: personData.nickname,
    description: personData.description,
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
