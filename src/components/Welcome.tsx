import React from 'react';
import { FileUp, MessageCircle, FileSearch } from 'lucide-react';

interface WelcomeProps {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
}

export const Welcome: React.FC<WelcomeProps> = ({ onFileUpload, isUploading }) => {
  return (
    <div className="flex justify-center items-center bg-gray-100 p-6">
  <div className="max-w-screen-lg w-full space-y-8 animate-fade-in">
    <h1 className="text-5xl font-bold text-[#8b4513] animate-slide-up text-center">
      Welcome to Legal Buddy
    </h1>
    <div className="bg-white p-12 rounded-xl shadow-xl space-y-8 animate-slide-up-delayed">
      <h2 className="text-3xl font-semibold text-[#2f5233] text-center">Hello there! 👋</h2>
      <p className="text-gray-700 text-xl text-center">
        Your AI-powered legal document assistant. Let's analyze your documents together.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 bg-[#f8f5f2] rounded-lg border-l-4 border-[#2f5233]">
          <div className="flex items-center gap-3 mb-3">
            <FileUp className="w-8 h-8 text-[#2f5233]" />
            <h3 className="font-semibold text-[#8b4513] text-xl">Step 1</h3>
          </div>
          <h4 className="font-medium text-gray-800 mb-2 text-lg">Upload Document</h4>
          <p className="text-gray-600 text-lg">Start by uploading your legal document for analysis.</p>
        </div>

        <div className="p-8 bg-[#f8f5f2] rounded-lg border-l-4 border-[#2f5233]">
          <div className="flex items-center gap-3 mb-3">
            <FileSearch className="w-8 h-8 text-[#2f5233]" />
            <h3 className="font-semibold text-[#8b4513] text-xl">Step 2</h3>
          </div>
          <h4 className="font-medium text-gray-800 mb-2 text-lg">Review Analysis</h4>
          <p className="text-gray-600 text-lg">Get instant insights and key information extraction.</p>
        </div>

        <div className="p-8 bg-[#f8f5f2] rounded-lg border-l-4 border-[#2f5233]">
          <div className="flex items-center gap-3 mb-3">
            <MessageCircle className="w-8 h-8 text-[#2f5233]" />
            <h3 className="font-semibold text-[#8b4513] text-xl">Step 3</h3>
          </div>
          <h4 className="font-medium text-gray-800 mb-2 text-lg">Get Assistance</h4>
          <p className="text-gray-600 text-lg">Chat with our AI to understand your document better.</p>
        </div>
      </div>

      <div className="mt-10 flex justify-center">
        <label
          htmlFor="file-upload"
          className={`inline-flex items-center gap-3 px-10 py-5 bg-[#2f5233] text-white rounded-xl cursor-pointer hover:bg-[#1e351f] transition-colors shadow-xl text-lg ${
            isUploading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <FileUp className="w-6 h-6" />
          {isUploading ? 'Uploading...' : 'Upload Your Document'}
          <input
            type="file"
            id="file-upload"
            onChange={onFileUpload}
            className="hidden"
            disabled={isUploading}
          />
        </label>
      </div>
    </div>
  </div>
</div>

  );
};