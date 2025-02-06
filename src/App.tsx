import React, { useState } from 'react';
import { FileUp, Building2, ChevronDown, ChevronUp, List, ScrollText, MessageCircle, FileSearch, BookOpen } from 'lucide-react';
import { Welcome } from './components/Welcome';
import { Summary } from './components/Summary';
import { Chat } from './components/Chat';
import { ExtractInfo } from './components/ExtractInfo';
import { Manual } from './components/Manual';
import { uploadDocument, getDocumentSummary, extractDocumentInfo } from './api';
import type { SummaryResponse, ExtractResponse } from './api';

interface ChatMessage {
  id: number;
  text: string;
  timestamp: string;
  sender: 'user' | 'bot';
}

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileId, setFileId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [summaryData, setSummaryData] = useState<SummaryResponse | null>(null);
  const [extractData, setExtractData] = useState<ExtractResponse | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('chatHistory');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentMessage, setCurrentMessage] = useState('');
  const [companyName] = useState('ItechSpeed Inc.');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState<'welcome' | 'summary' | 'chat' | 'extract' | 'manual'>('welcome');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const uploadResponse = await uploadDocument(file);
        setSelectedFile(file);
        setFileId(uploadResponse.fileId);
        addChatMessage(`File uploaded: ${file.name}`, 'bot');
        
        // Get summary and extracted info
        const [summary, extract] = await Promise.all([
          getDocumentSummary(uploadResponse.fileId),
          extractDocumentInfo(uploadResponse.fileId)
        ]);
        
        setSummaryData(summary);
        setExtractData(extract);
        setSelectedPage('summary');
      } catch (error) {
        addChatMessage('Error uploading file. Please try again.', 'bot');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const addChatMessage = (text: string, sender: 'user' | 'bot') => {
    const newMessage: ChatMessage = {
      id: Date.now(),
      text,
      timestamp: new Date().toLocaleTimeString(),
      sender
    };
    setChatHistory(prev => {
      const updated = [...prev, newMessage];
      localStorage.setItem('chatHistory', JSON.stringify(updated));
      return updated;
    });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentMessage.trim()) {
      addChatMessage(currentMessage, 'user');
      setTimeout(() => {
        addChatMessage('Thank you for your message. I am processing your request.', 'bot');
      }, 1000);
      setCurrentMessage('');
    }
  };

  const menuItems = [
    { id: 'summary', label: 'Document Summary', icon: ScrollText },
    { id: 'chat', label: 'Legal Assistant', icon: MessageCircle },
    { id: 'extract', label: 'Extract Info', icon: FileSearch },
    { id: 'manual', label: 'User Manual', icon: BookOpen },
  ];

  return (
    <div className="flex h-screen bg-[#f8f5f2]">
      <div className="w-64 bg-[#8b4513] text-white shadow-lg">
        <div className="p-4">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Legal Buddy
          </h2>
          
          <div className="mb-6">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-full px-4 py-2 bg-[#2f5233] text-white rounded-lg hover:bg-[#1e351f] transition-colors flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <List className="w-4 h-4" />
                Menu
              </span>
              {isMenuOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            
            {isMenuOpen && (
              <div className="mt-2 space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedPage(item.id as any);
                      setIsMenuOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-left hover:bg-[#2f5233] transition-colors rounded flex items-center gap-2 ${
                      selectedPage === item.id ? 'bg-[#2f5233]' : ''
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Upload Document</label>
              <div className="relative">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  disabled={isUploading}
                />
                <label
                  htmlFor="file-upload"
                  className={`flex items-center gap-2 px-4 py-2 bg-[#2f5233] text-white rounded-lg cursor-pointer hover:bg-[#1e351f] transition-colors ${
                    isUploading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <FileUp className="w-4 h-4" />
                  {isUploading ? 'Uploading...' : selectedFile ? selectedFile.name : 'Choose file'}
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          {selectedPage === 'welcome' && (
            <Welcome onFileUpload={handleFileUpload} isUploading={isUploading} />
          )}
          
          {selectedPage === 'summary' && (
            <Summary 
              companyName={companyName} 
              selectedFile={selectedFile}
              summaryData={summaryData}
              isLoading={!summaryData && !!selectedFile}
            />
          )}
          
          {selectedPage === 'chat' && (
            <Chat
              chatHistory={chatHistory}
              currentMessage={currentMessage}
              setCurrentMessage={setCurrentMessage}
              handleSendMessage={handleSendMessage}
            />
          )}
          
          {selectedPage === 'extract' && (
            <ExtractInfo 
              selectedFile={selectedFile}
              extractData={extractData}
              isLoading={!extractData && !!selectedFile}
            />
          )}
          
          {selectedPage === 'manual' && (
            <Manual />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;