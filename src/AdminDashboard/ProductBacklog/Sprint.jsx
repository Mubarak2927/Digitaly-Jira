import React, { useEffect, useState } from "react";
import {
  createSprint,
  getSprint,
  sprintById,
  startSprints,
} from "../../Api/projectAPI";
import { s } from "framer-motion/client";

export default function Sprint({
  tasks = [],
  selectedProject,
  loggedInUserId,
  filteredBacklog
}) {
  const [sprints, setSprints] = useState([]);
  const [selectedSprint, setSelectedSprint] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [sprintForm, setSprintForm] = useState({
    name: "",
    goal: "",
    start_date: "",
    end_date: "",
  });

  // Fetch sprints for project
  useEffect(() => {
    fetchSprints();
  }, [filteredBacklog]);

  const fetchSprints = async () => {
    try {
      const data = await getSprint(selectedProject.selectedProject.id);
      console.log("Sprints:", data);
      setSprints(data || []);
    } catch (error) {
      console.error("Error fetching sprints:", error);
    }
  };

  // const fetchsprintById = async (sprintId) => {
  //   setSelectedSprint(sprintId);
  //   try {
  //     const data = await sprintById(sprintId);
  //     console.log(data);

  //   } catch (error) {
  //     console.log(error);

  //   }
  // }

  // Create new sprint
  const handleCreateSprint = async () => {
    if (!sprintForm.name || !sprintForm.start_date || !sprintForm.end_date || !sprintForm.goal) {
      alert("Please fill all fields");
      return;
    }
    try {
      const payload = {
        name: sprintForm.name,
        goal: sprintForm.goal,
        start_date: new Date(sprintForm.start_date).toISOString(),
        end_date: new Date(sprintForm.end_date).toISOString(),
        project_id: selectedProject.selectedProject.id,
        created_by: loggedInUserId,
      };
      await createSprint(payload);
      setShowModal(false);
      setSprintForm({ name: "", goal: "", start_date: "", end_date: "" });
      fetchSprints();
    } catch (err) {
      console.error("Error creating sprint:", err);
    }
  };

  const startSprint = async (sprint) => {
    try {
      const data = await startSprints(sprint.id);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-white border border-black p-5 rounded-2xl shadow-lg/60 text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg text-black font-semibold">Sprints</h2>
        <button
          className="bg-green-400 text-black px-3 py-1 rounded-lg text-sm"
          onClick={() => setShowModal(true)}
        >
          + Create Sprint
        </button>
      </div>

      {/* Sprint List */}
      {sprints.length === 0 && (
        <p className="text-gray-400  text-sm">No sprints found.</p>
      )}

      <div className="space-y-3">
        {sprints.map((s) => (
          <div
            key={s.id}
            className={`p-3 rounded-lg cursor-pointer border ${selectedSprint?.id === s.id
              ? "bg-white text-black  shadow-lg/60"
              : "bg-white text-black shadow-lg/60"
              }`}
            onClick={() =>
              setSelectedSprint(selectedSprint?.id === s.id ? null : s)
            }
          >
            <div className="flex justify-between">
              <div>
                <h4 className="font-medium">{s.name}</h4>
                <p className="text-xs text-black">
                  {new Date(s.start_date).toLocaleDateString()} →{" "}
                  {new Date(s.end_date).toLocaleDateString()}
                </p>
              </div>
              <span className="text-sm text-black hover:scale-105 bg-violet-500 shadow-lg/50 p-3 rounded">
                <button onClick={() => startSprint(s)} className="cursor-pointer">
                  Start Sprint
                </button>
              </span>
            </div>

            {selectedSprint?.id === s.id && (
              <div className="mt-3 border-t border-white pt-3">
                <h5 className="text-sm font-semibold mb-3">Sprint Tasks</h5>
                {s.issues?.length > 0 ? (
                  s.issues.map((taskId) => {
                    const task = tasks.find((t) => t.id === taskId.id);
                    return task ? (
                      <div
                        key={task.id}
                        className="bg-white border p-2 rounded mb-2 text-sm"
                      >
                        <div className="font-medium">{task.name}</div>
                        <div className="text-xs text-black">
                          {task.status} • {task.priority || "Unassigned"}
                        </div>
                      </div>
                    ) : (
                      <div
                        key={taskId}
                        className="text-gray-500 text-xs italic"
                      >
                        Task not found
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-gray-500">No tasks in sprint.</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Create Sprint Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-white/80 flex items-center justify-center z-50">
          <div className="bg-white border border-black shadow-lg/60 p-6 rounded-2xl w-[420px]">
            <h3 className="text-lg text-black font-semibold mb-4">Create Sprint</h3>
            <div className="space-y-3">
              <input
                type="text"
                className="w-full border text-black px-3 py-2 rounded"
                placeholder="Sprint Name"
                value={sprintForm.name}
                onChange={(e) =>
                  setSprintForm({ ...sprintForm, name: e.target.value })
                }
              />
              <textarea
                className="w-full border text-black px-3 py-2 rounded"
                placeholder="Goal"
                value={sprintForm.goal}
                onChange={(e) =>
                  setSprintForm({ ...sprintForm, goal: e.target.value })
                }
              />
              <div className="flex gap-2">
                <input
                  type="date"
                  className="w-full border text-black px-3 py-2 rounded"
                  value={sprintForm.start_date}
                  onChange={(e) =>
                    setSprintForm({ ...sprintForm, start_date: e.target.value })
                  }
                />
                <input
                  type="date"
                  className="flex-1 w-full border text-black px-3 py-2 rounded  "
                  value={sprintForm.end_date}
                  onChange={(e) =>
                    setSprintForm({ ...sprintForm, end_date: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-600 px-3 py-1 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSprint}
                className="bg-green-400 text-black px-3 py-1 rounded"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
