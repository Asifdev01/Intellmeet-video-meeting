/**
 * Mock analytics data — computed client-side in future from real meetings/documents.
 * This file provides fallback data if the computation can't run (e.g., empty arrays).
 */

export const mockAnalytics = () => ({
    totalMeetings: 12,
    totalDocuments: 5,
    totalScheduled: 3,
    avgParticipants: 3.2,
    sentimentBreakdown: {
        Positive: 7,
        Neutral: 3,
        Negative: 2,
    },
    meetingsPerWeek: [
        { week: "Week 1", count: 3 },
        { week: "Week 2", count: 5 },
        { week: "Week 3", count: 2 },
        { week: "Week 4", count: 4 },
    ],
});
