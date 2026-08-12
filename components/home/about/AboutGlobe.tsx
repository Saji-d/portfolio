"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Globe, { type GlobeMethods } from "react-globe.gl";
import { MeshPhongMaterial } from "three";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { FeatureCollection, Geometry } from "geojson";
import worldTopology from "world-atlas/countries-110m.json";
import GlobeTrail from "@/components/home/about/GlobeTrail";
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

const PALETTES: Record<"dark" | "light", GlobePalette> = {
  dark: {
    ocean: "#0d121c",
    land: "rgba(79, 209, 197, 0.14)",
    landSide: "rgba(79, 209, 197, 0.05)",
    stroke: "rgba(79, 209, 197, 0.4)",
    atmosphere: "#4fd1c5",
    graticule: "rgba(255, 255, 255, 0.06)",
    marker: "#4fd1c5",
    markerHome: "#7c7dff",
    label: "rgba(230, 234, 242, 0.85)",
    labelBg: "rgba(11, 14, 20, 0.72)",
    labelBorder: "rgba(79, 209, 197, 0.35)",
    arcFrom: "rgba(79, 209, 197, 0.7)",
    arcTo: "rgba(124, 125, 255, 0.55)",
  },
  light: {
    ocean: "#e6ebf1",
    land: "rgba(15, 118, 110, 0.16)",
    landSide: "rgba(15, 118, 110, 0.06)",
    stroke: "rgba(15, 118, 110, 0.5)",
    atmosphere: "#0f766e",
    graticule: "rgba(15, 23, 42, 0.08)",
    marker: "#0f766e",
    markerHome: "#4f46e5",
    label: "rgba(16, 21, 31, 0.85)",
    labelBg: "rgba(255, 255, 255, 0.85)",
    labelBorder: "rgba(15, 118, 110, 0.4)",
    arcFrom: "rgba(15, 118, 110, 0.6)",
    arcTo: "rgba(79, 70, 229, 0.5)",
  },
};

function useTheme(): "dark" | "light" {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  useEffect(() => {
    const root = document.documentElement;
    const read = () =>
      setTheme(root.getAttribute("data-theme") === "light" ? "light" : "dark");
    read();
    const observer = new MutationObserver(read);
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);
  return theme;
}

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

interface AboutGlobeProps {
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function AboutGlobe({ selectedId, onSelect }: AboutGlobeProps) {
  const theme = useTheme();
  const palette = PALETTES[theme];
  const reducedMotion = useReducedMotion();
  const { ref: containerRef, size } = useElementSize<HTMLDivElement>();
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isReady = useRef(false);
  const [booted, setBooted] = useState(false);

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
    // Damping handles both smooth drag and the subtle momentum on release —
    // a low factor coasts gently, OrbitControls eases it to rest naturally.
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.rotateSpeed = 0.9;
    isReady.current = true;
  }, [reducedMotion]);

  // Fly the camera to whichever location is selected, so picking a region
  // on the far side of the globe (e.g. America from the default Bangladesh
  // + Europe framing) actually brings it into view. Skipped on the initial
  // mount — handleGlobeReady already sets the establishing shot.
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
      onPointerDown={() => setAutoRotate(false)}
      onPointerUp={resumeAutoRotateSoon}
      onPointerLeave={resumeAutoRotateSoon}
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
      <GlobeTrail targetRef={containerRef} />
    </div>
  );
}
