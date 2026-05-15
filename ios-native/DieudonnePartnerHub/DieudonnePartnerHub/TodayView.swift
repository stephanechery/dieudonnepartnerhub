import SwiftUI

struct TodayView: View {
    let store: PartnerHubStore
    let openLearn: () -> Void
    let openGuides: () -> Void
    let openVideos: () -> Void
    @Environment(\.openURL) private var openURL

    private let doulaMatchURL = URL(string: "https://dieudonnematch.org")!

    var body: some View {
        NavigationStack {
            HubScreen(
                title: "Partner Hub",
                subtitle: "A focused iPhone command center for learning, practice, and saved support tools."
            ) {
                heroCard
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
            .navigationDestination(for: InteractiveGuide.self) { guide in
                GuideDetailView(store: store, guide: guide)
            }
        }
    }

    private var mainGuide: InteractiveGuide? {
        store.guides.first { $0.id == "partner-trimester-guide" } ?? store.guides.first
    }

    private var heroCard: some View {
        ZStack(alignment: .bottomLeading) {
            Image("home-hero-pregnant")
                .resizable()
                .scaledToFill()
                .frame(maxWidth: .infinity, minHeight: 430, maxHeight: 430)
                .clipped()
                .overlay(
                    LinearGradient(
                        colors: [.black.opacity(0.2), .black.opacity(0.82)],
                        startPoint: .top,
                        endPoint: .bottom
                    )
                )

            VStack(alignment: .leading, spacing: 16) {
                Label("Built for partners", systemImage: "person.2.fill")
                    .font(.caption.weight(.bold))
                    .textCase(.uppercase)
                    .foregroundStyle(.cyan)
                    .padding(.horizontal, 12)
                    .padding(.vertical, 7)
                    .background(.black.opacity(0.42), in: Capsule())

                VStack(alignment: .leading, spacing: 10) {
                    Text("Built for partners. Designed for safer outcomes.")
                        .font(.system(size: 34, weight: .black, design: .rounded))
                        .foregroundStyle(.white)
                        .minimumScaleFactor(0.82)
                        .fixedSize(horizontal: false, vertical: true)
                    Text("Clinically grounded guidance, interactive training, and coaching across prenatal, labor, and postpartum recovery.")
                        .font(.subheadline)
                        .foregroundStyle(.white.opacity(0.78))
                        .fixedSize(horizontal: false, vertical: true)
                }

                VStack(spacing: 10) {
                    Button(action: openLearn) {
                        Label("Enter Partner Platform", systemImage: "arrow.forward.circle.fill")
                            .font(.headline)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 6)
                    }
                    .buttonStyle(.borderedProminent)
                    .tint(.cyan)

                    if let mainGuide {
                        NavigationLink(value: mainGuide) {
                            Label("Explore Main Guide", systemImage: "book.pages.fill")
                                .font(.headline)
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 12)
                                .background(.white.opacity(0.11), in: RoundedRectangle(cornerRadius: 14))
                                .overlay(
                                    RoundedRectangle(cornerRadius: 14)
                                        .stroke(.white.opacity(0.18), lineWidth: 1)
                                )
                        }
                        .foregroundStyle(.white)
                    } else {
                        Button(action: openGuides) {
                            Label("Explore Main Guide", systemImage: "book.pages.fill")
                                .font(.headline)
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 6)
                        }
                        .buttonStyle(.bordered)
                        .tint(.white)
                    }

                    Button {
                        openURL(doulaMatchURL)
                    } label: {
                        Label("Match Mom with a Doula", systemImage: "heart.text.square.fill")
                            .font(.headline)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 6)
                    }
                    .buttonStyle(.bordered)
                    .tint(.cyan)
                }
            }
            .padding(18)
        }
        .clipShape(RoundedRectangle(cornerRadius: 28, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: 28, style: .continuous)
                .stroke(.white.opacity(0.12), lineWidth: 1)
        )
        .shadow(color: .cyan.opacity(0.12), radius: 22, x: 0, y: 14)
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
