"use client";

import { useEffect, useState } from "react";

/**
 * Returns true on touch-only devices (phones, some tablets).
 * Desktop / mouse devices => false
 */
export function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // coarse pointer = finger / touch screen
    const mq = window.matchMedia("(pointer: coarse)");

    const update = () => setIsTouch(mq.matches);
    update();

    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  return isTouch;
}
