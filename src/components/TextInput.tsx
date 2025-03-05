import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface TextInputProps {
  text: string;
  onTextChange: (text: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const TextInput = ({ text, onTextChange, onGenerate, isLoading }: TextInputProps) => {
  return (
    <div className="space-y-4 animate-fade-in">
      <Textarea
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder="Enter your text here..."
        className="min-h-[200px] p-4 rounded-lg shadow-sm border border-gray-200 focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-all"
      />
      <Button
        onClick={onGenerate}
        disabled={isLoading}
        className="w-full py-6 text-lg font-medium rounded-lg bg-black text-white hover:bg-gray-800 transition-all duration-200"
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          "Generate Questions"
        )}
      </Button>
    </div>
  );
};

export default TextInput;