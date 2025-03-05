
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown, BookOpen, BarChart2, Brain, Calculator } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard', icon: <BarChart2 className="w-4 h-4" /> },
    { name: 'Practice', path: '/practice', icon: <Calculator className="w-4 h-4" /> },
    { name: 'AI Tutor', path: '/ai-tutor', icon: <Brain className="w-4 h-4" /> }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-sm shadow-soft' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-tutor-blue" />
              <span className="text-xl font-semibold tracking-tight">MathMentor</span>
            </Link>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="group inline-flex items-center space-x-1.5 text-sm font-medium text-gray-700 hover:text-tutor-blue transition-colors"
              >
                {item.icon && <span className="opacity-80 group-hover:opacity-100">{item.icon}</span>}
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-tutor-blue focus:outline-none transition-colors"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6 transition-all duration-300" />
              ) : (
                <Menu className="block h-6 w-6 transition-all duration-300" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pt-2 pb-3 space-y-1 sm:px-6 bg-white/95 backdrop-blur-sm shadow-soft">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-tutor-blue hover:bg-gray-50 transition-all"
              onClick={() => setIsOpen(false)}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
