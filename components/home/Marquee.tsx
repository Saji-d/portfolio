import { techLogos, type TechLogo } from "@/components/ui/TechIcons";

function LogoItem({ Icon }: { Icon: TechLogo["Icon"] }) {
  return (
    <div className="flex shrink-0 items-center gap-6 pr-6">
      <Icon className="h-7 w-7" />
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent/40" />
    </div>
  );
}

function Segment({ hidden }: { hidden?: boolean }) {
  return (
    <div className={`marquee-segment flex w-max items-center ${hidden ? "marquee-segment-duplicate" : ""}`}>
      {techLogos.map(({ name, Icon }) => (
        <LogoItem key={name} Icon={Icon} />
      ))}
    </div>
  );
}

export default function Marquee() {
  return (
    <section aria-label="Technologies" className="relative pt-10 pb-5">
      <div className="container-site relative overflow-hidden rounded-full border border-line bg-surface/40 py-3">
        <div
          aria-hidden="true"
          className="marquee-track group flex w-max items-center group-hover:[animation-play-state:paused]"
        >
          <Segment />
          <Segment hidden />
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-bg to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-bg to-transparent" />
      </div>
      <ul className="sr-only">
        {techLogos.map((logo) => (
          <li key={logo.name}>{logo.name}</li>
        ))}
      </ul>
    </section>
  );
}
