// Simple API service for chatting
// Using JSONPlaceholder as fake API for demo purposes
// For real implementation, replace with your backend API

const CHAT_API = 'https://jsonplaceholder.typicode.com';

export const chatAPI = {
  // Simulated fetch messages
  fetchMessages: async (chatId) => {
    try {
      // Simulating fetch with random delay
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            {id: '1', text: 'Hey! How are you?', sender: 'other', timestamp: Date.now() - 5000},
            {id: '2', text: 'I am good!', sender: 'me', timestamp: Date.now() - 3000},
          ]);
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
          resolve({
            id: Date.now().toString(),
            text: message,
            photo: photo,
            sender: 'me',
            timestamp: Date.now(),
          });
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
};

export default chatAPI;
