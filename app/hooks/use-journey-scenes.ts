"use client";

import { useEffect, type RefObject } from "react";
import { ease, SCENE_POSITIONS } from "../components/journey/config";
import { createHeroScroll } from "../components/journey/hero-scroll";
import { createSceneExits } from "../components/journey/scene-exits";

import { NAVIGATION_FRAME, type NavigationFrame, type SceneName } from "../components/journey/navigation-transition";

export function useJourneyScenes(root: RefObject<HTMLDivElement | null>, pendingFocus: RefObject<SceneName | null>) {
  useEffect(() => {
    const journey = root.current!;
    const hero = journey.querySelector<HTMLElement>(".scene-hero")!;
    const services = journey.querySelector<HTMLElement>(".scene-services")!;
    const advantages = journey.querySelector<HTMLElement>(".scene-advantages")!;
    const scenes = { hero, services, advantages };
    const viewport = journey.querySelector<HTMLElement>(".journey-viewport")!;
    const navigation = journey.querySelectorAll<HTMLButtonElement>(".section-nav button, .mobile-nav button[data-scene]");
    const navigationPanel = journey.querySelector<HTMLElement>(".section-nav")!;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const heroScroll = createHeroScroll(journey, hero);
    const updateExits = createSceneExits(journey);
    let frame = 0;
    let navigationFrame: NavigationFrame | null = null;

    const update = () => {
      frame = 0;
      const bounds = journey.getBoundingClientRect();
      const distance = Math.max(1, bounds.height - viewport.clientHeight);
      const scrollPosition = Math.max(0, Math.min(2, -bounds.top / distance * 2));
      const position = navigationFrame?.position ?? scrollPosition;
      updateExits(position, reducedMotion.matches);
      const progress = Math.min(1, position);
      // Artwork exits (0–55%), copy fades (55–75%), a pause (75–85%), then services (85–100%).
      const showServices = progress >= 0.75;
      const activeScene = navigationFrame?.scene ?? (position >= 1.65 ? "advantages" : showServices ? "services" : "hero");
      journey.dataset.activeScene = activeScene;
      navigation.forEach((button) => {
        if (button.dataset.scene === activeScene) {
          button.setAttribute("aria-current", "location");
        } else {
          button.removeAttribute("aria-current");
        }
      });
      const motionProgress = reducedMotion.matches ? Number(showServices) : progress;
      // Navigation stays opaque between content sections and hides immediately on the hero.
      journey.style.setProperty("--navigation-opacity", "1");
      journey.style.setProperty("--services-opacity", String(navigationFrame && activeScene !== "services" ? 0 : reducedMotion.matches
        ? Number(activeScene === "services")
        : Number(position > 0.85 && position < 1.65)));
      journey.style.setProperty("--advantages-opacity", String(navigationFrame && activeScene !== "advantages" ? 0 : reducedMotion.matches
        ? Number(activeScene === "advantages")
        : ease((position - 1.65) / 0.35)));
      journey.toggleAttribute("data-advantages-entered", navigationFrame ? activeScene === "advantages" : position > 1.65);

      heroScroll.update(motionProgress);
      if (navigationFrame && activeScene !== "hero") journey.style.setProperty("--hero-opacity", "0");

      const incoming = scenes[activeScene];
      incoming.inert = false;
      incoming.removeAttribute("aria-hidden");
      // Keep keyboard focus out of the layer that is disappearing.
      Object.values(scenes).forEach((scene) => {
        if (scene === incoming) return;
        if (scene.contains(document.activeElement)) {
          incoming.querySelector<HTMLElement>("h1, h2")?.focus({ preventScroll: true });
        }
        scene.inert = true;
        scene.setAttribute("aria-hidden", "true");
      });
      const navigationVisible = navigationFrame
        ? activeScene !== "hero"
        : motionProgress > 0.85;
      journey.toggleAttribute("data-navigation-entered", navigationVisible);
      journey.toggleAttribute("data-services-entered", navigationFrame ? activeScene === "services" : motionProgress > 0.85);
      if (!navigationVisible && navigationPanel.contains(document.activeElement)) {
        incoming.querySelector<HTMLElement>("h1, h2")?.focus({ preventScroll: true });
      }
      navigationPanel.inert = !navigationVisible;
      navigationPanel.setAttribute("aria-hidden", String(!navigationVisible));
      if (!navigationFrame && pendingFocus.current && Math.abs(position - SCENE_POSITIONS[pendingFocus.current]) < 0.01) {
        incoming.querySelector<HTMLElement>("h1, h2")?.focus({ preventScroll: true });
        pendingFocus.current = null;
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onNavigationFrame = (event: Event) => {
      navigationFrame = (event as CustomEvent<NavigationFrame | null>).detail;
      cancelAnimationFrame(frame);
      update();
    };
    journey.addEventListener(NAVIGATION_FRAME, onNavigationFrame);
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reducedMotion.addEventListener("change", schedule);
    const observer = new ResizeObserver(schedule);
    observer.observe(journey);
    return () => {
      cancelAnimationFrame(frame);
      journey.removeEventListener(NAVIGATION_FRAME, onNavigationFrame);
      delete journey.dataset.activeScene;
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reducedMotion.removeEventListener("change", schedule);
      observer.disconnect();
      journey.removeAttribute("data-services-entered");
      journey.removeAttribute("data-advantages-entered");
      journey.style.removeProperty("--advantages-exit-shift");
      journey.removeAttribute("data-services-exiting");
      journey.removeAttribute("data-navigation-entered");
      journey.style.removeProperty("--services-exit-time");
      heroScroll.destroy();
    };
  }, [root, pendingFocus]);
}
