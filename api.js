// Simple API service for chatting
// Using JSONPlaceholder as fake API for demo purposes
// For real implementation, replace with your backend API

import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAT_API = 'https://jsonplaceholder.typicode.com';
const USERS_STORAGE_KEY = 'capchat_users';
const MESSAGES_STORAGE_KEY = 'capchat_messages';

// Mock user database with pre-seeded accounts
let mockUsers = {
  'test@example.com': {
    id: '1',
    email: 'test@example.com',
    username: 'testuser',
    password: 'test123',
  },
  'demo@capchat.com': {
    id: '2',
    email: 'demo@capchat.com',
    username: 'demochat',
    password: 'demo123',
  },
  'user@capchat.com': {
    id: '3',
    email: 'user@capchat.com',
    username: 'chatuser',
    password: 'user123',
  },
};

// Initialize storage on app start
const initializeStorage = async () => {
  try {
    const storedUsers = await AsyncStorage.getItem(USERS_STORAGE_KEY);
    if (storedUsers) {
      mockUsers = { ...mockUsers, ...JSON.parse(storedUsers) };
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
};

// Initialize on import
initializeStorage();

// Mock messages storage for chats
const mockMessages = {
  '1': [
    {id: '1', text: 'Hey! How are you?', sender: 'other', timestamp: Date.now() - 5000, isRead: false},
    {id: '2', text: 'I am good!', sender: 'me', timestamp: Date.now() - 3000, isRead: true},
    {id: '3', text: 'What are you doing?', sender: 'other', timestamp: Date.now() - 1000, isRead: false},
  ],
  '2': [
    {id: '1', text: 'Hey bro!', sender: 'other', timestamp: Date.now() - 15000, isRead: true},
    {id: '2', text: 'How was the party?', sender: 'me', timestamp: Date.now() - 12000, isRead: true},
    {id: '3', text: 'omg same energy fr fr', sender: 'other', timestamp: Date.now() - 5000, isRead: false},
  ],
  '3': [
    {id: '1', text: 'Yo squad! 🔥', sender: 'other', timestamp: Date.now() - 20000, isRead: true},
    {id: '2', text: 'What\'s the plan?', sender: 'me', timestamp: Date.now() - 18000, isRead: true},
    {id: '3', text: 'Let\'s meet up later ✨', sender: 'other', timestamp: Date.now() - 5000, isRead: false},
  ],
  '4': [
    {id: '1', text: 'Hi beta 💕', sender: 'other', timestamp: Date.now() - 25000, isRead: true},
    {id: '2', text: 'All good mom!', sender: 'me', timestamp: Date.now() - 22000, isRead: true},
    {id: '3', text: 'Have you eaten baby?', sender: 'other', timestamp: Date.now() - 5000, isRead: false},
  ],
};

export const chatAPI = {
  // Simulated fetch messages
  fetchMessages: async (chatId) => {
    try {
      // Simulating fetch with random delay
      return new Promise((resolve) => {
        setTimeout(() => {
          // Return messages for this chat (empty array for new chats)
          const messages = mockMessages[chatId] || [];
          resolve(messages);
        }, 500);
      });
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  },

  // Simulated send message
  sendMessage: async (chatId, message, photo = null) => {
    try {
      return new Promise((resolve) => {
        setTimeout(() => {
          const newMessage = {
            id: Date.now().toString(),
            text: message,
            photo: photo,
            sender: 'me',
            timestamp: Date.now(),
            isRead: true,
          };
          
          // Store message in mock storage
          if (!mockMessages[chatId]) {
            mockMessages[chatId] = [];
          }
          mockMessages[chatId].push(newMessage);
          
          resolve(newMessage);
        }, 300);
      });
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // Simulated typing indicator
  sendTypingStatus: async (chatId, isTyping) => {
    try {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({success: true});
        }, 100);
      });
    } catch (error) {
      console.error('Error sending typing status:', error);
    }
  },

  // Mark messages as read
  markMessagesAsRead: async (chatId, messageIds) => {
    try {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true, updatedCount: messageIds.length });
        }, 100);
      });
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  },

  // Search messages
  searchMessages: async (chatId, searchQuery) => {
    try {
      return new Promise((resolve) => {
        setTimeout(() => {
          // Mock search results
          const allMessages = [
            {id: '1', text: 'Hey! How are you?', sender: 'other', timestamp: Date.now() - 5000, isRead: false},
            {id: '2', text: 'I am good!', sender: 'me', timestamp: Date.now() - 3000, isRead: true},
            {id: '3', text: 'What are you doing?', sender: 'other', timestamp: Date.now() - 1000, isRead: false},
            {id: '4', text: 'Let\'s go out', sender: 'other', timestamp: Date.now() - 500, isRead: false},
            {id: '5', text: 'I\'m free tomorrow', sender: 'me', timestamp: Date.now() - 200, isRead: true},
          ];
          
          const results = allMessages.filter(msg => 
            msg.text.toLowerCase().includes(searchQuery.toLowerCase())
          );
          resolve(results);
        }, 300);
      });
    } catch (error) {
      console.error('Error searching messages:', error);
      throw error;
    }
  },
};

// Authentication API
export const authAPI = {
  // Simulated login
  login: async (email, password) => {
    try {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simple validation
          if (!email || !password) {
            reject(new Error('Email and password are required'));
            return;
          }

          if (mockUsers[email] && mockUsers[email].password === password) {
            resolve({
              id: mockUsers[email].id,
              email: email,
              username: mockUsers[email].username,
              token: 'mock-jwt-token-' + Date.now(),
            });
          } else {
            reject(new Error('Invalid email or password'));
          }
        }, 800);
      });
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  // Simulated signup
  signup: async (email, password, username) => {
    try {
      return new Promise(async (resolve, reject) => {
        setTimeout(async () => {
          // Validation
          if (!email || !password || !username) {
            reject(new Error('All fields are required'));
            return;
          }

          if (mockUsers[email]) {
            reject(new Error('User already exists'));
            return;
          }

          // Create new user
          const newUser = {
            id: Date.now().toString(),
            email: email,
            username: username,
            password: password,
          };

          mockUsers[email] = newUser;

          // Persist to AsyncStorage
          try {
            await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(mockUsers));
          } catch (storageError) {
            console.warn('Warning: Could not persist user data:', storageError);
          }

          resolve({
            id: newUser.id,
            email: email,
            username: username,
            token: 'mock-jwt-token-' + Date.now(),
          });
        }, 800);
      });
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  },

  // Simulated logout
  logout: async () => {
    try {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true });
        }, 200);
      });
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  },

  // Verify token
  verifyToken: async (token) => {
    try {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (token && token.startsWith('mock-jwt-token-')) {
            resolve({ valid: true });
          } else {
            reject(new Error('Invalid token'));
          }
        }, 200);
      });
    } catch (error) {
      console.error('Error verifying token:', error);
      throw error;
    }
  },
};

export default chatAPI;
