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

export const generateQuestionsGemini = async (
  text: string,
  apiKey: string
): Promise<GenerateQuestionsResponse> => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Generate 5 multiple choice questions from: ${text}. 
              Return ONLY a valid JSON array like:
              [
                {
                  "question": "What is...?",
                  "options": ["A", "B", "C", "D"],
                  "correctAnswer": 0
                }
              ]`
            }]
          }]
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${errorData.error?.message}`);
    }

    const data = await response.json();
    const rawText = data.candidates[0].content.parts[0].text;
    const cleanedText = rawText.replace(/```json|```/g, "");
    const questions = JSON.parse(cleanedText);

    return { questions };
  } catch (error) {
    throw new Error(`Failed to generate questions: ${error.message}`);
  }
};
