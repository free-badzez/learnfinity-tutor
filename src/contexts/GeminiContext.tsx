
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getGeminiApiKey, hasGeminiApiKey, setGeminiApiKey } from '@/services/geminiService';

type Conversation = {
  role: string;
  content: string;
  timestamp: Date;
}[];

interface GeminiContextType {
  conversation: Conversation;
  setConversation: React.Dispatch<React.SetStateAction<Conversation>>;
  hasApiKey: boolean;
  refreshHasApiKey: () => void;
  apiKey: string | null;
  setApiKey: (key: string) => void;
}

const defaultConversation: Conversation = [
  {
    role: "assistant",
    content: "Hello! I'm your personal mathematics tutor. How can I help you today? You can ask me to solve problems, explain concepts, or guide you through math topics.",
    timestamp: new Date()
  }
];

// Default API key to use if none is provided
const DEFAULT_API_KEY = "dummy-api-key";

const GeminiContext = createContext<GeminiContextType | undefined>(undefined);

export const GeminiProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [conversation, setConversation] = useState<Conversation>(defaultConversation);
  const [hasApiKey, setHasApiKey] = useState<boolean>(true); // Default to true now
  const [apiKey, setApiKeyState] = useState<string | null>(DEFAULT_API_KEY);

  useEffect(() => {
    // If there's no API key stored, use the default one
    if (!hasGeminiApiKey()) {
      setGeminiApiKey(DEFAULT_API_KEY);
    }
    
    refreshHasApiKey();
    setApiKeyState(getGeminiApiKey() || DEFAULT_API_KEY);
  }, []);

  const refreshHasApiKey = () => {
    setHasApiKey(true); // Always return true to prevent API key prompts
  };

  const setApiKey = (key: string) => {
    setGeminiApiKey(key);
    setApiKeyState(key);
    refreshHasApiKey();
  };

  return (
    <GeminiContext.Provider value={{
      conversation,
      setConversation,
      hasApiKey,
      refreshHasApiKey,
      apiKey,
      setApiKey
    }}>
      {children}
    </GeminiContext.Provider>
  );
};

export const useGemini = (): GeminiContextType => {
  const context = useContext(GeminiContext);
  if (context === undefined) {
    throw new Error('useGemini must be used within a GeminiProvider');
  }
  return context;
};
