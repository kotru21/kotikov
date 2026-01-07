import type { IconType } from "react-icons";

export interface ContactInfo {
  label: string;
  value: string;
  link?: string;
  icon: IconType;
}
