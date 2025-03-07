
// This service handles the interaction with Google's Gemini API

interface QuestionResponse {
  question: string;
  answer: string;
  explanation: string;
  options?: string[];
}

// Local storage key for Gemini API key (for UI state only)
const GEMINI_API_KEY_STORAGE_KEY = 'gemini_api_key';

// Check if Gemini API key exists in local storage
export const hasGeminiApiKey = (): boolean => {
  // This function is kept for UI state purposes
  if (typeof window !== 'undefined' && window.localStorage) {
    return !!localStorage.getItem(GEMINI_API_KEY_STORAGE_KEY);
  }
  return false;
};

// Get Gemini API key from local storage
export const getGeminiApiKey = (): string | null => {
  // This function is kept for UI state purposes
  if (typeof window !== 'undefined' && window.localStorage) {
    return localStorage.getItem(GEMINI_API_KEY_STORAGE_KEY);
  }
  return null;
};

// Set Gemini API key in local storage
export const setGeminiApiKey = (apiKey: string): void => {
  // This function is kept for UI state purposes
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem(GEMINI_API_KEY_STORAGE_KEY, apiKey);
  }
};

// Function to ask a question to Gemini
export const askGemini = async (question: string): Promise<string> => {
  try {
    // Use Supabase Edge Function to call Gemini API
    const { createClient } = await import('@supabase/supabase-js');
    
    // Get Supabase URL and anon key from environment variables
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ukedswaxpldombgjilvl.supabase.co';
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrZWRzd2F4cGxkb21iZ2ppbHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNjk5OTksImV4cCI6MjA1Njg0NTk5OX0.J1S8icZKmQwYQkcVOFYqTJSP7x0n0mGV-GIdJJVZwXY';
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    console.log("Calling ask-gemini edge function with question:", question);
    
    // Call the edge function with the correct name
    const { data, error } = await supabase.functions.invoke('ask-gemini', {
      body: { question }
    });
    
    if (error) {
      console.error("Edge function error:", error);
      throw new Error(error.message || "Failed to get response from edge function");
    }
    
    if (!data || !data.answer) {
      throw new Error("No answer received from AI");
    }
    
    console.log("Received answer from Gemini");
    return data.answer;
  } catch (error) {
    console.error("Error asking Gemini:", error);
    throw error;
  }
};

export const generateMathQuestions = async (
  topic: string,
  difficulty: string,
  count: number = 5
): Promise<QuestionResponse[]> => {
  console.log(`Generating ${count} ${difficulty} questions for ${topic}`);
  
  try {
    // Use Supabase Edge Function to call Gemini API
    const { createClient } = await import('@supabase/supabase-js');
    
    // Get Supabase URL and anon key from environment variables
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ukedswaxpldombgjilvl.supabase.co';
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrZWRzd2F4cGxkb21iZ2ppbHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNjk5OTksImV4cCI6MjA1Njg0NTk5OX0.J1S8icZKmQwYQkcVOFYqTJSP7x0n0mGV-GIdJJVZwXY';
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    console.log("Calling generate-test-questions edge function");
    
    // Call the edge function to generate test questions
    const { data, error } = await supabase.functions.invoke('generate-test-questions', {
      body: { topic, difficulty, count }
    });
    
    if (error) {
      console.error("Edge function error:", error);
      throw new Error(error.message || "Failed to get response from edge function");
    }
    
    if (!data || !data.questions) {
      throw new Error("No questions received from AI");
    }
    
    console.log("Received questions from Gemini:", data.questions.length);
    return data.questions;
  } catch (error) {
    console.error("Error generating questions with Gemini:", error);
    // Fall back to simulated questions if there's an error
    console.log("Falling back to simulated questions");
    return simulateQuestions(topic, difficulty, count);
  }
};

// Analyze test results and provide feedback
export const analyzeTestResults = async (
  topic: string,
  questions: QuestionResponse[],
  userAnswers: Record<number, string>
): Promise<{ score: number, accuracy: number, weakAreas: string, strengths: string }> => {
  try {
    // Use Supabase Edge Function to call Gemini API
    const { createClient } = await import('@supabase/supabase-js');
    
    // Get Supabase URL and anon key from environment variables
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ukedswaxpldombgjilvl.supabase.co';
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrZWRzd2F4cGxkb21iZ2ppbHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNjk5OTksImV4cCI6MjA1Njg0NTk5OX0.J1S8icZKmQwYQkcVOFYqTJSP7x0n0mGV-GIdJJVZwXY';
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Prepare data for analysis
    const questionsWithAnswers = questions.map((q, index) => ({
      question: q.question,
      correctAnswer: q.answer,
      userAnswer: userAnswers[index] || "",
      isCorrect: (userAnswers[index] || "").trim().toLowerCase() === q.answer.trim().toLowerCase()
    }));
    
    // Call the edge function to analyze results
    const { data, error } = await supabase.functions.invoke('analyze-test-results', {
      body: { topic, questionsWithAnswers }
    });
    
    if (error) {
      console.error("Edge function error:", error);
      throw new Error(error.message || "Failed to get analysis from edge function");
    }
    
    return data;
  } catch (error) {
    console.error("Error analyzing test results:", error);
    
    // Calculate basic score and accuracy as fallback
    let correctCount = 0;
    questions.forEach((_, index) => {
      if (userAnswers[index] && userAnswers[index].trim().toLowerCase() === questions[index].answer.trim().toLowerCase()) {
        correctCount++;
      }
    });
    
    const score = correctCount;
    const accuracy = Math.round((correctCount / questions.length) * 100);
    
    // Provide generic feedback as fallback
    return {
      score,
      accuracy,
      weakAreas: "Unable to analyze specific weak areas due to an error.",
      strengths: "Unable to analyze specific strengths due to an error."
    };
  }
};

// Simulated response function (kept from original implementation for fallback)
const simulateQuestions = (
  topic: string,
  difficulty: string,
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
              explanation: `Step 1: Move the constant to the right side\nStep 2: Divide both sides by the coefficient of x`,
              options: [
                `${Math.floor(Math.random() * 10)}`,
                `${Math.floor(Math.random() * 10)}`,
                `${Math.floor(Math.random() * 10)}`,
                `${Math.floor(Math.random() * 10)}`
              ]
            });
          } else if (difficulty === "Medium") {
            questions.push({
              question: `Solve the quadratic equation: ${Math.floor(Math.random() * 5) + 1}x² + ${Math.floor(Math.random() * 10)}x + ${Math.floor(Math.random() * 10)} = 0`,
              answer: `x = ${Math.floor(Math.random() * 5) - 2}, ${Math.floor(Math.random() * 5) - 2}`,
              explanation: `Use the quadratic formula x = (-b ± √(b² - 4ac)) / 2a\nSubstitute the values and solve`,
              options: [
                `x = ${Math.floor(Math.random() * 5) - 2}, ${Math.floor(Math.random() * 5) - 2}`,
                `x = ${Math.floor(Math.random() * 5) - 2}`,
                `x = ${Math.floor(Math.random() * 5) - 2}, ${Math.floor(Math.random() * 5) - 2}`,
                `x = ${Math.floor(Math.random() * 5) - 2}`
              ]
            });
          } else {
            questions.push({
              question: `Find all values of x that satisfy: |${Math.floor(Math.random() * 5) + 1}x - ${Math.floor(Math.random() * 10)}| > ${Math.floor(Math.random() * 15)}`,
              answer: `x < ${Math.floor(Math.random() * 5) - 10} or x > ${Math.floor(Math.random() * 10) + 5}`,
              explanation: `Step 1: Set up the two cases based on the absolute value\nStep 2: Solve each inequality`,
              options: [
                `x < ${Math.floor(Math.random() * 5) - 10} or x > ${Math.floor(Math.random() * 10) + 5}`,
                `x > ${Math.floor(Math.random() * 5) - 10}`,
                `x < ${Math.floor(Math.random() * 10) + 5}`,
                `x = ${Math.floor(Math.random() * 5) - 10}`
              ]
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
            explanation: `This is a detailed explanation for question ${i + 1} in the ${topic} category.`,
            options: [
              `Answer for question ${i + 1}`,
              `Wrong answer 1`,
              `Wrong answer 2`,
              `Wrong answer 3`
            ]
          });
        }
      }
      
      resolve(questions);
    }, 1500); // Simulate API delay
  });
};
