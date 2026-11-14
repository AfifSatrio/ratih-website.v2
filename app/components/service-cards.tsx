"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const services = [
  { title: "Fotografi", icon: "camera", description: "Layanan fotografi yang fokus pada visual yang kuat, detail yang rapi, dan mood yang sesuai karakter brand. Cocok untuk kebutuhan produk, campaign, company profile, hingga dokumentasi event sampai acara penting seperti wisuda dan acara pernikahan dengan tampilan yang lebih estetik, rapi dan tetap standout." },
  { title: "Videografi", icon: "video", description: "Produksi video dengan pendekatan visual yang cinematic dan storytelling yang relevan. Mulai dari video branding, company video, creative video, hingga short cinematic clip. Semuanya dirancang untuk ningkatin persepsi dan daya tarik brand di mata audiens." },
  { title: "Branding & Visual Identity", icon: "chart-bar", description: "Ngebangun identitas brand dari dasar lewat logo, warna, tipografi, dan brand guideline yang terstruktur. Fokus kami adalah menciptakan identitas yang jelas, terstruktur, dan punya karakter yang kuat tapi mudah diingat, sehingga brand kalian tampil lebih baik dan profesional." },
  { title: "Graphic Design", icon: "brand-adobe-illustrator", description: "Desain visual untuk kebutuhan brand seperti poster, banner, feed, layout, dan kebutuhan promosi lainnya. Setiap desain dibuat dengan gaya modern dan komposisi yang bersih, biar pesan brand tersampaikan dengan kuat dan estetik." },
  { title: "Short Movie Production", icon: "movie", description: "Produksi short movie dengan kualitas visual yang cinematic dan konsep cerita yang matang. Cocok untuk karya kreatif, campaign story, maupun konten yang butuh pendekatan storytelling yang lebih dalam dan emosional." },
  { title: "Web Development", icon: "code", description: "Pengembangan website dengan desain modern, responsif, dan sesuai karakter brand. Mulai dari landing page, company profile, hingga website bisnis. Kami membantu membangun pengalaman digital yang mudah digunakan, informatif, dan mendukung kebutuhan brand kalian." },
];

export default function ServiceCards() {
  const viewport = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(1);
  const last = Math.ceil(services.length / visible) - 1;
  const pages = Array.from({ length: last + 1 }, (_, index) => services.slice(index * visible, (index + 1) * visible));

  const goTo = useCallback((index: number) => {
    const element = viewport.current;
    if (!element) return;
    const count = Number(getComputedStyle(element).getPropertyValue("--cards-per-view"));
    const target = Math.max(0, Math.min(Math.ceil(services.length / count) - 1, index));
    element.scrollTo({
      left: target * element.clientWidth,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  }, []);

  useEffect(() => {
    const element = viewport.current!;
    const observer = new ResizeObserver(() => {
      const count = Number(getComputedStyle(element).getPropertyValue("--cards-per-view"));
      setVisible(count);
      setActive(Math.min(Math.ceil(services.length / count) - 1, Math.round(element.scrollLeft / element.clientWidth)));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

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
        onKeyDown={(event) => {
          if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            event.preventDefault();
            goTo(active + (event.key === "ArrowRight" ? 1 : -1));
          }
        }}
        onScroll={() => {
          const element = viewport.current!;
          setActive(Math.max(0, Math.min(last, Math.round(element.scrollLeft / element.clientWidth))));
        }}>
        {pages.map((page, pageIndex) => (
          <div className="services-page" key={pageIndex} data-active={pageIndex === active} role="group" aria-roledescription="slide" aria-label={`${pageIndex + 1} dari ${pages.length}`}>
            {page.map((service, index) => (
              <article className="service-card" key={service.title}>
                <div className="service-card-copy">
                  <span className="service-icon" aria-hidden="true">
                    <span className="service-icon-symbol" style={{
                      maskImage: `url(/images/ratih/assets/${service.icon}.svg)`,
                      WebkitMaskImage: `url(/images/ratih/assets/${service.icon}.svg)`,
                      animationDelay: `${index * 120}ms`,
                    }} />
                  </span>
                  <h3>{service.title}</h3>
                  <p className="service-card-description">{service.description}</p>
                </div>
              </article>
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
