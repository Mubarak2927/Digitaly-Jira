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
  addColumnToBoard,
} from "../Api/projectAPI";
import { Columns, File, Hand } from "lucide-react";
import { div, s } from "framer-motion/client";
import ProjectModal from "./Components/ProjecModal";
import toast from "react-hot-toast";

const WhiteBoard = () => {
  const [projects, setProjects] = useState();
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeTab, setActiveTab] = useState("summary");
  const [activeEmployeeSection, setActiveEmployeeSection] = useState(null);
  const [showSidebarProjectModal, setShowSidebarProjectModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showAddColumnModal, setShowAddColumnModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [columnPosition, setColumnPosition] = useState("");


  const [load, setLoad] = useState(false);

  const [newProject, setNewProject] = useState({
    name: "",
    key: "",
    startDate: "",
    platform: "",
    description: "",
  });

  const [newColumnTitle, setNewColumnTitle] = useState("");

  useEffect(() => {
    fetchProjects();
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

  // ---------------- CREATE PROJECT ----------------
  const handleAddSidebarProject = async () => {
    const member_roles = {};

    const payload = {
      key: newProject.key || newProject.name.slice(0, 6).toUpperCase(),
      name: newProject.name,
      description: newProject.description || "No description",
    };

    try {
      const created = await createProject(payload);
      toast.success('Project Created Sucessfully')
      setSelectedProject(created);
      setShowSidebarProjectModal(false);

      // Reset state
      setNewProject({
        name: "",
        key: "",

        description: "",
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
        boardId: columns.id,
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

  const handleAddColumn = async () => {
  console.log("ADD COLUMN CLICKED");

  if (!newColumnTitle.trim()) {
    alert("Column name missing");
    return;
  }

  if (!selectedProject) {
    alert("No project selected");
    return;
  }

  try {
    // TEMP FIX: project id as board id
    const boardId = selectedProject.id;

    const totalColumns =
      selectedProject?.columns?.columns?.length ||
      selectedProject?.columns?.length ||
      0;

    const columnData = {
      name: newColumnTitle,
      status: newColumnTitle.toLowerCase().replace(/\s+/g, "_"),
      position: columnPosition || totalColumns + 1,
    };

    console.log("API PAYLOAD 👉", boardId, columnData);

    await addColumnToBoard(boardId, columnData);

    await handleSelectProject(selectedProject.id);

    setNewColumnTitle("");
    setColumnPosition("");
    setShowAddColumnModal(false);

    toast.success("Column added ");
  } catch (error) {
    console.error("Error adding column:", error);
  }
};


  return (
    <div className="flex flex-col bg-white text-white h-screen">
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
          <div></div>

          {selectedProject && !activeEmployeeSection && (
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-3">
                {/*  */}
                {activeTab === "board" && (
                  <div className="flex absolute right-10 ">
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
          <ProjectModal
            newProject={newProject}
            setNewProject={setNewProject}
            users={users}
            onConfirm={() => {
              setShowSidebarProjectModal(false);
              fetchProjects(); // ✅ PROJECT REFRESH
            }}
          />
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
            <input
              type="number"
              placeholder="Position"
              onChange={(e) => setColumnPosition(Number(e.target.value))}
              className="p-3 rounded-lg bg-gray-900 border border-gray-700 text-white"
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default WhiteBoard;
