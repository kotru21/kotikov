import type { CSSProperties } from "react";

import { KMark } from "@/shared/ui/KMark";

interface GridErrorMarkProps {
  code: "404" | "error";
}

const MARK_WRAP: CSSProperties = {
  display: "flex",
  justifyContent: "center",
  width: "100%",
  marginBottom: "2rem",
};

const MARK_BOX: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "1.5rem",
  width: "fit-content",
  maxWidth: "100%",
  minWidth: 0,
  boxSizing: "border-box",
  padding: "2rem",
  backgroundColor: "#00ffb9",
  color: "#111",
  border: "2px solid #111",
};

const CODE_STYLE: CSSProperties = {
  margin: 0,
  fontWeight: 900,
  textTransform: "uppercase",
  letterSpacing: "-0.05em",
  fontSize: "clamp(2.5rem, 10vw, 4.5rem)",
  lineHeight: 1,
  maxWidth: "100%",
  whiteSpace: "nowrap",
};

const MARK_GLYPH: CSSProperties = {
  height: "2.5rem",
  width: "2.5rem",
  color: "#111",
  flexShrink: 0,
};

export function GridErrorMark({ code }: GridErrorMarkProps): React.JSX.Element {
  return (
    <div style={MARK_WRAP}>
      <div style={MARK_BOX}>
        <p aria-hidden="true" style={CODE_STYLE}>
          {code}
        </p>
        <KMark style={MARK_GLYPH} />
      </div>
    </div>
  );
}
