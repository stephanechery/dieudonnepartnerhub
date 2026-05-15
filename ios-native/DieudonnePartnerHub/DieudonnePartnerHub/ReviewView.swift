import SwiftUI

struct ReviewView: View {
    @Environment(PartnerHubStore.self) private var store

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    Panel {
                        VStack(alignment: .leading, spacing: 8) {
                            SectionLabel(text: "Saved Progress")
                            Text("\(store.completionPercent)% complete")
                                .font(.largeTitle.bold())
                                .foregroundStyle(.white)
                            Text("Use this area to revisit completed lessons, saved guides, and missed quiz teaching.")
                                .foregroundStyle(.white.opacity(0.70))
                        }
                    }

                    VStack(alignment: .leading, spacing: 10) {
                        Text("Completed Lessons")
                            .font(.headline)
                            .foregroundStyle(.white)

                        if store.completedLessonIds.isEmpty {
                            EmptyState(text: "No lessons completed yet.")
                        } else {
                            ForEach(store.lessons.filter { store.completedLessonIds.contains($0.id) }) { lesson in
                                Text(lesson.title)
                                    .font(.subheadline.weight(.semibold))
                                    .foregroundStyle(.white)
                                    .padding()
                                    .frame(maxWidth: .infinity, alignment: .leading)
                                    .background(Color.white.opacity(0.06), in: RoundedRectangle(cornerRadius: 16))
                            }
                        }
                    }

                    VStack(alignment: .leading, spacing: 10) {
                        Text("Saved Guides")
                            .font(.headline)
                            .foregroundStyle(.white)

                        let savedGuides = store.guides.filter { store.savedGuideIds.contains($0.id) }
                        if savedGuides.isEmpty {
                            EmptyState(text: "No guides saved yet.")
                        } else {
                            ForEach(savedGuides) { guide in
                                Text(guide.title)
                                    .font(.subheadline.weight(.semibold))
                                    .foregroundStyle(.white)
                                    .padding()
                                    .frame(maxWidth: .infinity, alignment: .leading)
                                    .background(Color.white.opacity(0.06), in: RoundedRectangle(cornerRadius: 16))
                            }
                        }
                    }
                }
                .padding(18)
            }
            .partnerHubBackground()
            .navigationTitle("Review")
        }
    }
}

struct EmptyState: View {
    let text: String

    var body: some View {
        Text(text)
            .font(.subheadline)
            .foregroundStyle(.white.opacity(0.64))
            .padding()
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(Color.white.opacity(0.05), in: RoundedRectangle(cornerRadius: 16))
    }
}
