import React from "react";
import { Archive, Trash2 } from "lucide-react";

const ArchivedPage = () => {
  return (
    <div
      className="bg-linear-to-br from-gray-950 via-gray-900 to-gray-800 
                 p-4 sm:p-6 md:p-8 rounded-2xl border border-gray-800 
                 shadow-lg transition-all duration-300 w-full max-w-4xl 
                 mx-auto mt-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h2
          className="text-xl sm:text-2xl font-semibold text-purple-400 
                     flex items-center gap-2 text-center sm:text-left"
        >
          <Archive className="text-purple-500 w-5 h-5 sm:w-6 sm:h-6" />
          Archived Items
        </h2>

        <button
          className="flex items-center justify-center gap-2 
                     bg-red-600 hover:bg-red-500 px-3 sm:px-4 py-2 
                     rounded-lg text-sm sm:text-base text-white 
                     transition-all w-full sm:w-auto"
        >
          <Trash2 size={18} /> Clear All
        </button>
      </div>

      {/* Body */}
      <div className="text-gray-400 italic mt-10 text-center text-sm sm:text-base px-2 leading-relaxed">
        No archived items yet. <br className="sm:hidden" />
        Completed tasks will appear here.
      </div>
    </div>
  );
};

export default ArchivedPage;
