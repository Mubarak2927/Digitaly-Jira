import axios from "axios";

const API = axios.create({
  baseURL: "https://pmtoolapidev.digitaly.live",  
});

// Request Interceptor (Just Log)
API.interceptors.request.use((config) => {
  console.log("API Calling:", config.url, config.method); // here log
  return config;
});

// Response Interceptor (Just Log)
API.interceptors.response.use(
  (response) => {
    console.log("API Response:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.log("API Error:", error.response?.status, error.config?.url);
    return Promise.reject(error);
  }
);

export default API;
