import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import comboImg from "../../assets/nofound.jpg";
import { useDispatch, useSelector } from "react-redux";
import ImageZoomer from "../../ExternalLib/ImageZoomer/ImageZoom";
import "../ProductDetails/ProductDetails.css";
import useApiRequest from "../../Hooks/apiReq";

import { toast } from "react-toastify";
import { cartActions } from "../../Redux/Slices/cartSlice";
import { getProductCartData } from "../../Utils/getCartList";
import { getloggedCartList } from "../../Utils/getLoggedCartList";
import QuantityCounter from "../../Shared/QtyCounter";
import { imageBaseURL } from "../../Utils/ImageBaseURL";

const ComboOfferDetails = () => {
  const cartData = useSelector((state) => state.cartreducer.cartData);
  const { search } = useLocation();
  const urldata = new URLSearchParams(search);
  const id = urldata.get("id");
  let comboOffer;

  const { error, loading, response, sendApiRequest } = useApiRequest();
  const {
    error: similarProductError,
    loading: similarProductLoading,
    response: similarProductResponce,
    sendApiRequest: similarProductSendApiRequiest,
  } = useApiRequest();
  const {
    error: comboProductError,
    loading: comboProductLoading,
    response: comboProductResponce,
    sendApiRequest: comboProductSendApiRequiest,
    status: combostatus,
  } = useApiRequest();
  useEffect(() => {
    sendApiRequest("POST", "/ProductDetail", {
      ProductID: comboOffer?.bigIntPKComboOfferId,
    });
    similarProductSendApiRequiest("POST", "/SimilarProductList", {
      ProductID: comboOffer?.bigIntPKComboOfferId,
    });
    comboProductSendApiRequiest("POST", "/GetComboProductOfferList", {
      PkOfferId: id,
    });
  }, [id]);

  useEffect(() => {
    window.scroll({ top: "0", behavior: "smooth" });
  }, [comboOffer?.bigIntPKComboOfferId]);

  //cart work

  const dispatch = useDispatch();
  //add to cart
  const [loader, setLoader] = useState(false);
  const handleProduct = async (data) => {
    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    try {
      if (loggedInUser) {
        setLoader(true);
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
            setLoader(false);
          }, 500);
        };
        setTimeout(() => {
          getdata();
        }, 500);
      } else {
        setLoader(true);
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
            setLoader(false);
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

  const [isError, setIsError] = useState(false);
  const handleDefault = () => {
    setIsError(true);
  };
  // console.log(comboOffer);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobileOrTablet(window.innerWidth <= 992); // ≤ 992px = tablet/mobile
    };
    checkScreen(); // initial check
    window.addEventListener("resize", checkScreen); // update on resize
    return () => window.removeEventListener("resize", checkScreen);
  }, []);
  // share functionality
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "My App",
          text: "Check out this cool link!",
          url: window.location.href,
        })
        .then(() => console.log("Shared successfully"))
        .catch((err) => console.error("Error sharing", err));
    } else {
      toast.error("Web Share API is not supported in your browser.");
    }
  };

  try {
    comboOffer = comboProductResponce?.lstComboOffer[0];
    if (typeof comboOffer.OfferDetail === "string") {
      comboOffer.OfferDetail = comboOffer.OfferDetail && JSON.parse(comboOffer.OfferDetail);
    }
  } catch (error) {
    console.error("Invalid combo offer data", error);
    return <div className="text-center text-bg-danger">Invalid combo data</div>;
  }
  // console.log("comboProductResponce", comboProductResponce);
  return (
    <div className="combo-offer-details my-4">
      <div className="container-fluid">
        <div className="rts-chop-details-area py-5">
          <div className="container">
            {comboOffer && (
              <div className="row">
                <div className="col-xl-6 d-flex justify-content-center col-lg-6 col-md-12 p-0">
                  <div className="product-details-img d-flex justify-content-center ">
                    {isMobileOrTablet ? (
                      <img
                        src={isError ? comboImg : `${imageBaseURL}/ResizeImageFromUrl?imageName=${comboOffer?.OfferImage}&&height=${812}&&q=${100}&&width=${812}`}
                        onError={handleDefault}
                        alt="product imgage"
                      />
                      // 
                    ) : (
                      <ImageZoomer
                        img={isError ? comboImg :  `${imageBaseURL}/ResizeImageFromUrl?imageName=${comboOffer?.OfferImage}&&height=${812}&&q=${100}&&width=${812}`}
                        previewImg={isError ? comboImg : `${imageBaseURL}/ResizeImageFromUrl?imageName=${comboOffer?.OfferImage}&&height=${812}&&q=${100}&&width=${812}`}
                        onError={handleDefault}
                      />
                    )}
                  </div>
                </div>
                <div className="col-xl-6 col-lg-6 col-md-12">
                  <div className="product-details-popup">
                    <div className="details-product-area">
                      <h2 className="product-title">{comboOffer?.ComboName}</h2>
                      <p className="d-flex mb-2 align-content-center">
                        <a href=""> {comboOffer?.ComboDiscription}</a>{" "}
                      </p>

                      <div className="product-price">
                        ₹{parseInt(comboOffer?.SalePrice)}
                        <span className="old-price ml--15">
                          MRP ₹{parseInt(comboOffer?.MRP)}
                        </span>
                      </div>

                      <div className="product-uniques d-flex ">
                        <div className="icon">
                          <i
                            className="fa-regular  fa-share-nodes"
                            onClick={handleShare}
                            style={{ cursor: "pointer" }}
                          ></i>
                        </div>
                        {JSON.parse(sessionStorage.getItem("loggedInUser")) ? (
                          cartData?.find(
                            (it) =>
                              it?.ProductId === comboOffer?.bigIntPKComboOfferId
                          ) ? (
                            <div style={{ maxWidth: "200px" }}>
                              <QuantityCounter
                                cartdata={cartData.find(
                                  (it) =>
                                    it?.ProductId ===
                                    comboOffer?.bigIntPKComboOfferId
                                )}
                              />
                            </div>
                          ) : (
                            <button
                              onClick={() => handleProduct(comboOffer)}
                              className="addtocart"
                            >
                              Add to cart
                            </button>
                          )
                        ) : cartData?.find(
                          (it) =>
                            it.ProductId === comboOffer?.bigIntPKComboOfferId
                        )?.qty > 0 ? (
                          <div style={{ maxWidth: "200px" }}>
                            <QuantityCounter cartdata={cartdata} />
                          </div>
                        ) : cartData?.find(
                          (it) =>
                            it?.ProductId === comboOffer?.bigIntPKComboOfferId
                        ) ? (
                          <div style={{ maxWidth: "200px" }}>
                            <QuantityCounter
                              cartdata={cartData.find(
                                (it) =>
                                  it?.ProductId ===
                                  comboOffer?.bigIntPKComboOfferId
                              )}
                            />
                          </div>
                        ) : (
                          <button
                            onClick={() => handleProduct(comboOffer)}
                            className="addtocart"
                          >
                            Add to cart
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="combo-details">
                    <div className="container-fluid">
                      <div className="style_look_product_heading">
                        <h4>Combo</h4>
                      </div>
                      <div className="combo">
                        <div className="combodetails">
                          <ul>
                            <li>
                              <div className="combo-list">
                                <div className="combo-list2">
                                  <div className="combo-list3">
                                   {comboOffer.OfferDetail?.map((item,index) => {
                                      return (
                                        <div key={index} className="axil-product" >
                                          <div className="thumbnail">
                                            <a>
                                              <div className="thumb">
                                                <img
                                                  src={`${imageBaseURL}/ResizeImageFromUrl?imageName=${item.ProductImage}&&height=${412}&&q=${70}&&width=${412}`}
                                                  alt=""
                                                />
                                              </div>
                                              {/*  */}
                                            </a>
                                          </div>
                                          <div className="product-content">
                                            <div className="inner">
                                              <a href="javascript:void(0);">
                                                <strong
                                                  title={item.Productname}
                                                >
                                                  {item.Productname}
                                                </strong>
                                              </a>
                                              <div className="product-price-variant">
                                                <span className="price text-decoration-line-through current-price">
                                                  ₹{item.numMRP}
                                                </span>
                                                &nbsp;&nbsp;
                                                <span className="price  current-price">
                                                  ₹{item.numPrice}
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComboOfferDetails;
