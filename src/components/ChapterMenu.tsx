
import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from "@/components/ui/input";

interface Chapter {
  name: string;
  count: number;
}

interface ChapterMenuProps {
  chapters: Chapter[];
  onSelectChapter: (chapter: string) => void;
  selectedChapter: string;
}

const ChapterMenu: React.FC<ChapterMenuProps> = ({ 
  chapters, 
  onSelectChapter,
  selectedChapter 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  const filteredChapters = chapters.filter(chapter => 
    chapter.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    // Close menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full" ref={menuRef}>
      <div 
        className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 cursor-pointer shadow-sm"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium">
            {selectedChapter || "Search for a chapter"}
          </span>
        </div>
        {isExpanded ? 
          <ChevronUp className="h-4 w-4 text-gray-500" /> : 
          <ChevronDown className="h-4 w-4 text-gray-500" />
        }
      </div>

      {isExpanded && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg border border-gray-200 shadow-lg z-10">
          <div className="p-2">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search chapters..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8"
                autoFocus
              />
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              {searchQuery && (
                <X
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSearchQuery('');
                  }}
                />
              )}
            </div>
          </div>
          
          <div className="max-h-60 overflow-y-auto">
            {filteredChapters.length > 0 ? (
              filteredChapters.map((chapter) => (
                <div 
                  key={chapter.name}
                  className={`flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                    selectedChapter === chapter.name ? 'bg-tutor-light-blue/50 text-tutor-blue font-medium' : ''
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectChapter(chapter.name);
                    setIsExpanded(false);
                  }}
                >
                  <span className="text-sm font-medium">{chapter.name}</span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{chapter.count}</span>
                </div>
              ))
            ) : (
              <div className="p-3 text-center text-gray-500">
                No chapters found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChapterMenu;
