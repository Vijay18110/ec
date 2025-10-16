import { useState, useRef } from "react";
import { toast } from "react-toastify";
import ApiEncryptDecrypt from "../Utils/Encryption";
import axiosInstance from "../Utils/axiosInstance";
import { Key } from "../Utils/Key";
import { useNavigate } from "react-router-dom";
const getTokenFromCookie = () => {
  const cookieStr = document.cookie; // e.g. "token=eyJhbGciOiJIUzI1NiIsInR..."
  console.log(cookieStr)
  const cookies = Object.fromEntries(
    cookieStr.split("; ").map((c) => c.split("="))
  );
  return cookies["token"]; // extract token
};


const useApiRequest = () => {
  const navigatetoLogin = useNavigate();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);
  const lastRequest = useRef({}); // 🔁 store last request
  const sendApiRequest = async (
    method,
    url,
    data = null,
    { onSuccess, onError, showToast = false, navigate = null } = {}, isFormData
  ) => {
    if (loading) {
      return;
    }
    setLoading(true);
    setError(null);
    setResponse(null);
    // 🔁 Save for recall
    lastRequest.current = {
      method,
      url,
      data,
      options: { onSuccess, onError, showToast, navigate },
    };

    try {
      console.log(url, data);
      let jsonData;
      if (!isFormData) {
        const encryptedData = await ApiEncryptDecrypt.encryptString(
          Key,
          JSON.stringify(data)
        );
        jsonData = { encrypted: encryptedData };
      } else {
        jsonData = data;
      }
      let res;
      const config = {
        headers: {
          "Content-Type": isFormData ? "multipart/form-data" : "application/json",
          withCredentials: true, // needed per request too sometimes
        },
      };
      console.log(config)
      if (method === "POST") {
        res = await axiosInstance.post(url, jsonData, config);
      } else if (method === "GET") {
        const params = new URLSearchParams(data).toString();
        res = await axiosInstance.get(`${url}`);
      } else {
        throw new Error("Unsupported HTTP method");
      }
      const decrypted = await ApiEncryptDecrypt.decryptString(
        Key,
        res.data.data
      );
      const result = JSON.parse(decrypted);
      // const ParsedRes = JSON.parse(result);
      console.log("res", res);
      // const token = authHeader.slite(" ")[1]
      setResponse(result.data);
      setStatus(result.Status);
      if (result.statusCode == 200 && result?.success) {
        showToast && toast.success(result.message, {
          toastId: "sda"
        });
        onSuccess?.(result?.data);
      }
      else if (result.statusCode == 401) {
        toast.error(result.message, {
          toastId: "err"
        });
        onError();
      }
      else {
        toast.error(result.message, {
          toastId: "err"
        });
      }
    } catch (err) {
      // toast.error(err?.message || "Something went wrong.");
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };
  // 🔁 Function to recall the last API request
  const recallRequest = () => {
    const { method, url, data, options } = lastRequest.current || {};
    if (method && url) {
      sendApiRequest(method, url, data, options);
    } else {
      console.warn("No previous API call to recall.");
    }
  };
  return {
    loading,
    response,
    error,
    status,
    sendApiRequest,
    recallRequest, // <-- exposed here
  };
};

export default useApiRequest;
