import Foundation

struct StrikeStats: Codable {
    var jabs: Int
    var crosses: Int
    var hooks: Int
    var uppercuts: Int
    var kicks: Int
    
    static var empty: StrikeStats {
        StrikeStats(jabs: 0, crosses: 0, hooks: 0, uppercuts: 0, kicks: 0)
    }
}

struct UserHistory: Codable {
    var recentDrillIds: [UUID]
    var strikeStats: StrikeStats
    var lastTrainingDate: Date?
    
    static var mock: UserHistory {
        UserHistory(
            recentDrillIds: [],
            strikeStats: .empty,
            lastTrainingDate: Date().addingTimeInterval(-86400) // Yesterday
        )
    }
}