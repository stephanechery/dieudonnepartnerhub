import SwiftUI

struct AdminHubView: View {
    let store: PartnerHubStore
    @State private var code = ""
    @State private var showError = false

    var body: some View {
        NavigationStack {
            HubScreen(
                title: "Admin",
                subtitle: "Private learning signals for improving the product."
            ) {
                if store.adminUnlocked {
                    adminContent
                } else {
                    lockedContent
                }
            }
        }
    }

    private var lockedContent: some View {
        HubCard {
            Image(systemName: "lock.shield.fill")
                .font(.largeTitle)
                .foregroundStyle(.cyan)
            Text("Admin hub locked")
                .font(.title3.bold())
                .foregroundStyle(.white)
            Text("Enter your local admin code to view product signals on this iPhone.")
                .font(.subheadline)
                .foregroundStyle(.white.opacity(0.68))
            SecureField("Admin code", text: $code)
                .textFieldStyle(.roundedBorder)
            Button {
                showError = !store.unlockAdmin(with: code)
            } label: {
                Label("Unlock Admin Hub", systemImage: "key.fill")
                    .frame(maxWidth: .infinity)
            }
            .buttonStyle(.borderedProminent)
            .tint(.cyan)
            if showError {
                Text("That code did not unlock the admin hub.")
                    .font(.footnote.weight(.medium))
                    .foregroundStyle(.orange)
            }
        }
    }

    private var adminContent: some View {
        VStack(alignment: .leading, spacing: 14) {
            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                ForEach(store.recentSignals) { signal in
                    HubCard {
                        Image(systemName: signal.systemImage)
                            .font(.title2)
                            .foregroundStyle(signal.tint)
                        Text(signal.value)
                            .font(.title.bold())
                            .foregroundStyle(.white)
                        Text(signal.title)
                            .font(.caption.weight(.semibold))
                            .foregroundStyle(.white.opacity(0.7))
                    }
                }
            }

            HubCard {
                Text("What to improve next")
                    .font(.headline)
                    .foregroundStyle(.white)
                ForEach(store.improvementInsights, id: \.self) { insight in
                    Label(insight, systemImage: "wand.and.stars")
                        .font(.subheadline)
                        .foregroundStyle(.white.opacity(0.76))
                }
            }

            HubCard {
                Text("Content coverage")
                    .font(.headline)
                    .foregroundStyle(.white)
                MetricRow(label: "Modules", value: "\(store.modules.count)")
                MetricRow(label: "Lessons", value: "\(store.totalLessons)")
                MetricRow(label: "Guides", value: "\(store.guides.count)")
                MetricRow(label: "Videos", value: "\(store.videos.count)")
            }
        }
    }
}

private struct MetricRow: View {
    let label: String
    let value: String

    var body: some View {
        HStack {
            Text(label)
                .foregroundStyle(.white.opacity(0.68))
            Spacer()
            Text(value)
                .font(.headline)
                .foregroundStyle(.white)
        }
        .font(.subheadline)
    }
}
