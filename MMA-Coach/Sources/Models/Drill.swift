import Foundation

struct Drill: Codable, Identifiable, Hashable {
    let id: UUID
    let title: String
    let description: String?
    let videoUrl: String?
    let category: String
    let duration: TimeInterval

    init(
        id: UUID = UUID(),
        title: String,
        description: String? = nil,
        videoUrl: String? = nil,
        category: String,
        duration: TimeInterval = 30.0
    ) {
        self.id = id
        self.title = title
        self.description = description
        self.videoUrl = videoUrl
        self.category = category
        self.duration = duration
    }
}