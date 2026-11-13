"use client";

import { createScope, createTimeline, stagger, svg, type Timeline } from "animejs";
import { useEffect, useRef } from "react";

export default function HeroReveal({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLElement>(null);
  const timeline = useRef<Timeline | null>(null);

  useEffect(() => {
    const scope = createScope({ root }).add(() => {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
      const reveal = createTimeline({ autoplay: false, defaults: { ease: "inOut(3)" } })
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
        }, 4050);
      timeline.current = reveal;
      const play = () => {
        if (reducedMotion.matches) reveal.seek(reveal.duration);
        else reveal.restart();
      };
      play();
      reducedMotion.addEventListener("change", play);
      return () => reducedMotion.removeEventListener("change", play);
    });
    return () => {
      scope.revert();
      timeline.current = null;
    };
  }, []);

  function replay() {
    const reveal = timeline.current;
    if (!reveal) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      reveal.seek(reveal.duration);
    } else {
      reveal.restart();
    }
  }

  return (
    <main ref={root} className="hero">
      <noscript><style>{`.reveal-art { opacity: 1; } .replay { display: none; }`}</style></noscript>
      <h1 className="sr-only">Ratih Creative</h1>
      {children}
      <button className="replay" onClick={replay} aria-label="Putar ulang animasi logo">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M3 10a9 9 0 1 1 2 8M3 4v6h6" />
        </svg>
        Putar ulang
      </button>
    </main>
  );
}
