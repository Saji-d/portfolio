import Image, { type StaticImageData } from "next/image";

interface HeroPortraitProps {
  src: StaticImageData;
  className?: string;
  style?: React.CSSProperties;
}

// A plain, static portrait card - no glow, no gradient border, no filter
// effects. The only reaction to the cursor is a near-imperceptible lift:
// scale to 1.01 and the hairline border tinting slightly toward the
// accent color, both plain CSS transitions on the card itself (no JS,
// no animation loop, nothing touching the photo's own pixels).
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
      <div className="transition-transform duration-300 ease-out group-hover:scale-[1.01]">
        <div className="hero-portrait-mask overflow-hidden rounded-2xl border border-line bg-bg transition-colors duration-300 ease-out group-hover:border-accent/40">
          <div className="relative aspect-[4/5]">
            {/* The source photo's own ratio (2790x3480) is already close
                to this box's 4:5, so a plain object-cover barely crops
                anything - it shows the almost-full standing figure at
                thumbnail scale. object-position and transform-origin
                share one Y anchor (25%, a point just below the hairline
                rather than the box's dead-center, which would zoom
                toward the waist instead); scaling around that fixed
                point crops evenly toward it in every direction, so a
                bigger scale value always means "show a smaller slice of
                the source," with that slice's own height set by
                1/scale. scale-[1.35] is a deliberately mild zoom (tried
                and rejected 2.2-2.5 first - that read as a tight
                head-and-shoulders headshot, not a portrait) that keeps
                the composition close to the original photo: full head
                with headroom, a strip of the red roof truss overhead,
                both hands in pockets, and the crop landing around the
                upper thigh. Overflow is clipped by the parent's
                overflow-hidden mask, not by the box itself. */}
            <Image
              src={src}
              alt="Portrait of Sajidur Rahman Sajid"
              fill
              priority
              quality={100}
              sizes="(min-width: 1024px) 380px, (min-width: 640px) 144px, 128px"
              className="scale-[1.35] object-cover object-[50%_25%] origin-[50%_25%]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
