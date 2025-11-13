// src/Pages/WhiteBoard/EmployeeSections.jsx
import React from "react";
import EmployeeProfile from "../Components/EmployeeProfile";
import LeaveManagement from "../Components/LeaveManagement";
import Attendance from "../Components/Attendance";
import ArchivedPage from "../Components/ArchivedPage";
import GoalsPage from "../Components/GoalsPage";

const EmployeeSections = ({ activeEmployeeSection, activeTab }) => {
  return (
    <>
      {activeEmployeeSection === "profile" && <EmployeeProfile />}
      {activeEmployeeSection === "leave" && <LeaveManagement />}
      {activeEmployeeSection === "attendance" && <Attendance />}
      {activeTab === "goals" && <GoalsPage />}
      {activeTab === "archived" && <ArchivedPage />}
    </>
  );
};

export default EmployeeSections;
