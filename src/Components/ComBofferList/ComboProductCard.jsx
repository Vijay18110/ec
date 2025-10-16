import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import QuantityCounter from "../../Shared/QtyCounter";
import { cartActions } from "../../Redux/Slices/cartSlice";
import { toast } from "react-toastify";
import { getProductCartData } from "../../Utils/getCartList";
import Loader from "../../ExternalLib/Loader/Loader";
import { getloggedCartList } from "../../Utils/getLoggedCartList";
import comboImg from "../../assets/nofound.jpg";
import { imageBaseURL } from "../../Utils/ImageBaseURL";

const ComboProductCard = ({
  img,
  name,
  subCatName,
  mrp,
  price,
  discount,
  cartdata,
  handleAddWishlist,
  w,
}) => {
  if (cartdata?.OfferDetail) {
    const details = JSON.parse(cartdata?.OfferDetail)
  }
  //cart work
  let cartData = useSelector((state) => state.cartreducer.cartData);
  const dispatch = useDispatch();
  //add to cart
  const [loading, setLoading] = useState(false);
  const handleProduct = async (data) => {
    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    try {
      if (loggedInUser) {
        setLoading(true);
        dispatch(
          cartActions.handleAddProduct({
            CartData: cartData,
            cartdata: data,
            combo: "combo",
          })
        );
        const getdata = async () => {
          const { obj } = await getloggedCartList();
          dispatch(cartActions.setCartData(obj?.Response?.lstCartData));
          setTimeout(() => {
            setLoading(false);
          }, 500);
        };
        setTimeout(() => {
          getdata();
        }, 500);
      } else {
        setLoading(true);
        dispatch(
          cartActions.handleAddProduct({
            CartData: cartData,
            cartdata: data,
            combo: "combo",
          })
        );
        const getdata = async () => {
          const responce = await getProductCartData();
          dispatch(cartActions.setCartData(responce?.Response?.lstCartData));
          setTimeout(() => {
            setLoading(false);
          }, 1000);
        };
        setTimeout(() => {
          getdata();
        }, 500);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleMessage = () => {
    toast.warning("Product Not Available");
  };
  const wishlist = useSelector((state) => state.wishlistreducer.wishlist);
  // Recently View Product Apis
  const handleRecentlyViewProduct = (productid) => {
    const viewProduct = JSON.parse(localStorage.getItem("viewproduct")) || [];
    const isExist = viewProduct?.find((item) => item?.ProductId == productid);
    if (isExist) {
      return;
    }
    viewProduct.push({ ProductId: productid });
    localStorage.setItem("viewproduct", JSON.stringify(viewProduct));
  };
  // console.log(cartdata);
  const [isError, setIsError] = useState(false)
  const handleDefault = () => {
    setIsError(true)
  }
  return (
    <div
      className={w ? "mb-3" : "product-box mb-3"}
      style={
        cartdata?.AvailQty < 1
          ? { opacity: "0.5", pointerEvents: "none" }
          : { undefined }
      }
    >
      <div className="axil-product">
        {cartdata?.AvailQty < 1 && <div className="offers">Out of Stock</div>}
        <Link
          className="product-item"
          to={`/combo-product-details/?id=${cartdata?.bigIntPKComboOfferId}`}
          style={{ height: "300px" }}
          onClick={() => handleRecentlyViewProduct(cartdata?.ProductId)}
        >
          <img
            loading="lazy"
            className="default-img"
            src={isError ? comboImg :`${imageBaseURL}/ResizeImageFromUrl?imageName=${cartdata?.OfferImage}&&height=${612}&&q=${100}&&width=${612}`}
            onError={handleDefault}
            alt="RAV organics"
          />
         
        </Link>
        <div className="quicklook-list">
        </div>
        <div className="body-content">
          <Link
            to={`/combo-product-details/?id=${cartdata?.bigIntPKComboOfferId}`}
            onClick={() => handleRecentlyViewProduct(cartdata?.ProductId)}
          >
            <h4 style={{ minHeight: "auto" }} className="title mb-0">
              {cartdata?.ComboName}
            </h4>
          </Link>
          <div className="d-flex align-items-center justify-content-between">
            <div className="price-area">
              <span className="current">
                ₹{parseInt(Number(cartdata?.SalePrice))}
              </span>
              <div className="previous">
                MRP ₹ {parseInt(Number(cartdata?.MRP))}
              </div>
            </div>
            {cartdata?.AvailQty < 1 ? (
              <button onClick={handleMessage} className="addtocart">
                Not Available
              </button>
            ) : JSON.parse(sessionStorage.getItem("loggedInUser")) ? (
              cartData?.find(
                (it) => it?.ProductId === cartdata?.bigIntPKComboOfferId
              ) ? (
                <QuantityCounter
                  cartdata={cartData.find(
                    (it) => it?.ProductId === cartdata?.bigIntPKComboOfferId
                  )}
                  isCombo={true}
                />
              ) : (
                <button
                  onClick={() => handleProduct(cartdata)}
                  className="addtocart"
                >
                  {loading ? (
                    <div
                      className="spinner-border spinner-border-sm text-danger"
                      role="status"
                    />
                  ) : (
                    "Add to cart"
                  )}
                </button>
              )
            ) : cartData?.find(
              (it) => it?.ProductId === cartdata?.bigIntPKComboOfferId
            ) ? (
              <QuantityCounter
                cartdata={cartData.find(
                  (it) => it?.ProductId === cartdata?.bigIntPKComboOfferId
                )}
                isCombo={true}
              />
            ) : (
              <button
                onClick={() => handleProduct(cartdata)}
                className="addtocart"
              >
                {loading ? (
                  <div
                    className="spinner-border spinner-border-sm text-danger"
                    role="status"
                  />
                ) : (
                  "Add to cart"
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComboProductCard;
