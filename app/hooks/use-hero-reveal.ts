"use client";

import { animate, createScope } from "animejs";
import { useEffect, type RefObject } from "react";
import { createHeroTimeline } from "../animations/hero-timeline";

export function useHeroReveal(root: RefObject<HTMLElement | null>) {
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
      const reveal = createHeroTimeline(stage, () => {
        if (inView && !reducedMotion.matches) {
          driftLeft.play();
          driftRight.play();
        }
      });
      const play = () => {
        driftLeft.pause();
        driftRight.pause();
        driftLeft.seek(0);
        driftRight.seek(0);
        if (reducedMotion.matches) reveal.seek(reveal.duration);
        else reveal.restart();
      };
      const onScrollExit = (event: Event) => {
        const exiting = (event as CustomEvent<boolean>).detail;
        if (exiting) {
          // A scroll during the intro should exit the finished artwork, not fight its drawing.
          if (!reveal.completed) reveal.seek(reveal.duration);
          driftLeft.pause();
          driftRight.pause();
        } else if (inView && !reducedMotion.matches) {
          driftLeft.play();
          driftRight.play();
        }
      };
      const hero = root.current!;
      hero.addEventListener("hero-scroll-exit", onScrollExit);
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
      const onMotionChange = () => {
        // A preference change must never replay the one-time opening sketch.
        if (reducedMotion.matches) {
          reveal.pause();
          reveal.seek(reveal.duration);
          driftLeft.pause();
          driftRight.pause();
        } else if (inView && !hero.hasAttribute("data-exiting") && reveal.completed) {
          driftLeft.play();
          driftRight.play();
        }
      };
      reducedMotion.addEventListener("change", onMotionChange);
      return () => {
        hero.removeEventListener("hero-scroll-exit", onScrollExit);
        reducedMotion.removeEventListener("change", onMotionChange);
        visibility.disconnect();
      };
    });
    return () => {
      scope.revert();
    };
  }, [root]);
}
