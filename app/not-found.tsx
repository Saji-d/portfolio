import type { Metadata } from "next";
import Link from "next/link";
import MagneticButton from "@/components/ui/MagneticButton";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className="container-site flex min-h-[70vh] flex-col items-center justify-center py-32 text-center">
      <p className="eyebrow">[ 404 ] · Not found</p>
      <h1 className="mt-4 font-display text-6xl font-medium tracking-tight text-gradient sm:text-7xl">
        404
      </h1>
      <p className="mt-6 max-w-md leading-relaxed text-text-secondary">
        That page doesn&apos;t exist, but the pipeline that should have served it is
        still running.
      </p>
      <div className="mt-8">
        <MagneticButton
          href="/"
          className="bg-accent px-6 py-3 text-sm font-medium text-accent-ink hover:bg-accent/90"
        >
          Back home
        </MagneticButton>
        <Link
          href="/projects"
          className="ml-3 inline-flex rounded-md border border-line bg-surface px-6 py-3 text-sm font-medium text-text-primary transition-colors hover:border-accent/50"
        >
          View projects
        </Link>
      </div>
    </section>
  );
}
