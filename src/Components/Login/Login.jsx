import React from "react";
import { useForm } from "react-hook-form";
import "bootstrap/dist/css/bootstrap.min.css";
import useApiRequest from "../../Hooks/apiReq";
import { useNavigate } from "react-router-dom";
import SpinnerLoader from "../SpinnerLoader";
import './Login.css'
const LoginPage = () => {
  const { loading, sendApiRequest } = useApiRequest();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    console.log("Login Data:", data);
    sendApiRequest("POST", "/auth/login", data, {
      onSuccess: (res) => {
        if (res?.token) localStorage.setItem("token", res?.token);
        navigate("/home");
      },
      showToast: true,
    });
  };

  return (
    <div className="login-body d-flex align-items-center justify-content-center vh-100">
      <div className="login-card card shadow-lg border-0 p-4">
        <h4 className="text-center mb-2 text-white fw-bold">Welcome Back </h4>
        <p className="text-center text-light small mb-4">Login to your account</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label className="form-label text-white">Mobile No</label>
            <input
              type="text"
              className={`form-control form-control-modern ${errors.mobileNo ? "is-invalid" : ""}`}
              placeholder="Enter your mobile number"
              {...register("mobileNo", {
                required: "Mobile number is required",
                pattern: {
                  value: /^[6-9]\d{9}$/,
                  message: "Enter a valid 10-digit mobile number",
                },
              })}
            />
            {errors.mobileNo && <div className="invalid-feedback">{errors.mobileNo.message}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label text-white">Password</label>
            <input
              type="password"
              className={`form-control form-control-modern ${errors.password ? "is-invalid" : ""}`}
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Password must be at least 6 characters" },
              })}
            />
            {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
          </div>

          <div className="d-grid mt-3">
            <button type="submit" disabled={isSubmitting} className="btn btn-gradient">
              {loading ? <>Login <SpinnerLoader /> </> : "Login"}
            </button>
          </div>
        </form>

        <div className="text-center mt-3">
          <small className="text-light">
            Don’t have an account?{" "}
            <a href="/register" className="text-decoration-none text-white fw-bold">
              Register Now
            </a>
          </small>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
