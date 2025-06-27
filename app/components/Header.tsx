"use client";

import React from "react";
import { colors } from "../styles/colors";
import { navigation } from "../data/navigation";
import { headerContent } from "../data/header";
import {
  HeaderNyancat,
  HeaderNavigation,
  HeaderBackground,
  HeaderHero,
} from "./Header/index";

const Header: React.FC = () => {
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

export default Header;
