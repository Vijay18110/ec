import { useState, useEffect } from "react";
import { toast } from "react-toastify"; // Assuming you're using toast notifications
import ApiEncryptDecrypt from "../Utils/Encryption";
import axiosInstance from "../Utils/axiosInstance";
import { Key } from "../Utils/Key";
import { useDispatch } from "react-redux";
import { uiAction } from "../Redux/Slices/uiSlice";

export function useGetDropDownData(flag) {
  const [dropData, setDropData] = useState([]);
  const [loading, setLoading] = useState(true); // Optional: to handle loading state
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const getLoggedInUser = JSON.parse(
          sessionStorage.getItem("loggedInUser")
        );
        if (getLoggedInUser) {
          const data = {
            Fk_CustomerId: getLoggedInUser.CustomerId,
            LoginToken: getLoggedInUser.LoginToken,
            AppVersion: "1.0",
            DeviceType: "Web",
            value: 3,
            flag: "ddlSupportType",
          };
          const encryptedData = await ApiEncryptDecrypt.encryptString(
            Key,
            JSON.stringify(data)
          );
          const jsonData = { Body: encryptedData };
          const res = await axiosInstance.post("/DropDownData", jsonData);
          const decryptedRes = await ApiEncryptDecrypt.decryptString(
            Key,
            res.data.body
          );
          const obj = JSON.parse(decryptedRes);
          if (!obj.Status) {
            setDropData(obj.Response.dropDownData);
          }
          if (obj.Status === 3) {
            toast.error("Login Token Expire !", {
              toastId: "dsfkjsdfhsfjsdhfsd",
            });
          }
          if (obj.Status === 1) {
            toast.error(obj.Message);
          }
        }
      } catch (error) {
        console.log(error);
        setError(error); // Set the error if one occurs
      } finally {
        setLoading(false); // Optionally, set loading to false when finished
      }
    };

    fetchData();
  }, [flag]); // Re-run the effect when the 'flag' changes

  return { dropData, loading, error }; // Return the dropData, loading state, and any error
}
