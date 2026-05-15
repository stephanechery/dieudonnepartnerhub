import SwiftUI

struct PartnerHubRootView: View {
    @State private var store = PartnerHubStore()

    var body: some View {
        TabView {
            TodayView(store: store)
                .tabItem { Label("Today", systemImage: "sparkles") }

            LearnView(store: store)
                .tabItem { Label("Learn", systemImage: "graduationcap.fill") }

            GuidesView(store: store)
                .tabItem { Label("Guides", systemImage: "book.pages.fill") }

            VideoHubView(store: store)
                .tabItem { Label("Videos", systemImage: "play.rectangle.fill") }

            AdminHubView(store: store)
                .tabItem { Label("Admin", systemImage: "gearshape.fill") }
        }
        .tint(.cyan)
        .preferredColorScheme(.dark)
    }
}

struct HubScreen<Content: View>: View {
    let title: String
    let subtitle: String
    @ViewBuilder var content: Content

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 18) {
                VStack(alignment: .leading, spacing: 8) {
                    Text(title)
                        .font(.largeTitle.bold())
                        .foregroundStyle(.white)
                    Text(subtitle)
                        .font(.subheadline)
                        .foregroundStyle(.white.opacity(0.68))
                }
                .padding(.top, 12)

                content
            }
            .padding(.horizontal, 18)
            .padding(.bottom, 28)
        }
        .background(AppTheme.background.ignoresSafeArea())
    }
}

struct HubCard<Content: View>: View {
    @ViewBuilder var content: Content

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            content
        }
        .padding(16)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(AppTheme.card, in: RoundedRectangle(cornerRadius: 22, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: 22, style: .continuous)
                .stroke(.white.opacity(0.08), lineWidth: 1)
        )
    }
}

struct AppTheme {
    static let background = LinearGradient(
        colors: [
            Color(red: 0.02, green: 0.04, blue: 0.09),
            Color(red: 0.06, green: 0.08, blue: 0.15)
        ],
        startPoint: .topLeading,
        endPoint: .bottomTrailing
    )

    static let card = Color(red: 0.08, green: 0.11, blue: 0.20).opacity(0.96)
    static let inset = Color(red: 0.04, green: 0.06, blue: 0.12)
}

#Preview {
    PartnerHubRootView()
}
