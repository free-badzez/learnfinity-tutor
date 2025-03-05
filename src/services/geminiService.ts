
// This service handles the interaction with Google's Gemini API
import { supabase } from "@/integrations/supabase/client";

interface QuestionResponse {
  question: string;
  answer: string;
  explanation: string;
  options?: string[]; // Added for MCQ format
}

// Store API key (for demonstration - in production, this would be securely managed)
let apiKey = "";

// Function to set the Gemini API key
export const setGeminiApiKey = (key: string) => {
  apiKey = key;
};

// Function to fetch the API key from Supabase
export const fetchGeminiApiKey = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('fetch-gemini-key', {
      method: 'GET',
    });
    
    if (error) throw error;
    
    if (data && data.apiKey) {
      setGeminiApiKey(data.apiKey);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error fetching Gemini API key:", error);
    return false;
  }
};

// Function to check if API key is set
export const hasGeminiApiKey = () => {
  return !!apiKey;
};

export const generateMathQuestions = async (
  topic: string,
  difficulty: "Easy" | "Medium" | "Hard",
  count: number = 5
): Promise<QuestionResponse[]> => {
  console.log(`Generating ${count} ${difficulty} questions for ${topic}`);
  
  // If no API key is set, use the simulated response
  if (!apiKey) {
    // Try to fetch from Supabase
    const success = await fetchGeminiApiKey();
    if (!success) {
      return simulateQuestions(topic, difficulty, count);
    }
  }
  
  try {
    const prompt = `Generate ${count} ${difficulty} level math questions about ${topic} with answers, explanations, and multiple-choice options. 
    Format the response as a JSON array of objects with each object having:
    1. question: the full question text
    2. options: an array of 4 possible answers (including the correct one)
    3. answer: the correct answer (should match one of the options)
    4. explanation: detailed step-by-step explanation of the solution

    The questions should be suitable for ${difficulty} level and focus specifically on ${topic}.`;
    
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.4,
          topK: 32,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      })
    });
    
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
    // Fallback to simulated questions if API fails
    return simulateQuestions(topic, difficulty, count);
  }
};

// Function to get step-by-step solution for a math problem using Gemini
export const solveMathProblem = async (problem: string): Promise<string> => {
  if (!apiKey) {
    // Try to fetch from Supabase
    const success = await fetchGeminiApiKey();
    if (!success) {
      return "I'm currently unable to solve this problem as the AI service is unavailable. Please try again later.";
    }
  }
  
  try {
    const prompt = `Solve this mathematics problem with detailed step-by-step explanation:
    ${problem}
    
    Be very thorough in your explanation, showing each mathematical step clearly and explaining the reasoning. Write the final answer clearly at the end.`;
    
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          topK: 32,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      })
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
    return "I encountered an error while trying to solve this problem. Please check your internet connection or try again later.";
  }
};

// Simulated response function (kept from original implementation for fallback)
const simulateQuestions = (
  topic: string,
  difficulty: "Easy" | "Medium" | "Hard",
  count: number
): Promise<QuestionResponse[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate simulated MCQ questions based on topic and difficulty
      const questions: QuestionResponse[] = [];
      
      for (let i = 0; i < count; i++) {
        if (topic === "Algebra") {
          if (difficulty === "Easy") {
            questions.push({
              question: `Solve for x: ${Math.floor(Math.random() * 10)}x + ${Math.floor(Math.random() * 10)} = ${Math.floor(Math.random() * 30)}`,
              options: ["x = 2", "x = 3", "x = 4", "x = 5"],
              answer: "x = 3",
              explanation: `Step 1: Move the constant to the right side\nStep 2: Divide both sides by the coefficient of x`
            });
          } else if (difficulty === "Medium") {
            questions.push({
              question: `Solve the quadratic equation: ${Math.floor(Math.random() * 5) + 1}x² + ${Math.floor(Math.random() * 10)}x + ${Math.floor(Math.random() * 10)} = 0`,
              options: ["x = 2, -3", "x = 1, -4", "x = -1, -2", "x = 3, -5"],
              answer: "x = 1, -4",
              explanation: `Use the quadratic formula x = (-b ± √(b² - 4ac)) / 2a\nSubstitute the values and solve`
            });
          } else {
            questions.push({
              question: `Find all values of x that satisfy: |${Math.floor(Math.random() * 5) + 1}x - ${Math.floor(Math.random() * 10)}| > ${Math.floor(Math.random() * 15)}`,
              options: ["x < -2 or x > 5", "x < -3 or x > 4", "x < -5 or x > 2", "x < -1 or x > 6"],
              answer: "x < -3 or x > 4",
              explanation: `Step 1: Set up the two cases based on the absolute value\nStep 2: Solve each inequality`
            });
          }
        } else if (topic === "Geometry") {
          if (difficulty === "Easy") {
            questions.push({
              question: `Find the area of a rectangle with length ${Math.floor(Math.random() * 10) + 5} units and width ${Math.floor(Math.random() * 10) + 3} units.`,
              options: ["45 sq units", "48 sq units", "52 sq units", "56 sq units"],
              answer: "48 sq units",
              explanation: `Area of rectangle = length × width\nSubstitute the values and multiply`
            });
          } else if (difficulty === "Medium") {
            questions.push({
              question: `Find the volume of a cone with radius ${Math.floor(Math.random() * 5) + 3} units and height ${Math.floor(Math.random() * 10) + 5} units. Use π = 3.14.`,
              options: ["78.5 cubic units", "104.7 cubic units", "157.0 cubic units", "209.3 cubic units"],
              answer: "157.0 cubic units",
              explanation: `Volume of a cone = (1/3) × π × r² × h\nSubstitute the values and calculate`
            });
          } else {
            questions.push({
              question: `In triangle ABC, angle A = ${Math.floor(Math.random() * 30) + 30}°, angle B = ${Math.floor(Math.random() * 30) + 40}°, and side c = ${Math.floor(Math.random() * 10) + 8} units. Find the area of the triangle using the law of sines.`,
              options: ["24.6 sq units", "32.8 sq units", "41.2 sq units", "48.5 sq units"],
              answer: "32.8 sq units",
              explanation: `Step 1: Find angle C using the fact that angles in a triangle sum to 180°\nStep 2: Use the formula Area = (1/2) × c × a × sin(B)`
            });
          }
        } else if (topic === "Calculus") {
          if (difficulty === "Easy") {
            questions.push({
              question: `Find the derivative of f(x) = ${Math.floor(Math.random() * 5) + 1}x^${Math.floor(Math.random() * 3) + 2} + ${Math.floor(Math.random() * 10)}x.`,
              options: ["f'(x) = 6x + 4", "f'(x) = 9x² + 7", "f'(x) = 12x + 8", "f'(x) = 6x² + 7"],
              answer: "f'(x) = 6x + 4",
              explanation: `Use the power rule: d/dx(x^n) = n×x^(n-1)\nApply to each term and simplify`
            });
          } else if (difficulty === "Medium") {
            questions.push({
              question: `Evaluate the indefinite integral ∫(${Math.floor(Math.random() * 5) + 1}x^${Math.floor(Math.random() * 2) + 1} + ${Math.floor(Math.random() * 10)}e^x) dx.`,
              options: ["x³/3 + 5e^x + C", "2x²/2 + 7e^x + C", "3x³/3 + 6e^x + C", "x²/2 + 4e^x + C"],
              answer: "x²/2 + 4e^x + C",
              explanation: `For x^n, the integral is x^(n+1)/(n+1)\nFor e^x, the integral is e^x\nAdd the constant of integration C`
            });
          } else {
            questions.push({
              question: `Find the local extrema of the function f(x) = ${Math.floor(Math.random() * 5) + 1}x^3 - ${Math.floor(Math.random() * 10) + 5}x^2 + ${Math.floor(Math.random() * 15) + 10}x - ${Math.floor(Math.random() * 10)}`,
              options: [
                "Local min at x = 1, local max at x = 3", 
                "Local min at x = 2, local max at x = 5",
                "Local min at x = 1.5, local max at x = 4",
                "Local min at x = 2.5, local max at x = 6"
              ],
              answer: "Local min at x = 1, local max at x = 3",
              explanation: `Step 1: Find f'(x) and set it equal to 0\nStep 2: Solve for x\nStep 3: Determine whether each critical point is a maximum or minimum using the second derivative test`
            });
          }
        } else {
          // Default questions for other topics
          questions.push({
            question: `Question ${i + 1} for ${topic} (${difficulty} difficulty)`,
            options: [`Option A`, `Option B`, `Option C`, `Option D`],
            answer: `Option B`,
            explanation: `This is a detailed explanation for question ${i + 1} in the ${topic} category.`
          });
        }
      }
      
      resolve(questions);
    }, 1500); // Simulate API delay
  });
};
