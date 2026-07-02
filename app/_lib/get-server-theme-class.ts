import { cookies } from "next/headers";

import { THEME_COOKIE_NAME } from "@/features/theme";

export async function getServerThemeHtmlClass(): Promise<string | undefined> {
  const cookieStore = await cookies();
  const theme = cookieStore.get(THEME_COOKIE_NAME)?.value;

  if (theme === "dark" || theme === "light") return theme;
  return undefined;
}
