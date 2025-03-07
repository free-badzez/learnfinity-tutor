
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check, X, ArrowLeft, ArrowRight, Clock, Calculator, AlertCircle, Award, BarChart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { generateMathQuestions, analyzeTestResults } from '@/services/geminiService';
import { toast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

const Test = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { topic, difficulty } = location.state || {};
  
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showCalculator, setShowCalculator] = useState(false);
  const [calculatorInput, setCalculatorInput] = useState('');
  const [calculatorResult, setCalculatorResult] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [showResults, setShowResults] = useState(false);

  // Set time based on difficulty
  useEffect(() => {
    if (difficulty === 'Easy') {
      setTimeLeft(20 * 60); // 20 minutes in seconds
    } else if (difficulty === 'Medium') {
      setTimeLeft(15 * 60); // 15 minutes
    } else {
      setTimeLeft(10 * 60); // 10 minutes
    }
  }, [difficulty]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0 || isSubmitted) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          // Auto-submit when time runs out
          if (!isSubmitted) {
            handleSubmit();
          }
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted]);

  // Format time as mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Fetch questions on component mount
  useEffect(() => {
    if (!topic || !difficulty) {
      navigate('/practice');
      return;
    }

    const questionCount = difficulty === 'Easy' ? 10 : 5;
    
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const fetchedQuestions = await generateMathQuestions(topic, difficulty, questionCount);
        setQuestions(fetchedQuestions);
      } catch (error) {
        console.error('Error fetching questions:', error);
        toast({
          title: "Error Loading Questions",
          description: "There was a problem loading the questions. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [topic, difficulty, navigate]);

  const handleAnswerChange = (value) => {
    const newAnswers = { ...answers };
    newAnswers[currentQuestionIndex] = value;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowExplanation(false);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowExplanation(isSubmitted);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitted(true);
    setShowExplanation(true);
    
    try {
      // Calculate score
      let correctCount = 0;
      questions.forEach((question, index) => {
        if (answers[index] && answers[index].trim().toLowerCase() === question.answer.trim().toLowerCase()) {
          correctCount++;
        }
      });
      
      const percentage = Math.round((correctCount / questions.length) * 100);
      
      toast({
        title: "Test Completed!",
        description: `You scored ${correctCount}/${questions.length} (${percentage}%)`,
      });
      
      // Get AI analysis of results
      const resultsAnalysis = await analyzeTestResults(topic, questions, answers);
      setAnalysis(resultsAnalysis);
      
      // Show results summary
      setShowResults(true);
    } catch (error) {
      console.error('Error analyzing results:', error);
      toast({
        title: "Analysis Error",
        description: "There was a problem analyzing your results.",
        variant: "destructive"
      });
    }
  };

  const handleBackToResults = () => {
    setShowResults(true);
    setCurrentQuestionIndex(0);
  };

  const handleReviewQuestions = () => {
    setShowResults(false);
  };

  // Calculator functions
  const handleCalculatorInput = (value) => {
    if (value === 'C') {
      setCalculatorInput('');
      setCalculatorResult('');
    } else if (value === '=') {
      try {
        // eslint-disable-next-line no-eval
        const result = eval(calculatorInput);
        setCalculatorResult(result.toString());
      } catch (error) {
        setCalculatorResult('Error');
      }
    } else {
      setCalculatorInput(prev => prev + value);
    }
  };

  const calculatorButtons = [
    '7', '8', '9', '/',
    '4', '5', '6', '*',
    '1', '2', '3', '-',
    '0', '.', '=', '+',
    'C'
  ];

  if (loading) {
    return (
      <div className="min-h-screen pt-16 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading Practice Test</h2>
          <p className="text-gray-600">Preparing {difficulty} questions for {topic}...</p>
        </div>
      </div>
    );
  }

  // Show results summary
  if (showResults && isSubmitted && analysis) {
    return (
      <div className="min-h-screen pt-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <Button 
              variant="outline" 
              className="flex items-center" 
              onClick={() => navigate('/practice')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Practice
            </Button>
          </div>
          
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Test Results: {topic} - {difficulty} Level</h1>
            <p className="text-gray-600">
              {questions.length} questions • Time: {formatTime(timeLeft)} remaining
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Award className="h-5 w-5 mr-2 text-tutor-blue" />
                  Score
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-4xl font-bold text-center mb-2">
                  {analysis.score}/{questions.length}
                </div>
                <Progress value={analysis.accuracy} className="h-2 mb-2" />
                <p className="text-center text-gray-600">{analysis.accuracy}% Accuracy</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-amber-500" />
                  Areas to Improve
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p>{analysis.weakAreas}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <BarChart className="h-5 w-5 mr-2 text-green-600" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p>{analysis.strengths}</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex justify-center gap-4">
            <Button 
              variant="outline" 
              className="flex items-center" 
              onClick={() => navigate('/practice')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              New Practice Test
            </Button>
            
            <Button 
              className="flex items-center bg-tutor-blue hover:bg-tutor-dark-blue" 
              onClick={handleReviewQuestions}
            >
              Review Questions
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="outline" 
            className="flex items-center" 
            onClick={() => isSubmitted ? handleBackToResults() : navigate('/practice')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {isSubmitted ? 'Back to Results' : 'Back to Practice'}
          </Button>
          
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 ${timeLeft < 60 ? 'text-red-500' : timeLeft < 180 ? 'text-amber-500' : ''}`}>
              <Clock className="h-5 w-5" />
              <span className="font-mono text-lg font-medium">{formatTime(timeLeft)}</span>
            </div>
            
            <Button 
              variant="outline"
              className="flex items-center"
              onClick={() => setShowCalculator(!showCalculator)}
            >
              <Calculator className="h-4 w-4 mr-2" />
              Calculator
            </Button>
          </div>
        </div>
        
        <div className="mb-4">
          <h1 className="text-2xl font-bold">{topic} - {difficulty} Level</h1>
          <p className="text-gray-600">
            {questions.length} questions • {difficulty === 'Easy' ? '20 minutes' : difficulty === 'Medium' ? '15 minutes' : '10 minutes'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question list - visible on larger screens */}
          <div className="hidden lg:block">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {questions.map((_, index) => (
                    <button
                      key={index}
                      className={`p-2 rounded-md text-center ${
                        currentQuestionIndex === index 
                          ? 'bg-tutor-blue text-white' 
                          : answers[index] 
                            ? isSubmitted 
                              ? answers[index].trim().toLowerCase() === questions[index].answer.trim().toLowerCase()
                                ? 'bg-green-100 border border-green-300'
                                : 'bg-red-100 border border-red-300'
                              : 'bg-tutor-light-blue/50 border border-tutor-light-blue'
                            : 'bg-gray-100'
                      }`}
                      onClick={() => setCurrentQuestionIndex(index)}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main question area */}
          <div className="lg:col-span-3">
            <Card className="mb-6">
              <CardHeader className="pb-2 border-b">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </CardTitle>
                  
                  {/* Mobile question navigation */}
                  <div className="flex lg:hidden items-center space-x-1">
                    {questions.map((_, index) => (
                      <button
                        key={index}
                        className={`w-6 h-6 text-xs rounded-full ${
                          currentQuestionIndex === index 
                            ? 'bg-tutor-blue text-white' 
                            : answers[index] 
                              ? isSubmitted 
                                ? answers[index].trim().toLowerCase() === questions[index].answer.trim().toLowerCase()
                                  ? 'bg-green-100 border border-green-300'
                                  : 'bg-red-100 border border-red-300'
                                : 'bg-tutor-light-blue/50 border border-tutor-light-blue'
                              : 'bg-gray-100'
                        }`}
                        onClick={() => setCurrentQuestionIndex(index)}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="mb-6">
                  <p className="text-lg font-medium mb-6">
                    {questions[currentQuestionIndex]?.question}
                  </p>
                  
                  {questions[currentQuestionIndex]?.options && (
                    <div className="mb-4">
                      <RadioGroup 
                        value={answers[currentQuestionIndex] || ''} 
                        onValueChange={handleAnswerChange}
                        disabled={isSubmitted}
                      >
                        {questions[currentQuestionIndex].options.map((option, idx) => (
                          <div 
                            key={idx} 
                            className={`flex items-center space-x-2 p-3 rounded-md border mb-2 ${
                              isSubmitted 
                                ? option.trim().toLowerCase() === questions[currentQuestionIndex].answer.trim().toLowerCase()
                                  ? 'bg-green-50 border-green-200'
                                  : answers[currentQuestionIndex] === option && 'bg-red-50 border-red-200'
                                : answers[currentQuestionIndex] === option ? 'bg-blue-50 border-blue-200' : ''
                            }`}
                          >
                            <RadioGroupItem value={option} id={`option-${idx}`} />
                            <Label 
                              htmlFor={`option-${idx}`}
                              className={`flex-1 cursor-pointer ${
                                isSubmitted && option.trim().toLowerCase() === questions[currentQuestionIndex].answer.trim().toLowerCase()
                                  ? 'font-medium text-green-800'
                                  : ''
                              }`}
                            >
                              {option}
                              {isSubmitted && option.trim().toLowerCase() === questions[currentQuestionIndex].answer.trim().toLowerCase() && 
                                <Check className="inline-block h-4 w-4 ml-2 text-green-600" />
                              }
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  )}
                  
                  {isSubmitted && (
                    <div className="mt-4 p-4 rounded-md border bg-gray-50">
                      <div className="flex items-start">
                        <div className={`rounded-full p-1 mr-2 ${
                          answers[currentQuestionIndex]?.trim().toLowerCase() === 
                          questions[currentQuestionIndex]?.answer.trim().toLowerCase()
                            ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {answers[currentQuestionIndex]?.trim().toLowerCase() === 
                           questions[currentQuestionIndex]?.answer.trim().toLowerCase() 
                            ? <Check className="h-4 w-4 text-green-600" /> 
                            : <X className="h-4 w-4 text-red-600" />}
                        </div>
                        <div>
                          <p className="font-medium">
                            Correct Answer: {questions[currentQuestionIndex]?.answer}
                          </p>
                          {showExplanation && questions[currentQuestionIndex]?.explanation && (
                            <div className="mt-3 text-sm text-gray-700 math-response">
                              <p className="font-medium mb-1 text-tutor-blue">Explanation:</p>
                              {questions[currentQuestionIndex].explanation.split('\n').map((line, i) => (
                                <p key={i} className="mb-1">{line}</p>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={handlePrevQuestion}
                    disabled={currentQuestionIndex === 0}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  
                  {currentQuestionIndex < questions.length - 1 ? (
                    <Button 
                      onClick={handleNextQuestion}
                    >
                      Next
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    !isSubmitted && (
                      <Button 
                        onClick={handleSubmit}
                        className="bg-tutor-blue hover:bg-tutor-dark-blue"
                      >
                        Submit Test
                        <Check className="h-4 w-4 ml-2" />
                      </Button>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Calculator */}
            {showCalculator && (
              <Card className="mb-6">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Calculator className="h-5 w-5 mr-2" />
                    Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col">
                    <div className="bg-gray-100 p-3 rounded-md mb-3 text-right">
                      <div className="text-gray-600 text-sm">{calculatorInput}</div>
                      <div className="text-xl font-mono">{calculatorResult || '0'}</div>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {calculatorButtons.map((btn) => (
                        <button
                          key={btn}
                          className={`p-3 rounded-md text-center ${
                            btn === 'C' 
                              ? 'bg-red-100 hover:bg-red-200' 
                              : btn === '=' 
                                ? 'bg-tutor-blue text-white hover:bg-tutor-dark-blue' 
                                : ['/', '*', '-', '+'].includes(btn)
                                  ? 'bg-gray-200 hover:bg-gray-300'
                                  : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                          onClick={() => handleCalculatorInput(btn)}
                        >
                          {btn}
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Test;
