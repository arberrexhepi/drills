import SwiftUI

struct CategoryListView: View {
    @State private var categories: [Category] = []
    private let drillService = DrillService()

    var body: some View {
        List(categories) { category in
            NavigationLink(destination: DrillListView(category: category)) {
                VStack(alignment: .leading) {
                    Text(category.name)
                        .font(.headline)
                    Text("\(category.drills.count) drills")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                }
            }
        }
        .navigationTitle("MMA Categories")
        .onAppear {
            categories = drillService.loadCategories()
        }
    }
}

#Preview {
    NavigationStack {
        CategoryListView()
    }
}
