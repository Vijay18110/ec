import React, { useState } from "react";
import useApiRequest from "../../../Hooks/apiReq";
import InputBox from "../../../Widgets/InputBox/InputBox";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

const ChangePassword = () => {
  const { error, loading, response, sendApiRequest, status } = useApiRequest();
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPasswords, setShowPasswords] = useState({
    first: false,
    second: false,
    third: false,
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const toggleShowPasswords = (val) => {
    if (val == "first") {
      setShowPasswords((prev) => ({ ...prev, first: !showPasswords.first }));
    } else if (val == "second") {
      setShowPasswords((prev) => ({ ...prev, second: !showPasswords.second }));
    } else if (val == "third") {
      setShowPasswords((prev) => ({ ...prev, third: !showPasswords.third }));
    }
    // setShowPasswords(!showPasswords);
  };

  const [hasError, setHasError] = useState(false);
  const validateForm = () => {
    const { oldPassword, newPassword, confirmPassword } = formData;
    const newErrors = {};

    if (!oldPassword.trim()) {
      newErrors.oldPassword = "Old password is required.";
    }

    if (!newPassword.trim()) {
      newErrors.newPassword = "New password is required.";
    } else {
      if (newPassword === oldPassword) {
        newErrors.newPassword =
          "New password must be different from old password.";
      } else if (newPassword.length < 8) {
        newErrors.newPassword = "Password must be at least 8 characters long.";
      } else if (!/[A-Z]/.test(newPassword)) {
        newErrors.newPassword = "Must contain at least one uppercase letter.";
      } else if (!/[a-z]/.test(newPassword)) {
        newErrors.newPassword = "Must contain at least one lowercase letter.";
      } else if (!/[0-9]/.test(newPassword)) {
        newErrors.newPassword = "Must contain at least one number.";
      } else if (!/[!@#$%^&*]/.test(newPassword)) {
        newErrors.newPassword =
          "Must include at least one special character (!@#$%^&*).";
      }
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your new password.";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    const hasAnyError = Object.keys(newErrors).length > 0;
    setErrors(newErrors);
    setHasError(hasAnyError);

    return !hasAnyError;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
      if (loggedInUser) {
        sendApiRequest(
          "POST",
          "/ChangePassword",
          {
            CustomerId: loggedInUser?.CustomerId,
            NewPassword: formData.newPassword,
            OldPassword: formData.oldPassword,
          },
          { showToast: true }
        );
      }

      setFormData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setErrors({});
    }
  };

  return (
    <div className="my-4" style={{ maxWidth: "100%" }}>
      <h4 className="mb-3">Change Password</h4>
      <form onSubmit={handleSubmit} noValidate>
        {/* Old Password */}
        <div className="card p-4">
          <div className="row">
            <div className="col-lg-4">
              <div className="mb-3" style={{ position: "relative" }}>
                <label htmlFor="oldPassword" className="form-label">
                  Old Password
                </label>
                <input
                  type={showPasswords.first ? "text" : "password"}
                  className={`form-control ${errors.oldPassword ? "is-invalid" : ""
                    }`}
                  id="oldPassword"
                  value={formData.oldPassword}
                  onChange={handleChange}
                />
                <div className="invalid-feedback">{errors.oldPassword}</div>
                {!errors.oldPassword &&
                  (showPasswords.first ? (
                    <i
                      style={{ position: "absolute", top: "53%", right: "2%" }}
                      onClick={() => toggleShowPasswords("first")}
                    >
                      {formData?.oldPassword?.length > 0 && <IoEyeOutline />}
                    </i>
                  ) : (
                    <i
                      style={{ position: "absolute", top: "53%", right: "2%" }}
                      onClick={() => toggleShowPasswords("first")}
                    >
                      {" "}
                      {formData?.oldPassword?.length > 0 && <IoEyeOffOutline />}
                    </i>
                  ))}
              </div>
            </div>
            <div className="col-lg-4">
              {/* New Password */}
              <div className="mb-3" style={{ position: "relative" }}>
                <label htmlFor="newPassword" className="form-label">
                  New Password
                </label>
                <input
                  type={showPasswords.second ? "text" : "password"}
                  className={`form-control ${errors.newPassword ? "is-invalid" : ""
                    }`}
                  id="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                />
                <div className="invalid-feedback">{errors.newPassword}</div>
                {!errors.newPassword &&
                  (showPasswords.second ? (
                    <i
                      style={{ position: "absolute", top: "53%", right: "2%" }}
                      onClick={() => toggleShowPasswords("second")}
                    >
                      {formData?.newPassword?.length > 0 && <IoEyeOutline />}
                    </i>
                  ) : (
                    <i
                      style={{ position: "absolute", top: "53%", right: "2%" }}
                      onClick={() => toggleShowPasswords("second")}
                    >
                      {" "}
                      {formData?.newPassword?.length > 0 && <IoEyeOffOutline />}
                    </i>
                  ))}
              </div>
            </div>
            <div className="col-lg-4">
              <div className="mb-3" style={{ position: "relative" }}>
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password
                </label>
                <input
                  type={showPasswords.third ? "text" : "password"}
                  className={`form-control ${errors.confirmPassword ? "is-invalid" : ""
                    }`}
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <div className="invalid-feedback">{errors.confirmPassword}</div>
                {!errors.confirmPassword &&
                  (showPasswords.third ? (
                    <i
                      style={{ position: "absolute", top: "53%", right: "2%" }}
                      onClick={() => toggleShowPasswords("third")}
                    >
                      {formData?.confirmPassword?.length > 0 && (
                        <IoEyeOutline />
                      )}
                    </i>
                  ) : (
                    <i
                      style={{ position: "absolute", top: "53%", right: "2%" }}
                      onClick={() => toggleShowPasswords("third")}
                    >
                      {" "}
                      {formData?.confirmPassword?.length > 0 && (
                        <IoEyeOffOutline />
                      )}
                    </i>
                  ))}
              </div>
            </div>
            <div className="col-lg-12">
              {/* Submit Button */}
              <button
                type="submit"
                style={{ backgroundColor: "#8a934f" }}
                className="btn btn-primary w-100"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
