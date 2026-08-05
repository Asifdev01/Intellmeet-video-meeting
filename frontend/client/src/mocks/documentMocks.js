/**
 * Mock document data matching the Document Mongoose schema:
 * { _id, title, summary, actionItems, decisionPoints, sentiment, createdBy, createdAt, updatedAt }
 */

const now = new Date();
const daysAgo = (n) => new Date(now.getTime() - n * 86400000).toISOString();

export const mockDocuments = () => [
    {
        _id: "mock_doc_001",
        title: "Sprint Planning – Q3 Goals",
        summary: "The team discussed Q3 goals including improving user retention and launching the mobile app. Key metrics were set for engagement tracking.",
        actionItems: [
            { task: "Draft mobile wireframes", assignee: "Design Team", deadline: "Next Monday" },
            { task: "Set up retention analytics", assignee: "Engineering", deadline: "End of sprint" },
        ],
        decisionPoints: ["Prioritize mobile launch over desktop redesign", "Use Mixpanel for analytics"],
        sentiment: "Positive",
        createdBy: "mock_user_001",
        createdAt: daysAgo(2),
        updatedAt: daysAgo(2),
    },
    {
        _id: "mock_doc_002",
        title: "Design Review – Dashboard V2",
        summary: "Reviewed the updated dashboard designs. The team approved the new sidebar layout and card-based analytics widgets.",
        actionItems: [
            { task: "Implement sidebar toggle animation", assignee: "Frontend", deadline: "Wednesday" },
        ],
        decisionPoints: ["Use card-based layout for analytics"],
        sentiment: "Positive",
        createdBy: "mock_user_001",
        createdAt: daysAgo(8),
        updatedAt: daysAgo(8),
    },
];
