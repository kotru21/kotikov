import React from "react";
import { colors } from "@/styles/colors";
import { FaHeart } from "react-icons/fa";

interface FooterBottomProps {
  year: number;
  version: string;
}

const FooterBottom: React.FC<FooterBottomProps> = ({ year, version }) => {
  return (
    <div className="mt-8 pt-8 border-t border-white/20">
      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        {/* Копирайт */}
        <div className="text-white/70 text-sm">
          © {year} Kotikov. Все права защищены.
        </div>

        {/* Дополнительная информация */}
        <div className="flex items-center space-x-4 text-white/70 text-sm">
          <span className="flex items-center">
            Сделано с{" "}
            <FaHeart className="w-4 h-4 mx-1 text-red-500 animate-pulse" /> и
            Next.js
          </span>
          <div className="flex items-center space-x-1">
            <span>Версия</span>
            <span
              className="px-2 py-1 rounded-full text-xs font-mono"
              style={{ backgroundColor: colors.primary[500] + "40" }}>
              {version}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterBottom;
