import SwiftUI

struct LessonsView: View {
    @Environment(PartnerHubStore.self) private var store

    var body: some View {
        NavigationStack {
            List {
                ForEach(store.lessons) { lesson in
                    NavigationLink {
                        LessonDetailView(lesson: lesson)
                    } label: {
                        LessonRow(lesson: lesson, complete: store.completedLessonIds.contains(lesson.id))
                    }
                    .listRowBackground(Color.clear)
                }
            }
            .listStyle(.plain)
            .partnerHubBackground()
            .navigationTitle("Lessons")
        }
    }
}

struct LessonRow: View {
    let lesson: Lesson
    let complete: Bool

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack(alignment: .top) {
                VStack(alignment: .leading, spacing: 4) {
                    Text(lesson.module.uppercased())
                        .font(.caption.weight(.black))
                        .tracking(1.8)
                        .foregroundStyle(.cyan)
                    Text(lesson.title)
                        .font(.headline)
                        .foregroundStyle(.white)
                }
                Spacer()
                Image(systemName: complete ? "checkmark.circle.fill" : "circle")
                    .foregroundStyle(complete ? .green : .white.opacity(0.35))
            }
            Text(lesson.summary)
                .font(.subheadline)
                .foregroundStyle(.white.opacity(0.68))
        }
        .padding(.vertical, 10)
    }
}

struct LessonDetailView: View {
    @Environment(PartnerHubStore.self) private var store
    let lesson: Lesson
    @State private var reflectionText = ""

    var body: some View {
        @Bindable var store = store

        ScrollView {
            VStack(alignment: .leading, spacing: 18) {
                VStack(alignment: .leading, spacing: 8) {
                    SectionLabel(text: lesson.module)
                    Text(lesson.title)
                        .font(.largeTitle.bold())
                        .foregroundStyle(.white)
                    Text(lesson.summary)
                        .foregroundStyle(.white.opacity(0.70))
                }

                Panel {
                    VStack(alignment: .leading, spacing: 12) {
                        Text("What to Practice")
                            .font(.headline)
                            .foregroundStyle(.white)
                        ForEach(lesson.teachingPoints, id: \.self) { point in
                            Label(point, systemImage: "checkmark.circle.fill")
                                .font(.subheadline)
                                .foregroundStyle(.white.opacity(0.78))
                        }
                    }
                }

                Panel {
                    VStack(alignment: .leading, spacing: 10) {
                        Text("Reflection")
                            .font(.headline)
                            .foregroundStyle(.white)
                        Text(lesson.reflectionPrompt)
                            .font(.subheadline)
                            .foregroundStyle(.white.opacity(0.70))
                        TextEditor(text: $reflectionText)
                            .frame(minHeight: 120)
                            .scrollContentBackground(.hidden)
                            .padding(10)
                            .background(Color.black.opacity(0.28))
                            .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
                            .foregroundStyle(.white)
                        Button("Save Reflection") {
                            store.saveReflection(reflectionText, for: lesson)
                        }
                        .buttonStyle(PrimaryButtonStyle())
                    }
                }

                QuizView(lesson: lesson)

                Button("Mark Lesson Complete") {
                    store.markComplete(lesson)
                }
                .buttonStyle(PrimaryButtonStyle())
                .disabled(!store.canComplete(lesson))
                .opacity(store.canComplete(lesson) ? 1 : 0.45)
            }
            .padding(18)
        }
        .partnerHubBackground()
        .navigationTitle(lesson.title)
        .navigationBarTitleDisplayMode(.inline)
        .onAppear {
            reflectionText = store.reflection(for: lesson)
        }
    }
}
