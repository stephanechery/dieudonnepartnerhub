import SwiftUI

struct QuizView: View {
    @Environment(PartnerHubStore.self) private var store
    let lesson: Lesson

    var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            HStack {
                Text("Knowledge Check")
                    .font(.title3.bold())
                    .foregroundStyle(.white)
                Spacer()
                if let score = store.score(for: lesson) {
                    Text("\(score)%")
                        .font(.headline)
                        .foregroundStyle(score >= 70 ? .green : .orange)
                }
            }

            ForEach(lesson.questions) { question in
                QuestionCard(question: question)
            }

            if let score = store.score(for: lesson) {
                QuizSummaryView(lesson: lesson, score: score)
            }
        }
    }
}

struct QuestionCard: View {
    @Environment(PartnerHubStore.self) private var store
    let question: LessonQuestion

    private var selectedIndex: Int? {
        store.selectedAnswers[question.id]
    }

    private var answered: Bool {
        selectedIndex != nil
    }

    var body: some View {
        Panel {
            VStack(alignment: .leading, spacing: 12) {
                Text(question.prompt)
                    .font(.headline)
                    .foregroundStyle(.white)

                ForEach(question.options.indices, id: \.self) { index in
                    Button {
                        store.answer(question, with: index)
                    } label: {
                        HStack(alignment: .top, spacing: 10) {
                            Image(systemName: optionIcon(for: index))
                                .foregroundStyle(optionTint(for: index))
                            Text(question.options[index])
                                .foregroundStyle(.white.opacity(0.82))
                                .frame(maxWidth: .infinity, alignment: .leading)
                            if answered && index == question.correctIndex {
                                Text("Correct")
                                    .font(.caption.weight(.black))
                                    .foregroundStyle(.green)
                            } else if answered && index == selectedIndex && index != question.correctIndex {
                                Text("Your pick")
                                    .font(.caption.weight(.black))
                                    .foregroundStyle(.orange)
                            }
                        }
                        .padding(12)
                        .background(optionBackground(for: index))
                    }
                    .buttonStyle(.plain)
                }

                if answered {
                    FeedbackPanel(question: question, selectedIndex: selectedIndex)
                }
            }
        }
    }

    private func optionIcon(for index: Int) -> String {
        guard answered else { return selectedIndex == index ? "largecircle.fill.circle" : "circle" }
        if index == question.correctIndex { return "checkmark.circle.fill" }
        if index == selectedIndex { return "xmark.circle.fill" }
        return "circle"
    }

    private func optionTint(for index: Int) -> Color {
        guard answered else { return selectedIndex == index ? .cyan : .white.opacity(0.45) }
        if index == question.correctIndex { return .green }
        if index == selectedIndex { return .orange }
        return .white.opacity(0.35)
    }

    private func optionBackground(for index: Int) -> some View {
        RoundedRectangle(cornerRadius: 14, style: .continuous)
            .fill(optionFill(for: index))
            .stroke(optionStroke(for: index), lineWidth: 1)
    }

    private func optionFill(for index: Int) -> Color {
        guard answered else { return selectedIndex == index ? .cyan.opacity(0.18) : .white.opacity(0.05) }
        if index == question.correctIndex { return .green.opacity(0.16) }
        if index == selectedIndex { return .orange.opacity(0.16) }
        return .white.opacity(0.04)
    }

    private func optionStroke(for index: Int) -> Color {
        guard answered else { return selectedIndex == index ? .cyan.opacity(0.70) : .white.opacity(0.08) }
        if index == question.correctIndex { return .green.opacity(0.65) }
        if index == selectedIndex { return .orange.opacity(0.65) }
        return .white.opacity(0.08)
    }
}

struct FeedbackPanel: View {
    let question: LessonQuestion
    let selectedIndex: Int?

    var body: some View {
        let isCorrect = selectedIndex == question.correctIndex

        VStack(alignment: .leading, spacing: 6) {
            Label(isCorrect ? "You got this right." : "Review the correct answer.", systemImage: isCorrect ? "checkmark.seal.fill" : "exclamationmark.triangle.fill")
                .font(.subheadline.weight(.bold))
                .foregroundStyle(isCorrect ? .green : .orange)

            if let selectedIndex, !isCorrect {
                Text("Your answer: \(question.options[selectedIndex])")
                    .font(.subheadline)
                    .foregroundStyle(.white.opacity(0.72))
            }

            Text("Correct answer: \(question.options[question.correctIndex])")
                .font(.subheadline.weight(.semibold))
                .foregroundStyle(.white)

            Text(question.teaching)
                .font(.subheadline)
                .foregroundStyle(.white.opacity(0.72))
        }
        .padding(12)
        .background(
            RoundedRectangle(cornerRadius: 14, style: .continuous)
                .fill((isCorrect ? Color.green : Color.orange).opacity(0.12))
        )
    }
}

struct QuizSummaryView: View {
    @Environment(PartnerHubStore.self) private var store
    let lesson: Lesson
    let score: Int

    var body: some View {
        let missed = store.results(for: lesson).filter { !$0.isCorrect }

        Panel {
            VStack(alignment: .leading, spacing: 8) {
                Text(missed.isEmpty ? "All answers correct" : "Review missed questions")
                    .font(.headline)
                    .foregroundStyle(.white)
                Text(missed.isEmpty ? "You can still read each teaching note before moving on." : "Compare your answer with the correct answer and read the teaching note.")
                    .font(.subheadline)
                    .foregroundStyle(.white.opacity(0.70))
            }
        }
    }
}
