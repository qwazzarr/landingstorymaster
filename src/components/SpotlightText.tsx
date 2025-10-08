import React, { useRef, useEffect } from "react";

type Color = string;

type Props = {
  text: string;
  baseColors: Color[];      // length >= text.length (cycle if shorter)
  highlightColors: Color[]; // length >= text.length (cycle if shorter)
  radius?: number;          // px
  softEdge?: number;        // px, feathered edge
  fontSize?: string;
  gap?: string;
};

export default function SpotlightText({
  text,
  baseColors,
  highlightColors,
  radius = 80,
  softEdge = 20,      // fade the edge a bit
  fontSize = "64px",
  gap = "4px",
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const updatePosition = (x: number, y: number) => {
      const r = el.getBoundingClientRect();
      const posX = x - r.left;
      const posY = y - r.top;
      el.style.setProperty("--mx", `${posX}px`);
      el.style.setProperty("--my", `${posY}px`);
    };

    const onMove = (e: MouseEvent) => {
      updatePosition(e.clientX, e.clientY);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        updatePosition(touch.clientX, touch.clientY);
      }
    };

    const onLeave = () => {
      el.style.setProperty("--mx", `-9999px`);
      el.style.setProperty("--my", `-9999px`);
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    el.addEventListener("touchmove", onTouchMove);
    el.addEventListener("touchend", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onLeave);
    };
  }, []);

  // helpers to cycle colors if arrays are shorter
  const base = (i: number) => baseColors[i % baseColors.length];
  const hi = (i: number) => highlightColors[i % highlightColors.length];

  // CSS variables for radius and feathering
  const rInner = radius - softEdge;
  const rOuter = radius;

  return (
    <div
      ref={wrapRef}
      style={{
        // Stack two identical rows
        display: "grid",
        placeItems: "center",
        width: "fit-content",
        position: "relative",
        // mouse vars
        // @ts-ignore CSS custom props
        ["--mx" as any]: "-9999px",
        ["--my" as any]: "-9999px",
        // mask radii
        ["--rInner" as any]: `${Math.max(0, rInner)}px`,
        ["--rOuter" as any]: `${Math.max(0, rOuter)}px`,
        fontSize,
        lineHeight: 1.1,
      }}
    >
      {/* bottom layer = base colors */}
      <div
        aria-hidden
        style={{
          gridArea: "1 / 1",
          display: "flex",
          gap,
          fontWeight: 800,
          whiteSpace: "pre",
          userSelect: "none",
        }}
      >
        {text.split("").map((ch, i) => (
          <span key={`b-${i}`} style={{ color: base(i), transition: "color 120ms" }}>
            {ch}
          </span>
        ))}
      </div>

      {/* top layer = highlight colors, revealed only near pointer by mask */}
      <div
        style={{
          gridArea: "1 / 1",
          display: "flex",
          gap,
          fontWeight: 800,
          whiteSpace: "pre",
          userSelect: "none",
          pointerEvents: "none", // let mouse reach the wrapper
          // Mask that follows the mouse; only inside the circle is visible.
          // Hard center up to rInner, then feather to rOuter.
          WebkitMaskImage:
            `radial-gradient(circle at var(--mx) var(--my), ` +
            `#000 0 var(--rInner), rgba(0,0,0,0.85) var(--rInner), transparent var(--rOuter))`,
          maskImage:
            `radial-gradient(circle at var(--mx) var(--my), ` +
            `#000 0 var(--rInner), rgba(0,0,0,0.85) var(--rInner), transparent var(--rOuter))`,
        }}
      >
        {text.split("").map((ch, i) => (
          <span key={`h-${i}`} style={{ color: hi(i) }}>
            {ch}
          </span>
        ))}
      </div>
    </div>
  );
}