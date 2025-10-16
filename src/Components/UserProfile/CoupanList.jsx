import React, { useEffect } from "react";
import CoupanContainer from "../CartsData/CoupanContainer/CoupanContainer";
import { uiAction } from "../../Redux/Slices/uiSlice";
import useApiRequest from "../../Hooks/apiReq";

const CoupanList = () => {

  return (
    <>
      <div className="w-100  ">
        <CoupanContainer />
      </div>
    </>
  );
};

export default CoupanList;
