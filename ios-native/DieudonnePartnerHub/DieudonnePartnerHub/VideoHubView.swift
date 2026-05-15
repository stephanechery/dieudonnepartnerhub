import SwiftUI

struct VideoHubView: View {
    let store: PartnerHubStore
    @State private var selectedCategory = "All"
    @State private var searchText = ""
    @Environment(\.openURL) private var openURL

    private var filteredVideos: [PartnerVideo] {
        store.videos.filter { video in
            let categoryMatch = selectedCategory == "All" || video.category == selectedCategory
            let searchMatch = searchText.isEmpty
                || video.title.localizedCaseInsensitiveContains(searchText)
                || video.description.localizedCaseInsensitiveContains(searchText)
                || video.tags.joined(separator: " ").localizedCaseInsensitiveContains(searchText)
            return categoryMatch && searchMatch
        }
    }

    var body: some View {
        NavigationStack {
            HubScreen(
                title: "Videos",
                subtitle: "Save, queue, and open trusted partner education videos from the native app."
            ) {
                Picker("Category", selection: $selectedCategory) {
                    ForEach(store.categories, id: \.self) { category in
                        Text(category).tag(category)
                    }
                }
                .pickerStyle(.menu)
                .tint(.cyan)

                TextField("Search videos", text: $searchText)
                    .textFieldStyle(.roundedBorder)

                ForEach(filteredVideos) { video in
                    VideoCard(store: store, video: video) {
                        if let url = URL(string: video.sourceUrl) {
                            openURL(url)
                        }
                    }
                }
            }
        }
    }
}

private struct VideoCard: View {
    let store: PartnerHubStore
    let video: PartnerVideo
    let openVideo: () -> Void

    var body: some View {
        HubCard {
            HStack(alignment: .top, spacing: 12) {
                thumbnail
                    .frame(width: 112, height: 74)
                    .clipShape(RoundedRectangle(cornerRadius: 14))

                VStack(alignment: .leading, spacing: 6) {
                    Text(video.category)
                        .font(.caption.weight(.bold))
                        .foregroundStyle(.cyan)
                    Text(video.title)
                        .font(.headline)
                        .foregroundStyle(.white)
                        .lineLimit(2)
                    Text(video.source)
                        .font(.caption)
                        .foregroundStyle(.white.opacity(0.58))
                }
            }

            Text(video.description)
                .font(.subheadline)
                .foregroundStyle(.white.opacity(0.68))

            HStack {
                Button(action: openVideo) {
                    Label("Watch", systemImage: "play.fill")
                }
                .buttonStyle(.borderedProminent)
                .tint(.cyan)

                Button {
                    store.toggleSaved(video)
                } label: {
                    Image(systemName: store.isSaved(video) ? "bookmark.fill" : "bookmark")
                }
                .buttonStyle(.bordered)
                .tint(.yellow)
                .accessibilityLabel(store.isSaved(video) ? "Remove saved video" : "Save video")

                Button {
                    store.toggleWatchLater(video)
                } label: {
                    Image(systemName: store.isWatchLater(video) ? "clock.fill" : "clock")
                }
                .buttonStyle(.bordered)
                .tint(.cyan)
                .accessibilityLabel(store.isWatchLater(video) ? "Remove watch later" : "Watch later")

                Spacer()
                Text(video.duration)
                    .font(.caption.weight(.semibold))
                    .foregroundStyle(.white.opacity(0.62))
            }
        }
    }

    @ViewBuilder
    private var thumbnail: some View {
        if let thumbnail = video.thumbnail, let url = URL(string: thumbnail) {
            AsyncImage(url: url) { image in
                image
                    .resizable()
                    .scaledToFill()
            } placeholder: {
                ZStack {
                    AppTheme.inset
                    Image(systemName: "play.rectangle.fill")
                        .foregroundStyle(.cyan)
                }
            }
        } else {
            ZStack {
                AppTheme.inset
                Image(systemName: "play.rectangle.fill")
                    .foregroundStyle(.cyan)
            }
        }
    }
}
