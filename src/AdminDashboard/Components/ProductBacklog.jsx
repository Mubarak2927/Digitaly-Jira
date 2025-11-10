import React, { useState, useMemo, useEffect } from "react";
import { createEpic, createIssues, getEpic } from "../../Api/projectAPI";

/**
 * AmandaJiraFull.jsx
 * Frontend-only Amanda-style Jira Mock (no API).
 *
 * Usage:
 *   <AmandaJiraFull />
 *
 * Tailwind required.
 */

const STATUS_OPTIONS = ["To Do", "In Progress", "In Review", "Done"];

const sampleEpics = [
  { id: "e1", title: "UI/UX - Figma Design" },
  { id: "e2", title: "Auth & Security" },
  { id: "e3", title: "Database Schema Setup" },
];

const sampleTasks = [
  { id: "t1", title: "Design login page", description: "Figma screens", status: "To Do", assignee: "AA", epicId: "e1" },
  { id: "t2", title: "Implement role-based auth", description: "JWT + roles", status: "In Progress", assignee: "AR", epicId: "e2" },
  { id: "t3", title: "Create DB schema", description: "users, roles, sessions", status: "To Do", assignee: null, epicId: "e3" },
  { id: "t4", title: "Add dark mode", description: "", status: "To Do", assignee: "S", epicId: null },
];

export default function ProductBacklog(selectedProject) {
  // Data
  const [epics, setEpics] = useState([]);
  const [tasks, setTasks] = useState(sampleTasks);
  const [sprints, setSprints] = useState([]); // {id,name,startDate,endDate,status,tasks: [taskIds]}
  const [selectedEpic, setSelectedEpic] = useState(null);
  const [selectedTasksForSprint, setSelectedTasksForSprint] = useState([]);
  const [showSprintModal, setShowSprintModal] = useState(false);
  const [sprintForm, setSprintForm] = useState({ name: "", startDate: "", endDate: "" });

  // Create item form
  const [createForm, setCreateForm] = useState({ type: "Task", title: "", description: "", epicId: null, assignee: "", name: "" });



  useEffect(() => {
    getEpics()
  }, [])

  const getEpics = async () => {
    try {
      console.log(selectedProject.selectedProject.id);

      const data = await getEpic(selectedProject.selectedProject.id);
      console.log(data, "1214516666666");

      setEpics(data)
    } catch (error) {
      console.log(error);
    }
  }

  const createTask = async () => {
    try {

      const type = createForm.type.toLowerCase()

      const newTask = {
        name: createForm.title,
        project_id: selectedProject.selectedProject.id,
        type: type,
        epic_id: selectedEpic.id
      };

      const data = await createIssues(newTask)
      console.log(data, "after create task");
    } catch (error) {
      console.log(error)
    }
  }

  // Derived: backlog = tasks not assigned to an active sprint
  const activeSprintIds = useMemo(() => sprints.filter(s => s.status === "Active").flatMap(s => s.tasks), [sprints]);
  const backlogTasks = tasks.filter(t => !activeSprintIds.includes(t.id));
  const filteredBacklog = selectedEpic ? backlogTasks.filter(t => t.epicId === selectedEpic.id) : backlogTasks;

  // Helpers
  const id = (pfx = "id") => `${pfx}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

  // Create Epic/Feature/Story/Task simplified — we only use Epic and Task here but form supports types
  // const handleCreateItem = () => {
  //   if (!createForm.title.trim()) return alert("Enter a title");

  //   if (createForm.type === "Epic") {
  //     const newEpic = { id: id("e"), title: createForm.title };
  //     setEpics(prev => [...prev, newEpic]);
  //     setCreateForm({ type: "Task", title: "", description: "", epicId: null, assignee: "" });
  //     return;
  //   }

  //   // Task/Story/Feature simplified to tasks for backlog demonstration
  //   const newTask = {
  //     id: id("t"),
  //     title: createForm.title,
  //     description: createForm.description,
  //     status: "To Do",
  //     assignee: createForm.assignee || null,
  //     epicId: createForm.epicId || null,
  //   };
  //   setTasks(prev => [newTask, ...prev]);
  //   setCreateForm({ type: "Task", title: "", description: "", epicId: null, assignee: "" });
  // };

  const handleCreateItem = async () => {



    if (createForm.type === "Epic") {
      const newEpic = {
        name: createForm.name,
        project_id: selectedProject.selectedProject.id,
        description: "All authentication related features"
      };

      const createEpics = await createEpic(newEpic)
      console.log(createEpics, "created ");
      await getEpics();
      setCreateForm({ type: "Task", title: "", description: "", epicId: null, assignee: "" });
      return;
    }



  }

  const toggleSelectTaskForSprint = (taskId) => {
    setSelectedTasksForSprint(prev => prev.includes(taskId) ? prev.filter(x => x !== taskId) : [...prev, taskId]);
  };

  const openSprintModal = () => {
    if (selectedTasksForSprint.length === 0) {
      // allow create sprint with zero tasks too if you want; but ask user
      if (!confirm("No tasks selected — create empty sprint?")) return;
    }
    setShowSprintModal(true);
  };

  const createSprint = () => {
    if (!sprintForm.name.trim()) return alert("Sprint name required");
    const newSprint = {
      id: id("s"),
      name: sprintForm.name,
      startDate: sprintForm.startDate,
      endDate: sprintForm.endDate,
      status: "Not Started",
      tasks: selectedTasksForSprint.slice(), // store task ids
    };
    setSprints(prev => [newSprint, ...prev]);
    // remove tasks from backlog (they'll still exist but filtered out by sprint membership)
    setSelectedTasksForSprint([]);
    setSprintForm({ name: "", startDate: "", endDate: "" });
    setShowSprintModal(false);
  };

  const startSprint = (sprintId) => {
    setSprints(prev => prev.map(s => s.id === sprintId ? { ...s, status: "Active", startDate: s.startDate || todayISO(), endDate: s.endDate || "" } : s));
    // when sprint active, tasks are considered in sprint (we already have task ids stored)
    alert("Sprint started!");
  };

  const completeSprint = (sprintId) => {
    setSprints(prev => prev.map(s => s.id === sprintId ? { ...s, status: "Completed" } : s));
    alert("Sprint completed!");
  };

  const todayISO = () => new Date().toISOString().slice(0, 10);

  // update task fields (status/assignee/epic)
  const updateTask = (taskId, patch) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...patch } : t));
  };

  // UI Pieces
  const EpicList = () => (
    <div className="bg-white/5 p-4 rounded-2xl border border-white/10 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-purple-300">Epics</h3>
        {/* <small className="text-xs text-gray-400">{epics.length}</small> */}
      </div>
      <div className="space-y-2">
        <div
          onClick={() => setSelectedEpic(null)}
          className={`p-2 rounded-lg cursor-pointer ${selectedEpic === null ? "bg-white/10" : "hover:bg-white/5"}`}
        >
          <div className="text-sm text-gray-300">No epic</div>
        </div>

        {epics.map(e => (
          <div
            key={e.id}
            onClick={() => {
              setSelectedEpic(prev => prev && prev.id === e.id ? null : e)
              console.log(selectedEpic, "10000000");
            }}
            className={`p-3 rounded-lg cursor-pointer ${selectedEpic?.id === e.id ? "bg-purple-500/25" : "hover:bg-white/5"}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{e.name}</div>
                <div className="text-xs text-gray-400">Epic ID: {e.id}</div>
              </div>
              <div className="text-xs text-purple-200">●</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick add epic */}
      <div className="mt-4">
        <input
          placeholder="New epic title"
          value={createForm.type === "Epic" ? createForm.name : ""}
          onChange={(e) =>
            setCreateForm((prev) => ({ ...prev, type: "Epic", name: e.target.value }))
          }
          className="w-full bg-gray-800/60 px-3 py-2 rounded-md text-sm"
        />
        <div className="mt-2 flex justify-end">
          <button
            onClick={handleCreateItem}
            className="px-3 py-1 rounded bg-purple-500 text-black text-sm"
          >
            Add Epic
          </button>
        </div>
      </div>
    </div>
  );

  const BacklogColumn = () => (
    <div className="bg-white/5 p-4 rounded-2xl border border-white/10 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-yellow-300">Backlog</h3>
        <div className="text-sm text-gray-400">{filteredBacklog.length} items</div>
      </div>

      {/* Create Task area */}
      <div className="bg-gray-900/40 p-3 rounded-md mb-4">
        <div className="flex gap-2 items-center">
          <select className="bg-gray-800 px-2 py-1 rounded text-sm"
            value={createForm.type}
            onChange={(e) => setCreateForm(prev => ({ ...prev, type: e.target.value }))}>
            <option>Task</option>
            <option>Story</option>
            <option>Bug</option>
            <option>Subtask</option>
          </select>
          <input className="flex-1 bg-gray-800 px-2 py-1 rounded text-sm" placeholder="Title"
            value={createForm.title}
            onChange={(e) => setCreateForm(prev => ({ ...prev, title: e.target.value }))} />
          <select className="bg-gray-800 px-2 py-1 rounded text-sm"
            value={createForm.epicId || ""}
            onChange={(e) => {
              setCreateForm(prev => ({ ...prev, epicId: e.target.value || null }));
              setSelectedEpic(prev => prev && prev.id === e.id ? null : e)
              console.log(selectedEpic);

            }}>
            <option value="">No epic</option>
            {epics.map(ep => <option key={ep.id} value={ep.id}>{ep.name}</option>)}
          </select>
          <input className="w-24 bg-gray-800 px-2 py-1 rounded text-sm" placeholder="Assignee"
            value={createForm.assignee}
            onChange={(e) => setCreateForm(prev => ({ ...prev, assignee: e.target.value }))} />
          <button className="px-3 py-1 rounded bg-green-400 text-black text-sm" onClick={createTask}>Add</button>
        </div>
        <input className="mt-2 w-full bg-gray-800 px-2 py-1 rounded text-sm" placeholder="Description (optional)"
          value={createForm.description}
          onChange={(e) => setCreateForm(prev => ({ ...prev, description: e.target.value }))} />
      </div>

      {/* Tasks */}
      <div className="space-y-2 max-h-[58vh] overflow-auto pr-2">
        {filteredBacklog.length === 0 && <div className="text-sm text-gray-500">No tasks in backlog.</div>}

        {filteredBacklog.map(t => {
          const epic = epics.find(e => e.id === t.epicId);
          return (
            <div key={t.id} className="bg-gray-800/60 p-3 rounded-lg flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={selectedTasksForSprint.includes(t.id)} onChange={() => toggleSelectTaskForSprint(t.id)} />
                  <div>
                    <div className="font-medium truncate">{t.title}</div>
                    <div className="text-xs text-gray-400 truncate">
                      {epic ? <span className="bg-purple-600/30 px-2 py-0.5 rounded text-purple-100 mr-2 text-[11px]">{epic.title}</span> : <span className="bg-gray-700/50 px-2 py-0.5 rounded text-gray-100 text-[11px]">No epic</span>}
                      <span className="ml-2">• {t.status}</span>
                      {t.assignee && <span className="ml-3">• Assignee: {t.assignee}</span>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick actions */}
              <div className="flex items-center gap-2 ml-3">
                <select className="bg-gray-800 px-2 py-1 rounded text-sm" value={t.status}
                  onChange={(e) => updateTask(t.id, { status: e.target.value })}>
                  {STATUS_OPTIONS.map(s => <option value={s} key={s}>{s}</option>)}
                </select>
                <input className="w-20 bg-gray-800 px-2 py-1 rounded text-sm" placeholder="Assignee" value={t.assignee || ""} onChange={(e) => updateTask(t.id, { assignee: e.target.value || null })} />
                <button className="px-2 py-1 rounded bg-blue-500 text-black text-sm" onClick={() => promptAssignEpic(t.id)}>Set Epic</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sprint controls */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-xs text-gray-400">Selected: {selectedTasksForSprint.length}</div>
        <div className="flex gap-2">
          <button onClick={() => { setSelectedTasksForSprint([]); }} className="px-3 py-1 rounded bg-gray-700 text-sm">Clear</button>
          <button onClick={openSprintModal} className="px-3 py-1 rounded bg-gradient-to-r from-green-400 to-teal-400 text-black text-sm">Create Sprint</button>
        </div>
      </div>
    </div>
  );

  // small helper to set epic for task
  function promptAssignEpic(taskId) {
    const options = ["No epic", ...epics.map(e => e.name)];
    const choice = prompt(`Assign epic (type epic title or leave blank to remove). Available:\n${options.join("\n")}`);
    if (choice === null) return;
    const matched = epics.find(ep => ep.name.toLowerCase() === choice?.trim().toLowerCase());
    updateTask(taskId, { epicId: matched ? matched.id : null });
  }

  const SprintColumn = () => (
    <div className="bg-white/5 p-4 rounded-2xl border border-white/10 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-green-300">Sprints</h3>
        <small className="text-xs text-gray-400">{sprints.length}</small>
      </div>

      <div className="space-y-3">
        {sprints.length === 0 && <div className="text-sm text-gray-500">No sprints yet. Create one from backlog.</div>}

        {sprints.map(s => {
          const sprintTasks = s.tasks.map(id => tasks.find(t => t.id === id)).filter(Boolean);
          return (
            <div key={s.id} className="bg-gray-800/60 p-3 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">{s.name}</div>
                  <div className="text-xs text-gray-400">{s.startDate || "Start: -"} • {s.endDate || "End: -"}</div>
                </div>
                <div className="text-sm">
                  <div className="mb-2">
                    <span className={`px-2 py-1 rounded text-xs ${s.status === "Active" ? "bg-green-400 text-black" : (s.status === "Completed" ? "bg-gray-600 text-white" : "bg-yellow-400 text-black")}`}>
                      {s.status}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {s.status === "Not Started" && <button onClick={() => startSprint(s.id)} className="px-2 py-1 rounded bg-green-400 text-black text-sm">Start</button>}
                    {s.status === "Active" && <button onClick={() => completeSprint(s.id)} className="px-2 py-1 rounded bg-yellow-400 text-black text-sm">Complete</button>}
                  </div>
                </div>
              </div>

              <div className="mt-3 text-sm text-gray-300">
                {sprintTasks.length === 0 && <div className="text-gray-500">No tasks in this sprint.</div>}
                {sprintTasks.map(t => (
                  <div key={t.id} className="p-2 bg-gray-900/40 rounded mb-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{t.title}</div>
                        <div className="text-xs text-gray-400">{t.status} • {t.assignee || "Unassigned"}</div>
                      </div>
                      <div className="text-xs">
                        <button className="px-2 py-1 rounded bg-gray-700 text-sm" onClick={() => {
                          const newStatus = prompt("Change status (To Do, In Progress, In Review, Done):", t.status);
                          if (newStatus && STATUS_OPTIONS.includes(newStatus)) updateTask(t.id, { status: newStatus });
                        }}>Edit</button>
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
  );

  // Sprint modal
  const SprintModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-gray-900 rounded-2xl p-6 w-[520px]">
        <h3 className="text-xl font-semibold mb-3">Create Sprint</h3>
        <div className="space-y-3">
          <input className="w-full bg-gray-800 px-3 py-2 rounded" placeholder="Sprint name" value={sprintForm.name} onChange={(e) => setSprintForm(prev => ({ ...prev, name: e.target.value }))} />
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-xs text-gray-400">Start date</label>
              <input type="date" className="w-full bg-gray-800 px-3 py-2 rounded" value={sprintForm.startDate} onChange={(e) => setSprintForm(prev => ({ ...prev, startDate: e.target.value }))} />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-400">End date</label>
              <input type="date" className="w-full bg-gray-800 px-3 py-2 rounded" value={sprintForm.endDate} onChange={(e) => setSprintForm(prev => ({ ...prev, endDate: e.target.value }))} />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Selected tasks</label>
            <div className="max-h-36 overflow-auto mt-2 space-y-2">
              {selectedTasksForSprint.length === 0 && <div className="text-gray-500 text-sm">No tasks selected. You can still create an empty sprint.</div>}
              {selectedTasksForSprint.map(id => {
                const t = tasks.find(x => x.id === id);
                return t ? (
                  <div key={id} className="flex items-center justify-between bg-gray-800/50 p-2 rounded">
                    <div>
                      <div className="font-medium">{t.title}</div>
                      <div className="text-xs text-gray-400">{t.assignee || "Unassigned"} • {t.status}</div>
                    </div>
                    <div>
                      <button className="px-2 py-1 rounded bg-red-500 text-black text-sm" onClick={() => toggleSelectTaskForSprint(id)}>Remove</button>
                    </div>
                  </div>
                ) : null;
              })}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button className="px-3 py-1 rounded bg-gray-700" onClick={() => setShowSprintModal(false)}>Cancel</button>
            <button className="px-3 py-1 rounded bg-gradient-to-r from-green-400 to-teal-400 text-black" onClick={createSprint}>Create</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-teal-400 tracking-wide">⚡ Amanda Jira - Backlog & Sprint</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <EpicList />
        </div>

        <div className="lg:col-span-2">
          <BacklogColumn />
        </div>


      </div>
      <div className="lg:col-span-1 mt-4">
        <SprintColumn />
      </div>

      {showSprintModal && <SprintModal />}
    </div>
  );
}
