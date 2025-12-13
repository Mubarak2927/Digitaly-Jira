import React, { useEffect, useState } from "react";
import {
  createSprint,
  fetchIssuesbySprintId,
  getSprint,
  startSprints,
  deleteIssueFromSprint,
  completeSprint,
  deleteSprint,
  updateSprint,
  getSprintComments,
  SprintComments,
} from "../../Api/projectAPI";
import { Eye, EyeIcon, SquarePen, Trash2, View, ViewIcon } from "lucide-react";

export default function Sprint({
  tasks = [],
  selectedProject,
  loggedInUserId,
  filteredBacklog,
  getTasks,
  getSprints,
}) {

  const [sprints, setSprints] = useState([]);
  const [selectedSprint, setSelectedSprint] = useState(null);
  const [runningSprintId, setRunningSprintId] = useState(null); // <-- NEW
  const [showModal, setShowModal] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState("");

  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState(null);


  const [showSprintDetails, setShowSprintDetails] = useState(false);
const [sprintDetails, setSprintDetails] = useState(null);

const [comments, setComments] = useState([]);
const [newComment, setNewComment] = useState("");


  const [sprintForm, setSprintForm] = useState({
    name: "",
    goal: "",
    start_date: "",
    end_date: "",
  });

  useEffect(() => {
    fetchSprints();
  }, [filteredBacklog]);

  
  useEffect(() => {
  if (openFromSidebar) {
    setShowModal(true);   // 👈 sidebar click-la open
  }
}, [openFromSidebar]);


  const sprintfetch = async (sprintId) => {
    try {
      const fetchIssue = await fetchIssuesbySprintId(sprintId);
      console.log(fetchIssue);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSprints = async () => {
    try {
      const data = await getSprint(selectedProject.selectedProject.id);
      setSprints(data || []);
    } catch (error) {
      console.error("Error fetching sprints:", error);
    }
  };

  const handleCreateSprint = async () => {
    if (
      !sprintForm.name ||
      !sprintForm.start_date ||
      !sprintForm.end_date ||
      !sprintForm.goal
    ) {
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

      setRunningSprintId(sprint.id); // <-- Highlight UI

      alert("Sprint started successfully!");
    } catch (error) {
      console.log(error);
    }
  };

  const handleCompleteSprint = async (sprintId) => {
    if (!window.confirm("Complete this sprint?")) return;

    try {
      await completeSprint(sprintId);

      setRunningSprintId(null); // <-- After complete remove highlight
      await fetchSprints();
      await getTasks();

      alert("Sprint completed successfully!");
    } catch (error) {
      alert("Error completing sprint");
    }
  };

  const handleDeleteIssue = async (sprintId, issueId) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await deleteIssueFromSprint(sprintId, issueId);

      await fetchSprints();
      await getTasks();

      alert("Issue moved to backlog!");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSprint = async (sprintId) => {
    if (!window.confirm("Delete this sprint permanently?")) return;

    try {
      await deleteSprint(sprintId);

      // Remove sprint from UI
      setSprints((prev) => prev.filter((s) => s.id !== sprintId));

      // Clear selected sprint
      setSelectedSprint((prev) => (prev?.id === sprintId ? null : prev));

      alert("Sprint deleted!");
    } catch (err) {
      console.error("Failed to delete sprint", err);
      alert("Something went wrong while deleting sprint.");
    }
  };
  const handleUpdateSprint = async () => {
    try {
      const payload = {
        name: editData.name,
        goal: editData.goal,
        start_date: new Date(editData.start_date).toISOString(),
        end_date: new Date(editData.end_date).toISOString(),
      };

      await updateSprint(editData.id, payload);

      setShowEditModal(false);
      await fetchSprints();
      alert("Sprint updated successfully!");
    } catch (err) {
      console.error("Error updating sprint:", err);
      alert("Failed to update sprint");
    }
  };

const openSprintDetails = async (sprint) => {
  setSprintDetails(sprint);
  setShowSprintDetails(true);

  try {
    const data = await getSprintComments(sprint.id);
    setComments(data || []);
  } catch (error) {
    console.log("Error loading comments", error);
  }
};

const handleAddComment = async () => {
  if (!newComment.trim()) return alert("Enter a comment");

  try {
    await SprintComments(sprintDetails.id, newComment);

    const updated = await getSprintComments(sprintDetails.id);
    setComments(updated);

    setNewComment("");
  } catch (error) {
    console.log("Error adding comment: ", error);
  }
};






  return (
    <div className="bg-white border border-black p-5 rounded-2xl shadow-lg/60 text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg text-black font-semibold">Sprints</h2>

        <button
          className="bg-green-400 hover:bg-green-500 cursor-pointer text-black px-3 py-1 rounded-lg text-sm"
          onClick={() => setShowModal(true)}
        >
          + Create Sprint
        </button>
      </div>

      {sprints.length === 0 && (
        <p className="text-gray-400 text-sm">No sprints found.</p>
      )}

      <div className="space-y-3">
        {sprints.map((s) => (
          <div
            key={s.id}
            className={`p-3 rounded-lg cursor-pointer border shadow 
              ${runningSprintId === s.id ? "bg-blue-400" : "bg-gray-300"} 
              ${selectedSprint?.id === s.id ? "ring-2" : ""}
            `}
            onClick={() => {
              const newSprint = selectedSprint?.id === s.id ? null : s;
              setSelectedSprint(newSprint);
              sprintfetch(s.id);
            }}
          >
            <div className="flex justify-between">
              <div>
                <h4 className="font-medium text-black capitalize">{s.name}</h4>
                <p className="text-xs text-black">
                  {new Date(s.start_date).toLocaleDateString()} →{" "}
                  {new Date(s.end_date).toLocaleDateString()}
                </p>
              </div>

              <div className="flex gap-3">
                {s.issues?.length > 0 && (
                  <>
                    {runningSprintId !== s.id ? (
                      // Show ONLY Start button when sprint not running
                      <button
                        className="text-sm cursor-pointer text-white hover:scale-105 bg-violet-500 shadow-lg/50 px-2 py-1 rounded"
                        onClick={(e) => {
                          e.stopPropagation();
                          startSprint(s);
                        }}
                      >
                        Start Sprint
                      </button>
                    ) : (
                      // Show ONLY Complete button when sprint is running
                      <button
                        className="text-sm cursor-pointer text-white hover:scale-105 bg-green-500 shadow-lg/50 px-2 py-1 rounded"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCompleteSprint(s.id);
                        }}
                      >
                        Complete Sprint
                      </button>
                    )}
                  </>
                )}
                <button
  className="text-blue-600 hover:scale-110 cursor-pointer rounded px-2 py-1 text-xs font-semibold"
  onClick={(e) => {
    e.stopPropagation();
    openSprintDetails(s);
  }}
>
  <EyeIcon size={14} />
</button>
{showSprintDetails && sprintDetails && (
  <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-2xl w-[500px] shadow-xl border border-black">

      <h3 className="text-xl font-bold text-black mb-3">
        Sprint Details
      </h3>

      <p className="text-black"><b>Name:</b> {sprintDetails.name}</p>
      <p className="text-black"><b>Goal:</b> {sprintDetails.goal}</p>
      <p className="text-black">
        <b>Start:</b> {new Date(sprintDetails.start_date).toLocaleDateString()}
      </p>
      <p className="text-black mb-3">
        <b>End:</b> {new Date(sprintDetails.end_date).toLocaleDateString()}
      </p>

      <hr className="my-3" />

      <h4 className="text-lg text-black font-semibold mb-2">Comments</h4>

      <div className="max-h-[150px] overflow-y-auto mb-3 bg-gray-200 p-3 rounded">
        {comments.length > 0 ? (
          comments.map((c) => (
            <div key={c.id} className="bg-white p-2 rounded mb-2 border">
              <div className="flex justify-between">
                <p className="text-black">{c.comment}</p>
              <p className="text-black">By: {c.author_name}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No comments yet.</p>
        )}
      </div>

      <textarea
        className="w-full border px-3 py-2 rounded text-black mb-3"
        placeholder="Add a comment..."
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
      />

      <div className="flex justify-end gap-2">
        <button
          className="bg-gray-600 text-white px-4 py-1 rounded"
          onClick={() => setShowSprintDetails(false)}
        >
          Close
        </button>

        <button
          className="bg-blue-600 text-white px-4 py-1 rounded"
          onClick={handleAddComment}
        >
          Add Comment
        </button>
      </div>
    </div>
  </div>
)}


                <button
                  className="text-red-600 hover:scale-110 cursor-pointer rounded px-2 py-1 text-xs font-semibold"
                  onClick={(e) => {
                    e.stopPropagation(); // avoid selecting sprint
                    handleDeleteSprint(s.id);
                  }}
                >
                  <Trash2 size={14} />
                </button>

                <button
                  className="text-yellow-600 hover:scale-110 cursor-pointer rounded px-2 py-1 text-xs font-semibold"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditData(s);
                    setShowEditModal(true);
                  }}
                >
                  <SquarePen size={14} />
                </button>
                {showEditModal && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white border border-black shadow-lg/60 p-6 rounded-2xl w-[420px]">
                      <h3 className="text-lg font-semibold text-black mb-4">
                        Edit Sprint
                      </h3>

                      <div className="space-y-3">
                        <input
                          type="text"
                          className="w-full border text-black px-3 py-2 rounded"
                          placeholder="Sprint Name"
                          value={editData?.name || ""}
                          onChange={(e) =>
                            setEditData({ ...editData, name: e.target.value })
                          }
                        />

                        <textarea
                          className="w-full border text-black px-3 py-2 rounded"
                          placeholder="Goal"
                          value={editData?.goal || ""}
                          onChange={(e) =>
                            setEditData({ ...editData, goal: e.target.value })
                          }
                        />

                        <div>
                          <label className="text-black font-medium">
                            Start Date
                          </label>
                          <input
                            type="date"
                            className="w-full border text-black px-3 py-2 rounded"
                            value={editData?.start_date?.split("T")[0] || ""}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                start_date: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div>
                          <label className="text-black font-medium">
                            End Date
                          </label>
                          <input
                            type="date"
                            className="w-full border text-black px-3 py-2 rounded"
                            value={editData?.end_date?.split("T")[0] || ""}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                end_date: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="flex justify-end gap-2 mt-5">
                          <button
                            onClick={() => setShowEditModal(false)}
                            className="bg-gray-600 px-3 py-1 rounded-lg text-white"
                          >
                            Cancel
                          </button>

                          <button
                            onClick={handleUpdateSprint}
                            className="bg-blue-500 text-white px-3 py-1 rounded-lg"
                          >
                            Update Sprint
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
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
                        className="bg-gray-300 p-2 rounded mb-2 text-sm"
                      >
                        <div className="flex justify-between">
                          <div>
                            <h1 className="font-bold text-black">
                              {task.name}
                            </h1>
                            <p className="text-black">
                              {task.status} • {task.priority || "Unassigned"}
                            </p>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteIssue(s.id, task.id);
                            }}
                            className="text-red-600 cursor-pointer rounded-full px-3 py-1"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div key={taskId} className="text-white text-xs italic">
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
            <h3 className="text-lg text-black font-semibold mb-4">
              Create Sprint
            </h3>

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
                        ${
                          selectedWeek === week.label
                            ? "bg-green-600 text-white"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
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

              <div className="flex justify-end gap-2 mt-5">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-600 px-3 py-1 rounded-lg text-white"
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
        </div>
      )}
    </div>
  );
}
