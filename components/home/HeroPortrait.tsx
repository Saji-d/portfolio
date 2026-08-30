import Image, { type StaticImageData } from "next/image";

interface HeroPortraitProps {
  src: StaticImageData;
  className?: string;
  style?: React.CSSProperties;
}

// A circular portrait ringed in a two-tone accent gradient (cyan into
// violet) - built as a gradient background showing through the padding gap
// around an opaque inner circle, rather than a mask-composite ring. That's
// deliberate: this build's CSS pipeline (Tailwind v4 / Lightning CSS)
// silently drops mask-composite declarations unless they're set imperatively
// via JS (see NeonRing.tsx for the workaround that requires), and the
// padding trick gets the same ringed look without needing any of that.
export default function HeroPortrait({ src, className, style }: HeroPortraitProps) {
  return (
    <div className={`group relative ${className ?? ""}`} style={style}>
      {/* The hover scale lives on this wrapper, one level above
          .hero-portrait-mask, deliberately - that inner element already
          animates `transform` on entrance (hero-portrait-enter,
          globals.css), and a fill-mode "both" animation keeps controlling
          a property indefinitely once it's run, which would silently
          block or fight a `transform` set here by group-hover. Keeping
          the two transforms on different elements sidesteps that
          entirely instead of relying on timing. */}
      <div className="transition-transform duration-300 ease-out group-hover:scale-[1.02]">
        <div
          className="rounded-full p-[3px] shadow-[0_0_50px_-10px_rgba(99,102,241,0.6)]"
          style={{ background: "linear-gradient(45deg, var(--accent-3) 0%, var(--accent) 50%, var(--accent-2) 100%)" }}
        >
          <div className="hero-portrait-mask overflow-hidden rounded-full bg-bg">
            <div className="relative aspect-square">
              <Image
                src={src}
                alt="Portrait of Sajidur Rahman Sajid"
                fill
                priority
                quality={100}
                sizes="(min-width: 1024px) 380px, (min-width: 640px) 220px, 176px"
                className="object-cover object-[50%_18%]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
