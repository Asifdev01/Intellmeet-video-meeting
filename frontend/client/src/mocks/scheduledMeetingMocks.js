/**
 * Mock scheduled meeting data matching the ScheduledMeeting Mongoose schema:
 * { _id, title, date, time, participants, meetingLink, createdBy, createdAt, updatedAt }
 */

const tomorrow = new Date(Date.now() + 86400000);
const nextWeek = new Date(Date.now() + 7 * 86400000);

const formatDate = (d) => d.toISOString().split("T")[0];

export const mockScheduledMeetings = () => [
    {
        _id: "mock_sched_001",
        title: "Weekly Team Standup",
        date: formatDate(tomorrow),
        time: "10:00",
        participants: [],
        meetingLink: `http://localhost:5173/meeting/demo-standup-${Date.now()}`,
        createdBy: "mock_user_001",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        _id: "mock_sched_002",
        title: "Client Review – Project Alpha",
        date: formatDate(nextWeek),
        time: "14:30",
        participants: [],
        meetingLink: `http://localhost:5173/meeting/demo-review-${Date.now()}`,
        createdBy: "mock_user_001",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];
