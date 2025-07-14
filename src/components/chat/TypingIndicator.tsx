'use client';

import { Bot } from 'lucide-react';

export function TypingIndicator() {
  return (
    <div className="flex gap-3 justify-start">
      {/* Avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
        <Bot className="h-4 w-4 text-white" />
      </div>

      {/* Typing Animation */}
      <div className="max-w-[70%]">
        <div className="bg-gray-100 dark:bg-gray-700 px-4 py-3 rounded-2xl">
          <div className="flex items-center gap-1">
            <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">
              Gemini is typing
            </span>
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
