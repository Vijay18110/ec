import React, { useState } from "react";
import { FaLock } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { SiApple } from "react-icons/si";

export default function AuthCard() {
    const [activeTab, setActiveTab] = useState("login");

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100 bg-dark">
            <div className="card shadow-lg rounded-4" style={{ width: "22rem" }}>
                {/* Tabs */}
                <div className="d-flex">
                    <button
                        className={`flex-fill btn ${activeTab === "login"
                            ? "btn-dark text-white"
                            : "btn-light text-secondary"
                            }`}
                        onClick={() => setActiveTab("login")}
                    >
                        Login
                    </button>
                    <button
                        className={`flex-fill btn ${activeTab === "signup"
                            ? "btn-dark text-white"
                            : "btn-light text-secondary"
                            }`}
                        onClick={() => setActiveTab("signup")}
                    >
                        Sign Up
                    </button>
                </div>

                {/* Body */}
                <div className="card-body text-center">
                    <h2 className="fw-bold">Welcome,</h2>
                    <p className="text-muted mb-4">Sign in to continue!</p>

                    {/* Demo credentials */}
                    <div className="d-flex align-items-start bg-light rounded p-3 mb-4 text-start small border">
                        <FaLock className="me-2 text-secondary mt-1" />
                        <div>
                            <p className="mb-1">
                                <strong>Username:</strong> john
                            </p>
                            <p className="mb-0">
                                <strong>Password:</strong> @ABC123
                            </p>
                        </div>
                    </div>
                    {/* Form */}
                    <form className="mb-3">
                        <input
                            type="text"
                            className="form-control mb-3"
                            placeholder="Your email or username"
                            defaultValue="john"
                        />
                        <button type="submit" className="btn btn-warning w-100 fw-semibold">
                            Continue
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="d-flex align-items-center my-3">
                        <div className="flex-grow-1 border-top"></div>
                        <span className="mx-2 text-muted small">OR</span>
                        <div className="flex-grow-1 border-top"></div>
                    </div>

                    {/* Social login */}
                    <button className="btn btn-outline-dark w-100 mb-2 d-flex align-items-center justify-content-center">
                        <SiApple className="me-2" /> Sign in with Apple
                    </button>
                    <button className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center">
                        <FcGoogle className="me-2" /> Continue with Google
                    </button>
                </div>
            </div>
        </div>
    );
}
