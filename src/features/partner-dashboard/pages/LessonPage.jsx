import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, AlertTriangle } from "lucide-react";
import { getModuleState } from "../utils/progress";

export default function LessonPage({
  module,
  lesson,
  profile,
  onBackToModule,
  onSaveScenario,
  onSubmitQuiz,
  onCompleteLesson,
  darkMode = false,
  translateText = (value) => value,
}) {
  const tx = (value) => translateText(value);
  const moduleState = getModuleState(profile, module.id);
  const savedQuizResponses = moduleState.quizResponses?.[lesson.id] || null;

  const normalizeSavedAnswers = (rawAnswers = {}) =>
    lesson.quiz.reduce((acc, question) => {
      const answerValue = rawAnswers[question.id];
      const isMulti = question.type === "multi" || Array.isArray(question.answerIndexes);

      if (isMulti) {
        if (Array.isArray(answerValue)) {
          acc[question.id] = Array.from(
            new Set(
              answerValue
                .map((value) => Number(value))
                .filter((value) => Number.isInteger(value) && value >= 0)
            )
          ).sort((a, b) => a - b);
        } else {
          acc[question.id] = [];
        }
        return acc;
      }

      const parsed = Number(answerValue);
      if (Number.isInteger(parsed)) {
        acc[question.id] = parsed;
      }
      return acc;
    }, {});

  const [scenarioResponse, setScenarioResponse] = useState(
    moduleState.scenarioResponses[lesson.id] || ""
  );
  const [answers, setAnswers] = useState(() => normalizeSavedAnswers(savedQuizResponses || {}));
  const [submitted, setSubmitted] = useState(Boolean(savedQuizResponses));
  const [score, setScore] = useState(moduleState.quizScores[lesson.id] ?? null);
  const [completeStatus, setCompleteStatus] = useState(
    moduleState.completedLessons.includes(lesson.id)
  );

  useEffect(() => {
    setAnswers(normalizeSavedAnswers(savedQuizResponses || {}));
    setSubmitted(Boolean(savedQuizResponses));
    setScore(moduleState.quizScores[lesson.id] ?? null);
    setCompleteStatus(moduleState.completedLessons.includes(lesson.id));
    setScenarioResponse(moduleState.scenarioResponses[lesson.id] || "");
  }, [lesson.id, moduleState, savedQuizResponses]);

  const answeredAll = lesson.quiz.every((question) => {
    const isMulti = question.type === "multi" || Array.isArray(question.answerIndexes);
    const value = answers[question.id];
    if (isMulti) {
      return Array.isArray(value) && value.length > 0;
    }
    return Number.isInteger(value);
  });

  const canMarkComplete = useMemo(() => {
    if (completeStatus) return false;
    if (typeof score !== "number") return false;
    return score >= 70;
  }, [completeStatus, score]);

  const handleQuizSubmit = (event) => {
    event.preventDefault();
    const nextScore = onSubmitQuiz(answers);
    setScore(nextScore);
    setSubmitted(true);
  };

  const handleComplete = () => {
    const success = onCompleteLesson();
    if (success) {
      setCompleteStatus(true);
    }
  };

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={onBackToModule}
        className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-bold ${
          darkMode ? "border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800" : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
        }`}
      >
        <ArrowLeft className="h-4 w-4" /> {tx("Back to Module")}
      </button>

      <section className={`rounded-[1.8rem] border p-5 ${darkMode ? "border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 shadow-xl" : "border-slate-200 bg-gradient-to-br from-white to-slate-50 shadow-sm"}`}>
        <p className={`text-xs font-black uppercase tracking-[0.2em] ${darkMode ? "text-slate-500" : "text-slate-500"}`}>{tx(module.title)}</p>
        <h2 className={`mt-1 text-2xl font-black ${darkMode ? "text-slate-100" : "text-slate-900"}`}>{tx(lesson.title)}</h2>
        <p className={`mt-2 text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>{tx(lesson.summary)}</p>
      </section>

      <section className={`rounded-[1.8rem] border p-5 ${darkMode ? "border-slate-800 bg-slate-900 shadow-xl" : "border-slate-200 bg-white shadow-sm"}`}>
        <h3 className={`mb-2 text-lg font-black ${darkMode ? "text-slate-100" : "text-slate-900"}`}>{tx("Clinical Learning")}</h3>
        <div className={`space-y-3 text-sm leading-relaxed ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
          {lesson.clinicalContent.map((line) => (
            <p key={line}>{tx(line)}</p>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <article className={`rounded-[1.6rem] border p-5 ${darkMode ? "border-slate-800 bg-slate-900 shadow-xl" : "border-slate-200 bg-white shadow-sm"}`}>
          <h3 className={`mb-2 text-lg font-black ${darkMode ? "text-slate-100" : "text-slate-900"}`}>{tx("Medical Terms")}</h3>
          <ul className="space-y-2">
            {lesson.definitions.map((entry) => (
              <li key={entry.term} className={`rounded-xl border p-3 ${darkMode ? "border-slate-800 bg-slate-800/70" : "border-slate-100 bg-slate-50"}`}>
                <p className={`text-sm font-bold ${darkMode ? "text-slate-100" : "text-slate-900"}`}>{tx(entry.term)}</p>
                <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>{tx(entry.definition)}</p>
              </li>
            ))}
          </ul>
        </article>

        <article className={`rounded-[1.6rem] border p-5 ${darkMode ? "border-slate-800 bg-slate-900 shadow-xl" : "border-slate-200 bg-white shadow-sm"}`}>
          <h3 className={`mb-2 text-lg font-black ${darkMode ? "text-slate-100" : "text-slate-900"}`}>{tx("Cultural Sensitivity Notes")}</h3>
          <ul className="space-y-2">
            {lesson.culturalNotes.map((note) => (
              <li key={note} className={`rounded-xl border p-3 text-sm ${darkMode ? "border-amber-900/50 bg-amber-950/30 text-amber-100" : "border-amber-100 bg-amber-50 text-amber-900"}`}>
                {tx(note)}
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className={`rounded-[1.8rem] border p-5 ${darkMode ? "border-slate-800 bg-slate-900 shadow-xl" : "border-slate-200 bg-white shadow-sm"}`}>
        <h3 className={`mb-1 text-lg font-black ${darkMode ? "text-slate-100" : "text-slate-900"}`}>{tx("Scenario Exercise")}</h3>
        <p className={`text-sm font-semibold ${darkMode ? "text-slate-200" : "text-slate-800"}`}>{tx(lesson.scenario.prompt)}</p>
        <p className={`mt-1 text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>{tx(lesson.scenario.guidance)}</p>

        <textarea
          className={`mt-3 min-h-28 w-full rounded-xl border px-3 py-2 text-sm ${darkMode ? "border-slate-700 bg-slate-800 text-slate-100 placeholder:text-slate-500" : "border-slate-300"}`}
          placeholder={tx("Write your response plan...")}
          value={scenarioResponse}
          onChange={(event) => setScenarioResponse(event.target.value)}
        />
        <button
          type="button"
          onClick={() => onSaveScenario(scenarioResponse)}
          className={`mt-2 rounded-lg border px-3 py-2 text-xs font-bold ${darkMode ? "border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800" : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"}`}
        >
          {tx("Save Scenario Response")}
        </button>
      </section>

      <section className={`rounded-[1.8rem] border p-5 ${darkMode ? "border-slate-800 bg-slate-900 shadow-xl" : "border-slate-200 bg-white shadow-sm"}`}>
        <h3 className={`mb-3 text-lg font-black ${darkMode ? "text-slate-100" : "text-slate-900"}`}>{tx("Knowledge Quiz")}</h3>
        {savedQuizResponses && (
          <p className={`mb-3 rounded-xl border px-3 py-2 text-xs font-semibold ${darkMode ? "border-cyan-900/60 bg-cyan-950/30 text-cyan-200" : "border-cyan-200 bg-cyan-50 text-cyan-800"}`}>
            {tx("Saved responses loaded. You can review or edit before resubmitting.")}
          </p>
        )}
        <form className="space-y-4" onSubmit={handleQuizSubmit}>
          {lesson.quiz.map((question, questionIndex) => (
            <div key={question.id} className={`rounded-2xl border p-3 ${darkMode ? "border-slate-800 bg-slate-800/70" : "border-slate-100 bg-slate-50"}`}>
              <p className={`mb-2 text-sm font-bold ${darkMode ? "text-slate-100" : "text-slate-900"}`}>
                {questionIndex + 1}. {tx(question.question)}
              </p>
              {(question.type === "multi" || Array.isArray(question.answerIndexes)) && (
                <p className={`mb-2 text-xs font-semibold ${darkMode ? "text-cyan-300" : "text-cyan-700"}`}>
                  {tx("Select all that apply.")}
                </p>
              )}
              <div className="space-y-2">
                {question.options.map((option, optionIndex) => (
                  <label
                    key={option}
                    className={`flex items-start gap-2 rounded-lg px-2 py-1 text-sm transition ${
                      darkMode ? "text-slate-300 hover:bg-slate-700/50" : "text-slate-700 hover:bg-white"
                    } ${
                      (question.type === "multi" || Array.isArray(question.answerIndexes))
                        ? (Array.isArray(answers[question.id]) && answers[question.id].includes(optionIndex)
                          ? darkMode
                            ? "bg-cyan-900/30 ring-1 ring-cyan-700/60"
                            : "bg-cyan-50 ring-1 ring-cyan-300"
                          : "")
                        : (answers[question.id] === optionIndex
                          ? darkMode
                            ? "bg-cyan-900/30 ring-1 ring-cyan-700/60"
                            : "bg-cyan-50 ring-1 ring-cyan-300"
                          : "")
                    }`}
                  >
                    {(question.type === "multi" || Array.isArray(question.answerIndexes)) ? (
                      <input
                        type="checkbox"
                        name={`${question.id}-${optionIndex}`}
                        value={optionIndex}
                        checked={Array.isArray(answers[question.id]) && answers[question.id].includes(optionIndex)}
                        onChange={(event) =>
                          setAnswers((prev) => {
                            const current = Array.isArray(prev[question.id]) ? prev[question.id] : [];
                            const next = event.target.checked
                              ? [...current, optionIndex]
                              : current.filter((value) => value !== optionIndex);
                            return {
                              ...prev,
                              [question.id]: Array.from(new Set(next)).sort((a, b) => a - b),
                            };
                          })
                        }
                      />
                    ) : (
                      <input
                        type="radio"
                        name={question.id}
                        value={optionIndex}
                        checked={answers[question.id] === optionIndex}
                        onChange={() =>
                          setAnswers((prev) => ({ ...prev, [question.id]: optionIndex }))
                        }
                      />
                    )}
                    <span>{tx(option)}</span>
                  </label>
                ))}
              </div>
              {submitted && (
                <p className={`mt-2 text-xs ${darkMode ? "text-slate-400" : "text-slate-600"}`}>{tx(question.rationale)}</p>
              )}
            </div>
          ))}

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              className={`rounded-xl px-4 py-2 text-sm font-bold text-white disabled:opacity-40 ${darkMode ? "bg-slate-700 hover:bg-slate-600" : "bg-slate-900 hover:bg-slate-800"}`}
              disabled={!answeredAll}
            >
              {tx("Submit Quiz")}
            </button>
            {typeof score === "number" && (
              <p
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  score >= 70
                    ? darkMode
                      ? "border border-emerald-900/60 bg-emerald-950/30 text-emerald-200"
                      : "border border-emerald-200 bg-emerald-50 text-emerald-700"
                    : darkMode
                      ? "border border-amber-900/60 bg-amber-950/30 text-amber-200"
                      : "border border-amber-200 bg-amber-50 text-amber-700"
                }`}
              >
                {tx("Score:")} {score}%
              </p>
            )}
          </div>
        </form>
      </section>

      <section className={`rounded-[1.8rem] border p-5 ${darkMode ? "border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 shadow-xl" : "border-slate-200 bg-gradient-to-br from-white to-slate-50 shadow-sm"}`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className={`text-lg font-black ${darkMode ? "text-slate-100" : "text-slate-900"}`}>{tx("Lesson Completion")}</h3>
            <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
              {tx("Requires quiz score of at least 70% to unlock structured progression.")}
            </p>
          </div>

          <button
            type="button"
            onClick={handleComplete}
            disabled={!canMarkComplete}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <CheckCircle2 className="h-4 w-4" /> {tx("Mark Lesson Complete")}
          </button>
        </div>

        {completeStatus && (
          <p className={`mt-3 rounded-xl border px-3 py-2 text-sm ${darkMode ? "border-emerald-900/60 bg-emerald-950/30 text-emerald-200" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
            {tx("Lesson completed and progress saved.")}
          </p>
        )}

        {!completeStatus && score !== null && score < 70 && (
          <p className={`mt-3 rounded-xl border px-3 py-2 text-sm ${darkMode ? "border-amber-900/60 bg-amber-950/30 text-amber-200" : "border-amber-200 bg-amber-50 text-amber-700"}`}>
            <span className="inline-flex items-center gap-2 font-bold">
              <AlertTriangle className="h-4 w-4" /> {tx("Retake quiz to reach 70% and unlock progression.")}
            </span>
          </p>
        )}
      </section>
    </div>
  );
}
