import React, { useEffect, useState } from "react";
import {
  getProjectById,
  manageProjectMember,
  getAllUsers,
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
  Star,
  Globe2,
} from "lucide-react";
import { p } from "framer-motion/client";

export default function ProjectSummary({ selectedProject }) {
  const [members, setMembers] = useState([]);
  const [users, setUsers] = useState([]);
  const [newMember, setNewMember] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectDetails, setProjectDetails] = useState(null);

  async function loadProject() {
    try {
      const data = await getProjectById(selectedProject.id);
      setProjectDetails(data);
      const memberList = Object.keys(data.member_roles || {}).map((userId) => {
        const user = users.find((u) => u.id === userId);
        return user ? { id: userId, name: user.name } : { id: userId, name: userId };
      });
      setMembers(memberList);
    } catch (error) {
      console.log("Error loading project", error);
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const usersData = await getAllUsers();
        setUsers(usersData.users || usersData);
        const projectData = await getProjectById(selectedProject.id);
        setProjectDetails(projectData);
        const memberList = Object.keys(projectData.member_roles || {}).map((userId) => {
          const user = (usersData.users || usersData).find((u) => u.id === userId);
          return { id: userId, name: user ? user.name : userId };
        });
        setMembers(memberList);
      } catch (err) {
        console.log("Error loading project or users", err);
      }
    }
    if (selectedProject) fetchData();
  }, [selectedProject]);

  async function handleAddMember() {
    if (!newMember.trim()) return;
    try {
      await manageProjectMember(selectedProject.id, {
        user_id: newMember,
        role: "developer",
        action: "add",
      });
      await loadProject();
      setNewMember("");
      setShowAddModal(false);
    } catch (error) {
      console.log("Error adding member", error);
    }
  }

  async function handleDelete() {
    try {
      for (let member of selectedMembers) {
        await manageProjectMember(selectedProject.id, {
          user_id: member,
          action: "remove",
        });
      }
      await loadProject();
      setSelectedMembers([]);
      setShowDeleteModal(false);
    } catch (error) {
      console.log("Error removing member", error);
    }
  }

  return (
    <div className="text-white p-6 sm:p-10 space-y-10 bg-[#0b0d15] min-h-screen rounded-3xl shadow-2xl">
      {/* ⚡ Project Header */}
      {projectDetails && (
        <div className="bg-gradient-to-br from-[#111827] to-[#1e293b] rounded-3xl p-8 border border-gray-700 shadow-lg hover:shadow-cyan-500/20 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Layers className="text-cyan-400" size={32} />
              <h1 className="text-3xl font-bold tracking-wide bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
                {projectDetails.name}
              </h1>
            </div>
            {/* <span className="px-4 py-1 bg-cyan-500/20 text-cyan-300 text-sm rounded-full border border-cyan-600">
              Active
            </span> */}
          </div>
            {projectDetails.avatar_url && (
                <div>
                  <h1 className="mt-5 mb-3 font-bold text-lg"> Logo</h1>
                  <img
                  src={projectDetails.avatar_url}
                  alt="Logo"
                  className="w-25 h-25 rounded-full border-2 border-cyan-500 shadow-md hover:scale-105 transition animate-glow"
                />
                </div>
            )}

          <div className="mt-8 grid sm:grid-cols-2 gap-6">
            {/* Info Card */}
            <div className="bg-[#141826] border border-gray-700 rounded-2xl p-5 hover:border-cyan-400 transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <User className="text-yellow-400" size={18} />
                <h3 className="text-lg font-semibold text-cyan-300">Project Lead</h3>
              </div>
              <p className="text-gray-300">{projectDetails.project_lead || "—"}</p>
            </div>

            {/* Dates Card */}
            <div className="bg-[#141826] border border-gray-700 rounded-2xl p-5 hover:border-cyan-400 transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="text-green-400" size={18} />
                <h3 className="text-lg font-semibold text-cyan-300">Timeline</h3>
              </div>
              <p className="text-gray-300">
                Start Date:{" "}
                {projectDetails.start_date
                  ? new Date(projectDetails.start_date).toLocaleDateString()
                  : "—"}
              </p>
              <p className="text-gray-300 mt-1">
                End Date:{" "}
                {projectDetails.end_date
                  ? new Date(projectDetails.end_date).toLocaleDateString()
                  : "—"}
              </p>
            </div>

            {/* Description Card */}
            <div className="bg-[#141826] border border-gray-700 rounded-2xl p-5 sm:col-span-2 hover:border-cyan-400 transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <FileText className="text-purple-400" size={18} />
                <h3 className="text-lg font-semibold text-cyan-300">Description</h3>
              </div>
              <p className="text-gray-400 leading-relaxed">
                {projectDetails.description || "No description provided."}
              </p>
            </div>

           
          </div>
        </div>
      )}

      {/* ⚡ Members Section */}
      <div className="bg-gradient-to-br from-[#111827] to-[#1e293b] border border-gray-700 rounded-3xl p-8 shadow-lg hover:shadow-blue-500/20 transition-all">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-2xl font-semibold flex items-center gap-2 text-cyan-400">
            <Users size={22} /> Team Members
          </h3>
          <div className="flex gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 px-4 py-2 rounded-lg text-sm font-medium shadow-md transition"
            >
              <PlusCircle size={16} /> Add
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 px-4 py-2 rounded-lg text-sm font-medium shadow-md transition"
            >
              <Trash2 size={16} /> Remove
            </button>
          </div>
        </div>

        <ul className="space-y-3 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
          {members.length > 0 ? (
            members.map((member) => (
              <li
                key={member.id}
                className="flex items-center justify-between bg-[#141826] hover:bg-[#1f2332] border border-gray-700 hover:border-cyan-500 transition-all duration-300 p-3 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-cyan-500"
                    checked={selectedMembers.includes(member.id)}
                    onChange={(e) =>
                      setSelectedMembers((prev) =>
                        e.target.checked
                          ? [...prev, member.id]
                          : prev.filter((m) => m !== member.id)
                      )
                    }
                  />
                  <span className="text-gray-100 font-medium">
                    {member.id}
                  </span>
                </div>
              </li>
            ))
          ) : (
            <p className="text-gray-500 text-sm italic">No Members Found</p>
          )}
        </ul>
      </div>

      {/* ⚡ Add & Delete Modals (Same as before) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-[#121420] p-6 rounded-2xl w-80 border border-cyan-700 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-cyan-400">
                Add Member
              </h3>
              <button onClick={() => setShowAddModal(false)}>
                <X size={18} className="text-gray-400 hover:text-white" />
              </button>
            </div>

            <select
              className="w-full p-2 bg-[#1b1f2e] border border-gray-700 rounded-md text-white"
              value={newMember}
              onChange={(e) => setNewMember(e.target.value)}
            >
              <option value="">Select Employee</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.full_name}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-3 mt-5">
              <button
                className="px-4 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-md text-sm"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 rounded-md text-sm"
                onClick={handleAddMember}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-[#121420] p-6 rounded-2xl w-80 border border-red-700 shadow-xl">
            <h3 className="text-lg font-semibold text-red-400 mb-3">
              Remove Members?
            </h3>
            <p className="text-gray-400 text-sm mb-5">
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-md text-sm"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-1.5 bg-red-600 hover:bg-red-500 rounded-md text-sm"
                onClick={handleDelete}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
