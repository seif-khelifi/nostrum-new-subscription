"use client";

import { useState, useEffect } from "react";

/**
 * Returns the pixel offset caused by the virtual keyboard.
 * Uses the Visual Viewport API to detect when the keyboard
 * shrinks the visible area and returns the difference.
 *
 * Falls back to 0 when the API is unavailable or on desktop.
 */
export function useKeyboardOffset(): number {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    function onResize() {
      // The difference between the layout viewport and the visual viewport
      // height tells us how much the keyboard is covering.
      const keyboardHeight = window.innerHeight - vv!.height;
      setOffset(keyboardHeight > 0 ? keyboardHeight : 0);
    }

    vv.addEventListener("resize", onResize);
    vv.addEventListener("scroll", onResize);

    return () => {
      vv.removeEventListener("resize", onResize);
      vv.removeEventListener("scroll", onResize);
    };
  }, []);

  return offset;
}
