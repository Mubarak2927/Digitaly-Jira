import { Circle } from "lucide-react";
import React, { useState } from "react";

const EmployeeProfilePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [employeeList, setEmployeeList] = useState([]);
  const submitEmployee = () => {
  setEmployeeList((prev) => [...prev, employee]);   // SAVE to list
  setShowModal(false);

  // form reset
  setEmployee({
    emp_id: "",
    first_name: "",
    last_name: "",
    email: "",
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
      manager_id: "",
      employment_type: "",
      experience_level: "",
      skills: [],
    },
    payroll_group: "MONTHLY",
  });
};


  const [employee, setEmployee] = useState({
    emp_id: "",
    first_name: "",
    last_name: "",
    email: "",
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
      manager_id: "",
      employment_type: "",
      experience_level: "",
      skills: [],
    },
    payroll_group: "MONTHLY",
  });
  

  const handleChange = (e, parent, child, subChild) => {
    const value = e.target.value;

    if (parent && child && subChild) {
      setEmployee((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: {
            ...prev[parent][child],
            [subChild]: value,
          },
        },
      }));
    } else if (parent && child) {
      setEmployee((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setEmployee((prev) => ({
        ...prev,
        [e.target.name]: value,
      }));
    }
  };

  // const submitEmployee = () => {
  //   console.log("EMPLOYEE DATA:", employee);

  //   // 🔥 API CALL Example
  //   // axios.post("/api/employees", employee)

  //   setShowModal(false);
  // };

  return (


    
    <div className="">
      <div className="flex justify-between">
      <h1 className="text-3xl text-black font-bold mb-4">Employee Profile</h1>
        <div>
           <button
        className="px-4 py-2 bg-blue-600 text-white rounded shadow"
        onClick={() => setShowModal(true)}
      >
        Create Profile
      </button>
        </div>
      </div>
      {/* ====================== MODAL ======================= */}
      {showModal && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div className="bg-gray-900 w-full max-w-3xl rounded-2xl shadow-xl p-6 overflow-y-auto max-h-[90vh]">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold ">Create Employee Profile</h2>
        <button
          onClick={() => setShowModal(false)}
          className="cursor-pointer font-bold border rounded-full hover:bg-red-600 px-2 text-2xl hover:scale-105"
        >
          X
        </button>
        
      </div>
      {/* SECTION CARD */}
      <div className="space-y-6">

        {/* BASIC INFO */}
        <div className="border rounded-xl p-4 shadow-md">
          <h3 className="font-semibold text-lg mb-3 text-blue-700">Basic Information</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Employee ID</label>
              <input
                type="text"
                name="emp_id"
                className="mt-1 border p-2 rounded w-full"
                value={employee.emp_id}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="text-sm font-medium">First Name</label>
              <input
                type="text"
                name="first_name"
                className="mt-1 border p-2 rounded w-full"
                value={employee.first_name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Last Name</label>
              <input
                type="text"
                name="last_name"
                className="mt-1 border p-2 rounded w-full"
                value={employee.last_name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                className="mt-1 border p-2 rounded w-full"
                value={employee.email}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* PERSONAL INFO */}
        <div className="border rounded-xl p-4 shadow-md">
          <h3 className="font-semibold text-lg mb-3 text-blue-700">Personal Information</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Date of Birth</label>
              <input
                type="date"
                className="mt-1 border p-2 rounded w-full"
                value={employee.personal_info.date_of_birth}
                onChange={(e) => handleChange(e, "personal_info", "date_of_birth")}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Phone Number</label>
              <input
                type="text"
                className="mt-1 border p-2 rounded w-full"
                value={employee.personal_info.phone_number}
                onChange={(e) => handleChange(e, "personal_info", "phone_number")}
              />
            </div>

            <div className="col-span-2">
              <label className="text-sm font-medium">Address</label>
              <input
                type="text"
                className="mt-1 border p-2 rounded w-full"
                value={employee.personal_info.address}
                onChange={(e) => handleChange(e, "personal_info", "address")}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Gender</label>
              <select
                className="mt-1 border bg-gray-900   p-2 rounded w-full"
                value={employee.personal_info.gender}
                onChange={(e) => handleChange(e, "personal_info", "gender")}
              >
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Others</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Marital Status</label>
              <select
                className="mt-1 border bg-gray-900 p-2 rounded w-full"
                value={employee.personal_info.marital_status}
                onChange={(e) => handleChange(e, "personal_info", "marital_status")}
              >
                <option value="">Select</option>
                <option>Single</option>
                <option>Married</option>
              </select>
            </div>
          </div>
        </div>

        {/* WORK INFO */}
        <div className="border rounded-xl p-4 shadow-md">
          <h3 className="font-semibold text-lg mb-3 text-blue-700">Work Information</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Department</label>
              <input
                type="text"
                className="mt-1 border p-2 rounded w-full"
                value={employee.work_info.department}
                onChange={(e) => handleChange(e, "work_info", "department")}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Designation</label>
              <input
                type="text"
                className="mt-1 border p-2 rounded w-full"
                value={employee.work_info.designation}
                onChange={(e) => handleChange(e, "work_info", "designation")}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Date Joined</label>
              <input
                type="date"
                className="mt-1 border p-2 rounded w-full"
                value={employee.work_info.date_joined}
                onChange={(e) => handleChange(e, "work_info", "date_joined")}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Manager ID</label>
              <input
                type="text"
                className="mt-1 border p-2 rounded w-full"
                value={employee.work_info.manager_id}
                onChange={(e) => handleChange(e, "work_info", "manager_id")}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Employment Type</label>
              <select
                className="mt-1 bg-gray-900  border p-2 rounded w-full"
                value={employee.work_info.employment_type}
                onChange={(e) => handleChange(e, "work_info", "employment_type")}
              >
                <option value="">Select</option>
                <option>Full-Time</option>
                <option>Part-Time</option>
                <option>Internship</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Experience Level</label>
              <select
                className="mt-1 border bg-gray-900  p-2 rounded w-full"
                value={employee.work_info.experience_level}
                onChange={(e) => handleChange(e, "work_info", "experience_level")}
              >
                <option value="">Select</option>
                <option>Junior</option>
                <option>Mid</option>
                <option>Senior</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="text-sm font-medium">Skills</label>
              <input
                type="text"
                className="mt-1 border p-2 rounded w-full"
                placeholder="e.g., React, Node, SQL"
                onChange={(e) =>
                  setEmployee((prev) => ({
                    ...prev,
                    work_info: {
                      ...prev.work_info,
                      skills: e.target.value.split(","),
                    },
                  }))
                }
              />
            </div>
          </div>
        </div>

        {/* PAYROLL */}
        <div className="border rounded-xl p-4 shadow-md">
          <h3 className="font-semibold text-lg mb-3 text-blue-700">Payroll</h3>

          <select
            className="border p-2 bg-gray-900  rounded w-full"
            value={employee.payroll_group}
            onChange={(e) =>
              setEmployee((prev) => ({
                ...prev,
                payroll_group: e.target.value,
              }))
            }
          >
            <option value="MONTHLY">MONTHLY</option>
            <option value="WEEKLY">WEEKLY</option>
          </select>
        </div>
      </div>

      {/* BUTTONS */}
      <div className="flex justify-end gap-3 mt-6">
        <button
          className="px-4 py-2 border rounded hover:bg-gray-100"
          onClick={() => setShowModal(false)}
        >
          Cancel
        </button>

        <button
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          onClick={submitEmployee}
        >
          Save Employee
        </button>
      </div>
    </div>
  </div>
)}
<div className="mt-6">
  <h2 className="text-xl font-bold mb-3">Employee List</h2>

  {employeeList.length === 0 ? (
    <p className="text-gray-400 text-center">No employees found.</p>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {employeeList.map((emp, index) => (
        <div
          key={index}
          className="bg-gray-800 backdrop-blur-md border border-gray-700 p-4 rounded-xl shadow hover:shadow-xl transition"
        >
          <div className="flex items-center gap-3">
           
            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
              {emp.first_name.charAt(0)}{emp.last_name.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-lg">{emp.first_name} {emp.last_name}</p>
            <p className="text-xs ">{emp.work_info.designation }</p>
            </div>
             <button className="absolute right-5 bottom-5 text-sm">view details</button>
          </div>

          <div className="mt-3 text-sm text-gray-300 space-y-1">
            <p><strong>ID:</strong> {emp.emp_id}</p>
            <p><strong>Email:</strong> {emp.email}</p>
            <p><strong>Department:</strong> {emp.work_info.department}</p>
          </div>
        </div>
      ))}
    </div>
  )}
</div>



    </div>
  );
};

export default EmployeeProfilePage;

