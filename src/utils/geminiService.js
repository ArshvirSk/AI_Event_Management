import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_REACT_APP_GEMINI_API_KEY);

const sampleTaskResponse = {
  "tasks": [
    {
      "id": "task1",
      "title": "Project Setup",
      "description": "Initial project setup and repository creation",
      "assignedTo": "team@example.com",
      "deadline": "2024-03-01",
      "priority": "high",
      "estimatedHours": 8,
      "requiredSkills": ["project management"],
      "dependencies": []
    }
  ]
};

const sampleBudgetResponse = {
  aiRecommendations: ['Unable to generate AI recommendations at this time.'],
  success: false
};

export const generateTasksAndBudgetRecommendations = async (projectDetails, teamMembers, formData) => {
  try {
    console.log('Starting task generation with:', { projectDetails, teamMembers });

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const taskPrompt = `Based on these project details and team members, generate tasks:

Project: ${projectDetails.title}
Description: ${projectDetails.description}
Start Date: ${projectDetails.startDate}
End Date: ${projectDetails.endDate}

Team Members:
${teamMembers.map(m => `- ${m.name} (${m.email}): ${m.role}, Skills: ${m.expertise.join(', ')}`).join('\n')}

Generate a JSON response with tasks in this exact format:
{
  "tasks": [
    {
      "id": "task1",
      "title": "Task Title",
      "description": "Task Description",
      "assignedTo": "team.member@email.com",
      "deadline": "YYYY-MM-DD",
      "priority": "high/medium/low",
      "estimatedHours": 8,
      "requiredSkills": ["skill1", "skill2"],
      "dependencies": []
    }
  ]
}

Rules:
1. Assign tasks based on team member skills
2. Set realistic deadlines between ${projectDetails.startDate} and ${projectDetails.endDate}
3. Return ONLY the JSON object, no other text`;

    console.log('Sending prompt to Gemini API:', taskPrompt);

    try {
      const taskResult = await model.generateContent(taskPrompt);
      const taskResponse = await taskResult.response;
      const taskText = taskResponse.text();
      
      console.log('Raw API response:', taskText);

      // Try to find a JSON object in the response
      const taskJsonMatch = taskText.match(/\{[\s\S]*\}/);
      if (!taskJsonMatch) {
        console.error('No JSON found in response');
        return { tasks: sampleTaskResponse, budgetRecommendations: sampleBudgetResponse };
      }
      
      const taskJsonStr = taskJsonMatch[0];
      console.log('Extracted JSON string:', taskJsonStr);

      try {
        const tasks = JSON.parse(taskJsonStr);
        console.log('Parsed tasks:', tasks);

        if (!tasks.tasks || !Array.isArray(tasks.tasks)) {
          console.error('Invalid tasks structure');
          return { tasks: sampleTaskResponse, budgetRecommendations: sampleBudgetResponse };
        }

        // Add progress field and ensure required fields
        tasks.tasks = tasks.tasks.map(task => ({
          ...task,
          progress: 0,
          requiredSkills: task.requiredSkills || [],
          dependencies: task.dependencies || []
        }));

        const budgetPrompt = `As an AI event budget planner, analyze the following college event details and provide budget recommendations:
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

        const budgetResult = await model.generateContent(budgetPrompt);
        const budgetResponse = await budgetResult.response;
        const budgetText = budgetResponse.text();
        
        // Parse the AI response to extract structured data
        const budgetRecommendations = budgetText.split('\n').filter(line => line.trim().length > 0);
        
        return {
          tasks,
          budgetRecommendations: {
            aiRecommendations: budgetRecommendations,
            success: true
          }
        };
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        return { tasks: sampleTaskResponse, budgetRecommendations: sampleBudgetResponse };
      }
    } catch (apiError) {
      console.error('API call error:', apiError);
      return { tasks: sampleTaskResponse, budgetRecommendations: sampleBudgetResponse };
    }
  } catch (error) {
    console.error('Error in task generation:', error);
    return { tasks: sampleTaskResponse, budgetRecommendations: sampleBudgetResponse };
  }
};
