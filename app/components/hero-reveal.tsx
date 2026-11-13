"use client";

import { createScope, createTimeline, stagger, svg } from "animejs";
import { useEffect, useRef } from "react";

export default function HeroReveal({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const scope = createScope({ root }).add(() => {
      const stage = root.current!.querySelector<HTMLElement>(".hero-stage")!;
      const bounds = stage.getBoundingClientRect();
      const introSize = Math.min(window.innerWidth, window.innerHeight, 900);
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
      const reveal = createTimeline({ autoplay: false, defaults: { ease: "inOut(3)" } })
        .add(stage, {
          translateX: [window.innerWidth / 2 - bounds.left - bounds.width / 2, window.innerWidth / 2 - bounds.left - bounds.width / 2],
          translateY: [window.innerHeight / 2 - bounds.top - bounds.height / 2, window.innerHeight / 2 - bounds.top - bounds.height / 2],
          scale: [introSize / bounds.width, introSize / bounds.width], duration: 1,
        }, 0)
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
        .add(stage, { translateX: 0, translateY: 0, scale: 1, duration: 1200, ease: "inOutQuint" }, 3000)
        .set(".hero-copy", { visibility: "visible" }, 3950)
        .add(".hero-enter", {
          opacity: [0, 1], translateY: [24, 0], duration: 800,
          delay: stagger(140), ease: "out(3)",
        }, 3950);
      const play = () => {
        if (reducedMotion.matches) reveal.seek(reveal.duration);
        else reveal.restart();
      };
      play();
      reducedMotion.addEventListener("change", play);
      // Finish on resize so the logo settles into the CSS layout at any viewport size.
      const settle = () => reveal.seek(reveal.duration);
      window.addEventListener("resize", settle);
      return () => {
        reducedMotion.removeEventListener("change", play);
        window.removeEventListener("resize", settle);
      };
    });
    return () => {
      scope.revert();
    };
  }, []);

  return (
    <section ref={root} className="hero" aria-labelledby="hero-title">
      <noscript><style>{`.reveal-art { opacity: 1; } .hero-copy { visibility: visible; }`}</style></noscript>
      <div className="hero-layout">
        {children}
        <div className="hero-copy">
          <h1 id="hero-title" className="hero-title hero-enter">
            RATIH<br />CREATIVE<br /><span>MEDIA</span>
          </h1>
          <p className="hero-description hero-enter">
            Sebuah Production House dengan tim sederhana yang bergerak di bidang jasa Fotografi,
            Videografi dan Desain Grafis. Berdiri dari kolaborasi kreativitas dan hobi yang sejalan.
          </p>
          <a className="hero-cta hero-enter" href="#layanan">
            Jelajahi lebih lanjut <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
