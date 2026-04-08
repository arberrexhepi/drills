// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "MMA-Coach",
    platforms: [
        .iOS(.v17)
    ],
    products: [
        .library(
            name: "MMA-Coach",
            targets: ["MMA-Coach"]),
    ],
    dependencies: [
        .package(url: "https://github.com/google/mediapipe", from: "0.10.0")
    ],
    targets: [
        .target(
            name: "MMA-Coach",
            dependencies: [
                .product(name: "MediaPipeTasksText", package: "mediapipe")
            ],
            path: "Sources",
            resources: [
                .process("Resources")
            ]),
        .testTarget(
            name: "MMA-CoachTests",
            dependencies: ["MMA-Coach"],
            path: "Tests"),
    ]
)