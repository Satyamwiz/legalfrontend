import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Outlet } from 'react-router-dom';
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

function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuItems = [
    { id: 'summary', label: 'Document Summary', icon: ScrollText, path: '/summary' },
    { id: 'chat', label: 'Legal Assistant', icon: MessageCircle, path: '/chat' },
    { id: 'extract', label: 'Extract Info', icon: FileSearch, path: '/extract' },
    { id: 'manual', label: 'User Manual', icon: BookOpen, path: '/manual' },
  ];

  return (
    <div className="flex h-screen bg-[#f8f5f2]">
      {/* Sidebar */}
      <div className="w-64 bg-[#8b4513] text-white shadow-lg">
        <div className="p-4">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold mb-6">
            <Building2 className="w-5 h-5" />
            Legal Buddy
          </Link>

          {/* Menu Button */}
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
                  <Link
                    key={item.id}
                    to={item.path}
                    className="block px-4 py-2 hover:bg-[#2f5233] transition-colors rounded flex items-center gap-2"
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <Outlet /> {/* This will render the matched route's component */}
        </div>
      </div>
    </div>
  );
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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append('file', file);
  
        const response = await fetch('/upload', {
          method: 'POST',
          headers: {
          },
          body: formData,
        });
  
        if (!response.ok) {
          throw new Error('Error uploading file');
        }
  
        const uploadResponse = await response.json();
        setSelectedFile(file);
        setFileId(uploadResponse.fileId);
  
        const [summary, extract] = await Promise.all([
          getDocumentSummary(uploadResponse.fileId),
          extractDocumentInfo(uploadResponse.fileId),
        ]);
  
        setSummaryData(summary);
        setExtractData(extract);
      } catch (error) {
        console.error('Error uploading file:', error);
      } finally {
        setIsUploading(false);
      }
    }
  };
  

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Main Routes */}
          <Route index element={<Welcome onFileUpload={handleFileUpload} isUploading={isUploading} />} />
          <Route path="summary" element={<Summary companyName={companyName} selectedFile={selectedFile} summaryData={summaryData} isLoading={!summaryData && !!selectedFile} />} />
          <Route path="chat" element={<Chat chatHistory={chatHistory} currentMessage={currentMessage} setCurrentMessage={setCurrentMessage} handleSendMessage={(e) => {
            e.preventDefault();
            if (currentMessage.trim()) {
              setChatHistory([...chatHistory, { id: Date.now(), text: currentMessage, timestamp: new Date().toLocaleTimeString(), sender: 'user' }]);
              setCurrentMessage('');
            }
          }} />} />
          <Route path="extract" element={<ExtractInfo selectedFile={selectedFile} extractData={extractData} isLoading={!extractData && !!selectedFile} />} />
          <Route path="manual" element={<Manual />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
