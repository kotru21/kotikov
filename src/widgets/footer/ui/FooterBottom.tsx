import React from "react";
import { FaHeart } from "react-icons/fa";

interface FooterBottomProps {
  year: number;
}

const FooterBottom: React.FC<FooterBottomProps> = ({ year }) => {
  return (
    <div className="mt-8 pt-8 border-t-2 border-black dark:border-white">
      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        {/* Копирайт */}
        <div className="text-text-secondary dark:text-gray-400 text-sm font-bold">
          © {year} Kotikov.
        </div>

        {/* Дополнительная информация */}
        <div className="flex items-center space-x-4 text-text-secondary dark:text-gray-400 text-sm font-bold">
          <span className="flex items-center">
            Сделано с{" "}
            <FaHeart className="w-4 h-4 mx-1 text-primary-500 animate-pulse" /> и
            Next.js
          </span>
        </div>
      </div>
    </div>
  );
};

export default FooterBottom;
