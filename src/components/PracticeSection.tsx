
import React, { useState } from 'react';
import { BookOpen, Brain, Check, MessageSquare, Calculator, ChevronRight, Lightbulb, PlusCircle, ListChecks, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

const PracticeSection = () => {
  const [showExplanation, setShowExplanation] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Sample practice questions
  const practiceQuestions = [
    {
      id: 1,
      topic: "Algebra",
      question: "Solve for x: 2x + 7 = 15",
      answer: "4",
      difficulty: "Easy",
      explanation: `
        Step 1: Subtract 7 from both sides.
        2x + 7 - 7 = 15 - 7
        2x = 8
        
        Step 2: Divide both sides by 2.
        2x ÷ 2 = 8 ÷ 2
        x = 4
      `
    },
    {
      id: 2,
      topic: "Algebra",
      question: "Solve for x: 3x - 5 = 13",
      answer: "6",
      difficulty: "Easy",
      explanation: `
        Step 1: Add 5 to both sides.
        3x - 5 + 5 = 13 + 5
        3x = 18
        
        Step 2: Divide both sides by 3.
        3x ÷ 3 = 18 ÷ 3
        x = 6
      `
    },
    {
      id: 3,
      topic: "Geometry",
      question: "Find the area of a circle with radius 5 cm. Use π = 3.14.",
      answer: "78.5",
      difficulty: "Medium",
      explanation: `
        The formula for the area of a circle is A = πr².
        
        A = π × 5²
        A = 3.14 × 25
        A = 78.5 cm²
      `
    },
    {
      id: 4,
      topic: "Calculus",
      question: "Find the derivative of f(x) = x² + 3x + 2",
      answer: "2x + 3",
      difficulty: "Medium",
      explanation: `
        We use the power rule and linearity of differentiation:
        
        f(x) = x² + 3x + 2
        f'(x) = 2x + 3 + 0
        f'(x) = 2x + 3
      `
    },
    {
      id: 5,
      topic: "Trigonometry",
      question: "If sin(θ) = 0.5, what is θ in degrees?",
      answer: "30",
      difficulty: "Medium",
      explanation: `
        We know that sin(θ) = 0.5
        
        One of the standard angles where sin(θ) = 0.5 is θ = 30°
        
        Note: There are other angles that also satisfy this equation, such as 150°, 390°, etc.
        But the smallest positive angle is 30°.
      `
    },
  ];

  const handleCheckAnswer = () => {
    const isAnswerCorrect = userAnswer.trim() === practiceQuestions[currentQuestion].answer;
    setIsCorrect(isAnswerCorrect);
    if (!isAnswerCorrect) {
      setShowExplanation(true);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < practiceQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setUserAnswer("");
      setIsCorrect(null);
      setShowExplanation(false);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setUserAnswer("");
      setIsCorrect(null);
      setShowExplanation(false);
    }
  };

  // Topic categories for sidebar
  const topics = [
    { name: "Algebra", count: 25 },
    { name: "Geometry", count: 18 },
    { name: "Calculus", count: 12 },
    { name: "Trigonometry", count: 15 },
    { name: "Statistics", count: 10 },
    { name: "Probability", count: 8 },
  ];

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Practice</h1>
            <p className="text-gray-600 mt-1">Strengthen your skills with guided practice</p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="bg-white shadow-soft">
                <TabsTrigger value="all">All Topics</TabsTrigger>
                <TabsTrigger value="recommended">Recommended</TabsTrigger>
                <TabsTrigger value="bookmarked">Bookmarked</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-white shadow-soft">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Topics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {topics.map((topic) => (
                    <div 
                      key={topic.name}
                      className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <span className="text-sm font-medium">{topic.name}</span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{topic.count}</span>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <div className="flex items-center text-sm p-2 text-tutor-blue font-medium rounded-md hover:bg-tutor-light-blue/50 cursor-pointer transition-colors">
                    <ListChecks className="h-4 w-4 mr-2" />
                    <span>Practice Tests</span>
                  </div>
                  <div className="flex items-center text-sm p-2 text-tutor-blue font-medium rounded-md hover:bg-tutor-light-blue/50 cursor-pointer transition-colors">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Timed Challenges</span>
                  </div>
                  <div className="flex items-center text-sm p-2 text-tutor-blue font-medium rounded-md hover:bg-tutor-light-blue/50 cursor-pointer transition-colors">
                    <Brain className="h-4 w-4 mr-2" />
                    <span>AI Tutor Session</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="bg-white shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-lg">Practice Question {currentQuestion + 1}/{practiceQuestions.length}</CardTitle>
                  <p className="text-sm text-gray-500 mt-1">{practiceQuestions[currentQuestion].topic} - {practiceQuestions[currentQuestion].difficulty}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestion === 0}
                    className="text-gray-500"
                  >
                    Previous
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleNextQuestion}
                    disabled={currentQuestion === practiceQuestions.length - 1}
                    className="text-gray-500"
                  >
                    Next
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium">{practiceQuestions[currentQuestion].question}</p>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1" htmlFor="answer">Your Answer:</label>
                  <div className="flex space-x-2">
                    <Input
                      id="answer"
                      placeholder="Enter your answer here"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      className={`border ${
                        isCorrect === null ? 'border-gray-200' : 
                        isCorrect ? 'border-green-500' : 'border-red-500'
                      }`}
                    />
                    <Button onClick={handleCheckAnswer} className="bg-tutor-blue hover:bg-tutor-dark-blue">
                      <Check className="h-4 w-4 mr-2" />
                      Check
                    </Button>
                  </div>
                  {isCorrect !== null && (
                    <p className={`mt-2 text-sm ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                      {isCorrect ? 'Correct! Well done.' : 'Not quite right. Try again or check the explanation.'}
                    </p>
                  )}
                </div>

                <div className="flex justify-between items-center mb-4">
                  <Button 
                    variant="ghost" 
                    onClick={() => setShowExplanation(!showExplanation)}
                    className="text-tutor-blue hover:text-tutor-dark-blue hover:bg-tutor-light-blue/50"
                  >
                    {showExplanation ? 'Hide Explanation' : 'Show Explanation'}
                    <Lightbulb className="h-4 w-4 ml-2" />
                  </Button>

                  <Button 
                    variant="outline" 
                    className="text-tutor-blue border-tutor-blue hover:bg-tutor-light-blue hover:text-tutor-dark-blue"
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    Ask AI Tutor
                  </Button>
                </div>

                {showExplanation && (
                  <div className="p-4 bg-tutor-light-blue/50 rounded-lg border border-tutor-light-blue animate-fade-in">
                    <div className="flex items-center mb-2">
                      <Lightbulb className="h-5 w-5 text-tutor-blue mr-2" />
                      <h4 className="font-medium">Explanation</h4>
                    </div>
                    <div className="pl-4 border-l-2 border-tutor-blue">
                      <p className="text-sm whitespace-pre-line">{practiceQuestions[currentQuestion].explanation}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white shadow-soft">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2 text-tutor-blue" />
                    Similar Questions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors flex justify-between items-center">
                      <p className="text-sm">Solve for x: 5x - 3 = 27</p>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors flex justify-between items-center">
                      <p className="text-sm">Solve for x: 4x + 9 = 21</p>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors flex justify-between items-center">
                      <p className="text-sm">If 3x - 8 = 10, find the value of x</p>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-soft">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Calculator className="h-5 w-5 mr-2 text-tutor-blue" />
                    Helpful Tools
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start text-left">
                      <Calculator className="h-4 w-4 mr-2" />
                      Scientific Calculator
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-left">
                      <Lightbulb className="h-4 w-4 mr-2" />
                      Formula Reference
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-left">
                      <Brain className="h-4 w-4 mr-2" />
                      Step-by-Step Solver
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticeSection;
