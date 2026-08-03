import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import WorkGrid from "@/components/work/WorkGrid";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "All public repositories — LedgerTurf, FinBERT, Face Recognition, 3D City, and more. Search by title and filter by discipline.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        eyebrow="[ 01 ] — Projects"
        title="Every project, with the code attached."
        lede="The full library — search by title, filter by discipline, and open the source. Several ship with live demos and full case studies."
      />
      <section className="container-site pb-28 pt-12">
        <WorkGrid />
      </section>
    </>
  );
}
