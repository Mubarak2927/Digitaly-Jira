import React, { useState } from "react";
import { X, User, Mail, MapPin } from "lucide-react";

const EmployeeProfile = () => {
  const [showModal, setShowModal] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    email: "",
    address: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = () => {
    if (!formData.name || !formData.role || !formData.email)
      return alert("Please fill all required fields");

    setEmployees([...employees, formData]);
    setShowModal(false);
    setFormData({ name: "", role: "", email: "", address: "" });
  };

  return (
    <div className="bg-gray-900 p-4 sm:p-6 rounded-xl border border-gray-800 shadow-lg w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-semibold text-blue-400 text-center sm:text-left">
          Employee Profiles
        </h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer hover:scale-105 transition text-sm sm:text-base w-full sm:w-auto"
        >
          + Create Profile
        </button>
      </div>

      {/* Employee Grid */}
      {employees.length === 0 ? (
        <p className="text-gray-400 text-center py-10">No profiles yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {employees.map((emp, index) => (
            <div
              key={index}
              className="bg-gray-800 border border-gray-700 p-4 rounded-xl hover:shadow-lg hover:border-blue-500 transition"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-blue-600/20 p-3 rounded-full flex items-center justify-center">
                  <User className="text-blue-400" size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white break-words">
                    {emp.name}
                  </h3>
                  <p className="text-sm text-gray-400 break-words">
                    {emp.role}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-gray-400 text-sm break-words">
                <p className="flex items-center gap-2">
                  <Mail size={16} className="text-blue-400" />
                  {emp.email}
                </p>
                {emp.address && (
                  <p className="flex items-center gap-2">
                    <MapPin size={16} className="text-blue-400" />
                    {emp.address}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 px-3">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-lg relative animate-fadeIn">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
            >
              <X size={22} />
            </button>

            <h3 className="text-xl font-semibold text-blue-400 mb-4 text-center sm:text-left">
              Create Employee Profile
            </h3>

            {/* Form */}
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-300">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  className="w-full mt-1 p-2 rounded-md bg-gray-800 text-gray-200 border border-gray-700 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-gray-300">Role</label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  placeholder="e.g. Frontend Developer"
                  className="w-full mt-1 p-2 rounded-md bg-gray-800 text-gray-200 border border-gray-700 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-gray-300">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  className="w-full mt-1 p-2 rounded-md bg-gray-800 text-gray-200 border border-gray-700 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-gray-300">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter address"
                  className="w-full mt-1 p-2 rounded-md bg-gray-800 text-gray-200 border border-gray-700 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-800 text-sm rounded-md transition w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-sm rounded-md text-white transition w-full sm:w-auto"
              >
                Save Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeProfile;
