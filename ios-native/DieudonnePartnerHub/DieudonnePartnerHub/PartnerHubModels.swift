import Foundation
import SwiftUI

struct CurriculumBundle: Decodable {
    let modules: [LearningModule]
}

struct LearningModule: Decodable, Identifiable, Hashable {
    let id: String
    let title: String
    let subtitle: String
    let objective: String
    let lessons: [Lesson]
}

struct Lesson: Decodable, Identifiable, Hashable {
    let id: String
    let title: String
    let summary: String
    let course: Course?
    let clinicalContent: [String]?
    let definitions: [DefinitionItem]?
    let culturalNotes: [String]?
    let scenario: Scenario?
    let quiz: [QuizQuestion]
}

struct Course: Decodable, Hashable {
    let sections: [CourseSection]
}

struct CourseSection: Decodable, Identifiable, Hashable {
    let id: String
    let phase: String
    let title: String
    let summary: String
    let teachingPoints: [String]?
    let appliedExamples: [String]?
    let reflectionPrompt: String?
    let quickCheck: QuickCheck?
}

struct QuickCheck: Decodable, Hashable {
    let question: String
    let options: [String]
    let answerIndex: Int?
    let answerIndexes: [Int]?
    let rationale: String

    var correctIndexes: Set<Int> {
        Set(answerIndexes ?? answerIndex.map { [$0] } ?? [])
    }
}

struct DefinitionItem: Decodable, Hashable {
    let term: String
    let meaning: String

    private enum CodingKeys: String, CodingKey {
        case term
        case meaning
        case definition
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        term = try container.decode(String.self, forKey: .term)
        meaning = try container.decodeIfPresent(String.self, forKey: .meaning)
            ?? container.decodeIfPresent(String.self, forKey: .definition)
            ?? ""
    }
}

struct Scenario: Decodable, Hashable {
    let prompt: String
    let bestResponse: String?

    private enum CodingKeys: String, CodingKey {
        case prompt
        case bestResponse
        case guidance
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        prompt = try container.decode(String.self, forKey: .prompt)
        bestResponse = try container.decodeIfPresent(String.self, forKey: .bestResponse)
            ?? container.decodeIfPresent(String.self, forKey: .guidance)
    }
}

struct QuizQuestion: Decodable, Identifiable, Hashable {
    let id: String
    let question: String
    let options: [String]
    let answerIndex: Int?
    let answerIndexes: [Int]?
    let rationale: String
    let type: String?

    var correctIndexes: Set<Int> {
        Set(answerIndexes ?? answerIndex.map { [$0] } ?? [])
    }

    var allowsMultipleAnswers: Bool {
        type == "multi" || (answerIndexes?.count ?? 0) > 1
    }
}

struct VideoBundle: Decodable {
    let categories: [String]
    let videos: [PartnerVideo]
}

struct PartnerVideo: Decodable, Identifiable, Hashable {
    let id: String
    let title: String
    let category: String
    let source: String
    let description: String
    let duration: String
    let progress: Int?
    let sourceUrl: String
    let tags: [String]
    let videoId: String
    let thumbnail: String?
    let embedUrl: String?
}

struct GuideBundle: Decodable {
    let guides: [InteractiveGuide]
}

struct InteractiveGuide: Decodable, Identifiable, Hashable {
    let id: String
    let title: String
    let summary: String
    let phase: String
    let accent: String
    let detailSections: [GuideDetailSection]?

    var tint: Color {
        switch accent {
        case "cyan": .cyan
        case "emerald": .green
        case "rose": .pink
        case "amber": .yellow
        case "violet": .purple
        default: .teal
        }
    }
}

struct GuideDetailSection: Decodable, Identifiable, Hashable {
    let id: String
    let title: String
    let body: String?
    let bullets: [GuideBulletGroup]?
    let cards: [GuideDetailCard]?
}

struct GuideBulletGroup: Decodable, Identifiable, Hashable {
    var id: String { label }
    let label: String
    let items: [String]
}

struct GuideDetailCard: Decodable, Identifiable, Hashable {
    var id: String { "\(title)-\(body ?? "")" }
    let title: String
    let icon: String?
    let body: String?
    let bullets: [GuideBulletGroup]?
    let cards: [GuideDetailCard]?
}

struct PersistedPartnerState: Codable {
    var completedLessonIds: Set<String> = []
    var activeLessonId: String?
    var reflectionDrafts: [String: String] = [:]
    var quizAnswers: [String: [String: [Int]]] = [:]
    var savedVideoIds: Set<String> = []
    var watchLaterVideoIds: Set<String> = []
    var savedGuideIds: Set<String> = []
    var guideOpenCounts: [String: Int] = [:]
    var adminUnlocked: Bool = false
}

struct ActivitySignal: Identifiable {
    let id = UUID()
    let title: String
    let value: String
    let detail: String
    let systemImage: String
    let tint: Color
}
