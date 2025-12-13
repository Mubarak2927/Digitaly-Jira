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
} from "lucide-react";
import { div } from "framer-motion/client";
import { deleteProject } from "../../Api/projectAPI";

const Sidebar = ({
  projects,
  onAddProjectClick,
  onSelectProject,
  selectedId,
  onSelectEmployeeSection,
  load,
}) => {
  const navigate = useNavigate();

  const [showEmployeeMenu, setShowEmployeeMenu] = useState(false);
  const [showProjectMenu, setShowProjectMenu] = useState(false);
  const [activeEmployeeSection, setActiveEmployeeSection] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  const loginRole = localStorage.getItem("role");

  console.log(loginRole, "1234424");

  const handleLogout = () => {
    navigate("/");
  };

  const handleEmployeeClick = (section) => {
    setActiveEmployeeSection(section);
    onSelectEmployeeSection(section);
  };

const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this project?")) return;

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

  return (
    <div className="w-64 h-screen bg-white    shadow-lg/40 p-5 flex flex-col">


      <div className="mb-10 flex items-center gap-2">
        <p className="bg-blue-600 w-fit px-2 py-0.5 text-white rounded-lg">
          <h1 className="text-2xl">
            D
          </h1>
        </p>
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
                        className="text-white hover:text-white shrink-0 ml-2"
                      />
                    </button>

                    {openMenuId === p.id && (
                      <div
                        className="absolute right-8 top-0 bg-white border shadow-md rounded-md text-sm z-50"
                      >
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

      {/* Employee Section */}
      <div
        className=" text-black px-3  border py-2 rounded-md cursor-pointer flex justify-between items-center transition"
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
