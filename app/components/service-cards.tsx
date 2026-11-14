"use client";

import { useServiceCarousel } from "../hooks/use-service-carousel";
import { services } from "../data/services";
import ServiceCard from "./service-card";

export default function ServiceCards() {
  const { viewport, active, visible, last, goTo, onKeyDown, onScroll } = useServiceCarousel(services.length);
  const pages = Array.from({ length: last + 1 }, (_, index) => services.slice(index * visible, (index + 1) * visible));

  return (
    <div className="services-carousel" role="region" aria-roledescription="carousel" aria-label="Layanan Ratih">
      <div className="services-heading">
        <h2 id="services-title" tabIndex={-1}>Apa yang<br /><span>kami lakukan.</span></h2>
        <div className="service-carousel-controls">
          <button type="button" aria-label="Layanan sebelumnya" aria-controls="services-slides" disabled={active === 0} onClick={() => goTo(active - 1)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 5-7 7 7 7" /></svg>
          </button>
          <button type="button" aria-label="Layanan berikutnya" aria-controls="services-slides" disabled={active === last} onClick={() => goTo(active + 1)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 5 7 7-7 7" /></svg>
          </button>
        </div>
      </div>
      <div id="services-slides" className="services-track" ref={viewport} tabIndex={0}
        aria-label="Kartu layanan, geser untuk melihat layanan lainnya"
        onKeyDown={onKeyDown}
        onScroll={onScroll}>
        {pages.map((page, pageIndex) => (
          <div className="services-page" key={pageIndex} data-active={pageIndex === active} role="group" aria-roledescription="slide" aria-label={`${pageIndex + 1} dari ${pages.length}`}>
            {page.map((service, index) => (
              <ServiceCard key={service.title} service={service} index={index} />
            ))}
          </div>
        ))}
      </div>
      <div className="service-carousel-indicators" role="group" aria-label="Posisi carousel">
        {Array.from({ length: last + 1 }, (_, index) => (
          <button key={index} type="button" aria-label={`Tampilkan mulai dari ${services[index * visible].title}`}
            aria-current={active === index ? "true" : undefined} aria-controls="services-slides"
            onClick={() => goTo(index)}><span /></button>
        ))}
      </div>
    </div>
  );
}
