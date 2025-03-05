
import React, { useState } from 'react';
import { BarChart2, Clock, Brain, BookOpen, TrendingUp, ArrowUpRight, CalendarDays, CheckCircle, User, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Sample data for the dashboard
  const topicProgress = [
    { id: 1, topic: "Algebra", progress: 85, status: "On track" },
    { id: 2, topic: "Geometry", progress: 72, status: "Needs review" },
    { id: 3, topic: "Calculus", progress: 45, status: "Behind" },
    { id: 4, topic: "Trigonometry", progress: 65, status: "On track" },
    { id: 5, topic: "Statistics", progress: 30, status: "Just started" },
  ];

  const recentActivities = [
    { id: 1, activity: "Completed Linear Equations Quiz", time: "2 hours ago", score: "90%" },
    { id: 2, activity: "Practiced Geometry Problems", time: "Yesterday", score: "85%" },
    { id: 3, activity: "AI Tutor Session: Derivatives", time: "2 days ago", duration: "25 min" },
    { id: 4, activity: "Reviewed Trigonometry Concepts", time: "3 days ago", duration: "45 min" },
  ];

  const upcomingLessons = [
    { id: 1, title: "Advanced Quadratic Equations", date: "Tomorrow, 3:00 PM" },
    { id: 2, title: "Geometry: Triangles Deep Dive", date: "Wednesday, 4:30 PM" },
    { id: 3, title: "Introduction to Calculus", date: "Friday, 2:00 PM" },
  ];

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Learning Dashboard</h1>
            <p className="text-gray-600 mt-1">Track your progress and continue your learning journey</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                className="pl-10 pr-4 py-2 rounded-full border-gray-200 focus:border-tutor-blue focus:ring-tutor-blue"
                placeholder="Search topics..."
              />
            </div>
            <Button className="bg-tutor-blue hover:bg-tutor-dark-blue rounded-full">
              <Brain className="mr-2 h-4 w-4" />
              Start Learning
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white shadow-soft hover:shadow-medium transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Study Time</p>
                  <h3 className="text-2xl font-bold mt-1">24.5 hours</h3>
                  <p className="text-sm text-green-600 mt-1 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span>+2.5 hours this week</span>
                  </p>
                </div>
                <div className="bg-tutor-light-blue p-3 rounded-full">
                  <Clock className="h-6 w-6 text-tutor-blue" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-soft hover:shadow-medium transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Topics Mastered</p>
                  <h3 className="text-2xl font-bold mt-1">12 topics</h3>
                  <p className="text-sm text-green-600 mt-1 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span>+3 this month</span>
                  </p>
                </div>
                <div className="bg-tutor-light-blue p-3 rounded-full">
                  <CheckCircle className="h-6 w-6 text-tutor-blue" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-soft hover:shadow-medium transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">AI Tutor Sessions</p>
                  <h3 className="text-2xl font-bold mt-1">8 sessions</h3>
                  <p className="text-sm text-green-600 mt-1 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span>5 hours of assistance</span>
                  </p>
                </div>
                <div className="bg-tutor-light-blue p-3 rounded-full">
                  <Brain className="h-6 w-6 text-tutor-blue" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-white mb-6 p-1 rounded-lg shadow-soft inline-flex">
            <TabsTrigger value="overview" className="rounded-md data-[state=active]:bg-tutor-light-blue data-[state=active]:text-tutor-blue">
              Overview
            </TabsTrigger>
            <TabsTrigger value="progress" className="rounded-md data-[state=active]:bg-tutor-light-blue data-[state=active]:text-tutor-blue">
              Progress
            </TabsTrigger>
            <TabsTrigger value="schedule" className="rounded-md data-[state=active]:bg-tutor-light-blue data-[state=active]:text-tutor-blue">
              Schedule
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="bg-white shadow-soft h-full">
                  <CardHeader className="pb-0">
                    <CardTitle className="text-lg font-semibold flex items-center">
                      <BarChart2 className="h-5 w-5 mr-2 text-tutor-blue" />
                      Current Progress by Topic
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {topicProgress.map((topic) => (
                        <div key={topic.id} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{topic.topic}</span>
                            <span className="text-gray-500">{topic.progress}%</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                topic.progress >= 70 ? 'bg-green-500' : topic.progress >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${topic.progress}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500">{topic.status}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="bg-white shadow-soft h-full">
                  <CardHeader className="pb-0">
                    <CardTitle className="text-lg font-semibold flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-tutor-blue" />
                      Recent Activities
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {recentActivities.map((activity) => (
                        <div key={activity.id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                          <p className="font-medium text-sm">{activity.activity}</p>
                          <div className="flex justify-between mt-1">
                            <span className="text-xs text-gray-500">{activity.time}</span>
                            {activity.score && <span className="text-xs text-green-600">{activity.score}</span>}
                            {activity.duration && <span className="text-xs text-gray-600">{activity.duration}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="progress" className="mt-0">
            <Card className="bg-white shadow-soft">
              <CardHeader>
                <CardTitle>Your Learning Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Detailed progress visualization coming soon...</p>
                <div className="text-center p-6 border border-dashed border-gray-200 rounded-lg">
                  <BarChart2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Advanced progress tracking and analytics are being developed</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="mt-0">
            <Card className="bg-white shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarDays className="h-5 w-5 mr-2 text-tutor-blue" />
                  Upcoming Lessons
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingLessons.map((lesson) => (
                    <div key={lesson.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{lesson.title}</p>
                        <p className="text-sm text-gray-500 mt-1">{lesson.date}</p>
                      </div>
                      <Button variant="outline" className="rounded-full hover:bg-tutor-light-blue hover:text-tutor-blue">
                        <Calendar className="h-4 w-4 mr-2" />
                        Add Reminder
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
