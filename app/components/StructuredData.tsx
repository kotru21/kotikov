import { person } from "@/entities";

export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.personData.name,
    jobTitle: person.personData.jobTitle,
    description: person.personData.description,
    url: person.personData.url,
    sameAs: person.personData.sameAs,
    contactPoint: {
      "@type": "ContactPoint",
      email: person.personData.email,
      contactType: "professional",
    },
    knowsAbout: person.personData.skills,
  } as const;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
