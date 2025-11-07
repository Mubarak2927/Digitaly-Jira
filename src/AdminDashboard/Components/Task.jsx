import React from "react";

const Task = ({ task }) => {
  return (
    <div className="bg-gradient-to-br from-blue-900 to-blue-600 p-3 sm:p-4 rounded-lg mb-3 transition duration-200 hover:scale-[1.02] hover:shadow-lg">
      <p className="font-semibold text-gray-100 text-sm sm:text-base break-words">
        {task.title}
      </p>
      {task.description && (
        <p className="text-gray-300 text-xs sm:text-sm mt-1 break-words">
          {task.description}
        </p>
      )}
    </div>
  );
};

export default Task;
