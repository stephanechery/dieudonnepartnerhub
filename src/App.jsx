import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import mainGuideTranslationPack from './features/language/main-guide-translations.json';
import {
  Heart,
  Brain,
  Baby,
  BookOpen,
  ClipboardList,
  ShieldCheck,
  Utensils,
  Sun,
  Clock,
  Activity,
  AlertTriangle,
  ShieldAlert,
  Zap,
  RotateCcw,
  Info,
  Calendar,
  Stethoscope,
  Timer,
  Layers,
  Sparkles,
  Volume2,
  X,
  MessageSquare,
  Mail,
  Search,
  Moon,
  Shield,
  CheckSquare,
  Globe,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  ArrowRight,
  Users,
  Lock,
  Rocket,
  HeartHandshake,
  ExternalLink
} from 'lucide-react';
import dieudonneDarkLogo from './assets/Dieudonne_Dark_Logo.png';
import heroPartnerJourney from './assets/hero-partner-tablet.svg';
const PartnerDashboardModule = React.lazy(() => import('./features/partner-dashboard'));
import { partnerCurriculum } from './features/partner-dashboard/data/curriculum';

const DOULA_MATCH_URL = 'https://dieudonnematch.org';

// --- Gemini API Utilities ---
const aiFeaturesEnabled = import.meta.env.VITE_ENABLE_AI_FEATURES !== 'false';

const extractGeminiProxyError = async (response) => {
  try {
    const errorPayload = await response.json();
    return errorPayload?.error || `Gemini request failed with status ${response.status}.`;
  } catch (error) {
    return `Gemini request failed with status ${response.status}.`;
  }
};

const looksTruncatedResponse = (text) => {
  const trimmed = (text || '').trim();
  if (!trimmed) return false;

  if (/(\n|\r)\s*\d+\s*$/.test(trimmed)) return true;
  if (/[,:;\-\u2013]$/.test(trimmed)) return true;

  const unclosedQuoteCount = (trimmed.match(/"/g) || []).length;
  if (unclosedQuoteCount % 2 !== 0) return true;

  return false;
};

const fetchGemini = async (prompt, systemInstruction = '', generationConfig = {}) => {
  if (!aiFeaturesEnabled) {
    throw new Error('AI support is disabled.');
  }

  const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, systemInstruction, generationConfig })
  });

  if (!response.ok) {
    throw new Error(await extractGeminiProxyError(response));
  }

  const data = await response.json();
  if (!data?.text) {
    throw new Error('Gemini returned an empty response.');
  }
  return data.text;
};

const fetchTTS = async (text) => {
  if (!aiFeaturesEnabled) {
    throw new Error('AI support is disabled.');
  }

  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'tts',
        text
      })
    });

    if (!response.ok) {
      throw new Error(await extractGeminiProxyError(response));
    }
    const data = await response.json();
    const pcmData = data.audioBase64;
    if (!pcmData) return null;

    const binaryString = window.atob(pcmData);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);

    const sampleRate = 24000;
    const wavHeader = new ArrayBuffer(44);
    const view = new DataView(wavHeader);
    const writeString = (offset, string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + bytes.length, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, bytes.length, true);

    const blob = new Blob([wavHeader, bytes], { type: 'audio/wav' });
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('TTS Error:', error);
    return null;
  }
};

const deriveMotherImpactFromScenario = (item) => {
  const rawScenario = (item?.scenario || '').replace(/^["']|["']$/g, '').trim();
  if (!rawScenario) {
    return 'She may experience both physical strain and emotional intensity during this stage of care.';
  }

  const partnerCueIndex = rawScenario.search(/\bYou\b/);
  let extracted =
    partnerCueIndex > 20 ? rawScenario.slice(0, partnerCueIndex).trim() : rawScenario;

  extracted = extracted
    .replace(/^The nurse says she is\s*/i, 'She is ')
    .replace(/^The nurse says she\s*/i, 'She ')
    .replace(/^The provider suggests\s*/i, 'She is now facing ')
    .replace(/^The doctor calls for\s*/i, 'She is now experiencing ')
    .replace(/^It is Day \d+\s*and she is\s*/i, 'She is ')
    .trim();

  if (extracted.length < 28) {
    return 'She may experience both physical strain and emotional intensity during this stage of care.';
  }

  return extracted.endsWith('.') ? extracted : `${extracted}.`;
};

const getSupportCardStructuredContent = (item) => ({
  definition:
    item?.description ||
    'This concept defines a key part of partner support during maternal care.',
  bodyChanges:
    item?.clinicalInfo ||
    'Maternal physiology is changing rapidly during this phase, requiring close support.',
  clinicalSignificance:
    item?.fact ||
    'Early recognition and timely support can reduce complications and improve outcomes.',
  motherImpact: item?.motherImpact || deriveMotherImpactFromScenario(item)
});

const ttsAudioCache = new Map();
const ttsAudioPromiseCache = new Map();
const stopCardFlip = (event) => {
  event.stopPropagation();
};

const useIsSmallScreen = () => {
  const getMatches = () =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches;

  const [isSmallScreen, setIsSmallScreen] = useState(getMatches);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const mediaQuery = window.matchMedia('(max-width: 640px)');
    const handleChange = (event) => setIsSmallScreen(event.matches);
    setIsSmallScreen(mediaQuery.matches);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  return isSmallScreen;
};

const playAudioUrl = async (url, onDone) => {
  const audio = new Audio(url);
  audio.onended = onDone;
  audio.onerror = onDone;
  try {
    await audio.play();
  } catch (error) {
    onDone();
  }
};

const getCardSpeechText = (translate, item) =>
  `${translate('Partner Actions')}: ${item.checklist.map((task) => translate(task)).join('. ')}`;

const primeTtsAudio = async (speechText) => {
  if (!speechText || !aiFeaturesEnabled) return null;

  const cachedUrl = ttsAudioCache.get(speechText);
  if (cachedUrl) {
    return cachedUrl;
  }

  const pendingPromise = ttsAudioPromiseCache.get(speechText);
  if (pendingPromise) {
    return pendingPromise;
  }

  const nextPromise = fetchTTS(speechText)
    .then((url) => {
      if (url) {
        ttsAudioCache.set(speechText, url);
      }
      ttsAudioPromiseCache.delete(speechText);
      return url;
    })
    .catch((error) => {
      ttsAudioPromiseCache.delete(speechText);
      return null;
    });

  ttsAudioPromiseCache.set(speechText, nextPromise);
  return nextPromise;
};

const FlippableCard = ({ item, colorClass, icon, darkMode, translateText = (value) => value }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [audioState, setAudioState] = useState('idle');
  const isSmallScreen = useIsSmallScreen();
  const structured = getSupportCardStructuredContent(item);
  const tx = (value) => translateText(value);
  const speechText = useMemo(() => getCardSpeechText(tx, item), [item, tx]);
  const clinicalTone = item.isEmergency
    ? darkMode
      ? 'border-rose-900/45 bg-rose-950/20'
      : 'border-rose-200 bg-rose-50/80'
    : darkMode
      ? 'border-blue-900/45 bg-blue-950/20'
      : 'border-blue-200 bg-blue-50/80';

  useEffect(() => {
    if (!isFlipped) return;
    primeTtsAudio(speechText);
  }, [isFlipped, speechText]);

  const handleSpeak = async (e) => {
    e.stopPropagation();
    if (audioState !== 'idle') return;

    if (!aiFeaturesEnabled) {
      return;
    }

    setAudioState('loading');
    const url = await primeTtsAudio(speechText);

    if (!url) {
      setAudioState('idle');
      return;
    }

    setAudioState('playing');
    await playAudioUrl(url, () => setAudioState('idle'));
  };

  if (isSmallScreen) {
    return (
      <div className={`overflow-hidden rounded-3xl border ${darkMode ? 'border-slate-700 bg-slate-900 shadow-xl' : 'border-slate-200 bg-white shadow-sm'}`}>
        <button
          type="button"
          className="w-full p-5 text-left"
          onClick={() => setIsFlipped((prev) => !prev)}
          onTouchStart={() => primeTtsAudio(speechText)}
        >
          <div className="mb-4 flex items-start gap-4">
            <div className={`rounded-xl p-3 ${colorClass}`}>{icon}</div>
            <div className="min-w-0">
              <h3 className={`text-xl font-bold leading-tight ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                {tx(item.title)}
              </h3>
              <p className={`mt-2 text-sm leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                {tx(structured.definition)}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <div className={`rounded-xl border p-3 ${darkMode ? 'border-slate-800 bg-slate-800/70' : 'border-slate-100 bg-slate-50'}`}>
              <p className="text-[10px] font-black uppercase tracking-widest text-rose-500">{tx('What Is Happening In The Body')}</p>
              <p className={`mt-1 text-sm leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{tx(structured.bodyChanges)}</p>
            </div>
            <span className={`inline-flex items-center gap-2 text-xs font-bold uppercase ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              <RotateCcw className="h-4 w-4" /> {tx(isFlipped ? 'Tap to close training' : 'Tap to open training')}
            </span>
          </div>
        </button>

        {isFlipped && (
          <div className={`border-t p-5 ${darkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-white'}`}>
            <div className="mb-4 flex items-start justify-between gap-3">
              <h4 className={`flex items-center gap-2 text-lg font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                <Zap className="h-5 w-5 text-amber-500" /> {tx('Partner Action Guide')}
              </h4>
              <button
                type="button"
                onClick={handleSpeak}
                onTouchStart={() => primeTtsAudio(speechText)}
                className={`rounded-full border p-2.5 shadow-md transition-colors ${
                  darkMode ? 'border-slate-700 bg-slate-800 hover:bg-slate-700' : 'border-slate-100 bg-white hover:bg-slate-50'
                }`}
                disabled={audioState !== 'idle' || !aiFeaturesEnabled}
                title={tx('Play checklist audio')}
              >
                <Volume2 className={`h-5 w-5 ${audioState === 'playing' ? 'text-rose-500' : audioState === 'loading' ? 'animate-pulse text-cyan-500' : darkMode ? 'text-slate-300' : 'text-slate-500'}`} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-3">
                {item.checklist.map((task, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md ${darkMode ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
                      <CheckSquare className="h-3.5 w-3.5" />
                    </div>
                    <span className={`text-sm font-semibold leading-snug ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>{tx(task)}</span>
                  </div>
                ))}
              </div>

              <div className={`rounded-2xl p-4 ${darkMode ? 'border border-blue-800/30 bg-blue-900/10' : 'border border-blue-100 bg-blue-50'}`}>
                <span className="mb-2 block text-[10px] font-black uppercase tracking-widest text-blue-500">{tx('Real-World Scenario')}</span>
                <p className={`text-xs italic leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>"{tx(item.scenario)}"</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-rose-400">{tx('Myth')}</span>
                  <p className={`text-[11px] leading-tight ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>{tx(item.myth)}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-emerald-500">{tx('Fact')}</span>
                  <p className={`text-[11px] leading-tight ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{tx(item.fact)}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="group h-[470px] cursor-pointer [perspective:1000px]"
      onClick={() => setIsFlipped(!isFlipped)}
      onMouseEnter={() => primeTtsAudio(speechText)}
    >
      <div
        className={`relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] ${
          isFlipped ? '[transform:rotateY(180deg)]' : ''
        }`}
      >
        <div
          className={`absolute inset-0 z-10 flex h-full w-full flex-col overflow-hidden rounded-3xl border p-8 transition-colors duration-300 [backface-visibility:hidden] ${
            darkMode ? 'border-slate-700 bg-slate-900 shadow-xl' : 'border-slate-200 bg-white shadow-sm'
          }`}
        >
          <div className="min-h-0 flex flex-1 flex-col">
            <div className="mb-5 flex shrink-0 items-center gap-4">
              <div className={`rounded-xl p-3 ${colorClass}`}>{icon}</div>
              <h3 className={`text-2xl font-bold leading-[1.1] tracking-tight md:text-[1.7rem] ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                {tx(item.title)}
              </h3>
            </div>
            <div
              className="custom-scrollbar min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-contain pr-1 touch-pan-y [-webkit-overflow-scrolling:touch]"
              onClick={stopCardFlip}
              onPointerDown={stopCardFlip}
              onTouchStart={stopCardFlip}
            >
              <div className={`rounded-xl border p-2.5 ${darkMode ? 'border-slate-800 bg-slate-900/70' : 'border-slate-200 bg-white/70'}`}>
                <p className="text-[10px] font-black uppercase tracking-widest text-cyan-500">{tx('Definition')}</p>
                <p className={`mt-1 text-[13px] leading-snug ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>{tx(structured.definition)}</p>
              </div>
              <div className={`rounded-xl border p-2.5 ${darkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-100 bg-slate-50'}`}>
                <p className="text-[10px] font-black uppercase tracking-widest text-rose-500">{tx('What Is Happening In The Body')}</p>
                <p className={`mt-1 text-[13px] leading-snug ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{tx(structured.bodyChanges)}</p>
              </div>
              <div className={`rounded-xl border p-2.5 ${clinicalTone}`}>
                <p className={`text-[10px] font-black uppercase tracking-widest ${item.isEmergency ? 'text-rose-500' : 'text-blue-500'}`}>
                  {tx('Why It Matters Clinically')}
                </p>
                <p className={`mt-1 text-[13px] leading-snug ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>{tx(structured.clinicalSignificance)}</p>
              </div>
              <div className={`rounded-xl border p-2.5 ${darkMode ? 'border-emerald-900/45 bg-emerald-950/20' : 'border-emerald-200 bg-emerald-50/80'}`}>
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">{tx('Mother Impact')}</p>
                <p className={`mt-1 text-[13px] leading-snug ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>{tx(structured.motherImpact)}</p>
              </div>
            </div>
          </div>
          <div className={`mt-4 flex shrink-0 items-center justify-between border-t pt-6 ${darkMode ? 'border-slate-800' : 'border-slate-50'}`}>
            <span className={`flex items-center gap-2 text-xs font-bold uppercase ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              <RotateCcw className="h-4 w-4" /> {tx('Tap to flip for training')}
            </span>
            <div className="flex gap-2">
              {item.isEmergency && <ShieldAlert className="h-5 w-5 animate-pulse text-rose-500" />}
              <Info className={`h-5 w-5 ${darkMode ? 'text-slate-700' : 'text-slate-300'}`} />
            </div>
          </div>
        </div>

        <div
          className={`absolute inset-0 flex h-full w-full flex-col overflow-hidden rounded-3xl border-2 p-8 transition-colors duration-300 [backface-visibility:hidden] [transform:rotateY(180deg)] ${
            darkMode ? 'border-slate-800 bg-slate-900 shadow-2xl' : 'bg-white'
          } ${colorClass.replace('bg-', 'bg-opacity-5 border-')}`}
        >
          <div className="mb-6 flex items-start justify-between">
            <h4 className={`flex items-center gap-2 text-lg font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
              <Zap className="h-5 w-5 text-amber-500" /> {tx('Partner Action Guide')}
            </h4>
            <button
              onClick={handleSpeak}
              onPointerDown={stopCardFlip}
              onMouseEnter={() => primeTtsAudio(speechText)}
              className={`rounded-full border p-2.5 shadow-md transition-colors ${
                darkMode ? 'border-slate-700 bg-slate-800 hover:bg-slate-700' : 'border-slate-100 bg-white hover:bg-slate-50'
              }`}
              disabled={audioState !== 'idle' || !aiFeaturesEnabled}
              title={aiFeaturesEnabled ? tx('Play checklist audio') : tx('AI support is disabled')}
            >
              <Volume2 className={`h-5 w-5 ${audioState === 'playing' ? 'text-rose-500' : audioState === 'loading' ? 'animate-pulse text-cyan-500' : darkMode ? 'text-slate-300' : 'text-slate-500'}`} />
            </button>
          </div>

          <div
            className="custom-scrollbar min-h-0 flex-1 space-y-6 overflow-y-auto overscroll-contain pr-2 touch-pan-y [-webkit-overflow-scrolling:touch]"
            onClick={stopCardFlip}
            onPointerDown={stopCardFlip}
            onTouchStart={stopCardFlip}
          >
            <div className="space-y-3">
              {item.checklist.map((task, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md ${
                      darkMode ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
                    }`}
                  >
                    <CheckSquare className="h-3.5 w-3.5" />
                  </div>
                  <span className={`text-sm font-semibold leading-snug ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>{tx(task)}</span>
                </div>
              ))}
            </div>

            <div className={`rounded-2xl p-4 ${darkMode ? 'border border-blue-800/30 bg-blue-900/10' : 'border border-blue-100 bg-blue-50'}`}>
              <span className="mb-2 block text-[10px] font-black uppercase tracking-widest text-blue-500">{tx('Real-World Scenario')}</span>
              <p className={`text-xs italic leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>"{tx(item.scenario)}"</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-rose-400">{tx('Myth')}</span>
                <p className={`text-[11px] leading-tight ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>{tx(item.myth)}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-emerald-500">{tx('Fact')}</span>
                <p className={`text-[11px] leading-tight ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{tx(item.fact)}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-slate-100/10 pt-4">
            <span className={`flex items-center gap-1 text-xs font-bold ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              <RotateCcw className="h-3 w-3" /> {tx('Back')}
            </span>
            <span
              className={`text-[10px] font-black uppercase tracking-widest ${
                item.isEmergency ? 'text-rose-500' : 'text-slate-400'
              }`}
            >
              {item.isEmergency ? tx('Emergency Protocol') : tx('Support Protocol')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const PregnancyAnatomy = ({ darkMode, translateText = (value) => value }) => {
  const [trimester, setTrimester] = useState(1);
  const tx = (value) => translateText(value);
  const shifts = {
    1: {
      title: 'Trimester 1: The Chemical Surge',
      uterus: 'Size of an orange',
      organs: 'Bladder pressure begins',
      hormones: 'hCG, Progesterone, Estrogen spikes',
      visual: 'h-4 w-4 bg-rose-400 opacity-20',
      details:
        'Blood volume increases by 50% starting now. The heart works harder, and progesterone slows digestion, causing fatigue.'
    },
    2: {
      title: 'Trimester 2: The Structural Shift',
      uterus: 'Size of a papaya',
      organs: 'Intestines displaced upward',
      hormones: 'Relaxin loosens joints',
      visual: 'h-12 w-12 bg-rose-400 opacity-40',
      details:
        'The center of gravity shifts forward. Relaxin affects the pelvis and rib cage to allow for expansion, often causing growing pains.'
    },
    3: {
      title: 'Trimester 3: The Crowded House',
      uterus: 'Size of a watermelon',
      organs: 'Lungs and stomach compressed',
      hormones: 'Oxytocin and Prolactin prep',
      visual: 'h-20 w-20 bg-rose-400 opacity-60',
      details:
        'The uterus reaches the base of the rib cage. Diaphragm movement is restricted, leading to shortness of breath. The bladder is now fully compressed.'
    }
  };

  return (
    <div
      className={`relative overflow-hidden rounded-3xl p-8 shadow-xl transition-colors duration-300 ${
        darkMode ? 'border border-slate-800 bg-slate-900 text-white' : 'border border-slate-200 bg-white text-slate-900'
      }`}
    >
      <div className="relative z-10">
        <div className="mb-6 flex items-center gap-3">
          <Activity className="h-6 w-6 text-rose-400" />
          <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{tx('Interactive Anatomy Guide')}</h3>
        </div>
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <div className="space-y-6">
            <div className="flex gap-2">
              {[1, 2, 3].map((num) => (
                <button
                  key={num}
                  onClick={() => setTrimester(num)}
                  className={`rounded-full px-4 py-2 text-sm font-bold transition-all ${
                    trimester === num
                      ? 'bg-rose-600 text-white'
                      : darkMode
                        ? 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                  }`}
                >
                  T{num}
                </button>
              ))}
            </div>
            <div>
              <h4 className="mb-2 text-2xl font-bold text-rose-400">{tx(shifts[trimester].title)}</h4>
              <p className={`mb-6 text-sm leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{tx(shifts[trimester].details)}</p>
              <div className="grid grid-cols-1 gap-3">
                <div className={`flex items-center gap-3 rounded-xl border p-3 ${darkMode ? 'border-white/5 bg-slate-800/50' : 'border-slate-200 bg-slate-50'}`}>
                  <div className="h-2 w-2 rounded-full bg-rose-500" />
                  <span className={`text-sm font-medium ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                    <span className={darkMode ? 'text-slate-400' : 'text-slate-500'}>{tx('Uterus:')}</span> {tx(shifts[trimester].uterus)}
                  </span>
                </div>
                <div className={`flex items-center gap-3 rounded-xl border p-3 ${darkMode ? 'border-white/5 bg-slate-800/50' : 'border-slate-200 bg-slate-50'}`}>
                  <div className="h-2 w-2 rounded-full bg-amber-500" />
                  <span className={`text-sm font-medium ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                    <span className={darkMode ? 'text-slate-400' : 'text-slate-500'}>{tx('Organs:')}</span> {tx(shifts[trimester].organs)}
                  </span>
                </div>
                <div className={`flex items-center gap-3 rounded-xl border p-3 ${darkMode ? 'border-white/5 bg-slate-800/50' : 'border-slate-200 bg-slate-50'}`}>
                  <div className="h-2 w-2 rounded-full bg-cyan-500" />
                  <span className={`text-sm font-medium ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                    <span className={darkMode ? 'text-slate-400' : 'text-slate-500'}>{tx('Hormones:')}</span> {tx(shifts[trimester].hormones)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="relative flex h-64 items-center justify-center md:h-80">
            <div className={`absolute inset-0 flex items-center justify-center ${darkMode ? 'opacity-10' : 'opacity-20'}`}>
              <div className={`h-80 w-48 rounded-full border-2 ${darkMode ? 'border-slate-700' : 'border-slate-300'}`} />
            </div>
            <div className={`rounded-full blur-3xl transition-all duration-700 ${shifts[trimester].visual}`} />
            <div
              className={`flex items-center justify-center rounded-full border-4 border-rose-500/50 bg-rose-900/20 transition-all duration-700 ${
                trimester === 1 ? 'h-16 w-16' : trimester === 2 ? 'h-40 w-40' : 'h-56 w-56'
              }`}
            >
              <Baby className={`transition-all ${darkMode ? 'text-rose-200' : 'text-rose-500'} ${trimester === 1 ? 'h-6 w-6' : trimester === 2 ? 'h-12 w-12' : 'h-20 w-20'}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LaborDeliveryGuide = ({ darkMode, translateText = (value) => value }) => {
  const [phase, setPhase] = useState('early');
  const tx = (value) => translateText(value);
  const phases = {
    early: {
      short: 'Early',
      badge: 'E',
      title: 'Early Labor: Build Rhythm',
      details:
        'Contractions begin patterning while the cervix softens and starts opening. Calm surroundings support oxytocin flow and labor momentum.',
      cervix: '0-5 cm; gradual effacement and opening',
      contractions: '30-60 sec, every 5-20 min',
      physiology: 'Oxytocin rises; stress adrenaline can slow contraction efficiency.',
      partnerFocus: 'Hydration, environment control, timing waves, conserving her energy.',
      bars: ['h-10', 'h-14', 'h-9']
    },
    active: {
      short: 'Active',
      badge: 'A',
      title: 'Active Labor: Intensify Support',
      details:
        'Contractions become stronger and closer together. Cervical change accelerates, and positioning becomes a key pain-management tool.',
      cervix: '6-8 cm; rapid progress possible',
      contractions: '45-75 sec, every 3-5 min',
      physiology: 'Uterine pressure increases; fetal descent and rotation demand frequent movement.',
      partnerFocus: 'Counter-pressure, breath pacing, position changes every 30-60 minutes.',
      bars: ['h-14', 'h-20', 'h-16']
    },
    transition: {
      short: 'Transition',
      badge: 'T',
      title: 'Transition: Peak Intensity Window',
      details:
        'This is often the most intense stage. Emotional overwhelm is common as the cervix reaches full dilation and pressure builds.',
      cervix: '8-10 cm; nearing complete dilation',
      contractions: '60-90 sec, every 2-3 min',
      physiology: 'Catecholamines surge under stress; steady coaching protects rhythm and focus.',
      partnerFocus: 'Short rhythmic phrases, eye contact, cool cloth, reduce room stimulation.',
      alert: 'If she says “I cannot do this,” that often signals transition, not failure.',
      bars: ['h-20', 'h-24', 'h-20']
    },
    pushing: {
      short: 'Pushing',
      badge: 'P',
      title: 'Pushing Stage: Directed Effort',
      details:
        'With full dilation, coordinated pushing and rest cycles guide fetal descent through the pelvis toward birth.',
      cervix: '10 cm; complete dilation',
      contractions: '60-90 sec with rest between waves',
      physiology: 'Fetal station advances; oxygenation and coached breathing remain critical.',
      partnerFocus: 'Counted breaths, position support, hydration sips, confidence reinforcement.',
      bars: ['h-16', 'h-22', 'h-18']
    }
  };
  const current = phases[phase];

  return (
    <div
      className={`relative overflow-hidden rounded-3xl p-8 shadow-xl transition-colors duration-300 ${
        darkMode ? 'border border-slate-800 bg-slate-900 text-white' : 'border border-slate-200 bg-white text-slate-900'
      }`}
    >
      <div className="relative z-10">
        <div className="mb-6 flex items-center gap-3">
          <Timer className="h-6 w-6 text-cyan-400" />
          <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{tx('Interactive Labor Physiology Guide')}</h3>
        </div>
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {Object.entries(phases).map(([key, item]) => (
                <button
                  key={key}
                  onClick={() => setPhase(key)}
                  className={`rounded-full px-4 py-2 text-sm font-bold transition-all ${
                    phase === key
                      ? 'bg-cyan-600 text-white'
                      : darkMode
                        ? 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                  }`}
                >
                  {tx(item.badge)}
                </button>
              ))}
            </div>
            <div>
              <h4 className="mb-2 text-2xl font-bold text-cyan-400">{tx(current.title)}</h4>
              <p className={`mb-6 text-sm leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{tx(current.details)}</p>
              <div className="grid grid-cols-1 gap-3">
                <div className={`flex items-center gap-3 rounded-xl border p-3 ${darkMode ? 'border-white/5 bg-slate-800/50' : 'border-slate-200 bg-slate-50'}`}>
                  <div className="h-2 w-2 rounded-full bg-cyan-500" />
                  <span className={`text-sm font-medium ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}><span className={darkMode ? 'text-slate-400' : 'text-slate-500'}>{tx('Cervix:')}</span> {tx(current.cervix)}</span>
                </div>
                <div className={`flex items-center gap-3 rounded-xl border p-3 ${darkMode ? 'border-white/5 bg-slate-800/50' : 'border-slate-200 bg-slate-50'}`}>
                  <div className="h-2 w-2 rounded-full bg-amber-500" />
                  <span className={`text-sm font-medium ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}><span className={darkMode ? 'text-slate-400' : 'text-slate-500'}>{tx('Contractions:')}</span> {tx(current.contractions)}</span>
                </div>
                <div className={`flex items-center gap-3 rounded-xl border p-3 ${darkMode ? 'border-white/5 bg-slate-800/50' : 'border-slate-200 bg-slate-50'}`}>
                  <div className="h-2 w-2 rounded-full bg-rose-400" />
                  <span className={`text-sm font-medium ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}><span className={darkMode ? 'text-slate-400' : 'text-slate-500'}>{tx('Physiology:')}</span> {tx(current.physiology)}</span>
                </div>
                <div className={`flex items-center gap-3 rounded-xl border p-3 ${darkMode ? 'border-white/5 bg-slate-800/50' : 'border-slate-200 bg-slate-50'}`}>
                  <div className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className={`text-sm font-medium ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}><span className={darkMode ? 'text-slate-400' : 'text-slate-500'}>{tx('Partner Focus:')}</span> {tx(current.partnerFocus)}</span>
                </div>
              </div>
              {current.alert && (
                <div className={`mt-4 rounded-xl border p-3 ${darkMode ? 'border-rose-800/40 bg-rose-900/20' : 'border-rose-200 bg-rose-50'}`}>
                  <p className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-rose-300' : 'text-rose-700'}`}>
                    <AlertTriangle className="h-4 w-4" /> {tx('Coaching Alert')}
                  </p>
                  <p className={`mt-1 text-sm ${darkMode ? 'text-rose-100' : 'text-rose-700'}`}>{tx(current.alert)}</p>
                </div>
              )}
            </div>
          </div>
          <div className="relative flex h-64 items-center justify-center md:h-80">
            <div className={`absolute inset-0 flex items-center justify-center ${darkMode ? 'opacity-10' : 'opacity-20'}`}>
              <div className={`h-80 w-56 rounded-[42%] border-2 ${darkMode ? 'border-slate-700' : 'border-slate-300'}`} />
            </div>
            <div className="absolute flex items-end gap-3">
              {current.bars.map((bar, idx) => (
                <div key={`${phase}-${idx}`} className={`w-4 ${bar} rounded-full bg-gradient-to-t from-cyan-600 to-cyan-300/70 transition-all duration-500`} />
              ))}
            </div>
            <div className="absolute h-44 w-44 rounded-full border-4 border-cyan-500/40 bg-cyan-900/20" />
            <div className={`flex h-24 w-24 items-center justify-center rounded-full border-4 border-cyan-400/60 shadow-xl shadow-cyan-900/30 ${darkMode ? 'bg-slate-900' : 'bg-white'}`}>
              <Timer className={`h-10 w-10 ${darkMode ? 'text-cyan-200' : 'text-cyan-500'}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PostpartumRecoveryGuide = ({ darkMode, translateText = (value) => value }) => {
  const [windowKey, setWindowKey] = useState('first24');
  const tx = (value) => translateText(value);
  const windows = {
    first24: {
      short: '0-24h',
      title: 'First 24 Hours: Stabilize & Protect',
      details:
        'Immediate postpartum care centers on uterine contraction, bleeding assessment, pain control, and safe rest.',
      physiology: 'Fundus should feel firm; lochia rubra starts as uterine healing begins.',
      hormones: 'Estrogen and progesterone drop rapidly; prolactin/oxytocin signaling increases.',
      emotional: 'Relief, tears, shock, and exhaustion can coexist in the same hour.',
      partner: 'Track meds, hydration, and pad volume; advocate for uninterrupted recovery time.',
      redFlag: 'Soaking one heavy pad in an hour is emergency-level bleeding.'
    },
    day3to5: {
      short: 'Day 3-5',
      title: 'Day 3-5: Hormonal Shift Window',
      details:
        'Milk transition, sleep disruption, and hormone crash can intensify physical discomfort and mood lability.',
      physiology: 'Breast engorgement and uterine afterpains often peak in this window.',
      hormones: 'Post-delivery endocrine drop drives baby-blues vulnerability and emotional sensitivity.',
      emotional: 'Crying spells and overwhelm are common; trend direction matters more than single moments.',
      partner: 'Protect a 4-hour sleep block, reduce visitors, and maintain nutrition/hydration cadence.',
      redFlag: 'Hopelessness, panic escalation, or intrusive harm thoughts require urgent clinical support.'
    },
    week2: {
      short: 'Week 2',
      title: 'Week 2: Recovery Pattern Checkpoint',
      details:
        'By this point, pain and emotional volatility should trend down, and mobility should gradually improve.',
      physiology: 'Lochia typically shifts toward serosa/alba; persistent heavy bleeding is not expected.',
      hormones: 'Neurochemical adjustment continues while sleep fragmentation still impacts resilience.',
      emotional: 'If distress is worsening instead of improving, screen for postpartum depression or anxiety.',
      partner: 'Track symptom trajectory, support follow-up appointments, and continue household load ownership.',
      redFlag: 'Mood symptoms beyond 14 days with functional decline should be escalated for screening.'
    },
    week6: {
      short: 'Week 6',
      title: 'Week 6: Clinical Reassessment Stage',
      details:
        'Around 6 weeks, formal follow-up should review healing, blood pressure risk, pelvic floor status, and mental health.',
      physiology: 'Uterine involution should be advanced; persistent pain, fever, or abnormal discharge warrants evaluation.',
      hormones: 'Hormone patterns vary with breastfeeding status and can still affect mood and energy.',
      emotional: 'Identity strain and fatigue may persist even when physical recovery appears “normal.”',
      partner: 'Support postpartum check visits, pelvic floor care, and long-term sleep protection plans.',
      redFlag: 'Headache with vision changes, chest pain, shortness of breath, or unilateral leg swelling is urgent.'
    }
  };
  const current = windows[windowKey];

  return (
    <div
      className={`relative overflow-hidden rounded-3xl p-8 shadow-xl transition-colors duration-300 ${
        darkMode ? 'border border-slate-800 bg-slate-900 text-white' : 'border border-slate-200 bg-white text-slate-900'
      }`}
    >
      <div className="relative z-10">
        <div className="mb-6 flex items-center gap-3">
          <Heart className="h-6 w-6 text-rose-400" />
          <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{tx('Interactive Postpartum Recovery Guide')}</h3>
        </div>
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {Object.entries(windows).map(([key, item]) => (
                <button
                  key={key}
                  onClick={() => setWindowKey(key)}
                  className={`rounded-full px-4 py-2 text-sm font-bold transition-all ${
                    windowKey === key
                      ? 'bg-rose-600 text-white'
                      : darkMode
                        ? 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                  }`}
                >
                  {tx(item.short)}
                </button>
              ))}
            </div>
            <div>
              <h4 className="mb-2 text-2xl font-bold text-rose-400">{tx(current.title)}</h4>
              <p className={`mb-6 text-sm leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{tx(current.details)}</p>
              <div className="grid grid-cols-1 gap-3">
                <div className={`flex items-center gap-3 rounded-xl border p-3 ${darkMode ? 'border-white/5 bg-slate-800/50' : 'border-slate-200 bg-slate-50'}`}>
                  <div className="h-2 w-2 rounded-full bg-rose-500" />
                  <span className={`text-sm font-medium ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}><span className={darkMode ? 'text-slate-400' : 'text-slate-500'}>{tx('Physiology:')}</span> {tx(current.physiology)}</span>
                </div>
                <div className={`flex items-center gap-3 rounded-xl border p-3 ${darkMode ? 'border-white/5 bg-slate-800/50' : 'border-slate-200 bg-slate-50'}`}>
                  <div className="h-2 w-2 rounded-full bg-cyan-500" />
                  <span className={`text-sm font-medium ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}><span className={darkMode ? 'text-slate-400' : 'text-slate-500'}>{tx('Hormones:')}</span> {tx(current.hormones)}</span>
                </div>
                <div className={`flex items-center gap-3 rounded-xl border p-3 ${darkMode ? 'border-white/5 bg-slate-800/50' : 'border-slate-200 bg-slate-50'}`}>
                  <div className="h-2 w-2 rounded-full bg-amber-500" />
                  <span className={`text-sm font-medium ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}><span className={darkMode ? 'text-slate-400' : 'text-slate-500'}>{tx('Emotional Load:')}</span> {tx(current.emotional)}</span>
                </div>
                <div className={`flex items-center gap-3 rounded-xl border p-3 ${darkMode ? 'border-white/5 bg-slate-800/50' : 'border-slate-200 bg-slate-50'}`}>
                  <div className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className={`text-sm font-medium ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}><span className={darkMode ? 'text-slate-400' : 'text-slate-500'}>{tx('Partner Priority:')}</span> {tx(current.partner)}</span>
                </div>
              </div>
              <div className={`mt-4 rounded-xl border p-3 ${darkMode ? 'border-rose-800/40 bg-rose-900/20' : 'border-rose-200 bg-rose-50'}`}>
                <p className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-rose-300' : 'text-rose-700'}`}>
                  <ShieldAlert className="h-4 w-4" /> {tx('Escalation Trigger')}
                </p>
                <p className={`mt-1 text-sm ${darkMode ? 'text-rose-100' : 'text-rose-700'}`}>{tx(current.redFlag)}</p>
              </div>
            </div>
          </div>
          <div className="relative flex h-64 items-center justify-center md:h-80">
            <div className={`absolute inset-0 flex items-center justify-center ${darkMode ? 'opacity-10' : 'opacity-20'}`}>
              <div className={`h-80 w-56 rounded-[42%] border-2 ${darkMode ? 'border-slate-700' : 'border-slate-300'}`} />
            </div>
            <div className="absolute h-56 w-56 rounded-full border-2 border-rose-500/20" />
            <div className="absolute h-40 w-40 rounded-full border-2 border-rose-500/35" />
            <div className="absolute h-28 w-28 rounded-full border-2 border-rose-400/55" />
            <div className={`flex h-24 w-24 items-center justify-center rounded-full border-4 border-rose-400/60 shadow-xl shadow-rose-900/30 ${darkMode ? 'bg-slate-900' : 'bg-white'}`}>
              <Heart className={`h-10 w-10 ${darkMode ? 'text-rose-200' : 'text-rose-500'}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const keyTermTone = {
  violet: {
    heading: 'text-blue-500',
    chip: 'bg-blue-100 text-blue-700 border-blue-200',
    chipDark: 'bg-blue-950/40 text-blue-300 border-blue-900/50',
    callout: 'border-blue-200 bg-blue-50 text-blue-700',
    calloutDark: 'border-blue-900/50 bg-blue-950/25 text-blue-200',
    sectionLight: 'border-blue-100 bg-blue-50/40',
    sectionDark: 'border-blue-900/40 bg-slate-900/70',
    cardLight: 'border-blue-200 bg-blue-50/40',
    cardDark: 'border-blue-900/40 bg-slate-900',
    backLight: 'border-blue-300 bg-blue-50/80',
    backDark: 'border-blue-900/50 bg-slate-900',
    accent: 'from-blue-400/70 to-blue-300/30'
  },
  cyan: {
    heading: 'text-cyan-500',
    chip: 'bg-cyan-100 text-cyan-700 border-cyan-200',
    chipDark: 'bg-cyan-950/40 text-cyan-300 border-cyan-900/50',
    callout: 'border-cyan-200 bg-cyan-50 text-cyan-700',
    calloutDark: 'border-cyan-900/50 bg-cyan-950/25 text-cyan-200',
    sectionLight: 'border-cyan-100 bg-cyan-50/40',
    sectionDark: 'border-cyan-900/40 bg-slate-900/70',
    cardLight: 'border-cyan-200 bg-cyan-50/40',
    cardDark: 'border-cyan-900/40 bg-slate-900',
    backLight: 'border-cyan-300 bg-cyan-50/80',
    backDark: 'border-cyan-900/50 bg-slate-900',
    accent: 'from-cyan-400/70 to-cyan-300/30'
  },
  rose: {
    heading: 'text-rose-500',
    chip: 'bg-rose-100 text-rose-700 border-rose-200',
    chipDark: 'bg-rose-950/40 text-rose-300 border-rose-900/50',
    callout: 'border-rose-200 bg-rose-50 text-rose-700',
    calloutDark: 'border-rose-900/50 bg-rose-950/25 text-rose-200',
    sectionLight: 'border-rose-100 bg-rose-50/40',
    sectionDark: 'border-rose-900/40 bg-slate-900/70',
    cardLight: 'border-rose-200 bg-rose-50/40',
    cardDark: 'border-rose-900/40 bg-slate-900',
    backLight: 'border-rose-300 bg-rose-50/80',
    backDark: 'border-rose-900/50 bg-slate-900',
    accent: 'from-rose-400/70 to-rose-300/30'
  },
  emerald: {
    heading: 'text-emerald-500',
    chip: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    chipDark: 'bg-emerald-950/40 text-emerald-300 border-emerald-900/50',
    callout: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    calloutDark: 'border-emerald-900/50 bg-emerald-950/25 text-emerald-200',
    sectionLight: 'border-emerald-100 bg-emerald-50/40',
    sectionDark: 'border-emerald-900/40 bg-slate-900/70',
    cardLight: 'border-emerald-200 bg-emerald-50/40',
    cardDark: 'border-emerald-900/40 bg-slate-900',
    backLight: 'border-emerald-300 bg-emerald-50/80',
    backDark: 'border-emerald-900/50 bg-slate-900',
    accent: 'from-emerald-400/70 to-emerald-300/30'
  }
};

const keyTermSections = [
  {
    id: 'hormones',
    title: 'Hormones & Neurochemistry',
    icon: Brain,
    tone: 'violet',
    terms: [
      {
        term: 'Estrogen',
        stage: 'Pregnancy',
        definition:
          'Increases steadily to support uterine growth and blood flow; also modulates serotonin and dopamine pathways.',
        deepDive:
          'Higher estrogen supports placental and uterine development, but changes in neurotransmitter signaling can increase mood sensitivity, nausea, and headaches in some mothers.',
        hormoneImpact:
          'Hormone Impact: Estrogen shifts can amplify emotional sensitivity and headache thresholds during pregnancy.',
        partnerTips: ['Give hydration and protein snacks before nausea worsens', 'Use low-stimulus environments on headache days', 'Validate mood shifts as biological, not dramatic']
      },
      {
        term: 'Progesterone',
        stage: 'Pregnancy',
        definition:
          'Relaxes smooth muscle to reduce early contractions and sustain pregnancy.',
        deepDive:
          'This same smooth-muscle relaxation slows gut motility, causing bloating, constipation, and reflux; it also has sedating effects that contribute to early fatigue.',
        hormoneImpact:
          'Hormone Impact: When progesterone rises, digestion slows. If she feels full or constipated, this is physiology, not exaggeration.',
        partnerTips: ['Prioritize smaller high-fiber meals', 'Encourage warm fluids and daily movement', 'Plan extra rest windows in first trimester']
      },
      {
        term: 'Human Chorionic Gonadotropin (hCG)',
        stage: 'First Trimester',
        definition:
          'Rapidly rising placental hormone that preserves corpus luteum function so progesterone remains high.',
        deepDive:
          'hCG peaks in early pregnancy and is strongly associated with nausea and vomiting, especially between weeks 6 and 12.',
        hormoneImpact:
          'Hormone Impact: Fast hCG rise often matches peak nausea intensity in early pregnancy.',
        partnerTips: ['Keep bland snacks near bedside', 'Front-load fluids between nausea waves', 'Escalate for persistent vomiting or dehydration signs']
      },
      {
        term: 'Relaxin',
        stage: 'Pregnancy',
        definition:
          'Softens cervix and loosens ligaments to prepare the pelvis for birth.',
        deepDive:
          'Ligament laxity improves birth readiness but can create pelvic instability, low-back discomfort, and greater strain risk during routine movement.',
        hormoneImpact:
          'Hormone Impact: Increased joint mobility can feel like pain or instability, especially at hips and pubic symphysis.',
        partnerTips: ['Assist with stairs and single-leg movements', 'Set up seated dressing routines', 'Use belly support band for walking tolerance']
      },
      {
        term: 'Oxytocin',
        stage: 'Labor/Postpartum',
        definition:
          'Stimulates uterine contractions, supports milk letdown, and strengthens bonding physiology.',
        deepDive:
          'Oxytocin release is sensitive to stress state. Calm, warmth, privacy, and touch can support endogenous oxytocin during labor and feeding.',
        hormoneImpact:
          'Hormone Impact: Fear and overstimulation can dampen oxytocin response and labor rhythm.',
        partnerTips: ['Dim lighting and reduce room interruptions', 'Use low rhythmic voice during contractions', 'Promote skin-to-skin after birth']
      },
      {
        term: 'Prolactin',
        stage: 'Pregnancy/Postpartum',
        definition:
          'Primary milk-production hormone; rises in pregnancy but functionally activates after delivery.',
        deepDive:
          'Prolactin works with postpartum hormone changes and frequent feeding/pumping signals to establish supply in the first days to weeks.',
        hormoneImpact:
          'Hormone Impact: Frequent breast stimulation drives prolactin signaling and supports supply establishment.',
        partnerTips: ['Protect feeding or pumping intervals', 'Set hydration reminders', 'Handle logistics so mother can rest between feeds']
      },
      {
        term: 'Cortisol',
        stage: 'Pregnancy',
        definition:
          'Naturally increases in pregnancy and contributes to fetal developmental signaling.',
        deepDive:
          'When baseline stress is high and support is low, elevated cortisol can increase reactivity, poor sleep, and overwhelm.',
        hormoneImpact:
          'Hormone Impact: Unsupported stress can increase emotional volatility and fatigue load.',
        partnerTips: ['Reduce noise and social pressure', 'Build predictable rest and meal routines', 'Use calm reassurance over rapid problem-solving']
      },
      {
        term: 'Thyroid Hormones',
        stage: 'Pregnancy/Postpartum',
        definition:
          'Increase to match maternal and fetal metabolic demand, especially early in pregnancy.',
        deepDive:
          'Thyroid shifts can affect energy, temperature tolerance, and mood; abnormal trends may mimic normal postpartum fatigue.',
        hormoneImpact:
          'Hormone Impact: Persistent fatigue, anxiety, or cold intolerance may reflect thyroid dysregulation, not just sleep loss.',
        partnerTips: ['Track symptom patterns beyond newborn sleep disruption', 'Support follow-up labs when symptoms persist', 'Avoid dismissing severe fatigue as normal']
      },
      {
        term: 'Postpartum Hormonal Shift',
        stage: 'First 24-48 Hours Postpartum',
        definition:
          'Estrogen and progesterone drop rapidly after delivery, producing abrupt neurochemical transition.',
        deepDive:
          'This sudden withdrawal is a primary driver of tearfulness and mood lability (baby blues). Persistent or worsening symptoms beyond two weeks warrant screening for PPD/PPA.',
        hormoneImpact:
          'Hormone Impact: When estrogen drops postpartum, serotonin tone may dip, so emotional sensitivity is biologically driven.',
        partnerTips: ['Protect one 4-hour sleep block daily', 'Screen mood trajectory through week two', 'Escalate for hopelessness, panic, or intrusive thoughts'],
        redFlag: 'Mood symptoms beyond 14 days or any self-harm thoughts require immediate clinical follow-up.'
      }
    ]
  },
  {
    id: 'anatomy',
    title: 'Anatomy & Physiology Terms',
    icon: Activity,
    tone: 'rose',
    terms: [
      {
        term: 'Effacement',
        stage: 'Labor',
        definition: 'Cervical thinning from thick to paper-thin (0% to 100%) before birth.',
        deepDive:
          'Effacement and dilation progress together but not always linearly. A mother can be working hard physiologically before large dilation jumps.',
        partnerTips: ['Reframe progress beyond a single number', 'Coach breathing through each contraction wave', 'Encourage rest between checks']
      },
      {
        term: 'Dilation',
        stage: 'Labor',
        definition: 'Cervical opening from 0 to 10 centimeters.',
        deepDive:
          'Dilation can stall temporarily without indicating failure. Position changes, hydration, and reduced stress can help labor dynamics.',
        partnerTips: ['Offer fluids every hour', 'Support position changes q30-60 minutes', 'Use calm, short affirmations during transition']
      },
      {
        term: 'Fetal Station',
        stage: 'Labor',
        definition: "Measures baby's head descent in pelvis from -3 to +3.",
        deepDive:
          'Descent depends on fetal rotation, pelvic dynamics, and contraction pattern; back labor often reflects less favorable fetal orientation.',
        partnerTips: ['Apply sacral counter-pressure', 'Use hands-and-knees and side-lying positions', 'Coordinate with nurse on movement plan']
      },
      {
        term: 'Lochia',
        stage: 'Postpartum',
        definition: 'Normal postpartum discharge as the uterine lining heals over 4-6 weeks.',
        deepDive:
          'Typical sequence is rubra to serosa to alba. Sudden heavy bleeding, large clots, or foul odor can indicate clinical complications.',
        partnerTips: ['Track pad count and clot size daily', 'Keep bathroom supplies continuously stocked', 'Report abrupt bleeding pattern changes early']
      }
    ]
  },
  {
    id: 'clinical',
    title: 'Clinical Safety Terms',
    icon: Stethoscope,
    tone: 'cyan',
    terms: [
      {
        term: 'Preeclampsia',
        stage: 'Pregnancy/Postpartum',
        definition: 'Hypertensive disorder that can affect brain, liver, kidneys, and placenta.',
        deepDive:
          'Postpartum preeclampsia can appear after discharge. Early recognition prevents seizure, stroke, and end-organ injury.',
        partnerTips: ['Watch severe headache and visual changes', 'Monitor swelling in face/hands', 'Escalate same day for concerning BP symptoms'],
        redFlag: 'Headache with vision changes or right upper abdominal pain is an emergency pattern.'
      },
      {
        term: 'Gestational Diabetes',
        stage: 'Pregnancy',
        definition: 'Pregnancy-specific glucose intolerance affecting maternal and fetal outcomes.',
        deepDive:
          'Uncontrolled glucose can increase risk of larger birth weight, delivery complications, and neonatal hypoglycemia.',
        partnerTips: ['Support meal structure and glucose checks', 'Attend diabetes education visits', 'Normalize care plan adherence without shame']
      },
      {
        term: 'Postpartum Hemorrhage',
        stage: 'Postpartum',
        definition: 'Excessive bleeding after birth, commonly due to poor uterine contraction.',
        deepDive:
          'Hemorrhage may develop at home after discharge. Early response is time-critical and should not wait for worsening symptoms.',
        partnerTips: ['Use the 1-pad-per-hour threshold', 'Track dizziness, faintness, pallor', 'Call emergency services when bleeding is heavy'],
        redFlag: 'Soaking one heavy pad in an hour is emergency-level blood loss until proven otherwise.'
      },
      {
        term: 'DVT / Pulmonary Embolism',
        stage: 'Pregnancy/Postpartum',
        definition: 'Blood clot risk rises in pregnancy; clots can move from leg to lungs.',
        deepDive:
          'Unilateral leg swelling, warmth, and pain may precede pulmonary embolism, which can present with sudden breathlessness or chest pain.',
        partnerTips: ['Compare both legs when swelling appears', 'Escalate one-sided calf pain promptly', 'Treat sudden shortness of breath as 911-level'],
        redFlag: 'Acute chest pain or gasping in postpartum period is a true emergency.'
      }
    ]
  },
  {
    id: 'emotional',
    title: 'Emotional & Clinical Language',
    icon: ClipboardList,
    tone: 'emerald',
    terms: [
      {
        term: 'Baby Blues',
        stage: 'First 14 Days Postpartum',
        definition: 'Short-lived tearfulness and emotional lability tied to abrupt hormonal transition.',
        deepDive:
          'Most mothers improve with sleep protection, social buffering, and reassurance. Monitoring trend direction is more useful than judging isolated moments.',
        partnerTips: ['Normalize tears without dismissing distress', 'Protect naps and reduce visitors', 'Track whether symptoms are improving daily']
      },
      {
        term: 'Postpartum Depression / Anxiety',
        stage: 'Postpartum',
        definition: 'Persistent mood or anxiety symptoms that impair sleep, function, bonding, or safety.',
        deepDive:
          'This is a treatable medical condition driven by neurobiology, sleep disruption, and psychosocial load, not a character weakness.',
        partnerTips: ['Ask direct safety questions calmly', 'Coordinate screening with OB or PCP', 'Stay practical: meals, sleep coverage, appointments'],
        redFlag: 'Any suicidal ideation, intrusive harm thoughts, or inability to care for self/baby requires immediate escalation.'
      },
      {
        term: 'Informed Consent',
        stage: 'All Stages',
        definition: 'Legal and ethical right to understand benefits, risks, and alternatives before procedures.',
        deepDive:
          'Shared decision-making lowers trauma risk and improves trust. Clarifying questions are appropriate even in high-pressure moments.',
        partnerTips: ['Use B.R.A.I.N. questions', 'Request brief pause for family discussion', 'Document responses for continuity']
      },
      {
        term: 'Golden Hour',
        stage: 'Immediate Postpartum',
        definition: 'First hour after birth prioritized for skin-to-skin, thermal stability, and early feeding cues.',
        deepDive:
          'When mother and baby are stable, uninterrupted early contact supports bonding physiology and breastfeeding initiation.',
        partnerTips: ['Hold boundary on non-urgent interruptions', 'Support latch setup and comfort', 'Coordinate with staff without conflict']
      }
    ]
  }
];

const keyTermStructuredContent = {
  Estrogen: {
    definition:
      'Estrogen is a hormone produced by the ovaries early and the placenta later that supports uterine and placental growth.',
    bodyChanges:
      'Levels increase across pregnancy, expanding uterine blood flow and modulating serotonin and dopamine signaling in the brain.',
    clinicalSignificance:
      'Shifts in estrogen can change nausea, migraine, and sleep patterns, so tracking symptoms helps prevent dehydration and missed nutrition.',
    motherImpact:
      'She may experience smell sensitivity, nausea, headaches, and increased emotional sensitivity when estrogen is rapidly changing.'
  },
  Progesterone: {
    definition:
      'Progesterone is a hormone produced primarily by the ovaries and placenta that supports and maintains pregnancy.',
    bodyChanges:
      'Levels rise through pregnancy, stabilizing the uterine lining and relaxing smooth muscle in the uterus, bowel, and blood vessels.',
    clinicalSignificance:
      'It helps prevent early contractions, but slowed gut motility raises constipation and reflux risk that can reduce appetite and hydration.',
    motherImpact:
      'She may feel fatigue, bloating, constipation, reflux, and mood shifts due to progesterone\'s sedating and neurochemical effects.'
  },
  'Human Chorionic Gonadotropin (hCG)': {
    definition:
      'hCG is a hormone made by the placenta that sustains early pregnancy by supporting corpus luteum progesterone production.',
    bodyChanges:
      'hCG rises rapidly in the first trimester, then tapers as placental hormone production becomes more stable later in pregnancy.',
    clinicalSignificance:
      'Rapid hCG rise is strongly associated with nausea and vomiting; severe or persistent vomiting needs clinical assessment for dehydration.',
    motherImpact:
      'She may have intense nausea, food aversions, and low daytime energy during peak hCG weeks.'
  },
  Relaxin: {
    definition:
      'Relaxin is a pregnancy hormone that softens the cervix and loosens ligaments to prepare the pelvis for birth.',
    bodyChanges:
      'As ligament laxity increases, pelvic joints become more mobile and less stable under normal daily movement loads.',
    clinicalSignificance:
      'Greater joint mobility raises risk of pelvic girdle pain, pubic symphysis strain, and lower-back pain that can limit mobility.',
    motherImpact:
      'She may feel hip pain, groin pulling, or instability when walking, climbing stairs, or standing on one leg.'
  },
  Oxytocin: {
    definition:
      'Oxytocin is a hormone that drives uterine contractions in labor and supports milk letdown and bonding after birth.',
    bodyChanges:
      'Release increases with calm touch, safety, and nipple stimulation, but can be inhibited by stress and high adrenaline states.',
    clinicalSignificance:
      'Oxytocin efficiency influences contraction quality, labor progression, and postpartum feeding dynamics.',
    motherImpact:
      'She may labor more effectively and feel calmer when the environment is quiet, warm, and emotionally safe.'
  },
  Prolactin: {
    definition:
      'Prolactin is the primary hormone that regulates breast milk production.',
    bodyChanges:
      'Levels rise in pregnancy and become functionally dominant after delivery when estrogen and progesterone drop.',
    clinicalSignificance:
      'Frequent feeding or pumping stimulates prolactin signaling, which is critical for establishing milk supply in early postpartum.',
    motherImpact:
      'She may feel breast fullness, engorgement pressure, and fatigue during the transition to mature milk production.'
  },
  Cortisol: {
    definition:
      'Cortisol is a stress-response hormone that naturally rises during pregnancy to support maternal and fetal metabolic adaptation.',
    bodyChanges:
      'Baseline cortisol increases as pregnancy progresses, and acute psychosocial stress can amplify that physiologic rise.',
    clinicalSignificance:
      'Persistent high stress load worsens sleep quality and emotional regulation, which can reduce coping capacity during pregnancy and postpartum.',
    motherImpact:
      'She may feel more overwhelmed, reactive, and exhausted when support is low or environmental stress is high.'
  },
  'Thyroid Hormones': {
    definition:
      'Thyroid hormones regulate metabolism, temperature control, and energy use for both mother and fetal development.',
    bodyChanges:
      'Pregnancy increases thyroid demand, and postpartum shifts can temporarily dysregulate thyroid signaling in some mothers.',
    clinicalSignificance:
      'Undetected thyroid dysfunction can mimic anxiety, depression, or severe fatigue, so persistent symptoms warrant laboratory follow-up.',
    motherImpact:
      'She may experience temperature sensitivity, fatigue, palpitations, or mood instability that feels disproportionate to sleep loss.'
  },
  'Postpartum Hormonal Shift': {
    definition:
      'Postpartum hormonal shift is the rapid drop in estrogen and progesterone after delivery.',
    bodyChanges:
      'Within 24 to 48 hours postpartum, abrupt endocrine withdrawal changes neurotransmitter tone and sleep architecture.',
    clinicalSignificance:
      'This transition drives baby blues in many mothers; symptoms persisting beyond two weeks require screening for postpartum mood disorders.',
    motherImpact:
      'She may experience tearfulness, mood swings, anxiety, and emotional fragility even when physically recovering well.'
  },
  Effacement: {
    definition:
      'Effacement is the thinning and shortening of the cervix from thick to paper-thin as labor progresses.',
    bodyChanges:
      'Cervical tissue remodels under contraction pressure and hormonal signaling so the baby can descend through the birth canal.',
    clinicalSignificance:
      'Incomplete effacement before pushing increases risk of cervical swelling and slower labor progress.',
    motherImpact:
      'She may feel intense pressure and fatigue while progress appears numerically slow, which can be emotionally discouraging.'
  },
  Dilation: {
    definition:
      'Dilation is the opening of the cervix from 0 to 10 centimeters to allow birth.',
    bodyChanges:
      'Contractions, fetal pressure, and cervical softening gradually widen the cervical opening in active labor.',
    clinicalSignificance:
      'Dilation trends guide timing of interventions and pushing, but short plateaus can still be physiologically normal.',
    motherImpact:
      'She may cycle between confidence and frustration as labor intensity rises before large number changes occur.'
  },
  'Fetal Station': {
    definition:
      'Fetal station describes how far the baby\'s head has descended in the pelvis relative to the ischial spines.',
    bodyChanges:
      'Descent depends on contraction strength, maternal positioning, and fetal rotation through the pelvic diameters.',
    clinicalSignificance:
      'Station trends help identify labor progress or malposition patterns such as persistent back labor.',
    motherImpact:
      'She may experience stronger rectal pressure, back pain, or urge-to-push sensations as station advances.'
  },
  Lochia: {
    definition:
      'Lochia is normal postpartum vaginal discharge from uterine healing and shedding of placental-site tissue.',
    bodyChanges:
      'Discharge typically changes from red (rubra) to pink-brown (serosa) to yellow-white (alba) over several weeks.',
    clinicalSignificance:
      'Volume, clot size, odor, and timing help identify hemorrhage or infection early during home recovery.',
    motherImpact:
      'She may feel physically drained, uncomfortable, and emotionally worried when bleeding patterns seem unpredictable.'
  },
  Preeclampsia: {
    definition:
      'Preeclampsia is a hypertensive disorder of pregnancy or postpartum that can affect multiple organs.',
    bodyChanges:
      'Abnormal vascular and inflammatory signaling can elevate blood pressure and impair brain, liver, kidney, and placental perfusion.',
    clinicalSignificance:
      'Untreated severe disease can progress to seizure, stroke, or organ injury, requiring urgent escalation.',
    motherImpact:
      'She may report severe headache, visual changes, upper abdominal pain, swelling, and significant anxiety about worsening symptoms.'
  },
  'Gestational Diabetes': {
    definition:
      'Gestational diabetes is glucose intolerance first recognized during pregnancy.',
    bodyChanges:
      'Placental hormones increase insulin resistance, making blood sugar harder to regulate without targeted nutrition and monitoring.',
    clinicalSignificance:
      'Poor glucose control raises risk of larger birth weight, operative delivery, and neonatal blood sugar instability.',
    motherImpact:
      'She may feel worried, fatigued, and restricted by frequent testing, meal planning, and appointment demands.'
  },
  'Postpartum Hemorrhage': {
    definition:
      'Postpartum hemorrhage is excessive bleeding after birth, often caused by inadequate uterine contraction.',
    bodyChanges:
      'If the uterus does not contract firmly, placental-site vessels continue bleeding and blood loss can escalate quickly.',
    clinicalSignificance:
      'Early recognition using pad-count thresholds is critical because delayed treatment increases shock and transfusion risk.',
    motherImpact:
      'She may feel sudden weakness, dizziness, fear, and exhaustion during rapid blood loss.'
  },
  'DVT / Pulmonary Embolism': {
    definition:
      'DVT is a blood clot in a deep vein, and pulmonary embolism occurs when a clot travels to the lungs.',
    bodyChanges:
      'Pregnancy and postpartum physiology increase clotting tendency, and reduced mobility can further raise clot risk.',
    clinicalSignificance:
      'One-sided leg swelling or sudden chest symptoms require urgent evaluation because pulmonary embolism can be fatal.',
    motherImpact:
      'She may feel unilateral leg pain, breathlessness, chest discomfort, and high fear if symptoms emerge suddenly.'
  },
  'Baby Blues': {
    definition:
      'Baby blues are short-term emotional changes in the first two postpartum weeks linked to hormonal withdrawal and sleep disruption.',
    bodyChanges:
      'Rapid endocrine changes and fragmented sleep alter stress regulation and emotional processing during early recovery.',
    clinicalSignificance:
      'Symptoms should improve over days; worsening or persistent symptoms signal need for postpartum depression or anxiety screening.',
    motherImpact:
      'She may cry easily, feel emotionally fragile, and become overwhelmed by routine caregiving demands.'
  },
  'Postpartum Depression / Anxiety': {
    definition:
      'Postpartum depression or anxiety is a clinical mood disorder affecting function, bonding, and safety after birth.',
    bodyChanges:
      'Neurochemical shifts, sleep deprivation, and psychosocial stress can dysregulate mood circuits beyond expected postpartum adjustment.',
    clinicalSignificance:
      'Early identification and treatment reduce risk of maternal harm and improve infant bonding and long-term family health outcomes.',
    motherImpact:
      'She may feel persistent sadness, panic, hopelessness, guilt, or fear that does not improve with rest.'
  },
  'Informed Consent': {
    definition:
      'Informed consent is the patient\'s right to understand benefits, risks, and alternatives before any medical intervention.',
    bodyChanges:
      'This is a decision-making process, not a physiologic change, and it should occur before procedures whenever possible.',
    clinicalSignificance:
      'Clear consent discussions improve safety, reduce trauma perception, and align treatment with patient goals and values.',
    motherImpact:
      'She often feels safer, more respected, and less overwhelmed when decisions are explained clearly and collaboratively.'
  },
  'Golden Hour': {
    definition:
      'The golden hour is the first hour after birth focused on uninterrupted skin-to-skin contact when medically safe.',
    bodyChanges:
      'Early contact supports thermoregulation, cardiorespiratory stabilization, oxytocin release, and breastfeeding cue activation.',
    clinicalSignificance:
      'Protecting this window improves latch success, bonding physiology, and newborn transition outcomes.',
    motherImpact:
      'She may feel calmer, more connected, and emotionally reassured with immediate uninterrupted contact.'
  }
};

const getKeyTermStructuredContent = (item) => {
  const mapped = keyTermStructuredContent[item.term];
  if (mapped) {
    return mapped;
  }

  const hormoneSummary = item.hormoneImpact?.replace('Hormone Impact: ', '');

  return {
    definition: item.definition,
    bodyChanges: item.deepDive,
    clinicalSignificance: item.redFlag || hormoneSummary || 'Clinical relevance depends on symptom trend and stage-specific risk factors.',
    motherImpact: hormoneSummary || 'This can influence comfort, energy, and emotional regulation across the perinatal timeline.'
  };
};

const KeyTermFlippableCard = ({ item, sectionTone, darkMode, translateText = (value) => value }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const isSmallScreen = useIsSmallScreen();
  const structured = getKeyTermStructuredContent(item);
  const tx = (value) => translateText(value);

  if (isSmallScreen) {
    return (
      <div className={`overflow-hidden rounded-3xl border ${darkMode ? `${sectionTone.cardDark} shadow-xl` : `${sectionTone.cardLight} shadow-sm`}`}>
        <button
          type="button"
          className="w-full p-5 text-left"
          onClick={() => setIsFlipped((prev) => !prev)}
        >
          <div className={`mb-2 h-1.5 w-16 rounded-full bg-gradient-to-r ${sectionTone.accent}`} />
          <div className="mb-3 flex items-start justify-between gap-3">
            <h4 className={`text-xl font-bold leading-tight ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>{tx(item.term)}</h4>
            <span className={`rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${darkMode ? sectionTone.chipDark : sectionTone.chip}`}>
              {tx(item.stage)}
            </span>
          </div>
          <div className="space-y-2">
            <div className={`rounded-xl border p-3 ${darkMode ? 'border-slate-800 bg-slate-900/70' : 'border-slate-200 bg-white/70'}`}>
              <p className={`text-[10px] font-black uppercase tracking-widest ${sectionTone.heading}`}>{tx('Definition')}</p>
              <p className={`mt-1 text-sm leading-relaxed ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>{tx(structured.definition)}</p>
            </div>
            <span className={`inline-flex items-center gap-2 text-xs font-bold uppercase ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              <RotateCcw className="h-4 w-4" /> {tx(isFlipped ? 'Tap to close training' : 'Tap to open training')}
            </span>
          </div>
        </button>

        {isFlipped && (
          <div className={`border-t p-5 ${darkMode ? sectionTone.backDark : sectionTone.backLight}`}>
            <div className="mb-3 flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-500" />
              <h5 className={`text-lg font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>{tx('Training Deep Dive')}</h5>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-500">{tx('Clinical Meaning')}</p>
                <p className={`mt-1 text-sm leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{tx(item.deepDive)}</p>
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">{tx('Partner Actions')}</p>
                <div className="mt-1.5 space-y-1.5">
                  {item.partnerTips.map((tip) => (
                    <div key={tip} className="flex items-start gap-2">
                      <CheckSquare className={`mt-0.5 h-3.5 w-3.5 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                      <p className={`text-sm font-semibold leading-relaxed ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>{tx(tip)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {item.redFlag && (
                <div className={`rounded-xl border p-2.5 ${darkMode ? 'border-rose-900/40 bg-rose-900/20' : 'border-rose-200 bg-rose-50'}`}>
                  <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-rose-500">
                    <ShieldAlert className="h-3.5 w-3.5" /> {tx('Escalation Trigger')}
                  </p>
                  <p className={`mt-1 text-sm leading-relaxed ${darkMode ? 'text-rose-100' : 'text-rose-700'}`}>{tx(item.redFlag)}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="group h-[390px] cursor-pointer [perspective:1000px]" onClick={() => setIsFlipped(!isFlipped)}>
      <div className={`relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
        <div className={`absolute inset-0 z-10 flex h-full w-full flex-col rounded-3xl border p-5 [backface-visibility:hidden] ${darkMode ? `${sectionTone.cardDark} shadow-xl` : `${sectionTone.cardLight} shadow-sm`}`}>
          <div className={`mb-2 h-1.5 w-16 rounded-full bg-gradient-to-r ${sectionTone.accent}`} />
          <div className="mb-2 flex items-start justify-between gap-3">
            <h4 className={`text-xl font-bold leading-tight tracking-tight md:text-[1.55rem] ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>{tx(item.term)}</h4>
            <span className={`rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${darkMode ? sectionTone.chipDark : sectionTone.chip}`}>
              {tx(item.stage)}
            </span>
          </div>
          <div
            className="custom-scrollbar min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-contain pr-1 touch-pan-y [-webkit-overflow-scrolling:touch]"
            onClick={stopCardFlip}
            onPointerDown={stopCardFlip}
            onTouchStart={stopCardFlip}
          >
            <div className={`rounded-xl border p-2.5 ${darkMode ? 'border-slate-800 bg-slate-900/70' : 'border-slate-200 bg-white/70'}`}>
              <p className={`text-[10px] font-black uppercase tracking-widest ${sectionTone.heading}`}>{tx('Definition')}</p>
              <p className={`mt-1 text-[13px] leading-snug ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>{tx(structured.definition)}</p>
            </div>
            <div className={`rounded-xl border p-2.5 ${darkMode ? sectionTone.calloutDark : sectionTone.callout}`}>
              <p className="text-[10px] font-black uppercase tracking-widest">{tx('What Is Happening In The Body')}</p>
              <p className={`mt-1 text-[13px] leading-snug ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>{tx(structured.bodyChanges)}</p>
            </div>
            <div className={`rounded-xl border p-2.5 ${darkMode ? 'border-blue-900/45 bg-blue-950/20' : 'border-blue-200 bg-blue-50/80'}`}>
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-500">{tx('Why It Matters Clinically')}</p>
              <p className={`mt-1 text-[13px] leading-snug ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>{tx(structured.clinicalSignificance)}</p>
            </div>
            <div className={`rounded-xl border p-2.5 ${darkMode ? 'border-emerald-900/45 bg-emerald-950/20' : 'border-emerald-200 bg-emerald-50/80'}`}>
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">{tx('Mother Impact')}</p>
              <p className={`mt-1 text-[13px] leading-snug ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>{tx(structured.motherImpact)}</p>
            </div>
          </div>
          <div className={`mt-auto flex items-center justify-between border-t pt-3 ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
            <span className={`flex items-center gap-2 text-xs font-bold uppercase ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              <RotateCcw className="h-4 w-4" /> {tx('Tap to flip for training')}
            </span>
            <Info className={`h-4 w-4 ${darkMode ? 'text-slate-600' : 'text-slate-300'}`} />
          </div>
        </div>

        <div className={`absolute inset-0 flex h-full w-full flex-col overflow-hidden rounded-3xl border-2 p-4 [backface-visibility:hidden] [transform:rotateY(180deg)] ${darkMode ? sectionTone.backDark : sectionTone.backLight}`}>
          <div className="mb-2 flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-500" />
            <h5 className={`text-lg font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>{tx('Training Deep Dive')}</h5>
          </div>

          <div
            className="custom-scrollbar min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain pr-1 touch-pan-y [-webkit-overflow-scrolling:touch]"
            onClick={stopCardFlip}
            onPointerDown={stopCardFlip}
            onTouchStart={stopCardFlip}
          >
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-500">{tx('Clinical Meaning')}</p>
              <p className={`mt-1 text-sm leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{tx(item.deepDive)}</p>
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">{tx('Partner Actions')}</p>
              <div className="mt-1.5 space-y-1.5">
                {item.partnerTips.map((tip) => (
                  <div key={tip} className="flex items-start gap-2">
                    <CheckSquare className={`mt-0.5 h-3.5 w-3.5 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                    <p className={`text-sm font-semibold leading-relaxed ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>{tx(tip)}</p>
                  </div>
                ))}
              </div>
            </div>

            {item.redFlag && (
              <div className={`rounded-xl border p-2.5 ${darkMode ? 'border-rose-900/40 bg-rose-900/20' : 'border-rose-200 bg-rose-50'}`}>
                <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-rose-500">
                  <ShieldAlert className="h-3.5 w-3.5" /> {tx('Escalation Trigger')}
                </p>
                <p className={`mt-1 text-sm leading-relaxed ${darkMode ? 'text-rose-100' : 'text-rose-700'}`}>{tx(item.redFlag)}</p>
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-slate-100/10 pt-3">
            <span className={`flex items-center gap-1 text-xs font-bold ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              <RotateCcw className="h-3 w-3" /> {tx('Back')}
            </span>
            <span className={`text-[10px] font-black uppercase tracking-widest ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              {tx('Clinical Training')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const KeyTermsPanel = ({ darkMode, translateText = (value) => value }) => {
  const tx = (value) => translateText(value);
  const [termStep, setTermStep] = useState(0);
  const mobileTerms = keyTermSections.flatMap((section) => {
    const sectionTone = keyTermTone[section.tone];
    return section.terms.map((item) => ({
      item,
      sectionTitle: section.title,
      sectionTone,
    }));
  });
  const currentTerm = mobileTerms[termStep] || mobileTerms[0];
  const termStepPercent = mobileTerms.length
    ? Math.round(((termStep + 1) / mobileTerms.length) * 100)
    : 0;

  return (
    <div className="space-y-8">
      {currentTerm && (
        <section className={`space-y-4 rounded-[1.75rem] border p-4 shadow-xl md:p-6 ${darkMode ? 'border-slate-800 bg-slate-900/92' : 'border-slate-200 bg-white'}`}>
          <div>
            <div className={`flex items-center justify-between text-[11px] font-black uppercase tracking-[0.16em] ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
              <span>{tx('Term')} {termStep + 1}/{mobileTerms.length}</span>
              <span>{termStepPercent}%</span>
            </div>
            <div className={`mt-2 h-2 overflow-hidden rounded-full ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-fuchsia-500"
                style={{ width: `${termStepPercent}%` }}
              />
            </div>
            <p className={`mt-3 text-xs font-black uppercase tracking-[0.16em] ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
              {tx(currentTerm.sectionTitle)}
            </p>
          </div>

          <KeyTermFlippableCard
            key={`${currentTerm.sectionTitle}-${currentTerm.item.term}`}
            item={currentTerm.item}
            sectionTone={currentTerm.sectionTone}
            darkMode={darkMode}
            translateText={translateText}
          />

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTermStep((current) => Math.max(0, current - 1))}
              disabled={termStep === 0}
              className={`inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-bold disabled:opacity-40 ${
                darkMode ? 'border-slate-700 bg-slate-950 text-slate-200' : 'border-slate-300 bg-white text-slate-700'
              }`}
            >
              <ChevronLeft className="h-4 w-4" /> {tx('Back')}
            </button>
            <button
              type="button"
              onClick={() => setTermStep((current) => Math.min(mobileTerms.length - 1, current + 1))}
              disabled={termStep === mobileTerms.length - 1}
              className={`inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-bold text-white disabled:opacity-40 ${
                darkMode ? 'bg-gradient-to-r from-cyan-600 to-teal-500' : 'bg-gradient-to-r from-slate-900 to-slate-700'
              }`}
            >
              {tx('Next')} <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      )}

      <div className="hidden space-y-8">
        {keyTermSections.map((section) => {
          const Icon = section.icon;
          const sectionTone = keyTermTone[section.tone];

          return (
            <section key={section.id} className={`space-y-4 rounded-2xl border p-4 ${darkMode ? sectionTone.sectionDark : sectionTone.sectionLight}`}>
              <div className="flex items-center gap-3">
                <Icon className={`h-5 w-5 ${sectionTone.heading}`} />
                <h3 className={`text-lg font-black tracking-tight ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                  {tx(section.title)}
                </h3>
                <div className={`ml-3 h-px flex-1 ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {section.terms.map((item) => (
                  <KeyTermFlippableCard key={item.term} item={item} sectionTone={sectionTone} darkMode={darkMode} translateText={translateText} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};

const supportTasks = [
  { id: 'water', label: 'Hydration Goal Met' },
  { id: 'meal', label: 'Handed her food (no ask)' },
  { id: 'laundry', label: 'Clear of laundry' },
  { id: 'baby', label: 'Bonding/Soothing Time' },
  { id: 'listen', label: 'Active Listening Time' }
];

const winCelebrationMessages = [
  'Excellent support move. Momentum is building.',
  'Strong partner leadership. Keep this rhythm.',
  'That consistency protects recovery and trust.',
  'Great execution. Small wins compound quickly.'
];

const coachFocusModes = [
  'Breathing rhythm, anxiety de-escalation, and emotional anchoring',
  'Back labor comfort, hip squeeze technique, and position changes',
  'Transition phase language, confidence cues, and stamina support',
  'Hospital communication, B.R.A.I.N. advocacy, and calm decision prompts',
  'Pushing-stage coaching, rest-between-waves strategy, and hydration cadence'
];

const mealFocusModes = [
  'Iron repletion and blood-loss recovery',
  'Fiber and gentle digestion support',
  'High-protein tissue repair and energy stability',
  'Hydration-forward breastfeeding support',
  'Fast, one-pan recovery meals for low-energy days'
];

const postpartumMealIdeas = [
  {
    focus: 'Iron repletion and blood-loss recovery',
    title: 'Turkey Lentil Recovery Bowl',
    options: [
      'Ground turkey, lentils, spinach, brown rice, and lemon yogurt sauce. Simmer lentils ahead, then warm everything in one skillet for a 15-minute bowl.',
      'Beef and black bean taco rice with avocado and salsa. Use microwave rice and canned beans so the meal lands fast without extra cleanup.',
      'Egg, spinach, and sweet potato hash with pumpkin seeds. Roast extra sweet potato once, then reheat portions with eggs through the week.'
    ],
    helps: [
      'Iron supports blood-loss recovery.',
      'Protein supports tissue repair and energy stability.',
      'Vitamin C from citrus or salsa helps iron absorption.',
      'Complex carbs help steady appetite during broken sleep.'
    ],
    execution: [
      'Buy pre-washed greens and microwave grains.',
      'Serve with a full water bottle before she asks.',
      'Pack leftovers in single-serving containers.'
    ]
  },
  {
    focus: 'Fiber and gentle digestion support',
    title: 'White Bean Chicken Soup',
    options: [
      'Rotisserie chicken, white beans, carrots, celery, broth, and parsley. Simmer for 20 minutes and keep it mild for an easier postpartum stomach.',
      'Oatmeal bowl with chia, berries, peanut butter, and Greek yogurt. Prep dry jars so breakfast only needs hot water or milk.',
      'Salmon, quinoa, cucumber, olive oil, and lemon. Use canned salmon when the household needs a no-cook option.'
    ],
    helps: [
      'Fiber supports constipation recovery.',
      'Warm fluids support hydration and comfort.',
      'Protein reduces blood sugar dips.',
      'Omega-3 fats support inflammation balance.'
    ],
    execution: [
      'Keep stool-softener-friendly meals soft and hydrated.',
      'Offer small portions more often.',
      'Avoid spicy experiments unless she asks for them.'
    ]
  },
  {
    focus: 'High-protein tissue repair and energy stability',
    title: 'Sheet-Pan Chicken and Sweet Potato',
    options: [
      'Chicken thighs, sweet potatoes, broccoli, olive oil, and garlic. Roast one tray and serve with yogurt sauce for extra protein.',
      'Cottage cheese toast with avocado, tomato, and boiled eggs. It works as a fast meal when no one has energy to cook.',
      'Bean and cheese quesadilla with spinach and guacamole. Use whole-grain tortillas and serve with fruit on the side.'
    ],
    helps: [
      'Protein supports incision, perineal, and muscle repair.',
      'Potassium-rich foods support fluid shifts.',
      'Healthy fats help satiety during feeding windows.',
      'A predictable meal prevents skipped eating.'
    ],
    execution: [
      'Cook once and portion twice.',
      'Bring food to her recovery spot.',
      'Set a 3-hour food check during the day.'
    ]
  },
  {
    focus: 'Hydration-forward breastfeeding support',
    title: 'Brothy Noodle and Egg Bowl',
    options: [
      'Low-sodium broth, noodles, soft-boiled egg, shredded chicken, greens, and sesame oil. Keep broth ready so the bowl comes together quickly.',
      'Greek yogurt smoothie with berries, oats, peanut butter, and milk. Blend and serve with a straw during feeding or pumping.',
      'Tuna avocado rice bowl with cucumber and seaweed snacks. Use pouches and microwave rice for a low-effort meal.'
    ],
    helps: [
      'Fluids support hydration during feeding.',
      'Protein supports milk production demands.',
      'Sodium and potassium support fluid balance.',
      'Easy-to-eat meals reduce skipped calories.'
    ],
    execution: [
      'Refill water every time baby feeds.',
      'Set snacks within arm reach.',
      'Keep one one-handed meal ready daily.'
    ]
  },
  {
    focus: 'Fast, one-pan recovery meals for low-energy days',
    title: 'One-Pan Sausage, Beans, and Greens',
    options: [
      'Chicken sausage, cannellini beans, kale, tomatoes, and olive oil. Warm everything in one pan and finish with lemon.',
      'Frozen veggie fried rice with scrambled eggs and edamame. Add extra eggs for protein and keep seasoning gentle.',
      'Pesto chickpea pasta with peas and parmesan. Use one pot and save half for tomorrow.'
    ],
    helps: [
      'One-pan meals reduce partner execution friction.',
      'Beans and greens support iron, fiber, and minerals.',
      'Protein and carbs help stabilize energy.',
      'Leftovers protect the next recovery window.'
    ],
    execution: [
      'Keep two emergency meals in the pantry.',
      'Clean as the meal cooks.',
      'Serve before visitors or chores get attention.'
    ]
  }
];

const buildPostpartumMealIdea = (historyLength = 0) => {
  const idea = postpartumMealIdeas[historyLength % postpartumMealIdeas.length];
  const optionOffset = historyLength % idea.options.length;
  const orderedOptions = [
    ...idea.options.slice(optionOffset),
    ...idea.options.slice(0, optionOffset)
  ];

  return `Recovery focus: ${idea.focus}

Meal Option A: ${orderedOptions[0]}

Meal Option B: ${orderedOptions[1]}

Meal Option C: ${orderedOptions[2]}

Why It Helps:
${idea.helps.map((item) => `- ${item}`).join('\n')}

Partner Execution Tip:
${idea.execution.map((item) => `- ${item}`).join('\n')}`;
};

const prenatalSupportPacks = [
  {
    focus: 'Appointment language and next-step clarity',
    explain:
      'If a term from an appointment feels unclear, write it down, repeat back what you heard, and ask the care team what it means for mom today.',
    examples: [
      'Ask: What should we watch for before the next appointment?',
      'Ask: Is this expected, or does it change her care plan?',
      'Ask: What would make this urgent tonight?'
    ],
    support: [
      'Take notes during the visit so mom does not have to hold every detail.',
      'Confirm the pharmacy, lab, or follow-up task before leaving.',
      'Keep the explanation calm and plain when you talk about it later.'
    ]
  },
  {
    focus: 'Comfort, hydration, and body-change support',
    explain:
      'Pregnancy symptoms can shift quickly. Your job is to lower friction: water nearby, food before she crashes, rest protected, and comfort options ready.',
    examples: [
      'For back or hip pain: offer pillows, warm packs, and slower transitions.',
      'For nausea: keep bland snacks close and reduce strong smells.',
      'For fatigue: handle one household task before she asks.'
    ],
    support: [
      'Set up her rest spot with water, charger, and snacks.',
      'Track symptom patterns without making her feel monitored.',
      'Call the provider when symptoms feel new, severe, or concerning.'
    ]
  },
  {
    focus: 'Warning-sign awareness',
    explain:
      'Some prenatal symptoms need fast action. Partners help by noticing changes early and making the call without waiting for mom to carry the decision alone.',
    examples: [
      'Call for heavy bleeding, severe headache, chest pain, or trouble breathing.',
      'Call for regular contractions before 37 weeks.',
      'Call for decreased fetal movement after mom has started tracking movement.'
    ],
    support: [
      'Keep the provider number and hospital location saved.',
      'Use clear language: We are concerned and need guidance now.',
      'If symptoms feel urgent, choose emergency care over waiting.'
    ]
  },
  {
    focus: 'Emotional steadiness before birth',
    explain:
      'Pregnancy can bring excitement and fear at the same time. Steady support means listening first, validating what she says, and helping turn worry into a next action.',
    examples: [
      'Say: I hear you. What would feel most helpful in the next hour?',
      'Say: Let us write that question down for the provider.',
      'Say: You do not have to figure this out alone.'
    ],
    support: [
      'Avoid fixing before listening.',
      'Protect quiet time after hard appointments.',
      'Bring up mental health support early if fear or sadness starts taking over daily life.'
    ]
  }
];

const buildPrenatalSupportPack = (term = '', historyLength = 0) => {
  const cleanTerm = term.trim();
  const pack = prenatalSupportPacks[historyLength % prenatalSupportPacks.length];

  return `Prenatal focus: ${cleanTerm || pack.focus}

Plain-language explanation:
${cleanTerm ? `${cleanTerm} is worth clarifying with the care team in plain terms. Ask what it means for mom, baby, and the next care step.` : pack.explain}

Applied examples:
${pack.examples.map((item) => `- ${item}`).join('\n')}

Partner support actions:
${pack.support.map((item) => `- ${item}`).join('\n')}

Quick check:
- What is the one question you should ask next?
- What symptom or instruction should you track?
- What can you take off mom's plate today?`;
};

const buildLaborCoachPack = (historyLength = 0) => {
  const focus = coachFocusModes[historyLength % coachFocusModes.length];
  const packs = [
    {
      affirmations: ['Breathe low and slow.', 'You are doing this.', 'One wave at a time.', 'I am right here.', 'This contraction is ending.'],
      support: ['Offer water between contractions.', 'Use a hip squeeze during back pressure.', 'Dim lights and reduce room noise.', 'Guide her into a new position every 30 minutes.', 'Keep your voice slow and low.'],
      scripts: ['Your body knows this rhythm.', 'Let your shoulders drop.', 'We only have to do this one wave.', 'You are safe and supported.'],
      prompts: ['What are the benefits of this option?', 'What are the risks if we wait?', 'Can we have a minute to talk privately?']
    },
    {
      affirmations: ['Your breath is leading us.', 'You are powerful.', 'Let the wave pass through.', 'I have you.', 'Rest your jaw and hands.'],
      support: ['Apply sacral counter-pressure during back labor.', 'Offer cool cloths after each contraction.', 'Remind her to empty her bladder.', 'Ask staff about position options.', 'Protect quiet between checks.'],
      scripts: ['You do not have to answer anyone quickly.', 'I can ask the question for us.', 'Let us take the next breath together.', 'You are making progress.'],
      prompts: ['Are there alternatives we can try first?', 'What happens if we do nothing for now?', 'Is this urgent, or do we have time to decide?']
    },
    {
      affirmations: ['Stay with my voice.', 'You can soften into this.', 'Your baby is moving closer.', 'I see how hard you are working.', 'The next rest is coming.'],
      support: ['Count four slow breaths with her.', 'Anchor eye contact during transition.', 'Offer ice chips or sips if allowed.', 'Support side-lying or hands-and-knees positions.', 'Repeat only the phrase that calms her.'],
      scripts: ['I am proud of you.', 'You are not alone in this room.', 'The wave is peaking, now it is coming down.', 'Let us ask what this means before we decide.'],
      prompts: ['What is the medical reason for this recommendation?', 'How will this affect her pain or mobility?', 'What signs are you watching before the next step?']
    }
  ];
  const pack = packs[historyLength % packs.length];

  return `Labor focus: ${focus}

Affirmations:
${pack.affirmations.map((item) => `- ${item}`).join('\n')}

Hands-On Support:
${pack.support.map((item) => `- ${item}`).join('\n')}

Real-Time Scripts:
${pack.scripts.map((item) => `- ${item}`).join('\n')}

Advocacy Prompts:
${pack.prompts.map((item) => `- ${item}`).join('\n')}`;
};

const buildShareHref = ({ type, subject, body }) => {
  const encodedSubject = encodeURIComponent(subject || 'Dieudonne Partner Hub meal idea');
  const encodedBody = encodeURIComponent(body || '');
  if (type === 'sms') {
    return `sms:?&body=${encodedBody}`;
  }
  return `mailto:?subject=${encodedSubject}&body=${encodedBody}`;
};


const LANGUAGE_OPTIONS = [
  { code: 'en', short: 'EN', flag: '🇺🇸', label: 'English', modelLabel: 'English' },
  { code: 'es', short: 'ES', flag: '🇪🇸', label: 'Español', modelLabel: 'Spanish' },
  { code: 'ht', short: 'HT', flag: '🇭🇹', label: 'Kreyòl Ayisyen', modelLabel: 'Haitian Creole' },
  { code: 'fr', short: 'FR', flag: '🇫🇷', label: 'Français', modelLabel: 'French' }
];

export const LANGUAGE_SESSION_KEY = 'dieudonne-language';
const LANGUAGE_TRANSLATION_PREFIX = 'dieudonne-language-map-';
const LANGUAGE_CACHE_VERSION_KEY = 'dieudonne-language-cache-version';
const LANGUAGE_CACHE_VERSION = 'v17';
const NON_TRANSLATABLE_TEXT_REGEX = /^[\d\s\W_]+$/;
const TRANSLATION_BATCH_SIZE = 12;
const TRANSLATION_PARALLEL_BATCHES = 1;
const TRANSLATION_RETRY_LIMIT = 4;
const ENGLISH_TRANSLATION_STOP_WORDS = new Set([
  'a',
  'an',
  'and',
  'are',
  'as',
  'at',
  'be',
  'before',
  'by',
  'for',
  'from',
  'her',
  'in',
  'is',
  'it',
  'of',
  'on',
  'or',
  'she',
  'that',
  'the',
  'this',
  'to',
  'was',
  'with',
  'you',
  'your'
]);
const LOCALE_TRANSLATION_HINT_WORDS = {
  es: new Set(['de', 'la', 'el', 'en', 'y', 'para', 'con', 'que', 'por', 'una', 'los', 'las']),
  fr: new Set(['de', 'la', 'le', 'les', 'et', 'pour', 'avec', 'des', 'une', 'du', 'au', 'sur']),
  ht: new Set(['ak', 'nan', 'pou', 'yon', 'se', 'sa', 'li', 'yo', 'sou', 'an', 'pa', 'ki'])
};
const EXTERNAL_LANGUAGE_PACKS = {};
const LOCAL_LANGUAGE_PACKS = {
  mainGuide: mainGuideTranslationPack
};

const STATIC_UI_TRANSLATIONS = {
  es: {
    'Core Partner Wins': 'Logros Clave de la Pareja',
    'Core Partner Win Logged': 'Logro Clave Registrado',
    'Full Journey Support Guide': 'Guía Completa de Apoyo en Todo el Proceso',
    'Pregnancy Support Partner Training Hub': 'Centro de Formación para Parejas de Apoyo en el Embarazo',
    'Built for partners. Designed for safer maternal outcomes.': 'Creado para parejas. Diseñado para resultados maternos más seguros.',
    'Dieudonne Partner Hub equips fathers and support people with clinically grounded guidance, interactive training, and intelligent coaching across prenatal, labor, and postpartum recovery.': 'Dieudonne Partner Hub equipa a padres y personas de apoyo con orientación clínicamente fundamentada, entrenamiento interactivo y coaching inteligente durante prenatal, parto y recuperación posparto.',
    'Why this platform works': 'Por qué esta plataforma funciona',
    'Clinically grounded playbooks': 'Guías clínicamente fundamentadas',
    'Evidence-informed training content, warning-sign thresholds, and partner action checklists that convert uncertainty into confident support.': 'Contenido formativo basado en evidencia, umbrales de señales de alerta y listas de acción para la pareja que convierten la incertidumbre en apoyo con confianza.',
    'Interactive learning system': 'Sistema de aprendizaje interactivo',
    'Flip-card training, stage-based physiology guides, and dashboard progression reinforce what to do, when to do it, and why it matters.': 'Entrenamiento con tarjetas interactivas, guías fisiológicas por etapa y progresión en el panel que refuerzan qué hacer, cuándo hacerlo y por qué importa.',
    'Real-time partner support': 'Apoyo de pareja en tiempo real',
    'Use intelligent clarifier, labor coach, and recovery nutrition tools to get practical language and action plans in the moment.': 'Usa el aclarador inteligente, el coach de parto y las herramientas de nutrición de recuperación para obtener lenguaje práctico y planes de acción al momento.',
    'Enter Partner Platform': 'Entrar a la Plataforma para Parejas',
    'Explore Main Guide': 'Explorar Guía Principal',
    'No fluff. Practical, clinically aligned support for real families.': 'Sin relleno. Apoyo práctico y clínicamente alineado para familias reales.',
    'Partner support journey illustration': 'Ilustración del recorrido de apoyo de la pareja',
    'Prenatal Support': 'Apoyo Prenatal',
    'Labor & Delivery': 'Trabajo de Parto y Parto',
    'Postpartum Recovery': 'Recuperación Posparto',
    'Key Terms & Definitions': 'Términos Clave y Definiciones',
    'Partner Education Dashboard': 'Panel Educativo para Parejas',
    Mastering: 'Dominando',
    'Flip the cards above to see actionable tips for this stage. As a partner, your education is just as vital as hers to ensure a safe transition for the entire family.': 'Voltea las tarjetas de arriba para ver consejos accionables para esta etapa. Como pareja, tu educación es tan vital como la de ella para asegurar una transición segura para toda la familia.',
    'Every pregnancy and labor is unique. Use these guidelines as a baseline, but always defer to the specific instructions given by your medical team.': 'Cada embarazo y parto es único. Usa estas pautas como base, pero sigue siempre las instrucciones específicas de tu equipo médico.',
    'Managing trimester-specific changes and becoming a clinical advocate.': 'Gestionar cambios específicos de cada trimestre y convertirse en un defensor clínico.',
    'Tactical support, physiological stages, and clinical decision-making.': 'Apoyo táctico, etapas fisiológicas y toma de decisiones clínicas.',
    'Physiological restoration and critical safety thresholds.': 'Restauración fisiológica y umbrales críticos de seguridad.',
    'Structured training modules with progress tracking, scenarios, and quizzes.': 'Módulos de formación estructurados con seguimiento de progreso, escenarios y cuestionarios.',
    'Interactive Anatomy Guide': 'Guía Interactiva de Anatomía',
    'Interactive Labor Physiology Guide': 'Guía Interactiva de Fisiología del Parto',
    'Interactive Postpartum Recovery Guide': 'Guía Interactiva de Recuperación Posparto',
    'Trimester 1: The Chemical Surge': 'Trimestre 1: El Impulso Químico',
    'Trimester 2: The Structural Shift': 'Trimestre 2: El Cambio Estructural',
    'Trimester 3: The Crowded House': 'Trimestre 3: La Casa Llena',
    'Anatomical & Hormonal Shifts': 'Cambios Anatómicos y Hormonales',
    'Prenatal Advocacy': 'Defensa Prenatal',
    'Center of Gravity': 'Centro de Gravedad',
    'Hormonal Mood Dynamics': 'Dinámica Emocional Hormonal',
    'Vital Tracking (BP & Glucose)': 'Seguimiento de Signos Vitales (PA y Glucosa)',
    'Pelvic Floor Health': 'Salud del Suelo Pélvico',
    'Informed Consent Advocacy': 'Defensa del Consentimiento Informado',
    'Preterm Labor Awareness': 'Vigilancia del Parto Pretérmino',
    'Her spine is curving to balance a 10-25lb weight shift.': 'Su columna se está curvando para equilibrar un cambio de peso de 10-25 lb.',
    'Progesterone and Estrogen levels are up to 100x higher than normal.': 'Los niveles de progesterona y estrógeno son hasta 100 veces más altos de lo normal.',
    'Understanding the numbers that prevent complications.': 'Comprender los números que previenen complicaciones.',
    'Relaxin is loosening ligaments throughout her body.': 'La relaxina está aflojando ligamentos en todo su cuerpo.',
    'Write questions before visits': 'Escribe preguntas antes de las visitas',
    'Ask Why are we doing this?': 'Pregunta: ¿Por qué estamos haciendo esto?',
    'Request time for private talk': 'Solicita tiempo para una conversación privada',
    'Note-take every doctor response': 'Toma nota de cada respuesta del médico',
    'Monitor contraction frequency': 'Monitorea la frecuencia de las contracciones',
    'Watch for lightening early': 'Vigila el encajamiento temprano',
    'Observe for lightening early': 'Observa el encajamiento temprano',
    'The doctor suggests an early induction. You ask, \'What are the medical indications for this, and what are the risks of waiting?\'': 'El médico sugiere una inducción temprana. Preguntas: «¿Cuáles son las indicaciones médicas para esto y cuáles son los riesgos de esperar?»',
    'The doctor always makes the final call.': 'El médico siempre toma la decisión final.',
    'She mentions a dull backache that comes and goes at 32 weeks. You start a timer and realize it\'s every 10 minutes. You call the nurse line immediately.': 'Ella menciona un dolor de espalda sordo que viene y va a las 32 semanas. Inicias un temporizador y te das cuenta de que ocurre cada 10 minutos. Llamas a la línea de enfermería de inmediato.',
    'Braxton Hicks are always harmless.': 'Las contracciones de Braxton Hicks siempre son inofensivas.',
    'Back pain is just part of the process.': 'El dolor de espalda es solo parte del proceso.',
    'Targeted support and pelvic floor awareness can significantly reduce prenatal back pain.': 'El apoyo dirigido y la conciencia del suelo pélvico pueden reducir significativamente el dolor lumbar prenatal.',
    'Blood volume increases by 50% starting now. The heart works harder, and progesterone slows digestion, causing fatigue.': 'El volumen sanguíneo aumenta un 50% desde ahora. El corazón trabaja más y la progesterona ralentiza la digestión, causando fatiga.',
    'Size of an orange': 'Tamaño de una naranja',
    'Size of a papaya': 'Tamaño de una papaya',
    'Size of a watermelon': 'Tamaño de una sandía',
    'Bladder pressure begins': 'Comienza la presión sobre la vejiga',
    'Intestines displaced upward': 'Intestinos desplazados hacia arriba',
    'Lungs and stomach compressed': 'Pulmones y estómago comprimidos',
    'hCG, Progesterone, Estrogen spikes': 'Picos de hCG, progesterona y estrógeno',
    'Relaxin loosens joints': 'La relaxina afloja las articulaciones',
    'Oxytocin and Prolactin prep': 'Preparación de oxitocina y prolactina',
    Definition: 'Definición',
    'What Is Happening In The Body': 'Qué Está Sucediendo En El Cuerpo',
    'Why It Matters Clinically': 'Por Qué Es Importante Clínicamente',
    'Mother Impact': 'Impacto en la Madre',
    'Tap to flip for training': 'Toca para voltear y entrenar',
    Back: 'Volver',
    'Support Protocol': 'Protocolo de Apoyo',
    'Emergency Protocol': 'Protocolo de Emergencia',
    'Partner Action Guide': 'Guía de Acción para la Pareja',
    'Training Deep Dive': 'Profundización de Entrenamiento',
    'Clinical Meaning': 'Significado Clínico',
    'Partner Actions': 'Acciones de la Pareja',
    'Real-World Scenario': 'Escenario Real',
    Myth: 'Mito',
    Fact: 'Hecho',
    'Escalation Trigger': 'Detonante de Escalamiento',
    'Clinical Training': 'Entrenamiento Clínico',
    'Play checklist audio': 'Reproducir audio de la lista',
    'AI support is disabled': 'El soporte de IA está desactivado',
    'Uterus:': 'Útero:',
    'Organs:': 'Órganos:',
    'Hormones:': 'Hormonas:',
    'Cervix:': 'Cérvix:',
    'Contractions:': 'Contracciones:',
    'Physiology:': 'Fisiología:',
    'Partner Focus:': 'Enfoque de la Pareja:',
    'Coaching Alert': 'Alerta de Coaching',
    'Emotional Load:': 'Carga Emocional:',
    'Partner Priority:': 'Prioridad de la Pareja:',
    'The "Partner" Role': 'El Rol de la Pareja',
    '"Your role is to manage the environment so she can manage the journey. Anticipate, don\'t ask."': '"Tu papel es gestionar el entorno para que ella pueda gestionar el proceso. Anticipa, no preguntes."',
    'Signed in as': 'Conectado como',
    'User Progress Tracking Active': 'Seguimiento de Progreso Activo',
    'Log Out': 'Cerrar sesión',
    'Site Home': 'Inicio del Sitio',
    'Back to Main Guide': 'Volver a la Guía Principal',
    'Structured Training Environment': 'Entorno de Entrenamiento Estructurado',
    'Secure sign-in to track module progress, quiz scores, and lesson completion.': 'Acceso seguro para seguir el progreso de módulos, puntajes de cuestionarios y lecciones completadas.',
    'User Scoped': 'Usuario con Alcance Propio',
    'Log In': 'Iniciar sesión',
    Register: 'Registrarse',
    Reset: 'Restablecer',
    'Temporary testing access: skip authorization and open the dashboard immediately.': 'Acceso temporal de prueba: omite la autorización y abre el panel de inmediato.',
    'Continue in Test Mode': 'Continuar en Modo de Prueba',
    'Authentication failed.': 'La autenticación falló.',
    'Passwords do not match.': 'Las contraseñas no coinciden.',
    'Reset code generated': 'Código de restablecimiento generado',
    'In production this code should be emailed securely.': 'En producción, este código debe enviarse por correo de forma segura.',
    'Password reset successful. You are now signed in.': 'Restablecimiento exitoso. Ahora has iniciado sesión.',
    Email: 'Correo electrónico',
    Password: 'Contraseña',
    'Signing in...': 'Iniciando sesión...',
    'Continue with Google': 'Continuar con Google',
    Name: 'Nombre',
    'Confirm Password': 'Confirmar contraseña',
    'Creating account...': 'Creando cuenta...',
    'Create Account': 'Crear cuenta',
    'Request Reset Code': 'Solicitar Código de Restablecimiento',
    'Generate Code': 'Generar código',
    'Complete Reset': 'Completar Restablecimiento',
    'Reset Code': 'Código de Restablecimiento',
    Try: 'Prueba',
    'Enter code': 'Ingresa el código',
    'New Password': 'Nueva contraseña',
    'Reset Password': 'Restablecer contraseña',
    'Current Module': 'Módulo actual',
    complete: 'completado',
    'Overall Progress': 'Progreso general',
    'Next Lesson': 'Próxima lección',
    'Recently Completed': 'Completado recientemente',
    'Module Progress': 'Progreso de módulos',
    'Quiz Avg': 'Promedio del cuestionario',
    Lessons: 'Lecciones',
    'Recently Completed Lessons': 'Lecciones Completadas Recientemente',
    'No lessons completed yet. Start with Prenatal Module 1.': 'Aún no hay lecciones completadas. Comienza con el Módulo Prenatal 1.',
    Review: 'Revisar',
    'Training Approach': 'Enfoque de entrenamiento',
    'This dashboard is built as structured training: lesson content, scenario practice, immediate quiz feedback, and measurable progression through Prenatal, Labor and Delivery, and Postpartum Recovery modules.': 'Este panel está diseñado como entrenamiento estructurado: contenido de lecciones, práctica de escenarios, retroalimentación inmediata y progreso medible en módulos de Apoyo Prenatal, Trabajo de Parto y Parto, y Recuperación Posparto.',
    'Back to Dashboard': 'Volver al panel',
    Lesson: 'Lección',
    Quiz: 'Cuestionario',
    Completed: 'Completado',
    'Responses saved': 'Respuestas guardadas',
    Locked: 'Bloqueado',
    Open: 'Abrir',
    'Module not found.': 'Módulo no encontrado.',
    'This module is locked. Complete the previous module to continue progression.': 'Este módulo está bloqueado. Completa el módulo anterior para continuar.',
    'Lesson not found.': 'Lección no encontrada.',
    'Module is locked. Complete previous module first.': 'El módulo está bloqueado. Completa primero el módulo anterior.',
    'Lesson is locked. Complete the previous lesson first.': 'La lección está bloqueada. Completa primero la lección anterior.',
    'Unknown dashboard path.': 'Ruta del panel desconocida.',
    'Return to Dashboard Home': 'Volver al inicio del panel',
    'Back to Module': 'Volver al módulo',
    'Clinical Learning': 'Aprendizaje clínico',
    'Medical Terms': 'Términos médicos',
    'Cultural Sensitivity Notes': 'Notas de sensibilidad cultural',
    'Scenario Exercise': 'Ejercicio de escenario',
    'Write your response plan...': 'Escribe tu plan de respuesta...',
    'Save Scenario Response': 'Guardar respuesta del escenario',
    'Knowledge Quiz': 'Cuestionario de conocimiento',
    'Select all that apply.': 'Selecciona todas las que correspondan.',
    'Submit Quiz': 'Enviar cuestionario',
    'Score:': 'Puntuación:',
    'Lesson Completion': 'Finalización de la lección',
    'Requires quiz score of at least 70% to unlock structured progression.': 'Requiere al menos 70% en el cuestionario para desbloquear la progresión estructurada.',
    'Mark Lesson Complete': 'Marcar lección como completada',
    'Lesson completed and progress saved.': 'Lección completada y progreso guardado.',
    'Saved responses loaded. You can review or edit before resubmitting.': 'Respuestas guardadas cargadas. Puedes revisarlas o editarlas antes de volver a enviar.',
    'Retake quiz to reach 70% and unlock progression.': 'Vuelve a tomar el cuestionario para llegar al 70% y desbloquear el progreso.',
    'Postpartum Warning Signs': 'Signos de Alarma Posparto',
    'Use explicit escalation thresholds. Do not wait for symptoms to worsen.': 'Usa umbrales claros de escalamiento. No esperes a que los síntomas empeoren.',
    'Call Provider': 'Llamar al proveedor',
    'Seek Emergency Care': 'Buscar atención de emergencia',
    'Intelligent Prenatal Support': 'Apoyo Prenatal Inteligente',
    'Intelligent Labor & Delivery Coach': 'Entrenador Inteligente de Trabajo de Parto y Parto',
    'Intelligent Postpartum Recovery Nutrition': 'Nutrición Inteligente para la Recuperación Posparto',
    'Confused by a term from an appointment? Ask Gemini to simplify it for you.': '¿Confundido por un término de una cita? Pídele a Gemini que te lo simplifique.',
    Explain: 'Explicar',
    'Working...': 'Procesando...',
    'Need fresh affirmations or support ideas for right now?': '¿Necesitas afirmaciones nuevas o ideas de apoyo para este momento?',
    'Generate Coach Tips ✨': 'Generar Consejos de Apoyo ✨',
    'Generate a meal idea optimized for her recovery stage.': 'Genera una idea de comida optimizada para su etapa de recuperación.',
    'Get Meal Idea ✨': 'Obtener Idea de Comida ✨',
    'Generating Coach Tips...': 'Generando Consejos...',
    'Generating Meal Tips...': 'Generando Consejos de Comida...',
    'Track meds, hydration, and pad volume; advocate for uninterrupted recovery time.': 'Controla medicamentos, hidratación y cantidad de sangrado en toallas; defiende un tiempo de recuperación sin interrupciones.',
    'Protect a 4-hour sleep block, reduce visitors, and maintain nutrition/hydration cadence.': 'Protege un bloque de 4 horas de sueño, reduce visitantes y mantén una rutina constante de nutrición e hidratación.',
    'Track symptom trajectory, support follow-up appointments, and continue household load ownership.': 'Da seguimiento a la evolución de síntomas, apoya citas de control y continúa asumiendo la carga del hogar.',
    'Support postpartum check visits, pelvic floor care, and long-term sleep protection plans.': 'Apoya las visitas de control posparto, el cuidado del suelo pélvico y planes de protección del sueño a largo plazo.',
    'She is wincing while breastfeeding.': 'Hace una mueca de dolor mientras amamanta.',
    "She's worried because the bleeding turned yellow.": 'Está preocupada porque el sangrado se volvió amarillo.',
    'Terms Learning Mode': 'Modo de Aprendizaje de Términos',
    'Dashboard Access': 'Acceso al Panel',
    'Use this tab to enter the full partner learning environment with secured user profiles, module progression, and quiz scoring.': 'Usa esta pestaña para entrar al entorno completo de aprendizaje de la pareja con perfiles seguros, progresión de módulos y puntuación de cuestionarios.',
    'Gemini Intelligent Insight': 'Perspectiva Inteligente de Gemini',
    'Got it': 'Entendido',
    '© 2026 Dieudonne Foundation': '© 2026 Fundación Dieudonne',
    "EQUIPPING EVERY MOTHER'S CHAMPION FOR THE JOURNEY AHEAD.": 'EQUIPANDO A CADA DEFENSOR DE CADA MADRE PARA EL CAMINO ADELANTE.',
    'SITE BUILT BY CHERY TALENT MANAGEMENT AGENCY': 'SITIO CREADO POR CHERY TALENT MANAGEMENT AGENCY',
    'Dark Mode': 'Modo Oscuro',
    'Light Mode': 'Modo Claro'
  },
  fr: {
    'Core Partner Wins': 'Victoires Clés du Partenaire',
    'Hydration Goal Met': 'Objectif Hydratation Atteint',
    'Handed her food (no ask)': 'Repas apporté sans qu’elle le demande',
    'Clear of laundry': 'Lessive terminée',
    'Bonding/Soothing Time': 'Temps de lien/apaisement',
    'Active Listening Time': 'Temps d’écoute active',
    'Full Journey Support Guide': 'Guide Complet de Soutien',
    'Pregnancy Support Partner Training Hub': 'Centre de Formation pour Partenaires de Soutien pendant la Grossesse',
    'Built for partners. Designed for safer maternal outcomes.': 'Conçue pour les partenaires. Pensée pour des résultats maternels plus sûrs.',
    'Dieudonne Partner Hub equips fathers and support people with clinically grounded guidance, interactive training, and intelligent coaching across prenatal, labor, and postpartum recovery.': 'Dieudonne Partner Hub accompagne les pères et les personnes de soutien avec des repères cliniquement fondés, une formation interactive et un coaching intelligent pendant le prénatal, le travail et la récupération post-partum.',
    'Why this platform works': 'Pourquoi cette plateforme fonctionne',
    'Clinically grounded playbooks': 'Guides cliniquement fondés',
    'Evidence-informed training content, warning-sign thresholds, and partner action checklists that convert uncertainty into confident support.': 'Un contenu de formation fondé sur les preuves, des seuils de signes d’alerte et des checklists d’actions partenaires qui transforment l’incertitude en soutien confiant.',
    'Interactive learning system': 'Système d’apprentissage interactif',
    'Flip-card training, stage-based physiology guides, and dashboard progression reinforce what to do, when to do it, and why it matters.': 'La formation par cartes à retourner, les guides physiologiques par étape et la progression du tableau de bord renforcent quoi faire, quand le faire et pourquoi c’est important.',
    'Real-time partner support': 'Soutien partenaire en temps réel',
    'Use intelligent clarifier, labor coach, and recovery nutrition tools to get practical language and action plans in the moment.': 'Utilisez l’outil d’éclaircissement intelligent, le coach de travail et les outils de nutrition de récupération pour obtenir des formulations pratiques et des plans d’action immédiats.',
    'Enter Partner Platform': 'Entrer dans la Plateforme Partenaire',
    'Explore Main Guide': 'Explorer le Guide Principal',
    'No fluff. Practical, clinically aligned support for real families.': 'Sans superflu. Un soutien pratique et aligné cliniquement pour de vraies familles.',
    'Partner support journey illustration': 'Illustration du parcours de soutien du partenaire',
    'Prenatal Support': 'Soutien Prénatal',
    'Labor & Delivery': 'Travail et Accouchement',
    'Postpartum Recovery': 'Récupération Post-partum',
    'Key Terms & Definitions': 'Termes Clés et Définitions',
    'Partner Education Dashboard': 'Tableau de Bord Éducatif du Partenaire',
    Mastering: 'Maîtriser',
    'Flip the cards above to see actionable tips for this stage. As a partner, your education is just as vital as hers to ensure a safe transition for the entire family.': 'Retournez les cartes ci-dessus pour voir des conseils concrets pour cette étape. En tant que partenaire, votre éducation est aussi essentielle que la sienne pour assurer une transition sûre pour toute la famille.',
    'Every pregnancy and labor is unique. Use these guidelines as a baseline, but always defer to the specific instructions given by your medical team.': 'Chaque grossesse et chaque travail sont uniques. Utilisez ces directives comme base, mais suivez toujours les instructions spécifiques de votre équipe médicale.',
    'Managing trimester-specific changes and becoming a clinical advocate.': 'Gérer les changements propres à chaque trimestre et devenir un défenseur clinique.',
    'Tactical support, physiological stages, and clinical decision-making.': 'Soutien tactique, étapes physiologiques et prise de décision clinique.',
    'Physiological restoration and critical safety thresholds.': 'Restauration physiologique et seuils critiques de sécurité.',
    'Structured training modules with progress tracking, scenarios, and quizzes.': 'Modules de formation structurés avec suivi de progression, scénarios et quiz.',
    'Interactive Anatomy Guide': 'Guide Interactif d’Anatomie',
    'Interactive Labor Physiology Guide': 'Guide Interactif de Physiologie du Travail',
    'Interactive Postpartum Recovery Guide': 'Guide Interactif de Récupération Post-partum',
    'Trimester 1: The Chemical Surge': 'Trimestre 1 : La Montée Chimique',
    'Trimester 2: The Structural Shift': 'Trimestre 2 : Le Changement Structurel',
    'Trimester 3: The Crowded House': 'Trimestre 3 : L’Espace Saturé',
    'Anatomical & Hormonal Shifts': 'Changements Anatomiques et Hormonaux',
    'Prenatal Advocacy': 'Plaidoyer Prénatal',
    'Center of Gravity': 'Centre de Gravité',
    'Hormonal Mood Dynamics': 'Dynamique Hormonale de l’Humeur',
    'Vital Tracking (BP & Glucose)': 'Suivi des Paramètres Vitaux (TA et Glucose)',
    'Pelvic Floor Health': 'Santé du Plancher Pelvien',
    'Informed Consent Advocacy': 'Défense du Consentement Éclairé',
    'Preterm Labor Awareness': 'Vigilance du Travail Prématuré',
    'Her spine is curving to balance a 10-25lb weight shift.': 'Sa colonne se courbe pour compenser un déplacement de poids de 10 à 25 lb.',
    'Progesterone and Estrogen levels are up to 100x higher than normal.': 'Les niveaux de progestérone et d’œstrogène peuvent être jusqu’à 100 fois supérieurs à la normale.',
    'Understanding the numbers that prevent complications.': 'Comprendre les chiffres qui permettent de prévenir les complications.',
    'Relaxin is loosening ligaments throughout her body.': 'La relaxine assouplit les ligaments dans tout son corps.',
    'Write questions before visits': 'Préparez des questions avant les consultations',
    'Ask Why are we doing this?': 'Demandez : Pourquoi faisons-nous cela ?',
    'Request time for private talk': 'Demandez un moment pour un échange privé',
    'Note-take every doctor response': 'Notez chaque réponse du médecin',
    'Monitor contraction frequency': 'Surveillez la fréquence des contractions',
    'Watch for lightening early': 'Surveillez un engagement précoce du bébé',
    'Observe for lightening early': 'Observez un engagement précoce du bébé',
    'The doctor suggests an early induction. You ask, \'What are the medical indications for this, and what are the risks of waiting?\'': 'Le médecin propose un déclenchement précoce. Vous demandez : « Quelles sont les indications médicales et quels sont les risques d’attendre ? »',
    'The doctor always makes the final call.': 'Le médecin prend toujours la décision finale.',
    'She mentions a dull backache that comes and goes at 32 weeks. You start a timer and realize it\'s every 10 minutes. You call the nurse line immediately.': 'Elle mentionne une douleur lombaire sourde qui va et vient à 32 semaines. Vous lancez un chronomètre et réalisez que cela revient toutes les 10 minutes. Vous appelez immédiatement la ligne infirmière.',
    'Braxton Hicks are always harmless.': 'Les contractions de Braxton Hicks sont toujours sans danger.',
    'Back pain is just part of the process.': 'Le mal de dos fait simplement partie du processus.',
    'Targeted support and pelvic floor awareness can significantly reduce prenatal back pain.': 'Un soutien ciblé et une meilleure conscience du plancher pelvien peuvent réduire significativement les douleurs lombaires prénatales.',
    'Blood volume increases by 50% starting now. The heart works harder, and progesterone slows digestion, causing fatigue.': 'Le volume sanguin augmente de 50 % dès maintenant. Le cœur travaille davantage, et la progestérone ralentit la digestion, ce qui provoque de la fatigue.',
    'Size of an orange': 'Taille d’une orange',
    'Size of a papaya': 'Taille d’une papaye',
    'Size of a watermelon': 'Taille d’une pastèque',
    'Bladder pressure begins': 'La pression sur la vessie commence',
    'Intestines displaced upward': 'Intestins déplacés vers le haut',
    'Lungs and stomach compressed': 'Poumons et estomac comprimés',
    'hCG, Progesterone, Estrogen spikes': 'Pics de hCG, progestérone et œstrogène',
    'Relaxin loosens joints': 'La relaxine assouplit les articulations',
    'Oxytocin and Prolactin prep': 'Préparation de l’ocytocine et de la prolactine',
    'Essential language partners should understand to support mom confidently at each stage.': 'Langage essentiel que les partenaires doivent comprendre pour soutenir la maman avec confiance à chaque étape.',
    'Terms Learning Mode': 'Mode d’Apprentissage des Termes',
    'Review this tab to decode anatomy, medical decisions, and emotional language so you can respond with confidence in real time.': 'Consultez cet onglet pour décoder l’anatomie, les décisions médicales et le langage émotionnel afin de répondre avec confiance en temps réel.',
    'Confused by a term from an appointment? Ask Gemini to simplify it for you.': 'Perdu avec un terme vu en consultation ? Demandez à Gemini de vous l’expliquer simplement.',
    Explain: 'Expliquer',
    'Working...': 'Traitement...',
    'Need fresh affirmations or support ideas for right now?': 'Besoin de nouvelles affirmations ou idées de soutien pour maintenant ?',
    'Generate Coach Tips ✨': 'Générer des Conseils de Coaching ✨',
    'Generate a meal idea optimized for her recovery stage.': 'Générez une idée de repas optimisée pour sa phase de récupération.',
    'Get Meal Idea ✨': 'Obtenir une Idée de Repas ✨',
    'Generating Coach Tips...': 'Génération des Conseils...',
    'Generating Meal Tips...': 'Génération des Idées de Repas...',
    'Dashboard Access': 'Accès au Tableau de Bord',
    'Use this tab to enter the full partner learning environment with secured user profiles, module progression, and quiz scoring.': 'Utilisez cet onglet pour accéder à l’environnement complet d’apprentissage du partenaire avec profils sécurisés, progression des modules et scores de quiz.',
    Definition: 'Définition',
    'What Is Happening In The Body': 'Ce Qui Se Passe Dans Le Corps',
    'Why It Matters Clinically': 'Pourquoi C’est Important Cliniquement',
    'Mother Impact': 'Impact sur la Mère',
    'Tap to flip for training': 'Touchez pour retourner et vous entraîner',
    Back: 'Retour',
    'Support Protocol': 'Protocole de Soutien',
    'Emergency Protocol': 'Protocole d’Urgence',
    'Partner Action Guide': 'Guide d’Action du Partenaire',
    'Training Deep Dive': 'Approfondissement de Formation',
    'Clinical Meaning': 'Signification Clinique',
    'Partner Actions': 'Actions du Partenaire',
    'Real-World Scenario': 'Scénario Réel',
    Myth: 'Mythe',
    Fact: 'Fait',
    'Escalation Trigger': 'Déclencheur d’Escalade',
    'Clinical Training': 'Formation Clinique',
    'Play checklist audio': 'Lire l’audio de la checklist',
    'AI support is disabled': 'Le support IA est désactivé',
    'Uterus:': 'Utérus :',
    'Organs:': 'Organes :',
    'Hormones:': 'Hormones :',
    'Cervix:': 'Col :',
    'Contractions:': 'Contractions :',
    'Physiology:': 'Physiologie :',
    'Partner Focus:': 'Focus du Partenaire :',
    'Coaching Alert': 'Alerte de Coaching',
    'Emotional Load:': 'Charge Émotionnelle :',
    'Partner Priority:': 'Priorité du Partenaire :',
    'The "Partner" Role': 'Le Rôle du Partenaire',
    '"Your role is to manage the environment so she can manage the journey. Anticipate, don\'t ask."': '"Votre rôle est de gérer l’environnement pour qu’elle puisse gérer le parcours. Anticipez, ne demandez pas."',
    'Signed in as': 'Connecté en tant que',
    'User Progress Tracking Active': 'Suivi de Progression Actif',
    'Log Out': 'Se Déconnecter',
    'Site Home': 'Accueil du Site',
    'Back to Main Guide': 'Retour au Guide Principal',
    'Structured Training Environment': 'Environnement de Formation Structurée',
    'Secure sign-in to track module progress, quiz scores, and lesson completion.': 'Connexion sécurisée pour suivre la progression des modules, les scores de quiz et la complétion des leçons.',
    'User Scoped': 'Portée Utilisateur',
    'Log In': 'Se Connecter',
    Register: 'S’inscrire',
    Reset: 'Réinitialiser',
    'Temporary testing access: skip authorization and open the dashboard immediately.': 'Accès test temporaire : ignorez l’autorisation et ouvrez immédiatement le tableau de bord.',
    'Continue in Test Mode': 'Continuer en Mode Test',
    'Authentication failed.': 'Échec de l’authentification.',
    'Passwords do not match.': 'Les mots de passe ne correspondent pas.',
    'Reset code generated': 'Code de réinitialisation généré',
    'In production this code should be emailed securely.': 'En production, ce code doit être envoyé par e-mail de manière sécurisée.',
    'Password reset successful. You are now signed in.': 'Réinitialisation réussie. Vous êtes maintenant connecté.',
    Email: 'E-mail',
    Password: 'Mot de passe',
    'Signing in...': 'Connexion...',
    'Continue with Google': 'Continuer avec Google',
    Name: 'Nom',
    'Confirm Password': 'Confirmer le mot de passe',
    'Creating account...': 'Création du compte...',
    'Create Account': 'Créer un compte',
    'Request Reset Code': 'Demander un code de réinitialisation',
    'Generate Code': 'Générer le code',
    'Complete Reset': 'Finaliser la réinitialisation',
    'Reset Code': 'Code de réinitialisation',
    Try: 'Essayez',
    'Enter code': 'Entrez le code',
    'New Password': 'Nouveau mot de passe',
    'Reset Password': 'Réinitialiser le mot de passe',
    'Current Module': 'Module Actuel',
    complete: 'terminé',
    'Overall Progress': 'Progression Globale',
    'Next Lesson': 'Prochaine Leçon',
    'Recently Completed': 'Récemment Terminé',
    'Module Progress': 'Progression des Modules',
    'Quiz Avg': 'Moyenne Quiz',
    Lessons: 'Leçons',
    'Recently Completed Lessons': 'Leçons Récemment Terminées',
    'No lessons completed yet. Start with Prenatal Module 1.': 'Aucune leçon terminée pour le moment. Commencez par le module prénatal 1.',
    Review: 'Réviser',
    'Training Approach': 'Approche de Formation',
    'This dashboard is built as structured training: lesson content, scenario practice, immediate quiz feedback, and measurable progression through Prenatal, Labor and Delivery, and Postpartum Recovery modules.': 'Ce tableau de bord est conçu comme une formation structurée : contenu des leçons, pratique de scénarios, retour immédiat des quiz et progression mesurable à travers les modules prénatal, travail et accouchement, et récupération post-partum.',
    'Back to Dashboard': 'Retour au Tableau de Bord',
    Lesson: 'Leçon',
    Quiz: 'Quiz',
    Completed: 'Terminé',
    'Responses saved': 'Réponses enregistrées',
    Locked: 'Verrouillé',
    Open: 'Ouvrir',
    'Module not found.': 'Module introuvable.',
    'This module is locked. Complete the previous module to continue progression.': 'Ce module est verrouillé. Terminez le module précédent pour continuer.',
    'Lesson not found.': 'Leçon introuvable.',
    'Module is locked. Complete previous module first.': 'Le module est verrouillé. Terminez d’abord le module précédent.',
    'Lesson is locked. Complete the previous lesson first.': 'La leçon est verrouillée. Terminez d’abord la leçon précédente.',
    'Unknown dashboard path.': 'Chemin du tableau de bord inconnu.',
    'Return to Dashboard Home': 'Retour à l’accueil du tableau de bord',
    'Back to Module': 'Retour au Module',
    'Clinical Learning': 'Apprentissage Clinique',
    'Medical Terms': 'Termes Médicaux',
    'Cultural Sensitivity Notes': 'Notes de Sensibilité Culturelle',
    'Scenario Exercise': 'Exercice de Scénario',
    'Write your response plan...': 'Écrivez votre plan de réponse...',
    'Save Scenario Response': 'Enregistrer la réponse au scénario',
    'Knowledge Quiz': 'Quiz de Connaissances',
    'Select all that apply.': 'Sélectionnez toutes les réponses applicables.',
    'Submit Quiz': 'Soumettre le quiz',
    'Score:': 'Score :',
    'Lesson Completion': 'Achèvement de la Leçon',
    'Requires quiz score of at least 70% to unlock structured progression.': 'Nécessite un score d’au moins 70 % au quiz pour débloquer la progression structurée.',
    'Mark Lesson Complete': 'Marquer la leçon comme terminée',
    'Lesson completed and progress saved.': 'Leçon terminée et progression enregistrée.',
    'Saved responses loaded. You can review or edit before resubmitting.': 'Les réponses enregistrées sont chargées. Vous pouvez les relire ou les modifier avant de renvoyer.',
    'Retake quiz to reach 70% and unlock progression.': 'Refaites le quiz pour atteindre 70 % et débloquer la progression.',
    'Postpartum Warning Signs': 'Signes d’Alerte Post-partum',
    'Use explicit escalation thresholds. Do not wait for symptoms to worsen.': 'Utilisez des seuils d’escalade explicites. N’attendez pas que les symptômes empirent.',
    'Call Provider': 'Appeler le soignant',
    'Seek Emergency Care': 'Chercher des soins d’urgence',
    'Track meds, hydration, and pad volume; advocate for uninterrupted recovery time.': 'Suivez les médicaments, l’hydratation et le volume des protections; défendez un temps de récupération sans interruption.',
    'Protect a 4-hour sleep block, reduce visitors, and maintain nutrition/hydration cadence.': 'Protégez un bloc de 4 heures de sommeil, réduisez les visites et maintenez un rythme nutrition/hydratation.',
    'Track symptom trajectory, support follow-up appointments, and continue household load ownership.': 'Suivez l’évolution des symptômes, soutenez les rendez-vous de suivi et continuez à assumer la charge du foyer.',
    'Support postpartum check visits, pelvic floor care, and long-term sleep protection plans.': 'Soutenez les visites de contrôle post-partum, les soins du plancher pelvien et les plans de protection du sommeil à long terme.',
    'She is wincing while breastfeeding.': 'Elle grimace de douleur pendant l’allaitement.',
    "She's worried because the bleeding turned yellow.": 'Elle est inquiète parce que le saignement est devenu jaune.',
    'Intelligent Prenatal Support': 'Soutien Prénatal Intelligent',
    'Intelligent Labor & Delivery Coach': 'Coach Intelligent Travail et Accouchement',
    'Intelligent Postpartum Recovery Nutrition': 'Nutrition Intelligente de Récupération Post-partum',
    'Gemini Intelligent Insight': 'Aperçu Intelligent Gemini',
    'Got it': 'Compris',
    'Dark Mode': 'Mode Sombre',
    'Light Mode': 'Mode Clair'
  },
  ht: {
    'Core Partner Wins': 'Reyalizasyon Kle Patnè a',
    'Full Journey Support Guide': 'Gid Sipò Konplè',
    'Pregnancy Support Partner Training Hub': 'Sant Fòmasyon Patnè Sipò Gwosès',
    'Built for partners. Designed for safer maternal outcomes.': 'Bati pou patnè yo. Fèt pou pi bon sekirite pou manman yo.',
    'Dieudonne Partner Hub equips fathers and support people with clinically grounded guidance, interactive training, and intelligent coaching across prenatal, labor, and postpartum recovery.': 'Dieudonne Partner Hub ekipe papa ak moun sipò yo ak gid ki baze sou klinik, fòmasyon entèaktif, ak antrenman entelijan atravè prenatal, travay akouchman, ak rekiperasyon apre akouchman.',
    'Why this platform works': 'Poukisa platfòm sa a mache',
    'Clinically grounded playbooks': 'Gid ki baze sou klinik',
    'Evidence-informed training content, warning-sign thresholds, and partner action checklists that convert uncertainty into confident support.': 'Kontni fòmasyon ki baze sou prèv, papòt siy avètisman, ak lis aksyon patnè ki transfòme ensètitid an sipò ak konfyans.',
    'Interactive learning system': 'Sistèm aprantisaj entèaktif',
    'Flip-card training, stage-based physiology guides, and dashboard progression reinforce what to do, when to do it, and why it matters.': 'Fòmasyon kat pou vire yo, gid fizyoloji pa etap, ak pwogrè dashboard la ranfòse sa pou fè, kilè pou fè li, ak poukisa sa enpòtan.',
    'Real-time partner support': 'Sipò patnè an tan reyèl',
    'Use intelligent clarifier, labor coach, and recovery nutrition tools to get practical language and action plans in the moment.': 'Sèvi ak klarifikatè entelijan, antrenè travay akouchman, ak zouti nitrisyon rekiperasyon pou jwenn langaj pratik ak plan aksyon nan moman an.',
    'Enter Partner Platform': 'Antre nan Platfòm Patnè a',
    'Explore Main Guide': 'Eksplore Gid Prensipal la',
    'No fluff. Practical, clinically aligned support for real families.': 'Pa gen dekore. Sipò pratik, aliyen ak klinik pou fanmi reyèl yo.',
    'Partner support journey illustration': 'Ilistrasyon vwayaj sipò patnè a',
    'Prenatal Support': 'Sipò Prenatal',
    'Labor & Delivery': 'Travay Akouchman ak Akouchman',
    'Postpartum Recovery': 'Rekiperasyon Apre Akouchman',
    'Key Terms & Definitions': 'Tèm Kle ak Definisyon',
    'Partner Education Dashboard': 'Tablo Edikasyon Patnè a',
    Mastering: 'Metrize',
    'Flip the cards above to see actionable tips for this stage. As a partner, your education is just as vital as hers to ensure a safe transition for the entire family.': 'Vire kat yo anlè a pou wè konsèy konkrè pou etap sa a. Kòm patnè, edikasyon ou enpòtan menm jan ak pa li pou asire yon tranzisyon an sekirite pou tout fanmi an.',
    'Every pregnancy and labor is unique. Use these guidelines as a baseline, but always defer to the specific instructions given by your medical team.': 'Chak gwosès ak chak travay akouchman inik. Sèvi ak gid sa yo kòm baz, men toujou swiv enstriksyon espesifik ekip medikal ou.',
    'Managing trimester-specific changes and becoming a clinical advocate.': 'Jere chanjman espesifik chak trimès epi vin yon defansè klinik.',
    'Tactical support, physiological stages, and clinical decision-making.': 'Sipò taktik, etap fizyolojik, ak desizyon klinik.',
    'Physiological restoration and critical safety thresholds.': 'Retablisman fizyolojik ak papòt sekirite kritik.',
    'Structured training modules with progress tracking, scenarios, and quizzes.': 'Modil fòmasyon estriktire ak swivi pwogrè, senaryo, ak tès.',
    'Interactive Anatomy Guide': 'Gid Entèaktif Anatomi',
    'Interactive Labor Physiology Guide': 'Gid Entèaktif Fizyoloji Travay',
    'Interactive Postpartum Recovery Guide': 'Gid Entèaktif Rekiperasyon Apre Akouchman',
    'Trimester 1: The Chemical Surge': 'Trimès 1: Vag Chimik la',
    'Trimester 2: The Structural Shift': 'Trimès 2: Chanjman Estriktirèl la',
    'Trimester 3: The Crowded House': 'Trimès 3: Espas la Vin Chaje',
    'Anatomical & Hormonal Shifts': 'Chanjman Anatomi ak Òmòn',
    'Prenatal Advocacy': 'Defans Prenatal',
    'Center of Gravity': 'Sant Gravite',
    'Hormonal Mood Dynamics': 'Dinamik Atitid Òmòn',
    'Vital Tracking (BP & Glucose)': 'Swivi Siy Vital (TA ak Glikoz)',
    'Pelvic Floor Health': 'Sante Planche Pelvik',
    'Informed Consent Advocacy': 'Defans Konsantman Enfòme',
    'Preterm Labor Awareness': 'Vijilans Travay Bonè',
    'Her spine is curving to balance a 10-25lb weight shift.': 'Kolòn vètebral li ap koube pou balanse yon chanjman pwa 10-25 liv.',
    'Progesterone and Estrogen levels are up to 100x higher than normal.': 'Nivo pwogestewòn ak estwojèn ka rive jiska 100 fwa pi wo pase nòmal.',
    'Understanding the numbers that prevent complications.': 'Konprann chif ki ede anpeche konplikasyon.',
    'Relaxin is loosening ligaments throughout her body.': 'Relaxin ap lage ligaman yo atravè kò li.',
    'Write questions before visits': 'Ekri kestyon anvan vizit yo',
    'Ask Why are we doing this?': 'Mande: Poukisa n ap fè sa?',
    'Request time for private talk': 'Mande tan pou pale an prive',
    'Note-take every doctor response': 'Pran nòt sou chak repons doktè a',
    'Monitor contraction frequency': 'Swiv frekans kontraksyon yo',
    'Watch for lightening early': 'Obseve siy tibebe a desann bonè',
    'Observe for lightening early': 'Obseve siy tibebe a desann bonè',
    'The doctor suggests an early induction. You ask, \'What are the medical indications for this, and what are the risks of waiting?\'': 'Doktè a pwopoze yon endiksyon bonè. Ou mande: "Ki endikasyon medikal yo pou sa, epi ki risk ki genyen si nou tann?"',
    'The doctor always makes the final call.': 'Se doktè a ki toujou fè dènye desizyon an.',
    'She mentions a dull backache that comes and goes at 32 weeks. You start a timer and realize it\'s every 10 minutes. You call the nurse line immediately.': 'Li di li gen yon doulè do ki lejè k ap vini epi ale nan 32 semèn. Ou mete kronomèt epi ou remake sa ap vini chak 10 minit. Ou rele liy enfimyè a touswit.',
    'Back pain is just part of the process.': 'Doulè do se jis yon pati nòmal nan pwosesis la.',
    'Targeted support and pelvic floor awareness can significantly reduce prenatal back pain.': 'Sipò vize ak konsyans planche pelvik ka diminye doulè do prenatal anpil.',
    'Blood volume increases by 50% starting now. The heart works harder, and progesterone slows digestion, causing fatigue.': 'Volim san an ogmante 50% depi kounye a. Kè a travay pi di, epi pwogestewòn ralanti dijesyon, sa ki lakoz fatig.',
    'Size of an orange': 'Gwosè yon zoranj',
    'Size of a papaya': 'Gwosè yon papay',
    'Size of a watermelon': 'Gwosè yon melon dlo',
    'Bladder pressure begins': 'Presyon sou blad pipi a kòmanse',
    'Intestines displaced upward': 'Trip yo deplase anlè',
    'Lungs and stomach compressed': 'Poumon ak lestomak konprese',
    'hCG, Progesterone, Estrogen spikes': 'hCG, Progesterone, Estrogen monte anpil',
    'Relaxin loosens joints': 'Relaxin lage jwenti yo',
    'Oxytocin and Prolactin prep': 'Oksitosin ak Prolaktin ap prepare',
    'Ensuring every medical decision is collaborative.': 'Asire chak desizyon medikal fèt an kolaborasyon.',
    'Recognizing signs before the due date.': 'Rekonèt siy yo anvan dat akouchman an.',
    'Informed consent is the process where a provider explains the benefits, risks, and alternatives of a procedure before it is performed.': 'Konsantman enfòme se pwosesis kote yon founisè eksplike benefis, risk, ak altènativ yon pwosedi anvan yo fè li.',
    'Early labor (before 37 weeks) requires immediate intervention to stop contractions or prepare the baby\'s lungs for birth.': 'Travay bonè (anvan 37 semèn) mande entèvansyon imedya pou sispann kontraksyon yo oswa prepare poumon tibebe a pou nesans.',
    'The patient has the legal and ethical right to refuse or choose between medical options.': 'Pasyan an gen dwa legal ak etik pou refize oswa chwazi ant opsyon medikal yo.',
    'If contractions are regular, rhythmic, and increasing in intensity before 37 weeks, it is a clinical priority.': 'Si kontraksyon yo regilye, ritmik, epi yo ap ogmante anvan 37 semèn, sa se yon priyorite klinik.',
    'Check for unusual discharge': 'Tcheke pou ekoulman ki pa nòmal',
    'Call provider if water leaks': 'Rele founisè a si dlo koule',
    'Braxton Hicks are always harmless.': 'Braxton Hicks pa toujou san danje.',
    Definition: 'Definisyon',
    'What Is Happening In The Body': 'Sa K Ap Pase Nan Kò a',
    'Why It Matters Clinically': 'Poukisa Sa Enpòtan Klinikman',
    'Mother Impact': 'Enpak Sou Manman an',
    'Tap to flip for training': 'Tape pou vire pou fòmasyon',
    Back: 'Retounen',
    'Support Protocol': 'Pwotokòl Sipò',
    'Emergency Protocol': 'Pwotokòl Ijans',
    'Partner Action Guide': 'Gid Aksyon Patnè',
    'Training Deep Dive': 'Fòmasyon An Pwofondè',
    'Clinical Meaning': 'Sans Klinik',
    'Partner Actions': 'Aksyon Patnè',
    'Real-World Scenario': 'Senaryo Reyèl',
    Myth: 'Mit',
    Fact: 'Reyalite',
    'Escalation Trigger': 'Deklanche Eskalasyon',
    'Clinical Training': 'Fòmasyon Klinik',
    'Play checklist audio': 'Jwe odyo lis verifikasyon an',
    'AI support is disabled': 'Sipò IA dezaktive',
    'Uterus:': 'Matris:',
    'Organs:': 'Ògàn:',
    'Hormones:': 'Òmòn:',
    'Cervix:': 'Kòl Matris:',
    'Contractions:': 'Kontraksyon:',
    'Physiology:': 'Fizyoloji:',
    'Partner Focus:': 'Fokus Patnè:',
    'Coaching Alert': 'Alèt Coaching',
    'Emotional Load:': 'Chaj Emosyonèl:',
    'Partner Priority:': 'Priyorite Patnè:',
    'The "Partner" Role': 'Wòl "Patnè" a',
    '"Your role is to manage the environment so she can manage the journey. Anticipate, don\'t ask."': '"Wòl ou se jere anviwònman an pou li ka jere vwayaj la. Antisipe, pa mande."',
    'Signed in as': 'Konekte kòm',
    'User Progress Tracking Active': 'Swivi Pwogrè Itilizatè Aktif',
    'Log Out': 'Dekonekte',
    'Site Home': 'Akèy Sit la',
    'Back to Main Guide': 'Retounen nan Gid Prensipal la',
    'Structured Training Environment': 'Anviwònman Fòmasyon Estriktire',
    'Secure sign-in to track module progress, quiz scores, and lesson completion.': 'Koneksyon sekirize pou swiv pwogrè modil yo, nòt tès yo, ak leson ki fini yo.',
    'User Scoped': 'Aksè Itilizatè',
    'Log In': 'Konekte',
    Register: 'Enskri',
    Reset: 'Reyinisyalize',
    'Temporary testing access: skip authorization and open the dashboard immediately.': 'Aksè tès tanporè: sote otorizasyon an epi louvri dashboard la touswit.',
    'Continue in Test Mode': 'Kontinye an Mòd Tès',
    'Authentication failed.': 'Otantifikasyon an echwe.',
    'Passwords do not match.': 'Modpas yo pa menm.',
    'Reset code generated': 'Kòd reyinisyalizasyon an pwodwi',
    'In production this code should be emailed securely.': 'Nan pwodiksyon, kòd sa a dwe voye pa imèl an sekirite.',
    'Password reset successful. You are now signed in.': 'Reyinisyalizasyon modpas reyisi. Ou konekte kounye a.',
    Email: 'Imèl',
    Password: 'Modpas',
    'Signing in...': 'Ap konekte...',
    'Continue with Google': 'Kontinye ak Google',
    Name: 'Non',
    'Confirm Password': 'Konfime Modpas',
    'Creating account...': 'Ap kreye kont...',
    'Create Account': 'Kreye Kont',
    'Request Reset Code': 'Mande Kòd Reyinisyalizasyon',
    'Generate Code': 'Jenere Kòd',
    'Complete Reset': 'Konplete Reyinisyalizasyon',
    'Reset Code': 'Kòd Reyinisyalizasyon',
    Try: 'Eseye',
    'Enter code': 'Antre kòd la',
    'New Password': 'Nouvo Modpas',
    'Reset Password': 'Reyinisyalize Modpas',
    'Current Module': 'Modil Aktyèl',
    complete: 'konplè',
    'Overall Progress': 'Pwogrè Jeneral',
    'Next Lesson': 'Pwochen Leson',
    'Recently Completed': 'Dènyèman Fini',
    'Module Progress': 'Pwogrè Modil',
    'Quiz Avg': 'Mwayèn Tès',
    Lessons: 'Leson',
    'Recently Completed Lessons': 'Leson Dènyèman Fini',
    'No lessons completed yet. Start with Prenatal Module 1.': 'Pa gen leson ki fini ankò. Kòmanse ak Modil Prenatal 1.',
    Review: 'Revize',
    'Training Approach': 'Apwòch Fòmasyon',
    'This dashboard is built as structured training: lesson content, scenario practice, immediate quiz feedback, and measurable progression through Prenatal, Labor and Delivery, and Postpartum Recovery modules.': 'Dashboard sa a konstwi kòm yon fòmasyon estriktire: kontni leson, pratik senaryo, fidbak tès imedya, ak pwogrè mezire atravè modil Prenatal, Travay ak Akouchman, ak Rekiperasyon Apre Akouchman.',
    'Back to Dashboard': 'Retounen nan Dashboard',
    Lesson: 'Leson',
    Quiz: 'Tès',
    Completed: 'Fini',
    'Responses saved': 'Repons yo sove',
    Locked: 'Bloke',
    Open: 'Louvri',
    'Module not found.': 'Modil la pa jwenn.',
    'This module is locked. Complete the previous module to continue progression.': 'Modil sa a bloke. Fini modil anvan an pou kontinye pwogrè a.',
    'Lesson not found.': 'Leson an pa jwenn.',
    'Module is locked. Complete previous module first.': 'Modil la bloke. Fini modil anvan an an premye.',
    'Lesson is locked. Complete the previous lesson first.': 'Leson an bloke. Fini leson anvan an an premye.',
    'Unknown dashboard path.': 'Chemen dashboard la pa rekonèt.',
    'Return to Dashboard Home': 'Retounen nan Akèy Dashboard la',
    'Back to Module': 'Retounen nan Modil la',
    'Clinical Learning': 'Aprantisaj Klinik',
    'Medical Terms': 'Tèm Medikal',
    'Cultural Sensitivity Notes': 'Nòt Sansibilite Kiltirèl',
    'Scenario Exercise': 'Egzèsis Senaryo',
    'Write your response plan...': 'Ekri plan repons ou...',
    'Save Scenario Response': 'Sove Repons Senaryo a',
    'Knowledge Quiz': 'Tès Konesans',
    'Select all that apply.': 'Chwazi tout sa ki aplikab yo.',
    'Submit Quiz': 'Soumèt Tès la',
    'Score:': 'Nòt:',
    'Lesson Completion': 'Konpletman Leson an',
    'Requires quiz score of at least 70% to unlock structured progression.': 'Bezwen omwen 70% nan tès la pou debloke pwogrè estriktire a.',
    'Mark Lesson Complete': 'Make Leson an Fini',
    'Lesson completed and progress saved.': 'Leson an fini epi pwogrè a sove.',
    'Saved responses loaded. You can review or edit before resubmitting.': 'Repons ki te sove yo chaje. Ou ka revize oswa modifye yo anvan ou soumèt ankò.',
    'Retake quiz to reach 70% and unlock progression.': 'Refè tès la pou rive nan 70% epi debloke pwogrè a.',
    'Postpartum Warning Signs': 'Siy Danje Apre Akouchman',
    'Use explicit escalation thresholds. Do not wait for symptoms to worsen.': 'Sèvi ak papòt eskalasyon ki klè. Pa tann sentòm yo vin pi mal.',
    'Call Provider': 'Rele founisè swen an',
    'Seek Emergency Care': 'Chèche swen ijans',
    'Gemini Intelligent Insight': 'Enfòmasyon Entelijan Gemini',
    'Got it': 'Dakò',
    'Intelligent Prenatal Support': 'Sipò Prenatal Entelijan',
    'Intelligent Labor & Delivery Coach': 'Antrenè Entelijan Travay Akouchman',
    'Intelligent Postpartum Recovery Nutrition': 'Nitrisyon Entelijan pou Rekiperasyon Apre Akouchman',
    'Confused by a term from an appointment? Ask Gemini to simplify it for you.': 'Ou pa klè sou yon tèm nan randevou a? Mande Gemini pou esplike li senp.',
    Explain: 'Eksplike',
    'Working...': 'Ap travay...',
    'Need fresh affirmations or support ideas for right now?': 'Ou bezwen nouvo afimasyon oswa lide sipò pou kounye a?',
    'Generate Coach Tips ✨': 'Jenere Konsèy Sipò ✨',
    'Generate a meal idea optimized for her recovery stage.': 'Jenere yon lide manje ki adapte ak etap rekiperasyon li.',
    'Get Meal Idea ✨': 'Jwenn Lide Manje ✨',
    'Generating Coach Tips...': 'Ap Jenere Konsèy...',
    'Generating Meal Tips...': 'Ap Jenere Lide Manje...',
    'Track meds, hydration, and pad volume; advocate for uninterrupted recovery time.': 'Swiv medikaman, idratasyon, ak kantite senyen sou pad; defann tan rekiperasyon san entèripsyon.',
    'Protect a 4-hour sleep block, reduce visitors, and maintain nutrition/hydration cadence.': 'Pwoteje yon blòk 4 èdtan dòmi, diminye vizitè, epi kenbe rit nitrisyon/idratasyon an.',
    'Track symptom trajectory, support follow-up appointments, and continue household load ownership.': 'Swiv tandans sentòm yo, sipòte randevou swivi yo, epi kontinye pran chay travay lakay la.',
    'Support postpartum check visits, pelvic floor care, and long-term sleep protection plans.': 'Sipòte vizit kontwòl apre akouchman, swen planche pelvik, ak plan pwoteksyon dòmi alontèm.',
    'She is wincing while breastfeeding.': 'Li ap fè grimas doulè pandan l ap bay tete.',
    "She's worried because the bleeding turned yellow.": 'Li enkyè paske senyen an vin jòn.',
    'Terms Learning Mode': 'Mòd Aprantisaj Tèm',
    'Dashboard Access': 'Aksè Dashboard',
    'Use this tab to enter the full partner learning environment with secured user profiles, module progression, and quiz scoring.': 'Sèvi ak onglet sa a pou antre nan anviwònman aprantisaj patnè a ak pwofil sekirize, pwogresyon modil, ak nòt tès yo.',
    'Dark Mode': 'Mòd Fènwa',
    'Light Mode': 'Mòd Klè'
  }
};

const chunkList = (values, size) => {
  const chunks = [];
  for (let i = 0; i < values.length; i += size) {
    chunks.push(values.slice(i, i + size));
  }
  return chunks;
};

const cleanJsonPayload = (rawText = '') =>
  rawText
    .trim()
    .replace(/^```json/i, '')
    .replace(/^```/, '')
    .replace(/```$/, '')
    .trim();

const parseTranslationObjectPayload = (rawText, keys) => {
  const cleaned = cleanJsonPayload(rawText);
  let parsed;

  try {
    parsed = JSON.parse(cleaned);
  } catch (firstError) {
    const objectStart = cleaned.indexOf('{');
    const objectEnd = cleaned.lastIndexOf('}');
    if (objectStart === -1 || objectEnd === -1 || objectEnd <= objectStart) {
      throw firstError;
    }
    parsed = JSON.parse(cleaned.slice(objectStart, objectEnd + 1));
  }

  if (Array.isArray(parsed)) {
    if (parsed.length !== keys.length) {
      throw new Error('Translation array length mismatch.');
    }
    const mapped = {};
    keys.forEach((key, index) => {
      mapped[key] = `${parsed[index] || ''}`.trim();
    });
    return mapped;
  }

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Translation payload must be a JSON object.');
  }

  const mapped = {};
  keys.forEach((key) => {
    mapped[key] = `${parsed[key] || ''}`.trim();
  });
  return mapped;
};

const shouldQueueTranslationCandidate = (value) => {
  const text = `${value || ''}`.trim();
  if (!text) return false;
  if (!/[A-Za-zÀ-ÿ]/.test(text)) return false;
  if (NON_TRANSLATABLE_TEXT_REGEX.test(text)) return false;
  if (/^[a-z0-9:/._-]+$/i.test(text)) return false;
  if (/^(bg|text|border|rounded|p|m|h|w|flex|grid|shadow|from|to|opacity|duration|transition|hover|focus|ring|items|justify|gap|inset|absolute|relative|fixed|z)-/i.test(text)) return false;
  return true;
};

const isUsableTranslation = (source, candidate, locale) => {
  const sourceText = `${source || ''}`.trim();
  const translatedText = `${candidate || ''}`.trim();
  if (!sourceText || !translatedText) return false;
  if (locale === 'en') return true;
  if (sourceText === translatedText) return false;

  const words = translatedText.toLowerCase().match(/[a-z\u00c0-\u024f']+/g) || [];
  if (words.length <= 3) return true;

  const englishHits = words.reduce((total, word) => total + (ENGLISH_TRANSLATION_STOP_WORDS.has(word) ? 1 : 0), 0);
  const localeHints = LOCALE_TRANSLATION_HINT_WORDS[locale] || new Set();
  const localeHits = words.reduce((total, word) => total + (localeHints.has(word) ? 1 : 0), 0);

  const englishRatio = englishHits / words.length;
  if (localeHits === 0 && englishRatio >= 0.35) return false;
  if (localeHits > 0 && englishRatio > 0.6) return false;
  return true;
};

const addStringToSeedSet = (seedSet, value) => {
  const text = `${value || ''}`.trim();
  if (!shouldQueueTranslationCandidate(text)) return;
  seedSet.add(text);
};

const isRateLimitError = (error) => {
  const message = `${error?.message || error || ''}`.toLowerCase();
  return message.includes('429') || message.includes('resource_exhausted') || message.includes('quota');
};

const OFFLINE_PHRASE_TRANSLATIONS = {
  es: {
    'Built for partners. Designed for safer outcomes.': 'Creado para parejas. Diseñado para resultados más seguros.',
    'Dieudonne Partner Hub equips fathers and support people with clinically grounded guidance, interactive training, and intelligent coaching across prenatal, labor, and postpartum recovery.': 'Dieudonne Partner Hub equipa a padres y personas de apoyo con orientación clínicamente fundamentada, entrenamiento interactivo y apoyo inteligente durante el embarazo, el parto y la recuperación posparto.',
    'Built for partners': 'Creado para parejas',
    'Evidence-Informed': 'Basado en evidencia',
    'Clinically reviewed content you can trust.': 'Contenido revisado clínicamente en el que puedes confiar.',
    'Interactive Training': 'Entrenamiento interactivo',
    'Lessons that build confidence.': 'Lecciones que fortalecen la confianza.',
    'Smart Coaching': 'Apoyo inteligente',
    'Guidance when it matters most.': 'Orientación cuando más importa.',
    'Real-Time Support': 'Apoyo en tiempo real',
    'Tools for every moment.': 'Herramientas para cada momento.',
    'Clinically Grounded': 'Clínicamente fundamentado',
    'Guidance backed by evidence and best practices.': 'Orientación respaldada por evidencia y buenas prácticas.',
    'Private & Secure': 'Privado y seguro',
    'Progress and profile data stay protected.': 'El progreso y los datos del perfil se mantienen protegidos.',
    'Built for Real Families': 'Creado para familias reales',
    'Practical tools for partners in daily care.': 'Herramientas prácticas para parejas en el cuidado diario.',
    'Continuously Evolving': 'Mejora continua',
    'New content shaped by partner feedback.': 'Nuevo contenido guiado por comentarios de parejas.',
    Organizations: 'Organizaciones',
    Demo: 'Demo',
    'Match Mom with a Doula': 'Conectar a mamá con una doula',
    'Review this tab to decode anatomy, medical decisions, and emotional language so you can respond with confidence in real time.': 'Revisa esta pestaña para entender anatomía, decisiones médicas y lenguaje emocional, para responder con confianza en tiempo real.',
    'Postpartum Meal Builder': 'Constructor de comidas posparto',
    'Instant Recovery Nutrition': 'Nutrición de recuperación inmediata',
    'Generate a recovery meal pack instantly, then send it by email or text.': 'Genera un paquete de comidas de recuperación y envíalo por correo o texto.',
    'Iron + protein': 'Hierro y proteína',
    'Hydration support': 'Apoyo de hidratación',
    'Low-effort prep': 'Preparación sencilla',
    'Get Instant Meal Pack': 'Crear paquete de comidas',
    'Today\'s Partner Focus': 'Enfoque de la pareja de hoy',
    'Small actions today, lasting impact tomorrow.': 'Acciones pequeñas hoy, impacto duradero mañana.',
    'Partner Tips': 'Consejos para parejas',
    'Reminders': 'Recordatorios',
    'My Notes': 'Mis notas',
    'Quick Tools': 'Herramientas rápidas',
    'Home Setup & Recovery Support': 'Preparación del hogar y apoyo de recuperación',
    'Room-by-room planning that protects mom\'s healing, lowers stress, and keeps support practical.': 'Planificación por habitación que protege la recuperación de mamá, reduce el estrés y mantiene el apoyo práctico.',
    'Recovery Home Planner': 'Planificador del hogar de recuperación',
    'Room-by-room support checklist': 'Lista de apoyo por habitación',
    'Use these rooms as a quick reset plan before birth and through the first 6 weeks.': 'Usa estas habitaciones como plan rápido antes del parto y durante las primeras 6 semanas.',
    'Bedroom': 'Dormitorio',
    'Bathroom': 'Baño',
    'Kitchen': 'Cocina',
    'Baby area': 'Área del bebé',
    'Living space': 'Sala compartida',
    'Emergency plan': 'Plan de emergencia',
    of: 'de',
    completed: 'completadas',
    'Instant Prenatal Support': 'Apoyo prenatal inmediato',
    'Prenatal Support Builder': 'Constructor de apoyo prenatal',
    'Get partner-ready support in seconds.': 'Obtén apoyo listo para la pareja en segundos.',
    'Plain-language explanation': 'Explicación en lenguaje sencillo',
    'Questions to ask': 'Preguntas para hacer',
    'Support actions': 'Acciones de apoyo',
    'Get Pack': 'Crear paquete',
    'e.g. Anterior Placenta...': 'ej. placenta anterior...',
    'Card': 'Tarjeta',
    'Back': 'Atrás',
    'Next': 'Siguiente',
    'Anatomical & Hormonal Shifts': 'Cambios anatómicos y hormonales',
    'Center of Gravity': 'Centro de gravedad',
    'Her spine is curving to balance a 10-25lb weight shift.': 'Su columna se está curvando para equilibrar un cambio de peso de 10 a 25 lb.',
    'As the uterus grows, the center of gravity moves forward, causing lordosis (exaggerated spinal curve) and loosening of the sacroiliac joints.': 'A medida que el útero crece, el centro de gravedad se mueve hacia adelante, causando lordosis, una curvatura exagerada de la columna, y aflojamiento de las articulaciones sacroilíacas.',
    'Targeted support and pelvic floor awareness can significantly reduce prenatal back pain.': 'El apoyo dirigido y la conciencia del suelo pélvico pueden reducir significativamente el dolor lumbar prenatal.',
    'She winces while standing.': 'Ella hace una mueca de dolor al ponerse de pie.',
    'She winces while standing. You support her lower back and give your arm for stability.': 'Ella hace una mueca de dolor al ponerse de pie. Tú apoyas su espalda baja y le das tu brazo para darle estabilidad.',
    'Back pain is just part of the process.': 'El dolor de espalda es solo parte del proceso.',
    'Provide supportive footwear': 'Proporciona calzado de apoyo',
    'Give nightly lower back massage': 'Da masaje nocturno en la espalda baja',
    'Check posture during long walks': 'Revisa su postura durante caminatas largas',
    'Adjust pillows for side-sleeping': 'Ajusta almohadas para dormir de lado',
    'Hormonal Mood Dynamics': 'Dinámica hormonal del ánimo',
    'Progesterone and Estrogen levels are up to 100x higher than normal.': 'Los niveles de progesterona y estrógeno pueden estar hasta 100 veces más altos de lo normal.',
    'These hormones relax smooth muscles and support the placenta, but they also significantly impact neurotransmitters like serotonin and GABA.': 'Estas hormonas relajan los músculos lisos y apoyan la placenta, pero también afectan de forma importante neurotransmisores como la serotonina y el GABA.',
    'Her body is undergoing a massive neurochemical shift that directly impacts physical and emotional regulation.': 'Su cuerpo atraviesa un gran cambio neuroquímico que afecta directamente la regulación física y emocional.',
    'Validate feelings without fixing': 'Valida sus sentimientos sin intentar arreglar todo',
    'Track her fatigue patterns': 'Observa sus patrones de fatiga',
    'Stock iron-rich snacks': 'Ten meriendas ricas en hierro',
    'Limit overwhelming social invites': 'Limita invitaciones sociales abrumadoras',
    'She bursts into tears because the grocery store was out of a specific yogurt. You hold her, say \'I hear you, that is frustrating,\' and offer to check the next store later.': 'Ella rompe en llanto porque la tienda no tenía un yogur específico. La abrazas, dices "Te escucho, eso es frustrante", y ofreces revisar otra tienda más tarde.',
    "She is just being 'hormonal'.": 'Solo está siendo hormonal.',
    'Vital Tracking (BP & Glucose)': 'Seguimiento vital (presión arterial y glucosa)',
    'Understanding the numbers that prevent complications.': 'Comprender los números que ayudan a prevenir complicaciones.',
    "Blood pressure trends identify Preeclampsia risks; Glucose screening (1hr/3hr tests) detects Gestational Diabetes, affecting baby's birth weight.": 'Las tendencias de presión arterial identifican riesgo de preeclampsia. Las pruebas de glucosa de 1 o 3 horas detectan diabetes gestacional, que puede afectar el peso del bebé al nacer.',
    'Unmanaged gestational diabetes can lead to complex deliveries and neonatal blood sugar issues.': 'La diabetes gestacional no controlada puede llevar a partos complejos y problemas de azúcar en sangre del recién nacido.',
    'Log clinic BP results together': 'Registren juntos los resultados de presión arterial de la clínica',
    'Help prep for glucose tests': 'Ayuda a prepararse para las pruebas de glucosa',
    'Watch for sudden limb swelling': 'Vigila hinchazón repentina en extremidades',
    'Identify severe headaches': 'Identifica dolores de cabeza severos',
    'Glucose tests are optional.': 'Las pruebas de glucosa son opcionales.',
    'Dilation & Effacement': 'Dilatación y borramiento',
    'Tracking the gateway to birth.': 'Seguimiento de la puerta de entrada al nacimiento.',
    'Effacement (0-100%) is the thinning of the cervix; Dilation (0-10cm) is the widening. Both must be complete before pushing.': 'El borramiento (0 a 100%) es el adelgazamiento del cuello uterino. La dilatación (0 a 10 cm) es la apertura. Ambos deben completarse antes de pujar.',
    'Pushing before full effacement and dilation can cause cervical swelling and stall labor progress.': 'Pujar antes de completar el borramiento y la dilatación puede causar hinchazón del cuello uterino y detener el progreso del parto.',
    'Timed contractions (start/duration)': 'Cronometra contracciones (inicio y duración)',
    'Encourage frequent bladder empty': 'Anima a vaciar la vejiga con frecuencia',
    'Give sips of water or ice': 'Da sorbos de agua o hielo',
    'Change positions every 30min': 'Cambia posiciones cada 30 minutos',
    "The nurse says she is '70% and 4cm'. You explain to her: 'Your body is doing great work thinning out the cervix to make way for the baby.'": 'La enfermera dice que está "70% y 4 cm". Tú le explicas: "Tu cuerpo está haciendo un gran trabajo adelgazando el cuello uterino para abrir paso al bebé."',
    'You only push at 10cm.': 'Solo se puja a los 10 cm.',
    'Instant Labor Coach': 'Coach de parto inmediato',
    'Labor Coaching Pack': 'Paquete de acompañamiento del parto',
    'Get partner-ready coaching prompts in seconds.': 'Obtén frases de acompañamiento listas para la pareja en segundos.',
    Affirmations: 'Afirmaciones',
    'Hands-on support': 'Apoyo práctico',
    'Real-time scripts': 'Guiones en tiempo real',
    'Advocacy prompts': 'Frases de defensa',
    'Get Instant Coach Pack': 'Crear paquete de acompañamiento',
    'She may experience both physical strain and emotional intensity during this stage of care.': 'Ella puede sentir esfuerzo físico e intensidad emocional durante esta etapa de cuidado.',
    'Tactical Labor Support': 'Apoyo táctico durante el parto',
    'Oxytocin: The Labor Engine': 'Oxitocina: el motor del parto',
    'Fetal Station & Rotation': 'Estación y rotación fetal',
    'Coaching Prompts': 'Frases de acompañamiento',
    'Clinical Interventions': 'Intervenciones clínicas',
    'The B.R.A.I.N. Method': 'El método B.R.A.I.N.',
    'Cesarean Pivot': 'Cambio hacia cesárea',
    'Before Baby Arrives': 'Antes de que llegue el bebé',
    'Prenatal Home Prep': 'Preparación prenatal del hogar',
    'Prepare the house before labor so she does not manage setup while exhausted.': 'Prepara la casa antes del parto para que ella no tenga que organizarla mientras está agotada.',
    'The final weeks of pregnancy can bring pelvic pain, swelling, sleep loss, and shortness of breath. Home setup should remove stairs, clutter, and repeated decisions from her day.': 'Las últimas semanas del embarazo pueden traer dolor pélvico, hinchazón, falta de sueño y dificultad para respirar. La preparación del hogar debe quitar escaleras, desorden y decisiones repetidas de su día.',
    'Home prep is partner work because it protects her body and lowers the number of decisions she has to carry.': 'La preparación del hogar es trabajo de la pareja porque protege su cuerpo y reduce la cantidad de decisiones que ella tiene que cargar.',
    'She can enter birth knowing the recovery space is ready and she will not be responsible for last-minute household instructions.': 'Ella puede llegar al parto sabiendo que el espacio de recuperación está listo y que no será responsable de dar instrucciones de último momento en casa.',
    'Clear walkways from bed to bathroom': 'Despeja el camino de la cama al baño',
    'Place night lights near pathways': 'Coloca luces nocturnas cerca de los caminos',
    'Wash baby and mom laundry early': 'Lava con anticipación la ropa del bebé y de mamá',
    'Create a simple hospital return plan': 'Crea un plan sencillo para volver del hospital',
    'She worries the house will not be ready. You walk through the plan: clean sheets, stocked bathroom, freezer meals, and a clear path from bedroom to baby area.': 'Ella se preocupa de que la casa no esté lista. Tú repasas el plan: sábanas limpias, baño abastecido, comidas congeladas y camino despejado del dormitorio al área del bebé.',
    'Preparing the home is nesting work for mom.': 'Preparar el hogar es tarea de anidación para mamá.',
    'First 72-Hour Landing Plan': 'Plan de llegada para las primeras 72 horas',
    'Protect the first days home with quiet, supplies, and clear roles.': 'Protege los primeros días en casa con calma, suministros y roles claros.',
    'The first 72 hours often include bleeding, soreness, feeding learning, hormone shifts, and very little sleep. The home should function like a calm recovery unit.': 'Las primeras 72 horas suelen incluir sangrado, dolor, aprendizaje de alimentación, cambios hormonales y muy poco sueño. El hogar debe funcionar como una unidad tranquila de recuperación.',
    'Helpful visitors bring food, clean, or leave quickly. Holding the baby while mom hosts is not recovery support.': 'Las visitas útiles traen comida, limpian o se van pronto. Sostener al bebé mientras mamá atiende visitas no es apoyo de recuperación.',
    'She gets space to bleed, feed, cry, sleep, and learn without feeling watched or responsible for other people.': 'Ella tiene espacio para sangrar, alimentar, llorar, dormir y aprender sin sentirse observada ni responsable de otras personas.',
    'Limit visitors unless she asks': 'Limita las visitas a menos que ella las pida',
    'Set alarms for meds and meals': 'Pon alarmas para medicamentos y comidas',
    'Track pads, fluids, and symptoms': 'Registra toallas, líquidos y síntomas',
    'Keep phone chargers and documents ready': 'Mantén cargadores y documentos listos',
    'Family asks to come over the day she gets home. You say, "We are keeping the first few days quiet for healing. We will share a time when she is ready."': 'La familia pide venir el día que ella llega a casa. Tú dices: "Vamos a mantener los primeros días tranquilos para sanar. Avisaremos un horario cuando ella esté lista."',
    'Visitors help if they want to hold the baby.': 'Las visitas ayudan si quieren cargar al bebé.',
    'Six-Week Support Rhythm': 'Ritmo de apoyo de seis semanas',
    'Keep household support steady after the first week fades.': 'Mantén apoyo constante en casa después de que pase la primera semana.',
    'Postpartum recovery can last 6 weeks or longer. Bleeding, pelvic floor healing, incision recovery, feeding demands, and mood symptoms may continue after visitors stop checking in.': 'La recuperación posparto puede durar 6 semanas o más. El sangrado, la sanación del piso pélvico, la recuperación de incisiones, las demandas de alimentación y los síntomas del estado de ánimo pueden continuar después de que las visitas dejen de preguntar.',
    'The 6-week window still requires practical support, symptom tracking, and steady household ownership.': 'La ventana de 6 semanas todavía requiere apoyo práctico, seguimiento de síntomas y responsabilidad constante del hogar.',
    'She does not have to prove she still needs help just because the first rush of support has ended.': 'Ella no tiene que demostrar que todavía necesita ayuda solo porque terminó la primera ola de apoyo.',
    'Own laundry and dishes daily': 'Encárgate de la ropa y los platos a diario',
    'Protect one sleep block': 'Protege un bloque de sueño',
    'Plan follow-up visits': 'Planifica las citas de seguimiento',
    'Check mood and pain trends': 'Observa cambios en ánimo y dolor',
    'At week 3, everyone assumes she is fine. You keep the same routine: breakfast ready, laundry moving, baby care covered, and a quiet check-in before bed.': 'En la semana 3, todos asumen que ella está bien. Tú mantienes la rutina: desayuno listo, ropa en marcha, cuidado del bebé cubierto y una revisión tranquila antes de dormir.',
    'Recovery is mostly over after the first week.': 'La recuperación casi termina después de la primera semana.',
    'Room-Based Recovery Stations': 'Estaciones de recuperación por habitación',
    'Bedroom Recovery Setup': 'Preparación del dormitorio para recuperación',
    'Make the bed area a rest, feeding, and healing zone.': 'Convierte el área de la cama en una zona de descanso, alimentación y sanación.',
    'The bedroom should reduce lifting, bending, and unnecessary walking. Supplies should be reachable from bed or a nearby chair.': 'El dormitorio debe reducir cargar peso, agacharse y caminar sin necesidad. Los suministros deben estar al alcance desde la cama o una silla cercana.',
    'The bedroom also needs mom care supplies so her recovery is treated as important as newborn care.': 'El dormitorio también necesita suministros para mamá, para que su recuperación sea tratada tan importante como el cuidado del recién nacido.',
    'She can rest without getting up for every small need or asking for the same items repeatedly.': 'Ella puede descansar sin levantarse por cada necesidad pequeña ni pedir los mismos artículos una y otra vez.',
    'Set water, snacks, and meds nearby': 'Pon agua, meriendas y medicamentos cerca',
    'Keep burp cloths and pads within reach': 'Mantén paños y toallas al alcance',
    'Use pillows for body support': 'Usa almohadas para apoyar el cuerpo',
    'Place trash bags beside the bed': 'Coloca bolsas de basura junto a la cama',
    'She is settled in bed with the baby. You check the basket before leaving the room: water full, pain meds timed, burp cloths ready, and phone charged.': 'Ella está acomodada en la cama con el bebé. Antes de salir del cuarto revisas la canasta: agua llena, medicamentos a tiempo, paños listos y teléfono cargado.',
    'The bedroom only needs the baby bassinet.': 'El dormitorio solo necesita la cuna del bebé.',
    'Bathroom Recovery Setup': 'Preparación del baño para recuperación',
    'Stock the bathroom for bleeding, soreness, and private care.': 'Abastece el baño para sangrado, dolor y cuidado privado.',
    'Post-birth bathroom care may include heavy pads, peri bottles, ice packs, witch hazel, stool softeners, and careful monitoring for bleeding changes.': 'El cuidado del baño después del parto puede incluir toallas grandes, botella peri, compresas frías, hamamelis, ablandadores de heces y vigilancia cuidadosa de cambios en el sangrado.',
    'Partners can stock supplies without invading privacy. That support protects dignity and healing.': 'La pareja puede abastecer suministros sin invadir la privacidad. Ese apoyo protege la dignidad y la recuperación.',
    'She does not have to bend, search, or call out for sensitive recovery items while bleeding or in pain.': 'Ella no tiene que agacharse, buscar ni pedir artículos sensibles de recuperación mientras sangra o tiene dolor.',
    'Restock pads before each night': 'Repón toallas antes de cada noche',
    'Keep peri bottle filled': 'Mantén llena la botella peri',
    'Place clean towels within reach': 'Pon toallas limpias al alcance',
    'Watch for heavy bleeding or odor': 'Observa sangrado abundante u olor',
    'She goes to the bathroom and realizes the pads are low. You already restocked them and left a small bin for used supplies so she can move slowly and privately.': 'Ella va al baño y nota que quedan pocas toallas. Tú ya las repusiste y dejaste un recipiente pequeño para suministros usados para que pueda moverse despacio y en privado.',
    'Bathroom supplies are her personal responsibility.': 'Los suministros del baño son responsabilidad personal de ella.',
    'Feeding Station Setup': 'Preparación de la estación de alimentación',
    'Build feeding spots that support mom whether breast, bottle, or both.': 'Crea lugares de alimentación que apoyen a mamá, ya sea pecho, biberón o ambos.',
    'Feeding sessions are frequent and can be physically draining. Good stations reduce dehydration, back strain, and decision fatigue.': 'Las sesiones de alimentación son frecuentes y pueden agotar físicamente. Una buena estación reduce deshidratación, tensión de espalda y fatiga de decisiones.',
    'Feeding support also means caring for mom while her body is doing the work.': 'Apoyar la alimentación también significa cuidar a mamá mientras su cuerpo hace el trabajo.',
    'She feels supported during long feeds and has fewer reasons to push through discomfort alone.': 'Ella se siente apoyada durante alimentaciones largas y tiene menos razones para soportar incomodidad sola.',
    'Add water and one-hand snacks': 'Agrega agua y meriendas que pueda comer con una mano',
    'Keep burp cloths and wipes nearby': 'Mantén paños y toallitas cerca',
    'Set up back and arm support': 'Prepara apoyo para la espalda y los brazos',
    'Refill station after each feed': 'Repón la estación después de cada alimentación',
    'She sits down to feed and everything is ready: pillow, water, snack, burp cloth, and charger. You take the next diaper change after the feed.': 'Ella se sienta a alimentar y todo está listo: almohada, agua, merienda, paño y cargador. Tú haces el próximo cambio de pañal después de alimentar.',
    'Feeding support only means feeding the baby.': 'Apoyar la alimentación solo significa alimentar al bebé.',
    'Baby Care Station Setup': 'Preparación de la estación de cuidado del bebé',
    'Keep baby care organized so mom is not the household supply manager.': 'Mantén organizado el cuidado del bebé para que mamá no sea la encargada de todos los suministros.',
    'Diapers, wipes, clothes, swaddles, and safe sleep items should be easy to find so partners can take over care without asking mom where everything is.': 'Pañales, toallitas, ropa, mantas y artículos de sueño seguro deben ser fáciles de encontrar para que la pareja pueda encargarse sin preguntarle a mamá dónde está todo.',
    'Repeated questions keep the mental load on her. Partners should learn the system and maintain it.': 'Las preguntas repetidas mantienen la carga mental sobre ella. La pareja debe aprender el sistema y mantenerlo.',
    'She can sleep or recover while baby care continues without her managing every detail.': 'Ella puede dormir o recuperarse mientras el cuidado del bebé continúa sin que ella maneje cada detalle.',
    'Stock diapers and wipes daily': 'Repón pañales y toallitas a diario',
    'Sort clothes by easy sizes': 'Ordena la ropa por tallas fáciles',
    'Keep safe sleep area clear': 'Mantén despejada el área de sueño seguro',
    'Learn the care flow without asking': 'Aprende la rutina de cuidado sin preguntar',
    'The baby needs a change at 3 a.m. You handle it from start to finish without waking her to ask where the wipes or pajamas are.': 'El bebé necesita un cambio a las 3 a.m. Tú lo haces de principio a fin sin despertarla para preguntar dónde están las toallitas o la pijama.',
    'Mom knows where everything is, so asking is fine.': 'Mamá sabe dónde está todo, así que está bien preguntar.',
    'Household Load Protection': 'Protección contra la carga del hogar',
    'Kitchen and Meal Support': 'Apoyo en cocina y comidas',
    'Keep food simple, nourishing, and ready before hunger turns into stress.': 'Mantén la comida simple, nutritiva y lista antes de que el hambre se vuelva estrés.',
    'Recovery, milk production, wound healing, and mood stability all depend on steady hydration and food. Partners should make meals easy to reach and easy to eat.': 'La recuperación, la producción de leche, la sanación de heridas y la estabilidad emocional dependen de hidratación y comida constantes. La pareja debe hacer que las comidas sean fáciles de alcanzar y comer.',
    'A better support move is offering two simple choices or bringing food you already know works for her.': 'Una mejor forma de apoyar es ofrecer dos opciones simples o traer comida que ya sabes que le funciona.',
    'She gets steady nutrition without having to plan meals, answer repeated questions, or cook while healing.': 'Ella recibe nutrición constante sin tener que planificar comidas, responder preguntas repetidas ni cocinar mientras sana.',
    'Prep protein-rich grab foods': 'Prepara comidas rápidas ricas en proteína',
    'Refill water bottles all day': 'Rellena botellas de agua durante el día',
    'Label freezer meals clearly': 'Etiqueta claramente las comidas congeladas',
    'Handle dishes before they pile up': 'Lava platos antes de que se acumulen',
    'She has not eaten since morning. You bring a plate she can eat with one hand and place tomorrow\'s breakfast in the front of the fridge.': 'Ella no ha comido desde la mañana. Le llevas un plato que pueda comer con una mano y pones el desayuno de mañana al frente del refrigerador.',
    'Meal support means asking what she wants every time.': 'Apoyar con comidas significa preguntar qué quiere cada vez.',
    'Laundry and Cleaning Support': 'Apoyo con ropa y limpieza',
    'Take over repeat chores before they become her problem.': 'Encárgate de las tareas repetidas antes de que se vuelvan problema de ella.',
    'Laundry, dishes, floors, and trash can quickly become infection, stress, and safety issues when recovery and newborn care are happening at the same time.': 'La ropa, los platos, los pisos y la basura pueden convertirse rápido en problemas de infección, estrés y seguridad cuando la recuperación y el cuidado del recién nacido ocurren al mismo tiempo.',
    'The strongest support is owning predictable chores without making her assign them.': 'El apoyo más fuerte es encargarse de las tareas previsibles sin hacer que ella las asigne.',
    'She can focus on healing and bonding instead of scanning the house for work that still needs to be done.': 'Ella puede enfocarse en sanar y crear vínculo en lugar de revisar la casa buscando trabajo pendiente.',
    'Run one laundry load daily': 'Lava una carga de ropa al día',
    'Empty trash in recovery areas': 'Vacía la basura en áreas de recuperación',
    'Sanitize bottles or pump parts': 'Desinfecta biberones o partes del extractor',
    'Keep floors clear for walking': 'Mantén los pisos despejados para caminar',
    'The hamper is full and pump parts are in the sink. You start laundry, wash the parts, and reset the feeding station without announcing it as a favor.': 'El canasto está lleno y las partes del extractor están en el fregadero. Tú empiezas la ropa, lavas las piezas y reorganizas la estación de alimentación sin anunciarlo como favor.',
    'Helping counts only when she asks for it.': 'Ayudar cuenta solo cuando ella lo pide.',
    'Shared Living Space Setup': 'Preparación de espacios compartidos',
    'Create calm common areas that are easy for mom to use.': 'Crea áreas comunes tranquilas y fáciles de usar para mamá.',
    'Living spaces should support short rests, feeding, safe baby placement, and low-stimulation recovery without clutter or visitor pressure.': 'Los espacios compartidos deben apoyar descansos breves, alimentación, lugares seguros para el bebé y recuperación con poca estimulación, sin desorden ni presión de visitas.',
    'Every room she uses should protect her body, privacy, and energy.': 'Cada habitación que ella use debe proteger su cuerpo, su privacidad y su energía.',
    'She can be part of the home without the home demanding more from her body than she has to give.': 'Ella puede ser parte del hogar sin que el hogar exija más de su cuerpo de lo que puede dar.',
    'Create one clear sitting area': 'Crea un área clara para sentarse',
    'Keep blankets and pillows ready': 'Mantén mantas y almohadas listas',
    'Set a small supply basket nearby': 'Pon cerca una pequeña canasta de suministros',
    'Lower noise and bright lights': 'Reduce ruido y luces brillantes',
    'She wants to sit with the family but feels sore. You clear the couch, add pillows, bring water, and keep the room calm before she walks in.': 'Ella quiere sentarse con la familia pero está adolorida. Tú despejas el sofá, agregas almohadas, traes agua y mantienes la sala tranquila antes de que entre.',
    'Recovery only happens in the bedroom.': 'La recuperación solo ocurre en el dormitorio.',
    'Boundaries and Safety': 'Límites y seguridad',
    'Visitor Boundaries': 'Límites para visitas',
    'Protect mom from hosting, explaining, and overextending.': 'Protege a mamá de atender visitas, explicar y exigirse demasiado.',
    'Visitors can raise stress, interrupt feeding, reduce sleep, and increase the pressure to perform wellness. Partners should manage access and expectations.': 'Las visitas pueden aumentar el estrés, interrumpir la alimentación, reducir el sueño y aumentar la presión de aparentar estar bien. La pareja debe manejar el acceso y las expectativas.',
    'Good support means protecting mom\'s healing even when other people are excited.': 'Un buen apoyo significa proteger la recuperación de mamá aunque otras personas estén emocionadas.',
    'She does not have to spend recovery energy managing other adults or defending her need for quiet.': 'Ella no tiene que gastar energía de recuperación manejando a otros adultos ni defendiendo su necesidad de tranquilidad.',
    'Set visiting hours in advance': 'Define horarios de visita con anticipación',
    'Require help or short visits': 'Pide ayuda concreta o visitas cortas',
    'Say no without blaming mom': 'Di que no sin culpar a mamá',
    'End visits when she looks tired': 'Termina visitas cuando ella se vea cansada',
    'A relative wants to stay longer. You say, "We are closing visits now so she can rest," and walk them out without making her be the bad guy.': 'Un familiar quiere quedarse más tiempo. Tú dices: "Vamos a cerrar las visitas ahora para que ella descanse," y lo acompañas a salir sin hacer que ella parezca la mala.',
    'Good support means letting everyone meet the baby.': 'Un buen apoyo significa dejar que todos conozcan al bebé.',
    'Emergency Readiness': 'Preparación para emergencias',
    'Know when home support is not enough.': 'Reconoce cuándo el apoyo en casa no es suficiente.',
    'Some postpartum symptoms need urgent medical help, including soaking one pad per hour, chest pain, shortness of breath, severe headache, vision changes, fever, or thoughts of self-harm.': 'Algunos síntomas posparto necesitan ayuda médica urgente, incluyendo empapar una toalla por hora, dolor en el pecho, dificultad para respirar, dolor de cabeza severo, cambios en la visión, fiebre o pensamientos de hacerse daño.',
    'Partners should listen to her and also recognize warning signs that require urgent care.': 'La pareja debe escucharla y también reconocer señales de alerta que requieren atención urgente.',
    'She is safer because someone else is watching for patterns while she is exhausted and recovering.': 'Ella está más segura porque otra persona observa patrones mientras está agotada y recuperándose.',
    'Save OB and nurse line numbers': 'Guarda números del OB y línea de enfermería',
    'Know nearest emergency location': 'Conoce el lugar de emergencia más cercano',
    'Track bleeding and mood changes': 'Registra sangrado y cambios de ánimo',
    'Call 911 for chest pain or breathing trouble': 'Llama al 911 por dolor en el pecho o dificultad para respirar',
    'She says her headache is severe and her vision looks sparkly. You do not wait for it to pass. You call the provider and prepare to go in.': 'Ella dice que el dolor de cabeza es severo y que ve destellos. No esperas a que se le pase. Llamas al proveedor y te preparas para ir.',
    'A partner should wait until she decides it is serious.': 'La pareja debe esperar hasta que ella decida que es serio.',
    'Water, meds, pads, snacks, pillows, charger.': 'Agua, medicamentos, toallas, meriendas, almohadas, cargador.',
    'Pads, peri bottle, towels, trash, bleeding checks.': 'Toallas, botella peri, toallas limpias, basura, revisión de sangrado.',
    'Simple meals, labeled food, dishes handled daily.': 'Comidas simples, comida etiquetada, platos atendidos a diario.',
    'Diapers, wipes, clothes, safe sleep space.': 'Pañales, toallitas, ropa, espacio de sueño seguro.',
    'Clear seat, low noise, supply basket, visitor control.': 'Asiento despejado, poco ruido, canasta de suministros, control de visitas.',
    'Provider numbers, symptoms, ride plan, 911 triggers.': 'Números del proveedor, síntomas, plan de transporte, señales para llamar al 911.',
    'Hormones & Neurochemistry': 'Hormonas y neuroquímica',
    'Anatomy & Physiology Terms': 'Términos de anatomía y fisiología',
    'Clinical Safety Terms': 'Términos de seguridad clínica',
    'Emotional & Clinical Language': 'Lenguaje emocional y clínico',
    Term: 'Término',
    Pregnancy: 'Embarazo',
    Labor: 'Parto',
    'Labor/Postpartum': 'Parto/posparto',
    'Pregnancy/Postpartum': 'Embarazo/posparto',
    'First Trimester': 'Primer trimestre',
    'First 14 Days Postpartum': 'Primeros 14 días posparto',
    'Immediate Postpartum': 'Posparto inmediato',
    Estrogen: 'Estrógeno',
    Progesterone: 'Progesterona',
    'Human Chorionic Gonadotropin (hCG)': 'Gonadotropina coriónica humana (hCG)',
    Relaxin: 'Relaxina',
    Oxytocin: 'Oxitocina',
    Prolactin: 'Prolactina',
    Cortisol: 'Cortisol',
    'Thyroid Hormones': 'Hormonas tiroideas',
    'Postpartum Hormonal Shift': 'Cambio hormonal posparto',
    Effacement: 'Borramiento',
    Dilation: 'Dilatación',
    'Fetal Station': 'Estación fetal',
    Lochia: 'Loquios',
    Preeclampsia: 'Preeclampsia',
    'Gestational Diabetes': 'Diabetes gestacional',
    'Postpartum Hemorrhage': 'Hemorragia posparto',
    'DVT / Pulmonary Embolism': 'TVP / embolia pulmonar',
    'Baby Blues': 'Tristeza posparto',
    'Postpartum Depression / Anxiety': 'Depresión o ansiedad posparto',
    'Informed Consent': 'Consentimiento informado',
    'Golden Hour': 'Hora dorada',
    'Training Deep Dive': 'Profundización de entrenamiento',
    'Estrogen is a hormone produced by the ovaries early and the placenta later that supports uterine and placental growth.': 'El estrógeno es una hormona producida primero por los ovarios y luego por la placenta, que apoya el crecimiento del útero y la placenta.',
    'Levels increase across pregnancy, expanding uterine blood flow and modulating serotonin and dopamine signaling in the brain.': 'Los niveles aumentan durante el embarazo, expanden el flujo sanguíneo uterino y modulan las señales de serotonina y dopamina en el cerebro.',
    'Shifts in estrogen can change nausea, migraine, and sleep patterns, so tracking symptoms helps prevent dehydration and missed nutrition.': 'Los cambios de estrógeno pueden modificar náuseas, migrañas y sueño, por eso registrar síntomas ayuda a prevenir deshidratación y pérdida de nutrición.',
    'She may experience smell sensitivity, nausea, headaches, and increased emotional sensitivity when estrogen is rapidly changing.': 'Ella puede sentir sensibilidad a olores, náuseas, dolores de cabeza y mayor sensibilidad emocional cuando el estrógeno cambia rápido.',
    'Increases steadily to support uterine growth and blood flow; also modulates serotonin and dopamine pathways.': 'Aumenta de forma constante para apoyar el crecimiento uterino y el flujo sanguíneo. También modula vías de serotonina y dopamina.',
    'Higher estrogen supports placental and uterine development, but changes in neurotransmitter signaling can increase mood sensitivity, nausea, and headaches in some mothers.': 'Un estrógeno más alto apoya el desarrollo de la placenta y el útero, pero los cambios en neurotransmisores pueden aumentar sensibilidad emocional, náuseas y dolores de cabeza en algunas madres.',
    'Hormone Impact: Estrogen shifts can amplify emotional sensitivity and headache thresholds during pregnancy.': 'Impacto hormonal: los cambios de estrógeno pueden aumentar la sensibilidad emocional y bajar el umbral de dolor de cabeza durante el embarazo.',
    'Give hydration and protein snacks before nausea worsens': 'Da hidratación y meriendas con proteína antes de que empeoren las náuseas',
    'Use low-stimulus environments on headache days': 'Usa ambientes tranquilos en días de dolor de cabeza',
    'Validate mood shifts as biological, not dramatic': 'Valida los cambios de ánimo como biológicos, no como drama',
    'Physiological Restoration': 'Restauración fisiológica',
    'Uterine Involution': 'Involución uterina',
    'The shrinking of the uterus post-birth.': 'La reducción del útero después del parto.',
    'After birth, the uterus must contract to its pre-pregnancy size to prevent hemorrhage. This causes afterpains, which are more intense with subsequent babies.': 'Después del parto, el útero debe contraerse hasta su tamaño previo al embarazo para prevenir hemorragia. Esto causa dolores posparto, que pueden ser más intensos con bebés posteriores.',
    'Uterine cramping is a vital sign that the body is successfully preventing excessive blood loss.': 'Los calambres uterinos son una señal vital de que el cuerpo está previniendo con éxito una pérdida excesiva de sangre.',
    'She is wincing while breastfeeding.': 'Hace una mueca de dolor mientras amamanta.',
    'Apply heat to lower abdomen': 'Aplica calor en la parte baja del abdomen',
    'Remind her to empty bladder': 'Recuérdale vaciar la vejiga',
    'Encourage nursing (releases oxytocin)': 'Anima la lactancia (libera oxitocina)',
    'Log frequency of pains': 'Registra la frecuencia de los dolores',
    'She is wincing while breastfeeding. You explain: \'The baby nursing is helping your uterus shrink back to size. I have a heating pad ready for you.\'': 'Ella hace una mueca de dolor mientras amamanta. Tú explicas: "El bebé al lactar está ayudando a que tu útero vuelva a su tamaño. Tengo una compresa tibia lista para ti."',
    'Cramping means something is wrong.': 'Los calambres significan que algo anda mal.',
    'Lochia (Postpartum Discharge)': 'Loquios (flujo posparto)',
    'Tracking the three stages of healing.': 'Seguimiento de las tres etapas de sanación.',
    'Lochia Rubra (Red, 3-4 days), Serosa (Pink/Brown, 4-10 days), and Alba (Yellow/White, up to 6 weeks). Tracking volume is critical.': 'Loquios rubra (rojo, 3 a 4 días), serosa (rosado o marrón, 4 a 10 días) y alba (amarillo o blanco, hasta 6 semanas). Controlar el volumen es clave.',
    'Postpartum discharge can last for 4-6 weeks as the uterine lining restores itself.': 'El flujo posparto puede durar de 4 a 6 semanas mientras el revestimiento uterino se restaura.',
    'She\'s worried because the bleeding turned yellow.': 'Ella está preocupada porque el sangrado se volvió amarillo.',
    'Stock bathroom with heavy pads': 'Abastece el baño con toallas grandes',
    'Monitor for large clots': 'Vigila coágulos grandes',
    'Check color shifts daily': 'Revisa cambios de color a diario',
    'Note any foul odors': 'Observa cualquier mal olor',
    'She\'s worried because the bleeding turned yellow. You check the guide and say, \'That is Lochia Alba, it means your uterus is in the final stage of healing.\'': 'Ella está preocupada porque el sangrado se volvió amarillo. Tú revisas la guía y dices: "Eso es loquios alba, significa que tu útero está en la etapa final de sanación."',
    'Bleeding only lasts a few days.': 'El sangrado solo dura unos días.',
    'Lactation Physiology': 'Fisiología de la lactancia',
    'Colostrum to mature milk transition.': 'Transición del calostro a la leche madura.',
    'The let-down reflex is triggered by oxytocin. Engorgement occurs around Day 3-5 as mature milk comes in, increasing tissue temperature.': 'El reflejo de bajada se activa por la oxitocina. La congestión suele aparecer alrededor del día 3 al 5 cuando llega la leche madura y aumenta la temperatura del tejido.',
    'Colostrum is high-density and low-volume; the baby\'s stomach is only the size of a marble on Day 1.': 'El calostro es denso y de bajo volumen. El estómago del bebé es del tamaño de una canica el día 1.',
    'Ensure 128oz daily hydration': 'Asegura hidratación diaria abundante',
    'Apply warm/cool compresses': 'Aplica compresas tibias o frías',
    'Watch for red breast streaks': 'Vigila líneas rojas en el pecho',
    'Hand-off baby post-feed': 'Toma al bebé después de alimentar',
    'Her breasts feel rock hard and hot on Day 4. You bring her a cool compress and a large water bottle, encouraging her to nurse or pump to relieve the pressure.': 'Sus pechos se sienten duros y calientes el día 4. Le llevas una compresa fría y una botella grande de agua, animándola a amamantar o extraer leche para aliviar la presión.',
    'If she is not leaking, she has no milk.': 'Si no gotea, no tiene leche.',
    'Hormonal Reset (The Crash)': 'Reinicio hormonal (la caída)',
    'Navigating the Day 3-5 emotional shift.': 'Manejar el cambio emocional de los días 3 a 5.',
    'Progesterone and Estrogen levels drop to near-zero post-delivery, significantly impacting mood regulation and sleep cycles.': 'Los niveles de progesterona y estrógeno bajan casi a cero después del parto, lo que impacta mucho la regulación del ánimo y los ciclos de sueño.',
    'Baby Blues are expected for 14 days. Symptoms beyond 2 weeks or thoughts of self-harm require professional medical intervention.': 'La tristeza posparto puede esperarse hasta 14 días. Síntomas más allá de 2 semanas o pensamientos de hacerse daño requieren intervención médica profesional.',
    'Ensure 4 hours of solid sleep': 'Asegura 4 horas de sueño continuo',
    'Limit social visitors completely': 'Limita por completo las visitas sociales',
    'Stock feel-good comfort foods': 'Ten listas comidas reconfortantes',
    'Offer skin-to-skin time': 'Ofrece tiempo piel con piel',
    'It is Day 4 and she is crying for no reason. You do not ask why. You take the baby, say \'I have him for 3 hours, please go sleep in the quiet room.\'': 'Es el día 4 y ella llora sin razón clara. No preguntas por qué. Tomas al bebé y dices: "Yo lo tengo por 3 horas, por favor ve a dormir al cuarto tranquilo."',
    'Baby Blues are the same as PPD.': 'La tristeza posparto es igual que la depresión posparto.',
    'Recovery Home Base': 'Base de recuperación en casa',
    'Keeping recovery supplies within reach so she can heal.': 'Mantener los suministros de recuperación al alcance para que pueda sanar.',
    'Postpartum healing requires limited strain, steady hydration, pain control, feeding support, and quick access to bathroom care. A stocked recovery station prevents unnecessary walking and asking.': 'La sanación posparto requiere limitar esfuerzos, hidratación constante, control del dolor, apoyo en la alimentación y acceso rápido al cuidado del baño. Una estación abastecida evita caminar y pedir cosas sin necesidad.',
    'Many mothers avoid asking because they feel like a burden. Anticipating needs protects rest and emotional safety.': 'Muchas madres evitan pedir ayuda porque sienten que son una carga. Anticipar necesidades protege el descanso y la seguridad emocional.',
    'She feels cared for and can stay settled during feeding, bleeding, cramping, and sleep-deprived recovery moments.': 'Ella se siente cuidada y puede permanecer tranquila durante alimentación, sangrado, calambres y momentos de recuperación con poco sueño.',
    'Keep meds and water by the bed': 'Mantén medicamentos y agua junto a la cama',
    'Refill pads before they run out': 'Repón toallas antes de que se acaben',
    'Place snacks near feeding spots': 'Coloca meriendas cerca de los lugares de alimentación',
    'Take over laundry without reminders': 'Encárgate de la ropa sin recordatorios',
    'She sits down to feed the baby and realizes her water is empty. Before she asks, you refill it, bring a snack, and check if she needs fresh pads nearby.': 'Ella se sienta a alimentar al bebé y nota que su agua está vacía. Antes de que pida, la rellenas, traes una merienda y revisas si necesita toallas limpias cerca.',
    'If she needs something, she will ask.': 'Si necesita algo, lo pedirá.',
    'Medical Warning Signs (Emergency)': 'Señales médicas de alerta (emergencia)',
    'The 1-Pad Rule (Hemorrhage)': 'La regla de una toalla (hemorragia)',
    'When bleeding becomes life-threatening.': 'Cuando el sangrado se vuelve peligroso.',
    'Postpartum hemorrhage can occur up to 12 weeks after birth. It is often caused by uterine atony (uterus not contracting).': 'La hemorragia posparto puede ocurrir hasta 12 semanas después del nacimiento. A menudo es causada por atonía uterina, cuando el útero no se contrae.',
    'Soaking through one heavy pad per hour is the clinical threshold for a medical emergency.': 'Empapar una toalla grande por hora es el umbral clínico de una emergencia médica.',
    'Check if soaking 1 pad per hour': 'Revisa si empapa una toalla por hora',
    'Watch for golf-ball sized clots': 'Vigila coágulos del tamaño de una pelota de golf',
    'Monitor for dizziness/fainting': 'Vigila mareos o desmayos',
    'Call 911 if bleeding is heavy': 'Llama al 911 si el sangrado es abundante',
    'She says she just soaked a second heavy pad in 45 minutes. You do not wait for her to feel bad. You call the doctor\'s emergency line immediately.': 'Ella dice que acaba de empapar una segunda toalla grande en 45 minutos. No esperas a que se sienta peor. Llamas de inmediato a la línea de emergencia del doctor.',
    'Heavy bleeding is just normal.': 'El sangrado abundante es normal.',
    'Postpartum Preeclampsia': 'Preeclampsia posparto',
    'Severe BP spikes after birth.': 'Subidas graves de presión arterial después del parto.',
    'High blood pressure can occur after delivery, leading to seizures or organ damage if not treated with magnesium sulfate.': 'La presión arterial alta puede aparecer después del parto y causar convulsiones o daño a órganos si no se trata con sulfato de magnesio.',
    'You can develop preeclampsia up to 6 weeks after the baby is born.': 'La preeclampsia puede desarrollarse hasta 6 semanas después del nacimiento del bebé.',
    'Watch for sparkly vision': 'Vigila visión con destellos',
    'Check for severe headache': 'Revisa dolor de cabeza severo',
    'Identify upper right stomach pain': 'Identifica dolor en la parte superior derecha del abdomen',
    'Monitor facial/hand swelling': 'Vigila hinchazón en cara o manos',
    'She says she has a headache that Tylenol is not helping and her vision is weird. You immediately take her to the ER, identifying it as Postpartum.': 'Ella dice que tiene un dolor de cabeza que Tylenol no ayuda y que su visión se siente rara. La llevas de inmediato a urgencias e identificas que puede ser posparto.',
    'Preeclampsia only happens during pregnancy.': 'La preeclampsia solo ocurre durante el embarazo.',
    'DVT & Pulmonary Embolism': 'TVP y embolia pulmonar',
    'Clot risks from low mobility.': 'Riesgo de coágulos por poca movilidad.',
    'Pregnancy increases blood clotting factors. A clot in the leg (DVT) can travel to the lungs (PE), which is a 911 emergency.': 'El embarazo aumenta los factores de coagulación. Un coágulo en la pierna (TVP) puede viajar a los pulmones (embolia pulmonar), lo que es una emergencia para llamar al 911.',
    'Unilateral (one-sided) leg swelling and pain is a primary indicator of a potentially fatal blood clot.': 'La hinchazón y dolor en una sola pierna es una señal principal de un coágulo potencialmente mortal.',
    'Look for one swollen leg': 'Busca una pierna hinchada',
    'Check for leg pain/heat': 'Revisa dolor o calor en la pierna',
    'Watch for sudden gasping': 'Vigila falta repentina de aire',
    'Note any chest pain': 'Observa cualquier dolor en el pecho',
    'She has pain in her left calf and it looks redder than the right. You call the doctor immediately to screen for a blood clot.': 'Ella tiene dolor en la pantorrilla izquierda y se ve más roja que la derecha. Llamas al doctor de inmediato para revisar si hay un coágulo.',
    'Leg cramps are just dehydration.': 'Los calambres en las piernas son solo deshidratación.',
    'Thoughts of Self-Harm': 'Pensamientos de hacerse daño',
    'Maternal Mental Health Crisis.': 'Crisis de salud mental materna.',
    'Postpartum Psychosis or severe Depression can lead to intrusive thoughts. This is a neurochemical emergency, not a character flaw.': 'La psicosis posparto o la depresión severa pueden causar pensamientos intrusivos. Esto es una emergencia neuroquímica, no una falla de carácter.',
    'Postpartum mental health emergencies require the same clinical urgency as physical complications.': 'Las emergencias de salud mental posparto requieren la misma urgencia clínica que las complicaciones físicas.',
    'Ask: Are you feeling safe?': 'Pregunta: ¿Te sientes segura?',
    'Monitor for racing thoughts': 'Vigila pensamientos acelerados',
    'Identify lack of sleep/eating': 'Identifica falta de sueño o comida',
    'Call 988 or Provider immediately': 'Llama al 988 o al proveedor de inmediato',
    'She says she does not feel like herself and is afraid to be alone with the baby. You stay with her, take the baby, and call her OB right then.': 'Ella dice que no se siente como ella misma y tiene miedo de estar sola con el bebé. Te quedas con ella, tomas al bebé y llamas a su OB en ese momento.',
    'She is just a tired mom.': 'Solo es una mamá cansada.',
    'Managing trimester-specific changes and becoming a clinical advocate.': 'Gestionar cambios específicos de cada trimestre y convertirse en un defensor clínico.',
    'Tactical support, physiological stages, and clinical decision-making.': 'Apoyo táctico, etapas fisiológicas y toma de decisiones clínicas.',
    'Physiological restoration and critical safety thresholds.': 'Restauración fisiológica y umbrales críticos de seguridad.',
    'Essential language partners should understand to support mom confidently at each stage.': 'Lenguaje esencial que los acompañantes deben comprender para apoyar a mamá con confianza en cada etapa.',
    'Structured training modules with progress tracking, scenarios, and quizzes.': 'Módulos de formación estructurados con seguimiento de progreso, escenarios y cuestionarios.',
    'Interactive Anatomy Guide': 'Guía Interactiva de Anatomía',
    'Interactive Labor Physiology Guide': 'Guía Interactiva de Fisiología del Parto',
    'Interactive Postpartum Recovery Guide': 'Guía Interactiva de Recuperación Posparto',
    'Tap to flip for training': 'Toca para voltear y entrenar',
    'Support Protocol': 'Protocolo de Apoyo',
    'Core Partner Wins': 'Logros Clave de la Pareja',
    'Hydration Goal Met': 'Meta de Hidratación Cumplida',
    'Handed her food (no ask)': 'Le dio comida (sin que lo pidiera)',
    'Clear of laundry': 'Sin ropa por lavar',
    'Bonding/Soothing Time': 'Tiempo de vínculo/calmar',
    'Active Listening Time': 'Tiempo de escucha activa',
    'Definition': 'Definición',
    'What Is Happening In The Body': 'Qué Está Sucediendo En El Cuerpo',
    'Why It Matters Clinically': 'Por Qué Es Importante Clínicamente',
    'Mother Impact': 'Impacto en la Madre'
  },
  fr: {
    'Managing trimester-specific changes and becoming a clinical advocate.': 'Gérer les changements propres à chaque trimestre et devenir un défenseur clinique.',
    'Tactical support, physiological stages, and clinical decision-making.': 'Soutien tactique, étapes physiologiques et prise de décision clinique.',
    'Physiological restoration and critical safety thresholds.': 'Restauration physiologique et seuils critiques de sécurité.',
    'Essential language partners should understand to support mom confidently at each stage.': 'Langage essentiel que les partenaires doivent comprendre pour soutenir la maman avec confiance à chaque étape.',
    'Structured training modules with progress tracking, scenarios, and quizzes.': 'Modules de formation structurés avec suivi de progression, scénarios et quiz.',
    'Interactive Anatomy Guide': 'Guide Interactif d’Anatomie',
    'Interactive Labor Physiology Guide': 'Guide Interactif de Physiologie du Travail',
    'Interactive Postpartum Recovery Guide': 'Guide Interactif de Récupération Post-partum',
    'Tap to flip for training': 'Touchez pour retourner et vous entraîner',
    'Support Protocol': 'Protocole de Soutien',
    'Core Partner Wins': 'Victoires Clés du Partenaire',
    'Hydration Goal Met': 'Objectif Hydratation Atteint',
    'Handed her food (no ask)': 'Repas apporté sans qu’elle le demande',
    'Clear of laundry': 'Lessive terminée',
    'Bonding/Soothing Time': 'Temps de lien/apaisement',
    'Active Listening Time': 'Temps d’écoute active',
    'Definition': 'Définition',
    'What Is Happening In The Body': 'Ce Qui Se Passe Dans Le Corps',
    'Why It Matters Clinically': 'Pourquoi C’est Important Cliniquement',
    'Mother Impact': 'Impact sur la Mère'
  },
  ht: {
    'Today\'s Partner Focus': 'Fokus patnè a jodi a',
    'Core Partner Wins': 'Viktwa prensipal patnè a',
    'Hydration Goal Met': 'Objektif idratasyon an fèt',
    'Handed her food (no ask)': 'Ou pote manje pou li san li pa mande',
    'Clear of laundry': 'Pa gen rad pou lave',
    'Bonding/Soothing Time': 'Tan pou lyen ak kalme',
    'Active Listening Time': 'Tan pou koute aktif',
    'Small actions today, lasting impact tomorrow.': 'Ti aksyon jodi a, gwo efè demen.',
    'Partner Tips': 'Konsèy pou patnè',
    'Reminders': 'Rapèl',
    'My Notes': 'Nòt mwen',
    'Quick Tools': 'Zouti rapid',
    of: 'sou',
    completed: 'fini',
    'Instant Prenatal Support': 'Sipò prenatal touswit',
    'Prenatal Support Builder': 'Zouti pou bati sipò prenatal',
    'Get partner-ready support in seconds.': 'Jwenn sipò ki pare pou patnè nan kèk segond.',
    'Plain-language explanation': 'Eksplikasyon nan lang senp',
    'Questions to ask': 'Kesyon pou mande',
    'Support actions': 'Aksyon sipò',
    'Get Pack': 'Jwenn pake',
    'e.g. Anterior Placenta...': 'eg. plasenta devan...',
    Card: 'Kat',
    Back: 'Retounen',
    Next: 'Pwochen',
    'Anatomical & Hormonal Shifts': 'Chanjman anatomi ak òmòn',
    'Center of Gravity': 'Sant gravite',
    'Her spine is curving to balance a 10-25lb weight shift.': 'Kolòn vètebral li ap koube pou balanse yon chanjman pwa 10 a 25 liv.',
    'As the uterus grows, the center of gravity moves forward, causing lordosis (exaggerated spinal curve) and loosening of the sacroiliac joints.': 'Pandan matris la ap grandi, sant gravite a deplase devan. Sa ka bay yon gwo koube nan kolòn vètebral la epi fè jwenti sakroilyak yo vin pi lach.',
    'Targeted support and pelvic floor awareness can significantly reduce prenatal back pain.': 'Sipò ki vize byen ak konesans sou planche pelvik la ka diminye doulè do pandan gwosès.',
    'She winces while standing.': 'Li fè yon grimas pandan l ap kanpe.',
    'She winces while standing. You support her lower back and give your arm for stability.': 'Li fè yon grimas pandan l ap kanpe. Ou soutni anba do li epi ou ba li bra ou pou li ka rete estab.',
    'Back pain is just part of the process.': 'Doulè do se jis yon pati nan pwosesis la.',
    'Provide supportive footwear': 'Bay soulye ki soutni pye li byen',
    'Give nightly lower back massage': 'Bay masaj anba do chak swa',
    'Check posture during long walks': 'Tcheke pozisyon kò li pandan mache long',
    'Adjust pillows for side-sleeping': 'Ajiste zòrye pou li dòmi sou kote',
    'Hormonal Mood Dynamics': 'Dinamik atitid ak òmòn',
    'Progesterone and Estrogen levels are up to 100x higher than normal.': 'Nivo pwogestewòn ak estwojèn ka rive jiska 100 fwa pi wo pase nòmal.',
    'These hormones relax smooth muscles and support the placenta, but they also significantly impact neurotransmitters like serotonin and GABA.': 'Òmòn sa yo detann misk lis yo epi yo sipòte plasenta a, men yo ka afekte pwodwi chimik nan sèvo tankou serotonin ak GABA.',
    'Her body is undergoing a massive neurochemical shift that directly impacts physical and emotional regulation.': 'Kò li ap pase nan yon gwo chanjman newochimik ki afekte jan li jere kò li ak emosyon li.',
    'Validate feelings without fixing': 'Valide santiman li san ou pa eseye ranje tout bagay',
    'Track her fatigue patterns': 'Swiv modèl fatig li',
    'Stock iron-rich snacks': 'Kenbe ti goute ki rich an fè',
    'Limit overwhelming social invites': 'Limite envitasyon sosyal ki ka twòp pou li',
    'She bursts into tears because the grocery store was out of a specific yogurt. You hold her, say \'I hear you, that is frustrating,\' and offer to check the next store later.': 'Li pete kriye paske makèt la pa t gen yogout li te vle a. Ou kenbe li, ou di: "Mwen tande ou, sa vrèman fwistre," epi ou pwopoze tcheke yon lòt magazen pita.',
    "She is just being 'hormonal'.": 'Se jis òmòn k ap fè li konsa.',
    'Vital Tracking (BP & Glucose)': 'Swivi siy vital, tansyon ak glikoz',
    'Understanding the numbers that prevent complications.': 'Konprann chif ki ede anpeche konplikasyon.',
    "Blood pressure trends identify Preeclampsia risks; Glucose screening (1hr/3hr tests) detects Gestational Diabetes, affecting baby's birth weight.": 'Tandans tansyon ka montre risk preeklanpsi. Tès glikoz yo ka montre dyabèt jestasyonèl, ki ka afekte pwa tibebe a lè li fèt.',
    'Unmanaged gestational diabetes can lead to complex deliveries and neonatal blood sugar issues.': 'Dyabèt jestasyonèl ki pa jere ka mennen nan akouchman ki pi konplike ak pwoblèm sik nan san pou tibebe a.',
    'Log clinic BP results together': 'Ekri rezilta tansyon klinik yo ansanm',
    'Help prep for glucose tests': 'Ede prepare pou tès glikoz yo',
    'Watch for sudden limb swelling': 'Veye si bra, men, janm, oswa pye anfle bridsoukou',
    'Identify severe headaches': 'Idantifye gwo maltèt',
    'Glucose tests are optional.': 'Tès glikoz yo opsyonèl.',
    'Dilation & Effacement': 'Dilatasyon ak efasman',
    'Tracking the gateway to birth.': 'Swiv pasaj ki ouvri pou nesans la.',
    'Effacement (0-100%) is the thinning of the cervix; Dilation (0-10cm) is the widening. Both must be complete before pushing.': 'Efasman, 0 a 100 pousan, se lè kòl matris la vin pi mens. Dilatasyon, 0 a 10 santimèt, se lè li ouvri. Toude dwe pare anvan pouse.',
    'Pushing before full effacement and dilation can cause cervical swelling and stall labor progress.': 'Pouse anvan efasman ak dilatasyon fini ka fè kòl matris la anfle epi ralanti travay la.',
    'Timed contractions (start/duration)': 'Mezire kontraksyon yo, lè yo kòmanse ak konbyen tan yo dire',
    'Encourage frequent bladder empty': 'Ankouraje li vide blad pipi souvan',
    'Give sips of water or ice': 'Bay ti gòje dlo oswa glas',
    'Change positions every 30min': 'Chanje pozisyon chak 30 minit',
    "The nurse says she is '70% and 4cm'. You explain to her: 'Your body is doing great work thinning out the cervix to make way for the baby.'": 'Enfimyè a di li nan 70 pousan ak 4 santimèt. Ou eksplike li: "Kò ou ap fè gwo travay pou fè kòl matris la vin pi mens pou ouvri chemen pou tibebe a."',
    'You only push at 10cm.': 'Se sèlman lè li rive 10 santimèt pou li pouse.',
    'She may experience both physical strain and emotional intensity during this stage of care.': 'Li ka santi fatig nan kò li ak gwo emosyon pandan etap swen sa a.',
    'Definition': 'Definisyon',
    'What Is Happening In The Body': 'Sa k ap pase nan kò a',
    'Why It Matters Clinically': 'Poukisa sa enpòtan klinikman',
    'Mother Impact': 'Enpak sou manman an',
    'Partner Action Guide': 'Gid aksyon patnè',
    'Partner Actions': 'Aksyon patnè',
    'Real-World Scenario': 'Senaryo reyèl',
    Myth: 'Mit',
    Fact: 'Reyalite',
    'Tap to flip for training': 'Tape pou vire pou fòmasyon',
    'Support Protocol': 'Pwotokòl sipò'
  }
};

const OFFLINE_WORD_TRANSLATIONS = {
  es: {
    pregnancy: 'embarazo',
    postpartum: 'posparto',
    labor: 'parto',
    delivery: 'parto',
    support: 'apoyo',
    recovery: 'recuperación',
    physiological: 'fisiológica',
    clinical: 'clínica',
    anatomy: 'anatomía',
    hormones: 'hormonas',
    body: 'cuerpo',
    blood: 'sangre',
    pressure: 'presión',
    risk: 'riesgo',
    severe: 'grave',
    pain: 'dolor',
    swelling: 'hinchazón',
    headache: 'dolor de cabeza',
    vision: 'visión',
    emergency: 'emergencia',
    partner: 'pareja',
    mother: 'madre',
    stage: 'etapa',
    stages: 'etapas',
    guide: 'guía',
    interactive: 'interactiva',
    terms: 'términos',
    definitions: 'definiciones',
    nutrition: 'nutrición',
    hydration: 'hidratación',
    listening: 'escucha',
    time: 'tiempo'
  },
  fr: {
    pregnancy: 'grossesse',
    postpartum: 'post-partum',
    labor: 'travail',
    delivery: 'accouchement',
    support: 'soutien',
    recovery: 'récupération',
    physiological: 'physiologique',
    clinical: 'clinique',
    anatomy: 'anatomie',
    hormones: 'hormones',
    body: 'corps',
    blood: 'sang',
    pressure: 'pression',
    risk: 'risque',
    severe: 'sévère',
    pain: 'douleur',
    swelling: 'gonflement',
    headache: 'mal de tête',
    vision: 'vision',
    emergency: 'urgence',
    partner: 'partenaire',
    mother: 'mère',
    stage: 'étape',
    stages: 'étapes',
    guide: 'guide',
    interactive: 'interactif',
    terms: 'termes',
    definitions: 'définitions',
    nutrition: 'nutrition',
    hydration: 'hydratation',
    listening: 'écoute',
    time: 'temps'
  },
  ht: {
    a: 'yon',
    about: 'sou',
    across: 'atravè',
    active: 'aktif',
    after: 'apre',
    all: 'tout',
    also: 'tou',
    and: 'ak',
    anxiety: 'anksyete',
    are: 'yo',
    as: 'pandan',
    ask: 'mande',
    baby: 'tibebe',
    back: 'do',
    balance: 'balanse',
    because: 'paske',
    becomes: 'vin',
    before: 'anvan',
    begins: 'kòmanse',
    blood: 'san',
    body: 'kò',
    bonding: 'koneksyon',
    breathing: 'respirasyon',
    but: 'men',
    by: 'pa',
    can: 'ka',
    care: 'swen',
    center: 'sant',
    changes: 'chanjman',
    clinical: 'klinik',
    coach: 'gide',
    contractions: 'kontraksyon',
    critical: 'kritik',
    days: 'jou',
    decision: 'desizyon',
    definitions: 'definisyon',
    delivery: 'akouchman',
    digestion: 'dijesyon',
    directly: 'dirèkteman',
    discomfort: 'malèz',
    emotional: 'emosyonèl',
    energy: 'enèji',
    every: 'chak',
    explains: 'eksplike',
    factor: 'faktè',
    fatigue: 'fatig',
    feels: 'santi',
    first: 'premye',
    focus: 'fokus',
    for: 'pou',
    from: 'soti',
    full: 'konplè',
    function: 'fonksyon',
    gently: 'douman',
    glucose: 'glikoz',
    goal: 'objektif',
    grows: 'grandi',
    guide: 'gid',
    happens: 'rive',
    has: 'gen',
    have: 'gen',
    health: 'sante',
    her: 'li',
    higher: 'pi wo',
    hour: 'èdtan',
    hours: 'èdtan',
    hydration: 'idratasyon',
    impact: 'enpak',
    improves: 'amelyore',
    in: 'nan',
    increases: 'ogmante',
    is: 'se',
    it: 'li',
    joints: 'jwenti',
    labor: 'travay',
    language: 'langaj',
    lead: 'mennen',
    levels: 'nivo',
    listening: 'koute',
    load: 'chay',
    low: 'ba',
    management: 'jesyon',
    meal: 'manje',
    medical: 'medikal',
    mode: 'mòd',
    mom: 'manman',
    mood: 'atitid',
    more: 'plis',
    mother: 'manman',
    moves: 'deplase',
    muscles: 'misk',
    nausea: 'kè plen',
    neurochemical: 'newochimik',
    now: 'kounye a',
    nutrition: 'nitrisyon',
    of: 'nan',
    on: 'sou',
    one: 'youn',
    or: 'oswa',
    pain: 'doulè',
    partner: 'patnè',
    patterns: 'modèl',
    pelvic: 'pelvik',
    physiology: 'fizyoloji',
    placenta: 'plasenta',
    postpartum: 'apre akouchman',
    practical: 'pratik',
    pregnancy: 'gwosès',
    pressure: 'presyon',
    prenatal: 'prenatal',
    progress: 'pwogrè',
    protects: 'pwoteje',
    protocol: 'pwotokòl',
    rapidly: 'rapidman',
    recovery: 'rekiperasyon',
    reduce: 'diminye',
    regulation: 'regilasyon',
    relax: 'detann',
    response: 'repons',
    risk: 'risk',
    safety: 'sekirite',
    same: 'menm',
    says: 'di',
    screening: 'depistaj',
    severe: 'grav',
    she: 'li',
    shifts: 'chanjman',
    should: 'dwe',
    signs: 'siy',
    significantly: 'anpil',
    sleep: 'dòmi',
    slows: 'ralanti',
    smooth: 'lis',
    soothe: 'kalme',
    spine: 'kolòn vètebral',
    stage: 'etap',
    stages: 'etap',
    starts: 'kòmanse',
    stress: 'estrès',
    support: 'sipò',
    symptoms: 'sentòm',
    tactical: 'taktik',
    term: 'tèm',
    terms: 'tèm',
    that: 'sa',
    the: 'a',
    their: 'yo',
    these: 'sa yo',
    this: 'sa',
    thresholds: 'papòt',
    time: 'tan',
    tips: 'konsèy',
    to: 'pou',
    together: 'ansanm',
    tracking: 'swivi',
    transition: 'tranzisyon',
    trimester: 'trimès',
    trimeter: 'trimès',
    understanding: 'konprann',
    uterine: 'matris',
    uterus: 'matris',
    vital: 'vital',
    warning: 'avètisman',
    watch: 'obsève',
    what: 'kisa',
    when: 'lè',
    while: 'pandan',
    why: 'poukisa',
    with: 'ak',
    work: 'travay',
    your: 'ou'
  }
};

const matchCase = (source, translated) => {
  if (!translated) return translated;
  if (source === source.toUpperCase()) return translated.toUpperCase();
  if (source[0] === source[0]?.toUpperCase()) {
    return translated.charAt(0).toUpperCase() + translated.slice(1);
  }
  return translated;
};

const offlineTranslateText = (text, locale) => {
  if (!text || locale === 'en') return text;
  const phraseMap = OFFLINE_PHRASE_TRANSLATIONS[locale] || {};
  const wordMap = OFFLINE_WORD_TRANSLATIONS[locale] || {};

  let output = text;

  Object.entries(phraseMap)
    .sort((a, b) => b[0].length - a[0].length)
    .forEach(([source, target]) => {
      const escaped = source.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      output = output.replace(new RegExp(escaped, 'gi'), (match) => matchCase(match, target));
    });

  if (output !== text) {
    return output;
  }

  // Prevent mixed-language long sentences: only allow word-level fallback
  // on very short labels where phrase-level mapping is unavailable.
  const compact = output.trim();
  const compactWords = compact ? compact.split(/\s+/).length : 0;
  const shortLabelFallback =
    compactWords > 0 &&
    compactWords <= 3 &&
    !/[.!?;:,]/.test(compact) &&
    !/\d/.test(compact);

  if (shortLabelFallback) {
    output = output.replace(/\b([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ'-]*)\b/g, (word) => {
      const key = word.toLowerCase();
      const translated = wordMap[key];
      if (!translated) return word;
      return matchCase(word, translated);
    });
  }

  return output;
};

const getStaticTranslationMap = (locale) => ({
  ...(STATIC_UI_TRANSLATIONS[locale] || {}),
  ...(OFFLINE_PHRASE_TRANSLATIONS[locale] || {}),
  ...(LOCAL_LANGUAGE_PACKS.mainGuide?.[locale] || {})
});

const localizeUiString = (value, locale, translationMap) => {
  if (value == null) return value;
  const text = `${value}`;
  if (locale === 'en') return text;

  const normalized = text.trim();
  if (!normalized) return text;

  const mapped = translationMap?.[normalized];
  const fallback = mapped || offlineTranslateText(normalized, locale);
  if (!fallback || fallback === normalized) return text;

  const leading = text.match(/^\s*/)?.[0] || '';
  const trailing = text.match(/\s*$/)?.[0] || '';
  return `${leading}${fallback}${trailing}`;
};

export const translateStaticText = (value, locale) =>
  localizeUiString(value, locale, getStaticTranslationMap(locale));

const isKnownLocalizedValue = (currentValue, sourceValue, locale, translationMap) => {
  if (locale === 'en') return false;

  const current = `${currentValue || ''}`.trim();
  const source = `${sourceValue || ''}`.trim();
  if (!current || !source || current === source) return false;

  const mapped = translationMap?.[source];
  if (mapped && current === `${mapped}`.trim()) return true;

  const fallback = offlineTranslateText(source, locale);
  return Boolean(fallback && fallback !== source && current === `${fallback}`.trim());
};

const isMappedLocalizedText = (value, locale, translationMap) => {
  if (locale === 'en') return false;

  const current = `${value || ''}`.trim();
  if (!current) return false;

  const translatedValues = [
    ...Object.values(translationMap || {}),
    ...Object.values(OFFLINE_PHRASE_TRANSLATIONS[locale] || {})
  ];

  return translatedValues.some((translated) => `${translated || ''}`.trim() === current);
};

const App = () => {
  const [activeStage, setActiveStage] = useState('prenatal');
  const [experienceEntry, setExperienceEntry] = useState(null);
  const [heroImageSrc, setHeroImageSrc] = useState('/home-hero-pregnant.png');
  const [language, setLanguage] = useState(() => {
    if (typeof window === 'undefined') return 'en';
    return window.sessionStorage.getItem(LANGUAGE_SESSION_KEY) || 'en';
  });
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [translationMap, setTranslationMap] = useState({});
  const [translationLoading, setTranslationLoading] = useState(false);
  const [checklist, setChecklist] = useState({
    water: false,
    meal: false,
    laundry: false,
    baby: false,
    listen: false
  });
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [aiResultMeta, setAiResultMeta] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === 'undefined') return true;
    const savedTheme = window.localStorage.getItem('dieudonne-theme');
    if (savedTheme === 'light') return false;
    if (savedTheme === 'dark') return true;
    return true;
  });
  const [guideStep, setGuideStep] = useState(0);
  const [partnerTipStep, setPartnerTipStep] = useState(0);
  const [winCelebration, setWinCelebration] = useState(null);
  const [prenatalSupportHistory, setPrenatalSupportHistory] = useState([]);
  const [coachHistory, setCoachHistory] = useState([]);
  const [mealHistory, setMealHistory] = useState([]);
  const celebrationTimerRef = useRef(null);
  const insightScrollRef = useRef(null);
  const appRootRef = useRef(null);
  const mainContentRef = useRef(null);
  const supportFocusRef = useRef(null);
  const languageMenuRef = useRef(null);
  const textNodeSourceRef = useRef(new WeakMap());
  const attrSourceRef = useRef(new WeakMap());
  const translationMapRef = useRef({});
  const pendingTranslationsRef = useRef(new Set());
  const translationAttemptsRef = useRef(new Map());
  const translationFlushRef = useRef(false);
  const translationObserverRef = useRef(null);
  const translationRafRef = useRef(null);
  const translationSeedRef = useRef([]);
  const translationRetryTimerRef = useRef(null);
  const translationBackoffRef = useRef(1500);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const currentVersion = window.sessionStorage.getItem(LANGUAGE_CACHE_VERSION_KEY);
    if (currentVersion === LANGUAGE_CACHE_VERSION) return;

    Object.keys(window.sessionStorage).forEach((key) => {
      if (key.startsWith(LANGUAGE_TRANSLATION_PREFIX)) {
        window.sessionStorage.removeItem(key);
      }
    });
    window.sessionStorage.setItem(LANGUAGE_CACHE_VERSION_KEY, LANGUAGE_CACHE_VERSION);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('dieudonne-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    translationMapRef.current = translationMap;
  }, [translationMap]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.sessionStorage.setItem(LANGUAGE_SESSION_KEY, language);
    if (translationRetryTimerRef.current) {
      clearTimeout(translationRetryTimerRef.current);
      translationRetryTimerRef.current = null;
    }
    translationBackoffRef.current = 1500;
    pendingTranslationsRef.current.clear();
    translationAttemptsRef.current.clear();
    textNodeSourceRef.current = new WeakMap();
    attrSourceRef.current = new WeakMap();
    const staticBase = getStaticTranslationMap(language);

    if (language === 'en') {
      setTranslationMap({});
      return;
    }

    const cached = window.sessionStorage.getItem(`${LANGUAGE_TRANSLATION_PREFIX}${language}`);
    if (!cached) {
      setTranslationMap(staticBase);
      return;
    }

    try {
      const parsed = JSON.parse(cached);
      if (!parsed || typeof parsed !== 'object') {
        setTranslationMap(staticBase);
        return;
      }

      const sanitized = { ...staticBase };
      Object.entries(parsed).forEach(([source, translated]) => {
        const sourceText = `${source || ''}`.trim();
        const translatedText = `${translated || ''}`.trim();
        if (!sourceText || !translatedText) return;
        if (staticBase[sourceText]) return;
        if (sourceText === translatedText) return;
        if (!isUsableTranslation(sourceText, translatedText, language)) return;
        sanitized[sourceText] = translatedText;
      });

      setTranslationMap(sanitized);
    } catch (error) {
      console.warn('Invalid cached translation map. Resetting.', error);
      setTranslationMap(staticBase);
    }
  }, [language]);

  useEffect(() => {
    if (typeof window === 'undefined' || language === 'en') return undefined;

    let cancelled = false;
    const mergePack = (pack) => {
      const localePack = pack?.[language];
      if (!localePack || typeof localePack !== 'object') return;

      setTranslationMap((prev) => {
        const next = { ...prev, ...localePack };
        window.sessionStorage.setItem(`${LANGUAGE_TRANSLATION_PREFIX}${language}`, JSON.stringify(next));
        return next;
      });
    };

    const externalPacks = [
      { key: 'mainGuide', path: '/main-guide-translations.json', label: 'Main guide' },
      { key: 'laborFlipped', path: '/labor-flipped-translations.json', label: 'Labor' }
    ];

    const pendingPacks = externalPacks.filter(({ key }) => !EXTERNAL_LANGUAGE_PACKS[key]);
    externalPacks.forEach(({ key }) => {
      if (EXTERNAL_LANGUAGE_PACKS[key]) mergePack(EXTERNAL_LANGUAGE_PACKS[key]);
    });

    if (!pendingPacks.length) {
      return undefined;
    }

    pendingPacks.forEach(({ key, path, label }) => {
      fetch(path)
        .then((response) => (response.ok ? response.json() : null))
        .then((pack) => {
          if (cancelled || !pack) return;
          EXTERNAL_LANGUAGE_PACKS[key] = pack;
          mergePack(pack);
        })
        .catch((error) => {
          console.warn(`${label} language pack unavailable.`, error);
        });
    });

    return () => {
      cancelled = true;
    };
  }, [language]);

  const translateBatch = useCallback(async (texts, targetLanguage) => {
    if (!texts.length) return [];
    const keyedSource = {};
    texts.forEach((text, index) => {
      keyedSource[`k${index}`] = text;
    });
    const keyList = Object.keys(keyedSource);

    try {
      const response = await fetchGemini(
        `Translate the following JSON object of English medical UI strings into ${targetLanguage}.
Rules:
- Return JSON only.
- Keep the exact same keys.
- Preserve medical acronyms and abbreviations (e.g., hCG, PPD, DVT, B.R.A.I.N.).
- Preserve numbers and units.
- Keep concise labels concise.

Source object:
${JSON.stringify(keyedSource)}`,
        'You are a strict medical UI localization engine. Output valid JSON only.',
        { temperature: 0.05, topP: 0.7, maxOutputTokens: 8000 }
      );

      const parsedMap = parseTranslationObjectPayload(response, keyList);
      const translations = keyList.map((key) => parsedMap[key]);
      if (translations.some((value) => !value)) {
        throw new Error('Batch translation key mismatch.');
      }
      return translations;
    } catch (error) {
      if (isRateLimitError(error)) {
        throw error;
      }
      throw error;
    }
  }, []);

  const flushPendingTranslations = useCallback(async () => {
    if (language === 'en' || translationFlushRef.current) return;
    if (!pendingTranslationsRef.current.size) return;
    if (!aiFeaturesEnabled) return;

    translationFlushRef.current = true;
    setTranslationLoading(true);

    try {
      const languageMeta = LANGUAGE_OPTIONS.find((item) => item.code === language) || LANGUAGE_OPTIONS[0];

      while (pendingTranslationsRef.current.size) {
        const missing = Array.from(pendingTranslationsRef.current).filter((value) => {
          const attempts = translationAttemptsRef.current.get(value) || 0;
          return !translationMapRef.current[value] && attempts < TRANSLATION_RETRY_LIMIT;
        });

        if (!missing.length) {
          pendingTranslationsRef.current.clear();
          break;
        }

        const burst = missing.slice(0, TRANSLATION_BATCH_SIZE * TRANSLATION_PARALLEL_BATCHES);
        burst.forEach((value) => pendingTranslationsRef.current.delete(value));
        const grouped = chunkList(burst, TRANSLATION_BATCH_SIZE);

        const results = await Promise.all(
          grouped.map(async (group) => {
            try {
              const translated = await translateBatch(group, languageMeta.modelLabel);
              return { group, translated, error: null };
            } catch (error) {
              return { group, translated: null, error };
            }
          })
        );

        const updates = {};
        let hitRateLimit = false;
        results.forEach(({ group, translated, error }) => {
          if (error && isRateLimitError(error)) {
            hitRateLimit = true;
            group.forEach((source) => pendingTranslationsRef.current.add(source));
            return;
          }

          if (!translated || translated.length !== group.length) {
            group.forEach((source) => {
              const attempts = (translationAttemptsRef.current.get(source) || 0) + 1;
              translationAttemptsRef.current.set(source, attempts);
              if (attempts < TRANSLATION_RETRY_LIMIT) {
                pendingTranslationsRef.current.add(source);
              }
            });
            return;
          }

          group.forEach((source, index) => {
            const candidate = `${translated[index] || ''}`.trim();
            if (candidate && candidate !== source && isUsableTranslation(source, candidate, language)) {
              updates[source] = candidate;
              translationAttemptsRef.current.delete(source);
            } else {
              const attempts = (translationAttemptsRef.current.get(source) || 0) + 1;
              translationAttemptsRef.current.set(source, attempts);
              if (attempts < TRANSLATION_RETRY_LIMIT) {
                pendingTranslationsRef.current.add(source);
              }
            }
          });
        });

        if (hitRateLimit) {
          if (translationRetryTimerRef.current) {
            clearTimeout(translationRetryTimerRef.current);
          }
          const waitMs = translationBackoffRef.current;
          translationBackoffRef.current = Math.min(waitMs * 2, 30000);
          translationRetryTimerRef.current = setTimeout(() => {
            translationRetryTimerRef.current = null;
            flushPendingTranslations();
          }, waitMs);
          break;
        }

        if (!Object.keys(updates).length) {
          continue;
        }

        setTranslationMap((prev) => {
          const next = { ...prev };
          const staticBase = getStaticTranslationMap(language);
          Object.entries(updates).forEach(([source, value]) => {
            if (staticBase[source]) {
              next[source] = staticBase[source];
              return;
            }
            next[source] = value;
          });

          if (typeof window !== 'undefined') {
            window.sessionStorage.setItem(`${LANGUAGE_TRANSLATION_PREFIX}${language}`, JSON.stringify(next));
          }
          return next;
        });

        translationBackoffRef.current = 1500;
        if (pendingTranslationsRef.current.size) {
          await new Promise((resolve) => setTimeout(resolve, 180));
        }
      }
    } finally {
      translationFlushRef.current = false;
      setTranslationLoading(false);
    }
  }, [language, translateBatch]);

  const queueTranslations = useCallback((strings, options = {}) => {
    if (language === 'en') return;
    const nextStrings = [];

    strings.forEach((value) => {
      const normalized = (value || '').trim();
      if (!normalized) return;
      if (translationMapRef.current[normalized]) return;
      if ((translationAttemptsRef.current.get(normalized) || 0) >= TRANSLATION_RETRY_LIMIT) return;
      if (!shouldQueueTranslationCandidate(normalized)) return;
      if (options.priority) {
        nextStrings.push(normalized);
        return;
      }
      pendingTranslationsRef.current.add(normalized);
    });

    if (nextStrings.length) {
      const pending = pendingTranslationsRef.current;
      nextStrings.forEach((value) => pending.delete(value));
      pendingTranslationsRef.current = new Set([...nextStrings, ...pending]);
    }

    if (options.flush !== false) {
      flushPendingTranslations();
    }
  }, [language, flushPendingTranslations]);

  const applyLanguageToDom = useCallback(() => {
    const root = appRootRef.current;
    if (!root) return;

    const fallbackUpdates = {};
    let queuedMissingTranslations = false;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const ignoredTags = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA']);
    const queueVisibleTranslation = (normalized) => {
      if (!normalized || translationAttemptsRef.current.get(normalized) >= TRANSLATION_RETRY_LIMIT) return;
      const pending = pendingTranslationsRef.current;
      if (pending.has(normalized)) {
        pending.delete(normalized);
      }
      pendingTranslationsRef.current = new Set([normalized, ...pending]);
      queuedMissingTranslations = true;
    };

    let node = walker.nextNode();
    while (node) {
      const parentTag = node.parentElement?.tagName;
      const isNoTranslate = node.parentElement?.closest('[data-no-translate="true"]');
      if (!ignoredTags.has(parentTag) && !isNoTranslate) {
        if (!textNodeSourceRef.current.has(node)) {
          textNodeSourceRef.current.set(node, node.nodeValue || '');
        }

        let original = textNodeSourceRef.current.get(node) || '';
        const currentValue = node.nodeValue || '';
        const normalizedOriginal = original.trim();
        const translatedOriginal = normalizedOriginal ? translationMapRef.current[normalizedOriginal] : '';
        const leading = original.match(/^\s*/)?.[0] || '';
        const trailing = original.match(/\s*$/)?.[0] || '';
        const translatedOriginalText = translatedOriginal ? `${leading}${translatedOriginal}${trailing}` : '';

        if (
          language !== 'en' &&
          currentValue &&
          currentValue !== original &&
          (!translatedOriginalText || currentValue !== translatedOriginalText) &&
          !isKnownLocalizedValue(currentValue, original, language, translationMapRef.current)
        ) {
          original = currentValue;
          textNodeSourceRef.current.set(node, original);
        }

        if (language === 'en') {
          if (currentValue && currentValue !== original) {
            // React updated this node; treat the new value as source truth.
            original = currentValue;
            textNodeSourceRef.current.set(node, original);
          } else if (node.nodeValue !== original) {
            node.nodeValue = original;
          }
        } else {
          const normalized = original.trim();
          if (isMappedLocalizedText(normalized, language, translationMapRef.current)) {
            node = walker.nextNode();
            continue;
          }
          if (shouldQueueTranslationCandidate(normalized)) {
            const translated = translationMapRef.current[normalized];
            if (translated) {
              const leading = original.match(/^\s*/)?.[0] || '';
              const trailing = original.match(/\s*$/)?.[0] || '';
              const translatedText = `${leading}${translated}${trailing}`;
              if (node.nodeValue !== translatedText) {
                node.nodeValue = translatedText;
              }
            } else {
              const fallback = offlineTranslateText(normalized, language);
              if (fallback && fallback !== normalized) {
                fallbackUpdates[normalized] = fallback;
                const leading = original.match(/^\s*/)?.[0] || '';
                const trailing = original.match(/\s*$/)?.[0] || '';
                node.nodeValue = `${leading}${fallback}${trailing}`;
              } else {
                queueVisibleTranslation(normalized);
              }
            }
          }
        }
      }
      node = walker.nextNode();
    }

    const attrsToTranslate = ['placeholder', 'title', 'aria-label'];
    const attrElements = root.querySelectorAll('[placeholder], [title], [aria-label]');

    attrElements.forEach((element) => {
      if (element.closest('[data-no-translate="true"]')) return;
      const currentSources = attrSourceRef.current.get(element) || {};

      attrsToTranslate.forEach((attrName) => {
        if (!element.hasAttribute(attrName)) return;

        const currentValue = element.getAttribute(attrName) || '';
        let source = currentSources[attrName] || currentValue;
        const translatedSource = source.trim() ? translationMapRef.current[source.trim()] : '';

        if (
          language !== 'en' &&
          currentValue &&
          currentValue !== source &&
          (!translatedSource || currentValue !== translatedSource) &&
          !isKnownLocalizedValue(currentValue, source, language, translationMapRef.current)
        ) {
          source = currentValue;
          currentSources[attrName] = source;
        } else if (!currentSources[attrName]) {
          currentSources[attrName] = source;
        }

        const normalized = source.trim();

        if (language === 'en') {
          if (currentValue && currentValue !== source) {
            source = currentValue;
            currentSources[attrName] = source;
          }
          element.setAttribute(attrName, source);
          return;
        }

        if (!shouldQueueTranslationCandidate(normalized)) {
          return;
        }

        if (isMappedLocalizedText(normalized, language, translationMapRef.current)) {
          return;
        }

        const translated = translationMapRef.current[normalized];
        if (translated) {
          element.setAttribute(attrName, translated);
        } else {
          const fallback = offlineTranslateText(normalized, language);
          if (fallback && fallback !== normalized) {
            fallbackUpdates[normalized] = fallback;
            element.setAttribute(attrName, fallback);
          } else {
            queueVisibleTranslation(normalized);
          }
        }
      });

      attrSourceRef.current.set(element, currentSources);
    });

    if (Object.keys(fallbackUpdates).length) {
      setTranslationMap((prev) => {
        const staticBase = getStaticTranslationMap(language);
        const next = { ...prev };
        Object.entries(fallbackUpdates).forEach(([source, translated]) => {
          if (staticBase[source]) return;
          if (!isUsableTranslation(source, translated, language)) return;
          next[source] = translated;
        });
        if (typeof window !== 'undefined') {
          window.sessionStorage.setItem(`${LANGUAGE_TRANSLATION_PREFIX}${language}`, JSON.stringify(next));
        }
        return next;
      });
    }

    if (queuedMissingTranslations) {
      flushPendingTranslations();
    }
  }, [language, flushPendingTranslations]);

  useEffect(() => {
    applyLanguageToDom();
  }, [language, translationMap, activeStage, aiResult, darkMode]);

  useEffect(() => {
    const root = appRootRef.current;
    if (!root) return undefined;

    if (translationObserverRef.current) {
      translationObserverRef.current.disconnect();
      translationObserverRef.current = null;
    }

    if (translationRafRef.current) {
      window.cancelAnimationFrame(translationRafRef.current);
      translationRafRef.current = null;
    }

    if (language === 'en') {
      applyLanguageToDom();
      return undefined;
    }

    const observer = new MutationObserver(() => {
      if (translationRafRef.current) return;
      translationRafRef.current = window.requestAnimationFrame(() => {
        translationRafRef.current = null;
        applyLanguageToDom();
      });
    });

    observer.observe(root, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['placeholder', 'title', 'aria-label']
    });

    translationObserverRef.current = observer;

    return () => {
      observer.disconnect();
      translationObserverRef.current = null;
      if (translationRafRef.current) {
        window.cancelAnimationFrame(translationRafRef.current);
        translationRafRef.current = null;
      }
    };
  }, [language, applyLanguageToDom]);

  useEffect(() => {
    if (!languageMenuOpen) return undefined;

    const handleOutsideClick = (event) => {
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target)) {
        setLanguageMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [languageMenuOpen]);

  useEffect(() => {
    if (!aiResult) {
      return undefined;
    }

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [aiResult]);

  useEffect(() => {
    if (aiResult && insightScrollRef.current) {
      insightScrollRef.current.scrollTop = 0;
    }
  }, [aiResult]);

  useEffect(() => {
    return () => {
      if (celebrationTimerRef.current) {
        clearTimeout(celebrationTimerRef.current);
      }
      if (translationRetryTimerRef.current) {
        clearTimeout(translationRetryTimerRef.current);
      }
    };
  }, []);

  const translateText = useCallback(
    (value) => localizeUiString(value, language, translationMapRef.current),
    [language, translationMap]
  );

  const triggerWinCelebration = (taskId) => {
    const task = supportTasks.find((item) => item.id === taskId);
    const message = winCelebrationMessages[Math.floor(Math.random() * winCelebrationMessages.length)];

    setWinCelebration({
      taskId,
      message,
      label: task?.label || 'Support win',
      token: Date.now()
    });

    if (celebrationTimerRef.current) {
      clearTimeout(celebrationTimerRef.current);
    }

    celebrationTimerRef.current = setTimeout(() => {
      setWinCelebration(null);
    }, 4000);
  };

  const toggleTask = (id) =>
    setChecklist((prev) => {
      const nextValue = !prev[id];
      if (nextValue) {
        triggerWinCelebration(id);
      }
      return { ...prev, [id]: nextValue };
    });

  const scrollToMainExperience = useCallback(() => {
    const tryScroll = (attempt = 0) => {
      const node = mainContentRef.current;
      if (node) {
        node.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      if (attempt < 5) {
        window.setTimeout(() => tryScroll(attempt + 1), 70);
      }
    };
    window.requestAnimationFrame(() => tryScroll(0));
  }, []);

  const navigateWithinApp = useCallback((to) => {
    try {
      window.history.pushState({}, '', to);
      window.dispatchEvent(new PopStateEvent('popstate'));
    } catch (error) {
      window.location.href = to;
    }
  }, []);

  const handleHeroEnterPlatform = useCallback(() => {
    navigateWithinApp('/partner-dashboard');
  }, [navigateWithinApp]);

  const handleHeroExploreGuide = useCallback(() => {
    setExperienceEntry('guide');
    setActiveStage('prenatal');
    scrollToMainExperience();
  }, [scrollToMainExperience]);

  const renderHeroHeadline = () => {
    const headline = translateText('Built for partners. Designed for safer outcomes.');
    const emphasisByLanguage = {
      en: 'partners',
      es: 'parejas',
      fr: 'partenaires',
      ht: 'patnè'
    };
    const emphasis = emphasisByLanguage[language] || 'partners';
    const lowerHeadline = headline.toLowerCase();
    const start = lowerHeadline.indexOf(emphasis.toLowerCase());

    if (start === -1) return headline;

    const end = start + emphasis.length;
    return (
      <>
        {headline.slice(0, start)}
        <span className={`hero-partners-highlight ${darkMode ? 'hero-partners-highlight-dark' : 'hero-partners-highlight-light'}`}>
          {headline.slice(start, end)}
        </span>
        {headline.slice(end)}
      </>
    );
  };

  const formatAiText = (text) => {
    if (!text) return '';
    return text.replace(/\*/g, '');
  };

  const handleAiAction = async (type) => {
    const languageMeta = LANGUAGE_OPTIONS.find((item) => item.code === language) || LANGUAGE_OPTIONS[0];

    if (type === 'meal') {
      const generatedMeal = buildPostpartumMealIdea(mealHistory.length);
      setAiResultMeta({
        type: 'meal',
        title: 'Postpartum Recovery Meal Idea',
        eyebrow: 'Instant Recovery Nutrition',
        shareSubject: 'Postpartum recovery meal idea from Dieudonne Partner Hub'
      });
      setAiResult(generatedMeal);
      setMealHistory((prev) => [...prev.slice(-9), generatedMeal]);
      return;
    }

    if (type === 'clarify') {
      openPrenatalSupportPack(userInput);
      return;
    }

    if (type === 'coach') {
      const generatedCoachPack = buildLaborCoachPack(coachHistory.length);
      setAiResultMeta({
        type: 'coach',
        title: 'Labor Coaching Pack',
        eyebrow: 'Instant Labor Coach',
        shareSubject: 'Labor coaching pack from Dieudonne Partner Hub'
      });
      setAiResult(generatedCoachPack);
      setCoachHistory((prev) => [...prev.slice(-9), generatedCoachPack]);
      return;
    }

    setAiLoading(true);
    setAiResult(null);
    setAiResultMeta(null);
    let prompt = '';
    let generationConfig = {};
    const responseLanguageInstruction =
      languageMeta.code === 'en'
        ? 'Respond in English.'
        : `Respond in ${languageMeta.modelLabel}.`;
    const system =
      `You are an expert intelligent maternal health assistant. Provide concise, medically accurate, and supportive advice for a partner. Do not use Markdown formatting like asterisks. Keep text clean. ${responseLanguageInstruction}`;

    if (type === 'clarify') {
      prompt = `Explain the medical term or situation "${userInput}" in simple terms for a father to understand during the prenatal phase. Focus on how he can support. ${responseLanguageInstruction}`;
    } else if (type === 'coach') {
      const nextPackNumber = coachHistory.length + 1;
      const focusMode = coachFocusModes[coachHistory.length % coachFocusModes.length];
      const recentCoachResponses = coachHistory.slice(-3).join('\n---\n').slice(0, 1800);
      prompt = `Create a NEW labor coaching pack for a partner.
Pack number: ${nextPackNumber}
Primary focus: ${focusMode}

Format requirements:
1) "Affirmations" -> provide 5 short rhythmic affirmations.
2) "Hands-On Support" -> provide 5 physical coaching actions with exactly when to use each.
3) "Real-Time Scripts" -> provide 4 short phrases a partner can say in active labor.
4) "Advocacy Prompts" -> provide 3 B.R.A.I.N.-style questions for staff discussions.

Rules:
- Use practical, non-repeating language.
- Keep each tip to one sentence.
- Do not repeat wording from prior packs.
- If prior packs are provided, avoid overlap in phrasing and tactics.

Prior packs to avoid repeating:
${recentCoachResponses || 'None yet.'}

Language requirement:
${responseLanguageInstruction}`;
      generationConfig = {
        temperature: 1.2,
        topP: 0.95,
        maxOutputTokens: 900
      };
    } else if (type === 'meal') {
      const nextPackNumber = mealHistory.length + 1;
      const focusMode = mealFocusModes[mealHistory.length % mealFocusModes.length];
      const recentMealResponses = mealHistory.slice(-3).join('\n---\n').slice(0, 1600);
      prompt = `Create a NEW postpartum recovery meal-tip pack.
Pack number: ${nextPackNumber}
Primary focus: ${focusMode}

Format requirements:
1) "Meal Option A" -> title + 1-sentence ingredients summary + 1-sentence prep.
2) "Meal Option B" -> title + 1-sentence ingredients summary + 1-sentence prep.
3) "Meal Option C" -> title + 1-sentence ingredients summary + 1-sentence prep.
4) "Why It Helps" -> 4 short bullets linking nutrients to postpartum recovery.
5) "Partner Execution Tip" -> 3 practical tips for shopping, prep, and serving.

Rules:
- Keep meals realistic for a tired household.
- Use clinically relevant nutrition language (iron, protein, fiber, hydration, omega-3, etc.).
- Avoid repeating wording, ingredients, or structure from prior packs.
- Do not use markdown asterisks.
- Keep total output concise and complete (target 220-320 words) so all sections are fully visible.

Prior packs to avoid repeating:
${recentMealResponses || 'None yet.'}

Language requirement:
${responseLanguageInstruction}`;
      generationConfig = {
        temperature: 1.1,
        topP: 0.9,
        maxOutputTokens: 1400
      };
    }

    try {
      let result = await fetchGemini(prompt, system, generationConfig);
      let cleanedResult = formatAiText(result);

      if ((type === 'coach' || type === 'meal') && looksTruncatedResponse(cleanedResult)) {
        const continuation = await fetchGemini(
          `You were generating a structured response that got cut off. Continue from exactly where this ended.
Do not repeat any existing text. Return continuation only.

Existing partial response:
${cleanedResult}`,
          system,
          { ...generationConfig, maxOutputTokens: 600 }
        );
        const continuationText = formatAiText(continuation);
        if (continuationText) {
          cleanedResult = `${cleanedResult}\n${continuationText}`.trim();
        }
      }

      if (type === 'coach') {
        const isDuplicate = coachHistory.includes(cleanedResult);
        if (isDuplicate) {
          result = await fetchGemini(
            `${prompt}\n\nThe previous output duplicated earlier coaching language. Rewrite with clearly different wording and tips.`,
            system,
            generationConfig
          );
          cleanedResult = formatAiText(result);
        }

        setCoachHistory((prev) => [...prev.slice(-9), cleanedResult]);
      }

      if (type === 'meal') {
        const isDuplicate = mealHistory.includes(cleanedResult);
        if (isDuplicate) {
          result = await fetchGemini(
            `${prompt}\n\nThe previous output duplicated earlier meal tips. Rewrite with different meals, wording, and nutrient emphasis.`,
            system,
            generationConfig
          );
          cleanedResult = formatAiText(result);
        }

        setMealHistory((prev) => [...prev.slice(-9), cleanedResult]);
      }

      setAiResultMeta({
        type,
        title: type === 'coach' ? 'Labor Coaching Pack' : 'Gemini Intelligent Insight',
        eyebrow: type === 'coach' ? 'Real-Time Partner Coach' : 'Clinical Language Support',
        shareSubject:
          type === 'coach'
            ? 'Labor coaching pack from Dieudonne Partner Hub'
            : 'Partner support note from Dieudonne Partner Hub'
      });
      setAiResult(cleanedResult);
    } catch (error) {
      setAiResultMeta({
        type: 'error',
        title: 'Request Needs Attention',
        eyebrow: 'Support Tool',
        shareSubject: 'Dieudonne Partner Hub support note'
      });
      if (!aiFeaturesEnabled) {
        setAiResult('AI support is disabled for this environment.');
      } else {
        const detail = (error?.message || '').trim();
        setAiResult(
          detail ||
            'Gemini request failed. Verify API key permissions and model access, then try again.'
        );
      }
    } finally {
      setAiLoading(false);
    }
  };

  const openPrenatalSupportPack = (term = userInput) => {
    const generatedSupport = buildPrenatalSupportPack(term, prenatalSupportHistory.length);
    setAiResultMeta({
      type: 'clarify',
      title: 'Prenatal Support Pack',
      eyebrow: 'Instant Prenatal Support',
      shareSubject: 'Prenatal support pack from Dieudonne Partner Hub'
    });
    setAiResult(generatedSupport);
    setPrenatalSupportHistory((prev) => [...prev.slice(-9), generatedSupport]);
  };

  const guideData = {
    prenatal: {
      title: 'Prenatal Support',
      description: 'Managing trimester-specific changes and becoming a clinical advocate.',
      icon: <Calendar />,
      subsections: [
        {
          heading: 'Anatomical & Hormonal Shifts',
          icon: <Layers className="w-5 h-5" />,
          color: 'bg-indigo-100 text-indigo-700',
          cards: [
            {
              title: 'Center of Gravity',
              description: 'Her spine is curving to balance a 10-25lb weight shift.',
              clinicalInfo:
                'As the uterus grows, the center of gravity moves forward, causing lordosis (exaggerated spinal curve) and loosening of the sacroiliac joints.',
              checklist: ['Provide supportive footwear', 'Give nightly lower back massage', 'Check posture during long walks', 'Adjust pillows for side-sleeping'],
              scenario:
                'She winces while standing. You support her lower back and give your arm for stability.',
              myth: 'Back pain is just part of the process.',
              fact: 'Targeted support and pelvic floor awareness can significantly reduce prenatal back pain.',
              isEmergency: false
            },
            {
              title: 'Hormonal Mood Dynamics',
              description: 'Progesterone and Estrogen levels are up to 100x higher than normal.',
              clinicalInfo:
                'These hormones relax smooth muscles and support the placenta, but they also significantly impact neurotransmitters like serotonin and GABA.',
              checklist: ['Validate feelings without fixing', 'Track her fatigue patterns', 'Stock iron-rich snacks', 'Limit overwhelming social invites'],
              scenario:
                "She bursts into tears because the grocery store was out of a specific yogurt. You hold her, say 'I hear you, that is frustrating,' and offer to check the next store later.",
              myth: "She is just being 'hormonal'.",
              fact:
                'Her body is undergoing a massive neurochemical shift that directly impacts physical and emotional regulation.',
              isEmergency: false
            },
            {
              title: 'Vital Tracking (BP & Glucose)',
              description: 'Understanding the numbers that prevent complications.',
              clinicalInfo:
                "Blood pressure trends identify Preeclampsia risks; Glucose screening (1hr/3hr tests) detects Gestational Diabetes, affecting baby's birth weight.",
              checklist: ['Log clinic BP results together', 'Help prep for glucose tests', 'Watch for sudden limb swelling', 'Identify severe headaches'],
              scenario:
                "She's stressed about her 1-hour glucose test. You research the process and explain, 'It is just a screening to make sure your body has the energy it needs.'",
              myth: 'Glucose tests are optional.',
              fact:
                'Unmanaged gestational diabetes can lead to complex deliveries and neonatal blood sugar issues.',
              isEmergency: false
            },
            {
              title: 'Pelvic Floor Health',
              description: 'Relaxin is loosening ligaments throughout her body.',
              clinicalInfo:
                "Relaxin prepares the birth canal but also affects the rib cage and pelvic girdle, often causing Symphysis Pubis Dysfunction (SPD) or sharp groin pain.",
              checklist: ['Research Pelvic Floor PT', 'Help her sit while dressing', 'Encourage knees-together movement', 'Ensure she has a belly support band'],
              scenario:
                'She complains of sharp pain when lifting one leg to put on pants. You suggest sitting on the bed to dress and help pull up her leggings.',
              myth: 'Incontinence is normal postpartum.',
              fact: 'Pelvic floor work during pregnancy can prevent long-term damage and improve labor efficiency.',
              isEmergency: false
            }
          ]
        },
        {
          heading: 'Prenatal Advocacy',
          icon: <Stethoscope className="w-5 h-5" />,
          color: 'bg-teal-100 text-teal-700',
          cards: [
            {
              title: 'Informed Consent Advocacy',
              description: 'Ensuring every medical decision is collaborative.',
              clinicalInfo:
                'Informed consent is the process where a provider explains the benefits, risks, and alternatives of a procedure before it is performed.',
              checklist: ['Write questions before visits', 'Ask Why are we doing this?', 'Request time for private talk', 'Note-take every doctor response'],
              scenario:
                "The doctor suggests an early induction. You ask, 'What are the medical indications for this, and what are the risks of waiting?'",
              myth: 'The doctor always makes the final call.',
              fact: 'The patient has the legal and ethical right to refuse or choose between medical options.',
              isEmergency: false
            },
            {
              title: 'Preterm Labor Awareness',
              description: 'Recognizing signs before the due date.',
              clinicalInfo:
                "Early labor (before 37 weeks) requires immediate intervention to stop contractions or prepare the baby's lungs for birth.",
              checklist: ['Monitor contraction frequency', 'Watch for lightening early', 'Check for unusual discharge', 'Call provider if water leaks'],
              scenario:
                "She mentions a dull backache that comes and goes at 32 weeks. You start a timer and realize it's every 10 minutes. You call the nurse line immediately.",
              myth: 'Braxton Hicks are always harmless.',
              fact:
                'If contractions are regular, rhythmic, and increasing in intensity before 37 weeks, it is a clinical priority.',
              isEmergency: true
            },
            {
              title: 'Home Recovery Prep',
              description: 'Setting up the home before birth so recovery is easier.',
              clinicalInfo:
                'Late pregnancy fatigue, pelvic pressure, and sleep disruption make it harder for mom to organize recovery supplies. Partners can reduce stress by preparing rooms before labor begins.',
              checklist: ['Build a bedside recovery basket', 'Stock bathroom pads and peri care', 'Clear walking paths at night', 'Prep freezer meals and snacks'],
              scenario:
                'She comes home from a long appointment exhausted. You show her the bedroom, bathroom, and feeding station are already stocked so she does not have to plan it.',
              myth: 'Home setup can wait until after the baby arrives.',
              fact:
                'A prepared home lowers her mental load and prevents partners from scrambling during the most tender recovery window.',
              motherImpact:
                'She can rest instead of giving directions, repeating requests, or moving through the house to find recovery supplies.',
              isEmergency: false
            }
          ]
        }
      ],
      aiTool: (
        <div className={`mt-8 overflow-hidden rounded-2xl border shadow-sm transition-colors duration-300 ${darkMode ? 'border-slate-800 bg-slate-950/70' : 'border-slate-200 bg-white'}`}>
          <div className={`border-b px-4 py-3 ${darkMode ? 'border-slate-800 bg-slate-900/80' : 'border-slate-100 bg-slate-50'}`}>
            <div className="relative">
              <div>
                <p className={`mb-2 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] ${darkMode ? 'text-teal-300' : 'text-teal-700'}`}>
                  <Sparkles className="h-4 w-4" />
                  {translateText('Instant Prenatal Support')}
                </p>
                <h4 className={`text-lg font-black tracking-tight ${darkMode ? 'text-slate-50' : 'text-slate-950'}`}>
                  {translateText('Prenatal Support Builder')}
                </h4>
                <p className={`mt-2 max-w-xl text-sm leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {translateText('Get partner-ready support in seconds.')}
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-2 p-3">
            {['Plain-language explanation', 'Questions to ask', 'Support actions'].map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => openPrenatalSupportPack(label)}
                className={`flex min-h-10 w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-sm font-bold leading-tight transition ${
                  darkMode ? 'border-slate-800 bg-slate-900/70 text-slate-300 hover:border-teal-400/40 hover:bg-slate-900' : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-teal-300 hover:bg-white'
                }`}
              >
                <span>{translateText(label)}</span>
                <ChevronRight className="h-4 w-4 text-slate-500" />
              </button>
            ))}
          </div>
          <div className="px-3 pb-3">
            <form
              className="flex flex-col gap-3 rounded-2xl sm:flex-row"
              onSubmit={(event) => {
                event.preventDefault();
                openPrenatalSupportPack(userInput);
              }}
            >
              <div className="relative min-w-0 flex-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Search className={`h-4 w-4 ${darkMode ? 'text-slate-500' : 'text-teal-400'}`} />
                </div>
                <input
                  type="text"
                  placeholder={translateText('e.g. Anterior Placenta...')}
                  className={`min-h-11 w-full rounded-2xl border py-2.5 pl-10 pr-4 text-sm shadow-inner transition-all focus:outline-none focus:ring-2 ${
                    darkMode
                      ? 'border-slate-700 bg-slate-800 text-slate-100 focus:ring-teal-500'
                      : 'border-teal-200 bg-white text-slate-900 focus:ring-teal-500'
                  }`}
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className={`flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl px-5 text-sm font-black text-white transition-colors disabled:opacity-50 sm:min-w-[7rem] ${
                  darkMode ? 'bg-teal-600 hover:bg-teal-500' : 'bg-teal-600 hover:bg-teal-700'
                }`}
              >
                {translateText('Get Pack')}
              </button>
            </form>
          </div>
        </div>
      )
    },
    labor: {
      title: 'Labor & Delivery',
      description: 'Tactical support, physiological stages, and clinical decision-making.',
      icon: <Activity />,
      subsections: [
        {
          heading: 'Tactical Labor Support',
          icon: <Timer className="w-5 h-5" />,
          color: 'bg-cyan-100 text-cyan-700',
          cards: [
            {
              title: 'Dilation & Effacement',
              description: 'Tracking the gateway to birth.',
              clinicalInfo:
                'Effacement (0-100%) is the thinning of the cervix; Dilation (0-10cm) is the widening. Both must be complete before pushing.',
              checklist: ['Timed contractions (start/duration)', 'Encourage frequent bladder empty', 'Give sips of water or ice', 'Change positions every 30min'],
              scenario:
                "The nurse says she is '70% and 4cm'. You explain to her: 'Your body is doing great work thinning out the cervix to make way for the baby.'",
              myth: 'You only push at 10cm.',
              fact:
                'Pushing before full effacement and dilation can cause cervical swelling and stall labor progress.',
              isEmergency: false
            },
            {
              title: 'Oxytocin: The Labor Engine',
              description: 'Fostering the Shy Hormone for progress.',
              clinicalInfo:
                'Oxytocin causes uterine contractions. It is inhibited by adrenaline (fear/cold/bright lights). Syntocinon/Pitocin is the synthetic version used for induction.',
              checklist: ['Dim lights in the room', 'Minimize staff interruptions', 'Provide skin-to-skin touch', 'Use low, rhythmic whispers'],
              scenario:
                "The room is bright and noisy. You politely ask the staff to dim the lights and close the door so she can stay in the labor zone.",
              myth: 'Pitocin is just like natural labor.',
              fact:
                'Synthetic oxytocin often creates more intense, frequent contractions with fewer breaks, which may require different pain management.',
              isEmergency: false
            },
            {
              title: 'Fetal Station & Rotation',
              description: 'Helping the baby navigate the pelvis.',
              clinicalInfo:
                'Station measures baby\'s head relative to the ischial spines (-3 to +3). Positioning (LOA, ROA) impacts labor duration.',
              checklist: ['Master the Double Hip Squeeze', 'Suggest hands-and-knees position', 'Offer counter-pressure on sacrum', 'Use a birthing ball for swaying'],
              scenario:
                "The baby is OP (back-to-back), causing intense back labor. You perform firm sacral pressure during every contraction to ease the pain.",
              myth: 'The baby just falls out.',
              fact:
                'The baby must perform a series of complex rotations (Cardinal Movements) to fit through the pelvic bones.',
              isEmergency: false
            },
            {
              title: 'Coaching Prompts',
              description: 'The power of the partner\'s voice.',
              clinicalInfo:
                'Rhythmic verbal support lowers the mother\'s cortisol levels and helps her regulate her breathing during the Transition phase.',
              checklist: ['Use: You are doing this.', 'Avoid: Are you okay?', 'Count breaths with her', 'Remind her: The wave is ending'],
              scenario:
                "She says 'I can't do this anymore.' You look her in the eyes and say, 'You are doing it. Every contraction brings us closer to the baby.'",
              myth: 'She is not listening to you.',
              fact:
                'The partner\'s voice is often the only anchor a mother has during the intensity of transition.',
              isEmergency: false
            }
          ]
        },
        {
          heading: 'Clinical Interventions',
          icon: <Shield className="w-5 h-5" />,
          color: 'bg-blue-100 text-blue-700',
          cards: [
            {
              title: 'The B.R.A.I.N. Method',
              description: 'Asking the right clinical questions.',
              clinicalInfo:
                'A decision-making framework for medical interventions proposed by the staff during labor.',
              checklist: ['Ask: What are the Benefits?', 'Ask: What are the Risks?', 'Ask: Alternatives?', 'Ask: What if we do Nothing?'],
              scenario:
                "The provider suggests breaking the bag of water. You look at the birth plan and ask, 'What are the risks of infection if we do this now vs. waiting?'",
              myth: 'Asking questions slows things down.',
              fact:
                'Asking questions ensures the family feels empowered and reduces the risk of birth trauma.',
              isEmergency: false
            },
            {
              title: 'Cesarean Pivot',
              description: 'Supporting when the plan changes.',
              clinicalInfo:
                'Cesarean delivery is major abdominal surgery. It may be planned (breech) or emergent (fetal distress/arrest of labor).',
              checklist: ['Stay at her head/eye level', 'Explain what\'s happening', 'Prep for skin-to-skin in OR', 'Manage post-op room quiet'],
              scenario:
                "The doctor calls for a C-section. You hold her hand and say, 'This is the safest way to get the baby here. I am staying right by your side.'",
              myth: 'Partners are not allowed in the OR.',
              fact:
                'In most cases, partners are encouraged to be in the OR to provide emotional support and immediate skin-to-skin.',
              isEmergency: false
            }
          ]
        }
      ],
      aiTool: (
        <div className={`mt-8 overflow-hidden rounded-2xl border shadow-sm transition-colors duration-300 ${darkMode ? 'border-slate-800 bg-slate-950/70' : 'border-slate-200 bg-white'}`}>
          <div className={`border-b px-4 py-3 ${darkMode ? 'border-slate-800 bg-slate-900/80' : 'border-slate-100 bg-slate-50'}`}>
            <div className="relative">
              <div className="pr-24">
                <p className={`mb-2 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>
                  <Sparkles className="h-4 w-4" />
                  {translateText('Instant Labor Coach')}
                </p>
                <h4 className={`text-lg font-black tracking-tight ${darkMode ? 'text-slate-50' : 'text-slate-950'}`}>
                  {translateText('Labor Coaching Pack')}
                </h4>
                <p className={`mt-2 max-w-xl text-sm leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {translateText('Get partner-ready coaching prompts in seconds.')}
                </p>
              </div>
              <div className={`absolute right-0 top-0 inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] ${
                darkMode ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300' : 'border-emerald-200 bg-emerald-50 text-emerald-700'
              }`}>
                <Zap className="h-3.5 w-3.5" />
                {translateText('Instant')}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-2 p-3">
            {['Affirmations', 'Hands-on support', 'Real-time scripts', 'Advocacy prompts'].map((label) => (
              <div
                key={label}
                className={`flex min-h-10 items-center justify-between rounded-xl border px-3 py-2 text-sm font-bold leading-tight ${
                  darkMode ? 'border-slate-800 bg-slate-900/70 text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-700'
                }`}
              >
                <span>{translateText(label)}</span>
                <ChevronRight className="h-4 w-4 text-slate-500" />
              </div>
            ))}
          </div>
          <div className="px-3 pb-3">
          <button
            onClick={() => handleAiAction('coach')}
            className={`flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-bold text-white shadow-md transition-all active:scale-95 ${
              darkMode ? 'bg-cyan-600 hover:bg-cyan-500' : 'bg-cyan-600 hover:bg-cyan-700'
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            {translateText('Get Instant Coach Pack')}
          </button>
          </div>
        </div>
      )
    },
    postpartum: {
      title: 'Postpartum Recovery',
      description: 'Physiological restoration and critical safety thresholds.',
      icon: <Heart />,
      subsections: [
        {
          heading: 'Physiological Restoration',
          icon: <Activity className="w-5 h-5" />,
          color: 'bg-rose-100 text-rose-700',
          cards: [
            {
              title: 'Uterine Involution',
              description: 'The shrinking of the uterus post-birth.',
              clinicalInfo:
                'After birth, the uterus must contract to its pre-pregnancy size to prevent hemorrhage. This causes afterpains, which are more intense with subsequent babies.',
              checklist: ['Apply heat to lower abdomen', 'Remind her to empty bladder', 'Encourage nursing (releases oxytocin)', 'Log frequency of pains'],
              scenario:
                "She is wincing while breastfeeding. You explain: 'The baby nursing is helping your uterus shrink back to size. I have a heating pad ready for you.'",
              myth: 'Cramping means something is wrong.',
              fact:
                'Uterine cramping is a vital sign that the body is successfully preventing excessive blood loss.',
              isEmergency: false
            },
            {
              title: 'Lochia (Postpartum Discharge)',
              description: 'Tracking the three stages of healing.',
              clinicalInfo:
                'Lochia Rubra (Red, 3-4 days), Serosa (Pink/Brown, 4-10 days), and Alba (Yellow/White, up to 6 weeks). Tracking volume is critical.',
              checklist: ['Stock bathroom with heavy pads', 'Monitor for large clots', 'Check color shifts daily', 'Note any foul odors'],
              scenario:
                "She's worried because the bleeding turned yellow. You check the guide and say, 'That is Lochia Alba, it means your uterus is in the final stage of healing.'",
              myth: 'Bleeding only lasts a few days.',
              fact:
                'Postpartum discharge can last for 4-6 weeks as the uterine lining restores itself.',
              isEmergency: false
            },
            {
              title: 'Lactation Physiology',
              description: 'Colostrum to mature milk transition.',
              clinicalInfo:
                'The let-down reflex is triggered by oxytocin. Engorgement occurs around Day 3-5 as mature milk comes in, increasing tissue temperature.',
              checklist: ['Ensure 128oz daily hydration', 'Apply warm/cool compresses', 'Watch for red breast streaks', 'Hand-off baby post-feed'],
              scenario:
                'Her breasts feel rock hard and hot on Day 4. You bring her a cool compress and a large water bottle, encouraging her to nurse or pump to relieve the pressure.',
              myth: 'If she is not leaking, she has no milk.',
              fact:
                "Colostrum is high-density and low-volume; the baby's stomach is only the size of a marble on Day 1.",
              isEmergency: false
            },
            {
              title: 'Hormonal Reset (The Crash)',
              description: 'Navigating the Day 3-5 emotional shift.',
              clinicalInfo:
                'Progesterone and Estrogen levels drop to near-zero post-delivery, significantly impacting mood regulation and sleep cycles.',
              checklist: ['Ensure 4 hours of solid sleep', 'Limit social visitors completely', 'Stock feel-good comfort foods', 'Offer skin-to-skin time'],
              scenario:
                "It is Day 4 and she is crying for no reason. You do not ask why. You take the baby, say 'I have him for 3 hours, please go sleep in the quiet room.'",
              myth: 'Baby Blues are the same as PPD.',
              fact:
                'Baby Blues are expected for 14 days. Symptoms beyond 2 weeks or thoughts of self-harm require professional medical intervention.',
              isEmergency: false
            },
            {
              title: 'Recovery Home Base',
              description: 'Keeping recovery supplies within reach so she can heal.',
              clinicalInfo:
                'Postpartum healing requires limited strain, steady hydration, pain control, feeding support, and quick access to bathroom care. A stocked recovery station prevents unnecessary walking and asking.',
              checklist: ['Keep meds and water by the bed', 'Refill pads before they run out', 'Place snacks near feeding spots', 'Take over laundry without reminders'],
              scenario:
                'She sits down to feed the baby and realizes her water is empty. Before she asks, you refill it, bring a snack, and check if she needs fresh pads nearby.',
              myth: 'If she needs something, she will ask.',
              fact:
                'Many mothers avoid asking because they feel like a burden. Anticipating needs protects rest and emotional safety.',
              motherImpact:
                'She feels cared for and can stay settled during feeding, bleeding, cramping, and sleep-deprived recovery moments.',
              isEmergency: false
            }
          ]
        },
        {
          heading: 'Medical Warning Signs (Emergency)',
          icon: <ShieldAlert className="w-5 h-5" />,
          color: 'bg-red-100 text-red-700',
          cards: [
            {
              title: 'The 1-Pad Rule (Hemorrhage)',
              description: 'When bleeding becomes life-threatening.',
              clinicalInfo:
                'Postpartum hemorrhage can occur up to 12 weeks after birth. It is often caused by uterine atony (uterus not contracting).',
              checklist: ['Check if soaking 1 pad per hour', 'Watch for golf-ball sized clots', 'Monitor for dizziness/fainting', 'Call 911 if bleeding is heavy'],
              scenario:
                "She says she just soaked a second heavy pad in 45 minutes. You do not wait for her to feel bad. You call the doctor's emergency line immediately.",
              myth: 'Heavy bleeding is just normal.',
              fact:
                'Soaking through one heavy pad per hour is the clinical threshold for a medical emergency.',
              isEmergency: true
            },
            {
              title: 'Postpartum Preeclampsia',
              description: 'Severe BP spikes after birth.',
              clinicalInfo:
                'High blood pressure can occur after delivery, leading to seizures or organ damage if not treated with magnesium sulfate.',
              checklist: ['Watch for sparkly vision', 'Check for severe headache', 'Identify upper right stomach pain', 'Monitor facial/hand swelling'],
              scenario:
                "She says she has a headache that Tylenol is not helping and her vision is weird. You immediately take her to the ER, identifying it as Postpartum.",
              myth: 'Preeclampsia only happens during pregnancy.',
              fact:
                'You can develop preeclampsia up to 6 weeks after the baby is born.',
              isEmergency: true
            },
            {
              title: 'DVT & Pulmonary Embolism',
              description: 'Clot risks from low mobility.',
              clinicalInfo:
                'Pregnancy increases blood clotting factors. A clot in the leg (DVT) can travel to the lungs (PE), which is a 911 emergency.',
              checklist: ['Look for one swollen leg', 'Check for leg pain/heat', 'Watch for sudden gasping', 'Note any chest pain'],
              scenario:
                'She has pain in her left calf and it looks redder than the right. You call the doctor immediately to screen for a blood clot.',
              myth: 'Leg cramps are just dehydration.',
              fact:
                'Unilateral (one-sided) leg swelling and pain is a primary indicator of a potentially fatal blood clot.',
              isEmergency: true
            },
            {
              title: 'Thoughts of Self-Harm',
              description: 'Maternal Mental Health Crisis.',
              clinicalInfo:
                'Postpartum Psychosis or severe Depression can lead to intrusive thoughts. This is a neurochemical emergency, not a character flaw.',
              checklist: ['Ask: Are you feeling safe?', 'Monitor for racing thoughts', 'Identify lack of sleep/eating', 'Call 988 or Provider immediately'],
              scenario:
                "She says she does not feel like herself and is afraid to be alone with the baby. You stay with her, take the baby, and call her OB right then.",
              myth: 'She is just a tired mom.',
              fact:
                'Postpartum mental health emergencies require the same clinical urgency as physical complications.',
              isEmergency: true
            }
          ]
        }
      ],
      aiTool: (
        <div className={`mt-8 overflow-hidden rounded-2xl border shadow-sm transition-colors duration-300 ${
          darkMode ? 'border-slate-800 bg-slate-950/70' : 'border-slate-200 bg-white'
        }`}>
          <div className={`border-b px-4 py-4 ${darkMode ? 'border-slate-800 bg-slate-900/80' : 'border-slate-100 bg-slate-50'}`}>
            <div>
              <p className={`mb-2 flex items-center gap-2 text-[10px] font-black uppercase leading-relaxed tracking-[0.16em] ${darkMode ? 'text-rose-300' : 'text-rose-700'}`}>
                <Sparkles className="h-4 w-4 shrink-0" />
                <span>{translateText('Instant Recovery Nutrition')}</span>
              </p>
              <h4 className={`text-xl font-black leading-tight tracking-tight ${darkMode ? 'text-slate-50' : 'text-slate-950'}`}>
                {translateText('Postpartum Meal Builder')}
              </h4>
              <p className={`mt-2 text-sm leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                {translateText('Generate a recovery meal pack instantly, then send it by email or text.')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 p-4">
            {[
              'Iron + protein',
              'Hydration support',
              'Low-effort prep'
            ].map((label) => (
              <div
                key={label}
                className={`flex min-h-11 items-center rounded-xl border px-3 py-2.5 text-sm font-bold ${
                  darkMode ? 'border-slate-800 bg-slate-900/70 text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-700'
                }`}
              >
                {translateText(label)}
              </div>
            ))}
          </div>

          <div className="px-4 pb-4">
            <button
              onClick={() => handleAiAction('meal')}
              className={`flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-black text-white shadow-md transition-all active:scale-95 ${
                darkMode ? 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500' : 'bg-gradient-to-r from-slate-950 to-rose-700 hover:from-slate-800 hover:to-rose-600'
              }`}
            >
              <Utensils className="h-4 w-4" />
              {translateText('Get Instant Meal Pack')}
            </button>
          </div>
        </div>
      )
    },
    homeSetup: {
      title: 'Home Setup & Recovery Support',
      description: 'Room-by-room planning that protects mom\'s healing, lowers stress, and keeps support practical.',
      icon: <ShieldCheck />,
      subsections: [
        {
          heading: 'Before Baby Arrives',
          icon: <ClipboardList className="w-5 h-5" />,
          color: 'bg-teal-100 text-teal-700',
          cards: [
            {
              title: 'Prenatal Home Prep',
              description: 'Prepare the house before labor so she does not manage setup while exhausted.',
              clinicalInfo:
                'The final weeks of pregnancy can bring pelvic pain, swelling, sleep loss, and shortness of breath. Home setup should remove stairs, clutter, and repeated decisions from her day.',
              checklist: ['Clear walkways from bed to bathroom', 'Place night lights near pathways', 'Wash baby and mom laundry early', 'Create a simple hospital return plan'],
              scenario:
                'She worries the house will not be ready. You walk through the plan: clean sheets, stocked bathroom, freezer meals, and a clear path from bedroom to baby area.',
              myth: 'Preparing the home is nesting work for mom.',
              fact:
                'Home prep is partner work because it protects her body and lowers the number of decisions she has to carry.',
              motherImpact:
                'She can enter birth knowing the recovery space is ready and she will not be responsible for last-minute household instructions.',
              isEmergency: false
            },
            {
              title: 'First 72-Hour Landing Plan',
              description: 'Protect the first days home with quiet, supplies, and clear roles.',
              clinicalInfo:
                'The first 72 hours often include bleeding, soreness, feeding learning, hormone shifts, and very little sleep. The home should function like a calm recovery unit.',
              checklist: ['Limit visitors unless she asks', 'Set alarms for meds and meals', 'Track pads, fluids, and symptoms', 'Keep phone chargers and documents ready'],
              scenario:
                'Family asks to come over the day she gets home. You say, "We are keeping the first few days quiet for healing. We will share a time when she is ready."',
              myth: 'Visitors help if they want to hold the baby.',
              fact:
                'Helpful visitors bring food, clean, or leave quickly. Holding the baby while mom hosts is not recovery support.',
              motherImpact:
                'She gets space to bleed, feed, cry, sleep, and learn without feeling watched or responsible for other people.',
              isEmergency: false
            },
            {
              title: 'Six-Week Support Rhythm',
              description: 'Keep household support steady after the first week fades.',
              clinicalInfo:
                'Postpartum recovery can last 6 weeks or longer. Bleeding, pelvic floor healing, incision recovery, feeding demands, and mood symptoms may continue after visitors stop checking in.',
              checklist: ['Own laundry and dishes daily', 'Protect one sleep block', 'Plan follow-up visits', 'Check mood and pain trends'],
              scenario:
                'At week 3, everyone assumes she is fine. You keep the same routine: breakfast ready, laundry moving, baby care covered, and a quiet check-in before bed.',
              myth: 'Recovery is mostly over after the first week.',
              fact:
                'The 6-week window still requires practical support, symptom tracking, and steady household ownership.',
              motherImpact:
                'She does not have to prove she still needs help just because the first rush of support has ended.',
              isEmergency: false
            }
          ]
        },
        {
          heading: 'Room-Based Recovery Stations',
          icon: <Heart className="w-5 h-5" />,
          color: 'bg-fuchsia-100 text-fuchsia-700',
          cards: [
            {
              title: 'Bedroom Recovery Setup',
              description: 'Make the bed area a rest, feeding, and healing zone.',
              clinicalInfo:
                'The bedroom should reduce lifting, bending, and unnecessary walking. Supplies should be reachable from bed or a nearby chair.',
              checklist: ['Set water, snacks, and meds nearby', 'Keep burp cloths and pads within reach', 'Use pillows for body support', 'Place trash bags beside the bed'],
              scenario:
                'She is settled in bed with the baby. You check the basket before leaving the room: water full, pain meds timed, burp cloths ready, and phone charged.',
              myth: 'The bedroom only needs the baby bassinet.',
              fact:
                'The bedroom also needs mom care supplies so her recovery is treated as important as newborn care.',
              motherImpact:
                'She can rest without getting up for every small need or asking for the same items repeatedly.',
              isEmergency: false
            },
            {
              title: 'Bathroom Recovery Setup',
              description: 'Stock the bathroom for bleeding, soreness, and private care.',
              clinicalInfo:
                'Post-birth bathroom care may include heavy pads, peri bottles, ice packs, witch hazel, stool softeners, and careful monitoring for bleeding changes.',
              checklist: ['Restock pads before each night', 'Keep peri bottle filled', 'Place clean towels within reach', 'Watch for heavy bleeding or odor'],
              scenario:
                'She goes to the bathroom and realizes the pads are low. You already restocked them and left a small bin for used supplies so she can move slowly and privately.',
              myth: 'Bathroom supplies are her personal responsibility.',
              fact:
                'Partners can stock supplies without invading privacy. That support protects dignity and healing.',
              motherImpact:
                'She does not have to bend, search, or call out for sensitive recovery items while bleeding or in pain.',
              isEmergency: false
            },
            {
              title: 'Feeding Station Setup',
              description: 'Build feeding spots that support mom whether breast, bottle, or both.',
              clinicalInfo:
                'Feeding sessions are frequent and can be physically draining. Good stations reduce dehydration, back strain, and decision fatigue.',
              checklist: ['Add water and one-hand snacks', 'Keep burp cloths and wipes nearby', 'Set up back and arm support', 'Refill station after each feed'],
              scenario:
                'She sits down to feed and everything is ready: pillow, water, snack, burp cloth, and charger. You take the next diaper change after the feed.',
              myth: 'Feeding support only means feeding the baby.',
              fact:
                'Feeding support also means caring for mom while her body is doing the work.',
              motherImpact:
                'She feels supported during long feeds and has fewer reasons to push through discomfort alone.',
              isEmergency: false
            },
            {
              title: 'Baby Care Station Setup',
              description: 'Keep baby care organized so mom is not the household supply manager.',
              clinicalInfo:
                'Diapers, wipes, clothes, swaddles, and safe sleep items should be easy to find so partners can take over care without asking mom where everything is.',
              checklist: ['Stock diapers and wipes daily', 'Sort clothes by easy sizes', 'Keep safe sleep area clear', 'Learn the care flow without asking'],
              scenario:
                'The baby needs a change at 3 a.m. You handle it from start to finish without waking her to ask where the wipes or pajamas are.',
              myth: 'Mom knows where everything is, so asking is fine.',
              fact:
                'Repeated questions keep the mental load on her. Partners should learn the system and maintain it.',
              motherImpact:
                'She can sleep or recover while baby care continues without her managing every detail.',
              isEmergency: false
            }
          ]
        },
        {
          heading: 'Household Load Protection',
          icon: <CheckSquare className="w-5 h-5" />,
          color: 'bg-cyan-100 text-cyan-700',
          cards: [
            {
              title: 'Kitchen and Meal Support',
              description: 'Keep food simple, nourishing, and ready before hunger turns into stress.',
              clinicalInfo:
                'Recovery, milk production, wound healing, and mood stability all depend on steady hydration and food. Partners should make meals easy to reach and easy to eat.',
              checklist: ['Prep protein-rich grab foods', 'Refill water bottles all day', 'Label freezer meals clearly', 'Handle dishes before they pile up'],
              scenario:
                'She has not eaten since morning. You bring a plate she can eat with one hand and place tomorrow\'s breakfast in the front of the fridge.',
              myth: 'Meal support means asking what she wants every time.',
              fact:
                'A better support move is offering two simple choices or bringing food you already know works for her.',
              motherImpact:
                'She gets steady nutrition without having to plan meals, answer repeated questions, or cook while healing.',
              isEmergency: false
            },
            {
              title: 'Laundry and Cleaning Support',
              description: 'Take over repeat chores before they become her problem.',
              clinicalInfo:
                'Laundry, dishes, floors, and trash can quickly become infection, stress, and safety issues when recovery and newborn care are happening at the same time.',
              checklist: ['Run one laundry load daily', 'Empty trash in recovery areas', 'Sanitize bottles or pump parts', 'Keep floors clear for walking'],
              scenario:
                'The hamper is full and pump parts are in the sink. You start laundry, wash the parts, and reset the feeding station without announcing it as a favor.',
              myth: 'Helping counts only when she asks for it.',
              fact:
                'The strongest support is owning predictable chores without making her assign them.',
              motherImpact:
                'She can focus on healing and bonding instead of scanning the house for work that still needs to be done.',
              isEmergency: false
            },
            {
              title: 'Shared Living Space Setup',
              description: 'Create calm common areas that are easy for mom to use.',
              clinicalInfo:
                'Living spaces should support short rests, feeding, safe baby placement, and low-stimulation recovery without clutter or visitor pressure.',
              checklist: ['Create one clear sitting area', 'Keep blankets and pillows ready', 'Set a small supply basket nearby', 'Lower noise and bright lights'],
              scenario:
                'She wants to sit with the family but feels sore. You clear the couch, add pillows, bring water, and keep the room calm before she walks in.',
              myth: 'Recovery only happens in the bedroom.',
              fact:
                'Every room she uses should protect her body, privacy, and energy.',
              motherImpact:
                'She can be part of the home without the home demanding more from her body than she has to give.',
              isEmergency: false
            }
          ]
        },
        {
          heading: 'Boundaries and Safety',
          icon: <ShieldAlert className="w-5 h-5" />,
          color: 'bg-rose-100 text-rose-700',
          cards: [
            {
              title: 'Visitor Boundaries',
              description: 'Protect mom from hosting, explaining, and overextending.',
              clinicalInfo:
                'Visitors can raise stress, interrupt feeding, reduce sleep, and increase the pressure to perform wellness. Partners should manage access and expectations.',
              checklist: ['Set visiting hours in advance', 'Require help or short visits', 'Say no without blaming mom', 'End visits when she looks tired'],
              scenario:
                'A relative wants to stay longer. You say, "We are closing visits now so she can rest," and walk them out without making her be the bad guy.',
              myth: 'Good support means letting everyone meet the baby.',
              fact:
                'Good support means protecting mom\'s healing even when other people are excited.',
              motherImpact:
                'She does not have to spend recovery energy managing other adults or defending her need for quiet.',
              isEmergency: false
            },
            {
              title: 'Emergency Readiness',
              description: 'Know when home support is not enough.',
              clinicalInfo:
                'Some postpartum symptoms need urgent medical help, including soaking one pad per hour, chest pain, shortness of breath, severe headache, vision changes, fever, or thoughts of self-harm.',
              checklist: ['Save OB and nurse line numbers', 'Know nearest emergency location', 'Track bleeding and mood changes', 'Call 911 for chest pain or breathing trouble'],
              scenario:
                'She says her headache is severe and her vision looks sparkly. You do not wait for it to pass. You call the provider and prepare to go in.',
              myth: 'A partner should wait until she decides it is serious.',
              fact:
                'Partners should listen to her and also recognize warning signs that require urgent care.',
              motherImpact:
                'She is safer because someone else is watching for patterns while she is exhausted and recovering.',
              isEmergency: true
            }
          ]
        }
      ],
      aiTool: (
        <div className={`mt-8 overflow-hidden rounded-2xl border shadow-sm transition-colors duration-300 ${darkMode ? 'border-slate-800 bg-slate-950/70' : 'border-slate-200 bg-white'}`}>
          <div className={`border-b px-4 py-4 ${darkMode ? 'border-slate-800 bg-slate-900/80' : 'border-slate-100 bg-slate-50'}`}>
            <p className={`mb-2 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] ${darkMode ? 'text-teal-300' : 'text-teal-700'}`}>
              <Sparkles className="h-4 w-4" />
              {translateText('Recovery Home Planner')}
            </p>
            <h4 className={`text-xl font-black tracking-tight ${darkMode ? 'text-slate-50' : 'text-slate-950'}`}>
              {translateText('Room-by-room support checklist')}
            </h4>
            <p className={`mt-2 max-w-xl text-sm leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              {translateText('Use these rooms as a quick reset plan before birth and through the first 6 weeks.')}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2">
            {[
              ['Bedroom', 'Water, meds, pads, snacks, pillows, charger.'],
              ['Bathroom', 'Pads, peri bottle, towels, trash, bleeding checks.'],
              ['Kitchen', 'Simple meals, labeled food, dishes handled daily.'],
              ['Baby area', 'Diapers, wipes, clothes, safe sleep space.'],
              ['Living space', 'Clear seat, low noise, supply basket, visitor control.'],
              ['Emergency plan', 'Provider numbers, symptoms, ride plan, 911 triggers.']
            ].map(([label, detail]) => (
              <div
                key={label}
                className={`rounded-xl border px-3 py-3 ${
                  darkMode ? 'border-slate-800 bg-slate-900/70' : 'border-slate-200 bg-slate-50'
                }`}
              >
                <p className={`text-sm font-black ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>{translateText(label)}</p>
                <p className={`mt-1 text-xs font-semibold leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{translateText(detail)}</p>
              </div>
            ))}
          </div>
        </div>
      )
    },
    keyterms: {
      title: 'Key Terms & Definitions',
      description: 'Essential language partners should understand to support mom confidently at each stage.',
      icon: <BookOpen />,
      subsections: [],
      aiTool: (
        <div className={`mt-8 rounded-3xl border p-6 shadow-sm transition-colors duration-300 ${darkMode ? 'border-slate-700 bg-slate-900' : 'border-indigo-100 bg-indigo-50'}`}>
          <h4 className={`mb-2 flex items-center gap-2 font-bold ${darkMode ? 'text-indigo-300' : 'text-indigo-900'}`}>
            <BookOpen className="h-5 w-5" />
            {translateText('Terms Learning Mode')}
          </h4>
          <p className={`text-sm font-medium leading-relaxed ${darkMode ? 'text-slate-400' : 'text-indigo-700'}`}>
            {translateText('Review this tab to decode anatomy, medical decisions, and emotional language so you can respond with confidence in real time.')}
          </p>
        </div>
      )
    },
    dashboard: {
      title: 'Partner Education Dashboard',
      description: 'Structured training modules with progress tracking, scenarios, and quizzes.',
      icon: <ClipboardList />,
      subsections: [],
      aiTool: (
        <div className={`mt-8 rounded-3xl border p-6 shadow-sm transition-colors duration-300 ${darkMode ? 'border-slate-700 bg-slate-900' : 'border-cyan-100 bg-cyan-50'}`}>
          <h4 className={`mb-2 flex items-center gap-2 font-bold ${darkMode ? 'text-cyan-300' : 'text-cyan-900'}`}>
            <ClipboardList className="h-5 w-5" />
            {translateText('Dashboard Access')}
          </h4>
          <p className={`text-sm font-medium leading-relaxed ${darkMode ? 'text-slate-400' : 'text-cyan-700'}`}>
            {translateText('Use this tab to enter the full partner learning environment with secured user profiles, module progression, and quiz scoring.')}
          </p>
        </div>
      )
    }
  };

  const translationSeedStrings = useMemo(() => {
    const seeds = new Set();

    const uiLabels = [
      'Pregnancy Support Partner Training Hub',
      'Built for partners. Designed for safer maternal outcomes.',
      'Built for partners. Designed for safer outcomes.',
      'Dieudonne Partner Hub equips fathers and support people with clinically grounded guidance, interactive training, and intelligent coaching across prenatal, labor, and postpartum recovery.',
      'Built for partners',
      'Prenatal Care',
      'Labor Support',
      'Fetal Support',
      'Postpartum Recovery',
      'Evidence-Informed',
      'Clinically reviewed content you can trust.',
      'Interactive Training',
      'Lessons that build confidence.',
      'Smart Coaching',
      'Guidance when it matters most.',
      'Real-Time Support',
      'Tools for every moment.',
      'Clinically Grounded',
      'Guidance backed by evidence and best practices.',
      'Private & Secure',
      'Progress and profile data stay protected.',
      'Built for Real Families',
      'Practical tools for partners in daily care.',
      'Continuously Evolving',
      'New content shaped by partner feedback.',
      'Why this platform works',
      'Clinically grounded playbooks',
      'Evidence-informed training content, warning-sign thresholds, and partner action checklists that convert uncertainty into confident support.',
      'Interactive learning system',
      'Flip-card training, stage-based physiology guides, and dashboard progression reinforce what to do, when to do it, and why it matters.',
      'Real-time partner support',
      'Use intelligent clarifier, labor coach, and recovery nutrition tools to get practical language and action plans in the moment.',
      'Enter Partner Platform',
      'Explore Main Guide',
      'No fluff. Practical, clinically aligned support for real families.',
      'Partner support journey illustration',
      'Core Partner Wins',
      'Core Partner Win Logged',
      'Full Journey Support Guide',
      'The "Partner" Role',
      "Your role is to manage the environment so she can manage the journey. Anticipate, don't ask.",
      'Support Protocol',
      'Tap to flip for training',
      'Mastering',
      'Flip the cards above to see actionable tips for this stage. As a partner, your education is just as vital as hers to ensure a safe transition for the entire family.',
      'Every pregnancy and labor is unique. Use these guidelines as a baseline, but always defer to the specific instructions given by your medical team.',
      'Gemini Intelligent Insight',
      'Instant Recovery Nutrition',
      'Postpartum Recovery Meal Idea',
      'Postpartum Meal Builder',
      'Generate a recovery meal pack instantly, then send it by email or text.',
      'Iron + protein',
      'Hydration support',
      'Low-effort prep',
      'Instant',
      'Get Instant Meal Pack',
      'Send by Email',
      'Send by Text',
      'Labor Coaching Pack',
      'Real-Time Partner Coach',
      'Clinical Language Support',
      'Request Needs Attention',
      'Support Tool',
      'Home Setup & Recovery Support',
      'Room-by-room planning that protects mom\'s healing, lowers stress, and keeps support practical.',
      'Recovery Home Planner',
      'Room-by-room support checklist',
      'Use these rooms as a quick reset plan before birth and through the first 6 weeks.',
      'Bedroom',
      'Bathroom',
      'Kitchen',
      'Baby area',
      'Living space',
      'Emergency plan',
      'Got it',
      'Interactive Anatomy Guide',
      'Interactive Labor Physiology Guide',
      'Interactive Postpartum Recovery Guide',
      'Trimester 1: The Chemical Surge',
      'Trimester 2: The Structural Shift',
      'Trimester 3: The Crowded House',
      'Size of an orange',
      'Size of a papaya',
      'Size of a watermelon',
      'Bladder pressure begins',
      'Intestines displaced upward',
      'Lungs and stomach compressed',
      'hCG, Progesterone, Estrogen spikes',
      'Relaxin loosens joints',
      'Oxytocin and Prolactin prep',
      'Blood volume increases by 50% starting now. The heart works harder, and progesterone slows digestion, causing fatigue.',
      'The center of gravity shifts forward. Relaxin affects the pelvis and rib cage to allow for expansion, often causing growing pains.',
      'The uterus reaches the base of the rib cage. Diaphragm movement is restricted, leading to shortness of breath. The bladder is now fully compressed.',
      'Early Labor: Build Rhythm',
      'Active Labor: Intensify Support',
      'Transition: Peak Intensity Window',
      'Pushing Stage: Directed Effort',
      'Contractions begin patterning while the cervix softens and starts opening. Calm surroundings support oxytocin flow and labor momentum.',
      'Contractions become stronger and closer together. Cervical change accelerates, and positioning becomes a key pain-management tool.',
      'This is often the most intense stage. Emotional overwhelm is common as the cervix reaches full dilation and pressure builds.',
      'With full dilation, coordinated pushing and rest cycles guide fetal descent through the pelvis toward birth.',
      '0-5 cm; gradual effacement and opening',
      '6-8 cm; rapid progress possible',
      '8-10 cm; nearing complete dilation',
      '10 cm; complete dilation',
      '30-60 sec, every 5-20 min',
      '45-75 sec, every 3-5 min',
      '60-90 sec, every 2-3 min',
      '60-90 sec with rest between waves',
      'Oxytocin rises; stress adrenaline can slow contraction efficiency.',
      'Uterine pressure increases; fetal descent and rotation demand frequent movement.',
      'Catecholamines surge under stress; steady coaching protects rhythm and focus.',
      'Fetal station advances; oxygenation and coached breathing remain critical.',
      'Hydration, environment control, timing waves, conserving her energy.',
      'Counter-pressure, breath pacing, position changes every 30-60 minutes.',
      'Short rhythmic phrases, eye contact, cool cloth, reduce room stimulation.',
      'Counted breaths, position support, hydration sips, confidence reinforcement.',
      'If she says “I cannot do this,” that often signals transition, not failure.',
      'First 24 Hours: Stabilize & Protect',
      'Day 3-5: Hormonal Shift Window',
      'Week 2: Recovery Pattern Checkpoint',
      'Week 6: Clinical Reassessment Stage',
      'Immediate postpartum care centers on uterine contraction, bleeding assessment, pain control, and safe rest.',
      'Milk transition, sleep disruption, and hormone crash can intensify physical discomfort and mood lability.',
      'By this point, pain and emotional volatility should trend down, and mobility should gradually improve.',
      'Around 6 weeks, formal follow-up should review healing, blood pressure risk, pelvic floor status, and mental health.',
      'Fundus should feel firm; lochia rubra starts as uterine healing begins.',
      'Breast engorgement and uterine afterpains often peak in this window.',
      'Lochia typically shifts toward serosa/alba; persistent heavy bleeding is not expected.',
      'Uterine involution should be advanced; persistent pain, fever, or abnormal discharge warrants evaluation.',
      'Estrogen and progesterone drop rapidly; prolactin/oxytocin signaling increases.',
      'Post-delivery endocrine drop drives baby-blues vulnerability and emotional sensitivity.',
      'Neurochemical adjustment continues while sleep fragmentation still impacts resilience.',
      'Hormone patterns vary with breastfeeding status and can still affect mood and energy.',
      'Relief, tears, shock, and exhaustion can coexist in the same hour.',
      'Crying spells and overwhelm are common; trend direction matters more than single moments.',
      'If distress is worsening instead of improving, screen for postpartum depression or anxiety.',
      'Identity strain and fatigue may persist even when physical recovery appears “normal.”',
      'Track meds, hydration, and pad volume; advocate for uninterrupted recovery time.',
      'Protect a 4-hour sleep block, reduce visitors, and maintain nutrition/hydration cadence.',
      'Track symptom trajectory, support follow-up appointments, and continue household load ownership.',
      'Support postpartum check visits, pelvic floor care, and long-term sleep protection plans.',
      'Soaking one heavy pad in an hour is emergency-level bleeding.',
      'Hopelessness, panic escalation, or intrusive harm thoughts require urgent clinical support.',
      'Mood symptoms beyond 14 days with functional decline should be escalated for screening.',
      'Headache with vision changes, chest pain, shortness of breath, or unilateral leg swelling is urgent.',
      'Loading partner dashboard...',
      '© 2026 Dieudonne Foundation',
      "EQUIPPING EVERY MOTHER'S CHAMPION FOR THE JOURNEY AHEAD.",
      'SITE BUILT BY CHERY TALENT MANAGEMENT AGENCY',
      'Dark Mode',
      'Light Mode',
      'Card',
      'Step',
      'Back',
      'Next',
      'Cultural Notes',
      'Scenario Practice',
      'Finish Lesson',
      'Excellent support move. Momentum is building.',
      'Strong partner leadership. Keep this rhythm.',
      'That consistency protects recovery and trust.',
      'Great execution. Small wins compound quickly.'
    ];
    uiLabels.forEach((text) => addStringToSeedSet(seeds, text));

    supportTasks.forEach((task) => addStringToSeedSet(seeds, task.label));

    Object.values(guideData).forEach((stage) => {
      addStringToSeedSet(seeds, stage.title);
      addStringToSeedSet(seeds, stage.description);
      stage.subsections?.forEach((sub) => {
        addStringToSeedSet(seeds, sub.heading);
        sub.cards?.forEach((card) => {
          addStringToSeedSet(seeds, card.title);
          addStringToSeedSet(seeds, card.description);
          addStringToSeedSet(seeds, card.clinicalInfo);
          addStringToSeedSet(seeds, card.scenario);
          addStringToSeedSet(seeds, card.myth);
          addStringToSeedSet(seeds, card.fact);
          addStringToSeedSet(seeds, card.motherImpact);
          addStringToSeedSet(seeds, card.redFlag);
          addStringToSeedSet(seeds, card.tip);
          card.checklist?.forEach((item) => addStringToSeedSet(seeds, item));
          card.partnerTips?.forEach((item) => addStringToSeedSet(seeds, item));
        });
      });
    });

    const dashboardLabels = [
      'Partner Education Dashboard',
      'Structured Training Environment',
      'Secure sign-in to track module progress, quiz scores, and lesson completion.',
      'Loading partner dashboard...',
      'Back to Main Guide',
      'Site Home',
      'Log Out',
      'Current Module',
      'Overall Progress',
      'Next Lesson',
      'Recently Completed',
      'Module Progress',
      'Training Approach',
      'Review',
      'Resume',
      'Lessons tracked in profile',
      'Responses saved',
      'Lesson',
      'Lessons',
      'Locked',
      'Open',
      'Open Module',
      'Back to Dashboard',
      'Back to Module',
      'Step',
      'Continue Learning',
      'Take Quiz',
      'Structured Course',
      'Complete the learning path before the quiz',
      'Move through concept explanation, applied examples, reflection, and quick checks. The knowledge quiz opens when the course work is complete.',
      'Course Progress',
      'checks complete',
      'reflection needed',
      'reflection saved',
      'Build Understanding',
      'Applied Examples',
      'Reflection',
      'Save Reflection',
      'Write at least 20 characters to unlock the quiz.',
      'Quick Knowledge Check',
      'Correct.',
      'Review this section and try again.',
      'Quiz locked until course work is complete.',
      'Complete each quick knowledge check and write a reflection response before opening the quiz.',
      'Complete the quick checks and reflection first.',
      'Cultural Notes',
      'Scenario Practice',
      'Finish Lesson',
      'Back',
      'Next',
      'Clinical Learning',
      'Medical Terms',
      'Cultural Sensitivity Notes',
      'Scenario Exercise',
      'Write your response plan...',
      'Save Scenario Response',
      'Knowledge Quiz',
      'Quiz Progress',
      'Select all that apply.',
      'Submit Quiz',
      'Next Question',
      'answered',
      'Ready to submit your quiz.',
      'Jump to the next unanswered question.',
      'Score:',
      'Lesson Completion',
      'Mark Lesson Complete',
      'Lesson completed and progress saved.',
      'Saved responses loaded. You can review or edit before resubmitting.',
      'Retake quiz to reach 70% and unlock progression.',
      'Postpartum Warning Signs',
      'Call Provider',
      'Seek Emergency Care'
    ];
    dashboardLabels.forEach((text) => addStringToSeedSet(seeds, text));

    partnerCurriculum.modules.forEach((module) => {
      addStringToSeedSet(seeds, module.title);
      addStringToSeedSet(seeds, module.subtitle);
      addStringToSeedSet(seeds, module.objective);
      module.warningSigns?.callProvider?.forEach((line) => addStringToSeedSet(seeds, line));
      module.warningSigns?.emergency?.forEach((line) => addStringToSeedSet(seeds, line));
      module.lessons.forEach((lesson) => {
        addStringToSeedSet(seeds, lesson.title);
        addStringToSeedSet(seeds, lesson.summary);
        lesson.clinicalContent?.forEach((line) => addStringToSeedSet(seeds, line));
        lesson.definitions?.forEach((entry) => {
          addStringToSeedSet(seeds, entry.term);
          addStringToSeedSet(seeds, entry.definition);
        });
        lesson.culturalNotes?.forEach((note) => addStringToSeedSet(seeds, note));
        if (lesson.scenario) {
          addStringToSeedSet(seeds, lesson.scenario.prompt);
          addStringToSeedSet(seeds, lesson.scenario.guidance);
        }
        lesson.quiz?.forEach((question) => {
          addStringToSeedSet(seeds, question.question);
          question.options?.forEach((option) => addStringToSeedSet(seeds, option));
          addStringToSeedSet(seeds, question.rationale);
        });
      });
    });

    keyTermSections.forEach((section) => {
      addStringToSeedSet(seeds, section.title);
      section.terms.forEach((term) => {
        addStringToSeedSet(seeds, term.term);
        addStringToSeedSet(seeds, term.stage);
        addStringToSeedSet(seeds, term.definition);
        addStringToSeedSet(seeds, term.deepDive);
        addStringToSeedSet(seeds, term.hormoneImpact);
        addStringToSeedSet(seeds, term.redFlag);
        term.partnerTips?.forEach((item) => addStringToSeedSet(seeds, item));
      });
    });

    Object.values(keyTermStructuredContent).forEach((item) => {
      addStringToSeedSet(seeds, item.definition);
      addStringToSeedSet(seeds, item.bodyChanges);
      addStringToSeedSet(seeds, item.clinicalSignificance);
      addStringToSeedSet(seeds, item.motherImpact);
    });

    return Array.from(seeds);
  }, [guideData]);

  useEffect(() => {
    translationSeedRef.current = translationSeedStrings;
  }, [translationSeedStrings]);

  useEffect(() => {
    if (language === 'en') return;
    const timer = window.setTimeout(() => {
      queueTranslations(translationSeedRef.current, { flush: false });
    }, 5000);
    return () => window.clearTimeout(timer);
  }, [language, queueTranslations]);

  useEffect(() => {
    setGuideStep(0);
    setPartnerTipStep(0);
  }, [activeStage]);

  const isKeyTermsStage = activeStage === 'keyterms';
  const isDashboardStage = activeStage === 'dashboard';
  const currentLanguageMeta = LANGUAGE_OPTIONS.find((item) => item.code === language) || LANGUAGE_OPTIONS[0];
  const mobileGuideCards = (guideData[activeStage]?.subsections || []).flatMap((sub, subsectionIndex) =>
    (sub.cards || []).map((card, cardIndex) => ({
      card,
      icon: sub.icon,
      color: sub.color,
      heading: sub.heading,
      id: `${activeStage}-${subsectionIndex}-${cardIndex}`
    }))
  );
  const currentGuideCard = mobileGuideCards[guideStep] || mobileGuideCards[0];
  const guideStepPercent = mobileGuideCards.length
    ? Math.round(((guideStep + 1) / mobileGuideCards.length) * 100)
    : 0;
  const completedSupportTaskCount = supportTasks.filter((task) => checklist[task.id]).length;
  const supportTaskProgress = Math.round((completedSupportTaskCount / supportTasks.length) * 100);

  const openCurrentPartnerTips = () => {
    if (!mobileGuideCards.length) return;

    const tipCard = mobileGuideCards[partnerTipStep % mobileGuideCards.length] || currentGuideCard;
    const card = tipCard.card;
    const checklistItems = card.checklist || [];
    const tips = `Partner tip focus: ${card.title}

Plain-language why it matters:
${card.description}

Support actions:
${checklistItems.map((item) => `- ${item}`).join('\n')}

Try this today:
${card.scenario || 'Pick one support action and do it before she has to ask.'}`;

    setAiResultMeta({
      type: 'partner-tips',
      title: 'Partner Tips',
      eyebrow: 'Quick Tools',
      shareSubject: 'Partner tips from Dieudonne Partner Hub'
    });
    setAiResult(tips);
    setPartnerTipStep((current) => (current + 1) % mobileGuideCards.length);
  };

  const focusDailyReminders = () => {
    supportFocusRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    supportFocusRef.current?.focus({ preventScroll: true });
  };

  const quickToolCards = [
    { label: 'Partner Tips', icon: <Heart className="h-5 w-5" />, detail: 'Open tips for the current card', action: openCurrentPartnerTips },
    { label: 'Reminders', icon: <Calendar className="h-5 w-5" />, detail: 'Jump to daily support wins', action: focusDailyReminders },
    { label: 'My Notes', icon: <ClipboardList className="h-5 w-5" />, detail: 'Open your saved dashboard', action: () => navigateWithinApp('/partner-dashboard') }
  ];

  return (
    <div ref={appRootRef} className={`min-h-screen p-4 font-sans transition-colors duration-500 md:p-8 ${darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
      {aiResult && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-md">
          <div className={`flex min-h-0 max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl shadow-2xl ${darkMode ? 'border border-slate-800 bg-slate-900' : 'border border-slate-200 bg-white'}`}>
            <div className={`flex items-center justify-between border-b p-5 ${darkMode ? 'border-slate-800 bg-slate-950 text-white' : 'border-slate-200 bg-slate-50 text-slate-950'}`}>
              <div className="min-w-0">
                <p className={`mb-1 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>
                  <Sparkles className="h-4 w-4" />
                  {translateText(aiResultMeta?.eyebrow || 'Gemini Intelligent Insight')}
                </p>
                <h3 className="truncate text-lg font-black">
                  {translateText(aiResultMeta?.title || 'Gemini Intelligent Insight')}
                </h3>
              </div>
              <button
                onClick={() => {
                  setAiResult(null);
                  setAiResultMeta(null);
                }}
                className={`rounded-full p-2 transition-colors ${darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-200'}`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div
              ref={insightScrollRef}
              className="custom-scrollbar h-[56vh] min-h-[240px] overflow-y-auto overscroll-contain p-6 sm:p-8"
            >
              <p className={`whitespace-pre-wrap leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{aiResult}</p>
            </div>
            <div className={`space-y-3 border-t p-4 sm:p-5 ${darkMode ? 'border-slate-800 bg-slate-950/70' : 'border-slate-200 bg-slate-50'}`}>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <a
                  href={buildShareHref({
                    type: 'email',
                    subject: aiResultMeta?.shareSubject,
                    body: aiResult
                  })}
                  className={`flex min-h-11 items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-black transition ${
                    darkMode ? 'border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800' : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <Mail className="h-4 w-4" /> {translateText('Send by Email')}
                </a>
                <a
                  href={buildShareHref({
                    type: 'sms',
                    subject: aiResultMeta?.shareSubject,
                    body: aiResult
                  })}
                  className={`flex min-h-11 items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-black transition ${
                    darkMode ? 'border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800' : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <MessageSquare className="h-4 w-4" /> {translateText('Send by Text')}
                </a>
              </div>
              <button
                onClick={() => {
                  setAiResult(null);
                  setAiResultMeta(null);
                }}
                className={`w-full rounded-xl py-3 font-bold text-white shadow-lg transition-all active:scale-95 ${
                  darkMode ? 'bg-rose-600 shadow-rose-900/20 hover:bg-rose-500' : 'bg-rose-600 shadow-rose-200 hover:bg-rose-700'
                }`}
              >
                {translateText('Got it')}
              </button>
            </div>
          </div>
        </div>
      )}

      <header className={`hero-topbar relative z-50 mx-auto mb-6 flex max-w-7xl flex-col justify-between gap-3 rounded-[1.75rem] border px-4 py-3 shadow-2xl sm:mb-8 sm:flex-row sm:items-center sm:gap-4 sm:rounded-[2.25rem] sm:px-6 ${
        darkMode
          ? 'border-slate-700/70 bg-slate-950/86 text-slate-100 shadow-cyan-950/20'
          : 'border-white/80 bg-white/86 text-slate-900 shadow-slate-200/70 backdrop-blur-xl'
      }`}>
        <div className="flex items-center gap-4">
          <img
            src={dieudonneDarkLogo}
            alt="Dieudonne logo"
            className={`h-11 w-auto rounded-xl border p-1 shadow-xl sm:h-14 ${
              darkMode ? 'border-slate-700 bg-black' : 'border-slate-200 bg-black'
            }`}
          />
          <div className={`hidden items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.18em] lg:flex ${
            darkMode ? 'border-slate-700 bg-slate-900/80 text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-600'
          }`}>
            <ShieldCheck className="h-4 w-4 text-cyan-400" />
            {translateText('Pregnancy Support Partner Training Hub')}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={() => setDarkMode((current) => !current)}
            aria-pressed={darkMode}
            aria-label={translateText(darkMode ? 'Switch to light mode' : 'Switch to dark mode')}
            className={`group flex min-h-11 items-center gap-2 rounded-full border px-3.5 text-xs font-semibold transition-all sm:px-4 sm:text-sm ${
              darkMode
                ? 'border-slate-700 bg-slate-900 text-amber-300 hover:border-slate-600'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-800'
            }`}
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            <span>{translateText(darkMode ? 'Light Mode' : 'Dark Mode')}</span>
          </button>

          <div ref={languageMenuRef} className="relative" data-no-translate="true">
            <button
              onClick={() => setLanguageMenuOpen((prev) => !prev)}
              className={`flex min-h-11 items-center gap-2 rounded-full border px-3.5 text-xs font-semibold transition-all sm:min-w-[112px] sm:px-4 sm:text-sm ${
                darkMode
                  ? 'border-slate-700 bg-slate-900 text-slate-200 hover:border-slate-600'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
              aria-label="Select language"
              title="Select language"
            >
              <Globe className="h-4 w-4" />
              <span className="font-bold">{currentLanguageMeta.short}</span>
              {translationLoading && language !== 'en' ? (
                <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
              ) : (
                <ChevronDown className={`h-4 w-4 transition-transform ${languageMenuOpen ? 'rotate-180' : ''}`} />
              )}
            </button>

            {languageMenuOpen && (
              <div
                className={`absolute right-0 z-50 mt-2 max-h-80 w-56 overflow-y-auto rounded-2xl border shadow-xl ${
                  darkMode ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'
                }`}
              >
                {LANGUAGE_OPTIONS.map((option) => (
                  <button
                    key={option.code}
                    type="button"
                    onClick={() => {
                      setLanguage(option.code);
                      setLanguageMenuOpen(false);
                    }}
                    className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold transition-colors ${
                      language === option.code
                        ? darkMode
                          ? 'bg-indigo-900/30 text-indigo-200'
                          : 'bg-indigo-50 text-indigo-700'
                        : darkMode
                          ? 'text-slate-200 hover:bg-slate-800'
                          : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span>{option.flag}</span>
                      <span>{option.label}</span>
                    </span>
                    {language === option.code && <Check className="h-4 w-4" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <a
            href="/partner-orgs"
            className={`inline-flex min-h-11 items-center justify-center rounded-full border px-3.5 text-xs font-semibold transition-all sm:px-4 sm:text-sm ${
              darkMode
                ? 'border-slate-700 bg-slate-900 text-slate-200 hover:border-slate-600'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
            }`}
          >
            {translateText('Organizations')}
          </a>

          <a
            href="/partner-demo"
            className={`hidden min-h-11 items-center justify-center rounded-full border px-4 text-sm font-semibold transition-all md:inline-flex ${
              darkMode
                ? 'border-slate-700 bg-slate-900 text-slate-200 hover:border-slate-600'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
            }`}
          >
            {translateText('Demo')}
          </a>

        </div>
      </header>

      <section
        className={`hero-premium-section mx-auto mb-8 max-w-7xl overflow-hidden rounded-[1.5rem] border px-4 py-6 sm:px-8 sm:py-10 md:min-h-[72vh] md:rounded-[2.25rem] lg:px-12 lg:py-12 ${
          darkMode ? 'hero-premium-section-dark border-slate-800 bg-slate-950' : 'hero-premium-section-light border-slate-200 bg-white'
        }`}
      >
        <div className="relative">
          <div className={`hero-grid-field pointer-events-none absolute inset-0 ${darkMode ? 'opacity-100' : 'opacity-45'}`} />
          <div className="hero-radial hero-radial-cyan" />
          <div className="hero-radial hero-radial-rose" />

          <div className="relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-10 xl:gap-14">
            <div className="space-y-5 sm:space-y-6">
              <div
                className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] sm:px-4 sm:text-xs ${
                  darkMode
                    ? 'border-indigo-400/30 bg-indigo-500/12 text-indigo-200'
                    : 'border-indigo-200 bg-indigo-50 text-indigo-700'
                }`}
              >
                <Users className="h-3.5 w-3.5" />
                {translateText('Built for partners')}
              </div>

              <div className="space-y-4">
                <h1 className={`hero-headline max-w-3xl text-[2.65rem] font-black leading-[1.02] sm:text-[4rem] md:text-[4.65rem] lg:text-[3.75rem] xl:text-[4.2rem] ${darkMode ? 'text-white' : 'text-slate-950'}`}>
                  {renderHeroHeadline()}
                </h1>
                <p className={`max-w-2xl text-[15px] leading-relaxed sm:text-base md:text-xl ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  {translateText(
                    'Dieudonne Partner Hub equips fathers and support people with clinically grounded guidance, interactive training, and intelligent coaching across prenatal, labor, and postpartum recovery.'
                  )}
                </p>
              </div>

              <div className="grid gap-3 sm:hidden">
                <button
                  onClick={handleHeroEnterPlatform}
                  className={`inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl px-5 py-3 text-base font-bold text-white shadow-lg transition-all active:scale-95 ${
                    darkMode ? 'bg-gradient-to-r from-blue-600 to-fuchsia-600 shadow-indigo-950/30' : 'bg-gradient-to-r from-blue-600 to-rose-500 shadow-indigo-200'
                  }`}
                >
                  {translateText('Enter Partner Platform')}
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={handleHeroExploreGuide}
                  className={`inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border px-5 py-3 text-base font-bold transition-colors ${
                    darkMode
                      ? 'border-slate-700 bg-slate-800/80 text-slate-100 hover:border-slate-500'
                      : 'border-slate-300 bg-white/85 text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <BookOpen className="h-4 w-4" />
                  {translateText('Explore Main Guide')}
                </button>
                <a
                  href={DOULA_MATCH_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border px-5 py-3 text-base font-bold transition-colors ${
                    darkMode
                      ? 'border-cyan-400/35 bg-cyan-400/10 text-cyan-100 hover:border-cyan-300/70 hover:bg-cyan-400/15'
                      : 'border-cyan-200 bg-cyan-50 text-cyan-800 hover:bg-cyan-100'
                  }`}
                >
                  <HeartHandshake className="h-4 w-4" />
                  {translateText('Match Mom with a Doula')}
                </a>
              </div>

              <div className="hidden flex-wrap gap-3 sm:flex">
                <button
                  onClick={handleHeroEnterPlatform}
                  className={`hero-cta-button hero-cta-primary inline-flex min-h-[56px] items-center justify-center gap-2 rounded-2xl px-6 py-3 text-base font-extrabold text-white shadow-lg transition-all active:scale-95 ${
                    darkMode ? 'bg-gradient-to-r from-blue-600 to-fuchsia-600 shadow-indigo-950/30' : 'bg-gradient-to-r from-blue-600 to-rose-500 shadow-indigo-200'
                  }`}
                >
                  {translateText('Enter Partner Platform')}
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={handleHeroExploreGuide}
                  className={`hero-cta-button inline-flex min-h-[56px] items-center justify-center gap-2 rounded-2xl border px-6 py-3 text-base font-extrabold transition-colors ${
                    darkMode
                      ? 'border-slate-700 bg-slate-950/50 text-slate-100 hover:border-slate-500'
                      : 'border-slate-300 bg-white/85 text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <BookOpen className="h-5 w-5" />
                  {translateText('Explore Main Guide')}
                </button>
                <a
                  href={DOULA_MATCH_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`hero-cta-button inline-flex min-h-[56px] items-center justify-center gap-2 rounded-2xl border px-6 py-3 text-base font-extrabold transition-colors ${
                    darkMode
                      ? 'border-cyan-400/35 bg-cyan-400/10 text-cyan-100 hover:border-cyan-300/70 hover:bg-cyan-400/15'
                      : 'border-cyan-200 bg-cyan-50 text-cyan-800 hover:bg-cyan-100'
                  }`}
                >
                  <HeartHandshake className="h-5 w-5" />
                  {translateText('Match Mom with a Doula')}
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>

              <p className={`max-w-lg text-[13px] font-medium sm:text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {translateText('No fluff. Practical, clinically aligned support for real families.')}
              </p>
            </div>

            <div className="relative lg:self-center">
              <div className={`hero-media-card overflow-hidden rounded-[1.6rem] border sm:rounded-[2rem] ${darkMode ? 'border-slate-700 bg-slate-950/70' : 'border-slate-200 bg-slate-100'}`}>
                <img
                  src={heroImageSrc}
                  alt={translateText('Partner support journey illustration')}
                  className="hero-media-image block w-full"
                  loading="eager"
                  onError={() => {
                    if (heroImageSrc !== heroPartnerJourney) {
                      setHeroImageSrc(heroPartnerJourney);
                    }
                  }}
                />
                <div className={`pointer-events-none absolute inset-0 ${darkMode ? 'bg-gradient-to-t from-slate-950/60 via-transparent to-transparent' : 'bg-gradient-to-t from-slate-100/60 via-transparent to-transparent'}`} />
              </div>

              <div className={`hero-feature-rail mt-4 grid gap-2 rounded-[1.4rem] border p-3 sm:grid-cols-4 ${
                darkMode ? 'border-indigo-500/35 bg-slate-950/78 text-slate-100' : 'border-indigo-200 bg-white/86 text-slate-900'
              }`}>
                {[
                  { icon: <ShieldCheck className="h-5 w-5" />, label: 'Evidence-Informed', detail: 'Clinically reviewed content you can trust.' },
                  { icon: <Layers className="h-5 w-5" />, label: 'Interactive Training', detail: 'Lessons that build confidence.' },
                  { icon: <MessageSquare className="h-5 w-5" />, label: 'Smart Coaching', detail: 'Guidance when it matters most.' },
                  { icon: <CheckSquare className="h-5 w-5" />, label: 'Real-Time Support', detail: 'Tools for every moment.' }
                ].map((item) => (
                  <div key={item.label} className={`rounded-2xl px-3 py-3 text-center ${darkMode ? 'bg-slate-900/70' : 'bg-slate-50'}`}>
                    <div className={`mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-2xl ${
                      darkMode ? 'bg-indigo-500/12 text-cyan-300' : 'bg-indigo-100 text-indigo-700'
                    }`}>
                      {item.icon}
                    </div>
                    <p className="text-sm font-extrabold">{translateText(item.label)}</p>
                    <p className={`mt-1 text-xs leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{translateText(item.detail)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={`relative z-10 mt-8 grid gap-3 rounded-[1.45rem] border p-4 sm:grid-cols-2 lg:grid-cols-4 ${
            darkMode ? 'border-slate-700/80 bg-slate-900/60 text-slate-100' : 'border-slate-200 bg-white/76 text-slate-900'
          }`}>
            {[
              { icon: <ShieldCheck className="h-6 w-6" />, label: 'Clinically Grounded', detail: 'Guidance backed by evidence and best practices.' },
              { icon: <Lock className="h-6 w-6" />, label: 'Private & Secure', detail: 'Progress and profile data stay protected.' },
              { icon: <Users className="h-6 w-6" />, label: 'Built for Real Families', detail: 'Practical tools for partners in daily care.' },
              { icon: <Rocket className="h-6 w-6" />, label: 'Continuously Evolving', detail: 'New content shaped by partner feedback.' }
            ].map((item) => (
              <div key={item.label} className={`hero-trust-item flex items-start gap-3 rounded-2xl px-3 py-3 ${darkMode ? 'hover:bg-slate-900' : 'hover:bg-slate-50'}`}>
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${
                  darkMode ? 'border-cyan-400/35 bg-cyan-400/10 text-cyan-300' : 'border-cyan-200 bg-cyan-50 text-cyan-700'
                }`}>
                  {item.icon}
                </div>
                <div>
                  <p className="text-sm font-extrabold">{translateText(item.label)}</p>
                  <p className={`mt-1 text-xs leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{translateText(item.detail)}</p>
                </div>
              </div>
            ))}
              </div>
        </div>
      </section>

      {experienceEntry && (
      <main ref={mainContentRef} className="premium-guide-layout mx-auto grid max-w-7xl grid-cols-1 gap-5 md:gap-7 lg:grid-cols-4">
        <div className="order-2 space-y-4 lg:sticky lg:top-6 lg:order-1 lg:col-span-1 lg:self-start">
          <div className="relative">
            {winCelebration && (
              <div key={winCelebration.token} className="pointer-events-none z-20 mb-3 md:mb-0 md:absolute md:right-full md:top-4 md:mr-4 md:w-64">
                <div className={`animate-win-toast rounded-2xl border px-4 py-3 shadow-lg ${
                  darkMode
                    ? 'border-emerald-700/60 bg-emerald-900/40 text-emerald-100'
                    : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                }`}>
                  <p className="flex items-center gap-2 text-sm font-bold">
                    <Sparkles className="h-4 w-4" /> {translateText('Core Partner Win Logged')}
                  </p>
                  <p className={`mt-1 text-xs ${darkMode ? 'text-emerald-200' : 'text-emerald-600'}`}>
                    {translateText(winCelebration.label)}. {translateText(winCelebration.message)}
                  </p>
                </div>
                <div className="pointer-events-none relative mx-auto -mt-2 h-10 w-44">
                  <span className="win-particle" style={{ '--x': '-68px', '--y': '-18px' }} />
                  <span className="win-particle" style={{ '--x': '-42px', '--y': '-26px' }} />
                  <span className="win-particle" style={{ '--x': '-18px', '--y': '-30px' }} />
                  <span className="win-particle" style={{ '--x': '18px', '--y': '-30px' }} />
                  <span className="win-particle" style={{ '--x': '42px', '--y': '-26px' }} />
                  <span className="win-particle" style={{ '--x': '68px', '--y': '-18px' }} />
                </div>
              </div>
            )}

            <section ref={supportFocusRef} tabIndex={-1} className={`premium-surface overflow-hidden rounded-[1.6rem] border p-4 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-fuchsia-300/60 ${
              darkMode
                ? 'border-fuchsia-400/35 bg-gradient-to-br from-fuchsia-950/35 via-slate-950/94 to-slate-950/90 shadow-2xl shadow-fuchsia-950/20'
                : 'border-fuchsia-200 bg-gradient-to-br from-white via-fuchsia-50/55 to-slate-50 shadow-sm'
            }`}>
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
                    darkMode ? 'border-fuchsia-300/30 bg-fuchsia-400/10 text-fuchsia-200' : 'border-fuchsia-200 bg-fuchsia-100 text-fuchsia-700'
                  }`}>
                    <Clock className="h-4 w-4" />
                  </span>
                  <h2 className={`text-base font-black tracking-tight ${darkMode ? 'text-slate-50' : 'text-slate-900'}`}>
                    {translateText("Today's Partner Focus")}
                  </h2>
                </div>
                <ChevronRight className={`h-5 w-5 shrink-0 ${darkMode ? 'text-fuchsia-300' : 'text-fuchsia-600'}`} />
              </div>

              <div className="mb-3 flex items-center gap-3">
                <div className={`h-2 flex-1 overflow-hidden rounded-full ${darkMode ? 'bg-slate-800' : 'bg-fuchsia-100'}`}>
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-400"
                    style={{ width: `${supportTaskProgress}%` }}
                  />
                </div>
                <span className={`shrink-0 text-xs font-bold ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  {completedSupportTaskCount} {translateText('of')} {supportTasks.length} {translateText('completed')}
                </span>
              </div>

              <div className="space-y-1.5">
                {supportTasks.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className={`group flex min-h-10 w-full items-center gap-3 rounded-2xl border px-3 py-1.5 text-left transition-all ${
                      checklist[task.id]
                        ? darkMode
                          ? 'border-fuchsia-300/30 bg-white/[0.055] text-slate-100'
                          : 'border-fuchsia-200 bg-white text-slate-800 shadow-sm'
                        : darkMode
                          ? 'border-white/10 bg-slate-950/38 text-slate-400 hover:bg-white/[0.045]'
                          : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200 hover:bg-white hover:shadow-md'
                    } ${winCelebration?.taskId === task.id ? 'animate-win-pop ring-2 ring-emerald-300/60 shadow-lg shadow-emerald-400/15' : ''}`}
                  >
                    <div
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all ${
                        checklist[task.id]
                          ? 'border-fuchsia-400 bg-gradient-to-br from-violet-500 to-fuchsia-500'
                          : darkMode
                            ? 'border-slate-500 bg-slate-950 group-hover:border-fuchsia-300'
                            : 'border-slate-300 bg-white group-hover:border-fuchsia-400'
                      }`}
                    >
                      {checklist[task.id] && <Check className="h-3.5 w-3.5 text-white" />}
                    </div>
                    <span className={`text-sm font-bold transition-colors ${checklist[task.id] ? (darkMode ? 'text-slate-100' : 'text-slate-900') : ''}`}>{translateText(task.label)}</span>
                  </button>
                ))}
              </div>
              <p className={`mt-3 flex items-center gap-2 text-xs font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                <Sparkles className={`h-3.5 w-3.5 ${darkMode ? 'text-fuchsia-300' : 'text-fuchsia-600'}`} />
                {translateText('Small actions today, lasting impact tomorrow.')}
              </p>
            </section>
          </div>

          <div key={`stage-ai-tool-${activeStage}`}>
            {guideData[activeStage].aiTool}
          </div>

          <div className={`premium-surface rounded-[1.6rem] border p-4 transition-colors ${
            darkMode ? 'border-white/10 bg-slate-900/72 shadow-xl shadow-black/20' : 'border-slate-200 bg-white shadow-sm'
          }`}>
            <div className="mb-4 flex items-center gap-2">
              <Zap className={`h-4 w-4 ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`} />
              <h3 className={`text-sm font-black tracking-tight ${darkMode ? 'text-slate-50' : 'text-slate-900'}`}>
                {translateText('Quick Tools')}
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {quickToolCards.map((tool) => (
                <button
                  key={tool.label}
                  type="button"
                  onClick={tool.action}
                  className={`flex min-h-[4.7rem] flex-col items-center justify-center rounded-2xl border px-2 py-2.5 text-center transition focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300/60 ${
                    darkMode
                      ? 'border-white/10 bg-slate-950/45 text-slate-300 hover:border-fuchsia-300/40 hover:bg-slate-950/70'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-fuchsia-200 hover:bg-white'
                  }`}
                  title={translateText(tool.detail)}
                >
                  <span className={darkMode ? 'text-fuchsia-300' : 'text-fuchsia-600'}>{tool.icon}</span>
                  <span className="mt-2 text-[11px] font-black leading-tight">{translateText(tool.label)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="order-1 space-y-6 md:space-y-8 lg:order-2 lg:col-span-3">
          <div className={`premium-tab-rail flex gap-2 overflow-x-auto rounded-[1.55rem] border p-1.5 transition-colors [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-6 md:overflow-visible ${darkMode ? 'border-slate-800 bg-slate-900/92 shadow-xl' : 'border-slate-200 bg-white shadow-sm'}`}>
            {Object.entries(guideData).map(([key, data]) => (
              <button
                key={key}
                onClick={() => {
                  if (key === 'dashboard') {
                    navigateWithinApp('/partner-dashboard');
                    return;
                  }
                  setActiveStage(key);
                }}
                className={`flex min-w-[154px] flex-none flex-col items-center justify-center gap-2 rounded-[1.15rem] px-4 py-3 text-sm font-extrabold transition-all md:min-w-0 md:flex-1 md:py-4 ${
                  activeStage === key
                    ? 'scale-[1.01] bg-gradient-to-r from-blue-600 to-fuchsia-600 text-white shadow-xl shadow-indigo-950/15'
                    : darkMode
                      ? 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <div className={`rounded-xl p-2 transition-all ${activeStage === key ? 'bg-white/20' : darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                  {React.cloneElement(data.icon, { className: 'h-5 w-5' })}
                </div>
                <span>{translateText(data.title)}</span>
              </button>
            ))}
          </div>

          <div className="px-1 sm:px-2">
            <h2 className={`text-2xl font-black tracking-tight transition-colors sm:text-3xl ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              {translateText(guideData[activeStage].title)}
            </h2>
            <p className={`mt-2 max-w-2xl text-sm font-semibold leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{translateText(guideData[activeStage].description)}</p>
          </div>

          {isDashboardStage ? (
            <React.Suspense
              fallback={
                <div className={`rounded-2xl border p-8 text-center text-sm ${darkMode ? 'border-slate-800 bg-slate-900 text-slate-300' : 'border-slate-200 bg-white text-slate-600'}`}>
                  {translateText('Loading partner dashboard...')}
                </div>
              }
            >
              <PartnerDashboardModule
                embedded
                darkMode={darkMode}
                onExit={() => setActiveStage('prenatal')}
                translateText={translateText}
              />
            </React.Suspense>
          ) : isKeyTermsStage ? (
            <KeyTermsPanel darkMode={darkMode} translateText={translateText} />
          ) : (
            <>
              <div className="hidden">
                {activeStage === 'prenatal' && <PregnancyAnatomy darkMode={darkMode} translateText={translateText} />}
                {activeStage === 'labor' && <LaborDeliveryGuide darkMode={darkMode} translateText={translateText} />}
                {activeStage === 'postpartum' && <PostpartumRecoveryGuide darkMode={darkMode} translateText={translateText} />}
              </div>

              {currentGuideCard && (
                <div className={`space-y-4 rounded-[1.75rem] border p-4 shadow-xl md:p-6 ${darkMode ? 'border-slate-800 bg-slate-900/92' : 'border-slate-200 bg-white'}`}>
                  <div>
                    <div className={`flex items-center justify-between text-[11px] font-black uppercase tracking-[0.16em] ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                      <span>{translateText('Card')} {guideStep + 1}/{mobileGuideCards.length}</span>
                      <span>{guideStepPercent}%</span>
                    </div>
                    <div className={`mt-2 h-2 overflow-hidden rounded-full ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-fuchsia-500"
                        style={{ width: `${guideStepPercent}%` }}
                      />
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                      <div className={`rounded-xl p-2 shadow-sm ${currentGuideCard.color}`}>{currentGuideCard.icon}</div>
                      <h3 className={`text-lg font-black tracking-tight ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                        {translateText(currentGuideCard.heading)}
                      </h3>
                    </div>
                  </div>

                  <FlippableCard
                    key={currentGuideCard.id}
                    item={currentGuideCard.card}
                    icon={currentGuideCard.icon}
                    colorClass={currentGuideCard.color}
                    darkMode={darkMode}
                    translateText={translateText}
                  />

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setGuideStep((current) => Math.max(0, current - 1))}
                      disabled={guideStep === 0}
                      className={`inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-bold disabled:opacity-40 ${
                        darkMode ? 'border-slate-700 bg-slate-950 text-slate-200' : 'border-slate-300 bg-white text-slate-700'
                      }`}
                    >
                      <ChevronLeft className="h-4 w-4" /> {translateText('Back')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setGuideStep((current) => Math.min(mobileGuideCards.length - 1, current + 1))}
                      disabled={guideStep === mobileGuideCards.length - 1}
                      className={`inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-bold text-white disabled:opacity-40 ${
                        darkMode ? 'bg-gradient-to-r from-cyan-600 to-teal-500' : 'bg-gradient-to-r from-slate-900 to-slate-700'
                      }`}
                    >
                      {translateText('Next')} <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              <div className="hidden space-y-12">
                {guideData[activeStage].subsections.map((sub, sIndex) => (
                  <div key={sIndex} className="space-y-8">
                    <div className="flex items-center gap-4 px-2">
                      <div className={`rounded-xl p-2 shadow-sm ${sub.color}`}>{sub.icon}</div>
                      <h3 className={`text-xl font-black tracking-tight transition-colors ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                        {translateText(sub.heading)}
                      </h3>
                      <div className={`ml-4 h-px flex-1 transition-colors ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />
                    </div>
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                      {sub.cards.map((card, cIndex) => (
                        <FlippableCard key={cIndex} item={card} icon={sub.icon} colorClass={sub.color} darkMode={darkMode} translateText={translateText} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className={`premium-surface group relative overflow-hidden rounded-[1.75rem] border p-6 transition-colors sm:p-7 ${darkMode ? 'border-slate-800 bg-slate-900/92 shadow-xl' : 'border-slate-200 bg-white shadow-sm'}`}>
                <div className="absolute -right-32 -top-32 h-64 w-64 rounded-full bg-rose-500/5 blur-[100px]" />
                <div className="relative z-10">
                  <h3 className={`mb-3 text-xl font-black transition-colors sm:text-2xl ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    {translateText('Mastering')} {translateText(guideData[activeStage].title)}
                  </h3>
                  <p className={`mb-5 max-w-2xl text-sm font-medium leading-relaxed transition-colors sm:text-base ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    {translateText('Flip the cards above to see actionable tips for this stage. As a partner, your education is just as vital as hers to ensure a safe transition for the entire family.')}
                  </p>
                  <div className={`flex items-start gap-4 rounded-2xl border p-4 transition-colors ${darkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-100 bg-slate-50'}`}>
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border shadow-sm transition-colors ${darkMode ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'}`}>
                      <ShieldAlert className="h-6 w-6 text-rose-500" />
                    </div>
                    <div>
                      <h4 className={`mb-1 font-bold transition-colors ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>{translateText('Support Protocol')}</h4>
                      <p className="text-sm leading-relaxed text-slate-500">
                        {translateText('Every pregnancy and labor is unique. Use these guidelines as a baseline, but always defer to the specific instructions given by your medical team.')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      )}

      <footer className={`mx-auto mt-20 max-w-7xl pb-16 pt-10 text-center transition-colors ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
        <div className="flex flex-col items-center gap-4">
          <img
            src={dieudonneDarkLogo}
            alt="Dieudonne logo"
            className={`h-16 w-auto rounded-md border p-1 ${darkMode ? 'border-slate-700 bg-black' : 'border-slate-200 bg-black'}`}
          />
          <p className={`text-lg font-bold tracking-tight ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            © 2026 Dieudonne Foundation
          </p>
          <p className={`text-sm font-medium uppercase tracking-[0.16em] ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
            EQUIPPING EVERY MOTHER'S CHAMPION FOR THE JOURNEY AHEAD.
          </p>
          <p className={`text-xs uppercase tracking-wide ${darkMode ? 'text-slate-600' : 'text-slate-400'}`}>
            SITE BUILT BY CHERY TALENT MANAGEMENT AGENCY
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
