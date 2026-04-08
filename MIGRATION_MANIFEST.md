# Migration Manifest: MMA Drills to Swift

This document summarizes the existing content and assets identified for migration from the web-based repository to the Swift-based iOS application.

## 1. Primary Data Structure

The core drill data is currently stored as a JavaScript object (`comboSets`) in `app.js`. 

**Format:** JSON-compatible Key-Value pairs where:
- **Key:** Category Name (String)
- **Value:** Array of Drill Instructions (Strings)

### Identified Categories:
- `Muay Thai – Attack (5 Methods of JKD)`
- `Muay Thai – Defence`
- `Muay Thai – Footwork & Mobility`
- `Boxing Fundamentals`
- `Boxing Fundamentals 2`
- `Taekwondo Precision Kicks`

## 2. Assets to Migrate

### Data
- **Drills:** The `comboSets` object needs to be exported to a `drills.json` file.
- **Logic:** The 30-second interval logic and the "play twice" sequence (speak once, wait, speak again) should be replicated in Swift.

### UI/UX Elements
- **Timer:** The circular SVG timer (30-second countdown) in `index.html` and `app.js`.
- **Voice Synthesis:** The app uses `speechSynthesis`. This will migrate to `AVSpeechSynthesizer` in iOS.
- **Sound Effects:** A simple beep sound (1000Hz sine wave) is used to signal the start of a drill.

## 3. Swift Implementation Strategy

- **Storage:** The `drills.json` will be bundled as a resource in the Xcode project.
- **Model:** A Swift `struct DrillSet: Codable` will be used to parse the JSON.
- **Fetching:** Data will be loaded locally from the bundle during the initial phase.

## 4. Files for Reference
- `app.js`: Contains the drill text and sequencing logic.
- `index.html`: Contains the UI structure and timer SVG.
- `styles.css`: Contains the visual styling for the cards and active states.
