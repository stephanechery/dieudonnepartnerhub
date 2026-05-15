import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getModuleState, isLessonComplete } from "../utils/progress";

const isMultiQuestion = (question) =>
  question.type === "multi" || Array.isArray(question.answerIndexes);

const buildFallbackCourseSections = (lesson) => [
  {
    id: "concept",
    phase: "Start",
    title: "Concept Explanation",
    summary: lesson.summary,
    teachingPoints: lesson.clinicalContent || [],
    appliedExamples: (lesson.definitions || []).map(
      (entry) => `${entry.term}: ${entry.definition}`
    ),
    quickCheck: lesson.quiz?.[0]
      ? {
          question: lesson.quiz[0].question,
          options: lesson.quiz[0].options,
          answerIndex: lesson.quiz[0].answerIndex,
          answerIndexes: lesson.quiz[0].answerIndexes,
          rationale: lesson.quiz[0].rationale,
        }
      : null,
  },
  {
    id: "application",
    phase: "Middle",
    title: "Applied Examples",
    summary:
      "Connect the clinical idea to what a partner should say, notice, and do in real time.",
    teachingPoints: lesson.culturalNotes || [],
    appliedExamples: lesson.scenario
      ? [lesson.scenario.prompt, lesson.scenario.guidance]
      : [],
    quickCheck: lesson.quiz?.[1]
      ? {
          question: lesson.quiz[1].question,
          options: lesson.quiz[1].options,
          answerIndex: lesson.quiz[1].answerIndex,
          answerIndexes: lesson.quiz[1].answerIndexes,
          rationale: lesson.quiz[1].rationale,
        }
      : null,
  },
  {
    id: "practice",
    phase: "End",
    title: "Reflection and Readiness",
    summary:
      "Write a short response plan before opening the quiz. This makes the learning usable outside the app.",
    teachingPoints: [
      "Name the concern clearly.",
      "Choose one immediate support action.",
      "Identify what would trigger provider contact or emergency care.",
    ],
    appliedExamples: lesson.scenario
      ? [lesson.scenario.guidance]
      : [],
    reflectionPrompt: lesson.scenario?.prompt,
    quickCheck: lesson.quiz?.[2]
      ? {
          question: lesson.quiz[2].question,
          options: lesson.quiz[2].options,
          answerIndex: lesson.quiz[2].answerIndex,
          answerIndexes: lesson.quiz[2].answerIndexes,
          rationale: lesson.quiz[2].rationale,
        }
      : null,
  },
];

const getCourseSections = (lesson) =>
  lesson.course?.sections?.length ? lesson.course.sections : buildFallbackCourseSections(lesson);

const getReflectionResponseKey = (lessonId, sectionId) =>
  `${lessonId}:${sectionId}:reflection`;

const getScenarioResponseKey = (lessonId) => `${lessonId}:scenario`;

const isReflectionResponseComplete = (value) => String(value || "").trim().length >= 20;

const buildReflectionResponses = (lesson, courseSections, moduleState) => {
  const storedResponses = moduleState.scenarioResponses || {};
  const nextResponses = {};
  const reflectionSections = courseSections.filter((section) => section.reflectionPrompt);

  reflectionSections.forEach((section, index) => {
    const responseKey = getReflectionResponseKey(lesson.id, section.id);
    const hasSectionResponse = Object.prototype.hasOwnProperty.call(
      storedResponses,
      responseKey
    );
    nextResponses[responseKey] = hasSectionResponse
      ? storedResponses[responseKey]
      : index === 0
        ? storedResponses[lesson.id] || ""
        : "";
  });

  const scenarioKey = getScenarioResponseKey(lesson.id);
  nextResponses[scenarioKey] = Object.prototype.hasOwnProperty.call(
    storedResponses,
    scenarioKey
  )
    ? storedResponses[scenarioKey]
    : storedResponses[lesson.id] || "";

  return nextResponses;
};

const buildCourseCheckState = (sections) =>
  sections.reduce((acc, section) => {
    if (section.quickCheck) {
      acc[section.id] = null;
    }
    return acc;
  }, {});

const isQuickCheckCorrect = (quickCheck, selectedIndex) => {
  if (selectedIndex == null) return false;
  if (Array.isArray(quickCheck?.answerIndexes)) {
    return quickCheck.answerIndexes.includes(selectedIndex);
  }
  return selectedIndex === quickCheck?.answerIndex;
};

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

      if (isMultiQuestion(question)) {
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

  const lessonIndex = module.lessons.findIndex((item) => item.id === lesson.id);
  const lessonNumber = lessonIndex + 1;
  const moduleProgressPercent = Math.round((lessonNumber / module.lessons.length) * 100);
  const courseSections = useMemo(() => getCourseSections(lesson), [lesson]);
  const reflectionSections = useMemo(
    () => courseSections.filter((section) => section.reflectionPrompt),
    [courseSections]
  );
  const [reflectionResponses, setReflectionResponses] = useState(() =>
    buildReflectionResponses(lesson, courseSections, moduleState)
  );
  const [answers, setAnswers] = useState(() => normalizeSavedAnswers(savedQuizResponses || {}));
  const [submitted, setSubmitted] = useState(Boolean(savedQuizResponses));
  const [score, setScore] = useState(moduleState.quizScores[lesson.id] ?? null);
  const [completeStatus, setCompleteStatus] = useState(
    isLessonComplete(moduleState, lesson.id)
  );
  const [lessonStep, setLessonStep] = useState(0);
  const [quizStep, setQuizStep] = useState(0);
  const [courseStep, setCourseStep] = useState(0);
  const mobileQuestion = lesson.quiz[quizStep];
  const quizSectionRef = useRef(null);
  const lastLessonIdRef = useRef(lesson.id);
  const [courseChecks, setCourseChecks] = useState(() =>
    buildCourseCheckState(courseSections)
  );
  const scenarioResponseKey = getScenarioResponseKey(lesson.id);
  const scenarioResponse = reflectionResponses[scenarioResponseKey] || "";
  const setResponseValue = (responseKey, value) => {
    setReflectionResponses((current) => ({
      ...current,
      [responseKey]: value,
    }));
  };
  const courseCheckTotal = courseSections.filter((section) => section.quickCheck).length;
  const courseCheckCorrectCount = courseSections.reduce((count, section) => {
    if (!section.quickCheck) return count;
    return (
      count +
      (isQuickCheckCorrect(section.quickCheck, courseChecks[section.id]) ? 1 : 0)
    );
  }, 0);
  const reflectionTotal = reflectionSections.length;
  const reflectionCompleteCount = reflectionSections.reduce((count, section) => {
    const responseKey = getReflectionResponseKey(lesson.id, section.id);
    return count + (isReflectionResponseComplete(reflectionResponses[responseKey]) ? 1 : 0);
  }, 0);
  const reflectionComplete =
    reflectionTotal === 0 || reflectionCompleteCount === reflectionTotal;
  const courseComplete =
    (courseCheckTotal === 0 || courseCheckCorrectCount === courseCheckTotal) &&
    reflectionComplete;
  const quizUnlocked = Boolean(savedQuizResponses || submitted || score !== null || courseComplete);
  const courseProgressPercent = Math.round(
    ((courseCheckCorrectCount + reflectionCompleteCount) /
      Math.max(1, courseCheckTotal + reflectionTotal)) *
      100
  );
  const lessonDeckSteps = [
    ...courseSections.map((section) => section.title),
    "Knowledge Quiz",
    "Finish Lesson",
  ];
  const currentLessonStepLabel = lessonDeckSteps[lessonStep] || lessonDeckSteps[0];
  const lessonStepPercent = Math.round(((lessonStep + 1) / lessonDeckSteps.length) * 100);

  useEffect(() => {
    const lessonChanged = lastLessonIdRef.current !== lesson.id;
    lastLessonIdRef.current = lesson.id;

    setAnswers(normalizeSavedAnswers(savedQuizResponses || {}));
    setSubmitted(Boolean(savedQuizResponses));
    setScore(moduleState.quizScores[lesson.id] ?? null);
    setCompleteStatus(isLessonComplete(moduleState, lesson.id));

    if (lessonChanged) {
      setReflectionResponses(buildReflectionResponses(lesson, getCourseSections(lesson), moduleState));
      setLessonStep(0);
      setQuizStep(0);
      setCourseStep(0);
      setCourseChecks(buildCourseCheckState(getCourseSections(lesson)));
    }
  }, [lesson.id, moduleState, savedQuizResponses]);

  const answeredAll = lesson.quiz.every((question) => {
    const value = answers[question.id];
    if (isMultiQuestion(question)) {
      return Array.isArray(value) && value.length > 0;
    }
    return Number.isInteger(value);
  });

  const answeredCount = lesson.quiz.reduce((count, question) => {
    const value = answers[question.id];
    if (isMultiQuestion(question)) {
      return count + (Array.isArray(value) && value.length > 0 ? 1 : 0);
    }
    return count + (Number.isInteger(value) ? 1 : 0);
  }, 0);

  const firstUnansweredIndex = lesson.quiz.findIndex((question) => {
    const value = answers[question.id];
    if (isMultiQuestion(question)) {
      return !Array.isArray(value) || value.length === 0;
    }
    return !Number.isInteger(value);
  });

  const mobileQuestionAnswered = mobileQuestion
    ? isMultiQuestion(mobileQuestion)
      ? Array.isArray(answers[mobileQuestion.id]) &&
        answers[mobileQuestion.id].length > 0
      : Number.isInteger(answers[mobileQuestion.id])
    : false;

  const canMarkComplete = useMemo(() => {
    if (completeStatus) return false;
    if (typeof score !== "number") return false;
    return score >= 70;
  }, [completeStatus, score]);

  const updateAnswer = (question, optionIndex, checked = true) => {
    if (isMultiQuestion(question)) {
      setAnswers((prev) => {
        const current = Array.isArray(prev[question.id]) ? prev[question.id] : [];
        const next = checked
          ? [...current, optionIndex]
          : current.filter((value) => value !== optionIndex);
        return {
          ...prev,
          [question.id]: Array.from(new Set(next)).sort((a, b) => a - b),
        };
      });
      return;
    }

    setAnswers((prev) => ({ ...prev, [question.id]: optionIndex }));
  };

  const submitQuiz = () => {
    if (!quizUnlocked) return;
    if (!answeredAll) return;
    const nextScore = onSubmitQuiz(answers);
    setScore(nextScore);
    setSubmitted(true);
    if (nextScore >= 70) {
      setCompleteStatus(true);
    }
  };

  const handleQuizSubmit = (event) => {
    event.preventDefault();
    submitQuiz();
  };

  const handleComplete = () => {
    const success = onCompleteLesson();
    if (success) {
      setCompleteStatus(true);
    }
  };

  const focusNextQuizStep = () => {
    if (firstUnansweredIndex >= 0) {
      setQuizStep(firstUnansweredIndex);
    }
    setLessonStep(4);
    quizSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const renderQuestionCard = (question, questionIndex, isMobile = false) => (
    <div
      key={question.id}
      className={`rounded-2xl border p-3 sm:p-4 ${
        darkMode ? "border-slate-800 bg-slate-800/70" : "border-slate-100 bg-slate-50"
      }`}
    >
      <p className={`mb-2 text-sm font-bold ${darkMode ? "text-slate-100" : "text-slate-900"}`}>
        {questionIndex + 1}. {tx(question.question)}
      </p>
      {isMultiQuestion(question) && (
        <p className={`mb-2 text-xs font-semibold ${darkMode ? "text-cyan-300" : "text-cyan-700"}`}>
          {tx("Select all that apply.")}
        </p>
      )}
      <div className="space-y-2">
        {question.options.map((option, optionIndex) => {
          const selected = isMultiQuestion(question)
            ? Array.isArray(answers[question.id]) &&
              answers[question.id].includes(optionIndex)
            : answers[question.id] === optionIndex;

          return (
            <label
              key={option}
              className={`flex ${isMobile ? "min-h-12 rounded-xl" : "min-h-11 rounded-lg"} items-start gap-3 px-3 py-3 text-sm leading-relaxed transition ${
                darkMode ? "text-slate-300 hover:bg-slate-700/50" : "text-slate-700 hover:bg-white"
              } ${
                selected
                  ? darkMode
                    ? "bg-cyan-900/30 ring-1 ring-cyan-700/60"
                    : "bg-cyan-50 ring-1 ring-cyan-300"
                  : ""
              }`}
            >
              {isMultiQuestion(question) ? (
                <input
                  type="checkbox"
                  name={`${question.id}-${optionIndex}`}
                  value={optionIndex}
                  checked={selected}
                  onChange={(event) =>
                    updateAnswer(question, optionIndex, event.target.checked)
                  }
                  className="mt-0.5 h-4 w-4 shrink-0"
                />
              ) : (
                <input
                  type="radio"
                  name={question.id}
                  value={optionIndex}
                  checked={selected}
                  onChange={() => updateAnswer(question, optionIndex)}
                  className="mt-0.5 h-4 w-4 shrink-0"
                />
              )}
              <span>{tx(option)}</span>
            </label>
          );
        })}
      </div>
      {submitted && (
        <p className={`mt-3 text-xs leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
          {tx(question.rationale)}
        </p>
      )}
    </div>
  );

  const renderCourseSection = (section, index, compact = false) => {
    const selectedAnswer = courseChecks[section.id];
    const quickCheckCorrect = section.quickCheck
      ? isQuickCheckCorrect(section.quickCheck, selectedAnswer)
      : true;
    const reflectionResponseKey = getReflectionResponseKey(lesson.id, section.id);
    const reflectionResponse = reflectionResponses[reflectionResponseKey] || "";
    const sectionReflectionComplete =
      !section.reflectionPrompt || isReflectionResponseComplete(reflectionResponse);
    const sectionComplete =
      (section.quickCheck || section.reflectionPrompt) &&
      quickCheckCorrect &&
      sectionReflectionComplete;

    return (
      <article
        key={section.id}
        className={`rounded-[1.6rem] border p-4 ${
          darkMode ? "border-slate-800 bg-slate-900/90" : "border-slate-200 bg-white"
        }`}
      >
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className={`text-[11px] font-black uppercase tracking-[0.18em] ${darkMode ? "text-cyan-300" : "text-cyan-700"}`}>
              {tx(section.phase || `Step ${index + 1}`)}
            </p>
            <h3 className={`mt-1 text-xl font-black ${darkMode ? "text-slate-100" : "text-slate-900"}`}>
              {tx(section.title)}
            </h3>
            <p className={`mt-2 max-w-3xl text-sm leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
              {tx(section.summary)}
            </p>
          </div>
          <span
            className={`w-fit rounded-full border px-3 py-1.5 text-xs font-bold ${
              sectionComplete
                ? darkMode
                  ? "border-emerald-900/60 bg-emerald-950/30 text-emerald-200"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700"
                : darkMode
                  ? "border-slate-700 bg-slate-800 text-slate-300"
                  : "border-slate-200 bg-slate-50 text-slate-600"
            }`}
          >
            {sectionComplete ? tx("Completed") : tx("In Progress")}
          </span>
        </div>

        <div className={`mt-4 grid grid-cols-1 gap-4 ${compact ? "" : "lg:grid-cols-2"}`}>
          <div className={`rounded-2xl border p-4 ${darkMode ? "border-slate-800 bg-slate-800/60" : "border-slate-100 bg-slate-50"}`}>
            <p className={`mb-3 text-xs font-black uppercase tracking-[0.16em] ${darkMode ? "text-slate-500" : "text-slate-500"}`}>
              {tx("Build Understanding")}
            </p>
            <div className="space-y-3">
              {(section.teachingPoints || []).map((point, pointIndex) => (
                <p
                  key={point}
                  className={`text-sm leading-relaxed ${darkMode ? "text-slate-300" : "text-slate-700"}`}
                >
                  <span className={`mr-2 font-black ${darkMode ? "text-cyan-300" : "text-cyan-700"}`}>
                    {pointIndex + 1}.
                  </span>
                  {tx(point)}
                </p>
              ))}
            </div>
          </div>

          <div className={`rounded-2xl border p-4 ${darkMode ? "border-blue-900/40 bg-blue-950/20" : "border-blue-100 bg-blue-50"}`}>
            <p className={`mb-3 text-xs font-black uppercase tracking-[0.16em] ${darkMode ? "text-blue-300" : "text-blue-700"}`}>
              {tx("Applied Examples")}
            </p>
            <div className="space-y-3">
              {(section.appliedExamples || []).map((example, exampleIndex) => (
                <p
                  key={example}
                  className={`text-sm leading-relaxed ${darkMode ? "text-slate-300" : "text-slate-700"}`}
                >
                  <span className={`mr-2 font-black ${darkMode ? "text-blue-300" : "text-blue-700"}`}>
                    {exampleIndex + 1}.
                  </span>
                  {tx(example)}
                </p>
              ))}
            </div>
          </div>
        </div>

        {section.reflectionPrompt && (
          <div className={`mt-4 rounded-2xl border p-4 ${darkMode ? "border-amber-900/50 bg-amber-950/20" : "border-amber-100 bg-amber-50"}`}>
            <p className={`text-xs font-black uppercase tracking-[0.16em] ${darkMode ? "text-amber-300" : "text-amber-700"}`}>
              {tx("Reflection")}
            </p>
            <p className={`mt-2 text-sm font-semibold leading-relaxed ${darkMode ? "text-amber-100" : "text-amber-900"}`}>
              {tx(section.reflectionPrompt)}
            </p>
            <textarea
              className={`mt-3 min-h-28 w-full rounded-xl border px-4 py-3 text-base ${darkMode ? "border-slate-700 bg-slate-900 text-slate-100 placeholder:text-slate-500" : "border-slate-300 bg-white text-slate-900"}`}
              placeholder={tx("Write your response plan...")}
              value={reflectionResponse}
              onChange={(event) =>
                setResponseValue(reflectionResponseKey, event.target.value)
              }
            />
            <button
              type="button"
              onClick={() => onSaveScenario(reflectionResponse, reflectionResponseKey)}
              className={`mt-3 min-h-11 rounded-lg border px-4 py-3 text-sm font-bold ${darkMode ? "border-slate-700 bg-slate-950 text-slate-200 hover:bg-slate-800" : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"}`}
            >
              {tx("Save Reflection")}
            </button>
            {!sectionReflectionComplete && (
              <p className={`mt-2 text-xs ${darkMode ? "text-amber-200" : "text-amber-800"}`}>
                {tx("Write at least 20 characters to unlock the quiz.")}
              </p>
            )}
          </div>
        )}

        {section.quickCheck && (
          <div className={`mt-4 rounded-2xl border p-4 ${darkMode ? "border-slate-800 bg-slate-800/60" : "border-slate-100 bg-slate-50"}`}>
            <p className={`text-xs font-black uppercase tracking-[0.16em] ${darkMode ? "text-emerald-300" : "text-emerald-700"}`}>
              {tx("Quick Knowledge Check")}
            </p>
            <p className={`mt-2 text-sm font-bold ${darkMode ? "text-slate-100" : "text-slate-900"}`}>
              {tx(section.quickCheck.question)}
            </p>
            <div className="mt-3 grid grid-cols-1 gap-2 lg:grid-cols-3">
              {section.quickCheck.options.map((option, optionIndex) => {
                const selected = selectedAnswer === optionIndex;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() =>
                      setCourseChecks((prev) => ({
                        ...prev,
                        [section.id]: optionIndex,
                      }))
                    }
                    className={`min-h-11 rounded-xl border px-3 py-3 text-left text-sm font-semibold transition ${
                      selected
                        ? quickCheckCorrect
                          ? darkMode
                            ? "border-emerald-700 bg-emerald-950/40 text-emerald-100"
                            : "border-emerald-300 bg-emerald-50 text-emerald-800"
                          : darkMode
                            ? "border-amber-700 bg-amber-950/40 text-amber-100"
                            : "border-amber-300 bg-amber-50 text-amber-800"
                        : darkMode
                          ? "border-slate-700 bg-slate-900 text-slate-300 hover:border-cyan-700"
                          : "border-slate-200 bg-white text-slate-700 hover:border-cyan-300"
                    }`}
                  >
                    {tx(option)}
                  </button>
                );
              })}
            </div>
            {selectedAnswer !== null && (
              <p className={`mt-3 text-sm leading-relaxed ${quickCheckCorrect ? (darkMode ? "text-emerald-200" : "text-emerald-700") : (darkMode ? "text-amber-200" : "text-amber-800")}`}>
                {quickCheckCorrect ? tx("Correct.") : tx("Review this section and try again.")}{" "}
                {tx(section.quickCheck.rationale)}
              </p>
            )}
          </div>
        )}
      </article>
    );
  };

  const renderMobileQuizPanel = () => (
    <form className="space-y-3" onSubmit={handleQuizSubmit}>
      {savedQuizResponses && (
        <p className={`rounded-xl border px-3 py-2 text-xs font-semibold ${darkMode ? "border-cyan-900/60 bg-cyan-950/30 text-cyan-200" : "border-cyan-200 bg-cyan-50 text-cyan-800"}`}>
          {tx("Saved responses loaded. You can review or edit before resubmitting.")}
        </p>
      )}
      <div className={`flex items-center justify-between rounded-2xl border px-3 py-2 ${darkMode ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-slate-50"}`}>
        <div>
          <p className={`text-[11px] font-black uppercase tracking-[0.16em] ${darkMode ? "text-slate-500" : "text-slate-500"}`}>
            {tx("Quiz Progress")}
          </p>
          <p className={`text-sm font-bold ${darkMode ? "text-slate-100" : "text-slate-900"}`}>
            {tx("Question")} {quizStep + 1}/{lesson.quiz.length}
          </p>
          <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
            {answeredCount}/{lesson.quiz.length} {tx("answered")}
          </p>
        </div>
        <div className={`text-xs font-bold ${mobileQuestionAnswered ? (darkMode ? "text-emerald-300" : "text-emerald-700") : (darkMode ? "text-slate-400" : "text-slate-500")}`}>
          {mobileQuestionAnswered ? tx("Answered") : tx("In Progress")}
        </div>
      </div>

      {mobileQuestion && renderQuestionCard(mobileQuestion, quizStep, true)}

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setQuizStep((current) => Math.max(0, current - 1))}
          disabled={quizStep === 0}
          className={`inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-bold disabled:opacity-40 ${
            darkMode ? "border-slate-700 bg-slate-900 text-slate-200" : "border-slate-300 bg-white text-slate-700"
          }`}
        >
          <ChevronLeft className="h-4 w-4" /> {tx("Back")}
        </button>
        <button
          type="button"
          onClick={() =>
            setQuizStep((current) =>
              Math.min(lesson.quiz.length - 1, current + 1)
            )
          }
          disabled={quizStep === lesson.quiz.length - 1}
          className={`inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-bold disabled:opacity-40 ${
            darkMode ? "border-slate-700 bg-slate-900 text-slate-200" : "border-slate-300 bg-white text-slate-700"
          }`}
        >
          {tx("Next")} <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <button
          type="submit"
          className={`min-h-12 w-full rounded-xl px-4 py-3 text-sm font-bold text-white disabled:opacity-40 ${darkMode ? "bg-slate-700 hover:bg-slate-600" : "bg-slate-900 hover:bg-slate-800"}`}
          disabled={!answeredAll}
        >
          {tx("Submit Quiz")}
        </button>
        {typeof score === "number" && (
          <p
            className={`rounded-full px-3 py-2 text-center text-xs font-bold ${
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
  );

  const renderMobileLessonStep = () => {
    if (lessonStep < courseSections.length) {
      return renderCourseSection(courseSections[lessonStep], lessonStep, true);
    }

    if (lessonStep === courseSections.length) {
      if (!quizUnlocked) {
        return (
          <div className={`rounded-2xl border p-4 ${darkMode ? "border-amber-900/50 bg-amber-950/20 text-amber-100" : "border-amber-100 bg-amber-50 text-amber-900"}`}>
            <p className="text-sm font-bold">{tx("Quiz locked until course work is complete.")}</p>
            <p className="mt-2 text-sm leading-relaxed">
              {tx("Complete the quick checks and reflection first.")}
            </p>
          </div>
        );
      }
      return renderMobileQuizPanel();
    }

    if (lessonStep > courseSections.length) {
      return (
        <div className="space-y-3">
          <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
            {tx("Requires quiz score of at least 70% to unlock structured progression.")}
          </p>
          <button
            type="button"
            onClick={handleComplete}
            disabled={!canMarkComplete}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <CheckCircle2 className="h-4 w-4" /> {tx("Mark Lesson Complete")}
          </button>
          {completeStatus && (
            <p className={`rounded-xl border px-3 py-2 text-sm ${darkMode ? "border-emerald-900/60 bg-emerald-950/30 text-emerald-200" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
              {tx("Lesson completed and progress saved.")}
            </p>
          )}
          {!completeStatus && score !== null && score < 70 && (
            <p className={`rounded-xl border px-3 py-2 text-sm ${darkMode ? "border-amber-900/60 bg-amber-950/30 text-amber-200" : "border-amber-200 bg-amber-50 text-amber-700"}`}>
              <span className="inline-flex items-center gap-2 font-bold">
                <AlertTriangle className="h-4 w-4" /> {tx("Retake quiz to reach 70% and unlock progression.")}
              </span>
            </p>
          )}
        </div>
      );
    }

    if (lessonStep === 0) {
      return (
        <div className="space-y-3">
          {lesson.clinicalContent.map((line, index) => (
            <div
              key={line}
              className={`rounded-2xl border p-3 ${darkMode ? "border-slate-800 bg-slate-800/60" : "border-slate-100 bg-slate-50"}`}
            >
              <p className={`mb-1 text-[11px] font-black uppercase tracking-[0.16em] ${darkMode ? "text-cyan-300" : "text-cyan-700"}`}>
                {tx("Key Point")} {index + 1}
              </p>
              <p className={`text-sm leading-relaxed ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                {tx(line)}
              </p>
            </div>
          ))}
        </div>
      );
    }

    if (lessonStep === 1) {
      return (
        <ul className="space-y-2">
          {lesson.definitions.map((entry) => (
            <li key={entry.term} className={`rounded-xl border p-3 ${darkMode ? "border-slate-800 bg-slate-800/70" : "border-slate-100 bg-slate-50"}`}>
              <p className={`text-sm font-bold ${darkMode ? "text-slate-100" : "text-slate-900"}`}>{tx(entry.term)}</p>
              <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>{tx(entry.definition)}</p>
            </li>
          ))}
        </ul>
      );
    }

    if (lessonStep === 2) {
      return (
        <ul className="space-y-2">
          {lesson.culturalNotes.map((note, index) => (
            <li
              key={note}
              className={`rounded-xl border p-3 text-sm ${darkMode ? "border-amber-900/50 bg-amber-950/30 text-amber-100" : "border-amber-100 bg-amber-50 text-amber-900"}`}
            >
              <span className="mr-2 font-black">{index + 1}.</span>
              {tx(note)}
            </li>
          ))}
        </ul>
      );
    }

    if (lessonStep === 3) {
      return (
        <div>
          <div className={`rounded-2xl border p-3 ${darkMode ? "border-slate-800 bg-slate-800/60" : "border-slate-100 bg-slate-50"}`}>
            <p className={`text-sm font-semibold leading-relaxed ${darkMode ? "text-slate-200" : "text-slate-800"}`}>
              {tx(lesson.scenario.prompt)}
            </p>
            <p className={`mt-2 text-sm leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
              {tx(lesson.scenario.guidance)}
            </p>
          </div>
          <textarea
            className={`mt-3 min-h-32 w-full rounded-xl border px-4 py-3 text-base ${darkMode ? "border-slate-700 bg-slate-800 text-slate-100 placeholder:text-slate-500" : "border-slate-300 bg-white text-slate-900"}`}
            placeholder={tx("Write your response plan...")}
            value={scenarioResponse}
            onChange={(event) => setResponseValue(scenarioResponseKey, event.target.value)}
          />
          <button
            type="button"
            onClick={() => onSaveScenario(scenarioResponse, scenarioResponseKey)}
            className={`mt-3 min-h-11 w-full rounded-lg border px-4 py-3 text-sm font-bold ${darkMode ? "border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800" : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"}`}
          >
            {tx("Save Scenario Response")}
          </button>
        </div>
      );
    }

    if (lessonStep === 4) {
      if (!quizUnlocked) {
        return (
          <div className={`rounded-2xl border p-4 ${darkMode ? "border-amber-900/50 bg-amber-950/20 text-amber-100" : "border-amber-100 bg-amber-50 text-amber-900"}`}>
            <p className="text-sm font-bold">{tx("Quiz locked until course work is complete.")}</p>
            <p className="mt-2 text-sm leading-relaxed">
              {tx("Complete the quick checks and reflection first.")}
            </p>
          </div>
        );
      }
      return renderMobileQuizPanel();
    }

    return (
      <div className="space-y-3">
        <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
          {tx("Requires quiz score of at least 70% to unlock structured progression.")}
        </p>
        <button
          type="button"
          onClick={handleComplete}
          disabled={!canMarkComplete}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          <CheckCircle2 className="h-4 w-4" /> {tx("Mark Lesson Complete")}
        </button>
        {completeStatus && (
          <p className={`rounded-xl border px-3 py-2 text-sm ${darkMode ? "border-emerald-900/60 bg-emerald-950/30 text-emerald-200" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
            {tx("Lesson completed and progress saved.")}
          </p>
        )}
        {!completeStatus && score !== null && score < 70 && (
          <p className={`rounded-xl border px-3 py-2 text-sm ${darkMode ? "border-amber-900/60 bg-amber-950/30 text-amber-200" : "border-amber-200 bg-amber-50 text-amber-700"}`}>
            <span className="inline-flex items-center gap-2 font-bold">
              <AlertTriangle className="h-4 w-4" /> {tx("Retake quiz to reach 70% and unlock progression.")}
            </span>
          </p>
        )}
      </div>
    );
  };

  const isMobileLearningStep = lessonStep < courseSections.length;
  const isMobileFinishStep = lessonStep >= courseSections.length + 1;
  const nextLessonStepLabel = lessonDeckSteps[Math.min(lessonStep + 1, lessonDeckSteps.length - 1)];
  const handleMobilePrimaryAction = () => {
    if (isMobileLearningStep) {
      setLessonStep((current) => Math.min(lessonDeckSteps.length - 1, current + 1));
      return;
    }

    if (isMobileFinishStep) {
      if (completeStatus) {
        onBackToModule();
        return;
      }
      if (canMarkComplete) {
        handleComplete();
        return;
      }
      setLessonStep(4);
      return;
    }

    if (answeredAll) {
      submitQuiz();
      return;
    }

    focusNextQuizStep();
  };

  return (
    <div className="space-y-5 pb-28 sm:space-y-6 sm:pb-0">
      <button
        type="button"
        onClick={onBackToModule}
        className={`inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold sm:min-h-0 sm:w-auto sm:justify-start sm:px-3 sm:py-2 ${
          darkMode
            ? "border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
            : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
        }`}
      >
        <ArrowLeft className="h-4 w-4" /> {tx("Back to Module")}
      </button>

      <section
        className={`rounded-[1.8rem] border p-4 sm:p-5 ${
          darkMode
            ? "border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 shadow-xl"
            : "border-slate-200 bg-gradient-to-br from-white to-slate-50 shadow-sm"
        }`}
      >
        <p className={`text-xs font-black uppercase tracking-[0.2em] ${darkMode ? "text-slate-500" : "text-slate-500"}`}>
          {tx(module.title)}
        </p>
        <h2 className={`mt-1 text-xl font-black sm:text-2xl ${darkMode ? "text-slate-100" : "text-slate-900"}`}>
          {tx(lesson.title)}
        </h2>
        <p className={`mt-2 text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
          {tx(lesson.summary)}
        </p>
        <div className="mt-4 space-y-2">
          <div className={`flex items-center justify-between text-xs font-bold uppercase tracking-wide ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            <span>
              {tx("Lesson")} {lessonNumber}/{module.lessons.length}
            </span>
            <span>{moduleProgressPercent}%</span>
          </div>
          <div className={`h-2 overflow-hidden rounded-full ${darkMode ? "bg-slate-800" : "bg-slate-200"}`}>
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400"
              style={{ width: `${moduleProgressPercent}%` }}
            />
          </div>
        </div>
      </section>

      <section
        ref={quizSectionRef}
        className={`rounded-[1.8rem] border p-4 shadow-xl sm:hidden ${
          darkMode ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"
        }`}
      >
        <div className="mb-4">
          <div className={`flex items-center justify-between text-[11px] font-black uppercase tracking-[0.16em] ${darkMode ? "text-slate-500" : "text-slate-500"}`}>
            <span>
              {tx("Step")} {lessonStep + 1}/{lessonDeckSteps.length}
            </span>
            <span>{lessonStepPercent}%</span>
          </div>
          <div className={`mt-2 h-2 overflow-hidden rounded-full ${darkMode ? "bg-slate-800" : "bg-slate-200"}`}>
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-fuchsia-500"
              style={{ width: `${lessonStepPercent}%` }}
            />
          </div>
          <h3 className={`mt-3 text-lg font-black ${darkMode ? "text-slate-100" : "text-slate-900"}`}>
            {tx(currentLessonStepLabel)}
          </h3>
        </div>

        {renderMobileLessonStep()}

        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setLessonStep((current) => Math.max(0, current - 1))}
            disabled={lessonStep === 0}
            className={`inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-bold disabled:opacity-40 ${
              darkMode ? "border-slate-700 bg-slate-950 text-slate-200" : "border-slate-300 bg-white text-slate-700"
            }`}
          >
            <ChevronLeft className="h-4 w-4" /> {tx("Back")}
          </button>
          <button
            type="button"
            onClick={() => setLessonStep((current) => Math.min(lessonDeckSteps.length - 1, current + 1))}
            disabled={lessonStep === lessonDeckSteps.length - 1}
            className={`inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-bold text-white disabled:opacity-40 ${
              darkMode ? "bg-gradient-to-r from-cyan-600 to-teal-500" : "bg-gradient-to-r from-slate-900 to-slate-700"
            }`}
          >
            {tx("Next")} <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      <section className={`hidden rounded-[1.8rem] border p-5 sm:block ${darkMode ? "border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 shadow-xl" : "border-slate-200 bg-gradient-to-br from-white to-slate-50 shadow-sm"}`}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className={`text-xs font-black uppercase tracking-[0.18em] ${darkMode ? "text-cyan-300" : "text-cyan-700"}`}>
              {tx("Structured Course")}
            </p>
            <h3 className={`mt-1 text-2xl font-black ${darkMode ? "text-slate-100" : "text-slate-900"}`}>
              {tx("Complete the learning path before the quiz")}
            </h3>
            <p className={`mt-2 max-w-3xl text-sm leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
              {tx("Move through concept explanation, applied examples, reflection, and quick checks. The knowledge quiz opens when the course work is complete.")}
            </p>
          </div>
          <div className={`min-w-[240px] rounded-2xl border p-4 ${darkMode ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"}`}>
            <div className={`flex items-center justify-between text-xs font-bold uppercase tracking-wide ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              <span>{tx("Course Progress")}</span>
              <span>{courseProgressPercent}%</span>
            </div>
            <div className={`mt-2 h-2 overflow-hidden rounded-full ${darkMode ? "bg-slate-800" : "bg-slate-200"}`}>
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-fuchsia-500"
                style={{ width: `${courseProgressPercent}%` }}
              />
            </div>
            <p className={`mt-3 text-xs leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
              {courseCheckCorrectCount}/{courseCheckTotal} {tx("checks complete")} · {reflectionCompleteCount}/{reflectionTotal} {tx("reflections saved")}
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {courseSections.map((section, index) => {
            const selected = courseStep === index;
            const sectionQuickCheckComplete = section.quickCheck
              ? isQuickCheckCorrect(section.quickCheck, courseChecks[section.id])
              : true;
            const responseKey = getReflectionResponseKey(lesson.id, section.id);
            const sectionReflectionComplete =
              !section.reflectionPrompt ||
              isReflectionResponseComplete(reflectionResponses[responseKey]);
            const complete =
              (section.quickCheck || section.reflectionPrompt) &&
              sectionQuickCheckComplete &&
              sectionReflectionComplete;
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => setCourseStep(index)}
                className={`min-h-11 rounded-xl border px-4 py-2 text-sm font-bold transition ${
                  selected
                    ? "border-transparent bg-gradient-to-r from-cyan-600 to-teal-500 text-white"
                    : complete
                      ? darkMode
                        ? "border-emerald-900/60 bg-emerald-950/30 text-emerald-200"
                        : "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : darkMode
                        ? "border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {tx(section.phase || `Step ${index + 1}`)} · {tx(section.title)}
              </button>
            );
          })}
        </div>

        <div className="mt-5">
          {renderCourseSection(courseSections[courseStep], courseStep)}
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setCourseStep((current) => Math.max(0, current - 1))}
            disabled={courseStep === 0}
            className={`inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-bold disabled:opacity-40 ${
              darkMode ? "border-slate-700 bg-slate-950 text-slate-200" : "border-slate-300 bg-white text-slate-700"
            }`}
          >
            <ChevronLeft className="h-4 w-4" /> {tx("Back")}
          </button>
          <button
            type="button"
            onClick={() =>
              setCourseStep((current) => Math.min(courseSections.length - 1, current + 1))
            }
            disabled={courseStep === courseSections.length - 1}
            className={`inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-bold text-white disabled:opacity-40 ${
              darkMode ? "bg-gradient-to-r from-cyan-600 to-teal-500" : "bg-gradient-to-r from-slate-900 to-slate-700"
            }`}
          >
            {tx("Next")} <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      <section className={`hidden rounded-[1.8rem] border p-4 sm:block sm:p-5 ${darkMode ? "border-slate-800 bg-slate-900 shadow-xl" : "border-slate-200 bg-white shadow-sm"}`}>
        <h3 className={`mb-2 text-lg font-black ${darkMode ? "text-slate-100" : "text-slate-900"}`}>
          {tx("Clinical Learning")}
        </h3>
        <div className="space-y-3">
          {lesson.clinicalContent.map((line, index) => (
            <div
              key={line}
              className={`rounded-2xl border p-3 sm:p-4 ${darkMode ? "border-slate-800 bg-slate-800/60" : "border-slate-100 bg-slate-50"}`}
            >
              <p className={`mb-1 text-[11px] font-black uppercase tracking-[0.16em] ${darkMode ? "text-cyan-300" : "text-cyan-700"}`}>
                {tx("Key Point")} {index + 1}
              </p>
              <p className={`text-sm leading-relaxed ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                {tx(line)}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="hidden grid-cols-1 gap-4 sm:grid lg:grid-cols-2">
        <article className={`rounded-[1.6rem] border p-4 sm:p-5 ${darkMode ? "border-slate-800 bg-slate-900 shadow-xl" : "border-slate-200 bg-white shadow-sm"}`}>
          <h3 className={`mb-2 text-lg font-black ${darkMode ? "text-slate-100" : "text-slate-900"}`}>
            {tx("Medical Terms")}
          </h3>
          <ul className="space-y-2">
            {lesson.definitions.map((entry) => (
              <li key={entry.term} className={`rounded-xl border p-3 ${darkMode ? "border-slate-800 bg-slate-800/70" : "border-slate-100 bg-slate-50"}`}>
                <p className={`text-sm font-bold ${darkMode ? "text-slate-100" : "text-slate-900"}`}>{tx(entry.term)}</p>
                <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>{tx(entry.definition)}</p>
              </li>
            ))}
          </ul>
        </article>

        <article className={`rounded-[1.6rem] border p-4 sm:p-5 ${darkMode ? "border-slate-800 bg-slate-900 shadow-xl" : "border-slate-200 bg-white shadow-sm"}`}>
          <h3 className={`mb-2 text-lg font-black ${darkMode ? "text-slate-100" : "text-slate-900"}`}>
            {tx("Cultural Sensitivity Notes")}
          </h3>
          <ul className="space-y-2">
            {lesson.culturalNotes.map((note, index) => (
              <li
                key={note}
                className={`rounded-xl border p-3 text-sm ${darkMode ? "border-amber-900/50 bg-amber-950/30 text-amber-100" : "border-amber-100 bg-amber-50 text-amber-900"}`}
              >
                <span className="mr-2 font-black">{index + 1}.</span>
                {tx(note)}
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className={`hidden rounded-[1.8rem] border p-4 sm:block sm:p-5 ${darkMode ? "border-slate-800 bg-slate-900 shadow-xl" : "border-slate-200 bg-white shadow-sm"}`}>
        <h3 className={`mb-1 text-lg font-black ${darkMode ? "text-slate-100" : "text-slate-900"}`}>
          {tx("Scenario Exercise")}
        </h3>
        <div className={`rounded-2xl border p-3 ${darkMode ? "border-slate-800 bg-slate-800/60" : "border-slate-100 bg-slate-50"}`}>
          <p className={`text-sm font-semibold leading-relaxed ${darkMode ? "text-slate-200" : "text-slate-800"}`}>
            {tx(lesson.scenario.prompt)}
          </p>
          <p className={`mt-2 text-sm leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
            {tx(lesson.scenario.guidance)}
          </p>
        </div>

        <textarea
          className={`mt-3 min-h-32 w-full rounded-xl border px-4 py-3 text-base ${darkMode ? "border-slate-700 bg-slate-800 text-slate-100 placeholder:text-slate-500" : "border-slate-300 bg-white text-slate-900"}`}
          placeholder={tx("Write your response plan...")}
          value={scenarioResponse}
          onChange={(event) => setResponseValue(scenarioResponseKey, event.target.value)}
        />
        <button
          type="button"
          onClick={() => onSaveScenario(scenarioResponse, scenarioResponseKey)}
          className={`mt-3 min-h-11 w-full rounded-lg border px-4 py-3 text-sm font-bold sm:min-h-0 sm:w-auto sm:px-3 sm:py-2 sm:text-xs ${darkMode ? "border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800" : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"}`}
        >
          {tx("Save Scenario Response")}
        </button>
      </section>

      <section
        className={`hidden scroll-mt-4 rounded-[1.8rem] border p-4 sm:block sm:p-5 ${darkMode ? "border-slate-800 bg-slate-900 shadow-xl" : "border-slate-200 bg-white shadow-sm"}`}
      >
        <h3 className={`mb-3 text-lg font-black ${darkMode ? "text-slate-100" : "text-slate-900"}`}>
          {tx("Knowledge Quiz")}
        </h3>
        {!quizUnlocked ? (
          <div className={`rounded-2xl border p-4 ${darkMode ? "border-amber-900/50 bg-amber-950/20 text-amber-100" : "border-amber-100 bg-amber-50 text-amber-900"}`}>
            <p className="text-sm font-bold">{tx("Quiz locked until course work is complete.")}</p>
            <p className="mt-2 text-sm leading-relaxed">
              {tx("Complete each quick knowledge check and write a reflection response before opening the quiz.")}
            </p>
          </div>
        ) : (
          <>
        {savedQuizResponses && (
          <p className={`mb-3 rounded-xl border px-3 py-2 text-xs font-semibold ${darkMode ? "border-cyan-900/60 bg-cyan-950/30 text-cyan-200" : "border-cyan-200 bg-cyan-50 text-cyan-800"}`}>
            {tx("Saved responses loaded. You can review or edit before resubmitting.")}
          </p>
        )}

        <form className="space-y-4" onSubmit={handleQuizSubmit}>
          <div className="hidden space-y-4 sm:block">
            {lesson.quiz.map((question, questionIndex) =>
              renderQuestionCard(question, questionIndex)
            )}
          </div>

          <div className="space-y-3 sm:hidden">
            <div className={`flex items-center justify-between rounded-2xl border px-3 py-2 ${darkMode ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-slate-50"}`}>
              <div>
                <p className={`text-[11px] font-black uppercase tracking-[0.16em] ${darkMode ? "text-slate-500" : "text-slate-500"}`}>
                  {tx("Quiz Progress")}
                </p>
                <p className={`text-sm font-bold ${darkMode ? "text-slate-100" : "text-slate-900"}`}>
                  {tx("Question")} {quizStep + 1}/{lesson.quiz.length}
                </p>
                <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                  {answeredCount}/{lesson.quiz.length} {tx("answered")}
                </p>
              </div>
              <div className={`text-xs font-bold ${mobileQuestionAnswered ? (darkMode ? "text-emerald-300" : "text-emerald-700") : (darkMode ? "text-slate-400" : "text-slate-500")}`}>
                {mobileQuestionAnswered ? tx("Answered") : tx("In Progress")}
              </div>
            </div>

            {mobileQuestion && renderQuestionCard(mobileQuestion, quizStep, true)}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQuizStep((current) => Math.max(0, current - 1))}
                disabled={quizStep === 0}
                className={`inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-bold disabled:opacity-40 ${
                  darkMode ? "border-slate-700 bg-slate-900 text-slate-200" : "border-slate-300 bg-white text-slate-700"
                }`}
              >
                <ChevronLeft className="h-4 w-4" /> {tx("Back")}
              </button>
              <button
                type="button"
                onClick={() =>
                  setQuizStep((current) =>
                    Math.min(lesson.quiz.length - 1, current + 1)
                  )
                }
                disabled={quizStep === lesson.quiz.length - 1}
                className={`inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-bold disabled:opacity-40 ${
                  darkMode ? "border-slate-700 bg-slate-900 text-slate-200" : "border-slate-300 bg-white text-slate-700"
                }`}
              >
                {tx("Next")} <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <button
              type="submit"
              className={`min-h-12 w-full rounded-xl px-4 py-3 text-sm font-bold text-white disabled:opacity-40 sm:min-h-0 sm:w-auto sm:py-2 ${darkMode ? "bg-slate-700 hover:bg-slate-600" : "bg-slate-900 hover:bg-slate-800"}`}
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
          </>
        )}
      </section>

      <section className={`hidden rounded-[1.8rem] border p-4 sm:block sm:p-5 ${darkMode ? "border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 shadow-xl" : "border-slate-200 bg-gradient-to-br from-white to-slate-50 shadow-sm"}`}>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div>
            <h3 className={`text-lg font-black ${darkMode ? "text-slate-100" : "text-slate-900"}`}>
              {tx("Lesson Completion")}
            </h3>
            <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
              {tx("Requires quiz score of at least 70% to unlock structured progression.")}
            </p>
          </div>

          <button
            type="button"
            onClick={handleComplete}
            disabled={!canMarkComplete}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40 sm:min-h-0 sm:w-auto sm:justify-start sm:py-2"
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

      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t px-3 py-3 shadow-[0_-12px_30px_rgba(15,23,42,0.08)] backdrop-blur sm:hidden ${
          darkMode
            ? "border-slate-800 bg-slate-950/95"
            : "border-slate-200/80 bg-white/95"
        }`}
      >
        <div className="mx-auto flex max-w-md items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className={`text-[11px] font-black uppercase tracking-[0.16em] ${darkMode ? "text-slate-500" : "text-slate-500"}`}>
              {isMobileLearningStep
                ? tx("Continue Learning")
                : completeStatus
                ? tx("Lesson Complete")
                : canMarkComplete
                  ? tx("Ready to Finish")
                  : tx("Keep Progressing")}
            </p>
            <p className={`truncate text-sm font-bold ${darkMode ? "text-slate-100" : "text-slate-900"}`}>
              {isMobileLearningStep
                ? `${tx("Step")} ${lessonStep + 1}/${lessonDeckSteps.length}`
                : completeStatus
                ? tx("Progress saved")
                : typeof score === "number"
                  ? `${tx("Score:")} ${score}%`
                  : `${answeredCount}/${lesson.quiz.length} ${tx("answered")}`}
            </p>
            <p className={`truncate text-xs ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
              {isMobileLearningStep
                ? `${tx("Next")}: ${tx(nextLessonStepLabel)}`
                : completeStatus
                ? tx("Return anytime to review this lesson.")
                : canMarkComplete
                  ? tx("Mark complete to unlock structured progression.")
                  : answeredAll
                    ? tx("Ready to submit your quiz.")
                    : tx("Jump to the next unanswered question.")}
            </p>
          </div>
          {completeStatus ? (
            <button
              type="button"
              onClick={onBackToModule}
              className={`min-h-11 shrink-0 rounded-xl border px-4 py-3 text-sm font-bold ${
                darkMode
                  ? "border-slate-700 bg-slate-900 text-slate-200"
                  : "border-slate-300 bg-white text-slate-700"
              }`}
            >
              {tx("Back")}
            </button>
          ) : isMobileLearningStep ? (
            <button
              type="button"
              onClick={handleMobilePrimaryAction}
              className={`min-h-11 shrink-0 rounded-xl px-4 py-3 text-sm font-bold text-white ${
                darkMode ? "bg-gradient-to-r from-cyan-600 to-teal-500" : "bg-gradient-to-r from-slate-900 to-slate-700"
              }`}
            >
              {tx("Next")}
            </button>
          ) : canMarkComplete ? (
            <button
              type="button"
              onClick={handleMobilePrimaryAction}
              className="min-h-11 shrink-0 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white"
            >
              {tx("Complete")}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleMobilePrimaryAction}
              className={`min-h-11 shrink-0 rounded-xl px-4 py-3 text-sm font-bold text-white disabled:opacity-40 ${
                darkMode ? "bg-slate-700" : "bg-slate-900"
              }`}
            >
              {isMobileFinishStep
                ? tx("Take Quiz")
                : answeredAll
                  ? tx("Submit Quiz")
                  : tx("Next Question")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
