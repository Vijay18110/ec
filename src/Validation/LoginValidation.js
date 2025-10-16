import { toast } from "react-toastify";

export const loginValidation = (values) => {
  // Mobile number
  if (!values.MobileNo) {
    toast.error("Loginid is required");
    return false;
  } 
  // else if (!/^\d{10}$/.test(values.MobileNo)) {
  //   toast.error("Mobile number must be 10 digits");
  //   return false;
  // }
  // Password
  if (!values.CustomerPassword) {
    toast.error("Password is required");
    return false;
  }
  return true;
};
