import { toast } from 'react-toastify';

export function chatFormValidation(data) {
  const { name, mobile, email } = data;

  if (!name || name.trim() === '') {
    toast.error('Full Name is required.');
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    toast.error('A valid Email Address is required.');
    return false;
  }

  const mobileRegex = /^[0-9]{10}$/;
  if (!mobile || !mobileRegex.test(mobile)) {
    toast.error('A valid 10-digit Phone Number is required.');
    return false;
  }

  return true;
}
