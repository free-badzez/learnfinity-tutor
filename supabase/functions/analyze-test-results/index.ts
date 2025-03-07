
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
    const { topic, questionsWithAnswers } = await req.json();
    console.log(`Analyzing test results for ${topic} with ${questionsWithAnswers.length} questions`);

    // Get API key from environment variables
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY is not set in the environment variables');
    }

    // Calculate basic metrics
    const totalQuestions = questionsWithAnswers.length;
    const correctAnswers = questionsWithAnswers.filter(q => q.isCorrect).length;
    const incorrectAnswers = totalQuestions - correctAnswers;
    const accuracy = Math.round((correctAnswers / totalQuestions) * 100);

    // If all answers are correct or all are wrong, we can return without AI analysis
    if (correctAnswers === totalQuestions) {
      return new Response(
        JSON.stringify({
          score: correctAnswers,
          accuracy,
          weakAreas: "None identified - perfect score!",
          strengths: `Excellent understanding of ${topic} concepts.`
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (correctAnswers === 0) {
      return new Response(
        JSON.stringify({
          score: 0,
          accuracy: 0,
          weakAreas: `Fundamental concepts in ${topic}`,
          strengths: "Keep practicing to improve your skills!"
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Create a prompt for Gemini to analyze the results
    const analysisPrompt = `You are an expert math teacher analyzing test results. The student has completed a test on ${topic} with ${totalQuestions} questions.
    
    They answered ${correctAnswers} correctly and ${incorrectAnswers} incorrectly, for an accuracy of ${accuracy}%.
    
    Here are the questions, correct answers, and the student's responses:
    ${JSON.stringify(questionsWithAnswers, null, 2)}
    
    Based on this performance, please:
    1. Identify specific weak areas or concepts the student should focus on
    2. Identify strengths demonstrated by the student
    
    Format your analysis as JSON with these fields:
    {
      "weakAreas": "A concise description of weak areas and concepts to study",
      "strengths": "A concise description of demonstrated strengths"
    }`;

    // Call Gemini API for analysis
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
              parts: [{ text: analysisPrompt }],
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
      const errorData = await response.text();
      console.error("Gemini API error:", errorData);
      throw new Error(`Gemini API returned status ${response.status}: ${errorData}`);
    }

    const data = await response.json();
    console.log("Gemini API analysis received");

    // Extract the JSON response
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Extract JSON from the text response
    let jsonStart = textResponse.indexOf('{');
    let jsonEnd = textResponse.lastIndexOf('}') + 1;
    
    if (jsonStart === -1 || jsonEnd === 0) {
      throw new Error('Could not parse JSON from Gemini response');
    }
    
    const jsonString = textResponse.substring(jsonStart, jsonEnd);
    const analysis = JSON.parse(jsonString);

    return new Response(
      JSON.stringify({
        score: correctAnswers,
        accuracy,
        weakAreas: analysis.weakAreas,
        strengths: analysis.strengths
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error("Error in analyze-test-results function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
