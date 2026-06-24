"use client";

import { useEffect, useRef } from "react";

/**
 * Hook to detect barcode scans from a physical hardware scanner acting as a keyboard wedge.
 * 
 * Hardware scanners rapidly type the characters and finish with an "Enter" key.
 * This hook listens to rapid keypresses globally and triggers a callback when a scan completes.
 */
export function useBarcodeScanner(onScan: (barcode: string) => void) {
  const barcodeBuffer = useRef("");
  const lastKeyTime = useRef(Date.now());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore key events if the user is typing in an input field or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        return;
      }

      const currentTime = Date.now();
      const timeDiff = currentTime - lastKeyTime.current;

      // If the time between keystrokes is too long (> 50ms), it's probably human typing.
      // Reset the buffer.
      if (timeDiff > 50) {
        barcodeBuffer.current = "";
      }

      if (e.key === "Enter") {
        // If we have accumulated a string and hit Enter, trigger the scan
        if (barcodeBuffer.current.length > 3) {
          onScan(barcodeBuffer.current);
          barcodeBuffer.current = ""; // Reset after scan
        }
      } else if (e.key.length === 1) {
        // Accumulate single characters (letters/numbers)
        barcodeBuffer.current += e.key;
      }

      lastKeyTime.current = currentTime;
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onScan]);
}
