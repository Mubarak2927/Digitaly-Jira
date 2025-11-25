import React, { useState, useEffect } from "react";
import { getAllEmployeesList, createEmployee } from "../../Api/projectAPI";

const EmployeePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeList, setEmployeeList] = useState([]);

  const [employee, setEmployee] = useState({
    emp_id: "",
    full_name: "",
    email: "",
    password: "",
    personal_info: {
      date_of_birth: "",
      phone_number: "",
      address: "",
      gender: "",
      marital_status: "",
      emergency_contact: {
        name: "",
        phone_number: "",
        relationship: "",
      },
      profile_image: "",
    },
    work_info: {
      department: "",
      designation: "",
      date_joined: "",
      employment_type: "",
      experience_level: "",
      skills: [],
    },
    payroll_group: "MONTHLY",
  });

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const data = await getAllEmployeesList();
      setEmployeeList(data);
    } catch (err) {
      console.log("Error loading employees", err);
    }
  };

  const submitEmployee = async () => {
    try {
      await createEmployee(employee);
      setShowModal(false);
      await loadEmployees();
      // reset form
      setEmployee({
        emp_id: "",
        full_name: "",
        email: "",
        password: "",
        personal_info: {
          date_of_birth: "",
          phone_number: "",
          address: "",
          gender: "",
          marital_status: "",
          emergency_contact: { name: "", phone_number: "", relationship: "" },
          profile_image: "",
        },
        work_info: {
          department: "",
          designation: "",
          date_joined: "",
          employment_type: "",
          experience_level: "",
          skills: [],
        },
        payroll_group: "MONTHLY",
      });
    } catch (error) {
      console.log("Error creating employee", error);
    }
  };

  return (
    <div className="p-6 lg:p-10 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-black">Employee Profile</h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Create Employee
        </button>
      </div>

      {/* Employee Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employeeList.map((emp, index) => (
          <div
            key={index}
            className="bg-gray-900 p-5 rounded-2xl shadow-lg/60  hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 backdrop-blur-md"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                {emp.full_name?.charAt(0)?.toUpperCase()}
              </div>

              <div>
                <p className="font-semibold text-lg bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                  {emp.full_name}
                </p>
                <p className="text-xs text-gray-400">
                  {emp.work_info?.designation || "—"}
                </p>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-300 space-y-2">
              <p>
                <strong className="text-gray-200">ID:</strong> {emp.emp_id}
              </p>
              <p>
                <strong className="text-gray-200">Email:</strong> {emp.email}
              </p>
              <p>
                <strong className="text-gray-200">Department:</strong>{" "}
                {emp.work_info?.department || "—"}
              </p>
            </div>

            <button
              onClick={() => {
                setSelectedEmployee(emp);
                setViewModal(true);
              }}
              className="mt-5 w-full text-center cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90 transition"
            >
              View Details
            </button>
          </div>
        ))}
      </div>  
      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-6 w-full max-w-lg rounded-xl shadow-xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-lg text-black font-semibold mb-4">Create Employee</h2>

            <div className="grid grid-cols-1 gap-3 text-black">
              <label htmlFor="">Employee ID</label>
              <input
                type="text"
                placeholder="Employee ID"
                className="px-3 py-2 border rounded"
                value={employee.emp_id}
                onChange={(e) =>
                  setEmployee({ ...employee, emp_id: e.target.value })
                }
              />
              <label htmlFor="">Full Name</label>
              <input
                type="text"
                placeholder="Full Name"
                className="px-3 py-2 border rounded"
                value={employee.full_name}
                onChange={(e) =>
                  setEmployee({ ...employee, full_name: e.target.value })
                }
              />
              <label htmlFor="">Email</label>
              <input
                type="email"
                placeholder="Email"
                className="px-3 py-2 border rounded"
                value={employee.email}
                onChange={(e) =>
                  setEmployee({ ...employee, email: e.target.value })
                }
              />
              <label htmlFor="">Password</label>
              <input
                type="password"
                placeholder="Password"
                className="px-3 py-2 border rounded"
                value={employee.password}
                onChange={(e) =>
                  setEmployee({ ...employee, password: e.target.value })
                }
              />
              <label htmlFor="">Date of Birth</label>
              <input
                type="date"
                placeholder="Date of Birth"
                className="px-3 py-2 border rounded"
                value={employee.personal_info.date_of_birth}
                onChange={(e) =>
                  setEmployee({
                    ...employee,
                    personal_info: {
                      ...employee.personal_info,
                      date_of_birth: e.target.value,
                    },
                  })
                }
              />
              <label htmlFor="">Phone Number</label>
              <input
                type="text"
                placeholder="Phone Number"
                className="px-3 py-2 border rounded"
                value={employee.personal_info.phone_number}
                onChange={(e) =>
                  setEmployee({
                    ...employee,
                    personal_info: {
                      ...employee.personal_info,
                      phone_number: e.target.value,
                    },
                  })
                }
              />
              <label htmlFor="">Address</label>
              <input
                type="text"
                placeholder="Address"
                className="px-3 py-2 border rounded"
                value={employee.personal_info.address}
                onChange={(e) =>
                  setEmployee({
                    ...employee,
                    personal_info: {
                      ...employee.personal_info,
                      address: e.target.value,
                    },
                  })
                }
              />
              <label htmlFor="">Gender</label>
              <select
                className="px-3 py-2 border rounded"
                value={employee.personal_info.gender}
                onChange={(e) =>
                  setEmployee({
                    ...employee,
                    personal_info: {
                      ...employee.personal_info,
                      gender: e.target.value,
                    },
                  })
                }
              >
                <option value="">Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Others</option>
              </select>
              <label htmlFor="">Marital Status</label>
              <select
                className="px-3 py-2 border rounded"
                value={employee.personal_info.marital_status}
                onChange={(e) =>
                  setEmployee({
                    ...employee,
                    personal_info: {
                      ...employee.personal_info,
                      marital_status: e.target.value,
                    },
                  })
                }
              >
                <option value="">Marital Status</option>
                <option>Single</option>
                <option>Married</option>
              </select>
<label htmlFor="">Emergency Contact Name</label>
              <input
                type="text"
                placeholder="Emergency Contact Name"
                className="px-3 py-2 border rounded"
                value={employee.personal_info.emergency_contact.name}
                onChange={(e) =>
                  setEmployee({
                    ...employee,
                    personal_info: {
                      ...employee.personal_info,
                      emergency_contact: {
                        ...employee.personal_info.emergency_contact,
                        name: e.target.value,
                      },
                    },
                  })
                }
              />
              <label htmlFor="">Emergency Contact Phone</label>
              <input
                type="text"
                placeholder="Emergency Contact Phone"
                className="px-3 py-2 border rounded"
                value={employee.personal_info.emergency_contact.phone_number}
                onChange={(e) =>
                  setEmployee({
                    ...employee,
                    personal_info: {
                      ...employee.personal_info,
                      emergency_contact: {
                        ...employee.personal_info.emergency_contact,
                        phone_number: e.target.value,
                      },
                    },
                  })
                }
              />
              <label htmlFor="">Emergency Contact Relationship</label>
              <input
                type="text"
                placeholder="Emergency Contact Relationship"
                className="px-3 py-2 border rounded"
                value={employee.personal_info.emergency_contact.relationship}
                onChange={(e) =>
                  setEmployee({
                    ...employee,
                    personal_info: {
                      ...employee.personal_info,
                      emergency_contact: {
                        ...employee.personal_info.emergency_contact,
                        relationship: e.target.value,
                      },
                    },
                  })
                }
              />
              <label htmlFor="">Profile Image</label>
              <input
                type="text"
                placeholder="Profile Image URL"
                className="px-3 py-2 border rounded"
                value={employee.personal_info.profile_image}
                onChange={(e) =>
                  setEmployee({
                    ...employee,
                    personal_info: {
                      ...employee.personal_info,
                      profile_image: e.target.value,
                    },
                  })
                }
              />
              <label htmlFor="">Department</label>
              <input
                type="text"
                placeholder="Department"
                className="px-3 py-2 border rounded"
                value={employee.work_info.department}
                onChange={(e) =>
                  setEmployee({
                    ...employee,
                    work_info: { ...employee.work_info, department: e.target.value },
                  })
                }
              />
              <label htmlFor="">Designation</label>
              <input
                type="text"
                placeholder="Designation"
                className="px-3 py-2 border rounded"
                value={employee.work_info.designation}
                onChange={(e) =>
                  setEmployee({
                    ...employee,
                    work_info: { ...employee.work_info, designation: e.target.value },
                  })
                }
              />
              <label htmlFor="">Date Joined</label>
              <input
                type="date"
                placeholder="Date Joined"
                className="px-3 py-2 border rounded"
                value={employee.work_info.date_joined}
                onChange={(e) =>
                  setEmployee({
                    ...employee,
                    work_info: { ...employee.work_info, date_joined: e.target.value },
                  })
                }
              />
              <label htmlFor="">Work Type</label>
              <select
                className="px-3 py-2 border rounded"
                value={employee.work_info.employment_type}
                onChange={(e) =>
                  setEmployee({
                    ...employee,
                    work_info: { ...employee.work_info, employment_type: e.target.value },
                  })
                }
              >
                <option value="">Employment Type</option>
                <option>Full-Time</option>
                <option>Part-Time</option>
                <option>Internship</option>
              </select>

              <label htmlFor="">Experience</label>
              <select
                className="px-3 py-2 border rounded"
                value={employee.work_info.experience_level}
                onChange={(e) =>
                  setEmployee({
                    ...employee,
                    work_info: { ...employee.work_info, experience_level: e.target.value },
                  })
                }
              >
                <option value="">Experience Level</option>
                <option>Junior</option>
                <option>Mid</option>
                <option>Senior</option>
              </select>

              <label htmlFor="">Skills</label>
              <input
                type="text"
                placeholder="Skills"
                className="px-3 py-2 border rounded"
                value={employee.work_info.skills.join(", ")}
                onChange={(e) =>
                  setEmployee({
                    ...employee,
                    work_info: {
                      ...employee.work_info,
                      skills: e.target.value.split(",").map((s) => s.trim()),
                    },
                  })
                }
              />

              <label htmlFor="">Payroll</label>
              <select
                className="px-3 py-2 border rounded"
                value={employee.payroll_group}
                onChange={(e) =>
                  setEmployee({ ...employee, payroll_group: e.target.value })
                }
              >
                <option value="MONTHLY">MONTHLY</option>
                <option value="WEEKLY">WEEKLY</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 text-white"
              >
                Cancel
              </button>
              <button
                onClick={submitEmployee}
                className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewModal && selectedEmployee && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
    <div className="bg-gray-800 w-full max-w-lg rounded-xl shadow-xl overflow-y-auto max-h-[90vh] p-6">
      {/* Header with profile image */}
      <div className="flex items-center gap-4 mb-6">  
        {/* <img
          src={selectedEmployee.personal_info?.profile_image}
          alt="Profile"
          className="w-20 h-20 rounded-full border-2 border-blue-500"
        /> */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white">
            {selectedEmployee.full_name}
          </h2>
          <p className="text-sm text-gray-300">{selectedEmployee.work_info?.designation}</p>
        </div>
        <button
          onClick={() => setViewModal(false)}
          className="text-white text-xl font-bold px-2 cursor-pointer hover:text-red-500"
        >
          X
        </button>
      </div>

      {/* Personal Info Section */}
      <div className="bg-gray-900 p-4 rounded-lg mb-4">
        <h3 className="font-semibold text-lg text-blue-400 mb-3">Personal Info</h3>
        <div className="grid grid-cols-1 gap-2 text-gray-200 text-sm">
          <p><strong>ID:</strong> {selectedEmployee.emp_id}</p>
          <p><strong>Email:</strong> {selectedEmployee.email}</p>
          <p><strong>Date of Birth:</strong> {selectedEmployee.personal_info?.date_of_birth}</p>
          <p><strong>Phone:</strong> {selectedEmployee.personal_info?.phone_number}</p>
          <p><strong>Address:</strong> {selectedEmployee.personal_info?.address}</p>
          <p><strong>Gender:</strong> {selectedEmployee.personal_info?.gender}</p>
          <p><strong>Marital Status:</strong> {selectedEmployee.personal_info?.marital_status}</p>
        </div>
      </div>

      {/* Work Info Section */}
      <div className="bg-gray-900 p-4 rounded-lg">
        <h3 className="font-semibold text-lg text-blue-400 mb-3">Work Info</h3>
        <div className="grid grid-cols-1 gap-2 text-gray-200 text-sm">
          <p><strong>Department:</strong> {selectedEmployee.work_info?.department}</p>
          <p><strong>Designation:</strong> {selectedEmployee.work_info?.designation}</p>
          <p><strong>Date Joined:</strong> {selectedEmployee.work_info?.date_joined}</p>
          <p><strong>Employment Type:</strong> {selectedEmployee.work_info?.employment_type}</p>
          <p><strong>Experience Level:</strong> {selectedEmployee.work_info?.experience_level}</p>
          <p><strong>Payroll:</strong> {selectedEmployee.payroll_group}</p>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default EmployeePage;
