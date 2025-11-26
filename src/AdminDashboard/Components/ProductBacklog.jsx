// import React, { useState, useMemo, useEffect } from "react";
// import {
//   createEpic,
//   createIssues,
//   getEpic,
//   getIssues,
// } from "../../Api/projectAPI";
// import { data } from "react-router-dom";
// import Epic from "../ProductBacklog/Epic";
// import BacklogColumns from "../ProductBacklog/BacklogColumns";
// import Sprint from "../ProductBacklog/Sprint";

// /**
//  * AmandaJiraFull.jsx
//  * Frontend-only Amanda-style Jira Mock (no API).
//  *
//  * Usage:
//  *   <AmandaJiraFull />
//  *
//  * Tailwind required.
//  */

// const STATUS_OPTIONS = ["To Do", "In Progress", "In Review", "Done"];

// const sampleEpics = [
//   { id: "e1", title: "UI/UX - Figma Design" },
//   { id: "e2", title: "Auth & Security" },
//   { id: "e3", title: "Database Schema Setup" },
// ];

// export default function ProductBacklog( selectedProject ) {
//   // Data
//   const [epics, setEpics] = useState([]);
//   const [tasks, setTasks] = useState([]);
//   const [sprints, setSprints] = useState([]); // {id,name,startDate,endDate,status,tasks: [taskIds]}
//   const [selectedEpic, setSelectedEpic] = useState(null);
//   const [selectedTasksForSprint, setSelectedTasksForSprint] = useState([]);
//   const [showSprintModal, setShowSprintModal] = useState(false);
//   const [sprintForm, setSprintForm] = useState({
//     name: "",
//     startDate: "",
//     endDate: "",
//   });

//   const [createForm, setCreateForm] = useState({
//     type: "Task",
//     title: "",
//     description: "",
//     epicId: null,  
//     assignee: "",
//     name: "",
//   });

//   useEffect(() => {
//     getEpics();
//     getTasks();
//   }, [selectedProject]);

//   const getEpics = async () => {
//     try {
//       console.log(selectedProject.selectedProject.id);

//       const data = await getEpic(selectedProject.selectedProject.id);
//       console.log(data, "1214516666666");

//       setEpics(data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const getTasks = async () => {
//     try {
//       const data = await getIssues(selectedProject.selectedProject.id);
//       console.log(data, "get issues232323");
//       setTasks(data);

//     } catch (error) {
//       console.log(error);
//     }
//   };

// console.log(tasks, sprints, "total tasks");


//   const createTask = async () => {
//     try {
//       const type = createForm.type.toLowerCase();

//       console.log(selectedEpic, createForm.epicId, "selected");

//       const newTask = {
//         name: createForm.title,
//         project_id: selectedProject.selectedProject.id,
//         type: type,
//         epic_id: createForm.epicId ? createForm.epicId : selectedEpic?.id,
//         priority: createForm.priority,
//       };

//       console.log(newTask, "new task");

//       const data = await createIssues(newTask);
//       console.log(data, "after create task");
//       alert("Succesfully Created Task")
// getTasks();

//       setTasks((prev) => [...prev, data]);
//     } catch (error) {
//       console.error("Error creating task:", error);
//     }
//   };

//   const activeSprintIds = useMemo(
//     () => sprints.filter((s) => s.status === "Active").flatMap((s) => s.tasks),
//     [sprints]
//   );

//   const backlogTasks = useMemo(
//     () => tasks.filter((t) => !activeSprintIds.includes(t.id)),
//     [tasks, activeSprintIds]
//   );

//   const filteredBacklog = useMemo(
//     () =>
//       selectedEpic
//         ? backlogTasks.filter((t) => t.epic_id === selectedEpic.id && !t.sprint_id)
//         : backlogTasks.filter((t) => !t.sprint_id),
//     [backlogTasks, selectedEpic]
//   );

//   console.log(filteredBacklog, backlogTasks, selectedEpic);

//   const id = (pfx = "id") =>
//     `${pfx}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

//   const handleCreateItem = async () => {
//     if (createForm.type === "Epic") {
//       const newEpic = {
//         name: createForm.name,
//         project_id: selectedProject.selectedProject.id,
//         description: "All authentication related features",
//       };

//       const createEpics = await createEpic(newEpic);
//       console.log(createEpics, "created ");
//       await getEpics();
//       setCreateForm({
//         type: "Task",
//         title: "",
//         description: "",
//         epicId: null,
//         assignee: "",
//       });
//       return;
//     }
//   };

//   const toggleSelectTaskForSprint = (taskId) => {
//     setSelectedTasksForSprint((prev) =>
//       prev.includes(taskId) ? prev.filter((x) => x !== taskId) : [...prev, taskId]
//     );
//   };

//   const openSprintModal = () => {
//     if (selectedTasksForSprint.length === 0) {
//       if (!confirm("No tasks selected — create empty sprint?")) return;
//     }
//     setShowSprintModal(true);
//   };

//   const createSprint = () => {
//     if (!sprintForm.name.trim()) return alert("Sprint name required");
//     const newSprint = {
//       id: id("s"),
//       name: sprintForm.name,
//       startDate: sprintForm.startDate,
//       endDate: sprintForm.endDate,
//       status: "Not Started",
//       tasks: selectedTasksForSprint.slice(), 
//     };
//     setSprints((prev) => [newSprint, ...prev]);
//     setSelectedTasksForSprint([]);
//     setSprintForm({ name: "", startDate: "", endDate: "" });
//     setShowSprintModal(false);
//   };

//   const startSprint = (sprintId) => {
//     setSprints((prev) =>
//       prev.map((s) =>
//         s.id === sprintId
//           ? {
//               ...s,
//               status: "Active",
//               startDate: s.startDate || todayISO(),
//               endDate: s.endDate || "",
//             }
//           : s
//       )
//     );
//     alert("Sprint started!");
//   };

//   const completeSprint = (sprintId) => {
//     setSprints((prev) =>
//       prev.map((s) => (s.id === sprintId ? { ...s, status: "Completed" } : s))
//     );
//     alert("Sprint completed!");
//   };

//   const todayISO = () => new Date().toISOString().slice(0, 10);

//   const updateTask = (taskId, patch) => {
//     setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, ...patch } : t)));
//   };

//   function promptAssignEpic(taskId) {
//   }

//   return (
//     <div className="min-h-screen bg-white to-text border-black border-2 rounded-4xl shadow-lg/60 text-white p-6">
//       <h1 className="text-3xl font-bold mb-6 text-black tracking-wide">
//         Project Backlog Items
//       </h1>

//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//         <div className="lg:col-span-1">
//           <Epic
//             epics={epics}
//             selectedEpic={selectedEpic}
//             setSelectedEpic={setSelectedEpic}
//             createForm={createForm}
//             setCreateForm={setCreateForm}
//             handleCreateItem={handleCreateItem}
//           />
//         </div>

//         <div className="lg:col-span-2">
//           <BacklogColumns
//             filteredBacklog={filteredBacklog}
//             getTasks={getTasks}
//             epics={epics}
//             createForm={createForm}
//             setCreateForm={setCreateForm}
//             selectedEpic={selectedEpic}
//             setSelectedEpic={setSelectedEpic}
//             selectedTasksForSprint={selectedTasksForSprint}
//             setSelectedTasksForSprint={setSelectedTasksForSprint}
//             createTask={createTask}
//             toggleSelectTaskForSprint={toggleSelectTaskForSprint}
//             updateTask={updateTask}
//             promptAssignEpic={promptAssignEpic}
//             openSprintModal={openSprintModal}
//             selectedProject={selectedProject}
//           />
//         </div>
//       </div>

//       <div className="lg:col-span-1 mt-4">
//         <Sprint
//           sprints={sprints}
//           updateTask={updateTask}
//           completeSprint={completeSprint}
//           startSprint={startSprint}
//           tasks={tasks}
//           selectedProject={selectedProject}
//           filteredBacklog={filteredBacklog}
          
//         />
//       </div>

//       {showSprintModal && (
//         <div />
//       )}
//     </div>
//   );
// }

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

const STATUS_OPTIONS = ["To Do", "In Progress", "In Review", "Done"];

const sampleEpics = [
  { id: "e1", title: "UI/UX - Figma Design" },
  { id: "e2", title: "Auth & Security" },
  { id: "e3", title: "Database Schema Setup" },
];

export default function ProductBacklog(selectedProject) {
  // ⭐ ADDED LOADING
  const [loading, setLoading] = useState(true);

  const [epics, setEpics] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [selectedEpic, setSelectedEpic] = useState(null);
  const [selectedTasksForSprint, setSelectedTasksForSprint] = useState([]);
  const [showSprintModal, setShowSprintModal] = useState(false);
  const [sprintForm, setSprintForm] = useState({
    name: "",
    startDate: "",
    endDate: "",
  });

  const [createForm, setCreateForm] = useState({
    type: "Task",
    title: "",
    description: "",
    epicId: null,
    assignee: "",
    name: "",
  });

  useEffect(() => {
    loadAllData();
  }, [selectedProject]);

  const loadAllData = async () => {
    try {
      setLoading(true); // ⭐ SHOW LOADER
      
      await getEpics();
      await getTasks();

      setLoading(false); // ⭐ HIDE LOADER
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

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
      console.log(data, "get issues232323");
      setTasks(data);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(tasks, sprints, "total tasks");

  const createTask = async () => {
    try {
      const type = createForm.type.toLowerCase();

      console.log(selectedEpic, createForm.epicId, "selected");

      const newTask = {
        name: createForm.title,
        project_id: selectedProject.selectedProject.id,
        type: type,
        epic_id: createForm.epicId ? createForm.epicId : selectedEpic?.id,
        priority: createForm.priority,
      };

      console.log(newTask, "new task");

      const data = await createIssues(newTask);
      console.log(data, "after create task");
      alert("Succesfully Created Task");
      getTasks();

      setTasks((prev) => [...prev, data]);
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const activeSprintIds = useMemo(
    () => sprints.filter((s) => s.status === "Active").flatMap((s) => s.tasks),
    [sprints]
  );

  const backlogTasks = useMemo(
    () => tasks.filter((t) => !activeSprintIds.includes(t.id)),
    [tasks, activeSprintIds]
  );

  const filteredBacklog = useMemo(
    () =>
      selectedEpic
        ? backlogTasks.filter((t) => t.epic_id === selectedEpic.id && !t.sprint_id)
        : backlogTasks.filter((t) => !t.sprint_id),
    [backlogTasks, selectedEpic]
  );

  console.log(filteredBacklog, backlogTasks, selectedEpic);

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
      prev.includes(taskId) ? prev.filter((x) => x !== taskId) : [...prev, taskId]
    );
  };

  const openSprintModal = () => {
    if (selectedTasksForSprint.length === 0) {
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
      tasks: selectedTasksForSprint.slice(),
    };
    setSprints((prev) => [newSprint, ...prev]);
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
    alert("Sprint started!");
  };

  const completeSprint = (sprintId) => {
    setSprints((prev) =>
      prev.map((s) => (s.id === sprintId ? { ...s, status: "Completed" } : s))
    );
    alert("Sprint completed!");
  };

  const todayISO = () => new Date().toISOString().slice(0, 10);

  const updateTask = (taskId, patch) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, ...patch } : t)));
  };

  function promptAssignEpic(taskId) {}

  // ⭐ RETURN LOADER SCREEN IF LOADING === TRUE
  if (loading) {
    return (
      <>
      <div className="flex flex-col justify-center items-center h-[70vh]">
        <div className="w-10 h-10 border-4 border-gray-400 border-t-black rounded-full animate-spin"></div>
          <p className="mt-3 text-gray-800 font-semibold">Loading...</p>
      </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-white to-text border-black border-2 rounded-4xl shadow-lg/60 text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-black tracking-wide">
        Project Backlog Items
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Epic
            epics={epics}
            selectedEpic={selectedEpic}
            setSelectedEpic={setSelectedEpic}
            createForm={createForm}
            setCreateForm={setCreateForm}
            handleCreateItem={handleCreateItem}
          />
        </div>

        <div className="lg:col-span-2">
          <BacklogColumns
            filteredBacklog={filteredBacklog}
            getTasks={getTasks}
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
        </div>
      </div>

      <div className="lg:col-span-1 mt-4">
        <Sprint
          sprints={sprints}
          updateTask={updateTask}
          completeSprint={completeSprint}
          startSprint={startSprint}
          tasks={tasks}
          selectedProject={selectedProject}
          filteredBacklog={filteredBacklog}
        />
      </div>

      {showSprintModal && <div />}
    </div>
  );
}
