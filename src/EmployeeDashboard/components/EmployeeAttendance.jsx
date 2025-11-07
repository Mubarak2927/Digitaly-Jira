import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as XLSX from "xlsx";

const EmployeeAttendance = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [leaveRecords, setLeaveRecords] = useState([]);

  const [formData, setFormData] = useState({
    leaveType: "",
    fromDate: "",
    toDate: "",
    reason: "",
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("leaveRecords")) || [];
    setLeaveRecords(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem("leaveRecords", JSON.stringify(leaveRecords));
  }, [leaveRecords]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newLeave = {
      id: Date.now(),
      ...formData,
      status: "Pending",
      appliedOn: new Date().toLocaleDateString(),
    };

    setLeaveRecords([...leaveRecords, newLeave]);
    setShowForm(false);
    setFormData({ leaveType: "", fromDate: "", toDate: "", reason: "" });
    
  };

  const filteredRecords = selectedMonth
    ? leaveRecords.filter((record) => {
        const month = new Date(record.fromDate).toISOString().slice(0, 7);
        return month === selectedMonth;
      })
    : leaveRecords;

  const handleDownloadExcel = () => {
    if (filteredRecords.length === 0) {
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(filteredRecords);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
    XLSX.writeFile(workbook, "Attendance_Report.xlsx");
  };

  return (
    <>
      <div className="p-5">
        <div className="flex bg-gray-900 rounded-2xl shadow  flex-col sm:flex-row justify-between items-center px-10 py-6 text-white gap-4">
             <h1 className="text-3xl font-bold tracking-wide">Attendance</h1>

        <div className="flex gap-4">
            <div className="flex gap-2 items-center">
                <label htmlFor="">Sort by:</label>
                <input
            type="month"
            className="bg-gray-800 text-gray-300 border border-gray-700 p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
            </div>
          

          <button
            onClick={handleDownloadExcel}
            className="bg-green-600 px-5 py-2 rounded-xl font-semibold shadow-lg hover:scale-105 hover:shadow-green-500/50 transition-transform"
          >
            Download Excel
          </button>

          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2 rounded-xl font-semibold shadow-lg hover:scale-105 hover:shadow-indigo-500/50 transition-transform"
          >
            Apply For Leave
          </button>
        </div>
      </div>


        </div>
       
      <div className="p-10 text-gray-300">
        <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 shadow-lg overflow-x-auto">
          <h2 className="text-xl mb-4 font-semibold text-white">
            Leave Records
          </h2>

          {filteredRecords.length === 0 ? (
            <p className="text-gray-400 text-center py-6">
              No records found for this month.
            </p>
          ) : (
            <table className="w-full border-collapse text-sm text-gray-300">
              <thead>
                <tr className="bg-gray-700 text-left">
                  <th className="p-3 rounded-tl-lg">SI.NO</th>
                  <th className="p-3">Leave Type</th>
                  <th className="p-3">From</th>
                  <th className="p-3">To</th>
                  <th className="p-3">Reason</th>
                  <th className="p-3">Applied On</th>
                  <th className="p-3 rounded-tr-lg">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record, index) => (
                  <tr
                    key={record.id}
                    className="border-b border-gray-700 hover:bg-gray-800/50 transition"
                  >
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">{record.leaveType}</td>
                    <td className="p-3">{record.fromDate}</td>
                    <td className="p-3">{record.toDate}</td>
                    <td className="p-3">{record.reason}</td>
                    <td className="p-3">{record.appliedOn}</td>
                    <td
                      className={`p-3 font-semibold ${
                        record.status === "Pending"
                          ? "text-yellow-400"
                          : record.status === "Approved"
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {record.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            className="fixed inset-0 flex justify-center items-center bg-black/70 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 120 }}
              className="bg-gray-900/95 text-white p-8 rounded-3xl w-[90%] sm:w-[420px] shadow-lg/60 relative"
            >
              <h2 className="text-2xl font-semibold mb-6 text-center text-blue-400">
                 Apply for Leave
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm mb-1 text-gray-300">
                    Leave Type
                  </label>
                  <select
                    name="leaveType"
                    value={formData.leaveType}
                    onChange={handleChange}
                    required
                    className="w-full p-2.5 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="">Select Type</option>
                    <option value="Casual Leave">Casual Leave</option>
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Earned Leave">Earned Leave</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-1 text-gray-300">
                    From Date
                  </label>
                  <input
                    type="date"
                    name="fromDate"
                    value={formData.fromDate}
                    onChange={handleChange}
                    required
                    className="w-full p-2.5 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1 text-gray-300">
                    To Date
                  </label>
                  <input
                    type="date"
                    name="toDate"
                    value={formData.toDate}
                    onChange={handleChange}
                    required
                    className="w-full p-2.5 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1 text-gray-300">
                    Reason
                  </label>
                  <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    required
                    rows="3"
                    placeholder="Enter your reason..."
                    className="w-full p-2.5 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                  ></textarea>
                </div>

                {/* Buttons */}
                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="bg-gray-700 px-5 py-2 rounded-lg hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2 rounded-lg font-semibold shadow-lg hover:scale-105 hover:shadow-indigo-500/40 transition-transform"
                  >
                    Apply
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EmployeeAttendance;
