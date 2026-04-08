import SwiftUI

struct Message: Identifiable {
    let id = UUID()
    let text: String
    let isUser: Bool
}

struct CoachView: View {
    @State private var messages: [Message] = [
        Message(text: "Hello! I'm your MMA Coach. How can I help you with your training today?", isUser: false)
    ]
    @State private var inputText: String = ""
    @State private var isLoading: Bool = false
    private let coachingManager = CoachingManager()

    var body: some View {
        VStack {
            ScrollViewReader { proxy in
                ScrollView {
                    LazyVStack(alignment: .leading, spacing: 12) {
                        ForEach(messages) { message in
                            HStack {
                                if message.isUser { Spacer() }
                                
                                Text(message.text)
                                    .padding(12)
                                    .background(message.isUser ? Color.blue : Color.secondary.opacity(0.2))
                                    .foregroundColor(message.isUser ? .white : .primary)
                                    .cornerRadius(16)
                                    .fixedSize(horizontal: false, vertical: true)
                                
                                if !message.isUser { Spacer() }
                            }
                            .id(message.id)
                        }
                    }
                    .padding()
                }
                .onChange(of: messages.count) { _ in
                    if let lastMessage = messages.last {
                        withAnimation {
                            proxy.scrollTo(lastMessage.id, anchor: .bottom)
                        }
                    }
                }
            }

            if isLoading {
                HStack {
                    ProgressView()
                        .padding(.trailing, 4)
                    Text("Coach is thinking...")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                .padding(.top, 4)
            }

            HStack {
                TextField("Ask about techniques, drills...", text: $inputText)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                    .disabled(isLoading)

                Button(action: sendMessage) {
                    Image(systemName: "paperplane.fill")
                        .font(.system(size: 20))
                }
                .disabled(inputText.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty || isLoading)
            }
            .padding()
        }
        .navigationTitle("MMA Coach")
    }

    private func sendMessage() {
        let userMessage = inputText.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !userMessage.isEmpty else { return }

        messages.append(Message(text: userMessage, isUser: true))
        inputText = ""
        isLoading = true

        Task {
            do {
                let response = try await coachingManager.generateCoachingResponse(userQuery: userMessage)
                await MainActor.run {
                    messages.append(Message(text: response, isUser: false))
                    isLoading = false
                }
            } catch {
                await MainActor.run {
                    messages.append(Message(text: "Sorry, I encountered an error: \(error.localizedDescription)", isUser: false))
                    isLoading = false
                }
            }
        }
    }
}

#Preview {
    NavigationStack {
        CoachView()
    }
}
