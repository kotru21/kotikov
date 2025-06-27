"use client";

import React from "react";
import { colors } from "../styles/colors";
import { footerInfo, footerNavigation, footerSocial, footerConfig } from "../data/footer";
import {
  FooterInfo,
  FooterNavigation,
  FooterSocial,
  FooterBottom,
  FooterCat,
  FooterParticles,
} from "./Footer/index";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="relative py-12 px-6"
      style={{
        background: colors.background.primary,
        borderTop: `3px solid ${colors.primary[500]}`,
      }}>
      {/* Декоративные элементы */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
          {/* Левая секция - Информация */}
          <FooterInfo 
            title={footerInfo.title}
            description={footerInfo.description}
          />

          {/* Центральная секция - Быстрые ссылки */}
          <FooterNavigation
            title={footerNavigation.title}
            links={footerNavigation.links}
          />

          {/* Правая секция - Социальные сети */}
          <FooterSocial
            title={footerSocial.title}
            socialLinks={footerSocial.links}
          />
        </div>

        {/* Нижняя секция */}
        <FooterBottom
          year={currentYear}
          version={footerConfig.version}
        />

        {/* Анимированный кот внизу */}
        <FooterCat />
      </div>

      {/* Плавающие частицы для красоты */}
      <FooterParticles />
    </footer>
  );
};

export default Footer;
