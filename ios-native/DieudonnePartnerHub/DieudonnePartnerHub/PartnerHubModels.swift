import Foundation
import Observation

struct LessonQuestion: Identifiable, Hashable {
    let id: String
    let prompt: String
    let options: [String]
    let correctIndex: Int
    let teaching: String
}

struct Lesson: Identifiable, Hashable {
    let id: String
    let title: String
    let module: String
    let summary: String
    let teachingPoints: [String]
    let reflectionPrompt: String
    let questions: [LessonQuestion]
}

struct Guide: Identifiable, Hashable {
    let id: String
    let title: String
    let focus: String
    let steps: [String]
}

struct QuizResult: Identifiable {
    let id = UUID()
    let question: LessonQuestion
    let selectedIndex: Int

    var isCorrect: Bool {
        selectedIndex == question.correctIndex
    }
}

@Observable
final class PartnerHubStore {
    var selectedAnswers: [String: Int] = [:]
    var reflections: [String: String] = [:]
    var completedLessonIds: Set<String> = []
    var savedGuideIds: Set<String> = []

    let lessons: [Lesson] = PartnerHubFixtures.lessons
    let guides: [Guide] = PartnerHubFixtures.guides

    var completionPercent: Int {
        guard !lessons.isEmpty else { return 0 }
        return Int((Double(completedLessonIds.count) / Double(lessons.count)) * 100)
    }

    var nextLesson: Lesson? {
        lessons.first { !completedLessonIds.contains($0.id) } ?? lessons.first
    }

    func answer(_ question: LessonQuestion, with index: Int) {
        selectedAnswers[question.id] = index
    }

    func reflection(for lesson: Lesson) -> String {
        reflections[lesson.id, default: ""]
    }

    func saveReflection(_ text: String, for lesson: Lesson) {
        reflections[lesson.id] = text
    }

    func results(for lesson: Lesson) -> [QuizResult] {
        lesson.questions.compactMap { question in
            guard let selectedIndex = selectedAnswers[question.id] else { return nil }
            return QuizResult(question: question, selectedIndex: selectedIndex)
        }
    }

    func score(for lesson: Lesson) -> Int? {
        let lessonResults = results(for: lesson)
        guard lessonResults.count == lesson.questions.count else { return nil }
        let correct = lessonResults.filter(\.isCorrect).count
        return Int((Double(correct) / Double(lesson.questions.count)) * 100)
    }

    func canComplete(_ lesson: Lesson) -> Bool {
        let reflectionReady = reflection(for: lesson).trimmingCharacters(in: .whitespacesAndNewlines).count >= 20
        return score(for: lesson) != nil && reflectionReady
    }

    func markComplete(_ lesson: Lesson) {
        guard canComplete(lesson) else { return }
        completedLessonIds.insert(lesson.id)
    }

    func toggleGuide(_ guide: Guide) {
        if savedGuideIds.contains(guide.id) {
            savedGuideIds.remove(guide.id)
        } else {
            savedGuideIds.insert(guide.id)
        }
    }
}

enum PartnerHubFixtures {
    static let lessons: [Lesson] = [
        Lesson(
            id: "prenatal-foundations",
            title: "Prenatal Foundations",
            module: "Prenatal",
            summary: "Build a calm baseline for symptom support, comfort actions, and escalation signals.",
            teachingPoints: [
                "Validate discomfort before trying to solve it.",
                "Pair one comfort action with one watch point.",
                "Urgent symptoms need prompt provider guidance."
            ],
            reflectionPrompt: "Write a short support plan for nausea, fatigue, and emotional sensitivity.",
            questions: [
                LessonQuestion(
                    id: "prenatal-foundations-q1",
                    prompt: "If she reports back pain and overwhelm, what should you do first?",
                    options: [
                        "Dismiss it as normal pregnancy",
                        "Validate, support comfort, and track the symptom pattern",
                        "Wait until the next appointment without action"
                    ],
                    correctIndex: 1,
                    teaching: "Validation and pattern tracking protect trust while helping you notice escalation."
                ),
                LessonQuestion(
                    id: "prenatal-foundations-q2",
                    prompt: "Which pairing requires urgent escalation in late pregnancy?",
                    options: [
                        "Mild evening fatigue and hunger",
                        "Severe headache with visual changes",
                        "Occasional hip soreness after walking"
                    ],
                    correctIndex: 1,
                    teaching: "Severe headache with visual changes can signal hypertensive complications."
                )
            ]
        ),
        Lesson(
            id: "labor-readiness",
            title: "Labor Readiness",
            module: "Labor and Delivery",
            summary: "Practice timing contractions, comfort support, and when to call the care team.",
            teachingPoints: [
                "Track contraction pattern changes without creating panic.",
                "Use short, grounded phrases during intense moments.",
                "Know the route, bag, documents, and provider contact path."
            ],
            reflectionPrompt: "Draft a plan for the first hour after contractions become regular.",
            questions: [
                LessonQuestion(
                    id: "labor-readiness-q1",
                    prompt: "Regular contractions before 37 weeks should be treated as:",
                    options: [
                        "Normal adaptation only",
                        "Clinical priority requiring immediate guidance",
                        "Hydration issue only"
                    ],
                    correctIndex: 1,
                    teaching: "Preterm labor patterns require urgent evaluation and possible intervention."
                ),
                LessonQuestion(
                    id: "labor-readiness-q2",
                    prompt: "What support is most useful during active labor?",
                    options: [
                        "Long explanations during contractions",
                        "Calm cues, comfort measures, and tracking changes",
                        "Leaving decisions for later"
                    ],
                    correctIndex: 1,
                    teaching: "Short cues and practical comfort keep attention on safety and coping."
                )
            ]
        ),
        Lesson(
            id: "postpartum-recovery",
            title: "Postpartum Recovery",
            module: "Postpartum",
            summary: "Learn what recovery support looks like in the first days home.",
            teachingPoints: [
                "Protect sleep and nourishment before adding visitors.",
                "Watch bleeding, mood, pain, and fever patterns.",
                "Support feeding without pressure or blame."
            ],
            reflectionPrompt: "Write a 24-hour home support plan after discharge.",
            questions: [
                LessonQuestion(
                    id: "postpartum-recovery-q1",
                    prompt: "Which sign needs prompt clinical guidance postpartum?",
                    options: [
                        "Heavy bleeding that soaks pads quickly",
                        "Mild soreness when moving",
                        "Feeling hungry after feeding"
                    ],
                    correctIndex: 0,
                    teaching: "Heavy bleeding can signal a serious postpartum complication."
                ),
                LessonQuestion(
                    id: "postpartum-recovery-q2",
                    prompt: "What is a strong partner action in early recovery?",
                    options: [
                        "Manage meals, rest windows, and visitor boundaries",
                        "Ask her to host everyone",
                        "Wait until she requests every task"
                    ],
                    correctIndex: 0,
                    teaching: "Proactive household support lowers recovery strain."
                )
            ]
        )
    ]

    static let guides: [Guide] = [
        Guide(
            id: "warning-signs",
            title: "Warning Signs",
            focus: "Know when symptoms move from watchful support to urgent care.",
            steps: [
                "Name the symptom clearly.",
                "Check timing, intensity, and paired symptoms.",
                "Call the care team or emergency services when red flags appear."
            ]
        ),
        Guide(
            id: "labor-bag",
            title: "Labor Bag and Route",
            focus: "Prepare practical details before labor intensity rises.",
            steps: [
                "Confirm the hospital, entrance, and parking plan.",
                "Pack documents, chargers, comfort items, and feeding supplies.",
                "Share the plan with one trusted backup person."
            ]
        ),
        Guide(
            id: "postpartum-home",
            title: "First Week Home",
            focus: "Reduce recovery strain with a simple household support rhythm.",
            steps: [
                "Anchor the day around meals, medication, feeding, and sleep.",
                "Limit visitors unless they bring real help.",
                "Track mood, bleeding, pain, fever, and provider follow-up."
            ]
        )
    ]
}
