import { person } from "@/entities";

export default function StructuredData() {
  const personStructuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.personData.name,
    jobTitle: person.personData.jobTitle,
    description: person.personData.description,
    url: person.personData.url,
    image: "https://ktkv.me/og_image.png",
    sameAs: person.personData.sameAs,
    contactPoint: {
      "@type": "ContactPoint",
      email: person.personData.email,
      contactType: "professional",
    },
    knowsAbout: person.personData.skills,
  } as const;

  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Kotikov Portfolio",
    url: "https://ktkv.me",
    description: person.personData.description,
    author: {
      "@type": "Person",
      name: person.personData.name,
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
      name: person.personData.name,
    },
    serviceType: ["Frontend Development", "Web Development", "UI/UX Design"],
    areaServed: "Worldwide",
  } as const;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationStructuredData),
        }}
      />
    </>
  );
}
