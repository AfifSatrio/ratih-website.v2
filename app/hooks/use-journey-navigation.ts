"use client";

import { useEffect, useRef, type MouseEvent, type RefObject } from "react";
import { SCENE_POSITIONS, TRANSITION_DURATION_MS } from "../components/journey/config";

export function useJourneyNavigation(root: RefObject<HTMLDivElement | null>) {
  const pendingFocus = useRef<string | null>(null);
  const scrollFrame = useRef(0);

  useEffect(() => {
    const cancelNavigation = () => {
      cancelAnimationFrame(scrollFrame.current);
      scrollFrame.current = 0;
      pendingFocus.current = null;
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " ", "Escape"].includes(event.key)) {
        cancelNavigation();
      }
    };
    window.addEventListener("wheel", cancelNavigation, { passive: true });
    window.addEventListener("touchstart", cancelNavigation, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", cancelNavigation);
    return () => {
      cancelNavigation();
      window.removeEventListener("wheel", cancelNavigation);
      window.removeEventListener("touchstart", cancelNavigation);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", cancelNavigation);
    };
  }, []);

  const navigate = (event: MouseEvent<HTMLDivElement>) => {
    const button = (event.target as Element).closest<HTMLButtonElement>("button[data-scene]");
    if (!button) return;
    const journey = root.current!;
    const viewport = journey.querySelector<HTMLElement>(".journey-viewport")!;
    const top = journey.getBoundingClientRect().top + window.scrollY;
    const destination = button.dataset.scene!;
    cancelAnimationFrame(scrollFrame.current);
    pendingFocus.current = destination;
    const distance = journey.offsetHeight - viewport.clientHeight;
    const target = top + SCENE_POSITIONS[destination] * distance / 2;
    const start = window.scrollY;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches || Math.abs(target - start) < 1) {
      window.scrollTo({ top: target, behavior: "instant" });
      scrollFrame.current = 0;
      return;
    }

    // Drive scroll ourselves: native smooth scrolling has no configurable duration.
    // Each visual phase already applies its own easing to this linear progress.
    const duration = TRANSITION_DURATION_MS * Math.min(1, Math.abs(target - start) / Math.max(1, distance / 2));
    const startedAt = performance.now();
    const tick = (now: number) => {
      const progress = reducedMotion.matches ? 1 : Math.min(1, (now - startedAt) / duration);
      window.scrollTo({ top: start + (target - start) * progress, behavior: "instant" });
      scrollFrame.current = progress < 1 ? requestAnimationFrame(tick) : 0;
    };
    scrollFrame.current = requestAnimationFrame(tick);
  };

  return { navigate, pendingFocus };
}
