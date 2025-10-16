import React from "react";

const Navigation = ({moveOrderDetails,moveOrderlists,isReturn,isTrack}) => {
  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li style={{ cursor: "pointer" }} className="breadcrumb-item">
            <span onClick={moveOrderlists}>Order Lists</span>
          </li>
          <li style={{ cursor: "pointer" }} className="breadcrumb-item">
            <span onClick={moveOrderDetails}>Order Details</span>
          </li>
          {isReturn && (
            <li
              style={{ cursor: "pointer" }}
              className="breadcrumb-item active"
              aria-current="page"
            >
              {"Return Order"}
            </li>
          )}
          {isTrack && (
            <li
              style={{ cursor: "pointer" }}
              className="breadcrumb-item active"
              aria-current="page"
            >
              {"Track Order"}
            </li>
          )}
        </ol>
      </nav>
    </>
  );
};

export default Navigation;
