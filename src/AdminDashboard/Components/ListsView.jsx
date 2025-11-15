import React from "react";
import { ClipboardList, Clock, Layers3 } from "lucide-react";

const ListsView = ({ selectedProject }) => {
  const tasks = selectedProject?.lists || [];

  return (
    <div className="relative p-4 sm:p-8 bg-white rounded-2xl shadow-lg border-black border overflow-hidden">
      {/* Background animation */}
      <div className="absolute inset-0  blur-3xl opacity-40 animate-pulse" />

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-3">
          <div className="p-3 border border-black rounded-xl">
            <ClipboardList className="w-6 h-6 text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-black">
            Lists Overview
          </h2>
        </div>
        <span className="text-sm text-black font-medium">
          Total Tasks:{" "}
          <span className="text-white bg-blue-600 px-2 py-0.5 rounded-md font-semibold">
            {tasks.length}
          </span>
        </span>
      </div>

      {/* No tasks */}
      {tasks.length === 0 ? (
        <div className="relative z-10 flex flex-col items-center justify-center py-16 sm:py-20 text-gray-500">
          <ClipboardList className="w-10 sm:w-12 h-10 sm:h-12 mb-3 opacity-40" />
          <p className="italic text-gray-400 text-sm sm:text-base">
            List Empty !
          </p>
        </div>
      ) : (
        /* Task list */
        <ul className="relative z-10 space-y-4 max-h-[70vh] overflow-y-auto pr-1 sm:pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
          {tasks.map((task, index) => (
            <li
              key={task.id}
              className="relative group bg-gradient-to-br from-gray-900/80 via-gray-900/60 to-gray-800/70 backdrop-blur-xl p-4 sm:p-5 rounded-xl border border-gray-700/80 hover:border-blue-500/60 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-300"
            >
              {/* Hover background */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600/10 via-purple-500/10 to-pink-600/10 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500" />

              {/* Task title */}
              <div className="relative flex justify-between items-center mb-2">
                <h3 className="text-gray-100 font-semibold tracking-wide text-sm sm:text-base">
                  {task.title}
                </h3>
                <span className="text-[10px] sm:text-xs px-2 py-[2px] rounded-md bg-blue-600 text-gray-300">
                  {index + 1}
                </span>
              </div>

              {/* Task meta info */}
              <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between text-[10px] sm:text-xs text-gray-400 gap-1 sm:gap-0">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span>{task.createdAt}</span>
                </div>

                {task.column && (
                  <div className="flex items-center gap-1 bg-gray-800/60 px-2 py-[2px] rounded-md border border-gray-700/60 self-center sm:self-auto">
                    <Layers3 className="w-3.5 h-3.5 text-purple-400" />
                    <span className="capitalize text-gray-300">
                      {task.column}
                    </span>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ListsView;
