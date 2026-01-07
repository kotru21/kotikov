import React, { memo } from "react";

import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { colors } from "@/styles/colors";

import type { TimelineItem } from "../model/types";

export interface TimelineCardProps {
  item: TimelineItem;
  index: number;
}

const TimelineCardComponent: React.FC<TimelineCardProps> = ({
  item,
  index,
}) => {
  const getTypeLabel = (type: string) => {
    switch (type) {
      case "work":
        return "Работа";
      case "education":
        return "Обучение";
      case "project":
        return "Проект";
      case "hackathon":
        return "Хакатон";
      default:
        return type;
    }
  };

  return (
    <div className="relative shrink-0 group w-72 md:w-80 lg:w-96">
      {/* Decorative geometric background shape */}
      <div 
        className={`absolute -top-2 -right-2 w-full h-full border-2 border-black dark:border-white -z-10 transition-transform duration-300 group-hover:translate-x-2 group-hover:-translate-y-2 ${
           index % 3 === 0 ? 'bg-[#d12c1f]' : index % 3 === 1 ? 'bg-[#f4bf21]' : 'bg-[#1b54a7]'
        }`}>
      </div>
      
      <Card
        padding="sm"
        className="relative z-10 border-2 border-black dark:border-white bg-[#f5f5f3] dark:bg-[#111111] shadow-none h-full flex flex-col rounded-none"
        hover={false}>
        <div className="flex items-center justify-between mb-4 border-b-2 border-black dark:border-white pb-2">
          <span className="font-bold text-xs uppercase bg-black dark:bg-white text-white dark:text-black px-2 py-1">
            {getTypeLabel(item.type)}
          </span>
          <span
            className="text-xs font-bold tracking-wide text-black dark:text-white uppercase">
            {item.period}
          </span>
        </div>

        <h3
          className="text-2xl font-black mb-2 text-black dark:text-white uppercase">
          {item.title}
        </h3>

        <p className={`font-bold mb-3 border-l-4 pl-2 ${
           index % 3 === 0 ? 'border-[#d12c1f] text-[#d12c1f]' : index % 3 === 1 ? 'border-[#f4bf21] text-[#b45309] dark:text-[#f4bf21]' : 'border-[#1b54a7] text-[#1b54a7] dark:text-[#63b3ed]'
        }`}>
          {item.company}
        </p>

        <p
          className="mb-6 text-sm leading-relaxed text-black dark:text-gray-300 font-medium grow">
          {item.description}
        </p>

        <div className="flex flex-wrap gap-2 mt-auto">
          {item.technologies.map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 text-xs font-bold border border-black dark:border-white bg-white dark:bg-black text-black dark:text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors">
              {tech}
            </span>
          ))}
        </div>

        {item.type === "project" && item.githubUrl && (
          <div
            className="pt-4 mt-4 border-t-2 border-black dark:border-white"
            style={{ borderColor: colors.border.dark }}>
            <Button
              href={item.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
              size="sm"
              className="w-full">
              Подробнее
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

const TimelineCard = memo(TimelineCardComponent);
TimelineCard.displayName = "TimelineCard";

export default TimelineCard;
