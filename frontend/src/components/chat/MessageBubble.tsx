import React from 'react';
import type { ChatMessage } from '../../types';
import { SourceCitation } from './SourceCitation';
import { Bot, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface MessageBubbleProps {
  message: ChatMessage;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const { user } = useAuth();
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 my-4 animate-fade-in ${isUser ? 'justify-end' : 'justify-start'}`}>
      {/* Bot Icon on Left for Assistant */}
      {!isUser && (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 border border-indigo-400/30 flex items-center justify-center text-white shrink-0 shadow-md shadow-indigo-600/20">
          <Bot className="w-4.5 h-4.5" />
        </div>
      )}

      {/* Bubble Container */}
      <div
        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed shadow-lg ${
          isUser
            ? 'bg-indigo-600 text-white rounded-br-none shadow-indigo-600/10 border border-indigo-500/30'
            : 'bg-slate-900/90 text-slate-100 border border-slate-800 rounded-bl-none'
        }`}
      >
        {/* Author Label & Time */}
        <div className="flex items-center justify-between gap-4 mb-1.5 text-[11px] opacity-70">
          <span className="font-semibold">{isUser ? user?.full_name || 'You' : 'AI Assistant'}</span>
          <span>{message.timestamp}</span>
        </div>

        {/* Message Content */}
        <div className="whitespace-pre-wrap">{message.content}</div>

        {/* Citations if available */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <SourceCitation sources={message.sources} />
        )}
      </div>

      {/* User Avatar on Right for User */}
      {isUser && (
        <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 text-xs font-semibold">
          {user?.full_name ? user.full_name.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
        </div>
      )}
    </div>
  );
};
