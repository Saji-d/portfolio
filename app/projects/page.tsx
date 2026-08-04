import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import WorkGrid from "@/components/work/WorkGrid";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "A curated collection of software engineering, AI, computer vision, graphics, database, and production systems I've built — search by title and filter by discipline.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        eyebrow="[ 01 ] — Projects"
        title="Every project, with the code attached."
        lede="A curated collection of software engineering, AI, computer vision, graphics, database, and production systems I've built."
      />
      <section className="container-site pb-28 pt-12">
        <WorkGrid />
      </section>
    </>
  );
}
