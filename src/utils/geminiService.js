import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(
  import.meta.env.VITE_REACT_APP_GEMINI_API_KEY
);

export const generateTasksAndBudgetRecommendations = async (
  projectDetails,
  teamMembers
) => {
  try {
    console.log("Starting task generation with:", {
      projectDetails,
      teamMembers,
    });

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const taskPrompt = `Based on these project details and team members, generate tasks:

Project: ${projectDetails.title}
Description: ${projectDetails.description}
Start Date: ${projectDetails.startDate}
End Date: ${projectDetails.endDate}

Team Members:
${teamMembers
  .map(
    (m) =>
      `- ${m.name}: ${m.role}, Skills: ${m.expertise.join(", ")}`
  )
  .join("\n")}

Generate a JSON response with tasks in this exact format:
{
  "tasks": [
    {
      "id": "task1",
      "title": "Task Title",
      "description": "Task Description",
      "assignedTo": "Team Member Name",
      "deadline": "YYYY-MM-DD",
      "priority": "high/medium/low",
      "estimatedHours": 8,
      "requiredSkills": ["skill1", "skill2"],
      "dependencies": []
    }
  ]
}

Rules:
1. Assign tasks based on team member skills and use their name for assignedTo
2. Set realistic deadlines between ${projectDetails.startDate} and ${projectDetails.endDate}
3. Return ONLY the JSON object, no other text`;

    console.log("Sending prompt to Gemini API:", taskPrompt);

    const taskResult = await model.generateContent(taskPrompt);
    const taskResponse = await taskResult.response;
    const taskText = taskResponse.text();

    console.log("Raw API response:", taskText);

    // Try to find a JSON object in the response
    const taskJsonMatch = taskText.match(/\{[\s\S]*\}/);
    if (!taskJsonMatch) {
      console.error("No JSON found in response");
      throw new Error("Failed to generate valid tasks");
    }

    const taskJsonStr = taskJsonMatch[0];
    console.log("Extracted JSON string:", taskJsonStr);

    const tasks = JSON.parse(taskJsonStr);
    console.log("Parsed tasks:", tasks);

    if (!tasks.tasks || !Array.isArray(tasks.tasks)) {
      console.error("Invalid tasks structure");
      throw new Error("Invalid task structure received from AI");
    }

    // Add required fields if missing
    tasks.tasks = tasks.tasks.map((task) => ({
      ...task,
      requiredSkills: task.requiredSkills || [],
      dependencies: task.dependencies || [],
    }));

    return tasks;
  } catch (error) {
    console.error("Error in task generation:", error);
    throw error;
  }
};