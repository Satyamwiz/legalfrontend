// import React, { useEffect, useState } from "react";
// import { Loader2 } from "lucide-react";
// import ReactMarkdown from "react-markdown";

// interface ExtractionData {
//   answer: string;
//   time_taken: string;
// }

// interface ExtractInfoProps {
//   selectedFile: File | null;
// }

// export const ExtractInfo: React.FC<ExtractInfoProps> = ({ selectedFile }) => {
//   const [extractionData, setExtractionData] = useState<ExtractionData | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchExtraction = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         console.log("Fetching extraction data...");
//         const response = await fetch("http://127.0.0.1:5000/extract", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             input: "Extract all key legal information from the document",
//           }),
//         });

//         if (!response.ok) {
//           throw new Error("Failed to fetch extraction data");
//         }
//         const data: ExtractionData = await response.json();
//         setExtractionData(data);
//       } catch (err: any) {
//         console.error("Error fetching extraction data:", err);
//         setError(err.message || "An error occurred while fetching extraction data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     // Since the file has already been uploaded, we always fetch extraction data.
//     fetchExtraction();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
//       <div className="animate-fade-in animate-slide-up max-w-3xl w-full bg-white p-12 rounded-xl shadow-xl">
//         <h2 className="text-3xl font-bold text-center text-[#8b4513] mb-8">
//           Extracted Information
//         </h2>
//         {loading ? (
//           <div className="flex flex-col items-center gap-2">
//             <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
//             <p className="text-gray-700 text-lg">Extracting information...</p>
//           </div>
//         ) : error ? (
//           <p className="text-red-500 text-lg text-center">{error}</p>
//         ) : extractionData ? (
//           <>
//             {/* Scrollable container for the extracted answer */}
//             <div className="max-h-96 overflow-y-auto text-gray-700 text-lg whitespace-pre-line">
//               <ReactMarkdown>{extractionData.answer}</ReactMarkdown>
//             </div>
//             <p className="mt-6 text-gray-500 text-sm text-center">
//               Processing Time: {extractionData.time_taken}
//             </p>
//           </>
//         ) : (
//           <p className="text-gray-600 text-lg text-center">
//             No extraction data available.
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ExtractInfo;
import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface ExtractionData {
  answer: string;
  time_taken: string;
}

interface ExtractInfoProps {
  selectedFile: File | null;
}

export const ExtractInfo: React.FC<ExtractInfoProps> = ({ selectedFile }) => {
  const [extractionData, setExtractionData] = useState<ExtractionData | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExtraction = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("Fetching extraction data...");
        const response = await fetch("http://127.0.0.1:5000/extract", {
          method: "GET",
        });
        // const response = await fetch("http://127.0.0.1:5000/extract", {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify({
        //     input: "Extract all key legal information from the document",
        //   }),
        // });

        if (!response.ok) {
          throw new Error("Failed to fetch extraction data");
        }
        const data: ExtractionData = await response.json();
        setExtractionData(data);
      } catch (err: any) {
        console.error("Error fetching extraction data:", err);
        setError(
          err.message || "An error occurred while fetching extraction data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchExtraction();
  }, []);

  return (
    <div className=" w-[50vw] bg-gray-100 flex items-center justify-center p-12">
      <div className="animate-fade-in animate-slide-up max-w-5xl w-full bg-white p-12 rounded-xl shadow-xl">
        <h2 className="text-4xl font-bold text-center text-[#8b4513] mb-8">
          Extracted Information
        </h2>
        {loading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="animate-spin w-10 h-10 text-blue-600" />
            <p className="text-gray-700 text-lg">Extracting information...</p>
          </div>
        ) : error ? (
          <p className="text-red-500 text-lg text-center">{error}</p>
        ) : extractionData ? (
          <>
            {/* Larger Scrollable Container */}
            <div className="max-h-[500px]  overflow-y-auto text-gray-800 text-lg leading-relaxed p-4 bg-gray-50 border border-gray-200 rounded-md shadow-inner">
              <ReactMarkdown>{extractionData.answer}</ReactMarkdown>
            </div>
            <p className="mt-6 text-gray-500 text-sm text-center">
              Processing Time: {extractionData.time_taken}
            </p>
          </>
        ) : (
          <p className="text-gray-600 text-lg text-center">
            No extraction data available.
          </p>
        )}
      </div>
    </div>
  );
};

export default ExtractInfo;
