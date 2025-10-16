import React, { useEffect } from "react";
import Header from "../../Components/Header/Header";
import useApiRequest from "../../Hooks/apiReq";
import { useDispatch, useSelector } from "react-redux";
import { cartActions } from "../../Redux/Slices/cartSlice";
import Footer from "../../Components/Footer/Footer";
import { getProductCartData } from "../../Utils/getCartList";
import ApiEncryptDecrypt from "../../Utils/Encryption";
import { Key } from "../../Utils/Key";
import axiosInstance from "../../Utils/axiosInstance";
import { toast } from "react-toastify";
import { getloggedCartList } from "../../Utils/getLoggedCartList";
import { chatAction } from "../../Redux/Slices/chatSlice";
import Loader from "../../ExternalLib/Loader/Loader";
import { useLoaderData } from "react-router-dom";
const Private = ({ children }) => {





  return (
    <div>
      {/* <div style={{ zIndex: "99" }} className="sticky-top ">
      </div> */}
      <Header />
      {children}
      {/* <div>
        <Footer />
      </div> */}
      {/* {cartloader && <Loader />} */}
    </div>
  );
};

export default Private;
