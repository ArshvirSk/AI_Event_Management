import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyCL8WV-W4pLwLl7PTmmI3ZZTShADg99Iic");

export const generateEventIdeasWithAI = async (filters) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Act as an experienced event planner and generate creative event ideas. Consider these preferences (but they are flexible):
    ${filters.theme ? `- Theme/Keywords: ${filters.theme}` : ''}
    - Approximate Budget Range: $${filters.budget[0]} - $${filters.budget[1]}
    - Target Attendance: ${filters.attendees[0]} - ${filters.attendees[1]} people
    ${filters.eventType !== 'all' ? `- Preferred Event Type: ${filters.eventType}` : ''}
    ${filters.season !== 'any' ? `- Preferred Season: ${filters.season}` : ''}

    Generate 3-5 unique and creative event ideas. For each event, include:
    1. title: A catchy name for the event
    2. description: A compelling description (2-3 sentences)
    3. features: An array of 3-4 key highlights or activities
    4. estimatedBudget: A reasonable cost estimate within or near the budget range
    5. expectedAttendees: Expected attendance within or near the target range
    6. type: The event category (conference/workshop/hackathon/cultural/technical/social/corporate)
    7. season: Recommended season (spring/summer/fall/winter/any)

    Format your response as a JSON array. Be creative and don't be too strict with the preferences - suggest interesting ideas that are in the general ballpark. Example format:
    [
      {
        "title": "Event Name",
        "description": "Event description here",
        "features": ["Feature 1", "Feature 2", "Feature 3"],
        "estimatedBudget": 30000,
        "expectedAttendees": 200,
        "type": "conference",
        "season": "summer"
      }
    ]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      // First try direct JSON parsing
      const ideas = JSON.parse(text);
      return ideas.map((idea) => ({
        ...idea,
        id: Math.random().toString(36).substr(2, 9),
      }));
    } catch (error) {
      console.error("Error parsing direct JSON, attempting to extract JSON:", error);
      
      // Try to extract JSON from the text using regex
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        try {
          const ideas = JSON.parse(jsonMatch[0]);
          return ideas.map((idea) => ({
            ...idea,
            id: Math.random().toString(36).substr(2, 9),
          }));
        } catch (error) {
          console.error("Error parsing extracted JSON:", error);
        }
      }

      // If all parsing fails, create a structured response from the text
      return [{
        id: Math.random().toString(36).substr(2, 9),
        title: "AI-Generated Event",
        description: text.substring(0, 200) + "...",
        features: ["AI-generated content"],
        estimatedBudget: filters.budget[0],
        expectedAttendees: filters.attendees[0],
        type: filters.eventType === 'all' ? 'conference' : filters.eventType,
        season: filters.season === 'any' ? 'summer' : filters.season
      }];
    }
  } catch (error) {
    console.error("Error generating ideas with AI:", error);
    return [];
  }
};
