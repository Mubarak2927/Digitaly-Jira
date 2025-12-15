import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  ChevronDown,
  ChevronUp,
  User,
  Plus,
  Folder,
  File,
  MoreHorizontal,
  Users,
  User2,
  Calendar,
  Clock,
  Trash2,
  AlarmClockPlus,
} from "lucide-react";
import { div } from "framer-motion/client";
import { createSprint, deleteProject, getSprint } from "../../Api/projectAPI";

const Sidebar = ({
  projects,
  onAddProjectClick,
  onSelectProject,
  selectedId,
  onSelectEmployeeSection,
  load,
  selectedProject 
}) => {
  const navigate = useNavigate();

  const [showEmployeeMenu, setShowEmployeeMenu] = useState(false);
  const [showProjectMenu, setShowProjectMenu] = useState(false);
  const [activeEmployeeSection, setActiveEmployeeSection] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showSprintMenu, setShowSprintMenu] = useState(false);
  const [openSprintModal, setOpenSprintModal] = useState(false);
  const [sprints, setSprints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(null);


  const [sprintForm, setSprintForm] = useState({
    name: "",
    projectId: "",
    startDate: "",
    endDate: "",
  });

  const loginRole = localStorage.getItem("role");

  console.log(loginRole, "1234424");

  const handleLogout = () => {
    navigate("/");
  };

  const handleEmployeeClick = (section) => {
    setActiveEmployeeSection(section);
    onSelectEmployeeSection(section);
  };
  const handleWeekSelect = (days) => {
  setSelectedWeek(days);
  setSprintByWeeks(days);
};

useEffect(() => {
  if (!selectedId) return;

  const fetchSprints = async () => {
     try {
       const data = await getSprint(selectedProject.selectedProject.id);
       setSprints(data || []);
     } catch (error) {
       console.error("Error fetching sprints:", error);
     }
   };

  fetchSprints();
}, [selectedId]);


  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;

    try {
      await deleteProject(id);
      alert("Project deleted successfully ✅");
      setOpenMenuId(null);
    } catch (err) {
      alert("Failed to delete project ❌");
    }
  };

  useEffect(() => {
    const handleOutside = () => setOpenMenuId(null);
    document.addEventListener("click", handleOutside);
    return () => document.removeEventListener("click", handleOutside);
  }, []);

 const handleCreateSprint = async () => {
  try {
    const payload = {
      name: sprintForm.name,
      goal: sprintForm.goal,
      project_id: sprintForm.projectId,
      start_date: new Date(sprintForm.startDate).toISOString(),
      end_date: new Date(sprintForm.endDate).toISOString(),
    };

    await createSprint(payload);

    // Refresh sprint list for the project of the created sprint
    const res = await getSprint(sprintForm.projectId,sprintForm.name);
    setSprints(res?.data || []);

    setOpenSprintModal(false);
  } catch (error) {
    console.error("Error creating sprint:", error.response?.data || error);
  }
};


const getProjectName = (projectId) => {
  const project = projects?.find((p) => p.id === projectId);
  return project ? project.name : "Unknown Project";
};




  const setSprintByWeeks = (days) => {
    const start = new Date();
    const end = new Date();
    end.setDate(start.getDate() + days);

    const formatDate = (date) => date.toISOString().split("T")[0];

    setSprintForm({
      ...sprintForm,
      startDate: formatDate(start),
      endDate: formatDate(end),
    });
  };

  return (
    <div className="w-64 h-screen bg-white    shadow-lg/40 p-5 flex flex-col">
      <div className="mb-10 flex items-center gap-2">
        <h1 className="bg-blue-600 w-fit px-2 py-0.5 text-white rounded-lg">
          <h1 className="text-2xl">D</h1>
        </h1>
        <p className="text-2xl font-semibold">Digitaly</p>
      </div>

      <div className="mb-3">
        <div
          className="flex justify-between p-2 rounded-lg items-center cursor-pointer border transition"
          onClick={() => setShowProjectMenu(!showProjectMenu)}
        >
          <h3 className="font-bold flex gap-2 items-center">
            <Folder size={18} /> Projects
          </h3>
          {showProjectMenu ? (
            <ChevronUp size={20} className="text-black font-bold" />
          ) : (
            <ChevronDown size={20} className="text-black font-bold" />
          )}
        </div>

        {showProjectMenu && (
          <div className="mt-2 rounded-lg p-2 space-y-2 overflow-y-auto max-h-48">
            {loginRole === "admin" && (
              <button
                onClick={onAddProjectClick}
                className="flex items-center gap-2 w-full py-2 px-3 rounded-md transition-all"
              >
                <Plus size={16} /> Add Project
              </button>
            )}

            <div className="space-y-1 mt-2">
              {load ? (
                <div className="flex gap-2">
                  <p className="animate-spin h-5 w-5 text-center border-4 border-blue-600 border-t-transparent rounded-full"></p>
                  <p>Loading...</p>
                </div>
              ) : projects?.length === 0 ? (
                <p className="text-gray-400 text-xs text-center italic"></p>
              ) : (
                projects?.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => onSelectProject(p.id)}
                    className={`relative flex items-center justify-between px-3 py-2 rounded-md cursor-pointer text-sm transition-all ${
                      selectedId === p.id
                        ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white"
                        : "hover:bg-gray-500 text-black"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <File size={15} className="shrink-0" />
                      <span className="truncate capitalize">{p.name}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === p.id ? null : p.id);
                      }}
                    >
                      <MoreHorizontal
                        size={18}
                        className="text-white hover:text-white cursor-pointer shrink-0 ml-2"
                      />
                    </button>

                    {openMenuId === p.id && (
                      <div className="absolute right-8 top-0 bg-white border shadow-md rounded-md text-sm z-50">
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="block p-1.5 text-red-600 hover:scale-105 cursor-pointer w-full text-left"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
      <div className="mt-3">
        <div
          className="border px-3 py-2 cursor-pointer transition rounded-md flex justify-between items-center"
          onClick={() => setShowSprintMenu(!showSprintMenu)}
        >
          <h1 className="flex items-center gap-3">
            <AlarmClockPlus size={23} />
            <span className="font-bold">Sprints</span>
          </h1>

          <button className="hover:scale-110 transition cursor-pointer">
            {showSprintMenu ? (
              <ChevronUp size={20} />
            ) : (
              <ChevronDown size={20} />
            )}
          </button>
        </div>

        {/* Sprint Dropdown */}
   {showSprintMenu && (
  <div className="mt-2 px-3 space-y-3">

    <button
      onClick={() => setOpenSprintModal(true)}
      className="ml-2 text-md flex items-center gap-2 cursor-pointer py-2"
    >
      <span className="text-2xl">+</span> Create Sprint
    </button>

    {sprints.length === 0 ? (
      <p className="text-xs text-gray-400 ml-4">No sprints</p>
    ) : (
      sprints.map((sprint) => (
        <div key={sprint.id} className="ml-4">
          
          {/* Project Name */}
          <p className="text-xs font-bold text-gray-600 uppercase">
            {getProjectName(sprint.project_id)}
          </p>

          {/* Sprint Name */}
          <div className="ml-3 px-3 py-1 rounded-md text-sm cursor-pointer hover:bg-blue-100">
            🏃 {sprint.name}
          </div>

        </div>
      ))
    )}
  </div>
)}


      </div>

      {openSprintModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setOpenSprintModal(false)}
        >
          <div
            className="bg-white w-99 h-auto rounded-xl p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-4">Create Sprint</h2>

            {/* Sprint Name */}
            <input
              type="text"
              placeholder="Sprint name"
              value={sprintForm.name}
              onChange={(e) =>
                setSprintForm({ ...sprintForm, name: e.target.value })
              }
              className="w-full border px-3 py-2 rounded-md mb-3"
            />
              <input
              type="text"
              placeholder="Goal"
              value={sprintForm.goal}
              onChange={(e) =>
                setSprintForm({ ...sprintForm, goal: e.target.value })
              }
              className="w-full border px-3 py-2 rounded-md mb-3"
            />

            {/* Project Dropdown */}
            <select
              value={sprintForm.projectId}
              onChange={(e) =>
                setSprintForm({ ...sprintForm, projectId: e.target.value })
              }
              className="w-full border rounded-md px-3 py-2 mt-5 bg-white"
            >
              <option value="">Select Project</option>
              {projects?.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>

            {/* 🔥 Week Buttons */}
           <div className="flex gap-2 mt-5">
  <button
    onClick={() => handleWeekSelect(7)}
    className={`flex-1 cursor-pointer rounded-xl p-1.5 shadow-lg/50 transition
      ${
        selectedWeek === 7
          ? "bg-green-600 text-white scale-105"
          : "bg-blue-600 text-white hover:scale-105"
      }`}
  >
    Week 1
  </button>

  <button
    onClick={() => handleWeekSelect(14)}
    className={`flex-1 cursor-pointer rounded-xl p-1.5 shadow-lg/50 transition
      ${
        selectedWeek === 14
          ? "bg-green-600 text-white scale-105"
          : "bg-blue-600 text-white hover:scale-105"
      }`}
  >
    Week 2
  </button>

  <button
    onClick={() => handleWeekSelect(28)}
    className={`flex-1 cursor-pointer rounded-xl p-1.5 shadow-lg/50 transition
      ${
        selectedWeek === 28
          ? "bg-green-600 text-white scale-105"
          : "bg-blue-600 text-white hover:scale-105"
      }`}
  >
    Week 4
  </button>
</div>


            {/* Dates (Manual also allowed) */}
            <div className="  mt-5 ">
              <div className="flex-col flex">
                <label className="font-bold">Start Date</label>
                <input
                  type="date"
                  value={sprintForm.startDate}
                  onChange={(e) =>
                    setSprintForm({ ...sprintForm, startDate: e.target.value })
                  }
                  className="w-full border px-3 py-2 rounded-md mb-3"
                />
              </div>

              <div className="flex flex-col mt-3">
                <label className="font-bold">End Date</label>
                <input
                  type="date"
                  value={sprintForm.endDate}
                  onChange={(e) =>
                    setSprintForm({ ...sprintForm, endDate: e.target.value })
                  }
                  className="w-full border px-3 py-2 rounded-md mb-3"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-7 ">
              <button
                onClick={() => setOpenSprintModal(false)}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white cursor-pointer rounded-md"
              >
                Cancel
              </button>

              <button
                onClick={handleCreateSprint}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 cursor-pointer  text-white rounded-md"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Employee Section */}
      <div
        className=" text-black px-3  mt-5 border py-2 rounded-md cursor-pointer flex justify-between items-center transition"
        onClick={() => setShowEmployeeMenu(!showEmployeeMenu)}
      >
        <h1 className="flex items-center font-bold gap-2">
          <Users size={25} /> Employee Management
        </h1>
        {showEmployeeMenu ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>

      {showEmployeeMenu && (
        <div className="pl-6 mt-2 space-y-2 text-sm">
          {/* ADMIN → Employee Details */}
          {loginRole === "admin" && (
            <div
              onClick={() => handleEmployeeClick("profile")}
              className={`flex items-center border font-semibold mt-5 gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all ${
                activeEmployeeSection === "profile"
                  ? "bg-blue-300 text-black shadow-md"
                  : "bg-gray-200 hover:bg-blue-300"
              }`}
            >
              <User2 size={18} /> Employee Details
            </div>
          )}

          {/* EMPLOYEE → My Profile */}
          {loginRole === "employee" && (
            <div
              onClick={() => handleEmployeeClick("myprofile")}
              className={`flex items-center border font-semibold mt-5 gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all ${
                activeEmployeeSection === "profile"
                  ? "bg-blue-300 text-black shadow-md"
                  : "bg-gray-200 hover:bg-blue-300"
              }`}
            >
              <User2 size={18} /> My Profile
            </div>
          )}

          {/* ADMIN → Leave Management */}
          {loginRole === "admin" && (
            <div
              onClick={() => handleEmployeeClick("leave")}
              className={`flex items-center font-semibold border gap-2 mt-5 px-3 py-2 rounded-lg cursor-pointer transition-all ${
                activeEmployeeSection === "leave"
                  ? "bg-blue-300 text-black shadow-md"
                  : "bg-gray-200 hover:bg-blue-300"
              }`}
            >
              <Calendar size={18} /> Leave Management
            </div>
          )}

          {/* EMPLOYEE → Apply Leave */}
          {loginRole === "employee" && (
            <div
              onClick={() => handleEmployeeClick("myleave")}
              className={`flex items-center font-semibold border gap-2 mt-5 px-3 py-2 rounded-lg cursor-pointer transition-all ${
                activeEmployeeSection === "leave"
                  ? "bg-blue-300 text-black shadow-md"
                  : "bg-gray-200 hover:bg-blue-300"
              }`}
            >
              <Calendar size={18} /> Apply Leave
            </div>
          )}

          {/* ADMIN → Attendance */}
          {loginRole === "admin" && (
            <div
              onClick={() => handleEmployeeClick("attendance")}
              className={`flex items-center font-semibold mt-5 border gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all ${
                activeEmployeeSection === "attendance"
                  ? "bg-blue-300 text-black shadow-md"
                  : "bg-gray-200 hover:bg-blue-300"
              }`}
            >
              <Clock size={18} /> Attendance
            </div>
          )}

          {/* EMPLOYEE → My Attendance */}
          {loginRole === "employee" && (
            <div
              onClick={() => handleEmployeeClick("myattendance")}
              className={`flex items-center font-semibold mt-5 border gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all ${
                activeEmployeeSection === "attendance"
                  ? "bg-blue-300 text-black shadow-md"
                  : "bg-gray-200 hover:bg-blue-300"
              }`}
            >
              <Clock size={18} /> My Attendance
            </div>
          )}
        </div>
      )}

      {/* Logout */}
      <div className="absolute bottom-5  pt-4 px-2">
        <button
          onClick={handleLogout}
          className="w-full flex   items-center justify-center gap-2 px-15 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-semibold text-white transition-all"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
