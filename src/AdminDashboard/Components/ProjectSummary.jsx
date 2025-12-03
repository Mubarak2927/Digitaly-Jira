import React, { useEffect, useState } from "react";
import {
  getProjectById,
  manageProjectMember,
  getAllUsers,
  removeProjectMember,
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

  // 🔥 Loading State
  const [loading, setLoading] = useState(true);

  // Load project and members
  async function loadProject() {
    try {
      setLoading(true);

      const data = await getProjectById(selectedProject.id);
      setProjectDetails(data);

      const memberList = (data.members || []).map((member) => ({
        id: member.id,
        name: member.name,
      }));

      setMembers(memberList);
      setLoading(false);
    } catch (error) {
      console.log("Error loading project", error);
      setLoading(false);
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const usersData = await getAllUsers();
        const finalUsers = usersData.users || usersData;
        setUsers(finalUsers);

        const projectData = await getProjectById(selectedProject.id);
        setProjectDetails(projectData);

        const memberList = (projectData.members || []).map((member) => ({
          id: member.id,
          name: member.name,
        }));

        setMembers(memberList);
        setLoading(false);
      } catch (err) {
        console.log("Error loading project or users", err);
        setLoading(false);
      }
    }

    if (selectedProject) fetchData();
  }, [selectedProject]);

  // Add member
  async function handleAddMember() {
    if (!newMember.trim()) return;

    try {
      setLoading(true);
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
      setLoading(false);
    }
  }

  // Delete selected members
  async function handleDelete() {
  try {
    setLoading(true);

    // Delete all selected members in parallel
    await Promise.all(
      selectedMembers.map((member) => removeProjectMember(selectedProject.id, member))
    );

    // Reload project data
    await loadProject();

    // Reset selection & close modal
    setSelectedMembers([]);
    setShowDeleteModal(false);
  } catch (error) {
    console.error("Error removing member:", error);
  } finally {
    setLoading(false);
  }
}


  const getSprints = async () => {
    try {
      const data = await getSprint(selectedProject.selectedProject.id);
      console.log("Fetched Sprints:", data);
      setSprints(data || []);
    } catch (error) {
      console.log("Error fetching sprints:", error);
    }
  };
//   if (loadingProjectData) {
//   return (
//     <div className="w-full h-full flex justify-center items-center">
//       <p className="text-lg font-semibold animate-pulse">Loading...</p>
//     </div>
//   );
// }


  return (
    <div className="p-6 sm:p-10 space-y-10 bg-white min-h-screen text-black rounded-3xl shadow-2xl backdrop-blur-xl relative">
      {loading && (
        <div className="absolute inset-0 bg-white flex flex-col items-center h-screen justify-center z-50 backdrop-blur-sm">
          <div className="absolute top-70">
            <div className="w-10  h-10 border-4 border-gray-400 border-t-black rounded-full animate-spin"></div>
            <p className="mt-3 text-gray-800 font-semibold">Loading...</p>
          </div>
        </div>
      )}

      {projectDetails && (
        <div className="bg-white rounded-3xl p-8 border pb-10 shadow-xl transition-all duration-500">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div className="flex items-center gap-4">
              <Layers className="text-black" size={36} />
              <h1 className="text-4xl uppercase font-extrabold tracking-wide">
                {projectDetails.name}
              </h1>
            </div>

            {/* {projectDetails.avatar_url && (
              <img
                src={projectDetails.avatar_url}
                alt="Project Logo"
                className="w-20 h-20 rounded-full border shadow-md hover:scale-105 transition-transform"
              />
            )} */}
          </div>

          <div className="mt-8 grid sm:grid-cols-2 gap-6">
            {/* Lead */}
            <div className="bg-white border rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <User className="text-black" size={20} />
                <h3 className="text-lg font-semibold">Project Lead</h3>
              </div>
              <p>{projectDetails.project_lead?.name || "—"}</p>
            </div>

            {/* Timeline */}
            <div className="border rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="text-black" size={20} />
                <h3 className="text-lg font-semibold">Timeline</h3>
              </div>
              <p>
                Start:{" "}
                {projectDetails.start_date
                  ? new Date(projectDetails.start_date).toLocaleDateString()
                  : "—"}
              </p>
              <p className="mt-1">
                End:{" "}
                {projectDetails.end_date
                  ? new Date(projectDetails.end_date).toLocaleDateString()
                  : "—"}
              </p>
            </div>

            {/* Description */}
            <div className="sm:col-span-2 border rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <FileText className="text-black" size={20} />
                <h3 className="text-lg font-semibold">Description</h3>
              </div>
              <p>{projectDetails.description || "No description provided."}</p>
            </div>
          </div>
        </div>
      )}

      {/* 👥 Team Members */}
      <div className="border rounded-3xl p-8 shadow-lg">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-2xl font-semibold flex items-center gap-2">
            <Users size={22} /> Team Members
          </h3>

         
            <div className="flex gap-3">
              {/* <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-800 text-white rounded-lg text-sm"
              >
                <PlusCircle size={16} /> Add
              </button> */}

              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-1 px-4 py-2 bg-red-600 hover:bg-red-800 text-white rounded-lg text-sm"
              >
                <Trash2 size={16} /> Remove
              </button>
            </div>
      
        </div>

        <ul className="space-y-3 max-h-64 overflow-y-auto">
          {members.length > 0 ? (
            members.map((member) => (
              <li
                key={member.id}
                className="flex items-center justify-between border p-3 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="h-4 w-4"
                    checked={selectedMembers.includes(member.id)}
                    onChange={(e) =>
                      setSelectedMembers((prev) =>
                        e.target.checked
                          ? [...prev, member.id]
                          : prev.filter((m) => m !== member.id)
                      )
                    }
                  />

                  <div>
                    <p className="font-medium">{member.name}</p>
                  </div>
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
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl w-80 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add Member</h3>
              <button onClick={() => setShowAddModal(false)}>
                <X size={18} className="cursor-pointer" />
              </button>
            </div>

            <select
              className="w-full p-2 border rounded-md"
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

            <div className="flex justify-end gap-3 mt-5">
              <button
                className="px-4 py-1.5 bg-gray-600 text-white rounded-md"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-1.5 bg-green-600 text-white rounded-md"
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
          <div className="bg-white p-6 rounded-2xl w-80 shadow-xl">
            <h3 className="text-lg font-semibold mb-3">Remove Members</h3>
            <p className="text-sm mb-5">
              Do you want to remove the selected employees from this project?
            </p>

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-1.5 bg-gray-500 text-white rounded-md"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-1.5 bg-red-600 text-white rounded-md"
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
