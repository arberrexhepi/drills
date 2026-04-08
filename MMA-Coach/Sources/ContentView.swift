import SwiftUI

struct ContentView: View {
    var body: some View {
        TabView {
            NavigationStack {
                DashboardView()
            }
            .tabItem {
                Label("Dashboard", systemImage: "house.fill")
            }

            NavigationStack {
                CategoryListView()
            }
            .tabItem {
                Label("Drills", systemImage: "figure.martial-arts")
            }

            NavigationStack {
                CoachView()
            }
            .tabItem {
                Label("Coach", systemImage: "person.bubble.fill")
            }
        }
    }
}

#Preview {
    ContentView()
}
