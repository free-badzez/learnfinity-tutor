
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import TextInput from "@/components/TextInput";
import QuizComponent from "@/components/QuizComponent";
import { generateQuestionsGemini } from "@/services/questionService";

const Index = () => {
  const [text, setText] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const storedApiKey = localStorage.getItem("gemini_api_key") || "AIzaSyCFkxznxuMjikL7o-QLmCPTh7mfhyoIaR8";
    if (storedApiKey) {
      setApiKey(storedApiKey);
    } else {
      toast({
        title: "API Key Required",
        description: "Please visit Google AI Studio to get your API key",
        variant: "destructive"
      });
      window.open("https://makersuite.google.com/app/apikey", "_blank");
    }
  }, []);

  const handleGenerateQuestions = async () => {
    if (!text.trim()) {
      toast({
        title: "Please enter some text",
        description: "The text field cannot be empty",
        variant: "destructive"
      });
      return;
    }

    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please configure your API key first",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await generateQuestionsGemini(text, apiKey);
      setQuestions(result.questions);
      setQuizStarted(true);
      setCurrentQuestion(0);
      setScore(0);
      setSelectedAnswer(null);
      toast({
        title: "Success!",
        description: "Questions generated successfully"
      });
    } catch (error) {
      toast({
        title: "Error generating questions",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (index) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    if (index === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    }
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setText("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-semibold mb-2">AI MCQ Generator</h1>
          <p className="text-gray-600">Enter any text content to generate multiple choice questions</p>
        </div>

        {!quizStarted ? (
          <TextInput
            text={text}
            onTextChange={setText}
            onGenerate={handleGenerateQuestions}
            isLoading={isLoading}
          />
        ) : (
          <QuizComponent
            questions={questions}
            currentQuestion={currentQuestion}
            score={score}
            selectedAnswer={selectedAnswer}
            quizStarted={quizStarted}
            handleAnswerSelect={handleAnswerSelect}
            handleNext={handleNext}
            resetQuiz={resetQuiz}
          />
        )}

        <div className="mt-4 text-center text-sm text-gray-500">
          <p>Using Google Gemini AI for question generation</p>
          <button 
            onClick={() => window.open("https://makersuite.google.com/app/apikey", "_blank")}
            className="text-blue-600 hover:underline mt-2"
          >
            Get your API key
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;
