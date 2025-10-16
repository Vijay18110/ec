import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import noCartImg from "../assets/Images/product/product-oder.jpg";
import CartSliderCart from "./CartSlider/CartSlider";
import { getProductCartData } from "../Utils/getCartList";
import { getloggedCartList } from "../Utils/getLoggedCartList";
import { cartActions } from "../Redux/Slices/cartSlice";
import { useNavigate } from "react-router-dom";
import Loader from "../ExternalLib/Loader/Loader";
import useApiRequest from "../Hooks/apiReq";
import ApiEncryptDecrypt from "../Utils/Encryption";
import axiosInstance from "../Utils/axiosInstance";
import { Key } from "../Utils/Key";
import { toast } from "react-toastify";
import { uiAction } from "../Redux/Slices/uiSlice";
const CartOffcanvas = () => {
  const dispatch = useDispatch();
  const { error, loading, response, sendApiRequest, status } = useApiRequest();
  const [loader, setLoader] = useState(false);
  const storeid = useSelector((state) => state.uireducer.storeid);
  const addressid = useSelector((state) => state.uireducer.addressid);
  const handleDeleteProduct = async (cartdata) => {
    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    try {
      if (loggedInUser) {
        setLoader(true);
        const encryptedData = await ApiEncryptDecrypt.encryptString(
          Key,
          JSON.stringify({
            CustomerId: loggedInUser?.CustomerId || "",
            MainCartId: 0,
            CartId: cartdata?.CartId,
          })
        );
        const jsonData = { Body: encryptedData };
        let res;
        res = await axiosInstance.post("/DeleteCustomerCart", jsonData);
        const decryptedRes = await ApiEncryptDecrypt.decryptString(
          Key,
          res.data.body
        );
        const obj = JSON.parse(decryptedRes);
        if (obj.Status === 0) {
          const { obj } = await getloggedCartList();
          const cartdata = obj?.Response?.lstCartData;
          dispatch(cartActions.setCartData(cartdata));
          setLoader(false);
        }
        // Handle different status codes
        if (obj.Status === 1) {
          toast.error(obj.Message);
        }
        if (obj.Status === 3) {
          dispatch(uiAction.openModal());
        }
      } else {
        const maincartid = localStorage.getItem("maincartid");

        setLoader(true);
        const encryptedData = await ApiEncryptDecrypt.encryptString(
          Key,
          JSON.stringify({
            CustomerId: loggedInUser?.CustomerId || "",
            MainCartId: maincartid,
            CartId: cartdata?.CartId,
          })
        );
        const jsonData = { Body: encryptedData };
        let res;
        res = await axiosInstance.post("/DeleteCustomerCart", jsonData);
        const decryptedRes = await ApiEncryptDecrypt.decryptString(
          Key,
          res.data.body
        );
        const obj = JSON.parse(decryptedRes);
        if (obj.Status === 0) {
          const responce = await getProductCartData();
          dispatch(cartActions.setCartData(responce?.Response?.lstCartData));
          setLoader(false);
        }
        // Handle different status codes
        if (obj.Status === 1) {
          toast.error(obj.Message);
        }
        if (obj.Status === 3) {
          dispatch(uiAction.openModal());
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const navigate = useNavigate();
  const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
  const cartData = useSelector((state) => state.cartreducer.cartData);

  const TotalAmount = useMemo(
    () =>
      cartData?.reduce(
        (acc, item) =>
          acc +
          parseInt(
            parseInt(item?.BillPrice) * item?.quantity -
            parseInt(
              (parseInt(item?.BillPrice) *
                (parseInt(item?.DiscountPercent) || 0)) /
              100
            ) +
            parseInt(item?.DeliveryCharge)
          ),
        0
      ),
    [cartData]
  );
  const countTotalPrice = useMemo(() => {
    return (
      cartData?.reduce(
        (prev, curr) =>
          prev + parseInt(Number(curr?.BillPrice ?? 0)) * curr?.quantity,
        0
      ) ?? 0
    );
  }, [cartData]);
  const countTotalMrp = useMemo(() => {
    return (
      cartData?.reduce(
        (prev, curr) =>
          prev + parseInt(Number(curr?.MRP ?? 0)) * curr?.quantity,
        0
      ) ?? 0
    );
  }, [cartData]);

  const DiscountMrp = useMemo(() => {
    return (
      cartData?.reduce(
        (acc, item) =>
          acc +
          Math.round(
            parseInt(Number(item?.MRP ?? 0)) * parseInt(item.quantity) -
            parseInt(Number(item?.BillPrice ?? 0)) * parseInt(item.quantity)
          ),
        0
      ) ?? 0
    );
  }, [cartData]);

  const DeleeryCharge = useMemo(
    () =>
      cartData?.reduce(
        (prev, curr) =>
          prev + parseInt(curr?.DeliveryCharge) * parseInt(curr?.quantity || 1),
        0
      ),
    [cartData]
  );
  return (
    <>
      <div
        className="offcanvas offcanvas-end p-2"
        tabIndex="-1"
        id="cartOffcanvas"
        aria-labelledby="cartOffcanvasLabel"
      >
        <div
          style={{ borderBottom: "1px solid lightgray" }}
          className="offcanvas-header"
        >
          <h5 className="offcanvas-title" id="cartOffcanvasLabel">
            My Cart ({cartData?.length}&nbsp;items)
          </h5>
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div
          style={
            cartData?.length < 1
              ? {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }
              : { undefined }
          }
          className={
            cartData?.length > 0
              ? "offcanvas-body ps-0 pe-0"
              : "offcanvas-body d-flex justify-content-center align-items-center ps-0 pe-0"
          }
        >
          {/* Wishlist content here */}
          {cartData?.length > 0 ? (
            cartData?.map((item, index) => {
              return (
                <CartSliderCart
                  item={item}
                  quantity={item?.quantity}
                  key={index}
                  img={item?.ProductThumbnail}
                  mrp={parseInt(item?.MRP)}
                  title={item?.ProductName}
                  price={parseInt(item?.BillingPrice)}
                  offer={parseInt(item?.DiscountPercent)}
                  handleDeleteProduct={handleDeleteProduct}
                />
              );
            })
          ) : (
            <div className="notwishlistcart">
              <div className="imgnocartcontainer">
                <img src={noCartImg} alt="nowishlist" />
              </div>
              <button
                onClick={() => navigate("/home")}
                className="btn btn-outline-success text-center"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              >
                Continue to shopping
              </button>
            </div>
          )}
        </div>
        {cartData?.length > 0 && (
          <div
            style={{ borderTop: "1px solid lightgray" }}
            className=" pt-2 offcanvas-footer"
          >
            <div className="d-flex justify-content-between">
              <small>SHIPPING : </small>
              <small>
                {" "}
                ₹
                {DeleeryCharge > 0
                  ? `${DeleeryCharge}`
                  : countTotalPrice >= 999
                    ? 0
                    : !storeid && addressid
                      ? 60
                      : 0}
              </small>
            </div>
            <div className="d-flex justify-content-between">
              <span className="fw-bold">TOTAL : </span>
              <span className="fw-bold">
                {" "}
                ₹
                {countTotalPrice +
                  (DeleeryCharge > 0
                    ? DeleeryCharge
                    : countTotalPrice >= 999
                      ? 0
                      : !storeid && addressid
                        ? 60
                        : 0)}
              </span>
            </div>

            <button
              data-bs-dismiss="offcanvas"
              aria-label="Close"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/customer-cart-details")}
              className="d-block  p-2 viewcartbutton"
            >
              View Cart
            </button>
          </div>
        )}
      </div>
      {(loader || loading) && <Loader />}
    </>
  );
};

export default CartOffcanvas;
