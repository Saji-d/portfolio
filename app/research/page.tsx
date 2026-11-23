import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ResearchShowcase from "@/components/research/ResearchShowcase";

export const metadata: Metadata = {
  title: "Research",
  description:
    "Research: a leakage-controlled evaluation of the Neuro-Screen stacked ensemble, Twitter sentiment analysis, early-warning customer churn, image-based water turbidity and explainable Bangla toxicity detection.",
  alternates: { canonical: "/research" },
};

export default function ResearchPage() {
  return (
    <>
      <PageHeader
        eyebrow="[ 04 ] · Research"
        title="Research that starts with data and ends in a working tool."
        lede="Every study uses a real dataset, a rigorous method and honest numbers. The featured study is a leakage-controlled, nested-cross-validated stacked-ensemble evaluation."
      />

      <section className="container-site pb-28 pt-12">
        <ResearchShowcase />
      </section>
    </>
  );
}
