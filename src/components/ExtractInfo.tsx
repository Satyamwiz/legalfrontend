import React from 'react';
import { FileSearch, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface ExtractInfoProps {
  selectedFile: File | null;
}

export const ExtractInfo: React.FC<ExtractInfoProps> = ({ selectedFile }) => {
  return (
    <div className="flex justify-center items-center bg-gray-100 p-8">
      <div className="animate-fade-in animate-slide-up max-w-screen-lg w-full space-y-8 bg-white p-12 rounded-xl shadow-xl">
        <div className="flex items-center gap-4 mb-8">
          <FileSearch className="w-10 h-10 text-[#2f5233]" />
          <h2 className="text-3xl font-bold text-[#8b4513]">Document Information Extraction</h2>
        </div>

        {selectedFile ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
              <div className="space-y-5">
                <h3 className="text-xl font-medium text-[#2f5233]">Document Overview</h3>
                <div className="bg-[#f8f5f2] p-6 rounded-lg">
                  <p className="text-gray-700 text-lg">Filename: {selectedFile.name}</p>
                  <p className="text-gray-600 text-md mt-2">
                    Size: {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <h3 className="text-xl font-medium text-[#2f5233]">Extraction Status</h3>
                <div className="bg-[#f8f5f2] p-6 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <p className="text-gray-700 text-lg">Document processed successfully</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <h3 className="text-xl font-medium text-[#2f5233]">Extracted Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 bg-[#f8f5f2] rounded-lg">
                  <h4 className="font-semibold text-[#8b4513] mb-3">Parties Involved</h4>
                  <ul className="space-y-2 text-gray-600 text-lg">
                    <li>• Company A (Employer)</li>
                    <li>• Company B (Contractor)</li>
                  </ul>
                </div>

                <div className="p-6 bg-[#f8f5f2] rounded-lg">
                  <h4 className="font-semibold text-[#8b4513] mb-3">Key Dates</h4>
                  <ul className="space-y-2 text-gray-600 text-lg">
                    <li>• Effective Date: 01/01/2024</li>
                    <li>• Termination Date: 12/31/2024</li>
                  </ul>
                </div>

                <div className="p-6 bg-[#f8f5f2] rounded-lg">
                  <h4 className="font-semibold text-[#8b4513] mb-3">Contract Value</h4>
                  <p className="text-gray-600 text-lg">$50,000 USD</p>
                </div>

                <div className="p-6 bg-[#f8f5f2] rounded-lg">
                  <h4 className="font-semibold text-[#8b4513] mb-3">Governing Law</h4>
                  <p className="text-gray-600 text-lg">State of California, United States</p>
                </div>
              </div>

              <div className="mt-10">
                <h3 className="text-xl font-medium text-[#2f5233] mb-5">Critical Clauses</h3>
                <div className="space-y-6">
                  <div className="p-6 bg-[#f8f5f2] rounded-lg border-l-4 border-yellow-500">
                    <div className="flex items-center gap-3 mb-3">
                      <AlertCircle className="w-6 h-6 text-yellow-500" />
                      <h4 className="font-semibold text-[#8b4513]">Non-Compete Clause</h4>
                    </div>
                    <p className="text-gray-600 text-lg">2-year restriction period within 100-mile radius</p>
                  </div>

                  <div className="p-6 bg-[#f8f5f2] rounded-lg border-l-4 border-red-500">
                    <div className="flex items-center gap-3 mb-3">
                      <XCircle className="w-6 h-6 text-red-500" />
                      <h4 className="font-semibold text-[#8b4513]">Termination Clause</h4>
                    </div>
                    <p className="text-gray-600 text-lg">30-day notice required for early termination</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <FileSearch className="w-20 h-20 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-medium text-gray-600 mb-3">No Document Selected</h3>
            <p className="text-gray-500 text-lg">Please upload a document to extract information</p>
          </div>
        )}
      </div>
    </div>
  );
};
