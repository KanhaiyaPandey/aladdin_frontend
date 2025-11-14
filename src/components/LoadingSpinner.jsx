import React from "react";
import { motion } from "framer-motion";

/**
 * LoadingSpinner.jsx
 * Reusable loading spinner component using Framer Motion + Tailwind
 * Props:
 *  - variant: 'ring' | 'dots' | 'pulse' (default: 'ring')
 *  - size: number in px (default: 40)
 *  - className: additional tailwind classes
 *  - ariaLabel: accessible label
 */

export default function LoadingSpinner({
  variant = "ring",
  size = 20,
  className = "",
  ariaLabel = "Loading",
}) {
  const commonStyle = {
    width: size,
    height: size,
  };

  if (variant === "dots") {
    const dot = {
      initial: { scale: 0.6, opacity: 0.6 },
      animate: { scale: [0.6, 1.15, 0.6], opacity: [0.6, 1, 0.6] },
      transition: { duration: 0.9, repeat: Infinity, ease: "easeInOut" },
    };

    return (
      <div
        role="status"
        aria-live="polite"
        aria-label={ariaLabel}
        className={`flex items-center justify-center space-x-2 ${className}`}
        style={{ height: size }}
      >
        <motion.span style={{ width: size / 4, height: size / 4 }} {...dot} className="rounded-full bg-current" />
        <motion.span
          style={{ width: size / 4, height: size / 4 }}
          initial={dot.initial}
          animate={dot.animate}
          transition={{ ...dot.transition, delay: 0.15 }}
          className="rounded-full bg-current"
        />
        <motion.span
          style={{ width: size / 4, height: size / 4 }}
          initial={dot.initial}
          animate={dot.animate}
          transition={{ ...dot.transition, delay: 0.3 }}
          className="rounded-full bg-current"
        />
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <motion.div
        role="status"
        aria-live="polite"
        aria-label={ariaLabel}
        className={`rounded-full ${className}`}
        style={commonStyle}
        animate={{ scale: [1, 1.25, 1], opacity: [1, 0.7, 1] }}
        transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
      />
    );
  }

  // default: ring (SVG) spinner
  return (
    <span
      role="status"
      aria-live="polite"
      aria-label={ariaLabel}
      className={`inline-block ${className}`}
      style={commonStyle}
    >
      <motion.svg
        viewBox="0 0 50 50"
        style={{ width: "100%", height: "100%" }}
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      >
        <defs>
          <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>
        </defs>
        <circle cx="25" cy="25" r="20" strokeWidth="6" stroke="url(#g)" fill="none" strokeLinecap="round" />
      </motion.svg>
    </span>
  );
}

// USAGE examples:
// import LoadingSpinner from './LoadingSpinner';
// <LoadingSpinner variant="ring" size={48} className="text-blue-600" />
// <LoadingSpinner variant="dots" size={36} className="text-slate-700" />
// <LoadingSpinner variant="pulse" size={24} className="bg-indigo-600" />
