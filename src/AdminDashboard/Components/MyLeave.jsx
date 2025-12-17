// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const MyLeave = () => {
//   const [leaveData, setLeaveData] = useState({
//     fromDate: "",
//     toDate: "",
//     reason: "",
//   });
//   const [myLeaves, setMyLeaves] = useState([]);

//   const employeeId = "EMP001"; // login employee id

//   const handleChange = (e) => {
//     setLeaveData({ ...leaveData, [e.target.name]: e.target.value });
//   };

//   const applyLeave = async () => {
//     await axios.post("/api/leaves/apply", {
//       employeeId,
//       ...leaveData,
//       status: "Pending",
//     });
//     fetchMyLeaves();
//     setLeaveData({ fromDate: "", toDate: "", reason: "" });
//   };

//   const fetchMyLeaves = async () => {
//     const res = await axios.get(`/api/leaves/employee/${employeeId}`);
//     setMyLeaves(res.data);
//   };

//   useEffect(() => {
//     fetchMyLeaves();
//   }, []);

//   return (
//     <div>
//       <h2>Apply Leave</h2>

//       <input
//         type="date"
//         name="fromDate"
//         value={leaveData.fromDate}
//         onChange={handleChange}
//       />
//       <input
//         type="date"
//         name="toDate"
//         value={leaveData.toDate}
//         onChange={handleChange}
//       />
//       <input
//         type="text"
//         name="reason"
//         placeholder="Reason"
//         value={leaveData.reason}
//         onChange={handleChange}
//       />
//       <button onClick={applyLeave}>Apply</button>

//       <h3>My Leave Requests</h3>
//       <table border="1">
//         <thead>
//           <tr>
//             <th>From</th>
//             <th>To</th>
//             <th>Reason</th>
//             <th>Status</th>
//           </tr>
//         </thead>
//         <tbody>
//           {myLeaves.map((leave) => (
//             <tr key={leave._id}>
//               <td>{leave.fromDate}</td>
//               <td>{leave.toDate}</td>
//               <td>{leave.reason}</td>
//               <td>
//                 {leave.status === "Approved" ? "✅ Approved" : "⏳ Pending"}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default MyLeave;


import React from 'react'

const MyLeave = () => {
  return (
    <div>MyLeave</div>
  )
}

export default MyLeave