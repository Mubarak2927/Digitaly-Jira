// import React, { useState } from "react";

// export default function MemberModal({ onClose, onAddMember }) {
//   const [newMemberName, setNewMemberName] = useState("");

//   const handleAdd = () => {
//     onAddMember(newMemberName);
//     onClose();
//     setNewMemberName("");
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
//       <div className="bg-gray-900 p-6 rounded-2xl w-96 border border-gray-700 shadow-2xl">
//         <h2 className="text-xl font-semibold mb-4 text-white">Add New Member</h2>

//         <select
//           value={newMemberName}
//           onChange={(e) => setNewMemberName(e.target.value)}
//           className="w-full mb-5 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white"
//         >
//           <option value="">Select Member</option>
//           <option value="Employee 1">Employee 1</option>
//           <option value="Employee 2">Employee 2</option>
//           <option value="Employee 3">Employee 3</option>
//           <option value="Employee 4">Employee 4</option>
//           <option value="Employee 5">Employee 5</option>
//         </select>

//         <div className="flex justify-end gap-3">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-white"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleAdd}
//             className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm text-white"
//           >
//             Add
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }



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
