import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import WorkGrid from "@/components/work/WorkGrid";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected projects — InvoicePilot, LedgerTurf, CaseVault, and more. Backend, AI/ML, and full-stack engineering.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <>
      <PageHeader
        eyebrow="[ 01 ] — Work"
        title="Projects with engineering receipts."
        lede="Every project below is backed by tests, decisions, and honest limitations — not just screenshots. Filter by discipline."
      />
      <section className="container-site pb-28 pt-12">
        <WorkGrid />
      </section>
    </>
  );
}
