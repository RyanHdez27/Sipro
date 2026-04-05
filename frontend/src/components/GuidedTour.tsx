"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, Sparkles } from "lucide-react";

export interface TourStep {
  /** CSS selector for the element to highlight, e.g. [data-tour="stats"] */
  selector: string;
  /** Title shown in the tooltip */
  title: string;
  /** Description shown in the tooltip */
  description: string;
  /** Where to place the tooltip relative to the element */
  placement?: "top" | "bottom" | "left" | "right";
}

interface GuidedTourProps {
  steps: TourStep[];
  onFinish: () => void;
  /** localStorage key to mark as seen */
  storageKey: string;
}

export function GuidedTour({ steps, onFinish, storageKey }: GuidedTourProps) {
  const [current, setCurrent] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
  const [visible, setVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const step = steps[current];
  const isFirst = current === 0;
  const isLast = current === steps.length - 1;
  const progress = ((current + 1) / steps.length) * 100;

  /* ─── Locate target element and compute positions ─── */
  const updatePosition = useCallback(() => {
    if (!step) return;
    const el = document.querySelector(step.selector) as HTMLElement | null;
    if (!el) {
      // Element not found — show centered fallback
      setRect(null);
      setTooltipStyle({
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      });
      setVisible(true);
      return;
    }

    // Scroll element into view
    el.scrollIntoView({ behavior: "smooth", block: "center" });

    // Wait for scroll to finish
    setTimeout(() => {
      const r = el.getBoundingClientRect();
      setRect(r);

      const placement = step.placement || "bottom";
      const pad = 16;
      const tooltipW = 380;
      const tooltipH = 200;

      let top = 0;
      let left = 0;

      switch (placement) {
        case "bottom":
          top = r.bottom + pad;
          left = r.left + r.width / 2 - tooltipW / 2;
          break;
        case "top":
          top = r.top - tooltipH - pad;
          left = r.left + r.width / 2 - tooltipW / 2;
          break;
        case "right":
          top = r.top + r.height / 2 - tooltipH / 2;
          left = r.right + pad;
          break;
        case "left":
          top = r.top + r.height / 2 - tooltipH / 2;
          left = r.left - tooltipW - pad;
          break;
      }

      // Clamp within viewport
      left = Math.max(12, Math.min(left, window.innerWidth - tooltipW - 12));
      top = Math.max(12, Math.min(top, window.innerHeight - tooltipH - 12));

      setTooltipStyle({
        position: "fixed",
        top: `${top}px`,
        left: `${left}px`,
        width: `${tooltipW}px`,
      });
      setVisible(true);
    }, 350);
  }, [step]);

  useEffect(() => {
    setVisible(false);
    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, [current, updatePosition]);

  /* ─── Keyboard nav ─── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleFinish();
      if (e.key === "ArrowRight" && !isLast) setCurrent(c => c + 1);
      if (e.key === "ArrowLeft" && !isFirst) setCurrent(c => c - 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isFirst, isLast]);

  const handleFinish = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, "true");
    }
    onFinish();
  }, [storageKey, onFinish]);

  const spotlightPad = 8;

  return (
    <div className="fixed inset-0 z-[200]">
      {/* Dark overlay with spotlight cutout */}
      {rect ? (
        <>
          {/* Top */}
          <div className="fixed bg-black/60" style={{ top: 0, left: 0, right: 0, height: `${rect.top - spotlightPad}px` }} />
          {/* Bottom */}
          <div className="fixed bg-black/60" style={{ top: `${rect.bottom + spotlightPad}px`, left: 0, right: 0, bottom: 0 }} />
          {/* Left */}
          <div className="fixed bg-black/60" style={{ top: `${rect.top - spotlightPad}px`, left: 0, width: `${rect.left - spotlightPad}px`, height: `${rect.height + spotlightPad * 2}px` }} />
          {/* Right */}
          <div className="fixed bg-black/60" style={{ top: `${rect.top - spotlightPad}px`, left: `${rect.right + spotlightPad}px`, right: 0, height: `${rect.height + spotlightPad * 2}px` }} />
          {/* Spotlight border glow */}
          <div
            className="fixed rounded-xl pointer-events-none"
            style={{
              top: `${rect.top - spotlightPad}px`,
              left: `${rect.left - spotlightPad}px`,
              width: `${rect.width + spotlightPad * 2}px`,
              height: `${rect.height + spotlightPad * 2}px`,
              boxShadow: "0 0 0 3px rgba(124, 58, 237, 0.7), 0 0 20px rgba(124, 58, 237, 0.3)",
              transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
            }}
          />
        </>
      ) : (
        <div className="fixed inset-0 bg-black/60" />
      )}

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className={`fixed z-[201] transition-all duration-300 ${visible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
        style={tooltipStyle}
      >
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Progress bar */}
          <div className="h-1 bg-gray-100 dark:bg-gray-800">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-blue-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="p-5">
            {/* Close */}
            <button
              onClick={handleFinish}
              className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>

            {/* Step counter */}
            <span className="text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wider">
              Paso {current + 1} de {steps.length}
            </span>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-2 pr-6">{step.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">{step.description}</p>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-5">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrent(c => c - 1)}
                disabled={isFirst}
                className="gap-1 text-sm"
              >
                <ChevronLeft className="w-4 h-4" />Anterior
              </Button>

              {/* Dots */}
              <div className="flex gap-1.5">
                {steps.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: i === current ? 18 : 6,
                      height: 6,
                      backgroundColor: i === current ? "#7C3AED" : i < current ? "#A78BFA" : "#D1D5DB",
                    }}
                  />
                ))}
              </div>

              {isLast ? (
                <Button
                  size="sm"
                  onClick={handleFinish}
                  className="bg-violet-600 hover:bg-violet-700 text-white gap-1 text-sm"
                >
                  <Sparkles className="w-4 h-4" />¡Listo!
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={() => setCurrent(c => c + 1)}
                  className="bg-violet-600 hover:bg-violet-700 text-white gap-1 text-sm"
                >
                  Siguiente<ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
