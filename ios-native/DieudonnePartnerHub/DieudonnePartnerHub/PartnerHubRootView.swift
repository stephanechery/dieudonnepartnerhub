import SwiftUI

struct PartnerHubRootView: View {
    var body: some View {
        TabView {
            TodayView()
                .tabItem {
                    Label("Today", systemImage: "house.fill")
                }

            LessonsView()
                .tabItem {
                    Label("Lessons", systemImage: "book.closed.fill")
                }

            GuidesView()
                .tabItem {
                    Label("Guides", systemImage: "list.clipboard.fill")
                }

            ReviewView()
                .tabItem {
                    Label("Review", systemImage: "checkmark.seal.fill")
                }
        }
        .tint(.cyan)
    }
}

struct AppBackground: ViewModifier {
    func body(content: Content) -> some View {
        content
            .scrollContentBackground(.hidden)
            .background(
                LinearGradient(
                    colors: [
                        Color(red: 0.02, green: 0.04, blue: 0.09),
                        Color(red: 0.05, green: 0.08, blue: 0.15)
                    ],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
                .ignoresSafeArea()
            )
    }
}

extension View {
    func partnerHubBackground() -> some View {
        modifier(AppBackground())
    }
}

struct Panel<Content: View>: View {
    let content: Content

    init(@ViewBuilder content: () -> Content) {
        self.content = content()
    }

    var body: some View {
        content
            .padding(16)
            .background(
                RoundedRectangle(cornerRadius: 22, style: .continuous)
                    .fill(Color.white.opacity(0.07))
                    .stroke(Color.white.opacity(0.10), lineWidth: 1)
            )
    }
}

struct SectionLabel: View {
    let text: String

    var body: some View {
        Text(text.uppercased())
            .font(.caption.weight(.black))
            .tracking(2.4)
            .foregroundStyle(.cyan)
    }
}

struct PrimaryButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.headline)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 14)
            .background(
                LinearGradient(
                    colors: [.cyan, Color(red: 0.12, green: 0.80, blue: 0.70)],
                    startPoint: .leading,
                    endPoint: .trailing
                )
            )
            .foregroundStyle(.black)
            .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
            .opacity(configuration.isPressed ? 0.72 : 1)
    }
}

#Preview {
    PartnerHubRootView()
        .environment(PartnerHubStore())
}
