import Foundation

/// A manager that coordinates data retrieval and LLM calls to provide personalized coaching.
class CoachingManager {
    private let llmService: GemmaInferenceService
    private let drillService: DrillService
    
    // In a real app, this would be persisted or fetched from a database/repository.
    private var userHistory: UserHistory = .mock
    
    init(llmService: GemmaInferenceService = GemmaInferenceService(), 
         drillService: DrillService = DrillService()) {
        self.llmService = llmService
        self.drillService = drillService
    }
    
    /// Generates a personalized response from the MMA Coach LLM.
    /// - Parameter userQuery: The user's input text.
    /// - Returns: A personalized response string.
    func generateCoachingResponse(userQuery: String) async throws -> String {
        let prompt = buildPrompt(userQuery: userQuery)
        return try await llmService.generateResponse(prompt: prompt)
    }
    
    /// Constructs the full prompt including system persona and user context.
    private func buildPrompt(userQuery: String) -> String {
        let systemPrompt = """
        You are an expert MMA coach. Your goal is to provide personalized training advice, 
        drill recommendations, and technical feedback based on the user's history and stats. 
        Be encouraging, professional, and focused on technical precision.
        """
        
        let contextSummary = buildContextSummary()
        
        let fullPrompt = """
        \(systemPrompt)
        
        USER CONTEXT:
        \(contextSummary)
        
        USER QUESTION:
        \(userQuery)
        
        COACH RESPONSE:
        """
        
        return fullPrompt
    }
    
    /// Maps user data models to a text-based summary for the prompt.
    private func buildContextSummary() -> String {
        var summary = ""
        
        // Strike Stats
        let stats = userHistory.strikeStats
        summary += "- Strike Stats: Jabs: \(stats.jabs), Crosses: \(stats.crosses), Hooks: \(stats.hooks), Uppercuts: \(stats.uppercuts), Kicks: \(stats.kicks)\n"
        
        // Recent Drills
        let allDrills = drillService.getAllDrills()
        let recentDrills = allDrills.filter { userHistory.recentDrillIds.contains($0.id) }
        
        if !recentDrills.isEmpty {
            summary += "- Recent Drills Completed: " + recentDrills.map { $0.title }.joined(separator: ", ") + "\n"
        } else {
            summary += "- Recent Drills Completed: None yet. Ready for a fresh start!\n"
        }
        
        // Last Training
        if let lastDate = userHistory.lastTrainingDate {
            let formatter = RelativeDateTimeFormatter()
            summary += "- Last Training Session: \(formatter.localizedString(for: lastDate, relativeTo: Date()))\n"
        }
        
        return summary
    }
    
    /// Updates the user's strike stats (e.g., after a session).
    func updateStrikeStats(_ stats: StrikeStats) {
        userHistory.strikeStats = stats
    }
    
    /// Adds a drill to the user's recent history.
    func recordDrillCompletion(drillId: UUID) {
        if !userHistory.recentDrillIds.contains(drillId) {
            userHistory.recentDrillIds.append(drillId)
            // Keep only the last 5 drills for context brevity
            if userHistory.recentDrillIds.count > 5 {
                userHistory.recentDrillIds.removeFirst()
            }
        }
    }
}
