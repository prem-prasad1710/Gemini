'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { MessageInput } from './MessageInput';
import { MessageSkeleton } from '@/components/ui/Skeleton';
import { useChatStore } from '@/store';
import { MessageFormData } from '@/lib/validations';
import { simulateAIResponse } from '@/services/api';

interface ChatInterfaceProps {
  chatroomId: string;
}

export function ChatInterface({ chatroomId }: ChatInterfaceProps) {
  const [loading, setLoading] = useState(false);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const {
    chatrooms,
    isTyping,
    addMessage,
    setTyping,
    loadMoreMessages,
  } = useChatStore();

  const currentChatroom = chatrooms.find(room => room.id === chatroomId);

  // Auto scroll to bottom
  const scrollToBottom = useCallback((smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: smooth ? 'smooth' : 'auto' 
    });
  }, []);

  // Throttled scroll handler for infinite scroll
  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container || loadingOlder || !hasMoreMessages) return;

    if (container.scrollTop === 0) {
      setLoadingOlder(true);
      
      // Simulate loading delay
      setTimeout(() => {
        const newMessages = loadMoreMessages(chatroomId);
        if (newMessages.length < 10) {
          setHasMoreMessages(false);
        }
        setLoadingOlder(false);
        
        // Maintain scroll position
        setTimeout(() => {
          if (container) {
            container.scrollTop = 100;
          }
        }, 50);
      }, 1000);
    }
  }, [chatroomId, loadingOlder, hasMoreMessages, loadMoreMessages]);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const shouldScroll = 
      container.scrollHeight - container.scrollTop - container.clientHeight < 100;

    if (shouldScroll) {
      scrollToBottom();
    }
  }, [currentChatroom?.messages, scrollToBottom]);

  // Scroll to bottom on initial load
  useEffect(() => {
    setTimeout(() => scrollToBottom(false), 100);
  }, [chatroomId, scrollToBottom]);

  const handleSendMessage = async (data: MessageFormData) => {
    if (!data.content.trim() && !data.image) return;

    setLoading(true);

    try {
      // Add user message
      addMessage(chatroomId, {
        content: data.content,
        isUser: true,
        image: data.image,
      });

      // Show typing indicator
      setTyping(true);

      // Simulate AI response with throttling
      const aiResponse = await simulateAIResponse(data.content);
      
      // Add AI response
      setTimeout(() => {
        addMessage(chatroomId, {
          content: aiResponse,
          isUser: false,
        });
        setTyping(false);
      }, 500);

    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
      setTyping(false);
    } finally {
      setLoading(false);
    }
  };

  if (!currentChatroom) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Chatroom not found
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please select a valid chatroom
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {currentChatroom.title}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {currentChatroom.messages.length} message{currentChatroom.messages.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {/* Load more indicator */}
        {loadingOlder && (
          <div className="text-center py-2">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Loading older messages...
            </p>
          </div>
        )}

        {/* No more messages indicator */}
        {!hasMoreMessages && currentChatroom.messages.length > 10 && (
          <div className="text-center py-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No more messages to load
            </p>
          </div>
        )}

        {/* Messages */}
        {currentChatroom.messages.length > 0 ? (
          currentChatroom.messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 mb-2">
              No messages yet
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Start a conversation with Gemini!
            </p>
          </div>
        )}

        {/* Typing indicator */}
        {isTyping && <TypingIndicator />}

        {/* Loading skeleton for first load */}
        {loading && currentChatroom.messages.length === 0 && <MessageSkeleton />}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput 
        onSubmit={handleSendMessage} 
        loading={loading}
        disabled={isTyping}
      />
    </div>
  );
}
