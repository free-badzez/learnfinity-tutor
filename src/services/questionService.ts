
import { hasGeminiApiKey } from './geminiService';

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface GeneratedQuestions {
  questions: Question[];
}

export async function generateQuestionsGemini(text: string, apiKey: string): Promise<GeneratedQuestions> {
  try {
    console.log('Generating questions based on text content...');
    
    // Check if API key exists
    if (!apiKey) {
      throw new Error('API key is required to generate questions.');
    }
    
    const prompt = `
      Create 5 multiple-choice questions based on the following text. 
      Format the response as a JSON array of objects, where each object has:
      1. question: The question text
      2. options: An array of 4 possible answers (including the correct one)
      3. correctAnswer: The index (0-3) of the correct answer in the options array
      4. explanation: A brief explanation of why the answer is correct
      
      Here's the text: ${text}
    `;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.4,
            topK: 32,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const textContent = data.candidates[0].content.parts[0].text;

    // Extract JSON from the response (it may be wrapped in text or code blocks)
    let jsonMatch = textContent.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Could not parse response as JSON array');
    }

    const questions = JSON.parse(jsonMatch[0]) as Question[];
    
    return { questions };
  } catch (error) {
    console.error('Error generating questions:', error);
    throw error;
  }
}
