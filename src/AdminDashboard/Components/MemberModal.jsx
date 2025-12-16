import React, { useState } from "react";
import Modal from "./Modal";

const MemberModal = ({ onClose, onAddMember }) => {
  const [newMemberId, setNewMemberId] = useState("");
  const [error, setError] = useState("");

  const handleAddMember = async () => {
    const trimmedId = newMemberId.trim();
    if (!trimmedId) {
      setError("Please enter a valid user ID.");
      return;
    }

    setError("");
    try {
      await onAddMember(trimmedId);
      setNewMemberId("");
      onClose();
    } catch (err) {
      setError(err.message || "Failed to add member.");
    }
  };

  return (
    <Modal onCancel={onClose} onConfirm={handleAddMember}>
      <div className="flex flex-col gap-4 text-white w-full max-w-md mx-auto px-3 sm:px-6">
        {/* Title */}
        <h2 className="text-lg sm:text-xl font-semibold text-center sm:text-left">
          Add New Member
        </h2>

        {/* Input Field */}
        <input
          type="text"
          placeholder="Enter user ID"
          className="w-full p-2 sm:p-3 rounded-lg bg-gray-900 border border-gray-700 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          value={newMemberId}
          onChange={(e) => setNewMemberId(e.target.value)}
        />

        {/* Error Message */}
        {error && (
          <div className="text-red-400 text-xs sm:text-sm text-center sm:text-left">
            {error}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default MemberModal;
