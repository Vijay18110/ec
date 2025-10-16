import { toast } from "react-toastify";

export function validateCustomerForm(data) {
  if (!data.fullName || data.fullName.trim().length < 2) {
    toast.error("Full name is required and must be at least 2 characters.");
    return false;
  }

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    toast.error("Enter valid email");
    return false;
  }
  if (!data.address || data.address.trim().length < 2) {
    toast.error("Address is required and must be at least 2 characters.");
    return false;
  }

  if (!data.city || data.city.trim().length < 2) {
    toast.error("City is required and must be at least 2 characters.");
    return false;
  }

  if (!data.state || data.state.trim().length < 2) {
    toast.error("State is required and must be at least 2 characters.");
    return false;
  }

  if (!data.country || data.country.trim().length < 2) {
    toast.error("Country is required and must be at least 2 characters.");
    return false;
  }

  if (!data.mobile || !/^\d{10}$/.test(data.mobile)) {
    toast.error("Mobile number must be a 10-digit number.");
    return false;
  }

  return true; // ✅ All validations passed
}
