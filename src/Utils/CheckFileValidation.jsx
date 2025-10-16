import { toast } from "react-toastify";

// Function to validate file type
export const validateFileType = (file) => {
  const allowedTypes = ["image/jpeg", "image/png", "application/pdf"]; // MIME types for JPG, PNG, PDF
  if (!allowedTypes.includes(file.type)) {
    toast.error("Only JPG, JPEG, PNG, or PDF files are allowed.");
    return false;
  }
  return true;
};
export const validateFileType1 = (file) => {
  const allowedTypes = ["image/jpeg", "image/png"]; // MIME types for JPG, PNG, PDF
  if (!allowedTypes.includes(file.type)) {
    toast.error("Only JPG, JPEG,or PNG files are allowed.");
    return false;
  }
  return true;
};