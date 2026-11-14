"use client";

import { useEffect, useRef, type MouseEvent, type RefObject } from "react";
import { SCENE_POSITIONS, TRANSITION_DURATION_MS } from "../components/journey/config";

import { getNavigationExit, renderNavigationFrame, getHeroEntrance, type SceneName } from "../components/journey/navigation-transition";

export function useJourneyNavigation(root: RefObject<HTMLDivElement | null>) {
  const pendingFocus = useRef<SceneName | null>(null);
  const scrollFrame = useRef(0);

  useEffect(() => {
    const cancelNavigation = () => {
      cancelAnimationFrame(scrollFrame.current);
      scrollFrame.current = 0;
      pendingFocus.current = null;
      if (root.current) renderNavigationFrame(root.current, null);
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
  }, [root]);

  const navigate = (event: MouseEvent<HTMLDivElement>) => {
    const button = (event.target as Element).closest<HTMLButtonElement>("button[data-scene]");
    if (!button) return;
    const journey = root.current!;
    const viewport = journey.querySelector<HTMLElement>(".journey-viewport")!;
    const top = journey.getBoundingClientRect().top + window.scrollY;
    const destination = button.dataset.scene;
    if (!destination || !Object.prototype.hasOwnProperty.call(SCENE_POSITIONS, destination)) return;
    const scene = destination as SceneName;
    cancelAnimationFrame(scrollFrame.current);
    // A second click cancels the previous exit before starting a new one.
    renderNavigationFrame(journey, null);
    const source = (journey.dataset.activeScene ?? "hero") as SceneName;
    pendingFocus.current = scene;
    const distance = Math.max(1, journey.offsetHeight - viewport.clientHeight);
    const target = top + SCENE_POSITIONS[scene] * distance / 2;
    const startPosition = Math.max(0, Math.min(2, (window.scrollY - top) / distance * 2));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const complete = () => {
      renderNavigationFrame(journey, null);
      scrollFrame.current = 0;
    };
    const finish = () => {
      if (scene === "hero" && source !== "hero" && !reducedMotion.matches) {
        // Hide the hero at the end of its exit curve before jumping the scroll position.
        renderNavigationFrame(journey, getHeroEntrance(0));
        window.scrollTo({ top: target, behavior: "instant" });
        const enteredAt = performance.now();
        const enter = (now: number) => {
          const progress = reducedMotion.matches ? 1 : Math.min(1, (now - enteredAt) / (TRANSITION_DURATION_MS / 2));
          renderNavigationFrame(journey, getHeroEntrance(progress));
          if (progress < 1) scrollFrame.current = requestAnimationFrame(enter);
          else complete();
        };
        scrollFrame.current = requestAnimationFrame(enter);
        return;
      }
      // No intermediate scroll frames: reveal the destination in this same frame.
      window.scrollTo({ top: target, behavior: "instant" });
      complete();
    };
    if (reducedMotion.matches || source === scene) {
      finish();
      return;
    }

    const startedAt = performance.now();
    const tick = (now: number) => {
      const progress = reducedMotion.matches ? 1 : Math.min(1, (now - startedAt) / (TRANSITION_DURATION_MS / 2));
      renderNavigationFrame(journey, getNavigationExit(source, startPosition, progress));
      if (progress < 1) scrollFrame.current = requestAnimationFrame(tick);
      else finish();
    };
    scrollFrame.current = requestAnimationFrame(tick);
  };

  return { navigate, pendingFocus };
}
