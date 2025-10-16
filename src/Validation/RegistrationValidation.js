// import { toast } from "react-toastify";

// export const validateCustomerForm = (values) => {
//   // Salutation
//   if (values.Solutation && !values.Solutation) {
//     toast.error("Salutation is required");
//     return false;
//   } else if (
//     values.Solutation &&
//     !["Mr", "Mrs", "Ms", "Dr"].includes(values.Solutation)
//   ) {
//     toast.error("Invalid salutation");
//     return false;
//   }
//   // Customer name
//   if (!values.CustomerName) {
//     toast.error("Customer name is required");
//     return false;
//   } else if (values.CustomerName.length < 2) {
//     toast.error("Customer name must be at least 2 characters");
//     return false;
//   }
//   // if (
//   //   !values?.customerAddress ||
//   //   !values?.customerAddress?.trim()?.length < 0
//   // ) {
//   //   toast.error("Address is required");
//   //   return false;
//   // }
//   if (!values.customerCity || !values.customerCity?.trim()?.length < 0) {
//     toast.error("City is required");
//     return false;
//   }
//   if (!values.customerState || !values.customerState?.trim()?.length < 0) {
//     toast.error("State is required");
//     return false;
//   }
//   if (!values.customerCountry || !values.customerCountry?.trim()?.length < 0) {
//     toast.error("Country is required");
//     return false;
//   }
//   // Mobile number
//   if (!values.MobileNo) {
//     toast.error("Mobile number is required");
//     return false;
//   } else if (!/^\d{10}$/.test(values.MobileNo)) {
//     toast.error("Mobile number must be 10 digits");
//     return false;
//   }

//   if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.CustomerEmail)) {
//     toast.error("Invalid email address");
//     return false;
//   }

//   // Password
//   if (!values?.CustomerPassword) {
//     toast.error("Password is required");
//     return false;
//   } else if (values?.CustomerPassword?.length < 8) {
//     toast.error("Password must be at least 8 characters long.");
//     return false;
//   } else if (!/[A-Z]/.test(values?.CustomerPassword)) {
//     toast.error("Password must contain at least one uppercase letter.");
//     return false;
//   } else if (!/[a-z]/.test(values?.CustomerPassword)) {
//     toast.error("Password must contain at least one lowercase letter.");
//     return false;
//   } else if (!/[0-9]/.test(values?.CustomerPassword)) {
//     toast.error("Password must contain at least one number.");
//     return false;
//   } else if (!/[!@#$%^&*]/.test(values?.CustomerPassword)) {
//     toast.error(
//       "Password must include at least one special character (!@#$%^&*)."
//     );
//     return false;
//   }
//   if (!values?.CustomerconfirmPassword) {
//     toast.error("Confirm password is required");
//     return false;
//   }
//   if (values?.CustomerPassword !== values?.CustomerconfirmPassword) {
//     toast.error("Confirm password must be same");
//     return false;
//   }
//   // If all validations pass
//   return true;
// };

import { toast } from "react-toastify";

export const validateCustomerForm = (values) => {
  // console.log(values?.Solutation);
  // Salutation
  if (!values.Solutation) {
    toast.error("Salutation is required");
    return false;
  } else if (["Mr", "Mrs", "Mss"].includes(values.Solutation)) {
    toast.error("Invalid salutation");
    return false;
  }
  // Customer name
  if (!values.CustomerName) {
    toast.error("Customer name is required");
    return false;
  } else if (values.CustomerName.length < 2) {
    toast.error("Customer name must be at least 2 characters");
    return false;
  }
  if (
    values?.customerAddress &&
    (!values?.customerAddress || !values?.customerAddress?.trim()?.length < 0)
  ) {
    toast.error("Address is required");
    return false;
  }
  if (
    values?.customerCity &&
    (!values.customerCity || !values.customerCity?.trim()?.length < 0)
  ) {
    toast.error("City is required");
    return false;
  }
  if (
    values.customerState &&
    (!values.customerState || !values.customerState?.trim()?.length < 0)
  ) {
    toast.error("State is required");
    return false;
  }
  if (
    values.customerCountry &&
    (!values.customerCountry || !values.customerCountry?.trim()?.length < 0)
  ) {
    toast.error("Country is required");
    return false;
  }
  // Mobile number
  if (!values.MobileNo) {
    toast.error("Mobile number is required");
    return false;
  } else if (!/^\d{10}$/.test(values.MobileNo)) {
    toast.error("Mobile number must be 10 digits");
    return false;
  }

  if (
    values.CustomerEmail &&
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.CustomerEmail)
  ) {
    toast.error("Invalid email address");
    return false;
  }

  // Password
  if (!values?.CustomerPassword) {
    toast.error("Password is required");
    return false;
  } else if (values?.CustomerPassword?.length < 8) {
    toast.error("Password must be at least 8 characters long.");
    return false;
  } else if (!/[A-Z]/.test(values?.CustomerPassword)) {
    toast.error("Password must contain at least one uppercase letter.");
    return false;
  } else if (!/[a-z]/.test(values?.CustomerPassword)) {
    toast.error("Password must contain at least one lowercase letter.");
    return false;
  } else if (!/[0-9]/.test(values?.CustomerPassword)) {
    toast.error("Password must contain at least one number.");
    return false;
  } else if (!/[!@#$%^&*]/.test(values?.CustomerPassword)) {
    toast.error(
      "Password must include at least one special character (!@#$%^&*)."
    );
    return false;
  }
  if (values?.CustomerconfirmPassword && !values?.CustomerconfirmPassword) {
    toast.error("Confirm password is required");
    return false;
  }
  if (
    values?.CustomerconfirmPassword &&
    values?.CustomerPassword !== values?.CustomerconfirmPassword
  ) {
    toast.error("Confirm password must be same");
    return false;
  }
  // If all validations pass
  return true;
};
