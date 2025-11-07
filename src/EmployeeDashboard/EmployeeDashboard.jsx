import React, { useState } from "react";
import Sidebar from "./components/EmployeeSidebar";
import DashboardCard from "./components/DashboardCard";
import Topbar from "./components/TopBar";
import EmployeeProjects from "./components/EmployeeProjects";
import EmployeeAttendance from "./components/EmployeeAttendance";
import { User, Clock, CheckCircle, Folder } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState("Dashboard");

  const handleLogout = () => {
    navigate("/");
  };

  const cards = [
    { title: "Total Projects", value: "22", icon: <Folder size={28} /> },
    { title: "Tasks Completed", value: "100%", icon: <CheckCircle size={28} /> },
    { title: "Attendance", value: "100%", icon: <Clock size={28} /> },
  ];

  const renderPage = () => {
    switch (active) {
      case "Dashboard":
        return (
          <div className="p-8 space-y-8">
            <h1 className="text-3xl font-bold text-white">Overview</h1>
            <div className="grid grid-cols-1 text-white sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards.map((card, i) => ( 
              <DashboardCard key={i} {...card} />
              ))}
            </div>
          </div>
        );

      case "Projects":
        return <EmployeeProjects />;

      case "Attendance":
        return <EmployeeAttendance />;

     

      default:
        return null;
    }
  };

  return (
    <div className="flex bg-black min-h-screen">
      <Sidebar active={active} setActive={setActive} onLogout={handleLogout} />

      <div className="flex-1 flex flex-col">
        <Topbar />
        {renderPage()}
      </div>
    </div>
  );
};

export default EmployeeDashboard;
