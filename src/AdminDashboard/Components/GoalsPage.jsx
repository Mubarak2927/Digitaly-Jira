import React from "react";
import { Target, PlusCircle } from "lucide-react";

const GoalsPage = () => {
  return (
    <div
      className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 
                 p-4 sm:p-6 md:p-8 rounded-2xl border border-gray-800 
                 shadow-lg transition-all duration-300 w-full max-w-4xl mx-auto mt-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-blue-400 flex items-center gap-2 text-center sm:text-left">
          <Target className="text-blue-500 w-5 h-5 sm:w-6 sm:h-6" /> Project Goals
        </h2>

        <button
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 
                     px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base text-white 
                     transition-all w-full sm:w-auto"
        >
          <PlusCircle size={18} /> Add Goal
        </button>
      </div>

      {/* Body */}
      <div className="text-gray-400 italic mt-10 text-center text-sm sm:text-base px-2">
        No goals added yet. <br className="sm:hidden" /> Start defining your
        project objectives!
      </div>
    </div>
  );
};

export default GoalsPage;
