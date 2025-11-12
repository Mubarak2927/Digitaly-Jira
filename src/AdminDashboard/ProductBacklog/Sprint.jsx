import React from 'react'

const Sprint = (
    {
        sprints,
        updateTask,
        completeSprint,
        startSprint,
        tasks
        
    }
) => {
  return (
     <div className="bg-white/5 p-4 rounded-2xl shadow-lg/60 hover:shadow-cyan-500">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-green-300">Sprints</h3>
        <small className="text-xs text-gray-400">{sprints.length}</small>
      </div>

      <div className="space-y-3">
        {sprints.length === 0 && (
          <div className="text-sm text-gray-500">
            No sprints yet. Create one from backlog.
          </div>
        )}

        {sprints.map((s) => {
          const sprintTasks = s.tasks
            .map((id) => tasks.find((t) => t.id === id))
            .filter(Boolean);
          return (
            <div key={s.id} className="bg-gray-800/60 p-3 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">{s.name}</div>
                  <div className="text-xs text-gray-400">
                    {s.startDate || "Start: -"} • {s.endDate || "End: -"}
                  </div>
                </div>
                <div className="text-sm">
                  <div className="mb-2">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        s.status === "Active"
                          ? "bg-green-400 text-black"
                          : s.status === "Completed"
                          ? "bg-gray-600 text-white"
                          : "bg-yellow-400 text-black"
                      }`}
                    >
                      {s.status}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {s.status === "Not Started" && (
                      <button
                        onClick={() => startSprint(s.id)}
                        className="px-2 py-1 rounded bg-green-400 text-black text-sm"
                      >
                        Start
                      </button>
                    )}
                    {s.status === "Active" && (
                      <button
                        onClick={() => completeSprint(s.id)}
                        className="px-2 py-1 rounded bg-yellow-400 text-black text-sm"
                      >
                        Complete
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-3 text-sm text-gray-300">
                {sprintTasks.length === 0 && (
                  <div className="text-gray-500">No tasks in this sprint.</div>
                )}
                {sprintTasks.map((t) => (
                  <div key={t.id} className="p-2 bg-gray-900/40 rounded mb-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{t.title}</div>
                        <div className="text-xs text-gray-400">
                          {t.status} • {t.assignee || "Unassigned"}
                        </div>
                      </div>
                      <div className="text-xs">
                        <button
                          className="px-2 py-1 rounded bg-gray-700 text-sm"
                          onClick={() => {
                            const newStatus = prompt(
                              "Change status (To Do, In Progress, In Review, Done):",
                              t.status
                            );
                            if (newStatus && STATUS_OPTIONS.includes(newStatus))
                              updateTask(t.id, { status: newStatus });
                          }}
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )
}

export default Sprint