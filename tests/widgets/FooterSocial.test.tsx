import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { SocialLink } from "@/entities/navigation";
import { FooterSocial } from "@/widgets/footer/ui";

function DummyIcon({ className }: { className?: string }): React.JSX.Element {
  return <svg className={className} />;
}

const socialLinks: SocialLink[] = [
  { name: "GitHub", url: "http://example.com/github", icon: DummyIcon },
  { name: "LinkedIn", url: "HTTPS://example.com/linkedin", icon: DummyIcon },
  { name: "Email", url: "mailto:test@example.com", icon: DummyIcon },
  { name: "HTTPX", url: "httpx://example.com", icon: DummyIcon },
];

describe("FooterSocial", () => {
  it("opens only HTTP links in a new tab", () => {
    render(<FooterSocial title="Соцсети" socialLinks={socialLinks} />);

    const httpLink = screen.getByRole("link", {
      name: "GitHub (откроется в новой вкладке)",
    });
    const httpsLink = screen.getByRole("link", {
      name: "LinkedIn (откроется в новой вкладке)",
    });

    expect(httpLink).toHaveAttribute("target", "_blank");
    expect(httpLink).toHaveAttribute("rel", "noopener noreferrer");
    expect(httpsLink).toHaveAttribute("target", "_blank");
    expect(httpsLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("keeps mailto and unsupported protocols in the current context", () => {
    render(<FooterSocial title="Соцсети" socialLinks={socialLinks} />);

    const emailLink = screen.getByRole("link", {
      name: "Написать по электронной почте",
    });
    const httpxLink = screen.getByRole("link", { name: "HTTPX" });

    expect(emailLink).not.toHaveAttribute("target");
    expect(emailLink).not.toHaveAttribute("rel");
    expect(httpxLink).not.toHaveAttribute("target");
    expect(httpxLink).not.toHaveAttribute("rel");
    expect(httpxLink).not.toHaveAccessibleName(/откроется в новой вкладке/i);
  });
});
