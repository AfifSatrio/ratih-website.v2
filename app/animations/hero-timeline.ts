import { createTimeline, stagger, svg } from "animejs";

const DECORATIONS_START = 4050;

export function createHeroTimeline(stage: HTMLElement, onDecorationsReady: () => void) {
  return createTimeline({ autoplay: false, defaults: { ease: "inOut(3)" } })
    .add(stage, { scale: [0.82, 0.82], duration: 1 }, 0)
    .add(".reveal-art", { opacity: [0, 1], duration: 700 }, 200)
    .add(".construction", { opacity: [0, 0.65], duration: 600 }, 400)
    .add(svg.createDrawable(".construction line"), {
      draw: ["0 0", "0 1"], duration: 1000, delay: stagger(65),
    }, 400)
    .add(svg.createDrawable(".logo-outline"), {
      draw: ["0 0", "0 1"], duration: 2100, delay: stagger(110), ease: "inOutSine",
    }, 850)
    .add(".construction", { opacity: 0, duration: 700 }, 2700)
    .add(".logo-fill", { opacity: [0, 1], duration: 950, delay: stagger(90) }, 3150)
    .add(".logo-outline", { opacity: [1, 0], duration: 650 }, 3650)
    .add(".creative-letter", {
      opacity: [0, 1], translateY: [14, 0], duration: 700, delay: stagger(110), ease: "out(3)",
    }, 4050)
    .stretch(3000)
    .add(stage, { scale: 1, duration: 1200, ease: "inOutQuint" }, 3000)
    .add(".logo-fill", { opacity: 0, duration: 700 }, 3000)
    .add(".logo-outline", { opacity: 0.24, strokeWidth: 2, duration: 800 }, 3000)
    .set(".creative-word path", { stroke: "#FFFFFF", strokeWidth: 1.5 }, 3000)
    .add(".creative-word", { fillOpacity: 0, opacity: 0.16, duration: 700 }, 3000)
    .set(".hero-copy", { visibility: "visible" }, 3550)
    .add(".hero-enter", {
      opacity: [0, 1], translateY: [24, 0], duration: 800,
      delay: stagger(140), ease: "out(3)",
    }, 3550)
    .add(".hero-side-left", {
      opacity: [0, 1], translateX: ["-50%", "0%"], duration: 1000, ease: "out(3)",
    }, DECORATIONS_START)
    .add(".hero-side-right", {
      opacity: [0, 1], translateX: ["50%", "0%"], duration: 1000, ease: "out(3)",
    }, DECORATIONS_START)
    .call(onDecorationsReady, DECORATIONS_START + 1000);
}
