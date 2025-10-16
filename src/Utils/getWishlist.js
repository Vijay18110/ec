import { toast } from "react-toastify";
import { wishlistActions } from "../Redux/Slices/wishlistSlice";
import axiosInstance from "./axiosInstance";
import ApiEncryptDecrypt from "./Encryption";
import { Key } from "./Key";

export const getWishlist = async () => {
  const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
  if(loggedInUser){
    const encryptedData = await ApiEncryptDecrypt.encryptString(
      Key,
      JSON.stringify({
        CustomerId: loggedInUser?.CustomerId,
      })
    );
    const jsonData = { Body: encryptedData };
    let res;
    res = await axiosInstance.post("/CustomerWishList", jsonData);
  
    const decryptedRes = await ApiEncryptDecrypt.decryptString(
      Key,
      res.data.body
    );
    const obj = JSON.parse(decryptedRes);
    if (obj.Status === 0) {
    }
    // Handle different status codes
    if (obj.Status === 1) {
      toast.error(obj.Message);
    }
    if (obj.Status === 3) {
    }
    return {obj}
  }
};
