import React from "react";
import { Link } from "react-router-dom";
import imgForNoProductsFound from "../assets/Images/logo-m.png";
const ProductNotFound = ({ vh, fromSupportTicket
}) => {
  return (
    <div style={vh ? { maxHeight: "700px" } : fromSupportTicket ? { maxHeight: "285px" } : { undefined }} className={vh ? `container d-flex flex-column justify-content-center  align-items-center text-center px-3` : `container d-flex flex-column justify-content-center vh-100 align-items-center text-center px-3`}>
      <img
        src={imgForNoProductsFound}
        alt="Logo"
        className="mb-4"
        style={{ maxWidth: "200px" }}
      />
      {/* Custom illustration */}
      <h2 style={{ color: "#597545" }} className="mb-3  fw-bold">
        Oops, Record Not Found!
      </h2>
      <p className="text-secondary mb-4" style={{ maxWidth: "500px" }}>
        We couldn’t find the product you’re looking for. It might have been
        moved, deleted, or is temporarily unavailable.
      </p>

      <Link
        to="/home"
        className="btn btn-outline-success px-4 py-2 rounded-pill shadow-sm"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default ProductNotFound;
