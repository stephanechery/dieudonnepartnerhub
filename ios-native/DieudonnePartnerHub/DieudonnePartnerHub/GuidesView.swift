import SwiftUI

struct GuidesView: View {
    @Environment(PartnerHubStore.self) private var store

    var body: some View {
        NavigationStack {
            List {
                ForEach(store.guides) { guide in
                    GuideCard(guide: guide)
                        .listRowBackground(Color.clear)
                }
            }
            .listStyle(.plain)
            .partnerHubBackground()
            .navigationTitle("Guides")
        }
    }
}

struct GuideCard: View {
    @Environment(PartnerHubStore.self) private var store
    let guide: Guide

    var body: some View {
        Panel {
            VStack(alignment: .leading, spacing: 12) {
                HStack(alignment: .top) {
                    VStack(alignment: .leading, spacing: 4) {
                        Text(guide.title)
                            .font(.headline)
                            .foregroundStyle(.white)
                        Text(guide.focus)
                            .font(.subheadline)
                            .foregroundStyle(.white.opacity(0.68))
                    }
                    Spacer()
                    Button {
                        store.toggleGuide(guide)
                    } label: {
                        Image(systemName: store.savedGuideIds.contains(guide.id) ? "bookmark.fill" : "bookmark")
                            .foregroundStyle(.cyan)
                    }
                    .buttonStyle(.plain)
                }

                ForEach(Array(guide.steps.enumerated()), id: \.offset) { index, step in
                    HStack(alignment: .top, spacing: 10) {
                        Text("\(index + 1)")
                            .font(.caption.weight(.black))
                            .frame(width: 24, height: 24)
                            .background(.cyan.opacity(0.18))
                            .clipShape(Circle())
                            .foregroundStyle(.cyan)
                        Text(step)
                            .font(.subheadline)
                            .foregroundStyle(.white.opacity(0.78))
                    }
                }
            }
        }
        .padding(.vertical, 6)
    }
}
