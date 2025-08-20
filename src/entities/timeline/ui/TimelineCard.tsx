import React, { memo } from "react";
import { type TimelineItem } from "@/entities/timeline/model/types";
import { colors, withOpacity } from "@/styles/colors";
import { Card, Badge, Button } from "@/shared";

export interface TimelineCardProps {
  item: TimelineItem;
  index: number;
}

const TimelineCardComponent: React.FC<TimelineCardProps> = ({
  item,
  index,
}) => {
  const getTypeVariant = (type: string) => {
    switch (type) {
      case "work":
        return "primary" as const;
      case "education":
        return "info" as const;
      case "project":
        return "success" as const;
      case "hackathon":
        return "warning" as const;
      default:
        return "secondary" as const;
    }
  };

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
    <div className="relative flex-shrink-0 w-80">
      <Card
        className={`${
          index % 2 === 0 ? "mb-16" : "mt-16"
        } relative z-10 border`}
        style={{
          backgroundColor: withOpacity(colors.background.tertiary, 0.75),
          borderColor: colors.border.dark,
          backdropFilter: "blur(10px)",
        }}
        hover>
        <div className="flex items-center justify-between mb-3">
          <Badge variant={getTypeVariant(item.type)} size="sm">
            {getTypeLabel(item.type)}
          </Badge>
          <span
            className="text-sm font-medium"
            style={{ color: colors.text.tertiary }}>
            {item.period}
          </span>
        </div>

        <h3
          className="text-xl font-bold mb-1"
          style={{ color: colors.text.primary }}>
          {item.title}
        </h3>

        <p className="font-semibold mb-3" style={{ color: colors.text.accent }}>
          {item.company}
        </p>

        <p
          className="mb-4 text-sm leading-relaxed"
          style={{ color: colors.text.tertiary }}>
          {item.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {item.technologies.map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 rounded-md text-xs font-medium"
              style={{
                backgroundColor: colors.background.gray,
                color: colors.text.inverse,
              }}>
              {tech}
            </span>
          ))}
        </div>

        {item.type === "project" && item.githubUrl && (
          <div
            className="pt-2 border-t"
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
