"use client";

import { useEffect, useRef, useState } from "react";

export default function MobileNavigation() {
  const panel = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const mobile = window.matchMedia("(max-width: 639px)");
    const closeOnDesktop = () => {
      if (!mobile.matches) panel.current?.close();
    };
    mobile.addEventListener("change", closeOnDesktop);
    return () => {
      document.body.style.overflow = previousOverflow;
      mobile.removeEventListener("change", closeOnDesktop);
    };
  }, [open]);

  return (
    <div className="mobile-nav">
      <button className="mobile-nav-toggle" type="button" aria-label="Buka menu navigasi"
        aria-controls="mobile-navigation-panel" aria-haspopup="dialog" aria-expanded={open}
        onClick={() => { panel.current?.showModal(); setOpen(true); }}>
        <span /><span /><span />
      </button>
      <dialog ref={panel} id="mobile-navigation-panel" className="mobile-nav-panel" aria-label="Menu navigasi"
        onClose={() => setOpen(false)}
        onClick={(event) => {
          if (event.target !== event.currentTarget) return;
          const bounds = event.currentTarget.getBoundingClientRect();
          if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) {
            panel.current?.close();
          }
        }}>
        <div className="mobile-nav-heading">
          <p>MENU</p>
          <button className="mobile-nav-close" type="button" aria-label="Tutup menu navigasi" onClick={() => panel.current?.close()}>×</button>
        </div>
        <nav aria-label="Navigasi mobile">
          <button type="button" data-scene="hero" aria-controls="beranda" onClick={() => panel.current?.close()}>Beranda</button>
          <button type="button" data-scene="services" aria-controls="layanan" onClick={() => panel.current?.close()}>Layanan</button>
        </nav>
      </dialog>
    </div>
  );
}
