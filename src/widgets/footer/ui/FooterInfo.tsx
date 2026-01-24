import React from "react";

interface FooterInfoProps {
  title: string;
  description: string;
}

const FooterInfo: React.FC<FooterInfoProps> = ({ title, description }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-text-primary dark:text-text-primary mb-4 text-2xl font-black uppercase">
        {title}
      </h3>
      <p className="text-text-secondary text-sm leading-relaxed font-medium dark:text-gray-400">
        {description}
      </p>
    </div>
  );
};

export default FooterInfo;
