"use client";

import { motion } from "motion/react";
import { useCallback, useEffect, useId, useRef, useState } from "react";

/** Props cho {@link WordmarkFooter}. */
interface WordmarkFooterProps {
  /** Tên thương hiệu hiển thị trong SVG wordmark (mặc định `"Huỳnh Sang"`). */
  brandName?: string;
}

const STYLE = `
.wf{
  --wf-line:rgba(0,0,0,.08);
  --wf-s1:rgba(0,0,0,.88);
  --wf-s2:rgba(0,0,0,.62);
  --wf-s3:rgba(0,0,0,.34);
  --wf-s4:rgba(0,0,0,.16)
}
.dark .wf,[data-theme="dark"] .wf{
  --wf-line:rgba(255,255,255,.08);
  --wf-s1:rgba(255,255,255,.88);
  --wf-s2:rgba(255,255,255,.62);
  --wf-s3:rgba(255,255,255,.34);
  --wf-s4:rgba(255,255,255,.16)
}
`.replace(/\n/g, "");

/* SVG viewBox is the VISIBLE region (top half of the wordmark).
 * Text fontSize is 2× viewBox height so the glyph midline lands at
 * the viewBox bottom edge — giving the signature half-cut look. */
const VB_W = 1000;
const VB_H = 160;
const FONT_SIZE = 240;
const BASELINE = VB_H + FONT_SIZE * 0.2; // slight bottom cut (~70% glyph visible)

/**
 * Footer wordmark SVG — nửa trên glyph bị crop, hiệu ứng shine theo con trỏ và fade-in khi vào viewport.
 *
 * @param brandName - Tên hiển thị trong SVG; mặc định `"Huỳnh Sang"`.
 */
export function WordmarkFooter({ brandName = "Huỳnh Sang" }: WordmarkFooterProps) {
  const uid = useId().replace(/:/g, "");
  const shineId = `wf-shine-${uid}`;
  const maskId = `wf-mask-${uid}`;
  const maskGradId = `wf-maskg-${uid}`;

  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const gradRef = useRef<SVGRadialGradientElement>(null);

  const hovering = useRef(false);
  const curX = useRef(VB_W * 0.5);
  const curY = useRef(VB_H * 0.5);
  const tgtX = useRef(VB_W * 0.5);
  const tgtY = useRef(VB_H * 0.5);
  const raf = useRef(0);

  const paint = useCallback(() => {
    curX.current += (tgtX.current - curX.current) * 0.1;
    curY.current += (tgtY.current - curY.current) * 0.1;

    if (gradRef.current) {
      gradRef.current.setAttribute("cx", curX.current.toFixed(1));
      gradRef.current.setAttribute("cy", curY.current.toFixed(1));
    }

    const dx = Math.abs(tgtX.current - curX.current);
    const dy = Math.abs(tgtY.current - curY.current);

    if (hovering.current || dx > 0.05 || dy > 0.05) {
      raf.current = requestAnimationFrame(paint);
    }
  }, []);

  const onMove = useCallback(
    (e: React.MouseEvent) => {
      const r = sectionRef.current?.getBoundingClientRect();
      if (!r) return;
      tgtX.current = ((e.clientX - r.left) / r.width) * VB_W;
      tgtY.current = ((e.clientY - r.top) / r.height) * VB_H;

      if (!hovering.current) {
        hovering.current = true;
        raf.current = requestAnimationFrame(paint);
      }
    },
    [paint],
  );

  const onLeave = useCallback(() => {
    hovering.current = false;
    tgtX.current = VB_W * 0.5;
    tgtY.current = VB_H * 0.5;
    raf.current = requestAnimationFrame(paint);
  }, [paint]);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="wf"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        background: "transparent",
        paddingTop: "clamp(20px, 3cqw, 48px)",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        cursor: "pointer",
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: STYLE }} />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        style={{ pointerEvents: "none", display: "block" }}
      >
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          preserveAspectRatio="xMidYMid meet"
          style={{ width: "100%", height: "auto", display: "block" }}
          aria-label={brandName}
        >
          <defs>
            <radialGradient
              id={shineId}
              ref={gradRef}
              gradientUnits="userSpaceOnUse"
              cx={VB_W * 0.5}
              cy={VB_H * 0.5}
              r={VB_W * 0.7}
            >
              <stop offset="0%" stopColor="var(--wf-s1)" />
              <stop offset="24%" stopColor="var(--wf-s2)" />
              <stop offset="50%" stopColor="var(--wf-s3)" />
              <stop offset="100%" stopColor="var(--wf-s4)" />
            </radialGradient>

            <linearGradient id={maskGradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fff" stopOpacity="1" />
              <stop offset="60%" stopColor="#fff" stopOpacity="1" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0.55" />
            </linearGradient>

            <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width={VB_W} height={VB_H}>
              <rect width={VB_W} height={VB_H} fill={`url(#${maskGradId})`} />
            </mask>
          </defs>

          <text
            x={VB_W / 2}
            y={BASELINE}
            textAnchor="middle"
            textLength={VB_W}
            lengthAdjust="spacingAndGlyphs"
            fontSize={FONT_SIZE}
            fontWeight={700}
            letterSpacing="-0.05em"
            fill={`url(#${shineId})`}
            mask={`url(#${maskId})`}
            style={{ userSelect: "none" }}
          >
            {brandName}
          </text>
        </svg>
      </motion.div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 0.5,
          background: "var(--wf-line)",
          pointerEvents: "none",
        }}
      />
    </section>
  );
}

export default WordmarkFooter;
