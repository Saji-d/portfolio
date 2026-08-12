import { SITE } from "@/data/site";

export default function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE.name,
    jobTitle: "Software Engineer",
    url: SITE.url,
    email: `mailto:${SITE.email}`,
    telephone: SITE.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dhaka",
      addressCountry: "BD",
    },
    alumniOf: "American International University-Bangladesh",
    sameAs: [SITE.linkedin, SITE.github],
    knowsAbout: [
      "Full-Stack Engineering",
      "FastAPI",
      "Machine Learning",
      "Distributed Systems",
      "PostgreSQL",
      "Solidity",
      "React",
      "Next.js",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
