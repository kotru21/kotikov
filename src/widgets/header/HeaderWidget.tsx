import React from "react";

import { headerContent, navigation } from "@/shared/config/content";

import {
  HeaderBackground,
  HeaderHero,
  HeaderNavigation,
  HeaderNyancat,
} from "./ui";

const HeaderWidget: React.FC = () => {
  return (
    <div
      id="header"
      className="bg-background-primary dark:bg-background-tertiary relative overflow-hidden transition-colors duration-300 min-h-screen flex flex-col">
      {/* Анимированный Nyancat */}
      <HeaderNyancat />

      {/* Навигация */}
      <HeaderNavigation navigation={navigation} />

      <div className="relative isolate px-6 pt-24 lg:px-8 grow flex items-center justify-center">
        {/* Фоновые градиенты */}
        <HeaderBackground />

        {/* Основной контент */}
        <HeaderHero
          title={headerContent.title}
          subtitle={headerContent.subtitle}
          announcement={headerContent.announcement}
          buttons={headerContent.buttons}
        />
      </div>
    </div>
  );
};

export default HeaderWidget;
