"use client";

import { animate, createScope, createTimeline, stagger, svg } from "animejs";
import { useEffect, useRef } from "react";
import HeroDecorations from "./hero-decorations";

const DECORATIONS_START = 4050;

export default function HeroReveal({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = root.current;
    if (!hero) return;

    let frame = 0;
    const updateOpacity = () => {
      frame = 0;
      const bounds = hero.getBoundingClientRect();
      const fadeDistance = Math.max(1, Math.min(bounds.height, window.innerHeight) * 0.6);
      const progress = Math.min(1, Math.max(0, -bounds.top / fadeDistance));
      // Fade parent layers so the intro can still animate its own opacity independently.
      const opacity = 1 - progress * progress * (3 - 2 * progress);
      hero.style.setProperty("--hero-art-opacity", String(opacity));
    };
    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateOpacity);
    };

    updateOpacity();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    const resizeObserver = new ResizeObserver(scheduleUpdate);
    resizeObserver.observe(hero);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      resizeObserver.disconnect();
      hero.style.removeProperty("--hero-art-opacity");
    };
  }, []);

  useEffect(() => {
    const scope = createScope({ root }).add(() => {
      const stage = root.current!.querySelector<HTMLElement>(".hero-stage")!;
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
      let inView = true;
      const driftLeft = animate(".hero-drift-left", {
        translateY: ["0%", "-50%"], duration: 30000, ease: "linear", loop: true, autoplay: false,
      });
      const driftRight = animate(".hero-drift-right", {
        translateY: ["-50%", "0%"], duration: 30000, ease: "linear", loop: true, autoplay: false,
      });
      const reveal = createTimeline({ autoplay: false, defaults: { ease: "inOut(3)" } })
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
        .call(() => {
          if (inView && !reducedMotion.matches) {
            driftLeft.play();
            driftRight.play();
          }
        }, DECORATIONS_START + 1000);
      const play = () => {
        driftLeft.pause();
        driftRight.pause();
        driftLeft.seek(0);
        driftRight.seek(0);
        if (reducedMotion.matches) reveal.seek(reveal.duration);
        else reveal.restart();
      };
      const visibility = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        if (!inView) {
          driftLeft.pause();
          driftRight.pause();
        } else if (reveal.completed && !reducedMotion.matches) {
          driftLeft.play();
          driftRight.play();
        }
      });
      visibility.observe(root.current!);
      play();
      reducedMotion.addEventListener("change", play);
      return () => {
        reducedMotion.removeEventListener("change", play);
        visibility.disconnect();
      };
    });
    return () => {
      scope.revert();
    };
  }, []);

  return (
    <section ref={root} id="beranda" className="hero" aria-labelledby="hero-title">
      <noscript><style>{`.hero-side { opacity: 1; } .reveal-art { opacity: 1; } .hero-copy { visibility: visible; } .logo-fill { opacity: 0; } .logo-outline { opacity: .24; stroke-width: 2; } .creative-word { fill: none; stroke: #fff; opacity: .16; }`}</style></noscript>
      <HeroDecorations />
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
          <button className="hero-cta hero-enter rounded-md" type="button" disabled>
            Jelajahi lebih lanjut
          </button>
        </div>
      </div>
    </section>
  );
}
