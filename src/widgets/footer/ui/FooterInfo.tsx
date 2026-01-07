import React from "react";

interface FooterInfoProps {
  title: string;
  description: string;
}

const FooterInfo: React.FC<FooterInfoProps> = ({ title, description }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-black text-text-primary dark:text-text-primary uppercase mb-4">{title}</h3>
      <p className="text-text-secondary dark:text-gray-400 text-sm leading-relaxed font-medium">{description}</p>
    </div>
  );
};

export default FooterInfo;
