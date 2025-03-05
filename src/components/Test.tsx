
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Check, Clock, ArrowLeft, Lightbulb } from 'lucide-react';
import { generateMathQuestions } from '../services/geminiService';
import Calculator from './Calculator';
import { useToast } from "@/components/ui/use-toast";

interface QuestionItem {
  question: string;
  answer: string;
  explanation: string;
  userAnswer?: string;
  isCorrect?: boolean;
  showExplanation?: boolean;
}

const Test = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { topic, difficulty } = location.state || { topic: "Algebra", difficulty: "Easy" };
  
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  
  // Determine time based on difficulty
  useEffect(() => {
    let time = 0;
    const questionCount = difficulty === "Easy" ? 10 : 5;
    
    switch(difficulty) {
      case "Easy":
        time = 20 * 60; // 20 minutes for easy
        break;
      case "Medium":
        time = 15 * 60; // 15 minutes for medium
        break;
      case "Hard":
        time = 10 * 60; // 10 minutes for hard
        break;
      default:
        time = 15 * 60;
    }
    
    setTimeLeft(time);
  }, [difficulty]);
  
  // Timer
  useEffect(() => {
    if (timeLeft <= 0 || testSubmitted) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          if (!testSubmitted) {
            submitTest();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft, testSubmitted]);
  
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Load questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const questionCount = difficulty === "Easy" ? 10 : 5;
        const data = await generateMathQuestions(topic, difficulty as "Easy" | "Medium" | "Hard", questionCount);
        setQuestions(data);
      } catch (error) {
        console.error("Error fetching questions:", error);
        toast({
          title: "Error loading questions",
          description: "Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuestions();
  }, [topic, difficulty, toast]);
  
  const handleAnswerChange = (answer: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestion].userAnswer = answer;
    setQuestions(updatedQuestions);
  };
  
  const checkAnswer = () => {
    const questionToCheck = questions[currentQuestion];
    if (!questionToCheck.userAnswer) {
      toast({
        title: "Please provide an answer",
        description: "You need to enter an answer before checking.",
        variant: "destructive"
      });
      return;
    }
    
    const isCorrect = questionToCheck.userAnswer.trim().toLowerCase() === 
                     questionToCheck.answer.trim().toLowerCase();
    
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestion].isCorrect = isCorrect;
    updatedQuestions[currentQuestion].showExplanation = !isCorrect;
    setQuestions(updatedQuestions);
    
    if (isCorrect) {
      toast({
        title: "Correct!",
        description: "Well done! Your answer is correct.",
        variant: "default"
      });
    } else {
      toast({
        title: "Incorrect",
        description: "Your answer is not correct. Check the explanation to learn more.",
        variant: "destructive"
      });
    }
  };
  
  const submitTest = () => {
    // Calculate score
    let correctCount = 0;
    const finalQuestions = questions.map(q => {
      const isCorrect = q.userAnswer?.trim().toLowerCase() === q.answer.trim().toLowerCase();
      if (isCorrect) correctCount++;
      return {
        ...q,
        isCorrect,
        showExplanation: true
      };
    });
    
    setQuestions(finalQuestions);
    setScore(correctCount);
    setTestSubmitted(true);
    
    toast({
      title: "Test Submitted",
      description: `Your score: ${correctCount}/${questions.length}`,
      variant: "default"
    });
  };
  
  const goToNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };
  
  const goToPrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  
  const goBack = () => {
    navigate('/practice');
  };
  
  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button variant="ghost" onClick={goBack} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Practice
            </Button>
            <h1 className="text-2xl font-bold">{topic} - {difficulty} Test</h1>
          </div>
          
          <div className={`flex items-center ${timeLeft < 60 ? 'text-red-500' : timeLeft < 300 ? 'text-orange-500' : ''}`}>
            <Clock className="h-5 w-5 mr-2" />
            <span className="text-lg font-semibold">{formatTime(timeLeft)}</span>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-tutor-blue"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Question List */}
            <div className="lg:col-span-1">
              <Card className="bg-white shadow-soft">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-5 gap-2">
                    {questions.map((_, index) => (
                      <Button
                        key={index}
                        variant={currentQuestion === index ? "default" : "outline"}
                        className={`h-10 w-10 p-0 ${
                          questions[index].isCorrect === true ? "bg-green-500 hover:bg-green-600" :
                          questions[index].isCorrect === false ? "bg-red-500 hover:bg-red-600" :
                          questions[index].userAnswer ? "bg-gray-200 hover:bg-gray-300" : ""
                        } ${currentQuestion === index ? "ring-2 ring-tutor-blue" : ""}`}
                        onClick={() => setCurrentQuestion(index)}
                      >
                        {index + 1}
                      </Button>
                    ))}
                  </div>
                  
                  {testSubmitted && (
                    <div className="mt-8 p-4 bg-tutor-light-blue rounded-lg">
                      <h3 className="font-bold text-lg mb-2">Test Results</h3>
                      <p>Your score: {score}/{questions.length}</p>
                      <p>Percentage: {Math.round((score / questions.length) * 100)}%</p>
                      <Button 
                        className="w-full mt-4 bg-tutor-blue hover:bg-tutor-dark-blue"
                        onClick={goBack}
                      >
                        Return to Practice
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <div className="mt-6">
                <Calculator />
              </div>
            </div>
            
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card className="bg-white shadow-soft">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-lg">Question {currentQuestion + 1}</CardTitle>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={goToPrevQuestion}
                      disabled={currentQuestion === 0}
                      className="text-gray-500"
                    >
                      Previous
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={goToNextQuestion}
                      disabled={currentQuestion === questions.length - 1}
                      className="text-gray-500"
                    >
                      Next
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {questions.length > 0 && (
                    <>
                      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <p className="font-medium">{questions[currentQuestion].question}</p>
                      </div>
                      
                      <div className="mb-6">
                        <label className="block text-sm font-medium mb-1" htmlFor="answer">Your Answer:</label>
                        <div className="flex space-x-2">
                          <Input
                            id="answer"
                            placeholder="Enter your answer here"
                            value={questions[currentQuestion].userAnswer || ''}
                            onChange={(e) => handleAnswerChange(e.target.value)}
                            className={`border ${
                              questions[currentQuestion].isCorrect === undefined ? 'border-gray-200' : 
                              questions[currentQuestion].isCorrect ? 'border-green-500' : 'border-red-500'
                            }`}
                            disabled={testSubmitted}
                          />
                          {!testSubmitted && (
                            <Button onClick={checkAnswer} className="bg-tutor-blue hover:bg-tutor-dark-blue">
                              <Check className="h-4 w-4 mr-2" />
                              Check
                            </Button>
                          )}
                        </div>
                        {questions[currentQuestion].isCorrect !== undefined && (
                          <p className={`mt-2 text-sm ${questions[currentQuestion].isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                            {questions[currentQuestion].isCorrect ? 'Correct! Well done.' : 'Not quite right.'}
                          </p>
                        )}
                      </div>
                      
                      {(questions[currentQuestion].showExplanation || testSubmitted) && (
                        <div className="p-4 bg-tutor-light-blue/50 rounded-lg border border-tutor-light-blue animate-fade-in">
                          <div className="flex items-center mb-2">
                            <Lightbulb className="h-5 w-5 text-tutor-blue mr-2" />
                            <h4 className="font-medium">Explanation</h4>
                          </div>
                          <div className="pl-4 border-l-2 border-tutor-blue">
                            <p className="text-sm whitespace-pre-line">{questions[currentQuestion].explanation}</p>
                            <p className="text-sm font-semibold mt-2">Correct answer: {questions[currentQuestion].answer}</p>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  
                  {!testSubmitted && (
                    <div className="mt-8">
                      <Button 
                        className="w-full bg-tutor-blue hover:bg-tutor-dark-blue"
                        onClick={submitTest}
                      >
                        Submit Test
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Test;
