import { SCENE_POSITIONS } from "./config";

export type SceneName = keyof typeof SCENE_POSITIONS;
export type NavigationFrame = { scene: SceneName; position: number };
export const NAVIGATION_FRAME = "journey-navigation-frame";

const EXIT_POSITIONS: Record<SceneName, number> = {
  hero: 0.75,
  services: 1.65,
  advantages: 1.65,
};

// Animate only the departing scene; the document stays at its original scroll position.
export function getNavigationExit(scene: SceneName, start: number, progress: number): NavigationFrame {
  const amount = Math.max(0, Math.min(1, progress));
  return { scene, position: start + (EXIT_POSITIONS[scene] - start) * amount };
}

// Reuse the hero exit curve in reverse instead of restarting the opening sketch.
export function getHeroEntrance(progress: number): NavigationFrame {
  return getNavigationExit("hero", 0, 1 - progress);
}

export function renderNavigationFrame(journey: HTMLElement, exit: NavigationFrame | null) {
  journey.dispatchEvent(new CustomEvent(NAVIGATION_FRAME, { detail: exit }));
}
