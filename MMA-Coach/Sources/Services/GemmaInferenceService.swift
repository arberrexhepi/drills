import Foundation
import MediaPipeTasksText

/// A service responsible for initializing the MediaPipe LLM Inference engine and generating responses.
class GemmaInferenceService {
    
    private var llmInference: LlmInference?
    
    init() {
        // Model is loaded lazily to avoid memory pressure during app launch.
    }
    
    /// Initializes the LLM Inference engine with options if not already initialized.
    private func setupLLM() throws -> LlmInference {
        if let existing = llmInference {
            return existing
        }
        
        #if SWIFT_PACKAGE
        let bundle = Bundle.module
        #else
        let bundle = Bundle.main
        #endif

        // Attempt to find the model file. 
        // Based on 'ls', the file is 'gemma-4-E2B-it.litertlm'.
        // The delegation notes also mentioned 'gemma-4-E2B-it-litert-lm' without extension.
        var modelPath = bundle.path(forResource: "gemma-4-E2B-it", ofType: "litertlm")
        
        if modelPath == nil {
            modelPath = bundle.path(forResource: "gemma-4-E2B-it-litert-lm", ofType: nil)
        }

        guard let finalPath = modelPath else {
            print("Error: LLM model file not found in the bundle.")
            throw GemmaError.modelNotFound
        }

        let options = LlmInference.Options(modelPath: finalPath)
        // Additional options like maxTokens or temperature can be configured here.

        do {
            let inference = try LlmInference(options: options)
            self.llmInference = inference
            return inference
        } catch {
            print("Error: Failed to initialize MediaPipe LlmInference - \(error)")
            throw error
        }
    }
    
    /// Sends a prompt to the LLM and receives a text response asynchronously.
    /// - Parameter prompt: The input prompt for the LLM.
    /// - Returns: The generated response text.
    /// - Throws: An error if the engine fails to initialize or if inference fails.
    func generateResponse(prompt: String) async throws -> String {
        let inference = try setupLLM()

        // Using Task.detached to ensure inference doesn't block the calling thread.
        return try await Task.detached(priority: .userInitiated) {
            do {
                return try inference.generateResponse(inputText: prompt)
            } catch {
                print("Error during LLM inference: \(error)")
                throw error
            }
        }.value
    }
    
    /// Errors specific to the GemmaInferenceService.
    enum GemmaError: Error {
        case modelNotFound
    }
}
