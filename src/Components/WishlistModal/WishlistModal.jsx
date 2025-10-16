import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import WishlistCart from "./WishlistCart/WishlistCart";
import ApiEncryptDecrypt from "../../Utils/Encryption";
import axiosInstance from "../../Utils/axiosInstance";
import { Key } from "../../Utils/Key";
import { wishlistActions } from "../../Redux/Slices/wishlistSlice";
import { getWishlist } from "../../Utils/getWishlist";
import { uiAction } from "../../Redux/Slices/uiSlice";
import { toast } from "react-toastify";
import { cartActions } from "../../Redux/Slices/cartSlice";
import { getloggedCartList } from "../../Utils/getLoggedCartList";
import noCartImg from "../../assets/Images/product/product-oder.jpg";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Loader from "../../ExternalLib/Loader/Loader";
const WishlistOffcanvas = () => {
  const navigate = useNavigate();
  const wishlist = useSelector((state) => state.wishlistreducer.wishlist);
  const cartData = useSelector((state) => state.cartreducer.cartData);
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const handleDeleteWishlists = async (productid) => {
    setLoader(true);
    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    const encryptedData = await ApiEncryptDecrypt.encryptString(
      Key,
      JSON.stringify({
        CustomerId: loggedInUser?.CustomerId,
        ProductID: productid,
      })
    );
    const jsonData = { Body: encryptedData };
    let res;
    res = await axiosInstance.post("/DeleteCustomerWish", jsonData);
    const decryptedRes = await ApiEncryptDecrypt.decryptString(
      Key,
      res.data.body
    );
    const obj = JSON.parse(decryptedRes);
    if (obj.Status === 0) {
      const responce = await getWishlist();
      dispatch(
        wishlistActions.setWishlist(responce?.obj?.Response?.lstWishData)
      );
      setLoader(false);
    }
    // Handle different status codes
    if (obj.Status === 1) {
      toast.error(obj.Message);
    }
    if (obj.Status === 3) {
      dispatch(uiAction.openModal());
    }
    setLoader(false);
  };
  const handleMoveTocart = async (data) => {
    setLoader(true);
    const isExist = cartData.find((item) => item.ProductId == data.ProductId);
    if (isExist) {
      Swal.fire({
        icon: "warning",
        text: "Already added to cart",
      });
      setLoader(false);
      return;
    }
    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    if (loggedInUser) {
      dispatch(
        cartActions.handleAddProduct({ CartData: cartData, cartdata: data })
      );
      const getdata = async () => {
        const { obj } = await getloggedCartList();
        dispatch(cartActions.setCartData(obj?.Response?.lstCartData));
        setLoader(false);
      };
      setTimeout(() => {
        getdata();
      }, 400);
    }
    handleDeleteWishlists(data.ProductId);
  };
  const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));

  return (
    <>
      <div
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id="wishlistOffcanvas"
        aria-labelledby="wishlistOffcanvasLabel"
      >
        <div
          style={{ borderBottom: "1px solid lightgray" }}
          className="offcanvas-header"
        >
          <h5 className="offcanvas-title" id="wishlistOffcanvasLabel">
            My Wishlist ({wishlist?.length}&nbsp;items)
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
            wishlist?.length < 1
              ? {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }
              : { undefined }
          }
          className="offcanvas-body ps-0 pe-0"
        >
          {/* Wishlist content here */}
          {wishlist?.length > 0 ? (
            wishlist?.map((item, index) => {
              return (
                <WishlistCart
                  item={item}
                  handleDeleteWishlists={handleDeleteWishlists}
                  handleMoveTocart={handleMoveTocart}
                  key={index}
                  img={item?.ProductThumbnail}
                  mrp={parseInt(item?.MRP)}
                  title={item?.ProductName}
                  price={parseInt(item?.Price)}
                  offer={parseInt(item?.DiscountPercent)}
                />
              );
            })
          ) : (
            <div className="notwishlistcart">
              <div className="imgnocartcontainer">
                <img src={noCartImg} alt="nowishlist" />
              </div>
              <button
                onClick={() =>
                  loggedInUser
                    ? navigate("/home")
                    : dispatch(uiAction.openModal())
                }
                className="btn btn-outline-success text-center"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
                style={{ cursor: "pointer" }}
              >
                {loggedInUser ? "Continue" : "Login to Your Account"}
              </button>
            </div>
          )}
        </div>
      </div>
      {loader && <Loader />}
    </>
  );
};

export default WishlistOffcanvas;
