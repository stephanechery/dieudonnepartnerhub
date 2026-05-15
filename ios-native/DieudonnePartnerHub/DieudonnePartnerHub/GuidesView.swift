import SwiftUI

struct GuidesView: View {
    let store: PartnerHubStore
    @State private var selectedPhase = "All"

    private var phases: [String] {
        ["All"] + Array(Set(store.guides.map(\.phase))).sorted()
    }

    private var filteredGuides: [InteractiveGuide] {
        selectedPhase == "All" ? store.guides : store.guides.filter { $0.phase == selectedPhase }
    }

    var body: some View {
        NavigationStack {
            HubScreen(
                title: "Guides",
                subtitle: "Fast iOS reference cards for moments when partners need clear next actions."
            ) {
                Picker("Phase", selection: $selectedPhase) {
                    ForEach(phases, id: \.self) { phase in
                        Text(phase).tag(phase)
                    }
                }
                .pickerStyle(.segmented)

                ForEach(filteredGuides) { guide in
                    NavigationLink(value: guide) {
                        GuideRow(store: store, guide: guide)
                    }
                    .buttonStyle(.plain)
                }
            }
            .navigationDestination(for: InteractiveGuide.self) { guide in
                GuideDetailView(store: store, guide: guide)
            }
        }
    }
}

private struct GuideRow: View {
    let store: PartnerHubStore
    let guide: InteractiveGuide

    var body: some View {
        HubCard {
            HStack(alignment: .top, spacing: 14) {
                Image(systemName: "sparkle.magnifyingglass")
                    .font(.title2)
                    .foregroundStyle(guide.tint)
                    .frame(width: 36, height: 36)
                    .background(guide.tint.opacity(0.14), in: RoundedRectangle(cornerRadius: 12))

                VStack(alignment: .leading, spacing: 6) {
                    HStack {
                        Text(guide.phase)
                            .font(.caption.weight(.bold))
                            .foregroundStyle(guide.tint)
                        Spacer()
                        if store.isSaved(guide) {
                            Image(systemName: "bookmark.fill")
                                .foregroundStyle(.yellow)
                        }
                    }
                    Text(guide.title)
                        .font(.headline)
                        .foregroundStyle(.white)
                    Text(guide.summary)
                        .font(.subheadline)
                        .foregroundStyle(.white.opacity(0.68))
                }
            }
        }
    }
}

struct GuideDetailView: View {
    let store: PartnerHubStore
    let guide: InteractiveGuide

    private var sections: [GuideDetailSection] {
        guide.detailSections ?? []
    }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                HubCard {
                    Text(guide.phase)
                        .font(.caption.weight(.bold))
                        .textCase(.uppercase)
                        .foregroundStyle(guide.tint)
                    Text(guide.title)
                        .font(.title.bold())
                        .foregroundStyle(.white)
                    Text(guide.summary)
                        .font(.subheadline)
                        .foregroundStyle(.white.opacity(0.74))
                    Button {
                        store.toggleSaved(guide)
                    } label: {
                        Label(store.isSaved(guide) ? "Saved" : "Save Guide", systemImage: store.isSaved(guide) ? "bookmark.fill" : "bookmark")
                            .frame(maxWidth: .infinity)
                    }
                    .buttonStyle(.borderedProminent)
                    .tint(guide.tint)
                }

                if sections.isEmpty {
                    HubCard {
                        Text("Use this in the moment")
                            .font(.headline)
                            .foregroundStyle(.white)
                        ForEach(actionItems(for: guide), id: \.self) { item in
                            Label(item, systemImage: "checkmark.circle.fill")
                                .font(.subheadline)
                                .foregroundStyle(.white.opacity(0.78))
                        }
                    }
                } else {
                    ForEach(sections) { section in
                        GuideDetailSectionView(section: section, tint: guide.tint)
                    }
                }
            }
            .padding(18)
        }
        .background(AppTheme.background.ignoresSafeArea())
        .navigationTitle("Guide")
        .navigationBarTitleDisplayMode(.inline)
        .onAppear {
            store.openGuide(guide)
        }
    }

    private func actionItems(for guide: InteractiveGuide) -> [String] {
        switch guide.phase {
        case "Prenatal":
            return ["Ask what feels hardest today.", "Offer one concrete comfort action.", "Track symptoms that need clinical guidance."]
        case "Labor":
            return ["Keep the room calm.", "Use short phrases and steady touch if wanted.", "Escalate urgent changes to the care team."]
        case "Postpartum":
            return ["Protect rest windows.", "Handle food, water, and home tasks first.", "Watch for mood or recovery changes that need help."]
        default:
            return ["Listen first.", "Choose one useful support action.", "Follow up after the moment passes."]
        }
    }
}

private struct GuideDetailSectionView: View {
    let section: GuideDetailSection
    let tint: Color

    var body: some View {
        HubCard {
            Text(section.title)
                .font(.title3.bold())
                .foregroundStyle(.white)

            if let body = section.body, !body.isEmpty {
                Text(body)
                    .font(.subheadline)
                    .foregroundStyle(.white.opacity(0.72))
                    .fixedSize(horizontal: false, vertical: true)
            }

            ForEach(section.bullets ?? []) { group in
                GuideBulletGroupView(group: group, tint: tint)
            }

            ForEach(section.cards ?? []) { card in
                GuideDetailCardView(card: card, tint: tint, depth: 0)
            }
        }
    }
}

private struct GuideDetailCardView: View {
    let card: GuideDetailCard
    let tint: Color
    let depth: Int

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack(alignment: .firstTextBaseline, spacing: 8) {
                if let icon = card.icon, !icon.isEmpty {
                    Text(icon)
                        .font(.title3)
                }
                Text(card.title)
                    .font(depth == 0 ? .headline : .subheadline.weight(.bold))
                    .foregroundStyle(.white)
                    .fixedSize(horizontal: false, vertical: true)
            }

            if let body = card.body, !body.isEmpty {
                Text(body)
                    .font(.subheadline)
                    .foregroundStyle(.white.opacity(0.68))
                    .fixedSize(horizontal: false, vertical: true)
            }

            ForEach(card.bullets ?? []) { group in
                GuideBulletGroupView(group: group, tint: tint)
            }

            ForEach(card.cards ?? []) { nested in
                GuideDetailCardView(card: nested, tint: tint, depth: depth + 1)
            }
        }
        .padding(12)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(AppTheme.inset.opacity(depth == 0 ? 1 : 0.72), in: RoundedRectangle(cornerRadius: 16))
        .overlay(
            RoundedRectangle(cornerRadius: 16)
                .stroke(tint.opacity(depth == 0 ? 0.16 : 0.08), lineWidth: 1)
        )
    }
}

private struct GuideBulletGroupView: View {
    let group: GuideBulletGroup
    let tint: Color

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(group.label)
                .font(.caption.weight(.bold))
                .textCase(.uppercase)
                .foregroundStyle(tint)

            ForEach(group.items, id: \.self) { item in
                Label(item, systemImage: "checkmark.circle.fill")
                    .font(.subheadline)
                    .foregroundStyle(.white.opacity(0.76))
                    .fixedSize(horizontal: false, vertical: true)
            }
        }
    }
}
