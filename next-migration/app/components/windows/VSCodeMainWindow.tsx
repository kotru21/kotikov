import React from "react";
import { WindowProps } from "./types";

export default function VSCodeMainWindow({
  windowId,
  position,
  isDragging,
  onMouseDown,
  onClose,
}: WindowProps) {
  return (
    <div
      className="app-window show"
      style={{
        position: "absolute",
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? "grabbing" : "default",
      }}
      onMouseDown={(e) => onMouseDown(e, windowId)}>
      <div className="app-window-header" style={{ cursor: "grab" }}>
        <i className="bx bx-code-alt"></i>VS Code
        <button
          onClick={onClose}
          style={{
            float: "right",
            background: "none",
            border: "none",
            color: "white",
            cursor: "pointer",
          }}>
          ×
        </button>
      </div>
      <div
        className="app-window-body"
        style={{
          background: "#1e1e1e",
          color: "#d4d4d4",
          fontFamily: "monospace",
        }}>
        <pre style={{ margin: 0, padding: "1rem" }}>
          {`// Добро пожаловать в мой код!
function greeting() {
  const developer = "Arsenij Kotikov";
  const skills = ["React", "Next.js", "TypeScript", "Python"];
  
  console.log(\`Привет! Я \${developer}\`);
  console.log("Мои навыки:", skills.join(", "));
}

greeting();`}
        </pre>
      </div>
    </div>
  );
}
