"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import Globe, { type GlobeMethods } from "react-globe.gl";
import { MeshPhongMaterial } from "three";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { FeatureCollection, Geometry } from "geojson";
import worldTopology from "world-atlas/countries-110m.json";
import RocketExhaust from "@/components/home/about/RocketExhaust";
import { GLOBE_ARCS, GLOBE_LOCATIONS, type GlobeLocation } from "@/data/globe";

const topology = worldTopology as unknown as Topology;
const countries = feature(
  topology,
  topology.objects.countries as GeometryCollection
) as FeatureCollection<Geometry>;

interface GlobePalette {
  ocean: string;
  land: string;
  landSide: string;
  stroke: string;
  atmosphere: string;
  graticule: string;
  marker: string;
  markerHome: string;
  label: string;
  labelBg: string;
  labelBorder: string;
  arcFrom: string;
  arcTo: string;
}

const PALETTE: GlobePalette = {
  ocean: "#0c0d17",
  land: "rgba(99, 102, 241, 0.16)",
  landSide: "rgba(99, 102, 241, 0.07)",
  stroke: "rgba(129, 140, 248, 0.4)",
  atmosphere: "#6366f1",
  graticule: "rgba(148, 163, 255, 0.06)",
  marker: "#6366f1",
  markerHome: "#a855f7",
  label: "rgba(248, 250, 252, 0.85)",
  labelBg: "rgba(8, 8, 18, 0.72)",
  labelBorder: "rgba(99, 102, 241, 0.35)",
  arcFrom: "rgba(99, 102, 241, 0.7)",
  arcTo: "rgba(168, 85, 247, 0.55)",
};

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

function useElementSize<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setSize({ width: el.clientWidth, height: el.clientHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return { ref, size };
}

function buildMarkerElement(
  loc: GlobeLocation,
  isSelected: boolean,
  palette: GlobePalette,
  onSelect: (id: string) => void
) {
  const dotColor = loc.home ? palette.markerHome : palette.marker;

  const wrap = document.createElement("div");
  wrap.className =
    "about-globe-marker group flex cursor-pointer select-none flex-col items-center gap-1.5 transition-transform duration-300 hover:scale-110";
  wrap.style.pointerEvents = "auto";
  wrap.style.setProperty("--marker-glow", dotColor);
  wrap.setAttribute("role", "button");
  wrap.setAttribute("aria-label", `${loc.label}, ${loc.sublabel}`);
  wrap.setAttribute("tabindex", "0");

  const dotWrap = document.createElement("span");
  dotWrap.className = "relative flex";
  dotWrap.style.height = isSelected ? "12px" : "9px";
  dotWrap.style.width = isSelected ? "12px" : "9px";

  const ping = document.createElement("span");
  ping.className = `absolute inline-flex h-full w-full rounded-full opacity-60 ${
    isSelected ? "animate-ping" : ""
  }`;
  ping.style.backgroundColor = dotColor;

  const dot = document.createElement("span");
  dot.className = "marker-dot relative inline-flex h-full w-full rounded-full";
  dot.style.backgroundColor = dotColor;
  dot.style.boxShadow = isSelected
    ? `0 0 0 3px ${palette.labelBg}, 0 0 14px ${dotColor}`
    : `0 0 8px ${dotColor}`;

  dotWrap.appendChild(ping);
  dotWrap.appendChild(dot);

  const tag = document.createElement("span");
  tag.className =
    "whitespace-nowrap rounded-full border px-2 py-0.5 font-mono text-[9px] font-medium uppercase tracking-wider backdrop-blur-md";
  tag.textContent = loc.label;
  tag.style.color = palette.label;
  tag.style.backgroundColor = palette.labelBg;
  tag.style.borderColor = isSelected ? dotColor : palette.labelBorder;

  wrap.appendChild(dotWrap);
  wrap.appendChild(tag);

  const select = () => onSelect(loc.id);
  wrap.addEventListener("click", (e) => {
    e.stopPropagation();
    select();
  });
  wrap.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      select();
    }
  });

  return wrap;
}

// The cursor hotspot sits near the nose; the engine/fins sit this many
// pixels below it in the SVG. RocketExhaust uses the same distance to anchor
// the thruster at the nozzle rather than at the raw pointer position.
const ROCKET_ENGINE_OFFSET_Y = 19;

function buildRocketCursor(color: string) {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="30" viewBox="0 0 22 30">` +
    `<path d="M11 1C15.5 5.5 17 12 16.5 18H5.5C5 12 6.5 5.5 11 1Z" fill="${color}"/>` +
    `<rect x="8.3" y="18" width="5.4" height="4.5" rx="1" fill="${color}"/>` +
    `<path d="M5.5 15L1 22L6.3 19.3Z" fill="${color}"/>` +
    `<path d="M16.5 15L21 22L15.7 19.3Z" fill="${color}"/>` +
    `<circle cx="11" cy="9.5" r="2" fill="#080812" fill-opacity="0.5"/>` +
    `</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}") 11 4, grab`;
}

interface AboutGlobeProps {
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function AboutGlobe({ selectedId, onSelect }: AboutGlobeProps) {
  const palette = PALETTE;
  const reducedMotion = useReducedMotion();
  const { ref: containerRef, size } = useElementSize<HTMLDivElement>();
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isReady = useRef(false);
  const isDraggingGlobe = useRef(false);
  const hoverRaf = useRef<number | null>(null);
  // Mirrors the cursor's on-globe state for RocketExhaust, which needs it on
  // every pointermove and shouldn't re-render this component to get it.
  const overGlobeRef = useRef(false);
  const [booted, setBooted] = useState(false);

  const rocketCursor = useMemo(
    () => buildRocketCursor(palette.marker),
    [palette.marker]
  );

  // Proper hit-testing: raycasts against the actual rendered globe sphere
  // (via react-globe.gl's own toGlobeCoords) rather than trusting CSS box
  // geometry, so the empty card space around the sphere never reads as "on
  // the globe" no matter how much slack the rectangular canvas has.
  const isPointerOnGlobe = useCallback((clientX: number, clientY: number) => {
    const api = globeRef.current;
    const canvasEl = api?.renderer().domElement;
    if (!api || !canvasEl) return false;
    const rect = canvasEl.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    if (x < 0 || y < 0 || x > rect.width || y > rect.height) return false;
    return api.toGlobeCoords(x, y) !== null;
  }, []);

  // On the globe: grab/grabbing, no exhaust. Off the globe (empty card
  // space): a rocket cursor with RocketExhaust rendering its thruster.
  const updateCursor = useCallback(
    (clientX: number, clientY: number) => {
      const canvasEl = globeRef.current?.renderer().domElement;
      if (!canvasEl) return;
      if (isDraggingGlobe.current) {
        overGlobeRef.current = true;
        canvasEl.style.cursor = "grabbing";
        return;
      }
      const onGlobe = isPointerOnGlobe(clientX, clientY);
      overGlobeRef.current = onGlobe;
      canvasEl.style.cursor = onGlobe ? "grab" : rocketCursor;
    },
    [isPointerOnGlobe, rocketCursor]
  );

  // The page renders instantly; WebGL only boots once this container is close
  // to the viewport (a double-rAF beats the IntersectionObserver callback so
  // surrounding content paints first, keeping the initial paint untouched).
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setBooted(true));
        });
      },
      { rootMargin: "40px 0px 120px 0px", threshold: 0.02 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reducedMotion, containerRef]);

  const globeMaterial = useMemo(
    () =>
      new MeshPhongMaterial({
        color: palette.ocean,
        transparent: true,
        opacity: 0.94,
      }),
    [palette.ocean]
  );

  const arcsData = useMemo(
    () =>
      GLOBE_ARCS.map((a) => {
        const from = GLOBE_LOCATIONS.find((l) => l.id === a.from)!;
        const to = GLOBE_LOCATIONS.find((l) => l.id === a.to)!;
        return {
          startLat: from.lat,
          startLng: from.lng,
          endLat: to.lat,
          endLng: to.lng,
        };
      }),
    []
  );

  const ringsData = useMemo(() => {
    const loc = GLOBE_LOCATIONS.find((l) => l.id === selectedId);
    return loc ? [{ lat: loc.lat, lng: loc.lng }] : [];
  }, [selectedId]);

  const setAutoRotate = useCallback(
    (on: boolean) => {
      const controls = globeRef.current?.controls?.();
      if (controls) controls.autoRotate = on && !reducedMotion;
    },
    [reducedMotion]
  );

  const resumeAutoRotateSoon = useCallback(() => {
    setAutoRotate(false);
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setAutoRotate(true), 2400);
  }, [setAutoRotate]);

  useEffect(() => () => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
  }, []);

  useEffect(
    () => () => {
      if (hoverRaf.current) cancelAnimationFrame(hoverRaf.current);
    },
    []
  );

  // Hover cursor only, throttled to one hit-test per frame - cheap enough
  // that it doesn't need its own render loop, it just rides pointermove.
  const handlePointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (isDraggingGlobe.current) return;
      const { clientX, clientY } = e;
      if (hoverRaf.current) cancelAnimationFrame(hoverRaf.current);
      hoverRaf.current = requestAnimationFrame(() => {
        hoverRaf.current = null;
        updateCursor(clientX, clientY);
      });
    },
    [updateCursor]
  );

  // Gate OrbitControls on the actual hit-test result: a press that starts
  // off the sphere disables the controls before any pointermove reaches
  // them (three.js checks `enabled` on every move/up), so empty card space
  // never rotates the globe. A press that starts on the sphere is left
  // alone - three.js already handles drags that wander off-globe mid-drag.
  const handlePointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      setAutoRotate(false);
      const api = globeRef.current;
      const controls = api?.controls?.();
      const canvasEl = api?.renderer().domElement;
      if (!controls || !canvasEl) return;
      // Presses on overlaid HTML (markers, the location panel) never reach
      // OrbitControls natively - only gate/track drags the canvas itself got.
      if (e.target !== canvasEl) return;
      const onGlobe = isPointerOnGlobe(e.clientX, e.clientY);
      isDraggingGlobe.current = onGlobe;
      controls.enabled = onGlobe;
      updateCursor(e.clientX, e.clientY);
    },
    [setAutoRotate, isPointerOnGlobe, updateCursor]
  );

  const handlePointerEnd = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      resumeAutoRotateSoon();
      const controls = globeRef.current?.controls?.();
      if (controls) controls.enabled = true;
      isDraggingGlobe.current = false;
      updateCursor(e.clientX, e.clientY);
    },
    [resumeAutoRotateSoon, updateCursor]
  );

  const handlePointerLeaveContainer = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      resumeAutoRotateSoon();
      if (!isDraggingGlobe.current) updateCursor(e.clientX, e.clientY);
    },
    [resumeAutoRotateSoon, updateCursor]
  );

  const handleGlobeReady = useCallback(() => {
    const api = globeRef.current;
    if (!api) return;
    api.pointOfView({ lat: 18, lng: 55, altitude: 1.75 }, 0);
    const controls = api.controls();
    controls.autoRotate = !reducedMotion;
    controls.autoRotateSpeed = 0.3;
    // Zoom is intentionally constrained rather than disabled: close enough to
    // read the boundary lines, far enough that the globe never shrinks to a
    // speck or fills the whole card.
    controls.enableZoom = true;
    controls.zoomSpeed = 0.6;
    const radius = api.getGlobeRadius();
    controls.minDistance = radius * 1.3;
    controls.maxDistance = radius * 3.5;
    controls.enablePan = false;
    // Damping handles both smooth drag and the subtle momentum on release -
    // a low factor coasts gently, OrbitControls eases it to rest naturally.
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.rotateSpeed = 0.9;
    isReady.current = true;
    // The render loop free-runs from mount, but the pause/resume observer
    // below can fire its first check before this ref exists (e.g. when the
    // section is already in view on load, such as a direct #about visit) -
    // that check no-ops, and since visibility never changes again there's no
    // later transition to resume on. Explicitly sync once the globe is ready.
    api.resumeAnimation();
  }, [reducedMotion]);

  // Fly the camera to whichever location is selected, so picking a region
  // on the far side of the globe (e.g. America from the default Bangladesh
  // + Europe framing) actually brings it into view. Skipped on the initial
  // mount - handleGlobeReady already sets the establishing shot.
  useEffect(() => {
    const api = globeRef.current;
    if (!api || !isReady.current) return;
    const loc = GLOBE_LOCATIONS.find((l) => l.id === selectedId);
    if (!loc) return;
    api.pointOfView({ lat: loc.lat, lng: loc.lng, altitude: 1.75 }, reducedMotion ? 0 : 1200);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  // Pause the render loop entirely while the globe is off-screen.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const api = globeRef.current;
        if (!api) return;
        if (entry.isIntersecting) api.resumeAnimation();
        else api.pauseAnimation();
      },
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const htmlElementsData = useMemo(
    () => GLOBE_LOCATIONS.map((loc) => ({ ...loc })),
    []
  );

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onPointerLeave={handlePointerLeaveContainer}
      className="about-globe-canvas absolute inset-0 touch-none"
    >
      {(booted || reducedMotion) && size.width > 0 && size.height > 0 && (
        <Globe
          ref={globeRef}
          width={size.width}
          height={size.height}
          backgroundColor="rgba(0,0,0,0)"
          animateIn={!reducedMotion}
          globeMaterial={globeMaterial}
          showAtmosphere
          atmosphereColor={palette.atmosphere}
          atmosphereAltitude={0.16}
          showGraticules
          polygonsData={countries.features}
          polygonCapColor={() => palette.land}
          polygonSideColor={() => palette.landSide}
          polygonStrokeColor={() => palette.stroke}
          polygonAltitude={0.006}
          polygonsTransitionDuration={0}
          htmlElementsData={htmlElementsData}
          htmlLat={(d) => (d as GlobeLocation).lat}
          htmlLng={(d) => (d as GlobeLocation).lng}
          htmlAltitude={0.02}
          htmlElement={(d) =>
            buildMarkerElement(
              d as GlobeLocation,
              (d as GlobeLocation).id === selectedId,
              palette,
              onSelect
            )
          }
          ringsData={ringsData}
          ringColor={() => palette.marker}
          ringMaxRadius={5}
          ringPropagationSpeed={2}
          ringRepeatPeriod={1500}
          arcsData={arcsData}
          arcColor={() => [palette.arcFrom, palette.arcTo]}
          arcAltitude={0.22}
          arcStroke={0.4}
          arcDashLength={0.4}
          arcDashGap={2}
          arcDashAnimateTime={reducedMotion ? 0 : 4500}
          enablePointerInteraction
          onGlobeReady={handleGlobeReady}
        />
      )}
      <RocketExhaust
        targetRef={containerRef}
        overGlobeRef={overGlobeRef}
        anchorOffsetY={ROCKET_ENGINE_OFFSET_Y}
      />
    </div>
  );
}
