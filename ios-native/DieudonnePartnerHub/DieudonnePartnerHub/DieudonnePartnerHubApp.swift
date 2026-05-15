import SwiftUI

@main
struct DieudonnePartnerHubApp: App {
    @State private var store = PartnerHubStore()

    var body: some Scene {
        WindowGroup {
            PartnerHubRootView()
                .environment(store)
        }
    }
}
