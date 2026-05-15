import SwiftUI

struct TodayView: View {
    let store: PartnerHubStore

    var body: some View {
        NavigationStack {
            HubScreen(
                title: "Partner Hub",
                subtitle: "A focused iPhone command center for learning, practice, and saved support tools."
            ) {
                progressCard
                if let lesson = store.activeLesson {
                    NavigationLink(value: lesson) {
                        ContinueLessonCard(store: store, lesson: lesson)
                    }
                    .buttonStyle(.plain)
                }
                signalGrid
                quickActions
            }
            .navigationDestination(for: Lesson.self) { lesson in
                LessonDetailView(store: store, lesson: lesson)
            }
        }
    }

    private var progressCard: some View {
        HubCard {
            HStack(alignment: .center, spacing: 16) {
                ZStack {
                    Circle()
                        .stroke(.white.opacity(0.12), lineWidth: 12)
                    Circle()
                        .trim(from: 0, to: store.completionRatio)
                        .stroke(.cyan, style: StrokeStyle(lineWidth: 12, lineCap: .round))
                        .rotationEffect(.degrees(-90))
                    Text("\(Int(store.completionRatio * 100))%")
                        .font(.headline.bold())
                        .foregroundStyle(.white)
                }
                .frame(width: 86, height: 86)

                VStack(alignment: .leading, spacing: 7) {
                    Text("Learning progress")
                        .font(.headline)
                        .foregroundStyle(.white)
                    Text("\(store.completedCount) of \(store.totalLessons) lessons complete")
                        .font(.subheadline)
                        .foregroundStyle(.white.opacity(0.72))
                    ProgressView(value: store.completionRatio)
                        .tint(.cyan)
                }
            }
        }
    }

    private var signalGrid: some View {
        LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
            ForEach(store.recentSignals) { signal in
                HubCard {
                    Image(systemName: signal.systemImage)
                        .font(.title2)
                        .foregroundStyle(signal.tint)
                    Text(signal.value)
                        .font(.title2.bold())
                        .foregroundStyle(.white)
                    Text(signal.title)
                        .font(.caption.weight(.semibold))
                        .foregroundStyle(.white.opacity(0.76))
                    Text(signal.detail)
                        .font(.caption)
                        .foregroundStyle(.white.opacity(0.55))
                }
            }
        }
    }

    private var quickActions: some View {
        HubCard {
            Text("Today’s focus")
                .font(.headline)
                .foregroundStyle(.white)

            ForEach(store.improvementInsights, id: \.self) { insight in
                HStack(alignment: .top, spacing: 10) {
                    Image(systemName: "lightbulb.fill")
                        .foregroundStyle(.yellow)
                    Text(insight)
                        .font(.subheadline)
                        .foregroundStyle(.white.opacity(0.78))
                }
            }
        }
    }
}

private struct ContinueLessonCard: View {
    let store: PartnerHubStore
    let lesson: Lesson

    var body: some View {
        HubCard {
            HStack(alignment: .top, spacing: 14) {
                Image(systemName: "arrow.forward.circle.fill")
                    .font(.largeTitle)
                    .foregroundStyle(.cyan)

                VStack(alignment: .leading, spacing: 8) {
                    Text("Continue learning")
                        .font(.caption.weight(.bold))
                        .textCase(.uppercase)
                        .foregroundStyle(.cyan)
                    Text(lesson.title)
                        .font(.title3.bold())
                        .foregroundStyle(.white)
                    if let module = store.module(for: lesson) {
                        Text(module.title)
                            .font(.subheadline.weight(.medium))
                            .foregroundStyle(.white.opacity(0.64))
                    }
                    Text(lesson.summary)
                        .font(.subheadline)
                        .foregroundStyle(.white.opacity(0.74))
                }
                Spacer()
                Image(systemName: "chevron.right")
                    .font(.headline)
                    .foregroundStyle(.white.opacity(0.42))
            }
        }
    }
}
