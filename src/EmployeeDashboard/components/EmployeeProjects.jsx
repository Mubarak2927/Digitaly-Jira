import React, { useState } from "react";
import { motion } from "framer-motion";
import { FolderKanban, Calendar, Users, Clock, Plus } from "lucide-react";
import Tabs from "../Components/Tabs";

const EmployeeProjects = () => {
  const [activeTab, setActiveTab] = useState("summary");

  const projects = [
    {
      id: 1,
      name: "Jira Clone",
      deadline: "2025-12-30",
      members: 5,
      progress: 75,
      status: "In Progress",
    },
    {
      id: 2,
      name: "E-commerce Dashboard",
      deadline: "2025-11-20",
      members: 3,
      progress: 45,
      status: "Pending",
    },
    {
      id: 3,
      name: "AI Chat Assistant",
      deadline: "2026-01-10",
      members: 6,
      progress: 90,
      status: "Completed",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-950 via-gray-900 to-gray-800 text-white p-6 md:p-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold tracking-wide">My Projects</h1>
        
      </div>

      {/* Tabs */}
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Projects Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
      >
        {projects.map((proj, i) => (
          <motion.div
            key={proj.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.03 }}
            className="relative bg-gray-900/60 border border-gray-800 rounded-2xl p-6 shadow-[0_0_30px_rgba(37,99,235,0.15)] hover:shadow-[0_0_40px_rgba(37,99,235,0.3)] transition-all overflow-hidden"
          >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-linear-to-br from-blue-600/10 to-indigo-600/10 blur-2xl opacity-40 pointer-events-none"></div>

            {/* Project Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <FolderKanban className="text-blue-500" size={20} />
                {proj.name}
              </h2>
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  proj.status === "Completed"
                    ? "bg-green-600/30 text-green-400"
                    : proj.status === "In Progress"
                    ? "bg-blue-600/30 text-blue-400"
                    : "bg-yellow-600/30 text-yellow-400"
                }`}
              >
                {proj.status}
              </span>
            </div>

            {/* Details */}
            <div className="space-y-3 text-gray-300 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="text-indigo-400" size={16} />
                <span>Deadline: {proj.deadline}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="text-pink-400" size={16} />
                <span>Members: {proj.members}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="text-yellow-400" size={16} />
                <span>Progress: {proj.progress}%</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-700 h-2 rounded-full mt-4">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  proj.progress < 50
                    ? "bg-red-500"
                    : proj.progress < 80
                    ? "bg-yellow-400"
                    : "bg-green-500"
                }`}
                style={{ width: `${proj.progress}%` }}
              ></div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default EmployeeProjects;
