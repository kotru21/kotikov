"use client";

import { headerContent, navigation } from "@/shared/config/content";

import { HeaderHero, HeaderNavigation, HeaderPaintSurface } from "./ui";

/**
 * Header composition root. Paint/paw/motion live in HeaderPaintSurface;
 * nav and hero stay separate client/presentational modules.
 */
export function HeaderWidget(): React.JSX.Element {
  return (
    <HeaderPaintSurface
      navigation={<HeaderNavigation navigation={navigation} />}
      hero={
        <HeaderHero
          eyebrow={headerContent.eyebrow}
          title={headerContent.title}
          subtitle={headerContent.subtitle}
          buttons={headerContent.buttons}
        />
      }
    />
  );
}
