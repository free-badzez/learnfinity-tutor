
// This service handles the interaction with Google's Gemini API

interface QuestionResponse {
  question: string;
  answer: string;
  explanation: string;
}

// Store API key (for demonstration - in production, this would be securely managed)
let apiKey = "";

// Function to set the API key
export const setGeminiApiKey = (key: string) => {
  apiKey = key;
  // Store the API key in local storage for persistence
  localStorage.setItem("gemini_api_key", key);
};

// Function to get the API key
export const getGeminiApiKey = () => {
  if (!apiKey) {
    // Try to get from localStorage if not already set
    apiKey = localStorage.getItem("gemini_api_key") || "";
  }
  return apiKey;
};

// Function to check if API key is set
export const hasGeminiApiKey = () => {
  return !!getGeminiApiKey();
};

// Function to ask a question to Gemini
export const askGemini = async (question: string): Promise<string> => {
  try {
    // Use Supabase Edge Function to call Gemini API
    const { createClient } = await import('@supabase/supabase-js');
    
    // Get Supabase URL and anon key from environment variables
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ahaupfnvqfhchptxbddl.supabase.co';
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFoYXVwZm52cWZoY2hwdHhiZGRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ2NTcxMzcsImV4cCI6MjAzMDIzMzEzN30.Vxwgq1EYiF3kgm-e4RZ8TfARfOgOlJOKJJMCCYQ47RY';
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    const { data, error } = await supabase.functions.invoke('ask-gemini', {
      body: { question }
    });
    
    if (error) {
      console.error("Edge function error:", error);
      throw new Error(error.message);
    }
    
    if (!data || !data.answer) {
      throw new Error("No answer received from AI");
    }
    
    return data.answer;
  } catch (error) {
    console.error("Error asking Gemini:", error);
    throw error;
  }
};

export const generateMathQuestions = async (
  topic: string,
  difficulty: "Easy" | "Medium" | "Hard",
  count: number = 5
): Promise<QuestionResponse[]> => {
  console.log(`Generating ${count} ${difficulty} questions for ${topic}`);
  
  // If no API key is set, use the simulated response
  if (!apiKey) {
    return simulateQuestions(topic, difficulty, count);
  }
  
  try {
    const prompt = `Generate ${count} ${difficulty} level math questions about ${topic} with answers and explanations. 
    Format the response as a JSON array of objects with each object having question, answer, and explanation properties.`;
    
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

// Simulated response function (kept from original implementation for fallback)
const simulateQuestions = (
  topic: string,
  difficulty: "Easy" | "Medium" | "Hard",
  count: number
): Promise<QuestionResponse[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate simulated questions based on topic and difficulty
      const questions: QuestionResponse[] = [];
      
      for (let i = 0; i < count; i++) {
        if (topic === "Algebra") {
          if (difficulty === "Easy") {
            questions.push({
              question: `Solve for x: ${Math.floor(Math.random() * 10)}x + ${Math.floor(Math.random() * 10)} = ${Math.floor(Math.random() * 30)}`,
              answer: `${Math.floor(Math.random() * 10)}`,
              explanation: `Step 1: Move the constant to the right side\nStep 2: Divide both sides by the coefficient of x`
            });
          } else if (difficulty === "Medium") {
            questions.push({
              question: `Solve the quadratic equation: ${Math.floor(Math.random() * 5) + 1}x² + ${Math.floor(Math.random() * 10)}x + ${Math.floor(Math.random() * 10)} = 0`,
              answer: `x = ${Math.floor(Math.random() * 5) - 2}, ${Math.floor(Math.random() * 5) - 2}`,
              explanation: `Use the quadratic formula x = (-b ± √(b² - 4ac)) / 2a\nSubstitute the values and solve`
            });
          } else {
            questions.push({
              question: `Find all values of x that satisfy: |${Math.floor(Math.random() * 5) + 1}x - ${Math.floor(Math.random() * 10)}| > ${Math.floor(Math.random() * 15)}`,
              answer: `x < ${Math.floor(Math.random() * 5) - 10} or x > ${Math.floor(Math.random() * 10) + 5}`,
              explanation: `Step 1: Set up the two cases based on the absolute value\nStep 2: Solve each inequality`
            });
          }
        } else if (topic === "Geometry") {
          if (difficulty === "Easy") {
            questions.push({
              question: `Find the area of a rectangle with length ${Math.floor(Math.random() * 10) + 5} units and width ${Math.floor(Math.random() * 10) + 3} units.`,
              answer: `${(Math.floor(Math.random() * 10) + 5) * (Math.floor(Math.random() * 10) + 3)} square units`,
              explanation: `Area of rectangle = length × width\nSubstitute the values and multiply`
            });
          } else if (difficulty === "Medium") {
            questions.push({
              question: `Find the volume of a cone with radius ${Math.floor(Math.random() * 5) + 3} units and height ${Math.floor(Math.random() * 10) + 5} units. Use π = 3.14.`,
              answer: `${Math.floor(((Math.floor(Math.random() * 5) + 3) ** 2 * (Math.floor(Math.random() * 10) + 5) * 3.14) / 3)} cubic units`,
              explanation: `Volume of a cone = (1/3) × π × r² × h\nSubstitute the values and calculate`
            });
          } else {
            questions.push({
              question: `In triangle ABC, angle A = ${Math.floor(Math.random() * 30) + 30}°, angle B = ${Math.floor(Math.random() * 30) + 40}°, and side c = ${Math.floor(Math.random() * 10) + 8} units. Find the area of the triangle using the law of sines.`,
              answer: `${Math.floor(Math.random() * 50) + 30} square units`,
              explanation: `Step 1: Find angle C using the fact that angles in a triangle sum to 180°\nStep 2: Use the formula Area = (1/2) × c × a × sin(B)`
            });
          }
        } else if (topic === "Calculus") {
          if (difficulty === "Easy") {
            questions.push({
              question: `Find the derivative of f(x) = ${Math.floor(Math.random() * 5) + 1}x^${Math.floor(Math.random() * 3) + 2} + ${Math.floor(Math.random() * 10)}x.`,
              answer: `f'(x) = ${(Math.floor(Math.random() * 5) + 1) * (Math.floor(Math.random() * 3) + 2)}x^${Math.floor(Math.random() * 3) + 1} + ${Math.floor(Math.random() * 10)}`,
              explanation: `Use the power rule: d/dx(x^n) = n×x^(n-1)\nApply to each term and simplify`
            });
          } else if (difficulty === "Medium") {
            questions.push({
              question: `Evaluate the indefinite integral ∫(${Math.floor(Math.random() * 5) + 1}x^${Math.floor(Math.random() * 2) + 1} + ${Math.floor(Math.random() * 10)}e^x) dx.`,
              answer: `${Math.floor(Math.random() * 5) + 1}x^${Math.floor(Math.random() * 2) + 2}/${Math.floor(Math.random() * 2) + 2} + ${Math.floor(Math.random() * 10)}e^x + C`,
              explanation: `For x^n, the integral is x^(n+1)/(n+1)\nFor e^x, the integral is e^x\nAdd the constant of integration C`
            });
          } else {
            questions.push({
              question: `Find the local extrema of the function f(x) = ${Math.floor(Math.random() * 5) + 1}x^3 - ${Math.floor(Math.random() * 10) + 5}x^2 + ${Math.floor(Math.random() * 15) + 10}x - ${Math.floor(Math.random() * 10)}`,
              answer: `Local minimum at x = ${Math.floor(Math.random() * 2) + 1}, local maximum at x = ${Math.floor(Math.random() * 3) + 3}`,
              explanation: `Step 1: Find f'(x) and set it equal to 0\nStep 2: Solve for x\nStep 3: Determine whether each critical point is a maximum or minimum using the second derivative test`
            });
          }
        } else {
          // Default questions for other topics
          questions.push({
            question: `Question ${i + 1} for ${topic} (${difficulty} difficulty)`,
            answer: `Answer for question ${i + 1}`,
            explanation: `This is a detailed explanation for question ${i + 1} in the ${topic} category.`
          });
        }
      }
      
      resolve(questions);
    }, 1500); // Simulate API delay
  });
};
