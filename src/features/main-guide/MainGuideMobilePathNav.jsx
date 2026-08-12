import React, { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";

export default function MainGuideMobilePathNav({
  activeStage,
  currentCard = 0,
  darkMode = false,
  onSelectStage,
  stages,
  totalCards = 0,
  translateText = (value) => value,
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const closeRef = useRef(null);
  const dialogRef = useRef(null);
  const activeIndex = Math.max(0, stages.findIndex((stage) => stage.id === activeStage));
  const active = stages[activeIndex] || stages[0];
  const hasCards = totalCards > 0;
  const progress = hasCards
    ? Math.max(0, Math.min(100, (currentCard / totalCards) * 100))
    : ((activeIndex + 1) / Math.max(1, stages.length)) * 100;

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    const close = () => setOpen(false);
    const handleKeyDown = (event) => {
      if (event.key === "Escape") close();
      if (event.key !== "Tab") return;
      const focusable = dialogRef.current?.querySelectorAll("button:not([disabled])");
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    window.requestAnimationFrame(() => closeRef.current?.focus());

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      triggerRef.current?.focus({ preventScroll: true });
    };
  }, [open]);

  const chooseStage = (stageId) => {
    setOpen(false);
    onSelectStage(stageId);
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={`relative flex min-h-[76px] w-full items-center gap-3 overflow-hidden rounded-[1.35rem] border px-4 py-3 text-left shadow-lg transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 md:hidden ${
          darkMode
            ? "border-slate-700 bg-slate-900/95 text-white shadow-black/25 focus-visible:ring-offset-slate-950"
            : "border-slate-200 bg-white text-slate-950 shadow-slate-300/45 focus-visible:ring-offset-slate-50"
        }`}
      >
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${darkMode ? "bg-cyan-400/10 text-cyan-300" : "bg-cyan-50 text-cyan-700"}`}>
          {React.cloneElement(active.icon, { className: "h-5 w-5", "aria-hidden": true })}
        </span>
        <span className="min-w-0 flex-1">
          <span className={`block text-[10px] font-black uppercase tracking-[0.15em] ${darkMode ? "text-cyan-300" : "text-cyan-700"}`}>
            {translateText("Learning path")} · {translateText("Stage")} {activeIndex + 1} {translateText("of")} {stages.length}
          </span>
          <span className="mt-1 block truncate text-sm font-black">{translateText(active.title)}</span>
          <span className={`mt-0.5 block text-xs font-semibold ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            {hasCards
              ? `${translateText("Card")} ${currentCard} ${translateText("of")} ${totalCards}`
              : translateText("Open section")}
          </span>
        </span>
        <span className={`inline-flex min-h-11 shrink-0 items-center gap-1 rounded-xl px-2.5 text-xs font-black ${darkMode ? "bg-slate-800 text-slate-200" : "bg-slate-100 text-slate-700"}`}>
          {translateText("Change")}
          <ChevronDown className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className={`absolute inset-x-0 bottom-0 h-1 ${darkMode ? "bg-slate-800" : "bg-slate-200"}`} aria-hidden="true">
          <span className="block h-full bg-gradient-to-r from-cyan-500 to-fuchsia-500" style={{ width: `${progress}%` }} />
        </span>
      </button>

      {open ? (
        <div className="fixed inset-0 z-[120] flex items-end bg-slate-950/65 p-3 backdrop-blur-sm md:hidden" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setOpen(false);
        }}>
          <section
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-learning-path-title"
            className={`max-h-[82vh] w-full overflow-y-auto overscroll-contain rounded-[1.75rem] border p-4 shadow-2xl ${
              darkMode ? "border-slate-700 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-950"
            }`}
          >
            <div className="flex items-start justify-between gap-4 px-1 pb-3">
              <div>
                <p className={`text-[10px] font-black uppercase tracking-[0.16em] ${darkMode ? "text-cyan-300" : "text-cyan-700"}`}>
                  {translateText("Learning path")}
                </p>
                <h2 id="mobile-learning-path-title" className="mt-1 text-xl font-black">
                  {translateText("Choose a stage")}
                </h2>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setOpen(false)}
                aria-label={translateText("Close stage chooser")}
                className={`flex h-11 w-11 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${darkMode ? "bg-slate-800 text-slate-200" : "bg-slate-100 text-slate-700"}`}
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="space-y-2">
              {stages.map((stage, index) => {
                const selected = stage.id === activeStage;
                return (
                  <button
                    key={stage.id}
                    type="button"
                    onClick={() => chooseStage(stage.id)}
                    aria-current={selected ? "step" : undefined}
                    className={`flex min-h-14 w-full items-center gap-3 rounded-2xl border px-3 py-2.5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                      selected
                        ? darkMode
                          ? "border-cyan-400 bg-cyan-400/10"
                          : "border-cyan-300 bg-cyan-50"
                        : darkMode
                          ? "border-slate-700 bg-slate-950/45 hover:border-slate-500"
                          : "border-slate-200 bg-slate-50 hover:border-slate-400"
                    }`}
                  >
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${selected ? "bg-cyan-400 text-slate-950" : darkMode ? "bg-slate-800 text-slate-300" : "bg-white text-slate-600"}`}>
                      {React.cloneElement(stage.icon, { className: "h-5 w-5", "aria-hidden": true })}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={`block text-[10px] font-black uppercase tracking-[0.14em] ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                        {translateText("Stage")} {index + 1}
                      </span>
                      <span className="mt-0.5 block text-sm font-black">{translateText(stage.title)}</span>
                    </span>
                    {selected ? <Check className="h-5 w-5 shrink-0 text-cyan-500" aria-hidden="true" /> : null}
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
