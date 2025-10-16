import { toast } from "react-toastify";

export function supportTicketvalidation(data) {
 
  if (!data.SupportTypeId || data.SupportTypeId.trim() === ""|| data.SupportTypeId === "--Select Support Type--") {
    toast.error("Support Type is required.");
    return false;
  }

  if (!data.Subject || data.Subject.trim() === "") {
    toast.error("Subject is required.");
    return false;
  }

  

  const validPriorities = ["High", "Medium", "Low"];
  if (!validPriorities.includes(data.Priority)) {
    toast.error("Priority must be High, Medium, or Low.");
    return false;
  }

  return true;
}
