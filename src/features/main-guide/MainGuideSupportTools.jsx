import React, { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  ArrowRight,
  Calendar,
  Check,
  ChevronRight,
  ClipboardList,
  Heart,
  MessageSquare,
  Sparkles,
  Utensils,
  X,
  Zap
} from 'lucide-react';

const stageOrder = ['prenatal', 'labor', 'postpartum', 'homeSetup', 'keyterms'];

const stageDotClass = {
  prenatal: 'bg-cyan-500',
  labor: 'bg-emerald-500',
  postpartum: 'bg-rose-500',
  homeSetup: 'bg-violet-500',
  keyterms: 'bg-amber-500'
};

const supportVariant = (activeStage) => {
  if (activeStage === 'labor') return 'labor';
  if (activeStage === 'postpartum' || activeStage === 'homeSetup') return 'after';
  return 'prenatal';
};

const iconForQuickTool = (label) => {
  if (label === 'Partner Tips') return Heart;
  if (label === 'Reminders') return Calendar;
  return ClipboardList;
};

const SectionLabel = ({ children, darkMode }) => (
  <p className={`text-[11px] font-extrabold uppercase tracking-[0.18em] ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>
    {children}
  </p>
);

const PartnerFocus = ({
  checklist,
  darkMode,
  onToggleTask,
  supportTasks,
  translateText,
  winCelebration,
  focusRef
}) => {
  const headingId = useId();
  const completed = supportTasks.filter((task) => checklist[task.id]).length;
  const progress = Math.round((completed / supportTasks.length) * 100);

  return (
    <section
      ref={focusRef}
      tabIndex={-1}
      className={`rounded-[1.4rem] border p-4 outline-none transition focus-visible:ring-2 focus-visible:ring-cyan-400/70 ${
        darkMode ? 'border-violet-400/30 bg-violet-950/20' : 'border-violet-200 bg-violet-50/55'
      }`}
      aria-labelledby={headingId}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className={`flex h-9 w-9 items-center justify-center rounded-full border ${darkMode ? 'border-violet-400/35 bg-violet-400/10 text-violet-200' : 'border-violet-200 bg-white text-violet-700'}`}>
            <Calendar className="h-4 w-4" />
          </span>
          <h3 id={headingId} className={`text-base font-black ${darkMode ? 'text-slate-50' : 'text-slate-950'}`}>
            {translateText("Today's Partner Focus")}
          </h3>
        </div>
        <ChevronRight className={`h-5 w-5 ${darkMode ? 'text-violet-300' : 'text-violet-600'}`} aria-hidden="true" />
      </div>

      <div className="mt-4 flex items-center gap-3">
        <div className={`h-2 flex-1 overflow-hidden rounded-full ${darkMode ? 'bg-slate-800' : 'bg-violet-100'}`}>
          <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 transition-[width]" style={{ width: `${progress}%` }} />
        </div>
        <span className={`text-xs font-bold ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
          {completed} {translateText('of')} {supportTasks.length}
        </span>
      </div>

      <div className="mt-3 space-y-2">
        {supportTasks.map((task) => {
          const checked = Boolean(checklist[task.id]);
          return (
            <button
              key={task.id}
              type="button"
              aria-pressed={checked}
              onClick={() => onToggleTask(task.id)}
              className={`flex min-h-11 w-full items-center gap-3 rounded-2xl border px-3 py-2 text-left text-sm font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 ${
                checked
                  ? darkMode
                    ? 'border-cyan-400/35 bg-cyan-400/10 text-slate-50'
                    : 'border-cyan-200 bg-white text-slate-950 shadow-sm'
                  : darkMode
                    ? 'border-slate-800 bg-slate-950/45 text-slate-300 hover:border-slate-700'
                    : 'border-slate-200 bg-white/70 text-slate-700 hover:border-slate-300'
              } ${winCelebration?.taskId === task.id ? 'animate-win-pop ring-2 ring-emerald-300/60' : ''}`}
            >
              <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${checked ? 'border-cyan-500 bg-cyan-500' : darkMode ? 'border-slate-600 bg-slate-950' : 'border-slate-300 bg-white'}`}>
                {checked && <Check className="h-4 w-4 text-white" aria-hidden="true" />}
              </span>
              {translateText(task.label)}
            </button>
          );
        })}
      </div>

      <p className={`mt-3 flex items-center gap-2 text-xs font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
        <Sparkles className="h-3.5 w-3.5 text-violet-400" aria-hidden="true" />
        {translateText('Small actions today, lasting impact tomorrow.')}
      </p>
    </section>
  );
};

const ActionRow = ({ children, darkMode, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex min-h-12 w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-extrabold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 ${
      darkMode ? 'border-slate-700 bg-slate-950/45 text-slate-200 hover:border-cyan-500/50' : 'border-slate-200 bg-slate-50 text-slate-800 hover:border-cyan-300 hover:bg-white'
    }`}
  >
    <span>{children}</span>
    <ChevronRight className="h-4 w-4 text-slate-500" aria-hidden="true" />
  </button>
);

const StageSupportBuilder = ({
  activeStage,
  darkMode,
  onLaborAction,
  onMealAction,
  onOpenRecoveryPlanner,
  onPrenatalAction,
  translateText
}) => {
  const variant = supportVariant(activeStage);

  if (variant === 'labor') {
    const actions = ['Affirmations', 'Hands-on support', 'Real-time scripts', 'Advocacy prompts'];
    return (
      <section className={`overflow-hidden rounded-[1.4rem] border ${darkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
        <div className="p-4">
          <SectionLabel darkMode={darkMode}>{translateText('Instant Labor Coach')}</SectionLabel>
          <h3 className={`mt-2 text-xl font-black ${darkMode ? 'text-slate-50' : 'text-slate-950'}`}>{translateText('Labor Coaching Pack')}</h3>
          <p className={`mt-1 text-sm font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{translateText('Get partner-ready coaching prompts in seconds.')}</p>
        </div>
        <div className={`space-y-2 border-t p-4 ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
          {actions.map((action) => <ActionRow key={action} darkMode={darkMode} onClick={onLaborAction}>{translateText(action)}</ActionRow>)}
          <button type="button" onClick={onLaborAction} className="mt-2 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-cyan-600 px-4 py-3 text-sm font-black text-white transition hover:bg-cyan-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2">
            <MessageSquare className="h-5 w-5" aria-hidden="true" /> {translateText('Get Instant Coach Pack')}
          </button>
        </div>
      </section>
    );
  }

  if (variant === 'after') {
    const priorities = ['Iron + protein', 'Hydration support', 'Low-effort prep'];
    return (
      <div className="space-y-3">
        <section className={`overflow-hidden rounded-[1.4rem] border ${darkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
          <div className="p-4">
            <SectionLabel darkMode={darkMode}>{translateText('Instant Recovery Nutrition')}</SectionLabel>
            <h3 className={`mt-2 text-xl font-black ${darkMode ? 'text-slate-50' : 'text-slate-950'}`}>{translateText('Postpartum Meal Builder')}</h3>
            <p className={`mt-1 text-sm font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{translateText('Generate a recovery meal pack instantly.')}</p>
          </div>
          <div className={`space-y-2 border-t p-4 ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
            {priorities.map((priority) => <ActionRow key={priority} darkMode={darkMode} onClick={onMealAction}>{translateText(priority)}</ActionRow>)}
            <button type="button" onClick={onMealAction} className="mt-2 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-rose-600 px-4 py-3 text-sm font-black text-white transition hover:bg-rose-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 focus-visible:ring-offset-2">
              <Utensils className="h-5 w-5" aria-hidden="true" /> {translateText('Get Instant Meal Pack')}
            </button>
          </div>
        </section>

        <button type="button" onClick={onOpenRecoveryPlanner} className={`w-full rounded-[1.4rem] border p-4 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 ${darkMode ? 'border-slate-800 bg-slate-900 hover:border-cyan-600/50' : 'border-slate-200 bg-white hover:border-cyan-300'}`}>
          <SectionLabel darkMode={darkMode}>{translateText('Recovery Home Planner')}</SectionLabel>
          <span className={`mt-2 flex items-center justify-between text-base font-black ${darkMode ? 'text-slate-50' : 'text-slate-950'}`}>
            {translateText('Room-by-room support checklist')} <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </span>
        </button>
      </div>
    );
  }

  const actions = ['Plain-language explanation', 'Questions to ask', 'Support actions'];
  return (
    <section className={`overflow-hidden rounded-[1.4rem] border ${darkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
      <div className="p-4">
        <SectionLabel darkMode={darkMode}>{translateText('Instant Prenatal Support')}</SectionLabel>
        <h3 className={`mt-2 text-xl font-black ${darkMode ? 'text-slate-50' : 'text-slate-950'}`}>{translateText('Prenatal Support Builder')}</h3>
        <p className={`mt-1 text-sm font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{translateText('Get partner-ready support in seconds.')}</p>
      </div>
      <div className={`space-y-2 border-t p-4 ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
        {actions.map((action) => <ActionRow key={action} darkMode={darkMode} onClick={() => onPrenatalAction(action)}>{translateText(action)}</ActionRow>)}
        <button type="button" onClick={() => onPrenatalAction('support actions')} className="mt-2 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-cyan-600 px-4 py-3 text-sm font-black text-white transition hover:bg-cyan-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2">
          <Zap className="h-5 w-5" aria-hidden="true" /> {translateText('Get Support Pack')}
        </button>
      </div>
    </section>
  );
};

const QuickTools = ({ darkMode, quickTools, translateText, onReminder }) => (
  <section className={`rounded-[1.4rem] border p-4 ${darkMode ? 'border-slate-800 bg-slate-900/75' : 'border-slate-200 bg-white'}`}>
    <div className="mb-3 flex items-center gap-2">
      <Zap className="h-4 w-4 text-cyan-500" aria-hidden="true" />
      <h3 className={`text-sm font-black ${darkMode ? 'text-slate-50' : 'text-slate-950'}`}>{translateText('Quick Tools')}</h3>
    </div>
    <div className="grid grid-cols-3 gap-2">
      {quickTools.map((tool) => {
        const Icon = iconForQuickTool(tool.label);
        const action = tool.label === 'Reminders' ? onReminder : tool.action;
        return (
          <button key={tool.label} type="button" onClick={action} title={translateText(tool.detail)} className={`flex min-h-[5rem] flex-col items-center justify-center rounded-2xl border px-2 py-2 text-center transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 ${darkMode ? 'border-slate-800 bg-slate-950/45 text-slate-300 hover:border-cyan-600/50' : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-cyan-300 hover:bg-white'}`}>
            <Icon className={`h-5 w-5 ${darkMode ? 'text-fuchsia-300' : 'text-fuchsia-600'}`} aria-hidden="true" />
            <span className="mt-2 text-[11px] font-black leading-tight">{translateText(tool.label)}</span>
          </button>
        );
      })}
    </div>
  </section>
);

const SupportToolsContent = (props) => {
  const focusRef = useRef(null);
  return (
    <div className="space-y-3">
      <PartnerFocus {...props} focusRef={focusRef} />
      <StageSupportBuilder {...props} />
      <QuickTools {...props} onReminder={() => {
        focusRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        focusRef.current?.focus({ preventScroll: true });
      }} />
    </div>
  );
};

const GuideOutline = ({ activeStage, cards, darkMode, guideData, guideStep, onSelectCard, onSelectStage, translateText }) => (
  <nav aria-label={translateText('Explore main guide')} className="space-y-2">
    {stageOrder.map((stageKey) => {
      const stage = guideData[stageKey];
      if (!stage) return null;
      const active = stageKey === activeStage;
      return (
        <div key={stageKey} className={`overflow-hidden rounded-2xl border ${active ? darkMode ? 'border-cyan-500/45 bg-cyan-950/20' : 'border-cyan-200 bg-cyan-50/60' : darkMode ? 'border-slate-800 bg-slate-950/35' : 'border-slate-200 bg-white'}`}>
          <button type="button" aria-current={active ? 'step' : undefined} onClick={() => onSelectStage(stageKey)} className={`flex min-h-12 w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm font-black focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-400/70 ${active ? darkMode ? 'text-cyan-200' : 'text-cyan-800' : darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            <span className="flex min-w-0 items-center gap-3">
              <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${stageDotClass[stageKey]}`} />
              <span className="truncate">{translateText(stage.title)}</span>
            </span>
            <ChevronRight className={`h-4 w-4 shrink-0 transition-transform ${active ? 'rotate-90' : ''}`} aria-hidden="true" />
          </button>
          {active && cards.length > 0 && (
            <div className={`space-y-1 border-t p-2 ${darkMode ? 'border-cyan-900/60' : 'border-cyan-100'}`}>
              {cards.map((item, index) => (
                <button key={item.id} type="button" aria-current={guideStep === index ? 'true' : undefined} onClick={() => onSelectCard(index)} className={`flex min-h-10 w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-xs font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 ${guideStep === index ? darkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-950 shadow-sm' : darkMode ? 'text-slate-400 hover:bg-slate-900' : 'text-slate-600 hover:bg-white'}`}>
                  <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${darkMode ? 'bg-slate-800 text-cyan-300' : 'bg-cyan-100 text-cyan-700'}`}>{index + 1}</span>
                  <span className="line-clamp-2">{translateText(item.card.title)}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      );
    })}
  </nav>
);

export const MainGuideDesktopPane = ({ mode, onModeChange, ...props }) => (
  <aside className={`rounded-[1.75rem] border p-3 shadow-xl ${props.darkMode ? 'border-slate-800 bg-slate-900/92 shadow-black/20' : 'border-slate-200 bg-white shadow-slate-200/60'}`} aria-label={props.translateText('Guide side panel')}>
    <div className={`grid grid-cols-2 rounded-2xl p-1 ${props.darkMode ? 'bg-slate-950' : 'bg-slate-100'}`}>
      {['guide', 'support'].map((value) => (
        <button key={value} type="button" aria-pressed={mode === value} onClick={() => onModeChange(value)} className={`min-h-10 rounded-xl px-3 text-xs font-black transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 ${mode === value ? props.darkMode ? 'bg-slate-800 text-cyan-200 shadow-sm' : 'bg-white text-slate-950 shadow-sm' : props.darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          {props.translateText(value === 'guide' ? 'Guide' : 'Support Tools')}
        </button>
      ))}
    </div>
    <div className="mt-3 max-h-[calc(100vh-9rem)] overflow-y-auto overscroll-contain pr-1 [scrollbar-width:thin]">
      {mode === 'guide' ? <GuideOutline {...props} /> : <SupportToolsContent {...props} />}
    </div>
  </aside>
);

export const MainGuideMobileSupportTools = ({ open, onClose, onOpen, ...props }) => {
  const closeButtonRef = useRef(null);
  const panelRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    const appRoot = document.querySelector('[data-main-guide-app]');
    const previousAriaHidden = appRoot?.getAttribute('aria-hidden');
    const wasInert = Boolean(appRoot?.inert);
    document.body.style.overflow = 'hidden';
    if (appRoot) {
      appRoot.inert = true;
      appRoot.setAttribute('aria-hidden', 'true');
    }
    closeButtonRef.current?.focus();
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;

      const focusable = Array.from(
        panelRef.current?.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        ) || []
      );
      if (!focusable.length) return;
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
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      if (appRoot) {
        appRoot.inert = wasInert;
        if (previousAriaHidden === null) appRoot.removeAttribute('aria-hidden');
        else appRoot.setAttribute('aria-hidden', previousAriaHidden);
      }
      triggerRef.current?.focus();
    };
  }, [open, onClose]);

  return (
    <>
      <button ref={triggerRef} type="button" aria-label={props.translateText('Support Tools')} aria-haspopup="dialog" aria-expanded={open} onClick={onOpen} className={`fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-[70] flex min-h-14 -translate-x-1/2 items-center gap-2 rounded-full border px-3 text-sm font-black shadow-2xl backdrop-blur-xl transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 sm:px-5 lg:hidden ${props.darkMode ? 'border-slate-700 bg-slate-900/92 text-slate-50 shadow-black/40' : 'border-slate-200 bg-white/95 text-slate-950 shadow-slate-400/30'}`}>
        <Zap className="h-5 w-5 text-cyan-500" aria-hidden="true" />
        <span className="sm:hidden">{props.translateText('Tools')}</span>
        <span className="hidden sm:inline">{props.translateText('Support Tools')}</span>
      </button>

      {open && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[80] lg:hidden" role="presentation">
          <button type="button" aria-label={props.translateText('Close support tools')} onClick={onClose} className="absolute inset-0 h-full w-full bg-slate-950/65 backdrop-blur-sm" />
          <section ref={panelRef} role="dialog" aria-modal="true" aria-labelledby="mobile-support-tools-title" className={`absolute inset-x-0 bottom-0 max-h-[calc(100dvh-1rem)] overflow-y-auto overscroll-contain rounded-t-[1.75rem] border-t px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3 shadow-2xl ${props.darkMode ? 'border-slate-700 bg-slate-950 text-slate-50' : 'border-slate-200 bg-slate-50 text-slate-950'}`}>
            <div className={`mx-auto mb-3 h-1.5 w-12 rounded-full ${props.darkMode ? 'bg-slate-700' : 'bg-slate-300'}`} />
            <div className={`sticky top-0 z-10 mb-4 flex items-center justify-between gap-4 py-2 backdrop-blur-xl ${props.darkMode ? 'bg-slate-950/90' : 'bg-slate-50/90'}`}>
              <div>
                <SectionLabel darkMode={props.darkMode}>{props.translateText('Explore Main Guide')}</SectionLabel>
                <h2 id="mobile-support-tools-title" className="mt-1 text-xl font-black">{props.translateText('Support Tools')}</h2>
              </div>
              <button ref={closeButtonRef} type="button" onClick={onClose} aria-label={props.translateText('Close support tools')} className={`flex h-11 w-11 items-center justify-center rounded-full border focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 ${props.darkMode ? 'border-slate-700 bg-slate-900 text-slate-200' : 'border-slate-200 bg-white text-slate-700'}`}>
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <SupportToolsContent {...props} />
          </section>
        </div>,
        document.body
      )}
    </>
  );
};
