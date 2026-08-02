import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Eyebrow from "@/components/ui/Eyebrow";
import Reveal from "@/components/ui/Reveal";

interface SectionHeadingProps {
  index: string;
  eyebrow: string;
  title: string;
  lede?: string;
  actionLabel?: string;
  actionHref?: string;
}

export default function SectionHeading({
  index,
  eyebrow,
  title,
  lede,
  actionLabel,
  actionHref,
}: SectionHeadingProps) {
  return (
    <Reveal>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <Eyebrow index={index}>{eyebrow}</Eyebrow>
          <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-gradient sm:text-4xl">
            {title}
          </h2>
          {lede && (
            <p className="mt-4 text-base leading-relaxed text-text-secondary">
              {lede}
            </p>
          )}
        </div>
        {actionLabel && actionHref && (
          <Link
            href={actionHref}
            className="group flex items-center gap-2 text-sm font-medium text-accent transition-opacity hover:opacity-80"
          >
            {actionLabel}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        )}
      </div>
    </Reveal>
  );
}
