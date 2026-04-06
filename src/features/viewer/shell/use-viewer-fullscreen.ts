"use client";

import { type RefObject, useCallback, useEffect, useState } from "react";

/**
 * Browser Fullscreen API for a viewer workspace element (not the whole OS).
 */
export function useViewerFullscreen(containerRef: RefObject<HTMLElement | null>) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    function sync() {
      const el = containerRef.current;
      setActive(Boolean(el && document.fullscreenElement === el));
    }
    sync();
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, [containerRef]);

  const toggle = useCallback(async () => {
    const el = containerRef.current;
    if (!el) return;
    try {
      if (document.fullscreenElement === el) {
        await document.exitFullscreen();
      } else {
        await el.requestFullscreen();
      }
    } catch {
      // ignore unsupported / blocked fullscreen
    }
  }, [containerRef]);

  return { active, toggle };
}
