"use client";

import React from "react";
import { colors } from "@/styles/colors";
import { navigation } from "@/entities/navigation/data";
import { headerContent } from "@/entities/header/data";
import {
  HeaderNyancat,
  HeaderNavigation,
  HeaderBackground,
  HeaderHero,
} from "./ui";

const HeaderWidget: React.FC = () => {
  return (
    <div
      id="header"
      style={{
        backgroundColor: colors.background.primary,
        position: "relative",
        overflow: "hidden",
      }}>
      {/* Анимированный Nyancat */}
      <HeaderNyancat />

      {/* Навигация */}
      <HeaderNavigation navigation={navigation} />

      <div className="relative isolate px-6 pt-14 lg:px-8">
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
