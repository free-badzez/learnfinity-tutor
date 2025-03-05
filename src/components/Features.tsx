
import React, { useEffect, useRef } from 'react';
import { Brain, BarChart2, LineChart, Calculator, CheckCircle2, LightbulbIcon, MessageSquare, Clock } from 'lucide-react';

const Features = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = sectionRef.current?.querySelectorAll('.feature-item');
    elements?.forEach((el) => observer.observe(el));

    return () => {
      elements?.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Accelerate Your Mathematical Journey</h2>
          <p className="text-lg text-gray-600">
            Our AI tutor adapts to your unique learning style, providing personalized guidance and feedback.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="feature-item opacity-0 transform translate-y-8 transition-all duration-700 bg-white rounded-xl p-6 shadow-soft hover:shadow-medium border border-gray-100">
            <div className="w-12 h-12 rounded-full bg-tutor-light-blue flex items-center justify-center text-tutor-blue mb-4">
              <Brain className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-3">AI-Powered Tutoring</h3>
            <p className="text-gray-600">
              Receive personalized guidance and explanations tailored to your learning style and pace.
            </p>
          </div>

          <div className="feature-item opacity-0 transform translate-y-8 transition-all duration-700 delay-100 bg-white rounded-xl p-6 shadow-soft hover:shadow-medium border border-gray-100">
            <div className="w-12 h-12 rounded-full bg-tutor-light-blue flex items-center justify-center text-tutor-blue mb-4">
              <LineChart className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Adaptive Learning Paths</h3>
            <p className="text-gray-600">
              Experience a curriculum that adapts to your strengths and areas for improvement.
            </p>
          </div>

          <div className="feature-item opacity-0 transform translate-y-8 transition-all duration-700 delay-200 bg-white rounded-xl p-6 shadow-soft hover:shadow-medium border border-gray-100">
            <div className="w-12 h-12 rounded-full bg-tutor-light-blue flex items-center justify-center text-tutor-blue mb-4">
              <Calculator className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Interactive Problem Solving</h3>
            <p className="text-gray-600">
              Work through problems with step-by-step guidance and real-time feedback.
            </p>
          </div>

          <div className="feature-item opacity-0 transform translate-y-8 transition-all duration-700 delay-300 bg-white rounded-xl p-6 shadow-soft hover:shadow-medium border border-gray-100">
            <div className="w-12 h-12 rounded-full bg-tutor-light-blue flex items-center justify-center text-tutor-blue mb-4">
              <BarChart2 className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Comprehensive Analytics</h3>
            <p className="text-gray-600">
              Track your progress with detailed insights into your performance and growth areas.
            </p>
          </div>

          <div className="feature-item opacity-0 transform translate-y-8 transition-all duration-700 delay-400 bg-white rounded-xl p-6 shadow-soft hover:shadow-medium border border-gray-100">
            <div className="w-12 h-12 rounded-full bg-tutor-light-blue flex items-center justify-center text-tutor-blue mb-4">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Instant Verification</h3>
            <p className="text-gray-600">
              Get immediate feedback on your solutions with explanations for incorrect answers.
            </p>
          </div>

          <div className="feature-item opacity-0 transform translate-y-8 transition-all duration-700 delay-500 bg-white rounded-xl p-6 shadow-soft hover:shadow-medium border border-gray-100">
            <div className="w-12 h-12 rounded-full bg-tutor-light-blue flex items-center justify-center text-tutor-blue mb-4">
              <MessageSquare className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Natural Conversations</h3>
            <p className="text-gray-600">
              Ask questions and receive explanations in a natural, conversational interface.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .feature-item.show {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </section>
  );
};

export default Features;
