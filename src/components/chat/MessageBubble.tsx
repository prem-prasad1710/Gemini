'use client';

import { useState } from 'react';
import { Copy, Check, User, Bot } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Message } from '@/store';
import { formatTime, copyToClipboard } from '@/lib/utils';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(message.content);
    if (success) {
      setCopied(true);
      toast.success('Message copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error('Failed to copy message');
    }
  };

  return (
    <div className={`flex gap-3 ${message.isUser ? 'justify-end' : 'justify-start'} group`}>
      {/* Avatar */}
      {!message.isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
          <Bot className="h-4 w-4 text-white" />
        </div>
      )}

      {/* Message Content */}
      <div className={`max-w-[70%] ${message.isUser ? 'order-2' : 'order-1'}`}>
        <div
          className={`relative px-4 py-3 rounded-2xl ${
            message.isUser
              ? 'bg-blue-600 text-white ml-auto'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
          }`}
        >
          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className={`absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10 ${
              message.isUser ? 'text-white' : 'text-gray-600 dark:text-gray-400'
            }`}
            aria-label="Copy message"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </button>

          {/* Message Text */}
          <div className="pr-8">
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
              {message.content}
            </p>
            
            {/* Image */}
            {message.image && (
              <div className="mt-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={message.image}
                  alt="Uploaded image"
                  className="max-w-full h-auto rounded-lg border border-gray-200 dark:border-gray-600"
                  style={{ maxHeight: '300px' }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Timestamp */}
        <div className={`flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400 ${
          message.isUser ? 'justify-end' : 'justify-start'
        }`}>
          <span>{formatTime(message.timestamp)}</span>
        </div>
      </div>

      {/* User Avatar */}
      {message.isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center order-3">
          <User className="h-4 w-4 text-white" />
        </div>
      )}
    </div>
  );
}
