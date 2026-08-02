import Link from "next/link";
import { ArrowRight, ShieldCheck, Workflow, Scale } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

const focuses = [
  {
    icon: Workflow,
    title: "InvoicePilot",
    body: "Shipping an 11-stage AI invoice pipeline with Redis Streams async workers and a Solidity seal registry.",
  },
  {
    icon: Scale,
    title: "CaseVault GraphRAG",
    body: "Designing the Phase-2 graph engine — Qdrant vector search plus a Neo4j knowledge graph with community detection.",
  },
  {
    icon: ShieldCheck,
    title: "SOC 2 readiness",
    body: "Building the security policy suite, trust center, and row-level-security migrations ahead of audit.",
  },
];

export default function CurrentlySection() {
  return (
    <section className="py-24 sm:py-32">
      <div className="container-site">
        <SectionHeading
          index="03"
          eyebrow="Currently"
          title="At LedgerCross, I build systems meant to be audited."
          lede="Day-to-day, that means dependable async pipelines, privacy-preserving ledgers, and security posture you can point at an auditor."
        />

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {focuses.map((f) => (
            <div key={f.title} className="card-surface group p-6 transition-all duration-300 hover:border-accent/40">
              <f.icon className="h-5 w-5 text-accent" />
              <h3 className="mt-4 font-display text-base font-medium tracking-tight text-text-primary">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {f.body}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Link
            href="/work/invoicepilot"
            className="group inline-flex items-center gap-2 text-sm font-medium text-accent transition-opacity hover:opacity-80"
          >
            Read the InvoicePilot case study
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
