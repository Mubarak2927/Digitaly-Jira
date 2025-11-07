import React, { useState } from "react";

const ProductBacklog = () => {
  // fake tasks
  const fakeTasks = [
    { id: "t1", title: "Design login page", status: "Backlog" },
    { id: "t2", title: "Setup API integration", status: "To Do" },
    { id: "t3", title: "Fix dashboard bug", status: "In Progress" },
  ];

  const [selectedTasks, setSelectedTasks] = useState([]);
  const [sprints, setSprints] = useState([]);

  const handleSelectTask = (taskId) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleStartSprint = () => {
    if (selectedTasks.length === 0) {
      alert("Please select at least one task to start a sprint!");
      return;
    }

    const newSprint = {
      id: Date.now(),
      name: `Sprint ${sprints.length + 1}`,
      tasks: fakeTasks.filter((t) => selectedTasks.includes(t.id)),
      startDate: new Date().toLocaleDateString(),
      status: "Active",
    };

    setSprints([...sprints, newSprint]);
    setSelectedTasks([]);
    alert(`${newSprint.name} started successfully!`);
  };

  return (
    <div className="w-full bg-black shadow rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Sprint Management</h2>

      {/* Table of sprints */}
      {sprints.length > 0 && (
        <div className="mb-6 border rounded-lg overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2">Sprint Name</th>
                <th className="px-4 py-2">Tasks</th>
                <th className="px-4 py-2">Start Date</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {sprints.map((sprint) => (
                <tr key={sprint.id} className="border-t">
                  <td className="px-4 py-2">{sprint.name}</td>
                  <td className="px-4 py-2">
                    {sprint.tasks.map((t) => t.title).join(", ")}
                  </td>
                  <td className="px-4 py-2">{sprint.startDate}</td>
                  <td className="px-4 py-2">{sprint.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Task selection list */}
      <h3 className="text-lg font-semibold mb-2">Select Tasks for Sprint</h3>
      <div className="border rounded-lg divide-y">
        {fakeTasks.map((task) => (
          <div
            key={task.id}
            className="flex justify-between items-center p-3 hover:bg-gray-50"
          >
            <div>
              <p className="font-medium">{task.title}</p>
              <p className="text-sm text-gray-500">{task.status}</p>
            </div>
            <input
              type="checkbox"
              checked={selectedTasks.includes(task.id)}
              onChange={() => handleSelectTask(task.id)}
            />
          </div>
        ))}
      </div>

      {/* Start Sprint Button */}
      <div className="flex justify-end mt-4">
        <button
          onClick={handleStartSprint}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          Start Sprint
        </button>
      </div>
    </div>
  );
};

export default ProductBacklog;
