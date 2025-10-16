// src/axiosInstance.js
import axios from "axios";
// Create an Axios instance with default configuration
const axiosInstance = axios.create({
  // baseURL: "https://localhost:44359/api/RavOrganicApi", // for Production
  // baseURL: "https://api.ravorganics.com/api/RavOrganicApi", // for Production
  //   baseURL: "https://uatorg.tantrash.com/api/RavOrganicApi", // for testing purpose
  // baseURL: "https://uatorg.tantrash.com/api/RAVDownloadAPI", // for testing purpose  RAVDownloadAPI
  baseURL: "https://apicustomer.ravbiz.in/api/RavBusiness/",
  // baseURL: "https://uatbusiness.ravbiz.in/api/RavBusiness", // Production base Url for local
  //
  // baseURL: "https://apibusiness.ravbiz.in/api/RavBusiness", // Production base Url for local
  // baseURL:
  //   "https://cors-anywhere.herokuapp.com/https://api.ravorganics.com/api/RavOrganicApi", // base Url For Testing Purpose
  headers: {
    "Content-Type": "application/json",
    // Add other default headers if needed, like Authorization for auth tokens
    // 'Authorization': `Bearer ${yourToken}`,
  },
});
// Optional: Add request interceptors to handle things like adding tokens
axiosInstance.interceptors.request.use(
  (config) => {
    // Add token or modify config before sending the request if needed
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers['Authorization'] = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);
// Optional: Add response interceptors to handle errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally (like showing a notification or redirecting)
    console.log(error);
    return Promise.reject(error);
  }
);
export default axiosInstance;
