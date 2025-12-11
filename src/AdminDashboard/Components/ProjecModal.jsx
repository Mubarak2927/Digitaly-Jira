import React from "react";

export default function ProjectModal({
  newProject,
  setNewProject,
  users,
  onCancel,
  onConfirm,
}) {
  return (
    <div className="flex flex-col text-white max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 p-4">
      <h1 className="text-center text-2xl font-bold bg-clip-text text-transparent bg-linear-to-tr from-[#300181] via-[#6915cf] to-[#d62196] mb-6">
        Create New Project
      </h1>

      <div className="flex flex-col divide-y divide-gray-800">
        {/* -------- 1️⃣ Basic Details -------- */}
        <div className="space-y-5 pb-6">
          <h2 className="text-lg font-semibold text-blue-400">1️⃣ Basic Details</h2>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-300">Project Name</label>
            <input
              type="text"
              placeholder="Enter project name"
              className="p-3 rounded-lg bg-gray-900 border border-gray-700 focus:border-blue-500 outline-none"
              value={newProject.name}
              onChange={(e) =>
                setNewProject({ ...newProject, name: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-300">Project Key</label>
            <input
              type="text"
              placeholder="Short Form"
              className="p-3 rounded-lg bg-gray-900 border border-gray-700 focus:border-blue-500 outline-none"
              value={newProject.key}
              onChange={(e) =>
                setNewProject({ ...newProject, key: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-300">Avatar URL</label>
            <input
              type="text"
              placeholder="Project profile"
              className="p-3 rounded-lg bg-gray-900 border border-gray-700 focus:border-blue-500 outline-none"
              value={newProject.avatar}
              onChange={(e) =>
                setNewProject({ ...newProject, avatar: e.target.value })
              }
            />
          </div>
        </div>

        {/* -------- 2️⃣ Timeline & Team -------- */}
        <div className="space-y-5 py-6">
          <h2 className="text-lg font-semibold text-green-400">
            2️⃣ Timeline & Team
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-300">Start Date</label>
              <input
                type="date"
                className="p-3 rounded-lg bg-gray-900 border border-gray-700 focus:border-blue-500 outline-none"
                value={newProject.startDate}
                onChange={(e) =>
                  setNewProject({ ...newProject, startDate: e.target.value })
                }
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-300">End Date</label>
              <input
                type="date"
                className="p-3 rounded-lg bg-gray-900 border border-gray-700 focus:border-blue-500 outline-none"
                value={newProject.endDate}
                onChange={(e) =>
                  setNewProject({ ...newProject, endDate: e.target.value })
                }
              />
            </div>

            {/* <div className="flex flex-col gap-2 col-span-2">
              <label className="text-sm text-gray-300">Total Hours</label>
              <input
                type="number"
                min="0"
                placeholder="Enter total hours"
                className="p-3 rounded-lg bg-gray-900 border border-gray-700 focus:border-blue-500 outline-none"
                value={newProject.totalHours}
                onChange={(e) =>
                  setNewProject({ ...newProject, totalHours: e.target.value })
                }
              />
            </div> */}
          </div>
        </div>

        {/* -------- Project Lead -------- */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-300">Project Lead</label>
          <select
            className="p-3 rounded-lg bg-gray-900 border border-gray-700 text-gray-200 focus:border-blue-500 outline-none"
            value={newProject.projectLead}
            onChange={(e) =>
              setNewProject({ ...newProject, projectLead: e.target.value })
            }
          >
            <option value="">Select Lead</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} {u.full_name}
              </option>
            ))}
          </select>
        </div>

        {/* -------- Assigned Employees -------- */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-300">Assigned Employees</label>

          {newProject.assignedEmployees.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {newProject.assignedEmployees.map((id) => {
                const emp = users.find((u) => u.id === id);
                return (
                  <div
                    key={id}
                    className="flex items-center bg-gray-800 text-white px-3 py-1 rounded-full text-sm"
                  >
                    {emp?.full_name || "Unknown"}
                    <button
                      onClick={() =>
                        setNewProject({
                          ...newProject,
                          assignedEmployees: newProject.assignedEmployees.filter(
                            (eid) => eid !== id
                          ),
                        })
                      }
                      className="ml-2 text-red-400 hover:text-red-600"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          <select
            className="p-3 rounded-lg bg-gray-900 border border-gray-700 text-gray-200 focus:border-blue-500 outline-none"
            value=""
            onChange={(e) => {
              if (!e.target.value) return;
              setNewProject({
                ...newProject,
                assignedEmployees: [...newProject.assignedEmployees, e.target.value],
              });
            }}
          >
            <option value="">Select Employee</option>
            {users
              .filter(
                (u) =>
                  u.id !== newProject.projectLead &&
                  !newProject.assignedEmployees.includes(u.id)
              )
              .map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} {u.full_name}
                </option>
              ))}
          </select>
        </div>

        {/* -------- Description -------- */}
        <div className="space-y-5 py-6">
          <h2 className="text-lg font-semibold text-pink-400">3️⃣ Description</h2>

          <textarea
            placeholder="Enter project description"
            className="p-3 rounded-lg w-full bg-gray-900 border border-gray-700 focus:border-blue-500 outline-none placeholder-gray-500 resize-none h-28"
            value={newProject.description}
            onChange={(e) =>
              setNewProject({ ...newProject, description: e.target.value })
            }
          />
        </div>
      </div>
    </div>
  );
}
