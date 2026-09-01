import Image, { type StaticImageData } from "next/image";

interface HeroPortraitProps {
  src: StaticImageData;
  className?: string;
  style?: React.CSSProperties;
}

// The source image is a cutout (transparent background), so this stays
// transparent all the way through rather than backing it with a solid
// fill or a glow - no opaque ring, no bg-bg fallback, no bloom shadow.
// Whatever is transparent in the portrait shows the fixed starfield
// (ParticleField, z-0 behind all page content) straight through, stars and
// shooting stars included. Only a hairline border marks the circular crop.
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
        <div className="hero-portrait-mask overflow-hidden rounded-full border border-white/10">
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
  );
}
