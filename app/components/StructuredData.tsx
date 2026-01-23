import type { JSX } from "react";

/* eslint-disable react/no-danger -- Script tags intentionally use dangerouslySetInnerHTML for JSON-LD */
import { personData } from "@/shared/config/content";

export default function StructuredData(): JSX.Element {
  const personStructuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: personData.name,
    jobTitle: personData.jobTitle,
    description: personData.description,
    url: personData.url,
    image: "https://ktkv.me/og_image.png",
    sameAs: personData.sameAs,
    contactPoint: {
      "@type": "ContactPoint",
      email: personData.email,
      contactType: "professional",
    },
    knowsAbout: personData.skills,
  } as const;

  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Kotikov Portfolio",
    url: "https://ktkv.me",
    description: personData.description,
    author: {
      "@type": "Person",
      name: personData.name,
    },
    inLanguage: "ru-RU",
  } as const;

  const organizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Kotikov Frontend Development",
    url: "https://ktkv.me",
    description: "Профессиональная разработка фронтенд приложений",
    founder: {
      "@type": "Person",
      name: personData.name,
    },
    serviceType: ["Frontend Development", "Web Development", "UI/UX Design"],
    areaServed: "Worldwide",
  } as const;

  return (
    <>
      { }
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personStructuredData),
        }}
      />
      { }
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteStructuredData),
        }}
      />
      { }
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationStructuredData),
        }}
      />
    </>
  );
}
