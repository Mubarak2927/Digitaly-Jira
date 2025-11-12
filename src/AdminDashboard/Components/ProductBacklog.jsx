import React, { useState, useMemo, useEffect } from "react";
import {
  createEpic,
  createIssues,
  getEpic,
  getIssues,
} from "../../Api/projectAPI";
import { data } from "react-router-dom";
import Epic from "../ProductBacklog/Epic";
import BacklogColumns from "../ProductBacklog/BacklogColumns";
import Sprint from "../ProductBacklog/Sprint";

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

// const sampleTasks = [
//   { id: "t1", title: "Design login page", description: "Figma screens", status: "To Do", assignee: "AA", epicId: "e1" },
//   { id: "t2", title: "Implement role-based auth", description: "JWT + roles", status: "In Progress", assignee: "AR", epicId: "e2" },
//   { id: "t3", title: "Create DB schema", description: "users, roles, sessions", status: "To Do", assignee: null, epicId: "e3" },
//   { id: "t4", title: "Add dark mode", description: "", status: "To Do", assignee: "S", epicId: null },
// ];

export default function ProductBacklog(selectedProject) {
  // Data
  const [epics, setEpics] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [sprints, setSprints] = useState([]); // {id,name,startDate,endDate,status,tasks: [taskIds]}
  const [selectedEpic, setSelectedEpic] = useState(null);
  const [selectedTasksForSprint, setSelectedTasksForSprint] = useState([]);
  const [showSprintModal, setShowSprintModal] = useState(false);
  const [sprintForm, setSprintForm] = useState({
    name: "",
    startDate: "",
    endDate: "",
  });

  // const [users, setUsers] = useState([]);

  // Create item form
  const [createForm, setCreateForm] = useState({
    type: "Task",
    title: "",
    description: "",
    epicId: null,
    assignee: "",
    name: "",
  });

  useEffect(() => {
    getEpics();
    getTasks();
  }, [selectedProject]);

  const getEpics = async () => {
    try {
      console.log(selectedProject.selectedProject.id);

      const data = await getEpic(selectedProject.selectedProject.id);
      console.log(data, "1214516666666");

      setEpics(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getTasks = async () => {
    try {
      const data = await getIssues(selectedProject.selectedProject.id);
      console.log(data, "get issues");
      setTasks(data);
    } catch (error) {
      console.log(error);
    }
  };

  const createTask = async () => {
    try {
      const type = createForm.type.toLowerCase();

      const newTask = {
        name: createForm.title,
        project_id: selectedProject.selectedProject.id,
        type: type,
        epic_id: selectedEpic.id,
        priority: createForm.priority,
      };

      console.log(newTask, "new task");

      const data = await createIssues(newTask);
      console.log(data, "after create task");

      setTasks((prev) => [...prev, data]);
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  // Derived: backlog = tasks not assigned to an active sprint
  const activeSprintIds = useMemo(
    () => sprints.filter((s) => s.status === "Active").flatMap((s) => s.tasks),
    [sprints]
  );
  const backlogTasks = tasks.filter((t) => !activeSprintIds.includes(t.id));
  const filteredBacklog = selectedEpic
    ? backlogTasks.filter((t) => t.epic_id === selectedEpic.id)
    : backlogTasks;

  console.log(filteredBacklog, backlogTasks, selectedEpic);

  // Helpers
  const id = (pfx = "id") =>
    `${pfx}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

  const handleCreateItem = async () => {
    if (createForm.type === "Epic") {
      const newEpic = {
        name: createForm.name,
        project_id: selectedProject.selectedProject.id,
        description: "All authentication related features",
      };

      const createEpics = await createEpic(newEpic);
      console.log(createEpics, "created ");
      await getEpics();
      setCreateForm({
        type: "Task",
        title: "",
        description: "",
        epicId: null,
        assignee: "",
      });
      return;
    }
  };

  const toggleSelectTaskForSprint = (taskId) => {
    setSelectedTasksForSprint((prev) =>
      prev.includes(taskId)
        ? prev.filter((x) => x !== taskId)
        : [...prev, taskId]
    );
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
    setSprints((prev) => [newSprint, ...prev]);
    // remove tasks from backlog (they'll still exist but filtered out by sprint membership)
    setSelectedTasksForSprint([]);
    setSprintForm({ name: "", startDate: "", endDate: "" });
    setShowSprintModal(false);
  };

  const startSprint = (sprintId) => {
    setSprints((prev) =>
      prev.map((s) =>
        s.id === sprintId
          ? {
              ...s,
              status: "Active",
              startDate: s.startDate || todayISO(),
              endDate: s.endDate || "",
            }
          : s
      )
    );
    // when sprint active, tasks are considered in sprint (we already have task ids stored)
    alert("Sprint started!");
  };

  const completeSprint = (sprintId) => {
    setSprints((prev) =>
      prev.map((s) => (s.id === sprintId ? { ...s, status: "Completed" } : s))
    );
    alert("Sprint completed!");
  };

  const todayISO = () => new Date().toISOString().slice(0, 10);

  // update task fields (status/assignee/epic)
  const updateTask = (taskId, patch) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, ...patch } : t))
    );
  };

  // UI Pieces
  const EpicList = () => (
    <Epic
      epics={epics}
      selectedEpic={selectedEpic}
      setSelectedEpic={setSelectedEpic}
      createForm={createForm}
      setCreateForm={setCreateForm}
      handleCreateItem={handleCreateItem}
    />
  );

  const BacklogColumn = () => (
    <BacklogColumns
      filteredBacklog={filteredBacklog}
      epics={epics}
      createForm={createForm}
      setCreateForm={setCreateForm}
      selectedEpic={selectedEpic}
      setSelectedEpic={setSelectedEpic}
      selectedTasksForSprint={selectedTasksForSprint}
      setSelectedTasksForSprint={setSelectedTasksForSprint}
      createTask={createTask}
      toggleSelectTaskForSprint={toggleSelectTaskForSprint}
      updateTask={updateTask}
      promptAssignEpic={promptAssignEpic}
      openSprintModal={openSprintModal}
      selectedProject={selectedProject}
    />
  );

  // small helper to set epic for task
  function promptAssignEpic(taskId) {
    const options = ["No epic", ...epics.map((e) => e.name)];
    const choice = prompt(
      `Assign epic (type epic title or leave blank to remove). Available:\n${options.join(
        "\n"
      )}`
    );
    if (choice === null) return;
    const matched = epics.find(
      (ep) => ep.name.toLowerCase() === choice?.trim().toLowerCase()
    );
    updateTask(taskId, { epicId: matched ? matched.id : null });
  }

  const SprintColumn = () => (
    <Sprint
      sprints={sprints}
      updateTask={updateTask}
      completeSprint={completeSprint}
      startSprint={startSprint}
      tasks={tasks}
      selectedProject={selectedProject}
    />
  );

  // Sprint modal
  // const SprintModal = () => (
  //   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
  //     <div className="bg-gray-900 rounded-2xl p-6 w-[520px]">
  //       <h3 className="text-xl font-semibold mb-3">Create Sprint</h3>
  //       <div className="space-y-3">
  //         <input
  //           className="w-full bg-gray-800 px-3 py-2 rounded"
  //           placeholder="Sprint name"
  //           value={sprintForm.name}
  //           onChange={(e) =>
  //             setSprintForm((prev) => ({ ...prev, name: e.target.value }))
  //           }
  //         />
  //         <div className="flex gap-2">
  //           <div className="flex-1">
  //             <label className="text-xs text-gray-400">Start date</label>
  //             <input
  //               type="date"
  //               className="w-full bg-gray-800 px-3 py-2 rounded"
  //               value={sprintForm.startDate}
  //               onChange={(e) =>
  //                 setSprintForm((prev) => ({
  //                   ...prev,
  //                   startDate: e.target.value,
  //                 }))
  //               }
  //             />
  //           </div>
  //           <div className="flex-1">
  //             <label className="text-xs text-gray-400">End date</label>
  //             <input
  //               type="date"
  //               className="w-full bg-gray-800 px-3 py-2 rounded"
  //               value={sprintForm.endDate}
  //               onChange={(e) =>
  //                 setSprintForm((prev) => ({
  //                   ...prev,
  //                   endDate: e.target.value,
  //                 }))
  //               }
  //             />
  //           </div>
  //         </div>

  //         <div>
  //           <label className="text-sm font-medium">Selected tasks</label>
  //           <div className="max-h-36 overflow-auto mt-2 space-y-2">
  //             {selectedTasksForSprint.length === 0 && (
  //               <div className="text-gray-500 text-sm">
  //                 No tasks selected. You can still create an empty sprint.
  //               </div>
  //             )}
  //             {selectedTasksForSprint.map((id) => {
  //               const t = tasks.find((x) => x.id === id);
  //               return t ? (
  //                 <div
  //                   key={id}
  //                   className="flex items-center justify-between bg-gray-800/50 p-2 rounded"
  //                 >
  //                   <div>
  //                     <div className="font-medium">{t.title}</div>
  //                     <div className="text-xs text-gray-400">
  //                       {t.assignee || "Unassigned"} • {t.status}
  //                     </div>
  //                   </div>
  //                   <div>
  //                     <button
  //                       className="px-2 py-1 rounded bg-red-500 text-black text-sm"
  //                       onClick={() => toggleSelectTaskForSprint(id)}
  //                     >
  //                       Remove
  //                     </button>
  //                   </div>
  //                 </div>
  //               ) : null;
  //             })}
  //           </div>
  //         </div>

  //         <div className="flex justify-end gap-2 pt-3">
  //           <button
  //             className="px-3 py-1 rounded bg-gray-700"
  //             onClick={() => setShowSprintModal(false)}
  //           >
  //             Cancel
  //           </button>
  //           <button
  //             className="px-3 py-1 rounded bg-gradient-to-r from-green-400 to-teal-400 text-black"
  //             onClick={createSprint}
  //           >
  //             Create
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-teal-400 tracking-wide">
        Project Backlog Items
      </h1>

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
