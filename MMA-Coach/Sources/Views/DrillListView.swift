import SwiftUI

struct DrillListView: View {
    let category: Category

    var body: some View {
        List(category.drills) { drill in
            VStack(alignment: .leading) {
                Text(drill.title)
                    .font(.headline)
                if let description = drill.description {
                    Text(description)
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                        .lineLimit(2)
                }
                Text("Duration: \(Int(drill.duration))s")
                    .font(.caption)
                    .foregroundColor(.blue)
            }
            .padding(.vertical, 4)
        }
        .navigationTitle(category.name)
    }
}

#Preview {
    DrillListView(category: Category(name: "Sample Category", drills: [
        Drill(title: "Sample Drill 1", category: "Sample Category"),
        Drill(title: "Sample Drill 2", description: "This is a description", category: "Sample Category")
    ]))
}
