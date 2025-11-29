import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Components/Sidebar";
import Tabs from "./Components/Tabs";
import Modal from "./Components/Modal";
import ProjectSummary from "./Components/ProjectSummary";
import BoardView from "./Components/BoardView";
import MemberModal from "./Components/MemberModal";
import EmployeeProfile from "./Components/EmployeeProfile";
import LeaveManagement from "./Components/LeaveManagement";
import Attendance from "./Components/Attendance";
import ListsView from "./Components/ListsView";
import ProductBacklog from "./Components/ProductBacklog";
import ArchivedPage from "./Components/ArchivedPage";
import GoalsPage from "./Components/GoalsPage";
import AdminTopBar from "./Components/AdminTopBar";
import MyAttendance from "./Components/MyAttendance";
import MyLeave from "./Components/MyLeave";
import MyProfile from "./Components/MyProfile";

import {
  getAllProjects,
  createProject,
  getProjectById,
  manageProjectMember,
  getAllUsers,
  getBoardById,
  boardData,
} from "../Api/projectAPI";
import { Columns, File, Hand } from "lucide-react";
import { div, s } from "framer-motion/client";

const WhiteBoard = () => {
  const [projects, setProjects] = useState();
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeTab, setActiveTab] = useState("summary");
  const [activeEmployeeSection, setActiveEmployeeSection] = useState(null);
  const [showSidebarProjectModal, setShowSidebarProjectModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showAddColumnModal, setShowAddColumnModal] = useState(false);
  const [users, setUsers] = useState([]);

  const [load, setLoad] = useState(false);

  const [newProject, setNewProject] = useState({
    name: "",
    key: "",
    startDate: "",
    endDate: "",
    projectLead: "",
    assignedEmployees: [],
    platform: "",
    description: "",
    avatar: "",
    labels: [],
  });

  const [newColumnTitle, setNewColumnTitle] = useState("");

  useEffect(() => {
    fetchProjects();
    // getColumn()
  }, []);

  const fetchProjects = async () => {
    try {
      setLoad(true);
      const data = await getAllProjects();
      console.log(data, "Alll project ");
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoad(false);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // ---------------- CREATE PROJECT ----------------
  const handleAddSidebarProject = async () => {
    if (!newProject.name.trim() || !newProject.projectLead)
      return alert("Please fill all required fields.");

    const member_roles = {
      // [newProject.projectLead]: "project_admin",
    };

    newProject.assignedEmployees.forEach((empId) => {
      member_roles[empId] = "developer";
    });

    const payload = {
      key: newProject.key || newProject.name.slice(0, 6).toUpperCase(),
      name: newProject.name,
      description: newProject.description || "No description",
      avatar_url: newProject.avatar || "",
      start_date: newProject.startDate
        ? new Date(newProject.startDate).toISOString()
        : null,
      end_date: newProject.endDate
        ? new Date(newProject.endDate).toISOString()
        : null,
      project_lead: newProject.projectLead,
      member_roles, // ✅ Updated
    };

    try {
      // setLoad(true)
      const created = await createProject(payload);
      // setProjects((prev) => [...prev, created]);
      setSelectedProject(created);
      setShowSidebarProjectModal(false);

      // Reset state
      setNewProject({
        name: "",
        key: "",
        startDate: "",
        endDate: "",
        projectLead: "",
        assignedEmployees: [],
        platform: "",
        description: "",
        avatar: "",
        labels: [],
      });
    } catch (error) {
      console.error("Error creating project:", error);
    }

    fetchProjects();
  };

  // ---------------- SELECT PROJECT ----------------

  const handleSelectProject = async (id) => {
    try {
      setLoad(true);

      const data = await getProjectById(id);

      setSelectedProject(data);
      setActiveEmployeeSection(null);

      const columns = await getBoardById(id);
      console.log(columns, "columns");

      const withColumns = {
        ...data,
        // boardId : columns.id,
        columns,
      };

      console.log(withColumns, "columns added");

      const datas = await boardData(id);

      console.log(datas, "board data 111111111111111");

      setSelectedProject(withColumns);
      setActiveTab("summary");
    } catch (error) {
      console.error("Error fetching project details:", error);
    } finally {
      setLoad(false);
    }
  };

  // ---------------- ADD MEMBER ----------------
  const handleAddMember = async (newMemberId) => {
    if (!selectedProject) return;

    const payload = {
      user_id: newMemberId,
      role: "developer",
      action: "add",
    };

    try {
      await manageProjectMember(selectedProject.id, payload);
      const updated = await getProjectById(selectedProject.id);
      setSelectedProject(updated);
    } catch (error) {
      console.error("Error adding member:", error);
    }
  };

  const role = localStorage.getItem("role"); // admin or employee

  // ---------------- ADD COLUMN ----------------
  // const handleAddColumn = () => {
  //   if (!newColumnTitle.trim() || !selectedProject) return;
  //   const newCol = {
  //     id: Date.now().toString(),
  //     title: newColumnTitle,
  //     tasks: [],
  //   };

  //   const updatedProj = {
  //     ...selectedProject,
  //     columns: [...selectedProject.columns, newCol],
  //   };

  //   setProjects((prev) =>
  //     prev.map((p) => (p.id === selectedProject.id ? updatedProj : p))
  //   );
  //   setSelectedProject(updatedProj);
  //   setNewColumnTitle("");
  //   setShowAddColumnModal(false);
  // };

const handleAddColumn = async () => {
  if (!newColumnTitle.trim() || !selectedProject) return;

  try {
    const boardId =
      selectedProject?.columns?.columns?.board?.id ||
      selectedProject?.columns?.board_id;

    if (!boardId) {
      console.error("Board ID not found");
      return;
    }

    const columnData = {
      name: newColumnTitle,
      status: "todo",
    };

    // 🔥 Save to backend
    const response = await addColumnToBoard(boardId, columnData);

    // backend returns "column" object
    const createdColumn = response.column;

    // existing columns
    const existingColumns =
      selectedProject?.columns?.columns?.board?.columns || [];

    const updatedColumns = [...existingColumns, createdColumn];

    // update project state
    const updatedProject = {
      ...selectedProject,
      columns: {
        columns: {
          board: {
            ...selectedProject.columns.columns.board,
            columns: updatedColumns,
          },
        },
      },
    };

    setSelectedProject(updatedProject);

    setProjects((prev) =>
      prev.map((p) => (p.id === selectedProject.id ? updatedProject : p))
    );

    setNewColumnTitle("");
    setShowAddColumnModal(false);
  } catch (error) {
    console.error("Error adding column:", error);
  }
};


  return (
    <div className="flex flex-col bg-white text-white h-screen">
      <div className="sticky top-0 z-50 w-full">
        <AdminTopBar />
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 bg-gray-950 text-black border-r border-gray-800">
          <Sidebar
            projects={projects}
            setProjects={setProjects}
            onAddProjectClick={() => setShowSidebarProjectModal(true)}
            onSelectProject={handleSelectProject}
            selectedId={selectedProject?.id}
            onSelectEmployeeSection={setActiveEmployeeSection}
            role={role}
            setLoad={setLoad}
            load={load}
          />
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          {/* {load && (
            <div className="absolute inset-0 flex justify-center items-center bg-white/50 z-50">
              <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
          )} */}

          {selectedProject && !activeEmployeeSection && (
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-3">
                <h1 className="text-2xl sm:text-3xl  text-black font-bold capitalize">
                  {selectedProject.name}
                </h1>
                {activeTab === "board" && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowAddColumnModal(true)}
                      className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm sm:text-base"
                    >
                      + Add Column
                    </button>
                  </div>
                )}
              </div>

              <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

              {activeTab === "summary" && (
                <ProjectSummary selectedProject={selectedProject} />
              )}
              {activeTab === "board" && selectedProject.columns && (
                <BoardView
                  selectedProject={selectedProject}
                  setSelectedProject={setSelectedProject}
                  setProjects={setProjects}
                  handleAddColumn={handleAddColumn}
                  // addColumnToBoard ={addColumnToBoard }
                  handleSelectProject={handleSelectProject}
                />
              )}

              {activeTab === "lists" && (
                <ListsView selectedProject={selectedProject} />
              )}
              {activeTab === "product-backlog" && (
                <ProductBacklog selectedProject={selectedProject} />
              )}
            </div>
          )}

          {activeEmployeeSection === "profile" && <EmployeeProfile />}
          {activeEmployeeSection === "leave" && <LeaveManagement />}
          {activeEmployeeSection === "attendance" && <Attendance />}
          {activeEmployeeSection === "myattendance" && <MyAttendance />}
          {activeEmployeeSection === "myprofile" && <MyProfile />}
          {activeEmployeeSection === "myleave" && <MyLeave />}

          {activeTab === "goals" && <GoalsPage />}
          {activeTab === "archived" && <ArchivedPage />}

          {!selectedProject && !activeEmployeeSection && (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center text-lg animate-fadeIn">
              <div className="flex flex-wrap justify-center items-center gap-2 text-black c  text-4xl">
                Create a New Project
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ---------------- MODALS ---------------- */}
      {showSidebarProjectModal && (
        <Modal
          onCancel={() => setShowSidebarProjectModal(false)}
          onConfirm={handleAddSidebarProject}
        >
          <div className="flex flex-col text-white max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 p-4">
            <h1 className="text-center text-2xl font-bold bg-clip-text text-transparent bg-linear-to-tr from-[#300181] via-[#6915cf] to-[#d62196] mb-6">
              Create New Project
            </h1>

            <div className="flex flex-col divide-y divide-gray-800">
              {/* -------- 1️⃣ Basic Details -------- */}
              <div className="space-y-5 pb-6">
                <h2 className="text-lg font-semibold text-blue-400">
                  1️⃣ Basic Details
                </h2>

                <div className="flex flex-col gap-2">
                  <label className="text-sm text-gray-300">Project Name</label>
                  <input
                    type="text"
                    placeholder="Enter project name"
                    className="p-3 rounded-lg bg-gray-900 border border-gray-700 focus:border-blue-500 outline-none"
                    value={newProject.name || ""}
                    onChange={(e) =>
                      setNewProject({ ...newProject, name: e.target.value })
                    }
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm text-gray-300">Project Key</label>
                  <input
                    type="text"
                    placeholder="Short Form"
                    className="p-3 rounded-lg bg-gray-900 border border-gray-700 focus:border-blue-500 outline-none"
                    value={newProject.key || ""}
                    onChange={(e) =>
                      setNewProject({ ...newProject, key: e.target.value })
                    }
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm text-gray-300">Avatar URL</label>
                  <input
                    type="text"
                    placeholder="Project profile"
                    className="p-3 rounded-lg bg-gray-900 border border-gray-700 focus:border-blue-500 outline-none"
                    value={newProject.avatar || ""}
                    onChange={(e) =>
                      setNewProject({ ...newProject, avatar: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* -------- 2️⃣ Timeline & Team -------- */}
              <div className="space-y-5 py-6">
                <h2 className="text-lg font-semibold text-green-400">
                  2️⃣ Timeline & Team
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-300">Start Date</label>
                    <input
                      type="date"
                      className="p-3 rounded-lg bg-gray-900 border border-gray-700 focus:border-blue-500 outline-none"
                      value={newProject.startDate || ""}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          startDate: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-300">End Date</label>
                    <input
                      type="date"
                      className="p-3 rounded-lg bg-gray-900 border border-gray-700 focus:border-blue-500 outline-none"
                      value={newProject.endDate || ""}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          endDate: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm text-gray-300">Project Lead</label>
                  <select
                    className="p-3 rounded-lg bg-gray-900 border border-gray-700 text-gray-200 focus:border-blue-500 outline-none"
                    value={newProject.projectLead || ""}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        projectLead: e.target.value,
                      })
                    }
                  >
                    <option value="">Select Lead</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} {u.full_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Assigned Employees (Multi-select) */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-gray-300">
                    Assigned Employees
                  </label>

                  <select
                    className="p-3 rounded-lg bg-gray-900 border border-gray-700 text-gray-200 
               focus:border-blue-500 outline-none"
                    value={newProject.assignedEmployees[0] || ""}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        assignedEmployees: [e.target.value], // 💥 always array
                      })
                    }
                  >
                    <option value="">Select Employee</option>

                    {users
                      .filter((u) => u.id !== newProject.projectLead) // Lead remove
                      .map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} {u.full_name}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm text-gray-300">Platform</label>
                  <select
                    className="p-3 rounded-lg bg-gray-900 border border-gray-700 text-gray-200 focus:border-blue-500 outline-none"
                    value={newProject.platform || ""}
                    onChange={(e) =>
                      setNewProject({ ...newProject, platform: e.target.value })
                    }
                  >
                    <option value="">Select Platform</option>
                    <option value="Web">Web</option>
                    <option value="Android">Android</option>
                    <option value="iOS">iOS</option>
                  </select>
                </div>
              </div>

              {/* -------- 3️⃣ Labels & Description -------- */}
              <div className="space-y-5 py-6">
                <h2 className="text-lg font-semibold text-pink-400">
                  3️⃣ Description
                </h2>
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-gray-300">Description</label>
                  <textarea
                    placeholder="Enter project description"
                    className="p-3 rounded-lg bg-gray-900 border border-gray-700 focus:border-blue-500 outline-none placeholder-gray-500 resize-none h-28"
                    value={newProject.description || ""}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {showAddMemberModal && (
        <MemberModal
          onClose={() => setShowAddMemberModal(false)}
          onAddMember={handleAddMember}
        />
      )}

      {showAddColumnModal && (
        <Modal
          onCancel={() => setShowAddColumnModal(false)}
          onConfirm={handleAddColumn}
        >
          <div className="flex flex-col gap-4">
            <h2 className="text-center text-xl font-semibold text-blue-600">
              Add New Column
            </h2>
            <input
              type="text"
              placeholder="Enter column name..."
              className="p-3 rounded-lg bg-gray-900 border border-gray-700 focus:border-blue  -500 outline-none"
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default WhiteBoard;
