import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

const sampleResponse = {
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

export const generateTasks = async (projectDetails, teamMembers) => {
  try {
    console.log('Starting task generation with:', { projectDetails, teamMembers });

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Based on these project details and team members, generate tasks:

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

    console.log('Sending prompt to Gemini API:', prompt);

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log('Raw API response:', text);

      // Try to find a JSON object in the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error('No JSON found in response');
        return sampleResponse; // Fallback to sample response for testing
      }
      
      const jsonStr = jsonMatch[0];
      console.log('Extracted JSON string:', jsonStr);

      try {
        const tasks = JSON.parse(jsonStr);
        console.log('Parsed tasks:', tasks);

        if (!tasks.tasks || !Array.isArray(tasks.tasks)) {
          console.error('Invalid tasks structure');
          return sampleResponse; // Fallback to sample response for testing
        }

        // Add progress field and ensure required fields
        tasks.tasks = tasks.tasks.map(task => ({
          ...task,
          progress: 0,
          requiredSkills: task.requiredSkills || [],
          dependencies: task.dependencies || []
        }));

        return tasks;
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        return sampleResponse; // Fallback to sample response for testing
      }
    } catch (apiError) {
      console.error('API call error:', apiError);
      return sampleResponse; // Fallback to sample response for testing
    }
  } catch (error) {
    console.error('Top level error:', error);
    return sampleResponse; // Fallback to sample response for testing
  }
};
