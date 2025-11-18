import React, { useState } from "react";
import { X, User, Mail, MapPin, Phone } from "lucide-react";

const EmployeeProfile = () => {
  const [showModal, setShowModal] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
    blood_group: "",
    experience: "",
    address: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = () => {
    if (
      !formData.name ||
      !formData.role ||
      !formData.email ||
      !formData.phone ||
      !formData.blood_group ||
      !formData.experience ||
      !formData.address
    ) {
      alert("Please fill out all fields");
      return;
    }

    // Save profile
    setEmployees([...employees, formData]);
    setShowModal(false);
    setFormData({
      name: "",
      role: "",
      email: "",
      phone: "",
      blood_group: "",
      experience: "",
      address: "",
    });
  };

  return (
    <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-lg w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-semibold text-blue-400 text-center sm:text-left">
          Employee Profiles
        </h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 px-5 py-2 rounded-lg hover:bg-blue-700 transition text-white"
        >
          + Create Profile
        </button>
      </div>

      {employees.length === 0 ? (
        <p className="text-gray-400 text-center py-10">No profiles yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {employees.map((emp, idx) => (
            <div
              key={idx}
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
                  <p className="text-sm text-gray-400">{emp.role}</p>
                </div>
              </div>

              <div className="space-y-2 text-white text-sm">
                <p className="flex items-center gap-2">
                  <Mail size={16} className="text-blue-400" />: {emp.email}
                </p>
                <p className="flex items-center gap-2"><Phone size={16}/>: {emp.phone}</p>
                <p className="flex items-center gap-2 text-sm text-white">Blood group: <span>{emp.blood_group}</span></p>
                <p className="flex items-center gap-2">
                  💼 :{emp.experience} years
                </p>
                <p className="flex items-center gap-2">
                  <MapPin size={16} className="text-blue-400" />    : {emp.address}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 px-3">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-lg relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
            >
              <X size={22} />
            </button>

            <h3 className="text-xl font-semibold text-blue-400 mb-4 text-center">
              Add Employee Profile
            </h3>

            {/* Form */}
            <div className="space-y-3">
  {/* Name */}
  <div>
    <label className="text-sm text-gray-300">Name</label>
    <input
      type="text"
      name="name"
      value={formData.name}
      onChange={handleChange}
      placeholder="Enter name"
      className="w-full mt-1 p-2 rounded-md bg-gray-800 text-gray-200 border border-gray-700 focus:border-blue-500 focus:outline-none"
    />
  </div>

  {/* Email */}
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

  {/* Role */}
  <div>
    <label className="text-sm text-gray-300">Role</label>
    <input
      type="text"
      name="role"
      value={formData.role}
      onChange={handleChange}
      placeholder="Enter role"
      className="w-full mt-1 p-2 rounded-md bg-gray-800 text-gray-200 border border-gray-700 focus:border-blue-500 focus:outline-none"
    />
  </div>

  {/* Phone */}
  <div>
    <label className="text-sm text-gray-300">Phone</label>
    <input
      type="tel"
      name="phone"
      value={formData.phone}
      onChange={(e) => {
        const value = e.target.value.replace(/[^0-9]/g, ""); // restrict to numbers
        handleChange({ target: { name: "phone", value } });
      }}
      placeholder="Enter phone number"
      className="w-full mt-1 p-2 rounded-md bg-gray-800 text-gray-200 border border-gray-700 focus:border-blue-500 focus:outline-none"
    />
  </div>

  {/* Blood Group */}
  <div>
    <label className="text-sm text-gray-300">Blood Group</label>
    <input
      type="text"
      name="blood_group"
      value={formData.blood_group}
      onChange={handleChange}
      placeholder="Enter blood group"
      className="w-full mt-1 p-2 rounded-md bg-gray-800 text-gray-200 border border-gray-700 focus:border-blue-500 focus:outline-none"
    />
  </div>

  {/* Experience */}
  <div>
    <label className="text-sm text-gray-300">Experience (years)</label>
    <input
      type="number"
      name="experience"
      value={formData.experience}
      onChange={handleChange}
      placeholder="Enter years of experience"
      className="w-full mt-1 p-2 rounded-md bg-gray-800 text-gray-200 border border-gray-700 focus:border-blue-500 focus:outline-none"
    />
  </div>

  {/* Address */}
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
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-800 rounded-md text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white"
              >
                Add Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeProfile;
