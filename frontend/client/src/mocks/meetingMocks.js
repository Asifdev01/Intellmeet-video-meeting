/**
 * Mock meeting data matching the Meeting Mongoose schema:
 * { _id, title, roomId, createdBy: { _id, name, email }, participants, transcript, summary, actionItems, decisionPoints, sentiment, createdAt, updatedAt }
 */

const now = new Date();
const daysAgo = (n) => new Date(now.getTime() - n * 86400000).toISOString();

export const mockMeetings = () => [
    {
        _id: "mock_mtg_001",
        title: "Sprint Planning – Q3 Goals",
        roomId: "demo-room-abc123",
        createdBy: { _id: "mock_user_001", name: "Demo User", email: "demo@intellmeet.app" },
        participants: ["mock_user_001"],
        transcript: "",
        summary: "The team discussed Q3 goals including improving user retention and launching the mobile app. Key metrics were set for engagement tracking.",
        actionItems: [
            { task: "Draft mobile wireframes", assignee: "Design Team", deadline: "Next Monday" },
            { task: "Set up retention analytics", assignee: "Engineering", deadline: "End of sprint" },
        ],
        decisionPoints: ["Prioritize mobile launch over desktop redesign", "Use Mixpanel for analytics"],
        sentiment: "Positive",
        createdAt: daysAgo(2),
        updatedAt: daysAgo(2),
    },
    {
        _id: "mock_mtg_002",
        title: "Client Check-in – Acme Corp",
        roomId: "demo-room-def456",
        createdBy: { _id: "mock_user_001", name: "Demo User", email: "demo@intellmeet.app" },
        participants: ["mock_user_001"],
        transcript: "",
        summary: "",
        actionItems: [],
        decisionPoints: [],
        sentiment: "Neutral",
        createdAt: daysAgo(5),
        updatedAt: daysAgo(5),
    },
    {
        _id: "mock_mtg_003",
        title: "Design Review – Dashboard V2",
        roomId: "demo-room-ghi789",
        createdBy: { _id: "mock_user_001", name: "Demo User", email: "demo@intellmeet.app" },
        participants: ["mock_user_001"],
        transcript: "",
        summary: "Reviewed the updated dashboard designs. The team approved the new sidebar layout and card-based analytics widgets.",
        actionItems: [
            { task: "Implement sidebar toggle animation", assignee: "Frontend", deadline: "Wednesday" },
        ],
        decisionPoints: ["Use card-based layout for analytics"],
        sentiment: "Positive",
        createdAt: daysAgo(8),
        updatedAt: daysAgo(8),
    },
];
