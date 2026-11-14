"use client";

import { useEffect, useRef, type MouseEvent, type ReactNode } from "react";
import ServiceCards from "./service-cards";
import MobileNavigation from "./mobile-navigation";

const TRANSITION_DURATION_MS = 1500;

const ease = (value: number) => {
  const progress = Math.max(0, Math.min(1, value));
  return progress * progress * (3 - 2 * progress);
};

export default function SectionJourney({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const pendingFocus = useRef<string | null>(null);
  const scrollFrame = useRef(0);

  useEffect(() => {
    const cancelNavigation = () => {
      cancelAnimationFrame(scrollFrame.current);
      scrollFrame.current = 0;
      pendingFocus.current = null;
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " ", "Escape"].includes(event.key)) {
        cancelNavigation();
      }
    };
    window.addEventListener("wheel", cancelNavigation, { passive: true });
    window.addEventListener("touchstart", cancelNavigation, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", cancelNavigation);
    return () => {
      cancelNavigation();
      window.removeEventListener("wheel", cancelNavigation);
      window.removeEventListener("touchstart", cancelNavigation);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", cancelNavigation);
    };
  }, []);

  useEffect(() => {
    const journey = root.current!;
    const hero = journey.querySelector<HTMLElement>(".scene-hero")!;
    const services = journey.querySelector<HTMLElement>(".scene-services")!;
    const viewport = journey.querySelector<HTMLElement>(".journey-viewport")!;
    const navigation = journey.querySelectorAll<HTMLButtonElement>(".section-nav button, .mobile-nav button[data-scene]");
    const navigationPanel = journey.querySelector<HTMLElement>(".section-nav")!;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const artwork = hero.querySelector<HTMLElement>(".hero")!;
    const outlines = Array.from(hero.querySelectorAll<SVGPathElement>(".logo-outline, .creative-word path"));
    const lengths = outlines.map((path) => path.getTotalLength());
    outlines.forEach((path, index) => {
      path.style.setProperty("--exit-path-length", String(lengths[index]));
    });
    let exiting = false;
    let frame = 0;

    const update = () => {
      frame = 0;
      const bounds = journey.getBoundingClientRect();
      const distance = Math.max(1, bounds.height - viewport.clientHeight);
      const progress = Math.max(0, Math.min(1, -bounds.top / distance));
      // Artwork exits (0–55%), copy fades (55–75%), a pause (75–85%), then services (85–100%).
      const showServices = progress >= 0.75;
      navigation.forEach((button) => {
        if (button.dataset.scene === (showServices ? "services" : "hero")) {
          button.setAttribute("aria-current", "location");
        } else {
          button.removeAttribute("aria-current");
        }
      });
      const motionProgress = reducedMotion.matches ? Number(showServices) : progress;
      const sideProgress = Math.min(1, motionProgress / 0.4);
      const sideExit = 1 - Math.pow(1 - sideProgress, 3);
      journey.style.setProperty("--hero-side-exit", `${sideExit * 110}%`);
      journey.style.setProperty("--hero-copy-opacity", String(1 - ease((motionProgress - 0.55) / 0.2)));
      journey.style.setProperty("--hero-opacity", String(motionProgress < 0.75 ? 1 : 0));
      journey.style.setProperty("--services-opacity", String(ease((motionProgress - 0.85) / 0.15)));

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

      const outgoing = showServices ? hero : services;
      const incoming = showServices ? services : hero;
      incoming.inert = false;
      incoming.removeAttribute("aria-hidden");
      // Keep keyboard focus out of the layer that is disappearing.
      if (outgoing.contains(document.activeElement)) {
        incoming.querySelector<HTMLElement>("h1, h2")?.focus({ preventScroll: true });
      }
      outgoing.inert = true;
      outgoing.setAttribute("aria-hidden", "true");
      const navigationVisible = motionProgress > 0.85;
      journey.toggleAttribute("data-services-entered", navigationVisible);
      if (!navigationVisible && navigationPanel.contains(document.activeElement)) {
        incoming.querySelector<HTMLElement>("h1, h2")?.focus({ preventScroll: true });
      }
      navigationPanel.inert = !navigationVisible;
      navigationPanel.setAttribute("aria-hidden", String(!navigationVisible));
      if ((pendingFocus.current === "services" && progress >= 0.99)
        || (pendingFocus.current === "hero" && progress <= 0.01)) {
        incoming.querySelector<HTMLElement>("h1, h2")?.focus({ preventScroll: true });
        pendingFocus.current = null;
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reducedMotion.addEventListener("change", schedule);
    const observer = new ResizeObserver(schedule);
    observer.observe(journey);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reducedMotion.removeEventListener("change", schedule);
      observer.disconnect();
      journey.removeAttribute("data-services-entered");
      artwork.removeAttribute("data-exiting");
      outlines.forEach((path) => {
        path.style.removeProperty("--exit-path-length");
        path.style.removeProperty("--exit-path-offset");
        path.style.removeProperty("--exit-path-visibility");
      });
    };
  }, []);

  const navigate = (event: MouseEvent<HTMLDivElement>) => {
    const button = (event.target as Element).closest<HTMLButtonElement>("button[data-scene]");
    if (!button) return;
    const journey = root.current!;
    const viewport = journey.querySelector<HTMLElement>(".journey-viewport")!;
    const top = journey.getBoundingClientRect().top + window.scrollY;
    const destination = button.dataset.scene!;
    cancelAnimationFrame(scrollFrame.current);
    pendingFocus.current = destination;
    const distance = journey.offsetHeight - viewport.clientHeight;
    const target = top + (destination === "services" ? distance : 0);
    const start = window.scrollY;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches || Math.abs(target - start) < 1) {
      window.scrollTo({ top: target, behavior: "instant" });
      scrollFrame.current = 0;
      return;
    }

    // Drive scroll ourselves: native smooth scrolling has no configurable duration.
    // Each visual phase already applies its own easing to this linear progress.
    const duration = TRANSITION_DURATION_MS * Math.min(1, Math.abs(target - start) / Math.max(1, distance));
    const startedAt = performance.now();
    const tick = (now: number) => {
      const progress = reducedMotion.matches ? 1 : Math.min(1, (now - startedAt) / duration);
      window.scrollTo({ top: start + (target - start) * progress, behavior: "instant" });
      scrollFrame.current = progress < 1 ? requestAnimationFrame(tick) : 0;
    };
    scrollFrame.current = requestAnimationFrame(tick);
  };

  return (
    <div className="section-journey" ref={root} onClick={navigate}>
      <div className="journey-viewport">
        <div className="scene-layer scene-hero">{children}</div>
        <section id="layanan" className="scene-layer scene-services" aria-labelledby="services-title" aria-hidden="true" inert>
          <div className="services-content">
            <ServiceCards />
          </div>
        </section>
        <MobileNavigation />
        <nav className="section-nav" aria-label="Navigasi section" aria-hidden="true" inert>
          <button type="button" data-scene="hero" aria-label="Ke Beranda" aria-controls="beranda" aria-current="location">
            <span className="section-nav-label" aria-hidden="true">Beranda</span>
            <span className="section-nav-line" aria-hidden="true" />
          </button>
          <button type="button" data-scene="services" aria-label="Ke Layanan" aria-controls="layanan">
            <span className="section-nav-label" aria-hidden="true">Layanan</span>
            <span className="section-nav-line" aria-hidden="true" />
          </button>
        </nav>
      </div>
    </div>
  );
}
