
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic, difficulty, count } = await req.json();
    console.log(`Generating ${count} ${difficulty} questions for ${topic}`);

    // Get API key from environment variables
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY is not set in the environment variables');
    }

    // Create a system prompt for generating math test questions
    const systemPrompt = `You are an expert math teacher creating multiple-choice questions for a ${difficulty} level test on ${topic}. 
    Generate ${count} questions with the following format for each question:

    1. Create a diverse mix of questions, with the following distribution:
       - 70% should be standard text-based questions
       - 30% should be figure-based questions (with detailed descriptions of figures like graphs, geometric shapes, or diagrams that can be visualized by the student)
       
    2. For each question, provide:
       - A clear, concise question that tests understanding of ${topic}
       - Four possible answers (a, b, c, d) with one correct answer
       - The correct answer as a single letter (a, b, c, or d)
       - A detailed explanation of why the answer is correct and how to solve the problem

    3. Make sure the questions cover a variety of subtopics within ${topic} and test different skills and concepts.
    
    4. For figure-based questions, include a detailed text description of the figure in the question.

    Format your response as valid JSON with this structure:
    {
      "questions": [
        {
          "question": "The full question text including any figure descriptions",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "answer": "a",
          "explanation": "Detailed explanation with step-by-step solution"
        },
        ...
      ]
    }`;

    // Call Gemini API to generate questions
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: systemPrompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 4096,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Gemini API error:", errorData);
      throw new Error(`Gemini API returned status ${response.status}: ${errorData}`);
    }

    const data = await response.json();
    console.log("Gemini API response received");

    // Extract the JSON response
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Extract JSON from the text response
    let jsonStart = textResponse.indexOf('{');
    let jsonEnd = textResponse.lastIndexOf('}') + 1;
    
    if (jsonStart === -1 || jsonEnd === 0) {
      throw new Error('Could not parse JSON from Gemini response');
    }
    
    const jsonString = textResponse.substring(jsonStart, jsonEnd);
    const questionsData = JSON.parse(jsonString);
    
    // Process the questions to standardize the format
    const processedQuestions = questionsData.questions.map(q => {
      // Convert letter answer (a,b,c,d) to the actual option text
      const answerIndex = q.answer.toLowerCase().charCodeAt(0) - 97; // 'a' -> 0, 'b' -> 1, etc.
      const answerText = q.options[answerIndex];
      
      return {
        question: q.question,
        options: q.options,
        answer: answerText,
        explanation: q.explanation
      };
    });

    return new Response(
      JSON.stringify({ questions: processedQuestions }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error("Error in generate-test-questions function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
