import React, { useState } from "react";
import { checkInAttendance, checkOutAttendance } from "../../Api/projectAPI";

const AttendancePage = () => {
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(false);

 const handleCheckIn = async () => {
  try {
    setLoading(true);
    const data = await checkInAttendance("Working remotely");
    setAttendance(data);
    alert("Checked in successfully!");
  } catch (err) {
    if (err.response?.data?.detail === "Already checked in and not checked out") {
      alert("You are already checked in. Please check out first.");
    } else {
      alert("Check-in failed");
    }
  } finally {
    setLoading(false);
  }
};

const handleCheckOut = async () => {
  try {
    setLoading(true);
    const data = await checkOutAttendance("End of day");
    setAttendance(data);
    alert("Checked out successfully!");
  } catch (err) {
    if (err.response?.data?.detail === "No open check-in found") {
      alert("You have not checked in yet.");
    } else {
      alert("Check-out failed");
    }
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4 text-black">Attendance</h1>
      <div className="flex gap-4">
        <button
          onClick={handleCheckIn}
          disabled={loading}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
        >
          {loading ? "Processing..." : "Check In"}
        </button>
        <button
          onClick={handleCheckOut}
          disabled={loading}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
        >
          {loading ? "Processing..." : "Check Out"}
        </button>
      </div>

      {attendance && (
        <div className="mt-6 bg-gray-900 p-4 rounded-lg">
          <p><strong>ID:</strong> {attendance.id}</p>
          <p><strong>Emp ID:</strong> {attendance.emp_id}</p>
          <p><strong>Check In:</strong> {attendance.check_in}</p>
          <p><strong>Status:</strong> {attendance.status}</p>
          {attendance.check_out && <p><strong>Check Out:</strong> {attendance.check_out}</p>}
        </div>
      )}
    </div>
  );
};

export default AttendancePage;
