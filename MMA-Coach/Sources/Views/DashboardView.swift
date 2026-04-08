import SwiftUI

struct DashboardView: View {
    @State private var recommendation: String? = nil
    @State private var isLoading = false
    @State private var errorMessage: String? = nil
    
    private let coachingManager = CoachingManager()
    
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                Text("Training Dashboard")
                    .font(.largeTitle)
                    .bold()
                    .padding(.bottom, 10)
                
                // Stats Section
                VStack(alignment: .leading, spacing: 10) {
                    Text("Your Progress")
                        .font(.headline)
                    
                    HStack {
                        StatCard(title: "Jabs", value: "42")
                        StatCard(title: "Kicks", value: "12")
                        StatCard(title: "Drills", value: "5")
                    }
                }
                .padding()
                .background(Color.secondary.opacity(0.1))
                .cornerRadius(12)
                
                // AI Coaching Section
                VStack(alignment: .leading, spacing: 15) {
                    HStack {
                        Image(systemName: "sparkles")
                            .foregroundColor(.blue)
                        Text("AI Coach Insights")
                            .font(.headline)
                    }
                    
                    if let recommendation = recommendation {
                        Text(recommendation)
                            .padding()
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .background(Color.blue.opacity(0.1))
                            .cornerRadius(10)
                            .fixedSize(horizontal: false, vertical: true)
                    } else if isLoading {
                        VStack(spacing: 12) {
                            ProgressView()
                            Text("Coach is analyzing your performance...")
                                .font(.subheadline)
                                .foregroundColor(.secondary)
                        }
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 20)
                    } else {
                        Text("Get a personalized training recommendation based on your recent activity and stats.")
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                            .padding(.vertical, 10)
                    }
                    
                    if let error = errorMessage {
                        Text(error)
                            .foregroundColor(.red)
                            .font(.caption)
                            .padding(.top, 4)
                    }
                    
                    Button(action: getRecommendation) {
                        HStack {
                            if isLoading { ProgressView().tint(.white).padding(.trailing, 5) }
                            Text(recommendation == nil ? "Get Recommendation" : "Refresh Advice")
                        }
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(isLoading ? Color.gray : Color.blue)
                        .foregroundColor(.white)
                        .cornerRadius(10)
                    }
                    .disabled(isLoading)
                }
                .padding()
                .background(Color.secondary.opacity(0.1))
                .cornerRadius(12)
                
                Spacer()
            }
            .padding()
        }
        .navigationTitle("Dashboard")
    }
    
    private func getRecommendation() {
        isLoading = true
        errorMessage = nil
        
        Task {
            do {
                // Using a standard query for the dashboard trigger
                let result = try await coachingManager.generateCoachingResponse(userQuery: "Give me a quick recommendation for today's training based on my stats.")
                await MainActor.run {
                    self.recommendation = result
                    self.isLoading = false
                }
            } catch {
                await MainActor.run {
                    self.errorMessage = "Failed to get recommendation: \(error.localizedDescription)"
                    self.isLoading = false
                }
            }
        }
    }
}

struct StatCard: View {
    let title: String
    let value: String
    
    var body: some View {
        VStack {
            Text(value)
                .font(.title2)
                .bold()
            Text(title)
                .font(.caption)
                .foregroundColor(.secondary)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 10)
        .background(Color(UIColor.systemBackground))
        .cornerRadius(8)
        .shadow(color: Color.black.opacity(0.05), radius: 2, x: 0, y: 2)
    }
}

#Preview {
    NavigationStack {
        DashboardView()
    }
}
