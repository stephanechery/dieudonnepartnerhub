import React from "react";

export default function ProgressBar({ value, className = "", trackClassName = "", barClassName = "" }) {
  return (
    <div className={`w-full ${className}`}>
      <div className={`h-3 w-full overflow-hidden rounded-full bg-slate-200 ${trackClassName}`}>
        <div
          className={`h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all duration-500 ${barClassName}`}
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </div>
    </div>
  );
}
