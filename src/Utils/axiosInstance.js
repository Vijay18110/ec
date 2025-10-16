// src/axiosInstance.js
import axios from "axios";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
  baseURL: "https://backend-q4qd.onrender.com/api/v1",//production url
  // baseURL: "http://localhost:3000/api/v1", // change According to your runing server at local
  headers: {
    "Content-Type": "application/json",
    withCredentials: true, // needed per request too sometimes
  },
});
// Request interceptor → attach token from localStorage
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    toast.error("Request error occurred!");
    return Promise.reject(error);
  }
);

// Response interceptor → capture token from headers
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("Response error:", error);

    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || "Something went wrong!";

      switch (status) {
        case 400:
          toast.error(`Bad Request: ${message}`);
          break;
        case 401:
          toast.error("Unauthorized! Please login again.", { toastId: "err" });
          localStorage.removeItem("token"); // clear token on 401
          window.location.href = '/login';
          break;
        case 403:
          toast.error("Forbidden! You don't have access.", { toastId: "err" });
          break;
        case 404:
          toast.error("Resource not found!", { toastId: "err" });
          break;
        case 500:
          toast.error("Server error! Please try again later.", { toastId: "err" });
          break;
        default:
          toast.error(message);
      }
    } else if (error.request) {
      toast.error("No response from server. Please check your network!");
    } else {
      toast.error(`Error: ${error.message}`);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
