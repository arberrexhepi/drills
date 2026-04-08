# Roadmap: MMA Coach

## Phase 1: Swift Migration & UI
**Goal:** Migrate the core functionality from the web-based prototype to a native iOS application using SwiftUI.
- **Specific Migration Tasks:**
    - **Data:** Export `comboSets` from `app.js` to a bundled `drills.json` file.
    - **Logic:** Replicate the 30-second interval timer and the "play twice" speech sequence (speak, wait, speak again).
    - **Audio:** Implement `AVSpeechSynthesizer` for drill instructions and a 1000Hz sine wave beep for start signals.
    - **UI:** Create a SwiftUI version of the circular countdown timer and drill category selection cards.
- **Scope Limits:**
    - Do NOT implement any backend or cloud synchronization.
    - Do NOT implement LLM features in this phase.
    - Do NOT add new drills beyond what exists in the current prototype.
- **Success Signals:**
    - A buildable SwiftUI app that runs on an iOS simulator or device.
    - The app successfully displays and executes the existing drills.

## Phase 2: Data Integration
**Goal:** Establish a robust local data management system for drills and user progress.
- **Scope Limits:**
    - Do NOT implement social features or sharing.
    - Do NOT implement advanced analytics.
- **Success Signals:**
    - Persistent storage of drill completion status.
    - Ability to filter and search drills locally.

## Phase 3: On-device LLM Integration with Gemma [COMPLETED]
**Goal:** Integrate a local LLM (Gemma) to provide personalized coaching insights and drill recommendations.
- **Implementation Detail:** Used **MediaPipe Tasks Text** for on-device inference with Gemma 2B.
- **Scope Limits:**
    - Do NOT use external LLM APIs (OpenAI, Anthropic, etc.).
    - Do NOT implement voice-to-text in this phase.
- **Success Signals:**
    - [x] Gemma model running on-device.
    - [x] User can receive a generated drill recommendation based on their history.
    - [x] UI components (Dashboard & Coach tab) integrated with loading states.

## Phase 4: Refinement
**Goal:** Polish the UI/UX and optimize performance.
- **Scope Limits:**
    - Do NOT pivot to a different sport or domain.
- **Success Signals:**
    - App store ready UI/UX.
    - Optimized LLM inference speed and battery usage.
