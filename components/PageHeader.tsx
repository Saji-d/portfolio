import Reveal from "@/components/ui/Reveal";

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  lede?: string;
}

export default function PageHeader({ eyebrow, title, lede }: PageHeaderProps) {
  return (
    <div className="container-site pt-32 sm:pt-40">
      <Reveal>
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-medium tracking-tight text-gradient sm:text-5xl">
          {title}
        </h1>
        {lede && (
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-text-secondary">
            {lede}
          </p>
        )}
      </Reveal>
    </div>
  );
}
