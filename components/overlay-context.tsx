"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, MotionConfig } from "motion/react";
import ProjectOverlay from "@/components/case-study/ProjectOverlay";
import ResearchOverlay from "@/components/research/ResearchOverlay";

interface OverlayState {
  type: "project" | "research";
  slug: string;
}

interface OverlayContextValue {
  openProject: (slug: string) => void;
  openResearch: (slug: string) => void;
  close: () => void;
}

const OverlayContext = createContext<OverlayContextValue>({
  openProject: () => {},
  openResearch: () => {},
  close: () => {},
});

export function OverlayProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OverlayState | null>(null);
  const lastHashRef = useRef("");

  const applyHash = useCallback((hash: string) => {
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${window.location.search}${hash}`
    );
  }, []);

  const openProject = useCallback(
    (slug: string) => {
      lastHashRef.current = window.location.hash;
      applyHash(`#project/${slug}`);
      setState({ type: "project", slug });
    },
    [applyHash]
  );

  const openResearch = useCallback(
    (slug: string) => {
      lastHashRef.current = window.location.hash;
      applyHash(`#research/${slug}`);
      setState({ type: "research", slug });
    },
    [applyHash]
  );

  const close = useCallback(() => {
    const prev = lastHashRef.current;
    lastHashRef.current = "";
    applyHash(prev);
    setState(null);
  }, [applyHash]);

  useEffect(() => {
    const match = window.location.hash.match(/^#(project|research)\/([\w-]+)$/);
    if (!match) return;
    const type = match[1] === "research" ? "research" : "project";
    const id = window.setTimeout(() => {
      setState({ type, slug: match[2] });
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!state) return;
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prevOverflow;
    };
  }, [state, close]);

  return (
    <OverlayContext.Provider value={{ openProject, openResearch, close }}>
      <MotionConfig reducedMotion="user">
        {children}
        <AnimatePresence>
          {state?.type === "project" && (
            <ProjectOverlay
              key={`project-${state.slug}`}
              slug={state.slug}
              onClose={close}
            />
          )}
          {state?.type === "research" && (
            <ResearchOverlay
              key={`research-${state.slug}`}
              slug={state.slug}
              onClose={close}
            />
          )}
        </AnimatePresence>
      </MotionConfig>
    </OverlayContext.Provider>
  );
}

export function useOverlay() {
  return useContext(OverlayContext);
}
