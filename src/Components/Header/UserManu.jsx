import React from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";
import useApiRequest from "../../Hooks/apiReq";
import { toast } from "react-toastify";
import SpinnerLoader from "../SpinnerLoader";

const UserMenu = ({ onClose }) => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate()
    const { loading, sendApiRequest } = useApiRequest()
    const handleLogout = () => {
        sendApiRequest("POST", "/auth/logout", {}, {
            onSuccess: (res) => {
                localStorage.removeItem("token");
                navigate('/login')
            },
            showToast: true
        })
    }
    return (
        <motion.div
            className="user-menu position-absolute end-0 mt-2 bg-white shadow rounded-3 p-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
        >
            {isAuthenticated ? (
                <div>
                    <Link to="/profile" className="dropdown-item" onClick={onClose}>Profile</Link>
                    <Link to="/orders" className="dropdown-item" onClick={onClose}>My Orders</Link>
                    <button className="dropdown-item text-danger" onClick={handleLogout}>Logout</button>
                </div>
            ) : (
                <div>
                    <Link to="/login" className="dropdown-item" onClick={onClose}>Login</Link>
                    <Link to="/register" className="dropdown-item" onClick={onClose}>Register</Link>
                </div>
            )}
            {loading && <SpinnerLoader />}
        </motion.div>
    );
};

export default UserMenu;
