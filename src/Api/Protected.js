// import { refreshAccessToken } from "../Api/auth";

// export async function getProtectedData() {
//   let token = localStorage.getItem("access_token");

//   let res = await fetch("http://192.168.1.39:8000/api/v1/some-protected-endpoint", {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   if (res.status === 401) {
//     token = await refreshAccessToken();

//     if (token) {
//       res = await fetch("http://192.168.1.39:8000/api/v1/some-protected-endpoint", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//     } else {
//       window.location.href = "/";
//       return;
//     }
//   }

//   const data = await res.json();
//   console.log("Protected data:", data);
//   return data;
// }
