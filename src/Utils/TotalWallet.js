import { toast } from "react-toastify";
import axiosInstance from "./axiosInstance";
import ApiEncryptDecrypt from "./Encryption";
import { Key } from "./Key";

 export const getWalletAmmount = async () => {
  const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
  if(loggedInUser){
 try {
     const newObj = {
       CustomerId: loggedInUser?.CustomerId,
    };
    const encryptedData = await ApiEncryptDecrypt.encryptString(
      Key,
      JSON.stringify(newObj)
    );
    const jsonData = { Body: encryptedData };
    let res;
    res = await axiosInstance.post("/TotalCustomerWallet", jsonData);
    const decryptedRes = await ApiEncryptDecrypt.decryptString(
      Key,
      res.data.body
    );
    const obj = JSON.parse(decryptedRes);
    if (obj.Status === 0) {
      return {obj}
    }
    if (obj.Status === 1) {
      toast.error(obj.Message);
    }
    if (obj.Status === 3) {
      // navigate && navigate("/login");
    }
  } catch (error) {
    toast.error(error.message)
    console.log(error)
  }
  }
 
   
  };