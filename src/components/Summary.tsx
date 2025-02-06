import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";

interface SummaryProps {
  selectedFile: File | null;
}

interface SummaryData {
  answer: string;
  time_taken: string;
}

export const Summary: React.FC<SummaryProps> = ({ selectedFile }) => {
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch summary from backend when component mounts
  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://127.0.0.1:5000/summary", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: "Give summary for the provided document" }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch summary");
        }

        const data: SummaryData = await response.json();
        setSummaryData(data);
      } catch (err: any) {
        console.error("Error fetching summary:", err);
        // Use toast to display the error message with line breaks if needed:
        toast.error(`Error fetching summary:\n${err.message || "An error occurred while fetching summary"}`);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <div className="animate-fade-in animate-slide-up max-w-screen-lg w-full bg-white p-12 rounded-xl shadow-xl">
        <h3 className="text-2xl font-bold text-[#8b4513] mb-6 text-center">
          Summary & Key Findings
        </h3>

        {loading ? (
          <div className="flex items-center gap-2 justify-center">
            <Loader2 className="animate-spin w-6 h-6 text-blue-600" />
            <p className="text-gray-600 text-lg">Fetching summary...</p>
          </div>
        ) : summaryData ? (
          <>
            <p className="text-gray-700 text-lg whitespace-pre-line">
              {summaryData.answer}
            </p>
            <p className="mt-4 text-gray-500 text-sm text-center">
              Processing Time: {summaryData.time_taken}
            </p>
          </>
        ) : (
          <p className="text-gray-600 text-lg text-center">No summary available.</p>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Summary;
