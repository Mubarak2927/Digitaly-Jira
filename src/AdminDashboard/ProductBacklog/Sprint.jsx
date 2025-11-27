// import React, { useEffect, useState } from "react";
// import {
//   createSprint,
//   fetchIssuesbySprintId,
//   getSprint,
//   sprintById,
//   startSprints,
// } from "../../Api/projectAPI";
// import { AwardIcon } from "lucide-react";

// export default function Sprint({
//   tasks = [],
//   selectedProject,
//   loggedInUserId,
//   filteredBacklog
// }) {
//   const [sprints, setSprints] = useState([]);
//   const [selectedSprint, setSelectedSprint] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedWeek, setSelectedWeek] = useState("");

//   const [sprintForm, setSprintForm] = useState({
//     name: "",
//     goal: "",
//     start_date: "",
//     end_date: "",
//   });

//   useEffect(() => {
//     fetchSprints();
//   }, [filteredBacklog]);

//   const sprintfetch =async(sprintId)=>{
//     try {
// console.log(sprintId, "1221212121");

//       const fetchIssue = await fetchIssuesbySprintId(sprintId)
//       console.log(fetchIssue);
      
//     } catch (error) {
//       console.log(error);
      
//     }
//   }

//   const fetchSprints = async () => {
//     try {
//       const data = await getSprint(selectedProject.selectedProject.id);
//       console.log("Sprints:", data);
//       setSprints(data || []);
//     } catch (error) {
//       console.error("Error fetching sprints:", error);
//     }
//   };

//   const handleCreateSprint = async () => {
//     if (!sprintForm.name || !sprintForm.start_date || !sprintForm.end_date || !sprintForm.goal) {
//       alert("Please fill all fields");
//       return;
//     }
//     try {
//       const payload = {
//         name: sprintForm.name,
//         goal: sprintForm.goal,
//         start_date: new Date(sprintForm.start_date).toISOString(),
//         end_date: new Date(sprintForm.end_date).toISOString(),
//         project_id: selectedProject.selectedProject.id,
//         created_by: loggedInUserId,
//       };
//       await createSprint(payload);
//       setShowModal(false);
//       setSprintForm({ name: "", goal: "", start_date: "", end_date: "" });
//       fetchSprints();
//     } catch (err) {
//       console.error("Error creating sprint:", err);
//     }
//   };

//   const startSprint = async (sprint) => {
//     try {
//       const data = await startSprints(sprint.id);
//       console.log(data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <div className="bg-white border border-black p-5 rounded-2xl shadow-lg/60 text-white">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-lg text-black font-semibold">Sprints</h2>

//         <div className="flex gap-3">
//           <button
//             className="bg-green-400 hover:bg-green-500 cursor-pointer text-black px-3 py-1 rounded-lg text-sm"
//             onClick={() => setShowModal(true)}
//           >
//             + Create Sprint
//           </button>
//         </div>
//       </div>

//       {sprints.length === 0 && (
//         <p className="text-gray-400 text-sm">No sprints found.</p>
//       )}

//       <div className="space-y-3">
//         {sprints.map((s) => (
//           <div
//             key={s.id}
//             className={`p-3 rounded-lg cursor-pointer border
//               ${s.issues?.length > 0
//                 ? "bg-green-500 border-green-500 shadow-lg"
//                 : "bg-gray-400 shadow"}
//               ${selectedSprint?.id === s.id ? "ring-2 " : ""}`}
//           onClick={() => {
//   const newSprint = selectedSprint?.id === s.id ? null : s;
//   setSelectedSprint(newSprint);
//   sprintfetch(s.id);
// }}
//           >
//             <div className="flex justify-between">
//               <div>
//                 <h4 className="font-medium capitalize">{s.name}</h4>
//                 <p className="text-xs text-black">
//                   {new Date(s.start_date).toLocaleDateString()} →{" "}
//                   {new Date(s.end_date).toLocaleDateString()}
//                 </p>
//               </div>
//               <div className="flex gap-4">
//                 <button
//                 className="text-sm cursor-pointer text-white hover:scale-105 bg-violet-500 shadow-lg/50 p-3 rounded"
//                  onClick={() => startSprint(s)} >
//                   Start Sprint
//                 </button>
//                 <button
//                  className="text-sm  cursor-pointer text-black hover:scale-105 bg-green-500 shadow-lg/50 p-3 rounded">
//                   Complete Sprint
//                 </button>
//               </div>
//             </div>
//             {selectedSprint?.id === s.id && (
//               <div className="mt-3 border-t border-white pt-3">
//                 <h5 className="text-sm font-semibold mb-3">Sprint Tasks</h5>
//                 {s.issues?.length > 0 ? (
//                   s.issues.map((taskId) => {
//                     const task = tasks.find((t) => t.id === taskId.id);
//                     return task ? (
//                       <div
//                         key={task.id}
//                         className="bg-white border p-2 rounded mb-2 text-sm"
//                       >
//                         <div className="font-medium">{task.name}</div>
//                         <div className="text-xs text-black">
//                           {task.status} • {task.priority || "Unassigned"}
//                         </div>
//                       </div>
//                     ) : (
//                       <div
//                         key={taskId}
//                         className="text-white text-xs italic"
//                       >
//                         Task not found
//                       </div>
//                     );
//                   })
//                 ) : (
//                   <p className="text-xs text-gray-500">No tasks in sprint.</p>
//                 )}
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       {showModal && (
//         <div className="fixed inset-0 bg-white/80 flex items-center justify-center z-50">
//           <div className="bg-white border border-black shadow-lg/60 p-6 rounded-2xl w-[420px]">
//             <h3 className="text-lg text-black font-semibold mb-4">Create Sprint</h3>
//             <div className="space-y-3">
//               <input
//                 type="text"
//                 className="w-full border text-black px-3 py-2 rounded"
//                 placeholder="Sprint Name"
//                 value={sprintForm.name}
//                 onChange={(e) =>
//                   setSprintForm({ ...sprintForm, name: e.target.value })
//                 }
//               />
//               <textarea
//                 className="w-full border text-black px-3 py-2 rounded"
//                 placeholder="Goal"
//                 value={sprintForm.goal}
//                 onChange={(e) =>
//                   setSprintForm({ ...sprintForm, goal: e.target.value })
//                 }
//               />

//               <div className="flex flex-col gap-3">

//                 <div className="flex gap-2 mt-2">
//                   {[
//                     { label: "Week 1", days: 7 },
//                     { label: "Week 2", days: 14 },
//                     { label: "Week 4", days: 28 },
//                   ].map((week) => (
//                     <button
//                       key={week.label}
//                       className={`px-4 py-2 rounded-lg hover:scale-105 shadow-lg/40 cursor-pointer 
//                         ${selectedWeek === week.label
//                           ? "bg-green-600 text-white"
//                           : "bg-blue-600 text-white hover:bg-blue-700"}`}
//                       onClick={() => {
//                         const startDate = new Date();
//                         const endDate = new Date(startDate);
//                         endDate.setDate(startDate.getDate() + week.days);

//                         setSprintForm({
//                           ...sprintForm,
//                           start_date: startDate.toISOString().split("T")[0],
//                           end_date: endDate.toISOString().split("T")[0],
//                         });

//                         setSelectedWeek(week.label);
//                       }}
//                     >
//                       {week.label}
//                     </button>
//                   ))}
//                 </div>

//                 <div className="flex gap-2">
//                   <div className="flex flex-col gap-4">

//                     <div className="flex flex-col">
//                       <label className="text-black font-medium mb-1">
//                         Start Date
//                       </label>
//                       <input
//                         type="date"
//                         className="border text-black px-3 py-2 rounded"
//                         value={sprintForm.start_date}
//                         onChange={(e) => {
//                           const start = e.target.value;

//                           let startDate = new Date(start);
//                           let autoEndDate = new Date(startDate);
//                           autoEndDate.setDate(startDate.getDate() + 7);

//                           setSprintForm({
//                             ...sprintForm,
//                             start_date: start,
//                             end_date: autoEndDate.toISOString().split("T")[0],
//                           });
//                         }}
//                       />
//                     </div>

//                     <div className="flex flex-col">
//                       <label className="text-black font-medium mb-1">
//                         End Date
//                       </label>
//                       <input
//                         type="date"
//                         className="border text-black px-3 py-2 rounded"
//                         value={sprintForm.end_date}
//                         onChange={(e) =>
//                           setSprintForm({
//                             ...sprintForm,
//                             end_date: e.target.value,
//                           })
//                         }
//                       />
//                     </div>

//                   </div>
//                 </div>

//               </div>
//             </div>

//             <div className="flex justify-end gap-2 mt-5">
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="bg-gray-600 px-3 py-1 rounded-lg"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleCreateSprint}
//                 className="bg-green-500 text-black px-3 py-1 rounded-lg"
//               >
//                 Create
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import {
  createSprint,
  fetchIssuesbySprintId,
  getSprint,
  sprintById,
  startSprints,
} from "../../Api/projectAPI";
import { AwardIcon, Trash, Trash2 } from "lucide-react";

export default function Sprint({
  tasks = [],
  selectedProject,
  loggedInUserId,
  filteredBacklog
}) {
  const [sprints, setSprints] = useState([]);
  const [selectedSprint, setSelectedSprint] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState("");

  const [sprintForm, setSprintForm] = useState({
    name: "",
    goal: "",
    start_date: "",
    end_date: "",
  });

  useEffect(() => {
    fetchSprints();
  }, [filteredBacklog]);

  const sprintfetch = async (sprintId) => {
    try {
      console.log(sprintId, "1221212121");

      const fetchIssue = await fetchIssuesbySprintId(sprintId);
      console.log(fetchIssue);

    } catch (error) {
      console.log(error);

    }
  }

  const fetchSprints = async () => {
    try {
      const data = await getSprint(selectedProject.selectedProject.id);
      console.log("Sprints:", data);
      setSprints(data || []);
    } catch (error) {
      console.error("Error fetching sprints:", error);
    }
  };

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

        <div className="flex gap-3">
          <button
            className="bg-green-400 hover:bg-green-500 cursor-pointer text-black px-3 py-1 rounded-lg text-sm"
            onClick={() => setShowModal(true)}
          >
            + Create Sprint
          </button>
        </div>
      </div>

      {sprints.length === 0 && (
        <p className="text-gray-400 text-sm">No sprints found.</p>
      )}

      <div className="space-y-3">
        {sprints.map((s) => (
          <div
            key={s.id}
            className={`p-3 rounded-lg cursor-pointer border
              ${s.issues?.length > 0
                ? "bg-green-300 border-green-200 shadow-lg"
                : "bg-gray-400 shadow"}
              ${selectedSprint?.id === s.id ? "ring-2 " : ""}`}
            onClick={() => {
              const newSprint = selectedSprint?.id === s.id ? null : s;
              setSelectedSprint(newSprint);
              sprintfetch(s.id);
            }}
          >
            <div className="flex justify-between">
              <div>
                <h4 className="font-medium  text-black capitalize">{s.name}</h4>
                <p className="text-xs text-black">
                  {new Date(s.start_date).toLocaleDateString()} →{" "}
                  {new Date(s.end_date).toLocaleDateString()}
                </p>
              </div>

              {/* ✅ SHOW BUTTONS ONLY IF TASKS EXIST */}
              <div className="flex gap-4">
                {s.issues?.length > 0 && (
                  <>
                    <button
                      className="text-sm cursor-pointer text-white hover:scale-105 bg-violet-500 shadow-lg/50 p-3 rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        startSprint(s);
                      }}
                    >
                      Start Sprint
                    </button>

                    {/* <button
                      className="text-sm cursor-pointer text-black hover:scale-105 bg-green-500 shadow-lg/50 p-3 rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("Complete Sprint");
                      }}
                    >
                      Complete Sprint
                    </button> */}
                  </>
                )}
              </div>
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
                        className="bg-gray-300  p-2 rounded mb-2 text-sm"
                      >
                        <div className="flex justify-between">
                          <div>
                        <h1 className="font-bold text-black">{task.name}</h1>
                         <p className="text-black">{task.status} • {task.priority || "Unassigned"}   </p> 
                        </div>
                          <button className="text-red-600 cursor-pointer rounded-full px-3 py-1 mt-3"><Trash2/></button>
                        </div>
                      </div>
                    ) : (
                      <div
                        key={taskId}
                        className="text-white text-xs italic"
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

              <div className="flex flex-col gap-3">

                <div className="flex gap-2 mt-2">
                  {[
                    { label: "Week 1", days: 7 },
                    { label: "Week 2", days: 14 },
                    { label: "Week 4", days: 28 },
                  ].map((week) => (
                    <button
                      key={week.label}
                      className={`px-4 py-2 rounded-lg hover:scale-105 shadow-lg/40 cursor-pointer 
                        ${selectedWeek === week.label
                          ? "bg-green-600 text-white"
                          : "bg-blue-600 text-white hover:bg-blue-700"}`}
                      onClick={() => {
                        const startDate = new Date();
                        const endDate = new Date(startDate);
                        endDate.setDate(startDate.getDate() + week.days);

                        setSprintForm({
                          ...sprintForm,
                          start_date: startDate.toISOString().split("T")[0],
                          end_date: endDate.toISOString().split("T")[0],
                        });

                        setSelectedWeek(week.label);
                      }}
                    >
                      {week.label}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <div className="flex flex-col gap-4">

                    <div className="flex flex-col">
                      <label className="text-black font-medium mb-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        className="border text-black px-3 py-2 rounded"
                        value={sprintForm.start_date}
                        onChange={(e) => {
                          const start = e.target.value;

                          let startDate = new Date(start);
                          let autoEndDate = new Date(startDate);
                          autoEndDate.setDate(startDate.getDate() + 7);

                          setSprintForm({
                            ...sprintForm,
                            start_date: start,
                            end_date: autoEndDate.toISOString().split("T")[0],
                          });
                        }}
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-black font-medium mb-1">
                        End Date
                      </label>
                      <input
                        type="date"
                        className="border text-black px-3 py-2 rounded"
                        value={sprintForm.end_date}
                        onChange={(e) =>
                          setSprintForm({
                            ...sprintForm,
                            end_date: e.target.value,
                          })
                        }
                      />
                    </div>

                  </div>
                </div>

              </div>
            </div>

            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-600 px-3 py-1 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSprint}
                className="bg-green-500 text-black px-3 py-1 rounded-lg"
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
