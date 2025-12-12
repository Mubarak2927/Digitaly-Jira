import React, { useEffect, useState } from "react";
import {
  getProjectById,
  manageProjectMember,
  getAllUsers,
  removeProjectMember,
  ProjectComments,
  getProjectComments,
  updateProject,
  getSprint,
} from "../../Api/projectAPI";
import {
  Users,
  Calendar,
  Layers,
  PlusCircle,
  Trash2,
  X,
  User,
  FileText,
  SquarePen,
  Key,
} from "lucide-react";

export default function ProjectSummary({ selectedProject }) {
  // Extract correct project ID
  const projectId =
    selectedProject?.id || selectedProject?.selectedProject?.id;

  const [members, setMembers] = useState([]);
  const [users, setUsers] = useState([]);
  const [newMember, setNewMember] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [projectDetails, setProjectDetails] = useState(null);

  // Comments
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);

  // Edit Project
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProjectName, setEditProjectName] = useState("");

  const [loading, setLoading] = useState(false);

  // -----------------------------
  // Load All Users
  // -----------------------------
  const loadAllUsers = async () => {
    try {
      const usersData = await getAllUsers();
      setUsers(usersData.users || usersData);
    } catch (err) {
      console.log("Error loading users", err);
    }
  };

  // -----------------------------
  // Load Comments
  // -----------------------------
  const loadProjectComments = async () => {
    try {
      const data = await getProjectComments(projectId);
      setComments(data || []);
    } catch (err) {
      console.log("Error loading comments:", err);
    }
  };

  // -----------------------------
  // Add Comment
  // -----------------------------
  const handleAddComment = async () => {
  if (!newComment.trim()) return;

  try {
    await ProjectComments(projectId, newComment);


    setNewComment("");
    setShowCommentModal(false);
    await loadProjectComments();
  } catch (err) {
    console.log("Error adding comment:", err);
  }
};


  // -----------------------------
  // Load Project & Members
  // -----------------------------
  const loadProject = async () => {
    try {
      setLoading(true);

      const data = await getProjectById(projectId);
      setProjectDetails(data);

      const memberList = (data.members || []).map((m) => ({
        id: m.id,
        name: m.name,
      }));

      setMembers(memberList);
    } catch (error) {
      console.log("Error loading project", error);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Fetch Everything on Page Load
  // -----------------------------
  useEffect(() => {
    if (projectId) {
      loadAllUsers();
      loadProject();
      loadProjectComments();
    }
  }, [projectId]);

  // -----------------------------
  // Add Member
  // -----------------------------
  const handleAddMember = async () => {
    if (!newMember.trim()) return;

    try {
      setLoading(true);

      // YOUR API requires:
      // { "userId": "role" }
      await manageProjectMember(projectId, {
        [newMember]: "developer",
      });

      await loadProject();
      setNewMember("");
      setShowAddModal(false);
    } catch (err) {
      console.log("Error adding member", err);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Delete Members
  // -----------------------------
  const handleDelete = async () => {
    try {
      setLoading(true);

      await Promise.all(
        selectedMembers.map((id) =>
          removeProjectMember(projectId, id)
        )
      );

      await loadProject();
      setSelectedMembers([]);
      setShowDeleteModal(false);
    } catch (err) {
      console.log("Error removing member:", err);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Update Project Name
  // -----------------------------
  const handleUpdateProject = async () => {
    if (!editProjectName.trim()) return;

    try {
      setLoading(true);

      await updateProject(projectId, {
        name: editProjectName,
      });

      setShowEditModal(false);
      await loadProject();
    } catch (err) {
      console.log("Error updating project:", err);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // UI Start
  // -----------------------------
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
  <>
    <div className="p-8 bg-gray-100 text-black min-h-screen">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* LOADING OVERLAY */}
        {/* {loading && (
          <div className="absolute inset-0 bg-white/70 flex flex-col justify-center items-center backdrop-blur-sm z-50">
            <div className="w-10 h-10 border-4 border-gray-400 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="mt-3 text-black font-medium">Loading...</p>
          </div>
        )} */}

        {/* PROJECT HEADER */}
        {projectDetails && (
          <div className="bg-white rounded-3xl p-8 shadow-md border">

            <div className="flex justify-between flex-wrap gap-5 items-center">
              <div className="flex items-center gap-4">
                <Layers size={40} className="text-blue-700" />
                <h1 className="text-3xl font-extrabold uppercase tracking-wide">
                  {projectDetails.name}

                  <button
                    className="ml-4 text-blue-600 hover:text-blue-800"
                    onClick={() => {
                      setEditProjectName(projectDetails.name);
                      setShowEditModal(true);
                    }}
                  >
                    <SquarePen size={22} />
                  </button>
                </h1>
              </div>
              {/* EDIT PROJECT MODAL */}
{showEditModal && (
  <div className="fixed inset-0 bg-black/40 text-black   backdrop-blur-sm flex justify-center items-center z-50">
    <div className="bg-white p-7 rounded-2xl w-96 shadow-xl">

      <div className="flex justify-between mb-4">
        <h2 className="text-xl  text-black font-bold">Edit Project</h2>
        <button onClick={() => setShowEditModal(false)}>
          <X />
        </button>
      </div>

      <input
        type="text"
        className="w-full p-3 border text-black rounded-md"
        value={editProjectName}
        onChange={(e) => setEditProjectName(e.target.value)}
        placeholder="Enter project name"
      />

      <div className="flex justify-end gap-3 mt-6">
        <button
          className="px-4 py-2 bg-gray-600 text-white rounded-lg"
          onClick={() => setShowEditModal(false)}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          onClick={handleUpdateProject}
        >
          Update
        </button>
      </div>

    </div>
  </div>
)}


              <button
                onClick={() => setShowCommentModal(true)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow"
              >
                Add Comment
              </button>
            </div>

            {/* PROJECT DETAILS */}
            <div className="grid sm:grid-cols-2 gap-6 mt-10">

              <div className="bg-gray-50 p-6 rounded-2xl border hover:shadow-sm transition">
                <div className="flex items-center gap-3 mb-2">
                  <Key className="text-gray-800" size={20} />
                  <h3 className="text-lg font-semibold">Project Key</h3>
                </div>
                <p className="text-gray-700">{projectDetails.key || "No key available"}</p>
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl border hover:shadow-sm transition">
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="text-gray-800" size={20} />
                  <h3 className="text-lg font-semibold">Description</h3>
                </div>
                <p className="text-gray-700">
                  {projectDetails.description || "No description provided"}
                </p>
              </div>
            </div>

            {/* COMMENTS */}
            <div className="mt-10 bg-gray-50 p-6 rounded-2xl border">
              <h3 className="text-xl font-bold mb-5">Comments</h3>

              {comments.length > 0 ? (
                <div className="space-y-4">
                  {comments.map((c) => (
                    <div
                      key={c.id}
                      className="p-4 border rounded-xl bg-white shadow-sm hover:shadow transition flex justify-between items-start"
                    >
                      <div>
                        <p className="text-gray-800">{c.comment}</p>
                      </div>
                      <p className="text-blue-600 text-sm font-semibold ml-4">
                        {c.author_name}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No comments yet.</p>
              )}
            </div>

          </div>
        )}
      </div>
    </div>

    {/* ----------------------------------------------------- */}
    {/* MODALS */}
    {/* ----------------------------------------------------- */}

    {/* ADD MEMBER MODAL */}
    {showAddModal && (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
        <div className="bg-white p-7 rounded-2xl w-96 shadow-2xl">

          <div className="flex justify-between mb-5">
            <h2 className="text-xl font-bold">Add Member</h2>
            <button onClick={() => setShowAddModal(false)}>
              <X />
            </button>
          </div>

          <select
            className="w-full p-3 border rounded-md"
            value={newMember}
            onChange={(e) => setNewMember(e.target.value)}
          >
            <option value="">Select Employee</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name || u.full_name}
              </option>
            ))}
          </select>

          <div className="flex justify-end gap-3 mt-6">
            <button
              className="px-4 py-2 bg-gray-600 text-white rounded-lg"
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-green-600 text-white rounded-lg"
              onClick={handleAddMember}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    )}

    {/* DELETE MEMBER MODAL */}
    {showDeleteModal && (
      <div className="fixed inset-0 bg-black/40 flex justify-center items-center backdrop-blur-sm z-50">
        <div className="bg-white p-7 rounded-2xl w-96 shadow-xl">
          <h2 className="text-xl font-bold mb-3">Remove Members</h2>
          <p className="text-gray-600 mb-6">Are you sure you want to remove selected members?</p>

          <div className="flex justify-end gap-3">
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded-lg"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-lg"
              onClick={handleDelete}
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    )}

    {/* COMMENT MODAL */}
    {showCommentModal && (
      <div className="fixed inset-0 bg-black/40 text-black backdrop-blur-sm flex justify-center items-center z-50">
        <div className="bg-white p-7 rounded-2xl w-96 shadow-xl">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-bold">Add Comment</h2>
            <button onClick={() => setShowCommentModal(false)}>
              <X />
            </button>
          </div>

          <textarea
            className="w-full p-3 border rounded-md h-28"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write your comment..."
          />

          <div className="flex justify-end gap-3 mt-6">
            <button
              className="px-4 py-2 bg-gray-600 text-white rounded-lg"
              onClick={() => setShowCommentModal(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-green-600 text-white rounded-lg"
              onClick={handleAddComment}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    )}
  </>
);

}
