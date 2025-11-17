import React, { useEffect, useState } from "react";
import { ClipboardList, Clock } from "lucide-react";
import { getIssues } from "../../Api/projectAPI";

const ListsView = ({ selectedProject }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    getTasks();
  }, []);

  const getTasks = async () => {
    console.log(selectedProject, "12344");

    try {
      const data = await getIssues(selectedProject.id);
      console.log(data, "get issues");
      setTasks(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="relative p-4 sm:p-8 bg-white rounded-2xl shadow-lg border-black border overflow-hidden">
      {/* Background animation */}
      <div className="absolute inset-0 blur-3xl opacity-40 animate-pulse" />

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-3">
          <div className="p-3 border border-black rounded-xl">
            <ClipboardList className="w-6 h-6 text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-black">Lists Overview</h2>
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
            List Empty!
          </p>
        </div>
      ) : (
        /* Task Table */
        <div className="relative z-10 max-h-[70vh] overflow-y-auto scrollbar-thin pr-2">
          <table className="w-full text-sm  rounded-lg overflow-hidden">
            <thead className="bg-gray-900 text-gray-300">
              <tr>
                <th className="px-3 py-2 border-b border-gray-700 text-center">
                  SI No
                </th>
                <th className="px-3 py-2 border-b border-gray-700 text-left">
                  Name
                </th>
                <th className="px-3 py-2 border-b border-gray-700 text-center">
                  Status
                </th>
                <th className="px-3 py-2 border-b border-gray-700 text-center">
                  Type
                </th>
                <th className="px-3 py-2 border-b border-gray-700 text-left">
                  Epic
                </th>
                <th className="px-3 py-2 border-b border-gray-700 text-left">
                  Description
                </th>
                <th className="px-3 py-2 border-b border-gray-700 whitespace-nowrap text-center">
                  Created At
                </th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, index) => (
                <tr
                  key={task.id}
                  className="bg-gray-800 hover:bg-gray-700 transition-colors"
                >
                  <td className="px-3 py-2 text-center text-gray-200 border-b border-gray-700">
                    {index + 1}
                  </td>
                  <td className="px-3 py-2 text-gray-200 border-b border-gray-700">
                    {task.name}
                  </td>
                  <td className="px-3 py-2 text-center text-gray-200 border-b border-gray-700">
                    {task.status}
                  </td>
                  <td className="px-3 py-2 text-center text-gray-200 border-b border-gray-700">
                    {task.type}
                  </td>
                  <td className="px-3 py-2 text-gray-200 border-b border-gray-700">
                    {task.epic_name}
                  </td>
                  <td className="px-3 py-2 text-gray-200 border-b border-gray-700">
                    {task.description}
                  </td>
                  <td className="px-3 py-2 text-center text-gray-400 border-b border-gray-700 whitespace-nowrap">
                    <div className="flex justify-center items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-blue-400" />
                      <span>{task.createdAt}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ListsView;
