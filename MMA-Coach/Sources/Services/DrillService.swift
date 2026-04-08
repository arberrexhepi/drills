import Foundation

/// A service responsible for loading and parsing drill data from local resources.
class DrillService {
    
    /// Loads categories and their associated drills from the bundled 'drills.json' file.
    /// - Returns: An array of `Category` objects, or an empty array if loading fails.
    func loadCategories() -> [Category] {
        // Locate the drills.json file in the module bundle
        #if SWIFT_PACKAGE
        let bundle = Bundle.module
        #else
        let bundle = Bundle.main
        #endif

        guard let url = bundle.url(forResource: "drills", withExtension: "json") else {
            print("Error: Could not find drills.json in the bundle.")
            return []
        }
        
        do {
            // Load the data from the file
            let data = try Data(contentsOf: url)
            
            // Initialize the JSONDecoder
            let decoder = JSONDecoder()
            
            // Decode the JSON data into an array of Category objects
            let categories = try decoder.decode([Category].self, from: data)
            
            return categories
        } catch {
            print("Error: Failed to decode drills.json - \(error)")
            return []
        }
    }
    
    /// Convenience method to get all drills across all categories.
    /// - Returns: A flattened array of all `Drill` objects.
    func getAllDrills() -> [Drill] {
        let categories = loadCategories()
        return categories.flatMap { $0.drills }
    }
}
