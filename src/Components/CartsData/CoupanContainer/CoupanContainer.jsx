import React, { useEffect, useState } from "react";
import Coupan from "./CoupanCart/Coupan";
import { uiAction } from "../../../Redux/Slices/uiSlice";
import useApiRequest from "../../../Hooks/apiReq";
import { toast } from "react-toastify";
import Loader from "../../../ExternalLib/Loader/Loader";
import axiosInstance from "../../../Utils/axiosInstance";
import { Key } from "../../../Utils/Key";
import ApiEncryptDecrypt from "../../../Utils/Encryption";
import ProductNotFound from "../../ProductNotFound";
const CoupanContainer = () => {
  //coupan list api handler
  const {
    error: coupanListError,
    loading: coupanListLoading,
    response: coupanListResponce,
    sendApiRequest: coupanListSendApiRequest,
    status: coupanListStatus,
  } = useApiRequest();
  const getCoupanList = () => {
    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    if (loggedInUser) {
      coupanListSendApiRequest("POST", "/CustomerCouponList", {
        CustomerId: loggedInUser.CustomerId,
        CouponStatus: "",
      });
    } else {
      dispatch(uiAction.openModal());
    }
  };
  useEffect(() => {
    getCoupanList();
  }, []);
  const [response,setResponce]=useState([])
  const [loader, setLoader] = useState(false);
  
  const handleApplyCoupan = async(id) => {
    try {
      const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
      if (loggedInUser) {
      setLoader(true);
       const userData = {
            CustomerId: loggedInUser?.CustomerId,
            CouponID: id,
            IpAddress: "",
          }
    const encryptedData = await ApiEncryptDecrypt.encryptString(
      Key,
      JSON.stringify({ ...userData })
    );
    const jsonData = { Body: encryptedData };
    let res;

    res = await axiosInstance.post("/CustomerApplyCoupon", jsonData);

    const decryptedRes = await ApiEncryptDecrypt.decryptString(
      Key,
      res.data.body
    );
    const obj = JSON.parse(decryptedRes);

    if (obj.Status === 0) {
      setResponce(obj.Response)
      getCoupanList()
    }
    if (obj.Status === 1) {
      toast.error(obj.Message);
    }
    if (obj.Status === 3) {
      dispatch(uiAction.openModal());
    }
      } else {
        dispatch(uiAction.openModal());
      }
    } catch (error) {
      toast.error(error.Message);
      (error);
    }finally{setLoader(false)}
  };
  const handleSelect = (status) => {
    
    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    if (loggedInUser) {
      coupanListSendApiRequest("POST", "/CustomerCouponList", {
        CustomerId: loggedInUser.CustomerId,
        CouponStatus: status,
      });
    } else {
      dispatch(uiAction.openModal());
    }
  };

  return (
    <>
    <div className="my-4">
     <h4 className="mb-3">Coupons/Vouchers</h4>
      <div className="card p-4">
        <div className="col-12 mb-4">
          <select
            className="form-select"
            onChange={(e) => handleSelect(e.target.value)}
            aria-label="Default select example"
          >
            <option value="" defaultValue={true}>All</option>
            <option value="Y">Active</option>
            <option value="R">Reedeem</option>
          </select>
        </div>
        <div className="row">
          {coupanListResponce?.lstCouponData.length > 0
            ? coupanListResponce?.lstCouponData?.map((item, index) => {
                return (
                  <Coupan
                    data={item}
                    key={index}
                    handleApplyCoupan={handleApplyCoupan}
                  />
                );
              })
            : !coupanListLoading && (
                <ProductNotFound vh={true}/>
              )}
        </div>
        {(coupanListLoading || loader ) && <Loader />}
      </div>
      </div>
    </>
  );
};

export default CoupanContainer;
