'use client';

import { useState, useEffect } from 'react';
import { DashboardSidebar } from './DashboardSidebar';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { useChatStore } from '@/store';
import { Menu, X } from 'lucide-react';

export function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentChatroom, setCurrentChatroom } = useChatStore();

  const handleChatroomSelect = (id: string) => {
    setCurrentChatroom(id);
    setSidebarOpen(false); // Close sidebar on mobile after selection
  };

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="h-screen flex bg-gray-100 dark:bg-gray-900">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? (
          <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        ) : (
          <Menu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        )}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-80 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <DashboardSidebar onChatroomSelect={handleChatroomSelect} />
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {currentChatroom ? (
          <ChatInterface chatroomId={currentChatroom} />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center max-w-md mx-auto p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome to Gemini Clone
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Select a chatroom from the sidebar to start chatting with AI, or create a new one to begin.
              </p>
              
              <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <p>✨ AI-powered conversations</p>
                <p>🖼️ Image upload support</p>
                <p>📱 Mobile responsive design</p>
                <p>🌙 Dark mode available</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
