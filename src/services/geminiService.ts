import { toast } from "@/components/ui/use-toast";

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface GenerateQuestionsResponse {
  questions: Question[];
  error?: string;
}

const API_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 3;

export const generateQuestionsGemini = async (
  text: string,
  apiKey: string,
  retryCount = 0
): Promise<GenerateQuestionsResponse> => {
  if (!text.trim()) throw new Error("Text input is required");
  if (!apiKey.trim()) throw new Error("API key is required");

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Generate 5 multiple choice questions from this text: ${text}
              - Format as JSON array only, no extra text
              - Each object must have:
                * question: string
                * options: string[4] 
                * correctAnswer: number (0-3 index)
              Example: [{
                "question": "What is...?", 
                "options": ["A", "B", "C", "D"], 
                "correctAnswer": 0
              }]`
            }]
          }]
        }),
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "API request failed");
    }

    const data = await response.json();
    const rawContent = data.candidates[0].content.parts[0].text;
    
    // Clean and parse response
    const cleanedContent = rawContent
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    const questions: Question[] = JSON.parse(cleanedContent);

    // Validate response format
    if (!Array.isArray(questions)) {
      throw new Error("Invalid response format from API");
    }

    const isValidQuestion = (q: any): q is Question => {
      return (
        typeof q?.question === "string" &&
        Array.isArray(q?.options) &&
        q.options.length === 4 &&
        typeof q?.correctAnswer === "number" &&
        q.correctAnswer >= 0 &&
        q.correctAnswer <= 3
      );
    };

    if (!questions.every(isValidQuestion)) {
      throw new Error("Some questions have invalid format");
    }

    return { questions };

  } catch (error) {
    clearTimeout(timeoutId);

    // Handle retryable errors
    if (retryCount < MAX_RETRIES && (
      error.message.includes("quota") ||
      error.message.includes("unavailable") ||
      error.name === "AbortError"
    )) {
      await new Promise(resolve => setTimeout(resolve, 2000 * (retryCount + 1)));
      return generateQuestionsGemini(text, apiKey, retryCount + 1);
    }

    // Special handling for common errors
    if (error instanceof SyntaxError) {
      throw new Error("Failed to parse API response - invalid JSON format");
    }

    if (error.name === "AbortError") {
      throw new Error("Request timed out - please try again");
    }

    if (error.message.includes("API key invalid")) {
      throw new Error("Invalid API key - please check your key");
    }

    throw new Error(error.message || "Failed to generate questions");
  }
};
