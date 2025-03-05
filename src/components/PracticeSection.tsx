import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Brain, MessageSquare, Calculator, ChevronRight, Lightbulb, Clock, ListChecks, ArrowRight, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import ChapterMenu from './ChapterMenu';
import { hasGeminiApiKey, fetchGeminiApiKey } from '@/services/geminiService';

const PracticeSection = () => {
  const navigate = useNavigate();
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [apiKeyFetched, setApiKeyFetched] = useState(false);

  // Fetch API key on component mount
  useEffect(() => {
    const getApiKey = async () => {
      const success = await fetchGeminiApiKey();
      setApiKeyFetched(success);
    };
    
    getApiKey();
  }, []);

  // Topic categories for sidebar
  const topics = [
    { name: "Algebra", count: 25 },
    { name: "Geometry", count: 18 },
    { name: "Calculus", count: 12 },
    { name: "Trigonometry", count: 15 },
    { name: "Statistics", count: 10 },
    { name: "Probability", count: 8 },
  ];

  // Difficulty levels
  const difficulties = ["Easy", "Medium", "Hard"];

  const startTest = () => {
    if (!selectedTopic || !selectedDifficulty) {
      return;
    }
    
    if (!apiKeyFetched) {
      toast({
        title: "API Key Not Available",
        description: "Unable to fetch the Gemini API key. Please try again later.",
        variant: "destructive"
      });
      return;
    }
    
    navigate('/test', { state: { topic: selectedTopic, difficulty: selectedDifficulty } });
  };

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
                      className={`flex items-center justify-between p-2 rounded-md hover:bg-gray-50 cursor-pointer transition-colors ${selectedTopic === topic.name ? 'bg-tutor-light-blue/50 text-tutor-blue font-medium' : ''}`}
                      onClick={() => setSelectedTopic(topic.name)}
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
            <Card className="bg-white shadow-soft mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Create a Practice Test</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <h3 className="text-md font-medium mb-3">Selected Topic</h3>
                  <ChapterMenu 
                    chapters={topics} 
                    onSelectChapter={setSelectedTopic} 
                    selectedChapter={selectedTopic} 
                  />
                </div>

                <div className="mb-6">
                  <h3 className="text-md font-medium mb-3">Difficulty Level</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {difficulties.map((difficulty) => (
                      <div 
                        key={difficulty}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors flex flex-col items-center justify-center ${
                          selectedDifficulty === difficulty 
                            ? 'bg-tutor-light-blue/50 border-tutor-light-blue text-tutor-blue' 
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                        onClick={() => setSelectedDifficulty(difficulty)}
                      >
                        <span className="font-medium">{difficulty}</span>
                        <span className="text-xs mt-1">
                          {difficulty === "Easy" ? "10 questions, 20 min" : 
                           difficulty === "Medium" ? "5 questions, 15 min" : 
                           "5 questions, 10 min"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <Button 
                    onClick={startTest}
                    disabled={!selectedTopic || !selectedDifficulty || !apiKeyFetched}
                    className="w-full bg-tutor-blue hover:bg-tutor-dark-blue"
                  >
                    Start Practice Test
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                  
                  {(!selectedTopic || !selectedDifficulty) && (
                    <p className="text-sm text-gray-500 mt-2 text-center">
                      Please select both a topic and difficulty level to begin
                    </p>
                  )}
                  
                  {!apiKeyFetched && (
                    <p className="text-sm text-amber-600 mt-2 text-center">
                      Connecting to AI service...
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white shadow-soft">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Brain className="h-5 w-5 mr-2 text-tutor-blue" />
                    AI-Generated Practice
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Our AI generates personalized practice questions based on your selected topic and difficulty.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="bg-tutor-light-blue rounded-full p-1 mr-2 mt-0.5">
                        <Check className="h-3 w-3 text-tutor-blue" />
                      </span>
                      <span className="text-sm">Adaptive questions matched to your skill level</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-tutor-light-blue rounded-full p-1 mr-2 mt-0.5">
                        <Check className="h-3 w-3 text-tutor-blue" />
                      </span>
                      <span className="text-sm">Explanations for every problem</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-tutor-light-blue rounded-full p-1 mr-2 mt-0.5">
                        <Check className="h-3 w-3 text-tutor-blue" />
                      </span>
                      <span className="text-sm">Step-by-step solutions</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-soft">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2 text-tutor-blue" />
                    Ask the AI Tutor
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Get personalized help with any math question or concept you're struggling with.
                  </p>
                  <Button className="w-full flex items-center justify-center space-x-2 bg-tutor-blue hover:bg-tutor-dark-blue" onClick={() => navigate('/ai-tutor')}>
                    <span>Chat with AI Tutor</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
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
