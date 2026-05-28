'use client';

import { useState, FormEvent, KeyboardEvent } from 'react';
import { MESSAGES_UI_TEXT } from '../constants/messages.constants';

interface ChatInputFooterProps {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
}

export const ChatInputFooter = ({ onSendMessage, disabled = false }: ChatInputFooterProps) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex items-center gap-3">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={MESSAGES_UI_TEXT.chat.placeholder}
          className="flex-1 bg-gray-100 text-gray-700 py-3 px-5 rounded-full outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm border border-transparent disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!message.trim() || disabled}
          aria-label={MESSAGES_UI_TEXT.chat.sendLabel}
          className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-sm"
        >
          <svg 
            className="w-5 h-5 ml-0.5" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>
    </div>
  );
};
