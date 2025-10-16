import React from "react";
import { Link } from "react-router-dom";

const BreadCrumb = () => {
  return (
    <>
      <div className="rts-navigation-area-breadcrumb">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="navigator-breadcrumb-wrapper">
                <Link to="/home">Home</Link>
                <i className="fa-regular fa-chevron-right"></i>
                <a className="current" style={{cursor:"pointer"}}>
                  Cart
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BreadCrumb;
