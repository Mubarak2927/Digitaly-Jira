// export async function refreshAccessToken() {
//   const refreshToken = localStorage.getItem("refresh_token");
//   if (!refreshToken) return null;

//   try {
//     const res = await fetch("http://192.168.1.39:8000/api/v1/refresh", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${refreshToken}`,
//       },
//     });

//     if (!res.ok) {
//       localStorage.clear();
//       window.location.href = "/";
//       return null;
//     }

//     const data = await res.json();

//     if (data.access_token) {
//       localStorage.setItem("access_token", data.access_token);
//       return data.access_token;
//     } else {
//       throw new Error("No access token returned");
//     }
//   } catch (error) {
//     console.error("Token refresh failed:", error);
//     localStorage.clear();
//     window.location.href = "/";
//     return null;
//   }
// }

// import axios from "axios";

// const BASE_URL = "https://project-management-1409.onrender.com/api/auth"; // change if your API base is different

// export const loginUser = async (email, password) => {
//   const res = await axios.post(`${BASE_URL}/login`, { email, password });

//   // ✅ Save access token to localStorage
//   localStorage.setItem("token", res.data.access_token);

//   return res.data;
// };


import axios from "axios";

const BASE_URL = "https://pmtoolapidev.digitaly.live";

export const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refresh_token");

    if (!refreshToken) return null;

    const response = await axios.post(`${BASE_URL}/refresh`, {
      refresh_token: refreshToken,
    });

    const newAccessToken = response.data.access_token;

    localStorage.setItem("access_token", newAccessToken);

    return newAccessToken;
  } catch (error) {
    console.error("Token refresh failed:", error);
    return null;
  }
};


