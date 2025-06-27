export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Kotikov",
    jobTitle: "Frontend Developer",
    description:
      "Frontend разработчик, специализирующийся на создании красивых и отзывчивых пользовательских интерфейсов",
    url: "https://ktkv.me",
    sameAs: ["https://github.com/kotru21"],
    contactPoint: {
      "@type": "ContactPoint",
      email: "mail@kotikov.is-a.dev",
      contactType: "professional",
    },
    knowsAbout: [
      "Frontend Development",
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "HTML",
      "CSS",
      "Tailwind CSS",
      "UI/UX Design",
      "Responsive Web Design",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
