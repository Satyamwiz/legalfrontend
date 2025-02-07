import React, { useRef, useState, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ChatMessage {
  id: number;
  text: string;
  timestamp: string;
  sender: 'user' | 'bot';
}

interface ChatProps {
  fileId: string | null;
}

export const Chat: React.FC<ChatProps> = ({ fileId }) => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isQuerying, setIsQuerying] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Automatically scroll to the bottom when chatHistory updates.
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMessage.trim()) return;

    // If the document is not uploaded (i.e. fileId is missing), alert the user.
   

    // Create and append the user message.
    const userMessage: ChatMessage = {
      id: Date.now(),
      text: currentMessage,
      timestamp: new Date().toLocaleTimeString(),
      sender: 'user'
    };
    setChatHistory(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsQuerying(true);

    try {
      // Hit the /ask endpoint with the user's query.
      const response = await fetch('http://127.0.0.1:5000/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: userMessage.text })
      });
      
      // If response is not OK, alert the error message.
      if (!response.ok) {
        alert(`Error: ${response.statusText}`);
        return;
      }
      
      const data = await response.json();

      // Create the bot message with the API's answer.
      const botMessage: ChatMessage = {
        id: Date.now() + 1,
        text: data.answer,
        timestamp: new Date().toLocaleTimeString(),
        sender: 'bot'
      };
      setChatHistory(prev => [...prev, botMessage]);
    } catch (error: any) {
      alert(`Error querying the document: ${error.message}`);
      console.error(error);
    } finally {
      setIsQuerying(false);
    }
  };

  return (
    <div className="flex  bg-gray-100 p-6  ">
      <div className="animate-fade-in animate-slide-up w-screen max-w-screen-lg  h-[calc(100vh-10rem)] bg-white rounded-xl shadow-xl flex flex-col">
        <div className="bg-[#2f5233] text-white p-6 rounded-t-xl flex flex-col">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Bot className="w-7 h-7" />
            Legal Assistant Chat
          </h2>
          <p className="text-md text-gray-200">Ask questions about your legal documents</p>
        </div>
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-5">
          {chatHistory.map((message) => (
            <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] p-5 rounded-xl flex items-start gap-4 ${message.sender === 'user' ? 'bg-[#2f5233] text-white' : 'bg-[#f8f5f2] text-gray-800'}`}>
                {message.sender === 'user' ? <User className="w-6 h-6 mt-1" /> : <Bot className="w-6 h-6 mt-1" />}
                <div>
                  <p className="text-base">{message.text}</p>
                  <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-gray-300' : 'text-gray-500'}`}>
                    {message.timestamp}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-200 p-5 bg-white rounded-b-xl">
          <form onSubmit={handleSendMessage} className="flex items-center gap-4">
            <input
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              placeholder="Ask about your document..."
              className="flex-1 p-4 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-[#2f5233]"
            />
            <button
              type="submit"
              disabled={!currentMessage.trim() || isQuerying}
              className="px-7 py-4 bg-[#2f5233] text-white rounded-lg hover:bg-[#1e351f] transition-colors flex items-center gap-2 text-lg"
            >
              <Send className="w-5 h-5" />
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
