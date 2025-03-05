import React, { useState, useRef, useEffect } from 'react';
import { Brain, Send, Lightbulb, Calculator, ArrowRight, Sigma, BookOpen, RefreshCw, Maximize2, Minimize2, PlusCircle, X, MessageSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { solveMathProblem } from '@/services/geminiService';
import { toast } from "@/hooks/use-toast";

const AITutor = () => {
  const [userInput, setUserInput] = useState("");
  const [conversation, setConversation] = useState<Array<{ role: string; content: string; timestamp: Date }>>([
    {
      role: "assistant",
      content: "Hello! I'm your personal mathematics tutor. How can I help you today? You can ask me to solve problems, explain concepts, or guide you through math topics.",
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [expandedView, setExpandedView] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const handleSendMessage = async () => {
    if (userInput.trim() === "") return;

    // Add user message to conversation
    const newConversation = [
      ...conversation,
      {
        role: "user",
        content: userInput,
        timestamp: new Date(),
      },
    ];

    setConversation(newConversation);
    setUserInput("");
    setIsTyping(true);

    try {
      // Use Gemini to solve the math problem
      const response = await solveMathProblem(userInput);

      setConversation([
        ...newConversation,
        {
          role: "assistant",
          content: response,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Error getting response:", error);

      setConversation([
        ...newConversation,
        {
          role: "assistant",
          content: "I'm sorry, I encountered an error while processing your question. Please try again later.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleRefresh = () => {
    setConversation([
      {
        role: "assistant",
        content: "Hello! I'm your personal mathematics tutor. How can I help you today? You can ask me to solve problems, explain concepts, or guide you through math topics.",
        timestamp: new Date(),
      },
    ]);
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

                <Button variant="ghost" size="sm" className="text-gray-500" onClick={handleRefresh}>
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
                        <p className="text-sm whitespace-pre-line">{message.content}</p>
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

                <p className="text-xs text-gray-500 mt-2 text-center">
                  The AI tutor can explain concepts, solve problems, and provide step-by-step solutions.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITutor;
