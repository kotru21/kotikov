import Link from "next/link";
import type { CSSProperties, ReactNode, RefObject } from "react";

import type { NavigationItem } from "@/entities/navigation";
import { InteractiveElement } from "@/features/interactive-elements";
import { Logo } from "@/shared/ui";

interface NavLogoProps {
  variant: "mobile" | "pc";
  className: string;
  /** paint: allow draw; island: plain link exclude; menu: interactive exclude + close */
  mode: "paint" | "island" | "menu";
  onClick?: () => void;
  leadingAccent?: ReactNode;
}

export function NavLogo({
  variant,
  className,
  mode,
  onClick,
  leadingAccent,
}: NavLogoProps): React.JSX.Element {
  const logo = <Logo variant={variant} className="h-8 w-auto" />;
  const label = <span className="sr-only">ktkv</span>;

  if (mode === "paint") {
    return (
      <InteractiveElement
        as={Link}
        href="/"
        data-draw-allow=""
        className={className}
      >
        {label}
        {logo}
      </InteractiveElement>
    );
  }

  if (mode === "menu") {
    return (
      <InteractiveElement
        as={Link}
        href="/"
        data-draw-exclude
        onClick={onClick}
        className={className}
      >
        {leadingAccent}
        {label}
        {logo}
      </InteractiveElement>
    );
  }

  return (
    <Link href="/" data-draw-exclude className={className}>
      {label}
      {logo}
    </Link>
  );
}

interface DesktopNavLinksProps {
  navigation: readonly NavigationItem[];
  isPaintInteractive: boolean;
  linkClassName: string;
}

export function DesktopNavLinks({
  navigation,
  isPaintInteractive,
  linkClassName,
}: DesktopNavLinksProps): React.JSX.Element {
  return (
    <>
      {navigation.map((item) =>
        isPaintInteractive ? (
          <InteractiveElement
            as="a"
            key={item.name}
            href={item.href}
            data-draw-allow=""
            className={linkClassName}
          >
            {item.name}
          </InteractiveElement>
        ) : (
          <a key={item.name} href={item.href} className={linkClassName}>
            {item.name}
          </a>
        )
      )}
    </>
  );
}

interface MobileMenuLinksProps {
  navigation: readonly NavigationItem[];
  onItemClick: () => void;
  className: string;
}

export function MobileMenuLinks({
  navigation,
  onItemClick,
  className,
}: MobileMenuLinksProps): React.JSX.Element {
  return (
    <>
      {navigation.map((item) => (
        <InteractiveElement
          as="a"
          key={item.name}
          href={item.href}
          data-draw-exclude
          onClick={onItemClick}
          className={className}
        >
          {item.name}
        </InteractiveElement>
      ))}
    </>
  );
}

interface IslandShellProps {
  islandRef: RefObject<HTMLDivElement | null>;
  isIsland: boolean;
  className: string;
  style: CSSProperties;
  children: ReactNode;
}

export function IslandShell({
  islandRef,
  isIsland,
  className,
  style,
  children,
}: IslandShellProps): React.JSX.Element {
  return (
    <div
      ref={islandRef}
      className={className}
      data-island={isIsland ? "true" : "false"}
      style={style}
    >
      {children}
    </div>
  );
}
