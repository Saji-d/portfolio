import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ResearchShowcase from "@/components/research/ResearchShowcase";

export const metadata: Metadata = {
  title: "Research",
  description:
    "Thesis and research — NeuroScreen hybrid ensemble, Twitter sentiment analysis, early-warning customer churn, image-based water turbidity, and explainable Bangla toxicity detection.",
  alternates: { canonical: "/research" },
};

export default function ResearchPage() {
  return (
    <>
      <PageHeader
        eyebrow="[ 02 ] — Research"
        title="Work that pushes a claim until it holds."
        lede="Every study uses a real dataset, a rigorous method, and honest numbers. The flagship is the thesis below."
      />

      <section className="container-site pb-28 pt-12">
        <ResearchShowcase />
      </section>
    </>
  );
}
