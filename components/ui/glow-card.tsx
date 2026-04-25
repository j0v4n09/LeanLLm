"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: "blue" | "purple" | "green" | "red" | "orange";
  size?: "sm" | "md" | "lg";
  width?: string | number;
  height?: string | number;
  customSize?: boolean;
}

const glowColorMap = {
  blue: { base: 220, spread: 200 },
  purple: { base: 280, spread: 300 },
  green: { base: 120, spread: 200 },
  red: { base: 0, spread: 200 },
  orange: { base: 30, spread: 200 },
};

const sizeMap = {
  sm: "w-48 h-64",
  md: "w-64 h-80",
  lg: "w-80 h-96",
};

export function GlowCard({
  children,
  className = "",
  glowColor = "blue",
  size = "md",
  width,
  height,
  customSize = false,
}: GlowCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const syncPointer = (event: PointerEvent) => {
      const { clientX: x, clientY: y } = event;

      if (cardRef.current) {
        cardRef.current.style.setProperty("--x", x.toFixed(2));
        cardRef.current.style.setProperty("--xp", (x / window.innerWidth).toFixed(2));
        cardRef.current.style.setProperty("--y", y.toFixed(2));
        cardRef.current.style.setProperty("--yp", (y / window.innerHeight).toFixed(2));
      }
    };

    document.addEventListener("pointermove", syncPointer);
    return () => document.removeEventListener("pointermove", syncPointer);
  }, []);

  const { base, spread } = glowColorMap[glowColor];

  const styles: React.CSSProperties & Record<string, string> = {
    "--base": String(base),
    "--spread": String(spread),
    "--radius": "24",
    "--border": "2",
    "--backdrop": "hsl(240 10% 7% / 0.72)",
    "--backup-border": "var(--backdrop)",
    "--size": "220",
    "--outer": "1",
    "--border-size": "calc(var(--border, 2) * 1px)",
    "--spotlight-size": "calc(var(--size, 150) * 1px)",
    "--hue": "calc(var(--base) + (var(--xp, 0) * var(--spread, 0)))",
    "--saturation": "100",
    "--lightness": "62",
    "--bg-spot-opacity": "0.16",
    "--border-spot-opacity": "1",
    "--border-light-opacity": "0.9",
    backgroundImage: `radial-gradient(
      var(--spotlight-size) var(--spotlight-size) at
      calc(var(--x, 0) * 1px)
      calc(var(--y, 0) * 1px),
      hsl(var(--hue, 210) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 70) * 1%) / var(--bg-spot-opacity, 0.1)),
      transparent
    )`,
    backgroundColor: "var(--backdrop, transparent)",
    backgroundSize: "calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)))",
    backgroundPosition: "50% 50%",
    backgroundAttachment: "fixed",
    border: "var(--border-size) solid var(--backup-border)",
    position: "relative",
    touchAction: "none",
  };

  if (width !== undefined) {
    styles.width = typeof width === "number" ? `${width}px` : width;
  }

  if (height !== undefined) {
    styles.height = typeof height === "number" ? `${height}px` : height;
  }

  return (
    <div
      ref={cardRef}
      data-glow
      style={styles}
      className={cn(
        !customSize && sizeMap[size],
        !customSize && "aspect-[3/4]",
        "relative grid grid-rows-[1fr_auto] gap-4 rounded-[calc(var(--radius)*1px)] p-4 shadow-[0_1rem_2rem_-1rem_black] backdrop-blur-[5px]",
        className,
      )}
    >
      <div data-glow />
      {children}
    </div>
  );
}
