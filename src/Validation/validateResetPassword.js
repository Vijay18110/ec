import { toast } from "react-toastify";

export const validateResetPassword = (password) => {
  // Check if email is empty or invalid
  if (!password?.newPassword || password?.newPassword.trim() === "") {
    toast.error("New Password is Required");
    return false;
  }
  if (!password?.confirmPassword || password?.confirmPassword.trim() === "") {
    toast.error("Confirm Password is Required");
    return false;
  }
   if (password?.newPassword!== password?.confirmPassword) {
    toast.error("Both password must be same");
    return false;
  }
  // If all validations pass
  return true;
};
