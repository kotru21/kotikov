import type { MetadataRoute } from "next";

import { THEME_SURFACE } from "@/features/theme";
import { personData } from "@/shared/config/content";
import { colors } from "@/styles/colors";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${personData.name} — SOC / AppSec`,
    short_name: personData.nickname,
    description: personData.description,
    start_url: "/",
    display: "standalone",
    background_color: THEME_SURFACE.light.background,
    theme_color: colors.primary[500],
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
