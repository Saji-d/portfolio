import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import WorkGrid from "@/components/work/WorkGrid";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "All public repositories — InvoicePilot, CaseVault, LedgerTurf, NeuroScreen, and more. Search by title and filter by discipline.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <>
      <PageHeader
        eyebrow="[ 01 ] — Work"
        title="Every project, with the code attached."
        lede="All public repositories — search by title, filter by discipline, and open the source. The featured four ship with full case studies."
      />
      <section className="container-site pb-28 pt-12">
        <WorkGrid />
      </section>
    </>
  );
}
