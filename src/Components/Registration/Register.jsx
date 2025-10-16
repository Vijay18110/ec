import React from "react";
import { useForm } from "react-hook-form";
import useApiRequest from "../../Hooks/apiReq";
import './Register.css'
import SpinnerLoader from "../SpinnerLoader";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const { loading, sendApiRequest } = useApiRequest();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    console.log("Registration Data:", data);
    sendApiRequest("POST", "/auth/register", data, {
      onSuccess: (res) => {
        navigate('/login')
      },
      showToast: true,
    });
  };

  const password = watch("password");

  return (
    <div className="register-body d-flex align-items-center justify-content-center vh-100">
      <div className="register-card card shadow-lg border-0 p-4">
        <h4 className="text-center mb-2 text-white fw-bold">Create Account 🌱</h4>
        <p className="text-center text-light small mb-4">Join us today — it’s quick and easy</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label className="form-label text-white">Full Name</label>
            <input
              type="text"
              className={`form-control form-control-modern ${errors.name ? "is-invalid" : ""}`}
              placeholder="Enter your name"
              {...register("name", {
                required: "Name is required",
                minLength: { value: 3, message: "Name must be at least 3 characters" },
              })}
            />
            {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label text-white">Email</label>
            <input
              type="email"
              className={`form-control form-control-modern ${errors.email ? "is-invalid" : ""}`}
              placeholder="Enter your email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
            />
            {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label text-white">Mobile No</label>
            <input
              type="text"
              className={`form-control form-control-modern ${errors.mobile ? "is-invalid" : ""}`}
              placeholder="Enter your mobile number"
              {...register("mobile", {
                required: "Mobile number is required",
                pattern: { value: /^[6-9]\d{9}$/, message: "Enter a valid 10-digit mobile number" },
              })}
            />
            {errors.mobile && <div className="invalid-feedback">{errors.mobile.message}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label text-white">Password</label>
            <input
              type="password"
              className={`form-control form-control-modern ${errors.password ? "is-invalid" : ""}`}
              placeholder="Enter password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Password must be at least 6 characters" },
              })}
            />
            {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
          </div>

          <div className="mb-4">
            <label className="form-label text-white">Confirm Password</label>
            <input
              type="password"
              className={`form-control form-control-modern ${errors.confirmPassword ? "is-invalid" : ""}`}
              placeholder="Confirm your password"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) => value === password || "Passwords do not match",
              })}
            />
            {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword.message}</div>}
          </div>

          <div className="d-grid">
            <button type="submit" disabled={isSubmitting || loading} className="btn btn-gradient">
              {isSubmitting || loading ? <>Register <SpinnerLoader /></> : "Register"}
            </button>
          </div>
        </form>

        <div className="text-center mt-3">
          <small className="text-light">
            Already have an account?{" "}
            <a href="/login" className="text-decoration-none text-white fw-bold">
              Login
            </a>
          </small>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
