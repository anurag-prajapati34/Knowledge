import React, { useState, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

interface ChatInputProps {
  onSendMessage: (question: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  disabled = false,
}) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading || disabled) return;

    onSendMessage(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative flex items-center bg-slate-900 border border-slate-800 rounded-2xl p-2 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
        <textarea
          ref={textareaRef}
          rows={1}
          placeholder="Ask any question about your uploaded documents..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading || disabled}
          className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm px-3 py-2 border-0 focus:outline-none resize-none max-h-32 disabled:opacity-50"
        />

        <Button
          type="submit"
          variant="primary"
          size="sm"
          disabled={!input.trim() || isLoading || disabled}
          isLoading={isLoading}
          className="rounded-xl px-4 py-2 shrink-0 ml-2"
        >
          {!isLoading && <Send className="w-4 h-4" />}
        </Button>
      </div>

      <p className="text-[11px] text-slate-400 mt-2 text-center flex items-center justify-center gap-1">
        <Sparkles className="w-3 h-3 text-indigo-400" />
        Press <kbd className="px-1 py-0.5 bg-slate-800 border border-slate-700 rounded font-mono text-[10px]">Enter</kbd> to send, <kbd className="px-1 py-0.5 bg-slate-800 border border-slate-700 rounded font-mono text-[10px]">Shift+Enter</kbd> for new line
      </p>
    </form>
  );
};
