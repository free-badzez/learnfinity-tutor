
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface QuizComponentProps {
  questions: Question[];
  currentQuestion: number;
  score: number;
  selectedAnswer: number | null;
  quizStarted: boolean;
  handleAnswerSelect: (index: number) => void;
  handleNext: () => void;
  resetQuiz: () => void;
}

const QuizComponent: React.FC<QuizComponentProps> = ({
  questions,
  currentQuestion,
  score,
  selectedAnswer,
  quizStarted,
  handleAnswerSelect,
  handleNext,
  resetQuiz,
}) => {
  if (!quizStarted || questions.length === 0) {
    return null;
  }

  const question = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;
  const isQuizCompleted = selectedAnswer !== null && isLastQuestion;

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Question {currentQuestion + 1} of {questions.length}</span>
          <span className="text-blue-600">Score: {score}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">{question.question}</h3>
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <div
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`p-3 border rounded-md cursor-pointer transition-colors ${
                  selectedAnswer === null
                    ? 'hover:bg-gray-100'
                    : selectedAnswer === index
                    ? index === question.correctAnswer
                      ? 'bg-green-100 border-green-500'
                      : 'bg-red-100 border-red-500'
                    : index === question.correctAnswer
                    ? 'bg-green-100 border-green-500'
                    : 'opacity-70'
                }`}
              >
                {option}
              </div>
            ))}
          </div>
        </div>
        {selectedAnswer !== null && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <h4 className="font-medium text-gray-800 mb-2">Explanation:</h4>
            <p className="text-gray-700">{question.explanation || "No explanation provided."}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={resetQuiz}>
          {isQuizCompleted ? 'New Quiz' : 'Cancel'}
        </Button>
        {selectedAnswer !== null && !isQuizCompleted && (
          <Button onClick={handleNext}>Next Question</Button>
        )}
        {isQuizCompleted && (
          <div className="text-right">
            <p className="text-lg font-bold mb-1">Final Score: {score}/{questions.length}</p>
            <p className="text-sm text-gray-600">
              {(score / questions.length) * 100}% correct
            </p>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default QuizComponent;
