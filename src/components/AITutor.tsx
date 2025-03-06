
import React, { useState, useRef, useEffect } from 'react';
import { Brain, Send, Lightbulb, Calculator, ArrowRight, Sigma, BookOpen, RefreshCw, Maximize2, Minimize2, PlusCircle, X, MessageSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AITutor = () => {
  const [userInput, setUserInput] = useState("");
  const [conversation, setConversation] = useState<Array<{ role: string; content: string; timestamp: Date }>>([
    {
      role: "assistant",
      content: "Hello! I'm your personal mathematics tutor. How can I help you today? You can ask me to solve problems, explain concepts, or guide you through math topics.",
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [expandedView, setExpandedView] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Sample suggested questions
  const suggestedQuestions = [
    "Can you explain how to solve quadratic equations?",
    "Help me understand the chain rule in calculus",
    "What is the Pythagorean theorem?",
    "How do I find the derivative of sin(x)?"
  ];

  // Sample practice topics
  const recentTopics = [
    { name: "Quadratic Functions", progress: 65 },
    { name: "Limits and Continuity", progress: 40 },
    { name: "Trigonometric Identities", progress: 80 }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const handleSendMessage = () => {
    if (userInput.trim() === "") return;
    
    // Add user message to conversation
    const newConversation = [
      ...conversation,
      {
        role: "user",
        content: userInput,
        timestamp: new Date()
      }
    ];
    
    setConversation(newConversation);
    setUserInput("");
    setIsTyping(true);
    
    // Simulate AI response (with delay to mimic thinking)
    setTimeout(() => {
      let response;
      
      // Very simple pattern matching to generate relevant responses
      if (userInput.toLowerCase().includes("quadratic")) {
        response = "A quadratic equation has the form ax² + bx + c = 0, where a, b, and c are constants and a ≠ 0. You can solve it using the quadratic formula: x = (-b ± √(b² - 4ac)) / 2a. Would you like me to demonstrate with an example?";
      } else if (userInput.toLowerCase().includes("chain rule")) {
        response = "The chain rule is a formula for computing the derivative of a composite function. If y = f(g(x)), then dy/dx = (df/dg) × (dg/dx). This rule is essential when dealing with nested functions. Would you like to see an example?";
      } else if (userInput.toLowerCase().includes("pythagorean")) {
        response = "The Pythagorean theorem states that in a right triangle, the square of the length of the hypotenuse equals the sum of the squares of the other two sides. If the two legs have lengths a and b, and the hypotenuse has length c, then a² + b² = c². This fundamental theorem has many applications in mathematics and real life.";
      } else if (userInput.toLowerCase().includes("derivative") && userInput.toLowerCase().includes("sin")) {
        response = "The derivative of sin(x) is cos(x). This comes from applying the limit definition of the derivative and using the properties of trigonometric functions. Would you like me to show you the proof or some examples?";
      } else {
        response = "That's a great question! I'd be happy to help you understand this concept better. Let's break it down step by step. What specific aspect of this would you like me to clarify?";
      }
      
      setConversation([
        ...newConversation,
        {
          role: "assistant",
          content: response,
          timestamp: new Date()
        }
      ]);
      
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setUserInput(question);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`min-h-screen pt-16 bg-gray-50 ${expandedView ? 'overflow-hidden' : ''}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">AI Tutor</h1>
            <p className="text-gray-600 mt-1">Your personal mathematics learning assistant</p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Button 
              variant="outline" 
              onClick={() => setExpandedView(!expandedView)}
              className="border-tutor-blue text-tutor-blue hover:bg-tutor-light-blue"
            >
              {expandedView ? (
                <>
                  <Minimize2 className="h-4 w-4 mr-2" />
                  Compact View
                </>
              ) : (
                <>
                  <Maximize2 className="h-4 w-4 mr-2" />
                  Expanded View
                </>
              )}
            </Button>
          </div>
        </div>

        <div className={`grid ${expandedView ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-4'} gap-8`}>
          {/* Sidebar - only shown in compact view */}
          {!expandedView && (
            <div className="lg:col-span-1">
              <Card className="bg-white shadow-soft mb-6">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Brain className="h-5 w-5 mr-2 text-tutor-blue" />
                    AI Capabilities
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start">
                    <div className="bg-tutor-light-blue rounded-full p-1.5 mr-3">
                      <Calculator className="h-4 w-4 text-tutor-blue" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Problem Solving</h4>
                      <p className="text-xs text-gray-500">Step-by-step solutions for math problems</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-tutor-light-blue rounded-full p-1.5 mr-3">
                      <Lightbulb className="h-4 w-4 text-tutor-blue" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Concept Explanations</h4>
                      <p className="text-xs text-gray-500">Clear explanations of mathematical concepts</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-tutor-light-blue rounded-full p-1.5 mr-3">
                      <Sigma className="h-4 w-4 text-tutor-blue" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Formula Support</h4>
                      <p className="text-xs text-gray-500">Access to mathematical formulas and theorems</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-tutor-light-blue rounded-full p-1.5 mr-3">
                      <BookOpen className="h-4 w-4 text-tutor-blue" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Practice Generation</h4>
                      <p className="text-xs text-gray-500">Creates practice problems for any topic</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white shadow-soft">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Recent Topics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentTopics.map((topic, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{topic.name}</span>
                        <span className="text-gray-500">{topic.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-tutor-blue rounded-full"
                          style={{ width: `${topic.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                  
                  <Button variant="outline" className="w-full mt-2 text-tutor-blue border-tutor-blue">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Explore More Topics
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Chat Area */}
          <div className={`${expandedView ? 'col-span-1' : 'lg:col-span-3'} ${expandedView ? 'h-[calc(100vh-170px)]' : ''}`}>
            <Card className={`bg-white shadow-soft ${expandedView ? 'h-full flex flex-col' : ''}`}>
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-tutor-light-blue p-2 rounded-full mr-3">
                    <Brain className="h-5 w-5 text-tutor-blue" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Mathematics Tutor</CardTitle>
                    <p className="text-xs text-green-600">Online • Ready to help</p>
                  </div>
                </div>
                
                <Button variant="ghost" size="sm" className="text-gray-500">
                  <RefreshCw className="h-4 w-4" />
                  <span className="sr-only">Refresh conversation</span>
                </Button>
              </CardHeader>
              
              <Separator />
              
              <CardContent className={`p-4 ${expandedView ? 'flex-grow overflow-y-auto' : 'h-[500px] overflow-y-auto'}`}>
                <div className="space-y-4">
                  {conversation.map((message, index) => (
                    <div 
                      key={index} 
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.role === 'user' 
                            ? 'bg-tutor-blue text-white ml-auto' 
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${message.role === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-lg p-3">
                        <div className="flex space-x-1 items-center">
                          <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse"></div>
                          <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                          <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>
              
              <div className="p-4 border-t border-gray-100">
                {conversation.length === 1 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-2">Suggested questions:</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestedQuestions.map((question, index) => (
                        <Button 
                          key={index} 
                          variant="outline" 
                          size="sm" 
                          className="text-xs bg-gray-50 border-gray-200 hover:bg-tutor-light-blue hover:text-tutor-blue hover:border-tutor-blue"
                          onClick={() => handleSuggestedQuestion(question)}
                        >
                          {question}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex space-x-2">
                  <Input
                    value={userInput}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about any math concept or problem..."
                    className="rounded-full border-gray-200 focus:border-tutor-blue focus:ring-tutor-blue"
                  />
                  <Button 
                    onClick={handleSendMessage} 
                    disabled={userInput.trim() === ""}
                    className="rounded-full bg-tutor-blue hover:bg-tutor-dark-blue text-white px-4"
                  >
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Send</span>
                  </Button>
                </div>
                
                <p className="text-xs text-gray-500 mt-2 text-center">The AI tutor can explain concepts, solve problems, and provide practice exercises.</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITutor;
