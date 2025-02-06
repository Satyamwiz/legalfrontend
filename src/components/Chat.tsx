import React, { useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';

interface ChatMessage {
  id: number;
  text: string;
  timestamp: string;
  sender: 'user' | 'bot';
}

interface ChatProps {
  chatHistory: ChatMessage[];
  currentMessage: string;
  setCurrentMessage: (message: string) => void;
  handleSendMessage: (e: React.FormEvent) => void;
}

export const Chat: React.FC<ChatProps> = ({
  chatHistory,
  currentMessage,
  setCurrentMessage,
  handleSendMessage,
}) => {
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <div className="bg-white rounded-lg shadow-lg h-[calc(100vh-12rem)] flex flex-col">
      <div className="bg-[#2f5233] text-white p-4 rounded-t-lg">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Bot className="w-6 h-6" />
          Legal Assistant Chat
        </h2>
        <p className="text-sm text-gray-200">Ask questions about your legal documents</p>
      </div>

      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-6 space-y-4"
      >
        {chatHistory.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] p-4 rounded-lg flex items-start gap-3 ${
                message.sender === 'user'
                  ? 'bg-[#2f5233] text-white'
                  : 'bg-[#f8f5f2] text-gray-800'
              }`}
            >
              {message.sender === 'user' ? (
                <User className="w-5 h-5 mt-1" />
              ) : (
                <Bot className="w-5 h-5 mt-1" />
              )}
              <div>
                <p className="text-sm">{message.text}</p>
                <p className={`text-xs mt-1 ${
                  message.sender === 'user' ? 'text-gray-200' : 'text-gray-500'
                }`}>
                  {message.timestamp}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 p-4 bg-white rounded-b-lg">
        <form onSubmit={handleSendMessage} className="flex items-center gap-4">
          <input
            type="text"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            placeholder="Ask about your document..."
            className="flex-1 p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f5233]"
          />
          <button
            type="submit"
            className="px-6 py-4 bg-[#2f5233] text-white rounded-lg hover:bg-[#1e351f] transition-colors flex items-center gap-2"
            disabled={!currentMessage.trim()}
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </form>
      </div>
    </div>
  );
};