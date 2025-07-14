'use client';

import { useState } from 'react';
import { MessageCircle, Trash2, MoreVertical } from 'lucide-react';
import { Chatroom } from '@/store';
import { formatTime, formatDate } from '@/lib/utils';

interface ChatroomCardProps {
  chatroom: Chatroom;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  isSelected?: boolean;
}

export function ChatroomCard({ chatroom, onSelect, onDelete, isSelected = false }: ChatroomCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(chatroom.id);
    setShowMenu(false);
  };

  const lastMessage = chatroom.messages[chatroom.messages.length - 1];

  return (
    <div
      onClick={() => onSelect(chatroom.id)}
      className={`relative group p-4 rounded-lg cursor-pointer transition-all border-2 ${
        isSelected
          ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700'
          : 'bg-white border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-750'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <MessageCircle className="h-5 w-5 text-white" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <h3 className="font-medium text-gray-900 dark:text-white truncate">
              {chatroom.title}
            </h3>
            
            <div className="flex items-center gap-2 ml-2">
              <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                {formatDate(chatroom.createdAt)}
              </span>
              
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(!showMenu);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-opacity"
                >
                  <MoreVertical className="h-4 w-4 text-gray-500" />
                </button>
                
                {showMenu && (
                  <div className="absolute right-0 top-8 z-10 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg py-1 min-w-[120px]">
                    <button
                      onClick={handleDelete}
                      className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-1">
            {lastMessage ? (
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate flex-1">
                  {lastMessage.isUser ? 'You: ' : 'Gemini: '}
                  {lastMessage.content}
                </p>
                <span className="text-xs text-gray-500 dark:text-gray-500 whitespace-nowrap">
                  {formatTime(lastMessage.timestamp)}
                </span>
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-500 italic">
                No messages yet
              </p>
            )}
          </div>
        </div>
      </div>
      
      {chatroom.messages.length > 0 && (
        <div className="mt-2 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <span>{chatroom.messages.length} message{chatroom.messages.length !== 1 ? 's' : ''}</span>
        </div>
      )}
    </div>
  );
}
