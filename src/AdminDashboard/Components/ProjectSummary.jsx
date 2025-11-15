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
} from "lucide-react";

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
    <div className="p-6 sm:p-10 space-y-10 bg-white min-h-screen text-black rounded-3xl shadow-2xl backdrop-blur-xl">
      {/* 🌟 Project Header */}
      {projectDetails && (
        <div className="bg-white rounded-3xl p-8 border border-gray-700 shadow-xl  transition-all duration-500 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div className="flex items-center gap-4">
              <Layers className="text-black drop-shadow-glow" size={36} />
              <h1 className="text-4xl  uppercase font-extrabold tracking-wide ">
                {projectDetails.name}
              </h1>
            </div>

            {projectDetails.avatar_url && (
              <img
                src={projectDetails.avatar_url}
                alt="Project Logo"
                className="w-20 h-20 rounded-full border-2 border shadow-md hover:scale-105 transition-transform duration-300"
              />
            )}
          </div>

          <div className="mt-8 grid sm:grid-cols-2 gap-6">
            {/* Lead */}
            <div className="bg-white border border rounded-2xl p-6  transition-all duration-300 hover:shadow-cyan-500/20">
              <div className="flex items-center gap-3 mb-3">
                <User className="text-black" size={20} />
                <h3 className="text-lg font-semibold text-black">
                  Project Lead
                </h3>
              </div>
              <p className="text-black">{projectDetails.project_lead || "—"}</p>
            </div>

            {/* Timeline */}
            <div className=" border border rounded-2xl p-6  transition-all duration-300 hover:shadow-cyan-500/20">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="text-black" size={20} />
                <h3 className="text-lg font-semibold text-black">
                  Timeline
                </h3>
              </div>
              <p className="text-black">
                Start:{" "}
                {projectDetails.start_date
                  ? new Date(projectDetails.start_date).toLocaleDateString()
                  : "—"}
              </p>
              <p className="text-black mt-1">
                End:{" "}
                {projectDetails.end_date
                  ? new Date(projectDetails.end_date).toLocaleDateString()
                  : "—"}
              </p>
            </div>

            {/* Description */}
            <div className="sm:col-span-2  border border-gray-700 rounded-2xl p-6  transition-all duration-300 hover:shadow-cyan-500/20">
              <div className="flex items-center gap-3 mb-3">
                <FileText className="text-black" size={20} />
                <h3 className="text-lg font-semibold text-black">
                  Description
                </h3>
              </div>
              <p className="text-black leading-relaxed">
                {projectDetails.description || "No description provided."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 👥 Team Members */}
      <div className=" border border-gray-700 rounded-3xl p-8 shadow-lg hover:shadow-blue-500/20 transition-all duration-300 backdrop-blur-md">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-2xl font-semibold flex items-center gap-2 text-black  ">
            <Users size={22} /> Team Members
          </h3>
          <div className="flex gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1 px-4 py-2 text-white cursor-pointer bg-blue-600 hover:bg-blue-800 rounded-lg text-sm font-medium shadow-md transition-all duration-300"
            >
              <PlusCircle size={16} /> Add
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-1 px-4 py-2 bg-red-600 hover:bg-red-800 text-white cursor-pointer rounded-lg text-sm font-medium shadow-md transition-all duration-300"
            >
              <Trash2 size={16} /> Remove
            </button>
          </div>
        </div>

        <ul className="space-y-3 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-700 scrollbar-track-gray-900">
          {members.length > 0 ? (
            members.map((member) => (
              <li
                key={member.id}
                className="flex items-center justify-between bg-[#131826]/80 border border-gray-700  hover:bg-[#182030]/80 transition-all duration-300 p-3 rounded-xl shadow-sm"
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
                  <span className="text-gray-100 font-medium">{member.id}</span>
                </div>
              </li>
            ))
          ) : (
            <p className="text-gray-500 text-sm italic">No Members Found</p>
          )}
        </ul>
      </div>

      {/* 🧩 Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-white/80 flex justify-center items-center z-50">
          <div className="bg-gray-50  p-6 rounded-2xl w-80 border shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold ml-20 text-black">
                Add Member
              </h3>
              <button onClick={() => setShowAddModal(false)}>
                <X size={18} className="text-black cursor-pointer" />
              </button>
            </div>

            <select
              className="w-full p-2  border border-black rounded-md text-black"
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
                className="px-4 py-1.5 bg-black text-white cursor-pointer hover:bg-gray-700 rounded-md text-sm"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-1.5 bg-green-600 text-white hover:bg-green-500 cursor-pointer rounded-md text-sm"
                onClick={handleAddMember}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🗑️ Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-6 rounded-2xl w-80 shadow-lg/60">
            <h3 className="text-lg font-semibold  mb-3">
              Remove Members
            </h3>
            <p className=" text-sm mb-5">
              Do you want to Remove the selected Employee from this project
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
