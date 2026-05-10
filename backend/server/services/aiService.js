import OpenAI from 'openai';



export const generateMeetingSummary = async (transcript) => {
    if (!process.env.OPENAI_API_KEY) {
        throw new Error("OPENAI_API_KEY is missing. Please add it to the .env file.");
    }

    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    try {
        const prompt = `
Summarize this meeting professionally.

Also extract:
1. Key decisions
2. Important discussion points
3. Action items with assignees and deadlines.

Respond in JSON format EXACTLY matching this structure:
{
  "summary": "The professional summary text...",
  "actionItems": [
    {
      "task": "Task description",
      "assignee": "Name of assignee",
      "deadline": "Deadline"
    }
  ]
}

Meeting Transcript:
${transcript}
`;

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are an AI meeting assistant. You must respond with valid JSON." },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" },
            temperature: 0.7,
        });

        const result = JSON.parse(response.choices[0].message.content);
        return {
            summary: result.summary || "No summary generated.",
            actionItems: result.actionItems || []
        };

    } catch (error) {
        console.error("OpenAI Error:", error.message);



        if (error.status === 429 || error.code === 'insufficient_quota') {
            console.log(">>> Falling back to Mock Summary due to API Quota/Rate Limit <<<");
            return {
                summary: `(MOCK SUMMARY) The meeting focused on the initial project phase and technical architecture. Key discussion points included the integration of OpenAI for automated summaries and the design of a responsive, light-themed user interface. The team agreed on using a modern palette with blue (#2F46FD) as the primary brand color. [Note: This is a fallback because your OpenAI API quota has been exceeded.]`,
                actionItems: [
                    { task: "Top up OpenAI API balance", assignee: "Admin", deadline: "As soon as possible" },
                    { task: "Finalize UI components for Meeting Room", assignee: "Design Team", deadline: "Friday" },
                    { task: "Implement real-time transcription", assignee: "Engineering", deadline: "Next Week" }
                ]
            };
        }

        throw new Error("Failed to generate AI summary: " + error.message);
    }
};