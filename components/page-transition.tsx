"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

/**
 * Smooth fade-slide page transition wrapper.
 * Used as the body of app/template.tsx so every route
 * gets a clean entrance animation on navigation.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);

  // Reset animation on route change
  useEffect(() => {
    setShow(false);
    setDisplayChildren(children);
    // RAF → next frame ensures the "hidden" state is painted first
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => setShow(true));
    });
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <div
      className={cn(
        "transition-all duration-500 ease-out will-change-[opacity,transform]",
        show
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-3",
      )}
    >
      {displayChildren}
    </div>
  );
}
