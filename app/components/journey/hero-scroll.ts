import { ease } from "./config";

export function createHeroScroll(journey: HTMLElement, hero: HTMLElement) {
  const artwork = hero.querySelector<HTMLElement>(".hero")!;
  const outlines = Array.from(hero.querySelectorAll<SVGPathElement>(".logo-outline, .creative-word path"));
  const lengths = outlines.map((path) => path.getTotalLength());
  outlines.forEach((path, index) => {
    path.style.setProperty("--exit-path-length", String(lengths[index]));
  });
  let exiting = false;
  return {
    update(motionProgress: number) {
      const sideProgress = Math.min(1, motionProgress / 0.4);
      const sideExit = 1 - Math.pow(1 - sideProgress, 3);
      journey.style.setProperty("--hero-side-exit", `${sideExit * 110}%`);
      journey.style.setProperty("--hero-copy-opacity", String(1 - ease((motionProgress - 0.55) / 0.2)));
      journey.style.setProperty("--hero-opacity", String(motionProgress < 0.75 ? 1 : 0));
      if (exiting !== (motionProgress > 0)) {
        exiting = motionProgress > 0;
        artwork.dispatchEvent(new CustomEvent("hero-scroll-exit", { detail: exiting }));
      }
      artwork.toggleAttribute("data-exiting", exiting);
      outlines.forEach((path, index) => {
        // Reverse the drawing order, with a short stagger between strokes.
        const delay = ((outlines.length - 1 - index) / Math.max(1, outlines.length - 1)) * 0.16;
        const erased = ease((motionProgress - delay) / 0.39);
        path.style.setProperty("--exit-path-offset", String(lengths[index] * erased));
        path.style.setProperty("--exit-path-visibility", erased >= 1 ? "hidden" : "visible");
      });
    },
    destroy() {
      artwork.removeAttribute("data-exiting");
      outlines.forEach((path) => {
        path.style.removeProperty("--exit-path-length");
        path.style.removeProperty("--exit-path-offset");
        path.style.removeProperty("--exit-path-visibility");
      });
    },
  };
}
