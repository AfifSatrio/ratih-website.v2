"use client";

import { useRef } from "react";
import HeroDecorations from "./hero-decorations";
import { useHeroReveal } from "../hooks/use-hero-reveal";

export default function HeroReveal({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLElement>(null);

  useHeroReveal(root);

  return (
    <section ref={root} id="beranda" className="hero" aria-labelledby="hero-title">
      <noscript><style>{`.hero-side { opacity: 1; } .reveal-art { opacity: 1; } .hero-copy { visibility: visible; } .logo-fill { opacity: 0; } .logo-outline { opacity: .24; stroke-width: 2; } .creative-word { fill: none; stroke: #fff; opacity: .16; }`}</style></noscript>
      <HeroDecorations />
      <div className="hero-layout">
        {children}
        <div className="hero-copy">
          <h1 id="hero-title" tabIndex={-1} className="hero-title hero-enter">
            RATIH<br />CREATIVE<br /><span>MEDIA</span>
          </h1>
          <p className="hero-description hero-enter">
            Sebuah Production House dengan tim sederhana yang bergerak di bidang jasa Fotografi,
            Videografi dan Desain Grafis. Berdiri dari kolaborasi kreativitas dan hobi yang sejalan.
          </p>
          <button className="hero-cta hero-enter rounded-md" type="button" data-scene="services">
            Jelajahi lebih lanjut
          </button>
        </div>
      </div>
    </section>
  );
}
