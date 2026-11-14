"use client";

import { createScope, createTimeline, stagger, svg } from "animejs";
import { useEffect, useRef, type ReactNode } from "react";

export default function AdvantagesReveal({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = root.current!;
    const journey = element.closest<HTMLElement>(".section-journey")!;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const scope = createScope({ root }).add(() => {
      const years = element.querySelector<HTMLElement>("[data-count='years']")!;
      const clients = element.querySelector<HTMLElement>("[data-count='clients']")!;
      const counts = { years: 0, clients: 0 };
      const renderCounts = () => {
        years.textContent = String(Math.round(counts.years));
        clients.textContent = String(Math.round(counts.clients));
      };
      const outlinePaths = element.querySelectorAll<SVGPathElement>(".coverage-outline path");
      // Map sequence: sketch 0–1125, pins 1125–1575, routes 1575–2175, labels 2175–2500 ms.
      const sketchDuration = 875;
      const sketchStagger = 250 / Math.max(1, outlinePaths.length - 1);
      const sketchStart = 0;
      const pinStart = 1125;
      const routesStart = 1575;
      const labelsStart = 2175;

      const timeline = createTimeline({ autoplay: false, defaults: { ease: "out(3)" } })
        .add(".advantages-map h3", {
          opacity: [0, 1], translateY: [-40, 0], duration: 800,
        }, 0)
        .add(".advantages-copy h2, .advantages-description", {
          opacity: [0, 1], translateX: [-64, 0], duration: 900, delay: stagger(140),
        }, 0)
        .add(".advantages-stats > div", {
          opacity: [0, 1], translateY: [40, 0], duration: 850, delay: stagger(160),
        }, 300)
        .add(counts, {
          years: [0, 4], clients: [0, 50], duration: 1500, onUpdate: renderCounts,
        }, 450)
        .add(svg.createDrawable(outlinePaths), {
          draw: ["0 0", "0 1"], duration: sketchDuration, delay: stagger(sketchStagger), ease: "inOutSine",
        }, sketchStart)
        .add(".coverage-pin", {
          opacity: [0, 1], translateY: [-52, 0], duration: 300, delay: stagger(75),
        }, pinStart)
        .add(".coverage-route-reveal", {
          strokeDashoffset: [1, 0], duration: 600, ease: "inOutSine",
        }, routesStart)
        .add(".coverage-city-label", {
          opacity: [0, 1], translateY: [8, 0], duration: 225, delay: stagger(50),
        }, labelsStart);

      let entered = false;
      const sync = (force = false) => {
        const visible = journey.hasAttribute("data-advantages-entered");
        if (!force && entered === visible) return;
        entered = visible;
        timeline.pause();
        if (!visible) {
          timeline.seek(0);
          counts.years = 0;
          counts.clients = 0;
          renderCounts();
        } else if (reducedMotion.matches) {
          timeline.seek(timeline.duration);
          counts.years = 4;
          counts.clients = 50;
          renderCounts();
        } else {
          timeline.restart();
        }
      };
      const observer = new MutationObserver(() => sync());
      observer.observe(journey, { attributes: true, attributeFilter: ["data-advantages-entered"] });
      const onMotionChange = () => sync(true);
      const onVisibilityChange = () => {
        if (document.hidden) timeline.pause();
        else if (entered && !reducedMotion.matches && !timeline.completed) timeline.play();
      };
      reducedMotion.addEventListener("change", onMotionChange);
      document.addEventListener("visibilitychange", onVisibilityChange);
      sync(true);
      return () => {
        observer.disconnect();
        reducedMotion.removeEventListener("change", onMotionChange);
        document.removeEventListener("visibilitychange", onVisibilityChange);
      };
    });
    return () => scope.revert();
  }, []);

  return <div className="advantages-content" ref={root}>{children}</div>;
}
