import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

export const generateBudgetRecommendations = async (formData) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `As an AI event budget planner, analyze the following college event details and provide budget recommendations:
    Event Name: ${formData.eventName}
    Event Type: ${formData.eventType}
    Expected Attendees: ${formData.expectedAttendees}
    Total Budget: ₹${formData.totalBudget}
    Duration: ${formData.eventDuration} hours
    Additional Requirements: ${formData.additionalRequirements}

    Please provide:
    1. A detailed budget breakdown in Indian Rupees (₹)
    2. Specific recommendations for cost optimization
    3. Suggested vendors or services to consider
    4. Risk factors to account for`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the AI response to extract structured data
    const recommendations = text.split('\n').filter(line => line.trim().length > 0);
    
    return {
      aiRecommendations: recommendations,
      success: true
    };
  } catch (error) {
    console.error('Error generating AI recommendations:', error);
    return {
      aiRecommendations: ['Unable to generate AI recommendations at this time.'],
      success: false
    };
  }
};
