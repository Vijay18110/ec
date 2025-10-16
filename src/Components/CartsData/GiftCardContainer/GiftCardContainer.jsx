import React from "react";
import InputBox from "../../../Widgets/InputBox/InputBox";

const GiftCardContainer = () => {
  return (
    <>
      <div className="d-flex justify-content-between px-3 mt-3 align-items-center gap-3">
        <div style={{ width: "80%" }}>
          <InputBox placeholder="Enter Coupan Code" />
        </div>
        <span
          className="fs-5"
          style={{
            display: "inline-block",
            width: "20%",
            height: "0%",
            marginTop: "15px",
            justifyContent: "center",
            cursor:"pointer"
          }}
        >
          Apply
        </span>
      </div>
    </>
  );
};

export default GiftCardContainer;
