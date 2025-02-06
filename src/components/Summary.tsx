import React from 'react';
import { FileText, Calendar, Building2, Clock } from 'lucide-react';

interface SummaryProps {
  companyName: string;
  selectedFile: File | null;
}

export const Summary: React.FC<SummaryProps> = ({ companyName, selectedFile }) => {
  return (
    <div className="flex justify-center items-center bg-gray-100 p-8">
      <div className="animate-fade-in animate-slide-up max-w-screen-lg w-full space-y-8 bg-white p-12 rounded-xl shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 ">
          {/* Company Profile */}
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <Building2 className="w-8 h-8 text-[#2f5233]" />
              <h3 className="text-2xl font-bold text-[#8b4513]">Company Profile</h3>
            </div>
            <div className="bg-[#f8f5f2] p-6 rounded-lg">
              <p className="text-gray-700 text-lg font-medium">{companyName}</p>
              <p className="text-gray-600 text-md mt-2">Legal Document Analysis Summary</p>
            </div>
          </div>

          {/* Document Details (Only if a file is selected) */}
          {selectedFile && (
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <FileText className="w-8 h-8 text-[#2f5233]" />
                <h3 className="text-2xl font-bold text-[#8b4513]">Document Details</h3>
              </div>
              <div className="bg-[#f8f5f2] p-6 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Calendar className="w-6 h-6 text-[#2f5233]" />
                  <p className="text-gray-600 text-lg">
                    Uploaded: {new Date().toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-6 h-6 text-[#2f5233]" />
                  <p className="text-gray-600 text-lg">
                    Last Modified: {new Date(selectedFile.lastModified).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Key Findings */}
        <div className="bg-white p-12 rounded-xl shadow-lg">
          <h3 className="text-2xl font-bold text-[#8b4513] mb-6">Key Findings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-[#f8f5f2] rounded-lg border-l-4 border-[#2f5233]">
              <h4 className="font-semibold text-[#2f5233] mb-2 text-lg">Document Type</h4>
              <p className="text-gray-600 text-lg">Legal Agreement</p>
            </div>

            <div className="p-6 bg-[#f8f5f2] rounded-lg border-l-4 border-[#2f5233]">
              <h4 className="font-semibold text-[#2f5233] mb-2 text-lg">Risk Level</h4>
              <p className="text-gray-600 text-lg">Low</p>
            </div>

            <div className="p-6 bg-[#f8f5f2] rounded-lg border-l-4 border-[#2f5233]">
              <h4 className="font-semibold text-[#2f5233] mb-2 text-lg">Key Dates</h4>
              <p className="text-gray-600 text-lg">None identified</p>
            </div>

            <div className="p-6 bg-[#f8f5f2] rounded-lg border-l-4 border-[#2f5233]">
              <h4 className="font-semibold text-[#2f5233] mb-2 text-lg">Action Items</h4>
              <p className="text-gray-600 text-lg">No immediate actions required</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
