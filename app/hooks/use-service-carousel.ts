"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";

export function useServiceCarousel(itemCount: number) {
  const viewport = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(1);
  const last = Math.ceil(itemCount / visible) - 1;

  const goTo = useCallback((index: number) => {
    const element = viewport.current;
    if (!element) return;
    const count = Number(getComputedStyle(element).getPropertyValue("--cards-per-view"));
    const target = Math.max(0, Math.min(Math.ceil(itemCount / count) - 1, index));
    element.scrollTo({
      left: target * element.clientWidth,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  }, [itemCount]);

  useEffect(() => {
    const element = viewport.current!;
    const observer = new ResizeObserver(() => {
      const count = Number(getComputedStyle(element).getPropertyValue("--cards-per-view"));
      setVisible(count);
      setActive(Math.min(Math.ceil(itemCount / count) - 1, Math.round(element.scrollLeft / element.clientWidth)));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [itemCount]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(active + (event.key === "ArrowRight" ? 1 : -1));
    }
  };
  const onScroll = () => {
    const element = viewport.current!;
    setActive(Math.max(0, Math.min(last, Math.round(element.scrollLeft / element.clientWidth))));
  };

  return { viewport, active, visible, last, goTo, onKeyDown, onScroll };
}
