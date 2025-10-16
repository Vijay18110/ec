import React, { useState } from "react";
import nofound from '../../assets/Images/404.gif'
import { useNavigate } from "react-router-dom";
const NotFound = () => {
    const navigate = useNavigate()
  return (
    <>
      <div style={{textAlign: "center",padding: "50px"}}>
        <img
          src={nofound}
          alt="404 Page Not Found"
          style={{maxWidth:"560px"}}
        />
        <h2 style={{marginTop: "20px"}}>Oops! Page not found</h2>
        <p>The page you're looking for doesn't exist or has been moved.</p>
       <button  className="btn w-25 btn-outline-success" onClick={() => navigate("/")}>
            Go to Home
          </button>
      </div>
    </>
  );
};

export default NotFound;
