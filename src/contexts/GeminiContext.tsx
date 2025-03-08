
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

const GeminiContext = createContext<GeminiContextType | undefined>(undefined);

export const GeminiProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [conversation, setConversation] = useState<Conversation>(defaultConversation);
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);
  const [apiKey, setApiKeyState] = useState<string | null>(null);

  useEffect(() => {
    refreshHasApiKey();
    setApiKeyState(getGeminiApiKey());
  }, []);

  const refreshHasApiKey = () => {
    setHasApiKey(hasGeminiApiKey());
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
