'use client';

import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { Plus, Search, LogOut, Moon, Sun } from 'lucide-react';
import { ChatroomCard } from './ChatroomCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ChatroomSkeleton } from '@/components/ui/Skeleton';
import { useChatStore, useAuthStore } from '@/store';
import { chatroomSchema, ChatroomFormData } from '@/lib/validations';

interface DashboardSidebarProps {
  onChatroomSelect: (id: string) => void;
  className?: string;
}

export function DashboardSidebar({ onChatroomSelect, className }: DashboardSidebarProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const {
    chatrooms,
    currentChatroom,
    searchQuery,
    darkMode,
    addChatroom,
    deleteChatroom,
    setSearchQuery,
    toggleDarkMode,
  } = useChatStore();
  
  const { logout, user } = useAuthStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChatroomFormData>({
    resolver: zodResolver(chatroomSchema),
  });

  // Debounced search
  const debouncedSearch = useMemo(() => {
    let timeoutId: NodeJS.Timeout;
    return (query: string) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setSearchQuery(query), 300);
    };
  }, [setSearchQuery]);

  const filteredChatrooms = useMemo(() => {
    if (!searchQuery.trim()) return chatrooms;
    
    return chatrooms.filter(chatroom =>
      chatroom.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chatroom.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [chatrooms, searchQuery]);

  const handleCreateChatroom = async (data: ChatroomFormData) => {
    setLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      addChatroom({
        title: data.title,
        messages: [],
      });
      
      toast.success('Chatroom created successfully!');
      reset();
      setShowCreateForm(false);
    } catch (error) {
      console.error('Failed to create chatroom:', error);
      toast.error('Failed to create chatroom');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteChatroom = (id: string) => {
    deleteChatroom(id);
    toast.success('Chatroom deleted successfully!');
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
  };

  return (
    <div className={`flex flex-col h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Gemini Clone
          </h1>
          
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>
            
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-red-600 dark:text-red-400"
              aria-label="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* User Info */}
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {user?.countryCode} {user?.phone}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search chatrooms..."
            onChange={(e) => debouncedSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Create Chatroom */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        {showCreateForm ? (
          <form onSubmit={handleSubmit(handleCreateChatroom)} className="space-y-3">
            <Input
              placeholder="Enter chatroom title"
              {...register('title')}
              error={errors.title?.message}
              autoFocus
            />
            <div className="flex gap-2">
              <Button type="submit" loading={loading} size="sm" className="flex-1">
                Create
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowCreateForm(false);
                  reset();
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <Button
            onClick={() => setShowCreateForm(true)}
            className="w-full"
            variant="outline"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Chatroom
          </Button>
        )}
      </div>

      {/* Chatrooms List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {loading && chatrooms.length === 0 ? (
          <ChatroomSkeleton />
        ) : filteredChatrooms.length > 0 ? (
          filteredChatrooms.map((chatroom) => (
            <ChatroomCard
              key={chatroom.id}
              chatroom={chatroom}
              onSelect={onChatroomSelect}
              onDelete={handleDeleteChatroom}
              isSelected={currentChatroom === chatroom.id}
            />
          ))
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-500 dark:text-gray-400 mb-2">
              {searchQuery ? 'No chatrooms found' : 'No chatrooms yet'}
            </div>
            {!searchQuery && (
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Create your first chatroom to get started
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
