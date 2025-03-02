import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyCL8WV-W4pLwLl7PTmmI3ZZTShADg99Iic");

export const autoAllocateTasksWithAI = async (tasks, members) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `As an AI event planning assistant, analyze these tasks and committee members to create optimal task assignments.

Available Tasks:
${tasks.filter(task => !task.assignedTo).map(task => `
- ID: ${task.id}
  Title: ${task.title}
  Description: ${task.description}
  Category: ${task.category}
  Priority: ${task.priority}`).join('\n')}

Committee Members:
${members.map(member => `
- Name: ${member.name}
  Role: ${member.role}
  Email: ${member.email}`).join('\n')}

Assignment Rules:
1. Match task categories with member roles (e.g., technical tasks to technical leads)
2. Distribute high-priority tasks evenly
3. Balance workload across team members
4. Keep related tasks together when possible

Return ONLY a JSON array with task assignments in this format:
[
  {
    "taskId": "task1",
    "assignedTo": "John Doe"
  }
]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      // Try direct JSON parsing
      return JSON.parse(text);
    } catch (firstError) {
      console.error("Direct JSON parsing failed:", firstError);
      
      // Try to extract JSON from text
      const jsonMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/);
      if (jsonMatch) {
        try {
          const allocations = JSON.parse(jsonMatch[0]);
          console.log("Successfully extracted and parsed JSON:", allocations);
          return allocations;
        } catch (secondError) {
          console.error("Failed to parse extracted JSON:", secondError);
        }
      }
      
      // If all parsing fails, try to create allocations manually
      console.log("Attempting manual allocation from text:", text);
      const lines = text.split('\n');
      const allocations = [];
      
      for (const line of lines) {
        const taskMatch = line.match(/task(\d+|[a-zA-Z]+)/);
        const nameMatch = line.match(/"([^"]+)"|'([^']+)'/);
        
        if (taskMatch && nameMatch) {
          allocations.push({
            taskId: taskMatch[0],
            assignedTo: nameMatch[1] || nameMatch[2]
          });
        }
      }
      
      if (allocations.length > 0) {
        console.log("Manual allocation successful:", allocations);
        return allocations;
      }
      
      // If everything fails, return empty array
      console.error("All parsing attempts failed");
      return [];
    }
  } catch (error) {
    console.error("Error in AI task allocation:", error);
    return [];
  }
};
