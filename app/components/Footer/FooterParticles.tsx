import React from "react";

const FooterParticles: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-10 left-10 w-2 h-2 bg-white/20 rounded-full animate-pulse"></div>
      <div
        className="absolute top-20 right-20 w-1 h-1 bg-white/30 rounded-full animate-ping"
        style={{ animationDelay: "1s" }}></div>
      <div
        className="absolute bottom-20 left-1/4 w-1.5 h-1.5 bg-white/20 rounded-full animate-pulse"
        style={{ animationDelay: "2s" }}></div>
      <div
        className="absolute bottom-10 right-1/3 w-1 h-1 bg-white/30 rounded-full animate-ping"
        style={{ animationDelay: "3s" }}></div>
    </div>
  );
};

export default FooterParticles;
