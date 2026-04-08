import Foundation

struct Category: Codable, Identifiable, Hashable {
    let id: UUID
    let name: String
    let drills: [Drill]

    init(id: UUID = UUID(), name: String, drills: [Drill]) {
        self.id = id
        self.name = name
        self.drills = drills
    }
}