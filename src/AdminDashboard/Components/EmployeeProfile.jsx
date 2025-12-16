import React, { useState, useEffect } from "react";
import { getAllEmployeesList, createEmployee } from "../../Api/projectAPI";

const EmployeePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeList, setEmployeeList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [employee, setEmployee] = useState({
    emp_id: "",
    full_name: "",
    email: "",
    password: "",
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
  setLoading(true);
  try {
    const newEmployee = await createEmployee(employee); // capture the created employee
    toast.success('Employee Created Successfully');

    // Update state immediately
    setEmployeeList(prev => [...prev, newEmployee]);

    // Reset form
    setEmployee({
      emp_id: "",
      full_name: "",
      email: "",
      password: "",
      payroll_group: "MONTHLY"
    });
  } catch (err) {
    console.log(err);
    toast.error('Failed to create employee');
  } finally {
    setShowModal(false);
    setLoading(false);
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
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-300 space-y-2">
              <p>
                <strong className="text-gray-200">ID:</strong> {emp.emp_id}
              </p>
              <p>
                <strong className="text-gray-200">Email:</strong> {emp.email}
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
    {/* Create Modal */}
{showModal && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
    <div className="bg-white p-6 w-full max-w-md rounded-xl shadow-xl">
      <h2 className="text-lg text-black font-semibold mb-4">Create Employee</h2>

      <div className="grid grid-cols-1 gap-3 text-black">
        <label>Employee ID</label>
        <input
          type="text"
          placeholder="Employee ID"
          className="px-3 py-2 border rounded"
          value={employee.emp_id}
          onChange={(e) =>
            setEmployee({ ...employee, emp_id: e.target.value })
          }
        />

        <label>Full Name</label>
        <input
          type="text"
          placeholder="Full Name"
          className="px-3 py-2 border rounded"
          value={employee.full_name}
          onChange={(e) =>
            setEmployee({ ...employee, full_name: e.target.value })
          }
        />

        <label>Email</label>
        <input
          type="email"
          placeholder="Email"
          className="px-3 py-2 border rounded"
          value={employee.email}
          onChange={(e) =>
            setEmployee({ ...employee, email: e.target.value })
          }
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Password"
          className="px-3 py-2 border rounded"
          value={employee.password}
          onChange={(e) =>
            setEmployee({ ...employee, password: e.target.value })
          }
        />
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
  disabled={loading}
  className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 text-white"
>
  {loading ? 'Creating...' : 'Create'}
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
