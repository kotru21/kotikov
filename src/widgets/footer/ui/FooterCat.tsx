import React from "react";
import { FaCat } from "react-icons/fa";

const FooterCat: React.FC = () => {
  return (
    <div className="mt-6 flex justify-center">
      <div className="relative group cursor-pointer">
        <div className="text-2xl animate-bounce">
          <FaCat className="w-6 h-6 text-white" />
        </div>
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          Мяу! 🐾
        </div>
      </div>
    </div>
  );
};

export default FooterCat;
