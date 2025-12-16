import React, { useEffect, useState } from "react";
import {
  deleteIssues,
  getBacklog,
  getIssueComments,
  getSprint,
  IssueComments,
  sprintTaskMove,
  updateIssue,
} from "../../Api/projectAPI";
import { ClipboardCheck, Bug, BookOpen, Trash2, SquarePen } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

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
    story_points: "", // ⭐ added
  },
  setCreateForm = () => {},
  selectedTasksForSprint = [],
  setSelectedTasksForSprint = () => {},
  createTask = () => {},
  toggleSelectTaskForSprint = () => {},
  updateTask = () => {},
  selectedProject,
  getTasks,
  getSprints,
}) => {
  const [sprints, setSprints] = useState([]);
  const [selectedSprintId, setSelectedSprintId] = useState("");

  // 🔥 EPIC MODAL STATES
  const [showEpicModal, setShowEpicModal] = useState(false);
  const [taskIdForEpic, setTaskIdForEpic] = useState(null);
  const [selectedEpicIdForModal, setSelectedEpicIdForModal] = useState("");

  // 🔥 EDIT MODAL STATES
  const [showEditModal, setShowEditModal] = useState(false);
  const [editIssueId, setEditIssueId] = useState(null);
  const [editIssueName, setEditIssueName] = useState("");
  const [editIssueType, setEditIssueType] = useState("");
  const [editIssuePriority, setEditIssuePriority] = useState("");
  const [editIssueEpicId, setEditIssueEpicId] = useState("");
  const [editStoryPoints, setEditStoryPoints] = useState(""); // ⭐ added
  // 🔥 COMMENT MODAL STATES
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentTaskId, setCommentTaskId] = useState(null);
  const [commentText, setCommentText] = useState("");

  // 🔥 TASK DETAILS MODAL STATES
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsTask, setDetailsTask] = useState(null);

  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [taskComments, setTaskComments] = useState([]);

  // const [editIssueStoryPoints, setEditIssueStoryPoints] = useState("");

  const FIB_POINTS = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89];

  // -------------------------------

  const handleIssueUpdate = async () => {
    if (!editIssueName.trim()) return alert("Name cannot be empty");

    try {
      // 🔹 Create payload
      const payload = {
        name: editIssueName,
        type: editIssueType,
        priority: editIssuePriority,
        story_points: editIssueType === "story" ? editStoryPoints : undefined,
      };

      // 🔹 Only add epic_id if selected, else null to clear
      if (editIssueEpicId) {
        payload.epic_id = editIssueEpicId;
      } else {
        payload.epic_id = null;
      }

      await updateIssue(editIssueId, payload);

      toast.success("Issue updated ✔");

      // 🔹 Reset edit modal state
      setShowEditModal(false);
      setEditIssueId(null);
      setEditIssueName("");
      setEditIssueType("");
      setEditIssuePriority("");
      setEditIssueEpicId("");
      setEditStoryPoints("");

      getTasks();
    } catch (err) {
      console.error("Issue update error:", err);
      toast.error("Failed to update issue ❌");
    }
  };

  useEffect(() => {
    fetchSprints();
    fetchBacklog();
  }, []);

  const fetchBacklog = async () => {
    try {
      await getBacklog(selectedProject.selectedProject.id);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSprints = async () => {
    try {
      const data = await getSprint(selectedProject.selectedProject.id);
      setSprints(data || []);
    } catch (err) {
      console.error("Error fetching sprints:", err);
    }
  };

  const handleCreate = () => {
    if (!createForm.title.trim()) return alert("Please enter a task title");
    if (!createForm.type.trim()) return alert("Please choose a task type");

    console.log(createForm);

    createTask();

    // 🔥 RESET FORM AFTER ADD
    setCreateForm({
      title: "",
      type: "Task",
      description: "",
      priority: "",
      epicId: "",
      story_points: "",
    });

    fetchSprints();
  };

  const handleAssignToSprint = async () => {
    if (!selectedSprintId || selectedTasksForSprint.length === 0) return;

    try {
      await sprintTaskMove(selectedSprintId, {
        issue_ids: selectedTasksForSprint,
      });
      toast.success("Tasks added to sprint successfully ");
      setSelectedTasksForSprint([]);
      setSelectedSprintId("");
      fetchSprints();
      getTasks();
      getSprints();
    } catch (error) {
      console.error("Error assigning tasks:", error);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return alert("Comment cannot be empty");

    try {
      await IssueComments(detailsTask.id, commentText);
      setCommentText("");

      const updated = await getIssueComments(detailsTask.id);
      setTaskComments(updated);

      toast.success("Comment added ");

      console.log("Comment Response:", data);
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const getTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case "task":
        return <ClipboardCheck size={16} className="text-blue-500" />;
      case "bug":
        return <Bug size={16} className="text-red-500" />;
      case "story":
        return <BookOpen size={16} className="text-green-500" />;
      default:
        return null;
    }
  };

  const handleDeleteIssue = async (issue_id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) return; // ❌ cancel clicked

    try {
      await deleteIssues(issue_id);
      toast.success("Task deleted successfully ");
      getTasks();
    } catch (error) {
      console.error("Error deleting issue:", error);
      toast.success("Failed to delete task ");
    }
  };

  const getCommenst = async () => {
    try {
      const data = await getIssueComments(detailsTask.id);
      console.log("Comments Data:", data);
    } catch (error) {}
  };

  return (
    <div>
      <div className=" bg-white  p-4 sm:p-5 w-full  sm:w-[90vw]  md:w-[70vw]  lg:w-[47.5vw] xl:w-[50vw] border border-black  rounded-2xl shadow-lg/60">
        <Toaster position="top-right" />
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-black">Backlog</h3>
          <div className="text-sm text-black">
            {filteredBacklog.length} items
          </div>
        </div>

        {/* Create Task */}
        <div className="border border-black p-4 rounded-lg mb-5">
          <div className="flex gap-3 items-center flex-wrap">
            <select
              className="text-black border px-2 py-1 rounded text-sm"
              value={createForm.type}
              onChange={(e) =>
                setCreateForm((prev) => ({
                  ...prev,
                  type: e.target.value,
                }))
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
                setCreateForm((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
            />

            {/* ⭐ STORY POINTS ONLY FOR STORY */}
            {/* Story Points ONLY when type = Story */}
            {createForm.type.toLowerCase() === "story" && (
              <select
                className="border text-black border-black px-2 py-1 rounded text-sm"
                value={createForm.story_points || ""}
                onChange={(e) =>
                  setCreateForm((prev) => ({
                    ...prev,
                    story_points: Number(e.target.value),
                  }))
                }
              >
                <option value="">Select Story Points</option>
                {FIB_POINTS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            )}

            <select
              className="border border-black text-black px-2 py-1 rounded text-sm"
              value={createForm.epicId || ""}
              onChange={(e) =>
                setCreateForm((prev) => ({
                  ...prev,
                  epicId: e.target.value,
                }))
              }
            >
              <option value="">No epic</option>
              {epics.map((ep) => (
                <option key={ep.id} value={ep.id}>
                  {ep.name}
                </option>
              ))}
            </select>

            <select
              className="border border-black text-black px-2 py-1 rounded text-sm"
              value={createForm.priority || ""}
              onChange={(e) =>
                setCreateForm((prev) => ({
                  ...prev,
                  priority: e.target.value,
                }))
              }
            >
              <option value="">Priority</option>
              <option value="highest">Highest</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
              <option value="lowest">Lowest</option>
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

        {/* Task List */}
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
                <div className="flex-1 min-w-0 flex items-center gap-3">
                  {!t.sprint_id && (
                    <input
                      type="checkbox"
                      checked={selectedTasksForSprint.includes(t.id)}
                      onChange={() => toggleSelectTaskForSprint(t.id)}
                    />
                  )}
                  <div className="flex-1 min-w-0 cursor-pointer">
                    <div className="font-medium text-black capitalize truncate flex items-center gap-1">
                      <span title={t.type} className="cursor-pointer">
                        {getTypeIcon(t.type)}
                      </span>
                      {t.name}
                      {t.type?.toLowerCase() === "story" && (
                        <div className="text-xs ml-2 text-green-700 font-semibold">
                          Story Points:{" "}
                          <span className="text-black">
                            {t.story_points || 0}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* ⭐ SHOW STORY POINTS */}

                    <div className="text-xs mt-1.5 text-black truncate">
                      {epic ? (
                        <span className="bg-blue-600 px-2 py-0.5 rounded text-white mr-2 text-[11px]">
                          {t.epic_name}
                        </span>
                      ) : (
                        <span className="bg-gray-700/50 px-2 py-0.5 rounded text-black text-[11px]">
                          No epic
                        </span>
                      )}
                      <span className="ml-2 capitalize">• {t.status}</span>
                      <span className="text-black capitalize text-xs">
                        <span
                          className={`px-2 py-0.5 rounded ${
                            t.priority?.toLowerCase() === "highest"
                              ? "bg-red-600 text-white"
                              : t.priority?.toLowerCase() === "high"
                              ? "bg-orange-500 text-white"
                              : t.priority?.toLowerCase() === "medium"
                              ? "bg-yellow-300 text-black"
                              : t.priority?.toLowerCase() === "low"
                              ? "bg-green-300 text-black"
                              : t.priority?.toLowerCase() === "lowest"
                              ? "bg-green-500 text-black"
                              : "bg-gray-300"
                          }`}
                        >
                          {t.priority || "No Priority"}
                        </span>
                      </span>
                      <p
                        className="mt-2 text-blue-600 w-fit hover:underline cursor-pointer"
                        onClick={async () => {
                          setDetailsTask(t);
                          setShowDetailsModal(true);

                          setLoadingComments(true);
                          try {
                            const data = await getIssueComments(t.id);
                            setTaskComments(data || []);
                          } catch (err) {
                            console.error(err);
                          }
                          setLoadingComments(false);
                        }}
                      >
                        View Details
                      </p>
                      {/* Task Details Modal */}
                      {showDetailsModal && detailsTask && (
                        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
                          <div className="bg-white p-5 rounded-xl w-[400px] max-h-[80vh] overflow-auto">
                            <h3 className="text-lg font-semibold mb-3 text-black">
                              Task Details
                            </h3>

                            <p>
                              <strong>Title:</strong> {detailsTask.name}
                            </p>
                            <p>
                              <strong>Type:</strong> {detailsTask.type}
                            </p>
                            <p>
                              <strong>Epic:</strong>{" "}
                              {detailsTask.epic_name || "No Epic"}
                            </p>
                            <p>
                              <strong>Status:</strong> {detailsTask.status}
                            </p>
                            <p>
                              <strong>Priority:</strong>{" "}
                              {detailsTask.priority || "No Priority"}
                            </p>
                            {detailsTask.type?.toLowerCase() === "story" && (
                              <p>
                                <strong>Story Points:</strong>{" "}
                                {detailsTask.story_points || 0}
                              </p>
                            )}
                            <p>
                              <strong>Description:</strong>{" "}
                              {detailsTask.description || "No description"}
                            </p>
                            <div className="mt-3">
                              <strong className="text-black">Comments:</strong>

                              {loadingComments ? (
                                <p className="text-sm text-gray-600">
                                  Loading comments...
                                </p>
                              ) : taskComments.length === 0 ? (
                                <p className="text-sm text-gray-500">
                                  No comments yet.
                                </p>
                              ) : (
                                <div className="mt-2 space-y-2">
                                  {taskComments.map((c) => (
                                    <div
                                      key={c.id}
                                      className="border border-gray-400 p-2 rounded bg-gray-100 text-black text-sm"
                                    >
                                      <div className="flex justify-between">
                                        <p>{c.comment}</p>
                                        <p>
                                          <span>By :</span> {c.author_name}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            <hr className="my-3" />

                            {/* Comments */}
                            <div className="mb-3">
                              <h4
                                onClick={async () => {
                                  if (!commentText.trim())
                                    return alert("Comment cannot be empty");

                                  await IssueComments(
                                    detailsTask.id,
                                    commentText
                                  );
                                  alert("Comment added ✅");
                                  setCommentText("");

                                  // REFRESH COMMENTS AFTER ADDING
                                  const updated = await getIssueComments(
                                    detailsTask.id
                                  );
                                  setTaskComments(updated);
                                }}
                                className="font-semibold text-black mb-1"
                              >
                                Add Comment
                              </h4>
                              <textarea
                                className="w-full border border-black px-3 py-2 rounded text-sm mb-2 text-black"
                                rows={3}
                                placeholder="Write your comment..."
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                              />
                            </div>

                            <div className="flex justify-end gap-3">
                              <button
                                className="px-3 py-1 rounded bg-green-500 text-white"
                                onClick={async () => {
                                  if (!commentText.trim())
                                    return alert("Comment cannot be empty");
                                  await IssueComments(
                                    detailsTask.id,
                                    commentText
                                  );
                                  alert("Comment added ✅");
                                  setCommentText("");
                                  setShowDetailsModal(false);
                                  getTasks();
                                }}
                              >
                                Add Comment
                              </button>
                              <button
                                className="px-3 py-1 rounded bg-gray-400"
                                onClick={() => setShowDetailsModal(false)}
                              >
                                Close
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-3">
                  <button
                    className="bg-red-600 px-2 py-1 rounded text-white"
                    onClick={() => handleDeleteIssue(t.id)}
                  >
                    <Trash2 size={14} />
                  </button>

                  <button
                    className="bg-yellow-500 px-2 py-1 rounded cursor-pointer text-white"
                    onClick={() => {
                      setEditIssueId(t.id);
                      setEditIssueName(t.name);
                      setEditIssueType(t.type.toLowerCase());
                      setEditIssuePriority(t.priority?.toLowerCase() || "");
                      setEditIssueEpicId(t.epic_id || "");
                      setEditStoryPoints(t.story_points || ""); // ⭐ added
                      setShowEditModal(true);
                    }}
                  >
                    <SquarePen size={14} />
                  </button>

                  {/* Comment Modal */}
                  {showCommentModal && (
                    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                      <div className="bg-white p-5 rounded-xl w-[320px]">
                        <h3 className="text-lg font-semibold mb-3 text-black">
                          Add Comment
                        </h3>

                        <textarea
                          className="w-full border border-black px-3 py-2 rounded text-sm mb-3 text-black"
                          rows={4}
                          placeholder="Write your comment..."
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                        />

                        <div className="flex justify-end gap-3">
                          <button
                            className="px-3 py-1 rounded bg-gray-400"
                            onClick={() => {
                              setShowCommentModal(false);
                              setCommentText("");
                              setCommentTaskId(null);
                            }}
                          >
                            Cancel
                          </button>

                          <button
                            className="px-3 py-1 rounded bg-green-500 text-white"
                            onClick={handleAddComment}
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Edit Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white p-5 rounded-xl w-[320px]">
              <h3 className="text-lg font-semibold mb-3 text-black">
                Edit Backlog
              </h3>

              <input
                className="w-full border border-black px-3 py-2 rounded text-sm mb-2 text-black"
                value={editIssueName}
                onChange={(e) => setEditIssueName(e.target.value)}
                placeholder="Name"
              />

              <select
                className="w-full border border-black px-3 py-2 rounded text-sm mb-2 text-black"
                value={editIssueType}
                onChange={(e) => setEditIssueType(e.target.value)}
              >
                <option value="task">Task</option>
                <option value="story">Story</option>
                <option value="bug">Bug</option>
              </select>

              {/* ⭐ STORY POINTS IN EDIT MODAL */}
              {editIssueType === "story" && (
                <select
                  className="w-full border border-black px-3 py-2 rounded text-sm mb-2 text-black"
                  value={editStoryPoints || ""}
                  onChange={(e) => setEditStoryPoints(Number(e.target.value))}
                >
                  <option value="">Select Story Points</option>
                  {FIB_POINTS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              )}

              <select
                className="w-full border border-black px-3 py-2 rounded text-sm mb-2 text-black"
                value={editIssuePriority}
                onChange={(e) => setEditIssuePriority(e.target.value)}
              >
                <option value="">Select Priority</option>
                <option value="highest">Highest</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
                <option value="lowest">Lowest</option>
              </select>

              <select
                className="w-full border border-black px-3 py-2 rounded text-sm mb-4 text-black"
                value={editIssueEpicId || ""}
                onChange={(e) =>
                  setEditIssueEpicId(
                    e.target.value === "" ? null : e.target.value
                  )
                }
              >
                <option value="">No Epic</option>
                {epics.map((ep) => (
                  <option key={ep.id} value={ep.id}>
                    {ep.name}
                  </option>
                ))}
              </select>

              <div className="flex justify-end gap-3">
                <button
                  className="px-3 py-1 rounded bg-gray-400"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>

                <button
                  className="px-3 py-1 rounded bg-green-500 text-white"
                  onClick={handleIssueUpdate}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sprint Assignment */}
        <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="text-xs text-black">
            Selected: {selectedTasksForSprint.length}
          </div>

          <div className="flex gap-2 items-center">
            <select
              className="border border-black px-3 py-1 rounded text-sm text-black"
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

      {/* Epic Modal */}
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
