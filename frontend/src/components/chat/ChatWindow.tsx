import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../../types';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { Bot, Sparkles, Trash2, MessageSquare, BookOpen } from 'lucide-react';
import { queryApi } from '../../api/query';
import { formatApiError } from '../../api/client';
import { toast } from 'react-toastify';

interface ChatWindowProps {
  kbId: string | number;
  kbName?: string;
  hasDocuments?: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ kbId, kbName, hasDocuments = true }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  const handleSendMessage = async (question: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: question,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsGenerating(true);

    try {
      const response = await queryApi.askQuestion(kbId, question);
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.answer,
        sources: response.sources,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      const msg = formatApiError(err);
      toast.error(msg);

      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: `Sorry, I encountered an error while querying your documents: "${msg}". Please check your knowledge base or try again.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsGenerating(false);
    }
  };

  const samplePrompts = [
    "Summarize the key findings from the uploaded documents.",
    "What are the main concepts covered in this knowledge base?",
    "List the important dates and action items mentioned.",
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-210px)] min-h-[500px] bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl">
      {/* Header Bar */}
      <div className="px-6 py-4 border-b border-slate-800/80 bg-slate-900/80 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100">
              AI Query Assistant
            </h3>
            <p className="text-xs text-slate-400">
              Answers generated using retrieved context from <span className="text-indigo-300 font-medium">{kbName || 'this Knowledge Base'}</span>
            </p>
          </div>
        </div>

        {messages.length > 0 && (
          <button
            onClick={() => setMessages([])}
            className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-rose-400 px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Chat</span>
          </button>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {!hasDocuments && (
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs flex items-center gap-2 mb-4">
            <BookOpen className="w-4 h-4 shrink-0" />
            <span>No documents found in this Knowledge Base yet. Upload PDF/MD/TXT files in the Documents tab for optimal answers!</span>
          </div>
        )}

        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4 py-8">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 animate-pulse-glow">
              <Sparkles className="w-8 h-8" />
            </div>
            <h4 className="text-base font-semibold text-slate-100">
              Ask a question about your documents
            </h4>
            <p className="text-xs text-slate-400 max-w-md mt-1.5">
              The AI will retrieve relevant text chunks from your knowledge base and synthesize an answer with exact source citations.
            </p>

            {/* Quick Prompts */}
            <div className="mt-6 w-full max-w-lg space-y-2">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Try a sample question
              </p>
              <div className="grid grid-cols-1 gap-2">
                {samplePrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(prompt)}
                    className="text-left text-xs p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-300 hover:text-white hover:border-indigo-500/40 hover:bg-slate-900 transition-all flex items-center justify-between group"
                  >
                    <span>"{prompt}"</span>
                    <MessageSquare className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}

            {/* Generating Indicator */}
            {isGenerating && (
              <div className="flex gap-3 my-4 animate-fade-in items-center">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 border border-indigo-400/30 flex items-center justify-center text-white shrink-0">
                  <Bot className="w-4.5 h-4.5" />
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-bl-none p-4 text-xs text-slate-400 flex items-center space-x-2">
                  <span className="font-medium text-slate-300">Searching context & generating response...</span>
                  <div className="flex space-x-1 items-center">
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/80">
        <ChatInput onSendMessage={handleSendMessage} isLoading={isGenerating} />
      </div>
    </div>
  );
};
