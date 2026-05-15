import Foundation
import Observation

@Observable
final class PartnerHubStore {
    let curriculum: CurriculumBundle
    let videoBundle: VideoBundle
    let guideBundle: GuideBundle

    private let stateKey = "dieudonne.partnerhub.native.state.v1"
    private var state = PersistedPartnerState()

    init() {
        curriculum = Self.load("curriculum", as: CurriculumBundle.self) ?? CurriculumBundle(modules: [])
        videoBundle = Self.load("videos", as: VideoBundle.self) ?? VideoBundle(categories: [], videos: [])
        guideBundle = Self.load("guides", as: GuideBundle.self) ?? GuideBundle(guides: [])
        loadState()
        if state.activeLessonId == nil {
            state.activeLessonId = firstIncompleteLesson?.id ?? curriculum.modules.first?.lessons.first?.id
            saveState()
        }
    }

    var modules: [LearningModule] { curriculum.modules }
    var videos: [PartnerVideo] { videoBundle.videos }
    var guides: [InteractiveGuide] { guideBundle.guides }
    var categories: [String] { ["All"] + videoBundle.categories }
    var completedLessonIds: Set<String> { state.completedLessonIds }
    var adminUnlocked: Bool { state.adminUnlocked }

    var totalLessons: Int {
        modules.reduce(0) { $0 + $1.lessons.count }
    }

    var completedCount: Int {
        state.completedLessonIds.count
    }

    var completionRatio: Double {
        guard totalLessons > 0 else { return 0 }
        return Double(completedCount) / Double(totalLessons)
    }

    var activeLesson: Lesson? {
        guard let activeLessonId = state.activeLessonId else { return firstIncompleteLesson }
        return lesson(id: activeLessonId) ?? firstIncompleteLesson
    }

    var firstIncompleteLesson: Lesson? {
        modules.flatMap(\.lessons).first { !state.completedLessonIds.contains($0.id) }
    }

    var recentSignals: [ActivitySignal] {
        [
            ActivitySignal(
                title: "Lessons finished",
                value: "\(completedCount)/\(totalLessons)",
                detail: "Native progress stored on this iPhone",
                systemImage: "checkmark.seal.fill",
                tint: .green
            ),
            ActivitySignal(
                title: "Saved videos",
                value: "\(state.savedVideoIds.count)",
                detail: "\(state.watchLaterVideoIds.count) marked watch later",
                systemImage: "play.rectangle.on.rectangle.fill",
                tint: .cyan
            ),
            ActivitySignal(
                title: "Guide opens",
                value: "\(state.guideOpenCounts.values.reduce(0, +))",
                detail: "Most used: \(mostUsedGuide?.title ?? "None yet")",
                systemImage: "book.pages.fill",
                tint: .purple
            )
        ]
    }

    var improvementInsights: [String] {
        var insights: [String] = []
        if let dropOff = commonDropOffLesson {
            insights.append("Add a shorter recap before \(dropOff.title), it is the next lesson after current completions.")
        }
        if state.watchLaterVideoIds.count > state.savedVideoIds.count {
            insights.append("Watch later is stronger than saves. Add a weekly video reminder in the iOS app.")
        }
        if state.guideOpenCounts.isEmpty {
            insights.append("Promote one interactive guide on Today until guide opens start coming in.")
        }
        if insights.isEmpty {
            insights.append("Progress is moving. Review quiz misses next and tighten the lesson examples that caused them.")
        }
        return insights
    }

    var mostUsedGuide: InteractiveGuide? {
        guard let id = state.guideOpenCounts.max(by: { $0.value < $1.value })?.key else { return nil }
        return guides.first { $0.id == id }
    }

    var commonDropOffLesson: Lesson? {
        let lessons = modules.flatMap(\.lessons)
        guard let active = activeLesson else { return lessons.first }
        return lessons.drop(while: { $0.id != active.id }).first
    }

    func lesson(id: String) -> Lesson? {
        modules.flatMap(\.lessons).first { $0.id == id }
    }

    func module(for lesson: Lesson) -> LearningModule? {
        modules.first { module in
            module.lessons.contains(where: { $0.id == lesson.id })
        }
    }

    func setActiveLesson(_ lesson: Lesson) {
        state.activeLessonId = lesson.id
        saveState()
    }

    func isLessonComplete(_ lesson: Lesson) -> Bool {
        state.completedLessonIds.contains(lesson.id)
    }

    func complete(_ lesson: Lesson) {
        state.completedLessonIds.insert(lesson.id)
        state.activeLessonId = firstIncompleteLesson?.id ?? lesson.id
        saveState()
    }

    func reflectionKey(lesson: Lesson, section: CourseSection) -> String {
        "\(lesson.id)::\(section.id)"
    }

    func reflection(for lesson: Lesson, section: CourseSection) -> String {
        state.reflectionDrafts[reflectionKey(lesson: lesson, section: section)] ?? ""
    }

    func updateReflection(_ text: String, lesson: Lesson, section: CourseSection) {
        state.reflectionDrafts[reflectionKey(lesson: lesson, section: section)] = text
        saveState()
    }

    func answer(for question: QuizQuestion, lesson: Lesson) -> Set<Int> {
        Set(state.quizAnswers[lesson.id]?[question.id] ?? [])
    }

    func updateAnswer(_ indexes: Set<Int>, question: QuizQuestion, lesson: Lesson) {
        var lessonAnswers = state.quizAnswers[lesson.id] ?? [:]
        lessonAnswers[question.id] = indexes.sorted()
        state.quizAnswers[lesson.id] = lessonAnswers
        saveState()
    }

    func score(for lesson: Lesson) -> Int? {
        guard !lesson.quiz.isEmpty else { return nil }
        let correct = lesson.quiz.filter { answer(for: $0, lesson: lesson) == $0.correctIndexes }.count
        return Int((Double(correct) / Double(lesson.quiz.count)) * 100)
    }

    func toggleSaved(_ video: PartnerVideo) {
        if state.savedVideoIds.contains(video.id) {
            state.savedVideoIds.remove(video.id)
        } else {
            state.savedVideoIds.insert(video.id)
        }
        saveState()
    }

    func toggleWatchLater(_ video: PartnerVideo) {
        if state.watchLaterVideoIds.contains(video.id) {
            state.watchLaterVideoIds.remove(video.id)
        } else {
            state.watchLaterVideoIds.insert(video.id)
        }
        saveState()
    }

    func isSaved(_ video: PartnerVideo) -> Bool {
        state.savedVideoIds.contains(video.id)
    }

    func isWatchLater(_ video: PartnerVideo) -> Bool {
        state.watchLaterVideoIds.contains(video.id)
    }

    func openGuide(_ guide: InteractiveGuide) {
        state.guideOpenCounts[guide.id, default: 0] += 1
        saveState()
    }

    func toggleSaved(_ guide: InteractiveGuide) {
        if state.savedGuideIds.contains(guide.id) {
            state.savedGuideIds.remove(guide.id)
        } else {
            state.savedGuideIds.insert(guide.id)
        }
        saveState()
    }

    func isSaved(_ guide: InteractiveGuide) -> Bool {
        state.savedGuideIds.contains(guide.id)
    }

    func unlockAdmin(with code: String) -> Bool {
        let normalized = code.trimmingCharacters(in: .whitespacesAndNewlines).lowercased()
        guard ["stephane", "dieudonne-admin", "admin"].contains(normalized) else { return false }
        state.adminUnlocked = true
        saveState()
        return true
    }

    private static func load<T: Decodable>(_ name: String, as type: T.Type) -> T? {
        guard let url = Bundle.main.url(forResource: name, withExtension: "json") else { return nil }
        do {
            let data = try Data(contentsOf: url)
            return try JSONDecoder().decode(T.self, from: data)
        } catch {
            assertionFailure("Could not load \(name).json: \(error)")
            return nil
        }
    }

    private func loadState() {
        guard let data = UserDefaults.standard.data(forKey: stateKey) else { return }
        state = (try? JSONDecoder().decode(PersistedPartnerState.self, from: data)) ?? PersistedPartnerState()
    }

    private func saveState() {
        guard let data = try? JSONEncoder().encode(state) else { return }
        UserDefaults.standard.set(data, forKey: stateKey)
    }
}
