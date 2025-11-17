import React, { useEffect, useState } from "react";
import { getSprint, sprintTaskMove } from "../../Api/projectAPI";

const STATUS_OPTIONS = ["To Do", "In Progress", "In Review", "Done"];

const BacklogColumns = ({
  filteredBacklog = [],
  epics = [],
  createForm = {
    title: "",
    type: "Task",
    description: "",
    priority: "",
    epicId: "",
  },
  setCreateForm = () => { },
  selectedTasksForSprint = [],
  setSelectedTasksForSprint = () => { },
  createTask = () => { },
  toggleSelectTaskForSprint = () => { },
  updateTask = () => { },
  promptAssignEpic = () => { },
  selectedProject,
  loggedInUserId,
  getTasks,
  getSprints
}) => {
  const [sprints, setSprints] = useState([]);
  const [selectedSprintId, setSelectedSprintId] = useState("");

  // -------------------------------
  // 🔥 NEW: EPIC MODAL STATES
  // -------------------------------
  const [showEpicModal, setShowEpicModal] = useState(false);
  const [taskIdForEpic, setTaskIdForEpic] = useState(null);
  const [selectedEpicIdForModal, setSelectedEpicIdForModal] = useState("");

  // -------------------------------
  // 🔥 NEW: Epic Assign Function
  // -------------------------------
  const handleEpicAssign = async () => {
    if (!selectedEpicIdForModal) {
      alert("Select an Epic first");
      return;
    }

    try {
      await updateTask(taskIdForEpic, { epic_id: selectedEpicIdForModal });

      alert("Epic Assigned Successfully ✔");

      setShowEpicModal(false);
      setSelectedEpicIdForModal("");
      setTaskIdForEpic(null);
    } catch (err) {
      console.error("Epic assign error:", err);
    }
  };

  // 🌀 Load sprints for dropdown
  useEffect(() => {
    fetchSprints();
  }, []);

  const fetchSprints = async () => {
    try {
      console.log(selectedProject, "fetch spint");

      const data = await getSprint(selectedProject.selectedProject.id);
      setSprints(data || []);
      console.log(data, "collected Sprint");
    } catch (err) {
      console.error("Error fetching sprints:", err);
    }
  };

  const handleCreate = () => {
    if (!createForm.title.trim()) {
      alert("Please enter a task title");
      return;
    }

    if (!createForm.type.trim()) {
      alert("Please choose a task type");
      return;
    }

    createTask();
    fetchSprints()
  };

  // Assign selected tasks to sprint
  const handleAssignToSprint = async () => {
    console.log(selectedTasksForSprint, selectedSprintId, "select tasks");

    try {
      const payload = { issue_ids: selectedTasksForSprint };
      const data = await sprintTaskMove(selectedSprintId, payload);
      console.log(data, "after sprint add");

      alert("Tasks added to sprint successfully ✅");
      setSelectedTasksForSprint([]);
      setSelectedSprintId("");
      fetchSprints();
      getTasks();
      getSprints()
    } catch (error) {
      console.error("Error assigning tasks:", error);
    }
  };

  return (
    <div>
      <div className=" bg-white p-5 w-[55vw] border border-black rounded-2xl shadow-lg/60">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-black">Backlog</h3>
          <div className="text-sm text-black">
            {filteredBacklog.length} items
          </div>
        </div>

        {/* ➕ Create Task Section */}
        <div className=" border border-black p-4 rounded-lg mb-5">
          <div className="flex gap-3 items-center flex-wrap">
            <select
              className=" text-black border px-2 py-1 rounded text-sm"
              value={createForm.type}
              onChange={(e) =>
                setCreateForm((prev) => ({ ...prev, type: e.target.value }))
              }
            >
              <option>Task</option>
              <option>Story</option>
              <option>Bug</option>
            </select>

            <input
              className="flex-1 border border-black text-black px-2 py-1 rounded text-sm"
              placeholder="Title"
              value={createForm.title}
              onChange={(e) =>
                setCreateForm((prev) => ({ ...prev, title: e.target.value }))
              }
            />

            <select
              className="border border-black text-black px-2 py-1 rounded text-sm"
              value={createForm.epicId || ""}
              onChange={(e) => {
                setCreateForm((prev) => ({ ...prev, epicId: e.target.value }));
              }}
            >
              <option value="">No epic</option>
              {epics.map((ep) => (
                <option key={ep.id} value={ep.id}>
                  {ep.name}
                </option>
              ))}
            </select>

            <button
              className="px-3 py-1 rounded bg-green-400 hover:bg-green-700 cursor-pointer text-black text-sm"
              onClick={handleCreate}
            >
              Add
            </button>
          </div>

          <input
            className="mt-3 w-full border border-black text-black px-2 py-1 rounded text-sm"
            placeholder="Description (optional)"
            value={createForm.description}
            onChange={(e) =>
              setCreateForm((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
          />
        </div>

        {/* 🧩 Task List */}
        <div className="space-y-2 max-h-[55vh] overflow-auto pr-2">
          {filteredBacklog.length === 0 && (
            <div className="text-sm text-gray-500">No tasks in backlog.</div>
          )}

          {filteredBacklog.map((t) => {
            const epic = epics.find((e) => e.id === t.epic_id);
            return (
              <div
                key={t.id}
                className="border border-black p-3 rounded-lg flex items-center justify-between"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    {!t.sprint_id && (
                      <input
                        type="checkbox"
                        checked={selectedTasksForSprint.includes(t.id)}
                        onChange={() => toggleSelectTaskForSprint(t.id)}
                      />
                    )}
                    <div>
                      <div className="font-medium text-black truncate">{t.name}</div>
                      <div className="text-xs text-black truncate">
                        {epic ? (
                          <span className="bg-blue-600 px-2 py-0.5 rounded text-white mr-2 text-[11px]">
                            {t.epic_name}
                          </span>
                        ) : (
                          <span className="bg-gray-700/50 px-2 py-0.5 rounded text-black text-[11px]">
                            No epic
                          </span>
                        )}
                        <span className="ml-2">• {t.status}</span>
                      </div>
                      <span className="text-black capitalize text-xs">{t.type}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-3">
                  {!t.epic_name && (
                    <button
                      className="px-2 py-1 rounded bg-blue-500 text-white text-sm"
                      onClick={() => {
                        setTaskIdForEpic(t.id);
                        setShowEpicModal(true);
                      }}
                    >
                      Set Epic
                    </button>
                  )}
                  <button className="bg-red-600 px-2 py-1 rounded">
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* 🏁 Sprint Assignment Controls */}
        <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="text-xs text-black">
            Selected: {selectedTasksForSprint.length}
          </div>

          <div className="flex gap-2 items-center">
            <select
              className="border border-black  px-3 py-1 rounded text-sm text-black"
              value={selectedSprintId}
              onChange={(e) => setSelectedSprintId(e.target.value)}
            >
              <option value="">Select Sprint</option>
              {sprints.map((sp) => (
                <option key={sp.id} value={sp.id}>
                  {sp.name}
                </option>
              ))}
            </select>

            <button
              onClick={handleAssignToSprint}
              className="px-3 py-1 rounded bg-green-400 text-black text-sm"
            >
              Assign to Sprint
            </button>
          </div>
        </div>
      </div>

      {/* ----------------------------- */}
      {/* 🔥 NEW EPIC ASSIGN MODAL UI */}
      {/* ----------------------------- */}
      {showEpicModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-5 rounded-xl w-[300px]">
            <h3 className="text-lg font-semibold mb-3 text-yellow-300">
              Assign Epic
            </h3>

            <select
              className="w-full bg-gray-800 px-3 py-2 rounded text-sm mb-4"
              value={selectedEpicIdForModal}
              onChange={(e) => setSelectedEpicIdForModal(e.target.value)}
            >
              <option value="">Select Epic</option>
              {epics.map((ep) => (
                <option key={ep.id} value={ep.id}>
                  {ep.name}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-3">
              <button
                className="px-3 py-1 rounded bg-gray-600"
                onClick={() => setShowEpicModal(false)}
              >
                Cancel
              </button>

              <button
                className="px-3 py-1 rounded bg-green-400 text-black"
                onClick={handleEpicAssign}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BacklogColumns;
