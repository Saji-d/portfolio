import Image, { type StaticImageData } from "next/image";

interface HeroPortraitProps {
  src: StaticImageData;
  className?: string;
  style?: React.CSSProperties;
}

// The source image is a transparent-background cutout. Rather than let that
// transparency show the fixed starfield straight through (which read as
// stray stars poking through empty patches of the mask, not a photo), the
// cutout gets its own flat studio backdrop - see the .hero-portrait-* rules
// in globals.css. The hover scale lives on this wrapper, one level above
// .hero-portrait-mask, deliberately - that inner element already animates
// `transform` on entrance (hero-portrait-enter), and a fill-mode "both"
// animation keeps controlling a property indefinitely once it's run, which
// would silently block or fight a `transform` set here by group-hover.
// Keeping the two transforms on different elements sidesteps that entirely
// instead of relying on timing.
export default function HeroPortrait({ src, className, style }: HeroPortraitProps) {
  return (
    <div className={`group relative ${className ?? ""}`} style={style}>
      <div className="transition-transform duration-300 ease-out group-hover:scale-[1.015]">
        <div className="hero-portrait-mask relative aspect-[4/5] overflow-hidden rounded-[2rem] sm:rounded-[2.25rem]">
          <div aria-hidden="true" className="hero-portrait-backdrop absolute inset-0" />
          <Image
            src={src}
            alt="Portrait of Sajidur Rahman Sajid"
            fill
            priority
            quality={100}
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 260px, 200px"
            className="relative object-cover object-[50%_6%]"
          />
          <div aria-hidden="true" className="hero-portrait-grain absolute inset-0" />
          <div
            aria-hidden="true"
            className="hero-portrait-ring pointer-events-none absolute inset-0 rounded-[2rem] sm:rounded-[2.25rem]"
          />
        </div>
      </div>

      {/* Only shown in the desktop composition (HeroPortrait's other caller,
          the mobile/tablet block in Hero.tsx, renders this at 144-160px
          wide - too small for a chip this size to sit comfortably). */}
      <div className="hero-portrait-badge card-meta absolute bottom-4 left-4 hidden items-center gap-2 whitespace-nowrap normal-case tracking-normal text-text-secondary lg:inline-flex">
        <span className="hero-portrait-badge-dot" />
        Open to work
      </div>
    </div>
  );
}
