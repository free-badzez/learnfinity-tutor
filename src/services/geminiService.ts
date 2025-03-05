// This service handles the interaction with Google's Gemini API

interface QuestionResponse {
  question: string;
  answer: string;
  explanation: string;
  options?: string[]; // Added for MCQ format
}

// Hardcoded API key
const GEMINI_API_KEY = "AIzaSyCFkxznxuMjikL7o-QLmCPTh7mfhyoIaR8";

// Function to check if API key is set
export const hasGeminiApiKey = () => {
  return true; // Always true because the key is hardcoded
};

export const generateMathQuestions = async (
  topic: string,
  difficulty: "Easy" | "Medium" | "Hard",
  count: number = 5
): Promise<QuestionResponse[]> => {
  console.log(`Generating ${count} ${difficulty} questions for ${topic}`);

  try {
    const prompt = `Generate ${count} ${difficulty} level math questions about ${topic} with answers, explanations, and multiple-choice options. 
    Format the response as a JSON array of objects with each object having:
    1. question: the full question text
    2. options: an array of 4 possible answers (including the correct one)
    3. answer: the correct answer (should match one of the options)
    4. explanation: detailed step-by-step explanation of the solution

    The questions should be suitable for ${difficulty} level and focus specifically on ${topic}.`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,{
    method: "POST",
    headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.4,
          topK: 32,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      }),
    });
    console.log("API response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", errorText);
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const textContent = data.candidates[0].content.parts[0].text;

    // Extract JSON from the response (it may be wrapped in text or code blocks)
    let jsonMatch = textContent.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("Could not parse response as JSON array");
    }

    const questions = JSON.parse(jsonMatch[0]) as QuestionResponse[];
    return questions.slice(0, count); // Ensure we only return the requested number
  } catch (error) {
    console.error("Error generating questions with Gemini:", error);
    throw error; // Throw the error instead of falling back to predefined questions
  }
};

// Function to get step-by-step solution for a math problem using Gemini
export const solveMathProblem = async (problem: string): Promise<string> => {
  try {
    const prompt = `Solve this mathematics problem with detailed step-by-step explanation:
    ${problem}
    
    Be very thorough in your explanation, showing each mathematical step clearly and explaining the reasoning. Write the final answer clearly at the end.`;

    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GEMINI_API_KEY}`,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          topK: 32,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", errorText);
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error solving problem with Gemini:", error);
    throw error; // Throw the error instead of providing a fallback message
  }
};
