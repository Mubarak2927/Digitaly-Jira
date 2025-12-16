import React, { useState, useRef } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import { Trash, Trash2 } from "lucide-react";

const BulkAPI = axios.create({
  baseURL: "https://project-management-sfrn.onrender.com/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});
BulkAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token"); // 👈 token key
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default function ProjectModal({
  newProject,
  setNewProject,
  onCancel,
  onConfirm,
}) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleBulkUpload = async () => {
    if (!file) return alert("Please select Excel file");

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      await BulkAPI.post("/bulk-import/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Projects created successfully");

      handleRemoveFile(); 
      onConfirm(); 
    } catch (error) {
      console.error(error);
      alert("Bulk upload failed ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col text-white max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 p-4">
      <h1 className="text-center text-2xl font-bold bg-clip-text text-transparent bg-linear-to-tr from-[#300181] via-[#6915cf] to-[#d62196] mb-6">
        Create New Project
      </h1>

      <div className="flex flex-col divide-y divide-gray-800">
        {/* -------- 1️⃣ Basic Details -------- */}
        <div className="space-y-5 pb-6">
          <h2 className="text-lg font-semibold text-blue-400">Basic Details</h2>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-300">Project Name</label>
            <input
              type="text"
              className="p-3 rounded-lg bg-gray-900 border border-gray-700"
              value={newProject.name}
              onChange={(e) =>
                setNewProject({ ...newProject, name: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-300">Project Key</label>
            <input
              type="text"
              className="p-3 rounded-lg bg-gray-900 border border-gray-700"
              value={newProject.key}
              onChange={(e) =>
                setNewProject({ ...newProject, key: e.target.value })
              }
            />
          </div>
        </div>

        {/* -------- 2️⃣ Description -------- */}
        <div className="py-5">
          <h2 className="text-lg font-semibold text-pink-400">Description</h2>

          <textarea
            className="p-3 rounded-lg w-full mt-3 bg-gray-900 border resize-none h-28"
            value={newProject.description}
            onChange={(e) =>
              setNewProject({
                ...newProject,
                description: e.target.value,
              })
            }
          />
        </div>

        {/* -------- 3️⃣ Bulk Upload -------- */}
        <div className="space-y-5 pt-6">
          <h2 className="text-lg font-semibold text-green-400">
            Upload File for Create Project
          </h2>

          {/* File Input */}
          <div className="flex flex-col gap-3">
            <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => setFile(e.target.files[0])}
            className="text-sm text-gray-300 hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="bg-blue-600 p-1 rounded-lg hover:bg-blue-700"
          >
            Choose Excel File
          </button>
          </div>

          {/* Selected File Preview */}
          {file && (
            <div className="flex items-center justify-between bg-gray-800 px-3 py-2 rounded-lg">
              <span className="text-sm text-gray-200 truncate">
                {file.name}
              </span>

              <button
                onClick={handleRemoveFile}
                className="text-red-400 hover:text-red-500 text-sm"
              >
                <Trash2 size={15} className="cursor-pointer hover:scale-110" />
              </button>
            </div>
          )}

          <button
            className="bg-green-600 px-1 py-2 rounded-lg"
            onClick={handleBulkUpload}
            disabled={loading || !file}
          >
            {loading ? "Creating..." : "Upload File"}
          </button>
        </div>
      </div>
    </div>
  );
}
