import React from 'react';
import { FileSearch, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface ExtractInfoProps {
  selectedFile: File | null;
}

export const ExtractInfo: React.FC<ExtractInfoProps> = ({ selectedFile }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <FileSearch className="w-8 h-8 text-[#2f5233]" />
          <h2 className="text-2xl font-semibold text-[#8b4513]">Document Information Extraction</h2>
        </div>

        {selectedFile ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-[#2f5233]">Document Overview</h3>
                <div className="bg-[#f8f5f2] p-4 rounded-lg">
                  <p className="text-gray-700">Filename: {selectedFile.name}</p>
                  <p className="text-gray-600 text-sm mt-2">
                    Size: {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-[#2f5233]">Extraction Status</h3>
                <div className="bg-[#f8f5f2] p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <p className="text-gray-700">Document processed successfully</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-medium text-[#2f5233]">Extracted Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-[#f8f5f2] rounded-lg">
                  <h4 className="font-medium text-[#8b4513] mb-3">Parties Involved</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Company A (Employer)</li>
                    <li>• Company B (Contractor)</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-[#f8f5f2] rounded-lg">
                  <h4 className="font-medium text-[#8b4513] mb-3">Key Dates</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Effective Date: 01/01/2024</li>
                    <li>• Termination Date: 12/31/2024</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-[#f8f5f2] rounded-lg">
                  <h4 className="font-medium text-[#8b4513] mb-3">Contract Value</h4>
                  <p className="text-gray-600">$50,000 USD</p>
                </div>
                
                <div className="p-4 bg-[#f8f5f2] rounded-lg">
                  <h4 className="font-medium text-[#8b4513] mb-3">Governing Law</h4>
                  <p className="text-gray-600">State of California, United States</p>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-medium text-[#2f5233] mb-4">Critical Clauses</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-[#f8f5f2] rounded-lg border-l-4 border-yellow-500">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-yellow-500" />
                      <h4 className="font-medium text-[#8b4513]">Non-Compete Clause</h4>
                    </div>
                    <p className="text-gray-600">2-year restriction period within 100-mile radius</p>
                  </div>
                  
                  <div className="p-4 bg-[#f8f5f2] rounded-lg border-l-4 border-red-500">
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle className="w-5 h-5 text-red-500" />
                      <h4 className="font-medium text-[#8b4513]">Termination Clause</h4>
                    </div>
                    <p className="text-gray-600">30-day notice required for early termination</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <FileSearch className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">No Document Selected</h3>
            <p className="text-gray-500">Please upload a document to extract information</p>
          </div>
        )}
      </div>
    </div>
  );
};