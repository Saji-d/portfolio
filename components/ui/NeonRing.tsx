"use client";

import { useEffect, useRef } from "react";

// Rotating neon perimeter highlight for a card, activated by the ancestor's
// `group` hover/focus state (see .card-neon-ring in globals.css). Shared by
// SkillsSection and ContactSection so both feel like one interaction
// language instead of two near-identical hand-rolled effects.
//
// The mask is applied imperatively in an effect rather than via the React
// `style` prop or the .card-neon-ring class itself - both were tried first
// and both silently failed to apply mask-composite:
// - In the stylesheet: the build's CSS optimizer (Tailwind v4 / Lightning
//   CSS) dropped the mask-image declaration entirely during minification
//   (computed styles came back mask-image: none).
// - As a React `style` object: mask-image and mask-clip made it into the
//   rendered attribute, but mask-composite/-webkit-mask-composite were
//   silently omitted from the serialized style string altogether (visible
//   via element.getAttribute("style") - they just weren't there, no
//   error). Direct DOM property assignment on the same element, in the
//   same order, does not have this problem - confirmed by testing both
//   side by side against the live CSSOM - so that's what this does.
//
// One more non-obvious thing: `content-box` (the box the mask should cut
// out) is only valid inside the `mask-clip` longhand or the `mask`
// SHORTHAND - the `mask-image` longhand alone rejects a box keyword
// embedded in its value and silently keeps its previous value. Hence
// mask-image carries only the two gradients, and mask-clip carries the
// box keywords as its own same-layer-count sibling property.
export default function NeonRing() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const gradients = "linear-gradient(#000, #000), linear-gradient(#000, #000)";
    el.style.maskImage = gradients;
    el.style.maskClip = "content-box, border-box";
    el.style.maskComposite = "exclude";
    el.style.webkitMaskImage = gradients;
    el.style.webkitMaskClip = "content-box, border-box";
    el.style.webkitMaskComposite = "xor";
  }, []);

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className="card-neon-ring pointer-events-none opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
    />
  );
}
