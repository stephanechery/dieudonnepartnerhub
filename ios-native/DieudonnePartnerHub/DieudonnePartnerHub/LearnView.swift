import SwiftUI

struct LearnView: View {
    let store: PartnerHubStore

    var body: some View {
        NavigationStack {
            HubScreen(
                title: "Learn",
                subtitle: "Native lesson paths with reflections, quiz feedback, and saved progress."
            ) {
                ForEach(store.modules) { module in
                    ModuleSection(store: store, module: module)
                }
            }
            .navigationDestination(for: Lesson.self) { lesson in
                LessonDetailView(store: store, lesson: lesson)
            }
        }
    }
}

private struct ModuleSection: View {
    let store: PartnerHubStore
    let module: LearningModule

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            VStack(alignment: .leading, spacing: 5) {
                Text(module.title)
                    .font(.title2.bold())
                    .foregroundStyle(.white)
                Text(module.subtitle)
                    .font(.subheadline)
                    .foregroundStyle(.white.opacity(0.62))
            }

            ForEach(module.lessons) { lesson in
                NavigationLink(value: lesson) {
                    LessonRow(store: store, lesson: lesson)
                }
                .buttonStyle(.plain)
            }
        }
    }
}

private struct LessonRow: View {
    let store: PartnerHubStore
    let lesson: Lesson

    var body: some View {
        HubCard {
            HStack(alignment: .top, spacing: 12) {
                Image(systemName: store.isLessonComplete(lesson) ? "checkmark.circle.fill" : "circle")
                    .font(.title2)
                    .foregroundStyle(store.isLessonComplete(lesson) ? .green : .white.opacity(0.4))

                VStack(alignment: .leading, spacing: 6) {
                    Text(lesson.title)
                        .font(.headline)
                        .foregroundStyle(.white)
                    Text(lesson.summary)
                        .font(.subheadline)
                        .foregroundStyle(.white.opacity(0.68))
                    Text("\(lesson.course?.sections.count ?? 0) sections, \(lesson.quiz.count) quiz questions")
                        .font(.caption.weight(.medium))
                        .foregroundStyle(.cyan)
                }

                Spacer()
                Image(systemName: "chevron.right")
                    .foregroundStyle(.white.opacity(0.36))
            }
        }
    }
}
