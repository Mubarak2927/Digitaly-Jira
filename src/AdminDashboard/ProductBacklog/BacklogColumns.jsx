import React from "react";

const STATUS_OPTIONS = ["To Do", "In Progress", "In Review", "Done"];

const BacklogColumns = ({
  filteredBacklog = [],
  epics = [],
  createForm = { title: "", type: "Task", description: "", priority: "", epicId: "" },
  setCreateForm = () => {},
  selectedEpic = null,
  setSelectedEpic = () => {},
  selectedTasksForSprint = [],
  setSelectedTasksForSprint = () => {},
  createTask = () => {},
  toggleSelectTaskForSprint = () => {},
  updateTask = () => {},
  promptAssignEpic = () => {},
  openSprintModal = () => {},
}) => {
  return (
    <div>
      <div className="bg-gray-800 p-4 w-[55vw] rounded-2xl shadow-lg/60 hover:shadow-cyan-500">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-yellow-300">Backlog</h3>
          <div className="text-sm text-gray-400">{filteredBacklog.length} items</div>
        </div>

        {/* Create Task area */}
        <div className="bg-gray-900 p-5 rounded-lg mb-4">
          <div className="flex gap-5 items-center">
            <select
              className="bg-gray-800 px-2 py-1 rounded text-sm"
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
              className="flex-1 bg-gray-800 px-2 py-1 rounded text-sm"
              placeholder="Title"
              value={createForm.title}
              onChange={(e) =>
                setCreateForm((prev) => ({ ...prev, title: e.target.value }))
              }
            />
            <select
              className="bg-gray-800 px-2 py-1 rounded text-sm"
              value={createForm.epicId || ""}
              onChange={(e) =>
                setCreateForm((prev) => ({ ...prev, epicId: e.target.value }))
              }
            >
              <option value="">No epic</option>
              {epics?.map((ep) => (
                <option key={ep.id} value={ep.id}>
                  {ep.name}
                </option>
              ))}
            </select>
            <select
              className="bg-gray-800 px-2 py-1 rounded text-sm"
              value={createForm.priority}
              onChange={(e) =>
                setCreateForm((prev) => ({ ...prev, priority: e.target.value }))
              }
            >
              <option disabled value="">
                Priority
              </option>
              <option value="highest">Highest</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
              <option value="lowest">Lowest</option>
            </select>

            <button
              className="px-3 py-1 rounded bg-green-400 text-black text-sm"
              onClick={createTask}
            >
              Add
            </button>
          </div>

          <input
            className="mt-2 w-full bg-gray-800 px-2 py-1 rounded text-sm"
            placeholder="Description (optional)"
            value={createForm.description}
            onChange={(e) =>
              setCreateForm((prev) => ({ ...prev, description: e.target.value }))
            }
          />
        </div>

        {/* Tasks */}
        <div className="space-y-2 max-h-[58vh] overflow-auto pr-2">
          {filteredBacklog.length === 0 && (
            <div className="text-sm text-gray-500">No tasks in backlog.</div>
          )}

          {filteredBacklog.map((t) => {
            const epic = epics.find((e) => e.id === t.epic_id);
            return (
              <div
                key={t.id}
                className="bg-gray-800/60 p-3 rounded-lg flex items-center justify-between"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedTasksForSprint.includes(t.id)}
                      onChange={() => toggleSelectTaskForSprint(t.id)}
                    />
                    <div>
                      <div className="font-medium truncate">{t.name}</div>
                      <div className="text-xs text-gray-400 truncate">
                        {epic ? (
                          <span className="bg-purple-600/30 px-2 py-0.5 rounded text-purple-100 mr-2 text-[11px]">
                            {t.epic_name}
                          </span>
                        ) : (
                          <span className="bg-gray-700/50 px-2 py-0.5 rounded text-gray-100 text-[11px]">
                            No epic
                          </span>
                        )}
                        <span className="ml-2">• {t.status}</span>
                        {t.priority && (
                          <span className="capitalize ml-15">
                            <span className="text-sm text-white">Priority:</span>
                            <span className="ml-1 bg-gray-700 text-white px-3 rounded-2xl">
                              {t.priority}
                            </span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-3">
                  <select
                    className="bg-gray-800 px-2 py-1 border rounded text-sm"
                    value={t.status}
                    onChange={(e) => updateTask(t.id, { status: e.target.value })}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option value={s} key={s}>
                        {s}
                      </option>
                    ))}
                  </select>

                  <select
                    className="bg-gray-800 px-2 py-1 border rounded-lg text-sm capitalize"
                    value={t.priority || ""}
                    onChange={(e) => updateTask(t.id, { priority: e.target.value })}
                  >
                    <option value="">Priority</option>
                    <option value="highest">Highest</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                    <option value="lowest">Lowest</option>
                  </select>

                  {!t.epic_name && (
                    <button
                      className="px-2 py-1 rounded bg-blue-500 text-black text-sm"
                      onClick={() => promptAssignEpic(t.id)}
                    >
                      Set Epic
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Sprint controls */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-xs text-gray-400">
            Selected: {selectedTasksForSprint.length}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedTasksForSprint([])}
              className="px-3 py-1 rounded bg-gray-700 text-sm"
            >
              Clear
            </button>
            <button
              onClick={openSprintModal}
              className="px-3 py-1 rounded bg-gradient-to-r from-green-400 to-teal-400 text-black text-sm"
            >
              Create Sprint
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BacklogColumns;
