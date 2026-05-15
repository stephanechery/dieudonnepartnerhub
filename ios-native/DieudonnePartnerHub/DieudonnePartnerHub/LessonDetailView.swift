import SwiftUI

struct LessonDetailView: View {
    let store: PartnerHubStore
    let lesson: Lesson
    @State private var selectedQuestionIndex = 0

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                HubCard {
                    Text(store.module(for: lesson)?.title ?? "Lesson")
                        .font(.caption.weight(.bold))
                        .textCase(.uppercase)
                        .foregroundStyle(.cyan)
                    Text(lesson.title)
                        .font(.title.bold())
                        .foregroundStyle(.white)
                    Text(lesson.summary)
                        .font(.subheadline)
                        .foregroundStyle(.white.opacity(0.72))
                }

                if let sections = lesson.course?.sections {
                    ForEach(sections) { section in
                        LessonSectionCard(store: store, lesson: lesson, section: section)
                    }
                }

                QuizPanel(store: store, lesson: lesson, selectedQuestionIndex: $selectedQuestionIndex)

                Button {
                    store.complete(lesson)
                } label: {
                    Label(store.isLessonComplete(lesson) ? "Lesson Complete" : "Mark Lesson Complete", systemImage: "checkmark.seal.fill")
                        .font(.headline)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 15)
                }
                .buttonStyle(.borderedProminent)
                .tint(.cyan)
                .disabled(store.isLessonComplete(lesson))
            }
            .padding(18)
        }
        .background(AppTheme.background.ignoresSafeArea())
        .navigationTitle("Lesson")
        .navigationBarTitleDisplayMode(.inline)
        .onAppear {
            store.setActiveLesson(lesson)
        }
    }
}

private struct LessonSectionCard: View {
    let store: PartnerHubStore
    let lesson: Lesson
    let section: CourseSection
    @State private var draft = ""

    var body: some View {
        HubCard {
            Text(section.phase)
                .font(.caption.weight(.bold))
                .textCase(.uppercase)
                .foregroundStyle(.yellow)
            Text(section.title)
                .font(.title3.bold())
                .foregroundStyle(.white)
            Text(section.summary)
                .font(.subheadline)
                .foregroundStyle(.white.opacity(0.74))

            if let teachingPoints = section.teachingPoints {
                VStack(alignment: .leading, spacing: 8) {
                    ForEach(teachingPoints, id: \.self) { point in
                        Label(point, systemImage: "checkmark.circle")
                            .font(.subheadline)
                            .foregroundStyle(.white.opacity(0.76))
                    }
                }
            }

            if let reflectionPrompt = section.reflectionPrompt {
                VStack(alignment: .leading, spacing: 10) {
                    Text("Reflection")
                        .font(.headline)
                        .foregroundStyle(.white)
                    Text(reflectionPrompt)
                        .font(.subheadline)
                        .foregroundStyle(.white.opacity(0.68))
                    TextEditor(text: $draft)
                        .scrollContentBackground(.hidden)
                        .frame(minHeight: 110)
                        .padding(10)
                        .background(AppTheme.inset, in: RoundedRectangle(cornerRadius: 16))
                        .foregroundStyle(.white)
                    Button {
                        store.updateReflection(draft, lesson: lesson, section: section)
                    } label: {
                        Label("Save Reflection", systemImage: "square.and.arrow.down.fill")
                            .font(.headline)
                            .frame(maxWidth: .infinity)
                    }
                    .buttonStyle(.borderedProminent)
                    .tint(.cyan)
                }
                .onAppear {
                    draft = store.reflection(for: lesson, section: section)
                }
            }

            if let quickCheck = section.quickCheck {
                QuickCheckView(quickCheck: quickCheck)
            }
        }
    }
}

private struct QuickCheckView: View {
    let quickCheck: QuickCheck
    @State private var selectedIndex: Int?

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("Quick check")
                .font(.headline)
                .foregroundStyle(.white)
            Text(quickCheck.question)
                .font(.subheadline.weight(.medium))
                .foregroundStyle(.white.opacity(0.8))
            ForEach(quickCheck.options.indices, id: \.self) { index in
                Button {
                    selectedIndex = index
                } label: {
                    HStack {
                        Image(systemName: selectedIndex == index ? "largecircle.fill.circle" : "circle")
                        Text(quickCheck.options[index])
                        Spacer()
                    }
                    .foregroundStyle(.white)
                    .padding(12)
                    .background(AppTheme.inset, in: RoundedRectangle(cornerRadius: 14))
                }
                .buttonStyle(.plain)
            }
            if let selectedIndex {
                let correct = quickCheck.correctIndexes.contains(selectedIndex)
                Text(correct ? "Correct. \(quickCheck.rationale)" : "Not quite. \(quickCheck.rationale)")
                    .font(.footnote.weight(.medium))
                    .foregroundStyle(correct ? .green : .orange)
            }
        }
    }
}

private struct QuizPanel: View {
    let store: PartnerHubStore
    let lesson: Lesson
    @Binding var selectedQuestionIndex: Int

    var body: some View {
        HubCard {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text("Quiz")
                        .font(.title3.bold())
                        .foregroundStyle(.white)
                    if let score = store.score(for: lesson) {
                        Text("Current score: \(score)%")
                            .font(.subheadline.weight(.semibold))
                            .foregroundStyle(score >= 80 ? .green : .orange)
                    }
                }
                Spacer()
                Text("\(selectedQuestionIndex + 1)/\(lesson.quiz.count)")
                    .font(.caption.weight(.bold))
                    .foregroundStyle(.cyan)
                    .padding(.horizontal, 10)
                    .padding(.vertical, 6)
                    .background(.cyan.opacity(0.12), in: Capsule())
            }

            if lesson.quiz.indices.contains(selectedQuestionIndex) {
                QuizQuestionCard(
                    store: store,
                    lesson: lesson,
                    question: lesson.quiz[selectedQuestionIndex]
                )
            }

            HStack {
                Button {
                    selectedQuestionIndex = max(0, selectedQuestionIndex - 1)
                } label: {
                    Label("Back", systemImage: "chevron.left")
                        .frame(maxWidth: .infinity)
                }
                .buttonStyle(.bordered)
                .disabled(selectedQuestionIndex == 0)

                Button {
                    selectedQuestionIndex = min(lesson.quiz.count - 1, selectedQuestionIndex + 1)
                } label: {
                    Label("Next", systemImage: "chevron.right")
                        .frame(maxWidth: .infinity)
                }
                .buttonStyle(.borderedProminent)
                .tint(.cyan)
                .disabled(selectedQuestionIndex >= lesson.quiz.count - 1)
            }
        }
    }
}

private struct QuizQuestionCard: View {
    let store: PartnerHubStore
    let lesson: Lesson
    let question: QuizQuestion

    var selected: Set<Int> {
        store.answer(for: question, lesson: lesson)
    }

    var hasAnswered: Bool {
        !selected.isEmpty
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text(question.question)
                .font(.headline)
                .foregroundStyle(.white)

            ForEach(question.options.indices, id: \.self) { index in
                Button {
                    var next = selected
                    if question.allowsMultipleAnswers {
                        if next.contains(index) {
                            next.remove(index)
                        } else {
                            next.insert(index)
                        }
                    } else {
                        next = [index]
                    }
                    store.updateAnswer(next, question: question, lesson: lesson)
                } label: {
                    HStack(spacing: 10) {
                        Image(systemName: selected.contains(index) ? "largecircle.fill.circle" : "circle")
                        Text(question.options[index])
                            .fixedSize(horizontal: false, vertical: true)
                        Spacer()
                        if hasAnswered && question.correctIndexes.contains(index) {
                            Image(systemName: "checkmark.circle.fill")
                                .foregroundStyle(.green)
                        } else if hasAnswered && selected.contains(index) {
                            Image(systemName: "xmark.circle.fill")
                                .foregroundStyle(.orange)
                        }
                    }
                    .font(.subheadline)
                    .foregroundStyle(.white)
                    .padding(13)
                    .background(optionBackground(index), in: RoundedRectangle(cornerRadius: 15))
                    .overlay(
                        RoundedRectangle(cornerRadius: 15)
                            .stroke(optionStroke(index), lineWidth: 1)
                    )
                }
                .buttonStyle(.plain)
            }

            if hasAnswered {
                let correct = selected == question.correctIndexes
                VStack(alignment: .leading, spacing: 6) {
                    Text(correct ? "Correct answer" : "Review this")
                        .font(.headline)
                        .foregroundStyle(correct ? .green : .orange)
                    Text(question.rationale)
                        .font(.subheadline)
                        .foregroundStyle(.white.opacity(0.72))
                }
                .padding(13)
                .background(AppTheme.inset, in: RoundedRectangle(cornerRadius: 15))
            }
        }
    }

    private func optionBackground(_ index: Int) -> Color {
        if hasAnswered && question.correctIndexes.contains(index) {
            return .green.opacity(0.16)
        }
        if hasAnswered && selected.contains(index) {
            return .orange.opacity(0.16)
        }
        return AppTheme.inset
    }

    private func optionStroke(_ index: Int) -> Color {
        if hasAnswered && question.correctIndexes.contains(index) {
            return .green.opacity(0.5)
        }
        if selected.contains(index) {
            return .cyan.opacity(0.5)
        }
        return .white.opacity(0.06)
    }
}
