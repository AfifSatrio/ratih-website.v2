"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const panel = dialog.current;
    if (!panel) return;
    if (!isOpen) {
      if (panel.open) panel.close();
      return;
    }
    panel.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
      if (panel.open) panel.close();
    };
  }, [isOpen]);

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <a href="#beranda" className="header-brand" aria-label="Ratih Creative — beranda">
          <Image src="/images/ratih/ratih-logomark.svg" alt="Ratih Creative" width={58} height={52} priority />
        </a>
        <button
          className="sidebar-toggle"
          type="button"
          aria-label="Buka sidebar"
          aria-controls="site-sidebar"
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          onClick={() => setIsOpen(true)}
        >
          <span /><span />
        </button>
      </div>
      <dialog
        id="site-sidebar"
        ref={dialog}
        className="site-sidebar"
        aria-label="Sidebar"
        onClose={() => setIsOpen(false)}
        onClick={(event) => {
          const bounds = event.currentTarget.getBoundingClientRect();
          if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) {
            setIsOpen(false);
          }
        }}
      >
        <button className="sidebar-toggle sidebar-close" type="button" aria-label="Tutup sidebar" onClick={() => setIsOpen(false)}>
          <span /><span />
        </button>
        {/* Sidebar menu content will be added in the next design step. */}
      </dialog>
    </header>
  );
}
