import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import TextInput from "@/components/TextInput";
import QuizComponent from "@/components/QuizComponent";
import { generateQuestionsGemini } from "@/services/questionService";

const Index = () => {
  const [text, setText] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [apiKey, setApiKey] = useState("YOUR_ACTUAL_API_KEY"); // Replace with your key

  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <Features />
    </div>
  );
};

export default Index;
