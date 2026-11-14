import { ease } from "./config";

export function createSceneExits(journey: HTMLElement) {
  let previousPosition = 0;
  let advantagesExitStart: number | null = null;
  let servicesExitStart: number | null = null;
  return (position: number, reducedMotion: boolean) => {
    if (servicesExitStart === null && position < previousPosition && previousPosition > 0.85 && previousPosition <= 1.2) {
      servicesExitStart = previousPosition;
    }
    if (position <= 0.85 || position > 1.2 || (servicesExitStart !== null && position >= servicesExitStart)) {
      servicesExitStart = null;
    }
    const servicesExit = reducedMotion ? 0 : position > 1.2
      ? Math.min(1, (position - 1.2) / 0.45)
      : servicesExitStart === null ? 0
        : Math.min(1, (servicesExitStart - position) / Math.max(0.01, servicesExitStart - 0.85));
    // Scrub the same 1580ms entrance timeline backwards, including its stagger.
    journey.toggleAttribute("data-services-exiting", servicesExit > 0);
    journey.style.setProperty("--services-exit-time", `${1580 * (1 - servicesExit)}ms`);
    if (advantagesExitStart === null && position < previousPosition && previousPosition > 1.65) {
      advantagesExitStart = previousPosition;
    }
    if (position <= 1.65 || (advantagesExitStart !== null && position >= advantagesExitStart)) {
      advantagesExitStart = null;
    }
    const advantagesExit = advantagesExitStart === null || reducedMotion
      ? 0
      : ease((advantagesExitStart - position) / Math.max(0.01, advantagesExitStart - 1.65));
    journey.style.setProperty("--advantages-exit-shift", `${advantagesExit * 96}px`);
    previousPosition = position;
  };
}
