import React, { useRef, useState, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { getDocumentSummary, extractDocumentInfo } from '../api/index.ts'; // Import your API calls

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
  fileId: string | null;  // Store fileId after upload
}

export const Chat: React.FC<ChatProps> = ({
  chatHistory,
  currentMessage,
  setCurrentMessage,
  handleSendMessage,
  fileId,
}) => {
  const [isQuerying, setIsQuerying] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [isDocumentUploaded, setIsDocumentUploaded] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleQuery = async (query: string) => {
    if (!fileId) {
      setResponseText('Please upload a document first.');
      return;
    }

    setIsQuerying(true);
    setResponseText('');

    try {
      // First, attempt to get the document summary or extract info
      const summary = await getDocumentSummary(fileId);
      const extraction = await extractDocumentInfo(fileId);

      // Construct the response message
      const result = `
        Document Type: ${summary.documentType}
        Risk Level: ${summary.riskLevel}
        Key Dates: ${summary.keyDates.join(', ')}
        Action Items: ${summary.actionItems.join(', ')}

        Parties Involved: ${extraction.parties.join(', ')}
        Effective Date: ${extraction.dates.effective}
        Termination Date: ${extraction.dates.termination}
        Contract Value: ${extraction.contractValue}
        Governing Law: ${extraction.governingLaw}
        
        Critical Clauses: ${extraction.criticalClauses.map((clause) => `${clause.type}: ${clause.description} (${clause.severity})`).join('; ')}
      `;
      setResponseText(result);
    } catch (error) {
      setResponseText('Error querying the document');
    } finally {
      setIsQuerying(false);
    }
  };

  return (
    <div className="flex justify-center items-center bg-gray-100 p-6">
      <div className="animate-fade-in animate-slide-up max-w-screen-lg w-full h-[calc(100vh-8rem)] bg-white rounded-xl shadow-xl flex flex-col">
        <div className="bg-[#2f5233] text-white p-6 rounded-t-xl flex flex-col">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Bot className="w-7 h-7" />
            Legal Assistant Chat
          </h2>
          <p className="text-md text-gray-200">Ask questions about your legal documents</p>
        </div>

        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-6 space-y-5"
        >
          {chatHistory.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] p-5 rounded-xl flex items-start gap-4 ${
                  message.sender === 'user'
                    ? 'bg-[#2f5233] text-white'
                    : 'bg-[#f8f5f2] text-gray-800'
                }`}
              >
                {message.sender === 'user' ? (
                  <User className="w-6 h-6 mt-1" />
                ) : (
                  <Bot className="w-6 h-6 mt-1" />
                )}
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
              className="px-7 py-4 bg-[#2f5233] text-white rounded-lg hover:bg-[#1e351f] transition-colors flex items-center gap-2 text-lg"
              disabled={!currentMessage.trim() || isQuerying}
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
