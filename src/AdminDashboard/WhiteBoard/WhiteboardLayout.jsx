// src/Pages/WhiteBoard/WhiteboardLayout.jsx
import React from "react";
import Sidebar from "../Components/Sidebar";
import AdminTopBar from "../Components/AdminTopBar";
import Tabs from "../Components/Tabs";
import ProjectSummary from "../Components/ProjectSummary";
import BoardView from "../Components/BoardView";
import ListsView from "../Components/ListsView";
import ProductBacklog from "../Components/ProductBacklog";
import { Hand, File } from "lucide-react";

const WhiteboardLayout = (props) => {
  const {
    projects,
    setProjects,
    selectedProject,
    setSelectedProject,
    activeTab,
    setActiveTab,
    activeEmployeeSection,
    setActiveEmployeeSection,
    onSelectProject,
    setShowSidebarProjectModal,
  } = props;

  return (
    <div className="flex flex-col bg-black text-white h-screen">
      <div className="sticky top-0 z-50 w-full">
        <AdminTopBar />
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-gray-950 border-r border-gray-800">
          <Sidebar
            projects={projects}
            setProjects={setProjects}
            onAddProjectClick={() => setShowSidebarProjectModal(true)}
            onSelectProject={onSelectProject}
            selectedId={selectedProject?.id}
            onSelectEmployeeSection={setActiveEmployeeSection}
          />
        </div>

        {/* Main Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          {selectedProject && !activeEmployeeSection && (
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold capitalize">
                  {selectedProject.name}
                </h1>
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

          {/* No project selected */}
          {!selectedProject && !activeEmployeeSection && (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center text-lg animate-fadeIn">
              <div className="flex flex-wrap justify-center items-center gap-2 text-white text-2xl">
                <span className="animate-float text-blue-500 drop-shadow-lg">
                  <Hand size={50} />
                </span>
                <span className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent animate-glow">
                  Create a
                </span>
                <span className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent animate-glow">
                  New Project
                </span>
                <span className="text-purple-400 animate-pulse">
                  <File size={50} />
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WhiteboardLayout;
