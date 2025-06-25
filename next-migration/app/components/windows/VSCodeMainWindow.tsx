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
      className={`app-window show ${isDragging ? 'dragging' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      onMouseDown={(e) => onMouseDown(e, windowId)}>
      <div className="app-window-header">
        <i className="bx bx-code-alt"></i>VS Code
        <button
          onClick={onClose}
          className="app-window-close-button">
          ×
        </button>
      </div>
      <div className="app-window-body vscode-main-window-body">
        <pre className="vscode-main-window-pre">
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
