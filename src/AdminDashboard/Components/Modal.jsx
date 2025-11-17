import React from "react";

const Modal = ({ title, children, onCancel, onConfirm }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4 sm:p-0">
      <div className="bg-gray-900 p-5 sm:p-6 rounded-2xl w-full max-w-sm sm:max-w-md shadow-lg border border-gray-800">
        {/* Title */}
        {title && (
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-white text-center sm:text-left">
            {title}
          </h2>
        )}

        {/* Modal Body */}
        <div className="mb-6">{children}</div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <button
            onClick={onCancel}
            className="w-full sm:w-auto px-4 py-2 bg-gray-700 font-bold hover:bg-gray-600 rounded-lg text-sm text-white transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="w-full sm:w-auto px-4 py-2 bg-green-600 font-bold hover:bg-blue-500 rounded-lg text-sm text-white transition-all"
          >
            Create 
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
