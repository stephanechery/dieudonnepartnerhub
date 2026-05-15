import SwiftUI

struct TodayView: View {
    @Environment(PartnerHubStore.self) private var store

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 18) {
                    VStack(alignment: .leading, spacing: 8) {
                        SectionLabel(text: "Dieudonne Partner Hub")
                        Text("Support learning, in your pocket.")
                            .font(.largeTitle.bold())
                            .foregroundStyle(.white)
                        Text("Practice what to notice, say, and do through prenatal, labor, postpartum, newborn, and mental health support.")
                            .font(.body)
                            .foregroundStyle(.white.opacity(0.72))
                    }
                    .padding(.top, 10)

                    Panel {
                        VStack(alignment: .leading, spacing: 14) {
                            HStack {
                                VStack(alignment: .leading, spacing: 4) {
                                    Text("Training Progress")
                                        .font(.headline)
                                        .foregroundStyle(.white)
                                    Text("\(store.completedLessonIds.count) of \(store.lessons.count) lessons complete")
                                        .font(.subheadline)
                                        .foregroundStyle(.white.opacity(0.64))
                                }
                                Spacer()
                                Text("\(store.completionPercent)%")
                                    .font(.title2.bold())
                                    .foregroundStyle(.cyan)
                            }

                            ProgressView(value: Double(store.completionPercent), total: 100)
                                .tint(.cyan)
                        }
                    }

                    if let nextLesson = store.nextLesson {
                        NavigationLink {
                            LessonDetailView(lesson: nextLesson)
                        } label: {
                            Panel {
                                VStack(alignment: .leading, spacing: 10) {
                                    SectionLabel(text: "Next Lesson")
                                    Text(nextLesson.title)
                                        .font(.title3.bold())
                                        .foregroundStyle(.white)
                                    Text(nextLesson.summary)
                                        .font(.subheadline)
                                        .foregroundStyle(.white.opacity(0.68))
                                    Text("Start lesson")
                                        .font(.headline)
                                        .foregroundStyle(.cyan)
                                }
                            }
                        }
                        .buttonStyle(.plain)
                    }

                    VStack(alignment: .leading, spacing: 12) {
                        Text("Focus Areas")
                            .font(.headline)
                            .foregroundStyle(.white)

                        LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                            FocusTile(title: "Prenatal", icon: "heart.text.square.fill")
                            FocusTile(title: "Labor", icon: "waveform.path.ecg")
                            FocusTile(title: "Postpartum", icon: "figure.and.child.holdinghands")
                            FocusTile(title: "Mental Health", icon: "brain.head.profile")
                        }
                    }
                }
                .padding(18)
            }
            .partnerHubBackground()
            .navigationTitle("Today")
        }
    }
}

struct FocusTile: View {
    let title: String
    let icon: String

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            Image(systemName: icon)
                .font(.title2)
                .foregroundStyle(.cyan)
            Text(title)
                .font(.headline)
                .foregroundStyle(.white)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(14)
        .background(
            RoundedRectangle(cornerRadius: 18, style: .continuous)
                .fill(Color.white.opacity(0.06))
                .stroke(Color.white.opacity(0.10), lineWidth: 1)
        )
    }
}
