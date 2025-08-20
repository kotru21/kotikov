import React from "react";

interface FooterInfoProps {
  title: string;
  description: string;
}

const FooterInfo: React.FC<FooterInfoProps> = ({ title, description }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
      <p className="text-white/80 text-sm leading-relaxed">{description}</p>
    </div>
  );
};

export default FooterInfo;
