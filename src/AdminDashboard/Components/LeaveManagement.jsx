// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const LeaveManagement = () => {
//   const [leaves, setLeaves] = useState([]);

//   const fetchLeaves = async () => {
//     const res = await axios.get("/api/leaves/all");
//     setLeaves(res.data);
//   };

//   const updateStatus = async (id, status) => {
//     await axios.put(`/api/leaves/${id}`, { status });
//     fetchLeaves();
//   };

//   useEffect(() => {
//     fetchLeaves();
//   }, []);

//   return (
//     <div>
//       <h2>Employee Leave Requests</h2>

//       <table border="1">
//         <thead>
//           <tr>
//             <th>Employee</th>
//             <th>From</th>
//             <th>To</th>
//             <th>Reason</th>
//             <th>Status</th>
//             <th>Action</th>
//           </tr>
//         </thead>

//         <tbody>
//           {leaves.map((leave) => (
//             <tr key={leave._id}>
//               <td>{leave.employeeId}</td>
//               <td>{leave.fromDate}</td>
//               <td>{leave.toDate}</td>
//               <td>{leave.reason}</td>
//               <td>{leave.status}</td>
//               <td>
//                 {leave.status === "Pending" && (
//                   <>
//                     <button
//                       onClick={() => updateStatus(leave._id, "Approved")}
//                     >
//                       Approve
//                     </button>
//                     <button
//                       onClick={() => updateStatus(leave._id, "Rejected")}
//                     >
//                       Reject
//                     </button>
//                   </>
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default LeaveManagement;

import React from 'react'

const LeaveManagement = () => {
  return (
    <div>LeaveManagement</div>
  )
}

export default LeaveManagement
