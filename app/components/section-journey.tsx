"use client";

import { useRef, type ReactNode } from "react";
import ServiceCards from "./service-cards";
import MobileNavigation from "./mobile-navigation";
import SectionNavigation from "./section-navigation";
import { useJourneyNavigation } from "../hooks/use-journey-navigation";
import { useJourneyScenes } from "../hooks/use-journey-scenes";

export default function SectionJourney({ children, advantages }: { children: ReactNode; advantages: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const { navigate, pendingFocus } = useJourneyNavigation(root);
  useJourneyScenes(root, pendingFocus);

  return (
    <div className="section-journey" ref={root} onClick={navigate}>
      <div className="journey-viewport">
        <div className="scene-layer scene-hero">{children}</div>
        <section id="layanan" className="scene-layer scene-services" aria-labelledby="services-title" aria-hidden="true" inert>
          <div className="services-content">
            <ServiceCards />
          </div>
        </section>
        <section id="keunggulan" className="scene-layer scene-advantages" aria-labelledby="advantages-title" aria-hidden="true" inert>
          {advantages}
        </section>
        <MobileNavigation />
        <SectionNavigation />
      </div>
    </div>
  );
}
