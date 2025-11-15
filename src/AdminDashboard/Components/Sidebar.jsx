import React, { useState } from "react";
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
} from "lucide-react";

const Sidebar = ({
  projects,
  onAddProjectClick,
  onSelectProject,
  selectedId,
  onSelectEmployeeSection,
}) => {
  const navigate = useNavigate();

  const [showEmployeeMenu, setShowEmployeeMenu] = useState(false);
  const [showProjectMenu, setShowProjectMenu] = useState(false);
  const [activeEmployeeSection, setActiveEmployeeSection] = useState(null);

  const handleLogout = () => {
    navigate("/");
  };

  const handleEmployeeClick = (section) => {
    setActiveEmployeeSection(section);
    onSelectEmployeeSection(section);
  };

  return (
    <div className="w-64 h-screen bg-white   border-r shadow-lg/40 p-5 flex flex-col">
      
      {/* Projects Section */}
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

            <button
              onClick={onAddProjectClick}
              className="flex items-center gap-2 w-full py-2 px-3 rounded-md transition-all"
            >
              <Plus size={16} /> Add Project
            </button>

            <div className="space-y-1 mt-2">
              {projects?.length === 0 ? (
                <p className="text-gray-400 text-xs text-center italic"></p>
              ) : (
                projects?.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => onSelectProject(p.id)}
                    className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer text-sm transition-all ${
                      selectedId === p.id
                        ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white"
                        : "hover:bg-gray-500 text-black"
                    }`}
                    title={p.name}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <File size={15} className="shrink-0" />
                      <span className="truncate capitalize">{p.name}</span>
                    </div>
                    <MoreHorizontal
                      size={18}
                      className="text-black hover:text-white shrink-0 ml-2"
                    />
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
          <div
            onClick={() => handleEmployeeClick("profile")}
            className={`flex items-center  border font-semibold mt-5 gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all ${
              activeEmployeeSection === "profile"
                ? "bg-blue-300 text-black shadow-md"
                : "bg-gray-200 hover:bg-blue-300"
            }`}
          >
            <User2 size={18} /> Employee Profile
          </div>

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
        </div>
      )}

      {/* Logout */}
      <div className="absolute bottom-5  pt-4 px-2">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-15 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-semibold text-white transition-all"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
