import SwiftUI
import WebKit

struct PartnerHubRootView: View {
    @State private var webState = PartnerHubWebState()

    var body: some View {
        ZStack {
            PartnerHubWebView(state: webState)
                .ignoresSafeArea(.container, edges: .bottom)

            if webState.isLoading {
                loadingView
            }

            if let errorMessage = webState.errorMessage {
                errorView(errorMessage)
            }
        }
        .background(Color(red: 0.02, green: 0.04, blue: 0.09))
    }

    private var loadingView: some View {
        VStack(spacing: 12) {
            ProgressView()
                .tint(.cyan)
                .scaleEffect(1.2)
            Text("Loading Dieudonne Partner Hub")
                .font(.headline)
                .foregroundStyle(.white)
        }
        .padding(22)
        .background(.black.opacity(0.72), in: RoundedRectangle(cornerRadius: 20))
    }

    private func errorView(_ message: String) -> some View {
        VStack(spacing: 12) {
            Image(systemName: "wifi.exclamationmark")
                .font(.largeTitle)
                .foregroundStyle(.cyan)
            Text("Could not load Partner Hub")
                .font(.headline)
                .foregroundStyle(.white)
            Text(message)
                .font(.subheadline)
                .multilineTextAlignment(.center)
                .foregroundStyle(.white.opacity(0.72))
            Button("Try Again") {
                webState.reload()
            }
            .font(.headline)
            .padding(.horizontal, 18)
            .padding(.vertical, 11)
            .background(.cyan, in: Capsule())
            .foregroundStyle(.black)
        }
        .padding(22)
        .frame(maxWidth: 320)
        .background(.black.opacity(0.82), in: RoundedRectangle(cornerRadius: 24))
        .padding()
    }
}

@Observable
final class PartnerHubWebState {
    let startURL = URL(string: "https://www.dieudonnepartnerhub.org/")!
    weak var webView: WKWebView?
    var isLoading = true
    var errorMessage: String?

    func reload() {
        errorMessage = nil
        isLoading = true
        if let webView {
            webView.reload()
        }
    }
}

struct PartnerHubWebView: UIViewRepresentable {
    let state: PartnerHubWebState

    func makeCoordinator() -> Coordinator {
        Coordinator(state: state)
    }

    func makeUIView(context: Context) -> WKWebView {
        let configuration = WKWebViewConfiguration()
        configuration.allowsInlineMediaPlayback = true
        configuration.defaultWebpagePreferences.allowsContentJavaScript = true
        configuration.websiteDataStore = .default()

        let webView = WKWebView(frame: .zero, configuration: configuration)
        webView.navigationDelegate = context.coordinator
        webView.uiDelegate = context.coordinator
        webView.allowsBackForwardNavigationGestures = true
        webView.scrollView.contentInsetAdjustmentBehavior = .automatic
        webView.isOpaque = false
        webView.backgroundColor = UIColor(red: 0.02, green: 0.04, blue: 0.09, alpha: 1)
        state.webView = webView
        webView.load(URLRequest(url: state.startURL))
        return webView
    }

    func updateUIView(_ webView: WKWebView, context: Context) {}

    final class Coordinator: NSObject, WKNavigationDelegate, WKUIDelegate {
        let state: PartnerHubWebState

        init(state: PartnerHubWebState) {
            self.state = state
        }

        func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
            state.isLoading = true
            state.errorMessage = nil
        }

        func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
            state.isLoading = false
        }

        func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
            show(error)
        }

        func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
            show(error)
        }

        func webView(
            _ webView: WKWebView,
            decidePolicyFor navigationAction: WKNavigationAction,
            decisionHandler: @escaping (WKNavigationActionPolicy) -> Void
        ) {
            guard let url = navigationAction.request.url else {
                decisionHandler(.cancel)
                return
            }

            if ["http", "https"].contains(url.scheme?.lowercased() ?? "") {
                decisionHandler(.allow)
            } else {
                UIApplication.shared.open(url)
                decisionHandler(.cancel)
            }
        }

        func webView(
            _ webView: WKWebView,
            createWebViewWith configuration: WKWebViewConfiguration,
            for navigationAction: WKNavigationAction,
            windowFeatures: WKWindowFeatures
        ) -> WKWebView? {
            if navigationAction.targetFrame == nil {
                webView.load(navigationAction.request)
            }
            return nil
        }

        private func show(_ error: Error) {
            state.isLoading = false
            let nsError = error as NSError
            if nsError.code == NSURLErrorCancelled { return }
            state.errorMessage = error.localizedDescription
        }
    }
}

#Preview {
    PartnerHubRootView()
}
