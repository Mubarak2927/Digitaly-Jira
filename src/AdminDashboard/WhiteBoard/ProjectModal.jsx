// src/Pages/WhiteBoard/ProjectModals.jsx
import React from "react";
import Modal from "../../Components/Modal";
import MemberModal from "../../Components/MemberModal";

const ProjectModals = ({
  showSidebarProjectModal,
  setShowSidebarProjectModal,
  showAddMemberModal,
  setShowAddMemberModal,
  showAddColumnModal,
  setShowAddColumnModal,
  handleAddSidebarProject,
  handleAddMember,
  handleAddColumn,
  users,
  newProject,
  setNewProject,
  newColumnTitle,
  setNewColumnTitle,
}) => {
  return (
    <>
      {/* Create Project Modal */}
      {showSidebarProjectModal && (
        <Modal
          onCancel={() => setShowSidebarProjectModal(false)}
          onConfirm={handleAddSidebarProject}
        >
          {/* reuse your same create project form here */}
          {/* keep form part same as before */}
        </Modal>
      )}

      {/* Add Member Modal */}
      {showAddMemberModal && (
        <MemberModal
          onClose={() => setShowAddMemberModal(false)}
          onAddMember={handleAddMember}
        />
      )}

      {/* Add Column Modal */}
      {showAddColumnModal && (
        <Modal
          onCancel={() => setShowAddColumnModal(false)}
          onConfirm={handleAddColumn}
        >
          <div className="flex flex-col gap-4 text-white">
            <h2 className="text-center text-xl font-semibold text-purple-400">
              Add New Column
            </h2>
            <input
              type="text"
              placeholder="Enter column name..."
              className="p-3 rounded-lg bg-gray-900 border border-gray-700 focus:border-purple-500 outline-none"
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
            />
          </div>
        </Modal>
      )}
    </>
  );
};

export default ProjectModals;
