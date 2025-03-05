
import React, { useEffect, useRef } from 'react';
import { ArrowRight, Brain, Sparkles, Gauge, Calculator, BarChart2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const applyAnimation = () => {
      const elements = heroRef.current?.querySelectorAll('.animate-on-load');
      
      elements?.forEach((el, index) => {
        setTimeout(() => {
          (el as HTMLElement).style.opacity = '1';
          (el as HTMLElement).style.transform = 'translateY(0)';
        }, 100 * index);
      });
    };
    
    applyAnimation();
  }, []);

  return (
    <div ref={heroRef} className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-16">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/3 w-full h-full bg-gradient-to-br from-tutor-light-blue/30 via-transparent to-transparent rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 lg:pr-12 mb-10 lg:mb-0">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-tutor-light-blue text-tutor-blue text-xs font-medium mb-4 animate-on-load opacity-0 transform translate-y-4 transition-all duration-500" style={{ transitionDelay: '100ms' }}>
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              <span>AI-Powered Learning</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-on-load opacity-0 transform translate-y-4 transition-all duration-500" style={{ transitionDelay: '200ms' }}>
              Your Personalized <br />
              <span className="text-tutor-blue">Mathematics Tutor</span>
            </h1>
            
            <p className="text-lg text-gray-600 mb-8 max-w-lg animate-on-load opacity-0 transform translate-y-4 transition-all duration-500" style={{ transitionDelay: '300ms' }}>
              Experience adaptive learning that adjusts to your pace and style, with real-time feedback and personalized guidance.
            </p>
            
            <div className="flex flex-wrap gap-4 animate-on-load opacity-0 transform translate-y-4 transition-all duration-500" style={{ transitionDelay: '400ms' }}>
              <Button asChild className="bg-tutor-blue hover:bg-tutor-dark-blue text-white rounded-full px-8 py-6 h-auto transition-all duration-300 shadow-soft hover:shadow-medium">
                <Link to="/dashboard">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="border-gray-300 text-gray-700 hover:text-tutor-blue hover:border-tutor-blue rounded-full px-8 py-6 h-auto transition-all duration-300">
                <Link to="/ai-tutor">
                  <Brain className="mr-2 h-5 w-5" />
                  Try AI Tutor
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="lg:w-1/2 animate-on-load opacity-0 transform translate-y-4 transition-all duration-500" style={{ transitionDelay: '500ms' }}>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-medium bg-white">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-lg">Algebra Concept</h3>
                    <div className="flex items-center space-x-1.5 text-sm bg-tutor-light-blue text-tutor-blue px-3 py-1 rounded-full">
                      <Gauge className="w-4 h-4" />
                      <span>Progress: 78%</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-tutor-muted p-4 rounded-lg">
                      <p className="text-sm font-medium">Solve for x: 3x + 5 = 20</p>
                      <div className="mt-2 pl-4 border-l-2 border-tutor-blue">
                        <p className="text-sm text-gray-600">Step 1: Subtract 5 from both sides</p>
                        <p className="text-sm text-gray-600">3x = 15</p>
                        <p className="text-sm text-gray-600">Step 2: Divide both sides by 3</p>
                        <p className="text-sm text-gray-600">x = 5</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <div className="inline-flex items-center text-sm text-tutor-blue font-medium">
                        <Brain className="w-4 h-4 mr-1.5" />
                        <span>Ask AI Tutor</span>
                      </div>
                      <div className="text-xs text-gray-500">Updated 5 minutes ago</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-6 -right-6 -z-10 w-full h-full bg-tutor-accent/20 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-on-load opacity-0 transform translate-y-4 transition-all duration-500" style={{ transitionDelay: '600ms' }}>
          <div className="bg-white rounded-lg p-6 shadow-soft hover:shadow-medium transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-tutor-light-blue flex items-center justify-center text-tutor-blue mb-4">
              <Brain className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Adaptive Learning</h3>
            <p className="text-gray-600">AI that adjusts to your personal learning pace and style</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-soft hover:shadow-medium transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-tutor-light-blue flex items-center justify-center text-tutor-blue mb-4">
              <Calculator className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Step-by-Step Solutions</h3>
            <p className="text-gray-600">Detailed explanations for every problem you encounter</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-soft hover:shadow-medium transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-tutor-light-blue flex items-center justify-center text-tutor-blue mb-4">
              <BarChart2 className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Progress Tracking</h3>
            <p className="text-gray-600">Monitor your improvements and identify areas for growth</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
