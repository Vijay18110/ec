import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import img from "../../../assets/Images/logo-m.png";
import { uiAction } from "../../../Redux/Slices/uiSlice";

const OrderSuccess = ({ orderId }) => {
      const {search} = useLocation()
    const query = new URLSearchParams(search)
    const id = atob(query.get("id"))
  const navigate = useNavigate();
  const handleOrderlist = () => {
    navigate("/my-profile");
    dispatch(uiAction.settabs("myOrders"));
  };
  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div
        className="card text-center shadow-lg p-4 border-success"
        style={{ maxWidth: "620px", borderRadius: "10px" }}
      >
        <div className="card-body">
          <img
            src={img} // Replace with your actual logo URL
            alt="RAVOrganics Logo"
            className="mb-3"
            style={{ width: "250px" }}
          />
          <h2 className="text-success fw-bold">🎉 Congratulations!🎉</h2>
          <h2 className="text-success fw-bold">Order Placed Successfully!</h2>
          <p className="text-muted">
            Thank you for shopping with <strong>RAVOrganics</strong>.
          </p>

          <h5 className="mt-3">Order Number:</h5>
          <p className="text-primary fs-5">#{id}</p>

          <div className="d-grid gap-2 mt-4">
            <button
              className="btn btn-outline-success"
              onClick={() => navigate("/home")}
            >
              Go to Home
            </button>
            <button className="btn btn-success" onClick={handleOrderlist}>
              View My Orders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
