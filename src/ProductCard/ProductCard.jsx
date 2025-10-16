
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import QuantityCounter from "../QtyCounter";
import { cartActions } from "../../Redux/Slices/cartSlice";
import { toast } from "react-toastify";
import { getProductCartData } from "../../Utils/getCartList";
import Loader from "../../ExternalLib/Loader/Loader";
import { getloggedCartList } from "../../Utils/getLoggedCartList";
import { chatAction } from "../../Redux/Slices/chatSlice";
import { IoIosStar, IoIosStarOutline } from "react-icons/io";
const ProductCard = ({
  img,
  name,
  subCatName,
  mrp,
  price,
  discount,
  cartdata,
  handleAddWishlist,
  w,
  rating, className, isOrganic
}) => {



  let cartData = useSelector((state) => state.cartreducer.cartData);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const handleProduct = async (data) => {
    if (loading) {
      return;
    }
    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    try {
      if (loggedInUser) {
        setLoading(true);
        dispatch(
          cartActions.handleAddProduct({ CartData: cartData, cartdata: data })
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
          cartActions.handleAddProduct({ CartData: cartData, cartdata: data })
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
  const handleSaveZoomPic = (img) => {
    dispatch(chatAction.setZoomPic(img));
  };
  function generateSlug(productName) {
    return encodeURIComponent(
      productName
        .toLowerCase()
        .replace(/'/g, "") // Remove apostrophes
        .replace(/[^a-z0-9\s-]/g, "") // Remove other special chars
        .replace(/\s+/g, "-") // Replace spaces with hyphens
    );
  }
  return (
    <>
      <div
        className={className ? className : w ? "mb-3 stocked" : "product-box stocked mb-3"}
        style={
          cartdata?.AvailQty < 1
            ? { opacity: "0.5", pointerEvents: "none" }
            : { undefined }
        }
      >
        <div className="axil-product">
          {cartdata?.AvailQty < 1 ? (
            <div className="offers">Out of Stock</div>
          ) : (
            cartdata?.IsCommingSoon == "True" && (
              <div className="offers2">Comming Soon</div>
            )
          )}
          {cartdata?.IsCommingSoon === "True" && cartdata?.AvailQty > 1 && (
            <div className="offers2">Comming Soon</div>
          )}
          <Link
            className="product-item"
            to={`/product-details/${btoa(cartdata?.ProductId)}/${cartdata?.URLText
              ? generateSlug(cartdata?.URLText)
              : null || generateSlug(cartdata?.ProductName)
              }`}
            style={{ height: "260px" }}
            onClick={() => handleRecentlyViewProduct(cartdata?.ProductId)}
          >
            <img
              loading="lazy"
              className="default-img"
              src={img}
              alt="RAV organics"
            />
            {/* <img loading="lazy" className='hover-img' src={HoverImg} alt='RAV organics' /> */}
          </Link>
          <div
            style={cartdata?.AvailQty < 1 ? { top: "39px" } : { top: "10px" }}
            className="quicklook-list"
          >
            {!isOrganic && <div
              className="single-action"
              data-flow="up"
              style={{ cursor: "pointer" }}
              onClick={() => handleAddWishlist(cartdata?.ProductId)}
              title="Add To Wishlist"
            >
              {wishlist?.filter(
                (item) => item?.ProductId === cartdata?.ProductId
              ).length > 0 ? (
                <i style={{ color: "red" }} className="fa-solid fa-heart"></i>
              ) : (
                <i className="fa-solid fa-heart"></i>
              )}
            </div>}

            {!isOrganic && <div
              onClick={() => handleSaveZoomPic(img)}
              className="single-action openuptip"
              title="Zoom"
              data-bs-toggle="modal"
              data-bs-target="#DetailsPopup"
            >
              <i className="fa-regular fa-magnifying-glass-plus"></i>
            </div>}
          </div>
          <div className="body-content">
            <Link
              to={`/product-details/${btoa(cartdata?.ProductId)}/${cartdata?.URLText || cartdata?.ProductName.replace()
                }`}
              onClick={() => handleRecentlyViewProduct(cartdata?.ProductId)}
            >
              <h4 title={name} className="title">{name}</h4>
            </Link>
            {rating && [1, 2, 3, 4, 5].map(it => {
              return it <= Number(Math.round(rating)) ? <i key={it}><IoIosStar color="#DE7921" size={20} /></i> : <i key={it}><IoIosStarOutline color="#DE7921" size={20} /></i>
            })} {rating && <small>({rating})</small>}
            {(price || mrp || discount) && <div className="price-area">
              {price && <span className="current">₹{parseInt(price)}</span>}
              {mrp && <div className="previous">MRP ₹ {parseInt(mrp)}</div>}
              {discount && <div className="offer-price">{parseInt(discount)}% OFF</div>}
            </div>}
            <div className="d-flex align-items-center justify-content-center">
              {cartdata?.AvailQty < 1 ? (
                <button onClick={handleMessage} className="addtocart">
                  Not Available
                </button>
              ) : JSON.parse(sessionStorage.getItem("loggedInUser")) ? (
                cartData?.find(
                  (it) => it?.ProductId === cartdata?.ProductId
                ) ? (
                  <QuantityCounter
                    cartdata={cartData.find(
                      (it) => it?.ProductId === cartdata?.ProductId
                    )}
                  />
                ) : cartdata?.IsCommingSoon === "True" ? (
                  <button className="addtocart1" disabled={true}>
                    {loading ? (
                      <div
                        className="spinner-border spinner-border-sm text-danger"
                        role="status"
                      />
                    ) : cartdata?.IsCommingSoon == "True" ? (
                      "Comming Soon "
                    ) : (
                      "Comming Soon"
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => handleProduct(cartdata)}
                    className="addtocart"
                    disabled={loading ? true : false}
                    style={
                      loading ? { cursor: "progress" } : { cursor: "pointer" }
                    }
                  >
                    {loading ? (
                      <div
                        className="spinner-border spinner-border-sm text-danger"
                        role="status"
                      />
                    ) : cartdata?.IsCommingSoon == "True" ? (
                      "Comming Soon "
                    ) : (
                      "Add to cart"
                    )}
                  </button>
                )
              ) : cartData?.find(
                (it) => it?.ProductId === cartdata?.ProductId
              ) ? (
                <QuantityCounter
                  cartdata={cartData.find(
                    (it) => it?.ProductId === cartdata?.ProductId
                  )}
                />
              ) :
                cartdata?.IsCommingSoon === "True" ? (
                  <button className="addtocart1" disabled={true}>
                    {loading ? (
                      <div
                        className="spinner-border spinner-border-sm text-danger"
                        role="status"
                      />
                    ) : cartdata?.IsCommingSoon == "True" ? (
                      "Comming Soon "
                    ) : (
                      "Comming Soon"
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => handleProduct(cartdata)}
                    className="addtocart"
                    disabled={loading ? true : false}
                    style={
                      loading ? { cursor: "progress" } : { cursor: "pointer" }
                    }
                  >
                    {loading ? (
                      <div
                        className="spinner-border spinner-border-sm text-danger"
                        role="status"
                      />
                    ) : cartdata?.IsCommingSoon == "True" ? (
                      "Comming Soon "
                    ) : (
                      "Add to cart"
                    )}
                  </button>
                )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCard;

