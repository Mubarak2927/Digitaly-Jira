// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { refreshAccessToken } from "../Api/auth";

// export default function ProtectedPage() {
//   const [data, setData] = useState(null);

//   const API_URL = "https://project-management-1409.onrender.com/api/v1/some-protected-endpoint";

//   const getProtectedData = async () => {
//     try {
//       let token = localStorage.getItem("access_token");

//       let res = await axios.get(API_URL, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setData(res.data);

//     } catch (error) {
//       if (error.response && error.response.status === 401) {
//         const newToken = await refreshAccessToken();

//         if (!newToken) {
//           window.location.href = "/";
//           return;
//         }
//         try {
//           const retryRes = await axios.get(API_URL, {
//             headers: { Authorization: `Bearer ${newToken}` },
//           });

//           setData(retryRes.data);

//         } catch (retryError) {
//           console.error("Retry failed:", retryError);
//           window.location.href = "/";
//         }
//       } else {
//         console.error("Request error:", error);
//       }
//     }
//   };

//   useEffect(() => {
//     getProtectedData();
//   }, []);

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
//       <h1 className="text-2xl font-bold mb-4">Protected Data</h1>
//       {data ? (
//         <pre className="bg-gray-800 p-4 rounded-lg text-sm max-w-lg overflow-auto">
//           {JSON.stringify(data, null, 2)}
//         </pre>
//       ) : (
//         <p>Loading...</p>
//       )}
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import API from "../Api/axiosInstance";

export default function ProtectedPage() {
  const [data, setData] = useState(null);

  const API_URL = "/api/v1/some-protected-endpoint";

  const getProtectedData = async () => {
    try {
      const res = await API.get(API_URL);
      setData(res.data);
    } catch (error) {
      console.error("Request failed:", error);
    }
  };

  useEffect(() => {
    getProtectedData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-2xl font-bold mb-4">Protected Data</h1>
      {data ? (
        <pre className="bg-gray-800 p-4 rounded-lg text-sm max-w-lg overflow-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
