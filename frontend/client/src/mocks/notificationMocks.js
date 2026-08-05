/**
 * Mock notification data — used as fallback for the in-app notification dropdown.
 * These are ephemeral (browser Notification API + socket events), no Mongoose model needed.
 */

const now = new Date();
const minsAgo = (n) => new Date(now.getTime() - n * 60000).toISOString();

export const mockNotifications = () => [
    {
        id: "mock_notif_001",
        type: "meeting_join",
        message: "Alice joined your meeting 'Sprint Planning'",
        read: false,
        createdAt: minsAgo(5),
    },
    {
        id: "mock_notif_002",
        type: "ai_summary",
        message: "AI Summary generated for 'Design Review'",
        read: true,
        createdAt: minsAgo(60),
    },
    {
        id: "mock_notif_003",
        type: "scheduled",
        message: "Reminder: 'Weekly Standup' starts in 15 minutes",
        read: false,
        createdAt: minsAgo(15),
    },
];
