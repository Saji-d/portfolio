import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import FullTimeline from "@/components/about/FullTimeline";
import Reveal from "@/components/ui/Reveal";
import { Award, Scale, Wrench } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description:
    "Full-stack developer in Dhaka working remotely for Lumifi Solutions (Australia) and RemoteIntegrity (US). Also applied ML: a leakage-controlled stacked-ensemble study on student sleep and cognitive symptoms.",
  alternates: { canonical: "/about" },
};

const values = [
  {
    icon: Scale,
    title: "Rigorous evaluation",
    body: "Neuro-Screen uses a leakage-controlled design and nested cross-validation on 2,236 survey responses, with every metric reported against a majority-class baseline.",
  },
  {
    icon: Wrench,
    title: "Tested pipelines",
    body: "InvoicePilot's OCR and fraud service has 11 pipeline stages, Redis Streams workers and 246 pytest tests.",
  },
  {
    icon: Award,
    title: "Accessibility checked",
    body: "The Zenji storefront has 27 Vitest tests and Playwright with axe-core runs at 8 viewports, with 0 WCAG 2.1 AA violations.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="[ 01 ] · About"
        title="Full-stack developer in Dhaka."
        lede="I work remotely for Lumifi Solutions in Australia and RemoteIntegrity in the US, and I do applied ML research on the side."
      />

      <section className="container-site py-12">
        <Reveal>
          <div className="max-w-3xl space-y-5 text-lg leading-relaxed text-text-secondary">
            <p>
              I&apos;m Sajidur Rahman Sajid, a full-stack developer in Dhaka. Since
              November 2026 I have worked remotely as a Full-Stack Developer for
              Lumifi Solutions, an Australian company, on Australian hours. There I
              built the Applications and Enrolments module of Lumifi SMS, a
              multi-tenant student management system for Australian training
              organisations. I also have an ongoing contract with RemoteIntegrity
              in the US. At Ledgercross I built the
              FastAPI OCR and fraud-detection service for InvoicePilot and
              delivered the FUMAK inventory and POS system as sole developer.
              Before that I interned at Bangladesh Software Solution, building
              responsive interfaces against REST APIs.
            </p>
            <p>
              Neuro-Screen was a group research project at AIUB. I built the
              Streamlit app and ran the re-analysis. A stack of CatBoost,
              XGBoost, LightGBM and a neural network was evaluated with nested
              cross-validation on a leakage-controlled predictor set (cognitive
              accuracy 0.621 vs majority baseline 0.621; ROC-AUC 0.480) across
              2,236 survey responses. The paper is in preparation.
            </p>
            <p>
              At AIUB I received the Dean&apos;s Award five times and an AIUB Merit
              Scholarship (70% tuition waiver). I coordinated student activities
              for the Space Innovation Camp, represented WRO Bangladesh and hold
              the Duke of Edinburgh&apos;s Bronze Award.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="container-site py-12">
        <Reveal>
          <p className="eyebrow">[ 02 ] · Evidence</p>
          <h2 className="mt-3 font-display text-2xl font-medium tracking-tight text-gradient sm:text-3xl">
            What the repos show
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.04}>
              <div className="card-surface h-full p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40">
                <v.icon className="h-5 w-5 text-accent" />
                <h3 className="mt-4 font-display text-base font-medium tracking-tight text-text-primary">
                  {v.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {v.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-site py-12">
        <Reveal>
          <p className="eyebrow">[ 03 ] · Timeline</p>
          <h2 className="mt-3 font-display text-2xl font-medium tracking-tight text-gradient sm:text-3xl">
            Career & education
          </h2>
        </Reveal>
        <div className="mt-10">
          <FullTimeline />
        </div>
      </section>
    </>
  );
}
