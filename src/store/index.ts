import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  phone: string;
  countryCode: string;
  isAuthenticated: boolean;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      setUser: (user: User) => set({ user, isLoading: false }),
      logout: () => set({ user: null }),
      setLoading: (loading: boolean) => set({ isLoading: loading }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date | string;
  image?: string;
}

export interface Chatroom {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date | string;
  lastMessage?: string;
}

interface ChatState {
  chatrooms: Chatroom[];
  currentChatroom: string | null;
  isTyping: boolean;
  searchQuery: string;
  darkMode: boolean;
  addChatroom: (chatroom: Omit<Chatroom, 'id' | 'createdAt'>) => void;
  deleteChatroom: (id: string) => void;
  setCurrentChatroom: (id: string | null) => void;
  addMessage: (chatroomId: string, message: Omit<Message, 'id' | 'timestamp'>) => void;
  setTyping: (typing: boolean) => void;
  setSearchQuery: (query: string) => void;
  toggleDarkMode: () => void;
  loadMoreMessages: (chatroomId: string) => Message[];
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      chatrooms: [],
      currentChatroom: null,
      isTyping: false,
      searchQuery: '',
      darkMode: false,
      addChatroom: (chatroom) => {
        const newChatroom: Chatroom = {
          ...chatroom,
          id: Date.now().toString(),
          createdAt: new Date(),
        };
        set((state) => ({
          chatrooms: [newChatroom, ...state.chatrooms],
        }));
      },
      deleteChatroom: (id) =>
        set((state) => ({
          chatrooms: state.chatrooms.filter((room) => room.id !== id),
          currentChatroom: state.currentChatroom === id ? null : state.currentChatroom,
        })),
      setCurrentChatroom: (id) => set({ currentChatroom: id }),
      addMessage: (chatroomId, message) => {
        const newMessage: Message = {
          ...message,
          id: Date.now().toString(),
          timestamp: new Date(),
        };
        set((state) => ({
          chatrooms: state.chatrooms.map((room) =>
            room.id === chatroomId
              ? {
                  ...room,
                  messages: [...room.messages, newMessage],
                  lastMessage: message.content,
                }
              : room
          ),
        }));
      },
      setTyping: (typing) => set({ isTyping: typing }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      loadMoreMessages: (chatroomId) => {
        // Simulate loading older messages
        const dummyMessages: Message[] = Array.from({ length: 10 }, (_, i) => ({
          id: `dummy-${Date.now()}-${i}`,
          content: `This is a dummy message #${i + 1} from the past.`,
          isUser: i % 2 === 0,
          timestamp: new Date(Date.now() - (i + 1) * 60000), // Messages from past minutes
        }));
        
        set((state) => ({
          chatrooms: state.chatrooms.map((room) =>
            room.id === chatroomId
              ? {
                  ...room,
                  messages: [...dummyMessages, ...room.messages],
                }
              : room
          ),
        }));
        
        return dummyMessages;
      },
    }),
    {
      name: 'chat-storage',
    }
  )
);
