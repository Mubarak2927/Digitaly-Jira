import React, { useState } from "react";
import { createLeaveRequest } from "../../Api/projectAPI";

const LeaveRequestPage = () => {
  const [leave, setLeave] = useState({
    leave_type: "",
    start_date: "",
    end_date: "",
    reason: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const payload = {
        leave_type: leave.leave_type,
        start_date: leave.start_date,
        end_date: leave.end_date,
        reason: leave.reason,
      };
      const data = await createLeaveRequest(payload);
      alert(`Leave request created: ${data.status}, Total Days: ${data.total_days}`);
      setLeave({ leave_type: "", start_date: "", end_date: "", reason: "" });
    } catch (err) {
      console.error("Failed to create leave request", err);
      alert(err.response?.data?.detail || "Failed to create leave request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-black
    ">
      <h1 className="text-2xl font-bold mb-4">Create Leave Request</h1>
      <div className="flex flex-col gap-3 max-w-md">
        <select
          className="p-2 rounded border"
          value={leave.leave_type}
          onChange={(e) => setLeave({ ...leave, leave_type: e.target.value })}
        >
          <option value="">Select Leave Type</option>
          <option value="Casual">Casual</option>
          <option value="Sick">Sick</option>
          <option value="Paid">Paid</option>
        </select>

        <input
          type="date"
          className="p-2 rounded border"
          value={leave.start_date}
          onChange={(e) => setLeave({ ...leave, start_date: e.target.value })}
        />

        <input
          type="date"
          className="p-2 rounded border"
          value={leave.end_date}
          onChange={(e) => setLeave({ ...leave, end_date: e.target.value })}
        />

        <input
          type="text"
          placeholder="Reason"
          className="p-2 rounded border"
          value={leave.reason}
          onChange={(e) => setLeave({ ...leave, reason: e.target.value })}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Submitting..." : "Submit Leave"}
        </button>
      </div>
    </div>
  );
};

export default LeaveRequestPage;
