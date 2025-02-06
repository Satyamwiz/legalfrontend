import React from 'react';
import { FileText, Calendar, Building2, Clock } from 'lucide-react';

interface SummaryProps {
  companyName: string;
  selectedFile: File | null;
}

export const Summary: React.FC<SummaryProps> = ({ companyName, selectedFile }) => {
  return (
    <div className="space-y-6 max-w-screen-xl w-full ">
      <div className="bg-white p-8 rounded-lg shadow-lg ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Building2 className="w-6 h-6 text-[#2f5233]" />
              <h3 className="text-3xl font-semibold text-[#8b4513]">Company Profile</h3>
            </div>
            <div className="bg-[#f8f5f2] p-4 rounded-lg">
              <p className="text-gray-700 text-lg font-medium">{companyName}</p>
              <p className="text-gray-600 text-lg mt-2">Legal Document Analysis Summary</p>
            </div>
          </div>
          
          {selectedFile && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-[#2f5233]" />
                <h3 className="text-3xl font-semibold text-[#8b4513]">Document Details</h3>
              </div>
              <div className="bg-[#f8f5f2] p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-[#2f5233]" />
                  <p className="text-gray-600 text-sm">
                    Uploaded: {new Date().toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#2f5233]" />
                  <p className="text-gray-600 text-sm">
                    Last Modified: {new Date(selectedFile.lastModified).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h3 className="text-3xl font-semibold text-[#8b4513] mb-4">Key Findings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-[#f8f5f2] rounded-lg border-l-4 border-[#2f5233]">
            <h4 className="font-medium text-[#2f5233] mb-2">Document Type</h4>
            <p className="text-gray-600">Legal Agreement</p>
          </div>
          <div className="p-4 bg-[#f8f5f2] rounded-lg border-l-4 border-[#2f5233]">
            <h4 className="font-medium text-[#2f5233] mb-2">Risk Level</h4>
            <p className="text-gray-600">Low</p>
          </div>
          <div className="p-4 bg-[#f8f5f2] rounded-lg border-l-4 border-[#2f5233]">
            <h4 className="font-medium text-[#2f5233] mb-2">Key Dates</h4>
            <p className="text-gray-600">None identified</p>
          </div>
          <div className="p-4 bg-[#f8f5f2] rounded-lg border-l-4 border-[#2f5233]">
            <h4 className="font-medium text-[#2f5233] mb-2">Action Items</h4>
            <p className="text-gray-600">No immediate actions required</p>
          </div>
        </div>
      </div>
    </div>
  );
};