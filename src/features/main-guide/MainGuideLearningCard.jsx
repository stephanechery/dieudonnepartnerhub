import React from 'react';
import {
  ArrowRight,
  CheckSquare,
  ChevronLeft,
  RotateCcw,
  ShieldAlert,
  Volume2,
  Zap
} from 'lucide-react';
import { promptForGuideCard } from './mainGuidePrompts';

const DetailBlock = ({ accent = false, children, darkMode, label, onClick }) => {
  const classes = accent
    ? darkMode
      ? 'border-cyan-700/60 bg-cyan-950/35 hover:border-cyan-500'
      : 'border-cyan-200 bg-cyan-50 hover:border-cyan-400'
    : darkMode
      ? 'border-slate-700 bg-slate-800/65'
      : 'border-slate-200 bg-slate-100';

  const content = (
    <>
      <p className={`text-[11px] font-extrabold uppercase tracking-[0.15em] ${accent ? darkMode ? 'text-cyan-300' : 'text-cyan-700' : darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
        {label}
      </p>
      <div className={`mt-4 text-sm leading-relaxed ${darkMode ? 'text-slate-100' : 'text-slate-950'}`}>
        {children}
      </div>
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`rounded-2xl border p-4 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 md:min-h-[16.5rem] ${classes}`}
      >
        {content}
      </button>
    );
  }

  return <section className={`rounded-2xl border p-4 md:min-h-[16.5rem] ${classes}`}>{content}</section>;
};

const CardNavigation = ({ canBack, canNext, darkMode, onBack, onNext, translateText }) => (
  <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-start">
    <button
      type="button"
      onClick={onBack}
      disabled={!canBack}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-[0.8rem] border px-4 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-35 ${darkMode ? 'border-slate-700 bg-slate-900 text-slate-200' : 'border-slate-300 bg-white text-slate-700'}`}
    >
      <ChevronLeft className="h-4 w-4" aria-hidden="true" />
      <span className="sr-only sm:not-sr-only">{translateText('Back')}</span>
    </button>
    <button
      type="button"
      onClick={onNext}
      disabled={!canNext}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-[0.8rem] px-5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-35 ${darkMode ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
    >
      {translateText('Next')} <ArrowRight className="h-4 w-4" aria-hidden="true" />
    </button>
  </div>
);

const CareTeamWarning = ({ darkMode, isEmergency, translateText }) => (
  <section className={`rounded-2xl border p-4 ${isEmergency ? darkMode ? 'border-rose-700/60 bg-rose-950/35' : 'border-rose-300 bg-rose-50' : darkMode ? 'border-rose-900/60 bg-rose-950/20' : 'border-rose-200 bg-rose-50/80'}`}>
    <p className={`flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.15em] ${darkMode ? 'text-rose-300' : 'text-rose-600'}`}>
      <ShieldAlert className="h-4 w-4" aria-hidden="true" />
      {translateText('When to contact the care team')}
    </p>
    <p className={`mt-2 text-sm leading-relaxed ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
      {translateText('Call promptly for severe pain, bleeding, fluid leakage, fainting, or a concern that feels urgent.')}
    </p>
  </section>
);

const FrontState = ({
  canBack,
  canNext,
  cardNumber,
  darkMode,
  item,
  onBack,
  onFlip,
  onNext,
  stageTitle,
  structured,
  totalCards,
  translateText
}) => (
  <>
    <header>
      <p className={`text-[11px] font-extrabold uppercase tracking-[0.15em] ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>
        {translateText(stageTitle)} · {translateText('Card')} {cardNumber} {translateText('of')} {totalCards} · {translateText('About 4 minutes')}
      </p>
      <h3 className={`mt-4 text-2xl font-extrabold tracking-[-0.03em] sm:text-[2rem] sm:leading-[1.2] ${darkMode ? 'text-slate-50' : 'text-slate-950'}`}>
        {translateText(item.title)}
      </h3>
      <p className={`mt-1 max-w-3xl text-sm leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
        {translateText(structured.definition)}
      </p>
    </header>

    <div className="grid gap-3 md:grid-cols-3">
      <DetailBlock darkMode={darkMode} label={translateText('What is happening')}>
        {translateText(structured.bodyChanges)}
      </DetailBlock>
      <DetailBlock accent darkMode={darkMode} label={translateText('Partner action')} onClick={onFlip}>
        <p>{translateText(item.checklist[0] || 'Choose one useful support action.')}</p>
        <span className={`mt-5 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.1em] ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>
          <RotateCcw className="h-4 w-4" aria-hidden="true" /> {translateText('View all actions')}
        </span>
      </DetailBlock>
      <DetailBlock darkMode={darkMode} label={translateText('What to say')}>
        “{translateText(promptForGuideCard(item, stageTitle))}”
      </DetailBlock>
    </div>

    <CareTeamWarning darkMode={darkMode} isEmergency={item.isEmergency} translateText={translateText} />

    <footer className="flex flex-wrap items-center justify-between gap-3 pt-1">
      <button type="button" onClick={onFlip} className={`hidden min-h-11 items-center gap-2 rounded-xl px-2 text-xs font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 sm:inline-flex ${darkMode ? 'text-slate-400 hover:text-cyan-300' : 'text-slate-600 hover:text-cyan-700'}`}>
        <RotateCcw className="h-4 w-4" aria-hidden="true" /> {translateText('Open Partner Action, scenario, and myth vs fact')}
      </button>
      <CardNavigation canBack={canBack} canNext={canNext} darkMode={darkMode} onBack={onBack} onNext={onNext} translateText={translateText} />
    </footer>
  </>
);

const TrainingState = ({
  aiEnabled,
  audioState,
  canNext,
  cardNumber,
  darkMode,
  item,
  onFlip,
  onNext,
  onSpeak,
  stageTitle,
  totalCards,
  translateText
}) => (
  <>
    <header className="flex items-start justify-between gap-4">
      <div>
        <p className={`text-[11px] font-extrabold uppercase tracking-[0.15em] ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>
          {translateText(stageTitle)} · {translateText('Partner action training')} · {cardNumber}/{totalCards}
        </p>
        <h3 className={`mt-4 text-2xl font-extrabold tracking-[-0.03em] sm:text-[2rem] ${darkMode ? 'text-slate-50' : 'text-slate-950'}`}>
          {translateText(item.title)}
        </h3>
      </div>
      <button
        type="button"
        onClick={onSpeak}
        disabled={audioState !== 'idle' || !aiEnabled}
        title={translateText(aiEnabled ? 'Play checklist audio' : 'AI support is disabled')}
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 disabled:opacity-45 ${darkMode ? 'border-slate-700 bg-slate-800 text-slate-200' : 'border-slate-200 bg-white text-slate-600'}`}
      >
        <Volume2 className={`h-5 w-5 ${audioState === 'loading' ? 'animate-pulse text-cyan-500' : audioState === 'playing' ? 'text-rose-500' : ''}`} aria-hidden="true" />
      </button>
    </header>

    <section className={`rounded-2xl border p-4 ${darkMode ? 'border-cyan-700/50 bg-cyan-950/25' : 'border-cyan-200 bg-cyan-50'}`}>
      <p className={`flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.15em] ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>
        <Zap className="h-4 w-4" aria-hidden="true" /> {translateText('Partner Action')}
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {item.checklist.map((task, index) => (
          <div key={task} className={`flex items-start gap-3 rounded-xl border p-3 ${darkMode ? 'border-slate-700 bg-slate-900/70 text-slate-200' : 'border-slate-200 bg-white text-slate-800'}`}>
            <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${darkMode ? 'bg-emerald-900/45 text-emerald-300' : 'bg-emerald-50 text-emerald-600'}`}>
              <CheckSquare className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="pt-0.5 text-sm font-semibold leading-snug">{index + 1}. {translateText(task)}</span>
          </div>
        ))}
      </div>
    </section>

    <div className="grid gap-3 md:grid-cols-[1.2fr_1fr]">
      <section className={`rounded-2xl border p-4 ${darkMode ? 'border-blue-800/45 bg-blue-950/20' : 'border-blue-200 bg-blue-50'}`}>
        <p className={`text-[11px] font-extrabold uppercase tracking-[0.15em] ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>{translateText('Real-World Scenario')}</p>
        <p className={`mt-3 text-sm italic leading-relaxed ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>“{translateText(item.scenario)}”</p>
      </section>
      <section className={`grid gap-3 rounded-2xl border p-4 sm:grid-cols-2 md:grid-cols-1 ${darkMode ? 'border-slate-700 bg-slate-800/55' : 'border-slate-200 bg-slate-100'}`}>
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-rose-500">{translateText('Myth')}</p>
          <p className={`mt-2 text-sm leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{translateText(item.myth)}</p>
        </div>
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-emerald-500">{translateText('Fact')}</p>
          <p className={`mt-2 text-sm leading-relaxed ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>{translateText(item.fact)}</p>
        </div>
      </section>
    </div>

    <footer className="flex flex-wrap items-center justify-between gap-3 pt-1">
      <button type="button" onClick={onFlip} className={`inline-flex min-h-11 items-center gap-2 rounded-xl px-2 text-xs font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 ${darkMode ? 'text-slate-400 hover:text-cyan-300' : 'text-slate-600 hover:text-cyan-700'}`}>
        <RotateCcw className="h-4 w-4" aria-hidden="true" /> {translateText('Back to lesson')}
      </button>
      <button type="button" onClick={onNext} disabled={!canNext} className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-[0.8rem] px-5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-35 ${darkMode ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>
        {translateText('Next card')} <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </footer>
  </>
);

export const MainGuideLearningCard = ({
  aiEnabled,
  audioState,
  canBack,
  canNext,
  cardNumber,
  darkMode,
  isFlipped,
  item,
  onBack,
  onFlip,
  onNext,
  onSpeak,
  stageTitle,
  structured,
  totalCards,
  translateText
}) => (
  <article className={`space-y-5 rounded-[1.4rem] border p-5 shadow-xl transition-colors sm:p-7 ${darkMode ? 'border-slate-800 bg-slate-900/92 shadow-black/20' : 'border-slate-200 bg-white shadow-slate-200/70'}`}>
    {isFlipped ? (
      <TrainingState
        aiEnabled={aiEnabled}
        audioState={audioState}
        canNext={canNext}
        cardNumber={cardNumber}
        darkMode={darkMode}
        item={item}
        onFlip={onFlip}
        onNext={onNext}
        onSpeak={onSpeak}
        stageTitle={stageTitle}
        totalCards={totalCards}
        translateText={translateText}
      />
    ) : (
      <FrontState
        canBack={canBack}
        canNext={canNext}
        cardNumber={cardNumber}
        darkMode={darkMode}
        item={item}
        onBack={onBack}
        onFlip={onFlip}
        onNext={onNext}
        stageTitle={stageTitle}
        structured={structured}
        totalCards={totalCards}
        translateText={translateText}
      />
    )}
  </article>
);

const TermCareTeamWarning = ({ darkMode, item, translateText }) => (
  <section className={`rounded-2xl border p-4 ${darkMode ? 'border-rose-900/60 bg-rose-950/20' : 'border-rose-200 bg-rose-50/80'}`}>
    <p className={`flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.15em] ${darkMode ? 'text-rose-300' : 'text-rose-600'}`}>
      <ShieldAlert className="h-4 w-4" aria-hidden="true" />
      {translateText('When to contact the care team')}
    </p>
    <p className={`mt-2 text-sm leading-relaxed ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
      {translateText(item.redFlag || 'Contact the care team when symptoms are severe, sudden, persistent, or feel urgent.')}
    </p>
  </section>
);

const TermFrontState = ({
  canBack,
  canNext,
  cardNumber,
  darkMode,
  item,
  onBack,
  onFlip,
  onNext,
  sectionTitle,
  structured,
  totalCards,
  translateText
}) => (
  <>
    <header>
      <p className={`text-[11px] font-extrabold uppercase tracking-[0.15em] ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>
        {translateText(sectionTitle)} · {translateText('Term')} {cardNumber} {translateText('of')} {totalCards} · {translateText(item.stage)}
      </p>
      <h3 className={`mt-4 text-2xl font-extrabold tracking-[-0.03em] sm:text-[2rem] sm:leading-[1.2] ${darkMode ? 'text-slate-50' : 'text-slate-950'}`}>
        {translateText(item.term)}
      </h3>
      <p className={`mt-1 max-w-3xl text-sm leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
        {translateText(structured.definition)}
      </p>
    </header>

    <div className="grid gap-3 md:grid-cols-3">
      <DetailBlock darkMode={darkMode} label={translateText('What is happening')}>
        {translateText(structured.bodyChanges)}
      </DetailBlock>
      <DetailBlock accent darkMode={darkMode} label={translateText('Partner action')} onClick={onFlip}>
        <p>{translateText(item.partnerTips[0])}</p>
        <span className={`mt-5 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.1em] ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>
          <RotateCcw className="h-4 w-4" aria-hidden="true" /> {translateText('View all actions')}
        </span>
      </DetailBlock>
      <DetailBlock darkMode={darkMode} label={translateText('Why it matters')}>
        {translateText(structured.clinicalSignificance)}
      </DetailBlock>
    </div>

    <TermCareTeamWarning darkMode={darkMode} item={item} translateText={translateText} />

    <footer className="flex flex-wrap items-center justify-between gap-3 pt-1">
      <button type="button" onClick={onFlip} className={`hidden min-h-11 items-center gap-2 rounded-xl px-2 text-xs font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 sm:inline-flex ${darkMode ? 'text-slate-400 hover:text-cyan-300' : 'text-slate-600 hover:text-cyan-700'}`}>
        <RotateCcw className="h-4 w-4" aria-hidden="true" /> {translateText('Open term training')}
      </button>
      <CardNavigation canBack={canBack} canNext={canNext} darkMode={darkMode} onBack={onBack} onNext={onNext} translateText={translateText} />
    </footer>
  </>
);

const TermTrainingState = ({
  canNext,
  cardNumber,
  darkMode,
  item,
  onFlip,
  onNext,
  sectionTitle,
  structured,
  totalCards,
  translateText
}) => (
  <>
    <header>
      <p className={`text-[11px] font-extrabold uppercase tracking-[0.15em] ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>
        {translateText(sectionTitle)} · {translateText('Term training')} · {cardNumber}/{totalCards}
      </p>
      <h3 className={`mt-4 text-2xl font-extrabold tracking-[-0.03em] sm:text-[2rem] ${darkMode ? 'text-slate-50' : 'text-slate-950'}`}>
        {translateText(item.term)}
      </h3>
    </header>

    <section className={`rounded-2xl border p-4 ${darkMode ? 'border-cyan-700/50 bg-cyan-950/25' : 'border-cyan-200 bg-cyan-50'}`}>
      <p className={`flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.15em] ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>
        <Zap className="h-4 w-4" aria-hidden="true" /> {translateText('Partner Actions')}
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {item.partnerTips.map((tip, index) => (
          <div key={tip} className={`flex items-start gap-3 rounded-xl border p-3 ${darkMode ? 'border-slate-700 bg-slate-900/70 text-slate-200' : 'border-slate-200 bg-white text-slate-800'}`}>
            <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${darkMode ? 'bg-emerald-900/45 text-emerald-300' : 'bg-emerald-50 text-emerald-600'}`}>
              <CheckSquare className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="pt-0.5 text-sm font-semibold leading-snug">{index + 1}. {translateText(tip)}</span>
          </div>
        ))}
      </div>
    </section>

    <div className="grid gap-3 md:grid-cols-2">
      <section className={`rounded-2xl border p-4 ${darkMode ? 'border-blue-800/45 bg-blue-950/20' : 'border-blue-200 bg-blue-50'}`}>
        <p className={`text-[11px] font-extrabold uppercase tracking-[0.15em] ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>{translateText('Clinical Meaning')}</p>
        <p className={`mt-3 text-sm leading-relaxed ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>{translateText(item.deepDive)}</p>
      </section>
      <section className={`rounded-2xl border p-4 ${darkMode ? 'border-slate-700 bg-slate-800/55' : 'border-slate-200 bg-slate-100'}`}>
        <p className={`text-[11px] font-extrabold uppercase tracking-[0.15em] ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{translateText('Mother Impact')}</p>
        <p className={`mt-3 text-sm leading-relaxed ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>{translateText(structured.motherImpact)}</p>
      </section>
    </div>

    {item.redFlag && <TermCareTeamWarning darkMode={darkMode} item={item} translateText={translateText} />}

    <footer className="flex flex-wrap items-center justify-between gap-3 pt-1">
      <button type="button" onClick={onFlip} className={`inline-flex min-h-11 items-center gap-2 rounded-xl px-2 text-xs font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 ${darkMode ? 'text-slate-400 hover:text-cyan-300' : 'text-slate-600 hover:text-cyan-700'}`}>
        <RotateCcw className="h-4 w-4" aria-hidden="true" /> {translateText('Back to term')}
      </button>
      <button type="button" onClick={onNext} disabled={!canNext} className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-[0.8rem] px-5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-35 ${darkMode ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>
        <span className="sm:hidden">{translateText('Next')}</span>
        <span className="hidden sm:inline">{translateText('Next term')}</span>
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </footer>
  </>
);

export const MainGuideTermCard = ({
  canBack,
  canNext,
  cardNumber,
  darkMode,
  isFlipped,
  item,
  onBack,
  onFlip,
  onNext,
  sectionTitle,
  structured,
  totalCards,
  translateText
}) => (
  <article className={`space-y-5 rounded-[1.4rem] border p-5 shadow-xl transition-colors sm:p-7 ${darkMode ? 'border-slate-800 bg-slate-900/92 shadow-black/20' : 'border-slate-200 bg-white shadow-slate-200/70'}`}>
    {isFlipped ? (
      <TermTrainingState
        canNext={canNext}
        cardNumber={cardNumber}
        darkMode={darkMode}
        item={item}
        onFlip={onFlip}
        onNext={onNext}
        sectionTitle={sectionTitle}
        structured={structured}
        totalCards={totalCards}
        translateText={translateText}
      />
    ) : (
      <TermFrontState
        canBack={canBack}
        canNext={canNext}
        cardNumber={cardNumber}
        darkMode={darkMode}
        item={item}
        onBack={onBack}
        onFlip={onFlip}
        onNext={onNext}
        sectionTitle={sectionTitle}
        structured={structured}
        totalCards={totalCards}
        translateText={translateText}
      />
    )}
  </article>
);
