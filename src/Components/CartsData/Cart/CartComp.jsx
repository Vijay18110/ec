// // import React, { useState } from "react";

// // import "./CartComp.css";
// // import {
// //   cartActions,
// //   handleRemoveProductFromCart,
// // } from "../../../Redux/Slices/cartSlice";
// // import { useDispatch, useSelector } from "react-redux";
// // import { getProductCartData } from "../../../Utils/getCartList";
// // import QuantityCounter from "../../../Shared/QtyCounter";
// // import useApiRequest from "../../../Hooks/apiReq";
// // import { getloggedCartList } from "../../../Utils/getLoggedCartList";
// // import { Link, useNavigate } from "react-router-dom";
// // import Loader from "../../../ExternalLib/Loader/Loader";
// // import { addressAction } from "../../../Redux/Slices/addressSlice";
// // import noimage from '../../../assets/Images/noimage.avif'
// // const CartComp = ({
// //   img,
// //   name,
// //   subname,
// //   price,
// //   mrp,
// //   discount,
// //   iscod,
// //   item,
// //   handleAddWishlist,
// //   Checkout,
// //   isAvailable = true,
// //   checkAvailability,
// // }) => {
// //   const dispatch = useDispatch();
// //   const { error, loading, response, sendApiRequest, status } = useApiRequest();
// //   const [loader, setLoader] = useState(false);
// //   const handleDeleteProduct = async (cartdata) => {
// //     const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
// //     try {
// //       if (loggedInUser) {
// //         dispatch(addressAction.setDeleteLoader(true));
// //         sendApiRequest(
// //           "POST",
// //           "/DeleteCustomerCart",
// //           {
// //             CustomerId: loggedInUser?.CustomerId || "",
// //             MainCartId: 0,
// //             CartId: cartdata?.CartId,
// //           },
// //           ""
// //         );
// //         const getdata = async () => {
// //           const { obj } = await getloggedCartList();
// //           const cartdata = obj?.Response?.lstCartData;
// //           dispatch(cartActions.setCartData(cartdata));

// //           if (cartdata && cartdata.length > 0) {
// //             dispatch(cartActions.setCartData(cartdata));
// //             setTimeout(() => {
// //               dispatch(addressAction.setDeleteLoader(false));
// //               checkAvailability();
// //             }, 1000);
// //           }
// //         };
// //         setTimeout(() => {
// //           getdata();

// //         }, 400);
// //       } else {
// //         dispatch(addressAction.setDeleteLoader(true));

// //         const maincartid = localStorage.getItem("maincartid");
// //         sendApiRequest(
// //           "POST",
// //           "/DeleteCustomerCart",
// //           {
// //             CustomerId: loggedInUser?.CustomerId || "",
// //             MainCartId: maincartid,
// //             CartId: cartdata?.CartId,
// //           },
// //           ""
// //         );

// //       }
// //       const getdata = async () => {
// //         const responce = await getProductCartData();
// //         dispatch(cartActions.setCartData(responce?.Response?.lstCartData));
// //         setTimeout(() => {
// //           checkAvailability();
// //           dispatch(addressAction.setDeleteLoader(false));
// //         }, 1000);
// //       };
// //       setTimeout(() => {
// //         getdata();
// //       }, 0);
// //     } catch (error) {
// //       console.log(error.message);
// //     }

// //   };
// //   const wishlist = useSelector((state) => state.wishlistreducer.wishlist);

// //   function generateSlug(productName) {
// //     return encodeURIComponent(
// //       productName
// //         .toLowerCase()
// //         .replace(/'/g, "") // Remove apostrophes
// //         .replace(/[^a-z0-9\s-]/g, "") // Remove other special chars
// //         .replace(/\s+/g, "-") // Replace spaces with hyphens
// //     );
// //   }
// //   const navigate = useNavigate()
// //   const handleDetails = async (i) => {
// //     if ((i.CategoryName === "COMBOOFFER") || (i.CategoryName === "COMBO")) {
// //       // console.log("comnboData", i);
// //       navigate(`/combo-product-details/?id=${i.OfferId}`);
// //       return;
// //     }
// //     navigate(
// //       `/product-details/${btoa(i?.ProductId)}/${i?.URLText ? generateSlug(i?.URLText) : generateSlug(i?.ProductName)
// //       }`
// //     );
// //   };
// //   const [isError, setIsError] = useState(false)
// //   const handleImageError = () => {
// //     setIsError(!isError)
// //   }
// //   return (
// //     <>
// //       <li className={`base-class ${!isAvailable ? "disable" : ""}`}>
// //         <div
// //           style={{
// //             position: "relative",
// //             zIndex: 0,
// //             pointerEvents: !isAvailable ? "none" : "auto",
// //           }}
// //         >
// //           <div className="cart_line-item-top">
// //             <div className="cart_line-item-left">
// //               <img loading="lazy" src={isError ? noimage : img} onError={handleImageError} alt="RAV organics" />
// //             </div>
// //             <div className="cart_line-item-right">
// //               {Checkout ? (
// //                 <span>{name}</span>
// //               ) : (
// //                 <span
// //                   onClick={() => handleDetails(item)}
// //                   style={{ cursor: "pointer" }}
// //                   className="line-item-title"
// //                 >
// //                   {name}
// //                 </span>
// //               )}
// //               <div className="price-list">
// //                 <span className="line-item">{price ?? 0}</span>
// //                 <span className="price-compare">{mrp ?? 0}</span>
// //                 <span className="item-saving">{discount ?? 0} % OFF</span>
// //               </div>
// //               {Checkout && (
// //                 <p style={{ fontSize: "12px" }} className="m-0 ">
// //                   No of items :{" "}
// //                   <span className="fw-bold">{item?.quantity}</span>
// //                 </p>
// //               )}
// //               {!Checkout && (
// //                 <div
// //                   className="product-bottom-action"
// //                   style={{ position: "relative", zIndex: 2 }}
// //                 >
// //                   <div className="cart-edits">
// //                     <QuantityCounter cartdata={item} />
// //                   </div>
// //                 </div>
// //               )}
// //             </div>
// //           </div>
// //         </div>
// //         {!Checkout && (
// //           <div
// //             className="qnty-bottom d-flex justify-content-between"
// //             style={{ position: "relative", zIndex: 2 }}
// //           >
// //             {!["COMBO", "COMBOOFFER"].includes(subname) && (
// //               <span
// //                 className="line-item-wishlist"
// //                 onClick={() => handleAddWishlist(item.ProductId)}
// //                 style={{ cursor: "pointer" }}
// //               >
// //                 {wishlist?.some((it) => it.ProductId === item.ProductId) ? (
// //                   <i style={{ color: "red" }} className="fa-solid fa-heart"></i>
// //                 ) : (
// //                   <i
// //                     style={{ color: "#fff" }}
// //                     className="fa-solid fa-heart"
// //                   ></i>
// //                 )}
// //               </span>
// //             )}
// //             <span className="line-item-wishlist" style={{ cursor: "pointer" }}>
// //               <a onClick={() => handleDeleteProduct(item)}>
// //                 <i className="fa-sharp fa-regular fa-trash"></i>
// //               </a>
// //             </span>
// //           </div>
// //         )}

// //         {(loading || loader) && <Loader />}
// //       </li>
// //     </>
// //   );
// // };

// // export default CartComp;
// import React, { useMemo, useState } from "react";

// import "./CartComp.css";
// import {
//   cartActions,
//   handleRemoveProductFromCart,
// } from "../../../Redux/Slices/cartSlice";
// import { useDispatch, useSelector } from "react-redux";
// import { getProductCartData } from "../../../Utils/getCartList";
// import QuantityCounter from "../../../Shared/QtyCounter";
// import useApiRequest from "../../../Hooks/apiReq";
// import { getloggedCartList } from "../../../Utils/getLoggedCartList";
// import { Link, useNavigate } from "react-router-dom";
// import Loader from "../../../ExternalLib/Loader/Loader";
// import { addressAction } from "../../../Redux/Slices/addressSlice";
// import noimage from "../../../assets/Images/noimage.avif";
// import PreviewImage from "../../../ExternalLib/PreviewImage/PreviewImage.jsx";
// import { IoInformationCircle } from "react-icons/io5";
// import offerpic from '../../../assets/offerpic.png'
// import info from "../../../assets/info.webp";

// const CartComp = ({
//   img,
//   name,
//   subname,
//   price,
//   mrp,
//   discount,
//   iscod,
//   item,
//   handleAddWishlist,
//   Checkout,
//   isAvailable = true,
//   checkAvailability,
// }) => {
//   const dispatch = useDispatch();
//   const { error, loading, response, sendApiRequest, status } = useApiRequest();

//   const handleDeleteProduct = async (cartdata) => {
//     const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
//     try {
//       if (loggedInUser) {
//         dispatch(addressAction.setDeleteLoader(true));
//         sendApiRequest(
//           "POST",
//           "/DeleteCustomerCart",
//           {
//             CustomerId: loggedInUser?.CustomerId || "",
//             MainCartId: 0,
//             CartId: cartdata?.CartId,
//           },
//           ""
//         );
//         const getdata = async () => {
//           const { obj } = await getloggedCartList();
//           const cartdata = obj?.Response?.lstCartData;
//           dispatch(cartActions.setCartData(cartdata));

//           if (cartdata && cartdata.length > 0) {
//             dispatch(cartActions.setCartData(cartdata));
//             setTimeout(() => {
//               dispatch(addressAction.setDeleteLoader(false));
//               checkAvailability();
//             }, 1000);
//           }
//         };
//         setTimeout(() => {
//           getdata();
//         }, 400);
//       } else {
//         dispatch(addressAction.setDeleteLoader(true));

//         const maincartid = localStorage.getItem("maincartid");
//         sendApiRequest(
//           "POST",
//           "/DeleteCustomerCart",
//           {
//             CustomerId: loggedInUser?.CustomerId || "",
//             MainCartId: maincartid,
//             CartId: cartdata?.CartId,
//           },
//           ""
//         );
//       }
//       const getdata = async () => {
//         const responce = await getProductCartData();
//         dispatch(cartActions.setCartData(responce?.Response?.lstCartData));
//         setTimeout(() => {
//           checkAvailability();
//           dispatch(addressAction.setDeleteLoader(false));
//         }, 1000);
//       };
//       setTimeout(() => {
//         getdata();
//       }, 0);
//     } catch (error) {
//       console.log(error.message);
//     }
//   };
//   const wishlist = useSelector((state) => state.wishlistreducer.wishlist);
//   function generateSlug(productName) {
//     return encodeURIComponent(
//       productName
//         .toLowerCase()
//         .replace(/'/g, "") // Remove apostrophes
//         .replace(/[^a-z0-9\s-]/g, "") // Remove other special chars
//         .replace(/\s+/g, "-") // Replace spaces with hyphens
//     );
//   }
//   const navigate = useNavigate();
//   const handleDetails = async (i) => {
//     if (i.CategoryName === "COMBOOFFER" || i.CategoryName === "COMBO") {
//       navigate(`/combo-product-details/?id=${i.OfferId}`);
//       return;
//     }
//     navigate(
//       `/product-details/${btoa(i?.ProductId)}/${i?.URLText ? generateSlug(i?.URLText) : generateSlug(i?.ProductName)
//       }`
//     );
//   };
//   const [isError, setIsError] = useState(false);
//   const handleImageError = () => {
//     setIsError(!isError);
//   };
//   const [isImage, setIsImage] = useState(false)
//   const handleInfo = () => {
//     setIsImage(true)
//   }
//   return (
//     <>
//       <li className={`base-class ${!isAvailable ? "disable" : ""}`}>
//         <div
//           style={{
//             position: "relative",
//             zIndex: 0,
//             pointerEvents: !isAvailable ? "none" : "auto",
//           }}
//         >
//           <div className="cart_line-item-top">
//             <div className="cart_line-item-left position-relative">
//               {item?.OfferId !== "0" && (item?.OfferId != item.ProductId) && (
//                 <div className="offertag position-absolute ">
//                   <img
//                     style={{ width: "100%" }}
//                     src={offerpic}
//                     alt="offerpic"
//                   />
//                 </div>
//               )}
//               <img
//                 loading="lazy"
//                 src={isError ? noimage : img}
//                 onError={handleImageError}
//                 alt="RAV organics"
//               />
//             </div>
//             <div className="cart_line-item-right">
//               {Checkout ? (
//                 <span>{name}</span>
//               ) : (
//                 <span
//                   onClick={() => handleDetails(item)}
//                   style={{ cursor: "pointer" }}
//                   className="line-item-title"
//                 >
//                   {name}
//                 </span>
//               )}
//               {item?.OfferId !== "0" && item?.OfferId != item.ProductId && (
//                 <div className="price-list">
//                   <span className="line-item">{item?.OfferName}</span>
//                   <PreviewImage
//                     style={{
//                       height: "25px",
//                       maxWidth: "25px",
//                       borderRadius: "50%",
//                     }}
//                     newPic={info}
//                     imgwithUrl={item?.OfferImage}
//                   />
//                 </div>
//               )}
//               <div className="price-list">
//                 <span className="line-item">{price ?? 0}</span>
//                 <span className="price-compare">{mrp ?? 0}</span>
//                 <span className="item-saving">{discount ?? 0} % OFF</span>
//               </div>

//               <p style={{ fontSize: "12px" }} className="m-0 ">
//                 QTY :{" "}
//                 <span className="fw-bold text-success">{item?.quantity}</span>{" "}
//                 Total :
//                 <span className="fw-bold text-success">
//                   {price * Number(item?.quantity)}
//                 </span>
//               </p>

//               {!Checkout && (
//                 <div
//                   className="product-bottom-action"
//                   style={{ position: "relative", zIndex: 2 }}
//                 >
//                   <div className="cart-edits">
//                     <QuantityCounter cartdata={item} />
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//         {!Checkout && (
//           <div
//             className="qnty-bottom d-flex justify-content-between"
//             style={{ position: "relative", zIndex: 2 }}
//           >
//             {!["COMBO", "COMBOOFFER"].includes(subname) && (
//               <span
//                 className="line-item-wishlist"
//                 onClick={() => handleAddWishlist(item.ProductId)}
//                 style={{ cursor: "pointer" }}
//               >
//                 {wishlist?.some((it) => it.ProductId === item.ProductId) ? (
//                   <i style={{ color: "red" }} className="fa-solid fa-heart"></i>
//                 ) : (
//                   <i
//                     style={{ color: "#fff" }}
//                     className="fa-solid fa-heart"
//                   ></i>
//                 )}
//               </span>
//             )}
//             <span className="line-item-wishlist" style={{ cursor: "pointer" }}>
//               <a onClick={() => handleDeleteProduct(item)}>
//                 <i className="fa-sharp fa-regular fa-trash"></i>
//               </a>
//             </span>
//           </div>
//         )}

//         {loading && <Loader />}
//       </li>
//     </>
//   );
// };

// export default CartComp;
import React, { useMemo, useState } from "react";

import "./CartComp.css";
import {
  cartActions,
  handleRemoveProductFromCart,
} from "../../../Redux/Slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { getProductCartData } from "../../../Utils/getCartList";
import QuantityCounter from "../../../Shared/QtyCounter";
import useApiRequest from "../../../Hooks/apiReq";
import { getloggedCartList } from "../../../Utils/getLoggedCartList";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../../ExternalLib/Loader/Loader";
import { addressAction } from "../../../Redux/Slices/addressSlice";
import noimage from "../../../assets/Images/noimage.avif";
import offerpic from "../../../assets/offerpic.png";
import { IoInformationCircle } from "react-icons/io5";
import PreviewImage from "../../../ExternalLib/PreviewImage/PreviewImage.jsx";
import info from "../../../assets/info.webp";
import { imageBaseURL } from "../../../Utils/ImageBaseURL.js";

const CartComp = ({
  img,
  name,
  subname,
  price,
  mrp,
  discount,
  iscod,
  item,
  handleAddWishlist,
  Checkout,
  isAvailable = true,
  checkAvailability,
}) => {
  const dispatch = useDispatch();
  const { error, loading, response, sendApiRequest, status } = useApiRequest();

  const handleDeleteProduct = async (cartdata) => {
    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    try {
      if (loggedInUser) {
        dispatch(addressAction.setDeleteLoader(true));
        sendApiRequest(
          "POST",
          "/DeleteCustomerCart",
          {
            CustomerId: loggedInUser?.CustomerId || "",
            MainCartId: 0,
            CartId: cartdata?.CartId,
          },
          ""
        );
        const getdata = async () => {
          const { obj } = await getloggedCartList();
          const cartdata = obj?.Response?.lstCartData;
          dispatch(cartActions.setCartData(cartdata));

          if (cartdata && cartdata.length > 0) {
            dispatch(cartActions.setCartData(cartdata));
            setTimeout(() => {
              dispatch(addressAction.setDeleteLoader(false));
              checkAvailability();
            }, 1000);
          }
        };
        setTimeout(() => {
          getdata();
        }, 400);
      } else {
        dispatch(addressAction.setDeleteLoader(true));
        const maincartid = localStorage.getItem("maincartid");
        sendApiRequest(
          "POST",
          "/DeleteCustomerCart",
          {
            CustomerId: loggedInUser?.CustomerId || "",
            MainCartId: maincartid,
            CartId: cartdata?.CartId,
          },
          ""
        );
      }
      const getdata = async () => {
        const responce = await getProductCartData();

        dispatch(cartActions.setCartData(responce?.Response?.lstCartData));
        setTimeout(() => {
          checkAvailability();
          dispatch(addressAction.setDeleteLoader(false));
        }, 1000);
      };

      setTimeout(() => {
        getdata();
      }, 0);
    } catch (error) {
      console.log(error.message);
    }
  };
  const wishlist = useSelector((state) => state.wishlistreducer.wishlist);

  function generateSlug(productName) {
    return encodeURIComponent(
      productName
        .toLowerCase()
        .replace(/'/g, "") // Remove apostrophes
        .replace(/[^a-z0-9\s-]/g, "") // Remove other special chars
        .replace(/\s+/g, "-") // Replace spaces with hyphens
    );
  }
  const navigate = useNavigate();
  const handleDetails = async (i) => {
    if (i.CategoryName === "COMBOOFFER" || i.CategoryName === "COMBO") {
      navigate(`/combo-product-details/?id=${i.OfferId}`);
      return;
    }
    navigate(
      `/product-details/${btoa(i?.ProductId)}/${i?.URLText ? generateSlug(i?.URLText) : generateSlug(i?.ProductName)
      }`
    );
  };
  const [isError, setIsError] = useState(false);
  const handleImageError = () => {
    setIsError(!isError);
  };
  return (
    <>
      <li className={`base-class ${!isAvailable ? "disable" : ""}`}>
        <div
          style={{
            position: "relative",
            zIndex: 0,
            pointerEvents: !isAvailable ? "none" : "auto",
          }}
        >
          <div className="cart_line-item-top">
            <div className="cart_line-item-left position-relative">
              {(item?.OfferId !== "0" || !item?.OfferId) && (item?.OfferId != item.ProductId) && (
                <div className="offertag position-absolute ">
                  <img
                    style={{ width: "100%" }}
                    src={offerpic}
                    alt="offerpic"
                  />
                </div>
              )}
              <img
                loading="lazy"
                src={isError ? noimage : `${imageBaseURL}/ResizeImageFromUrl?imageName=${img}&&height=${412}&&q=${100}&&width=${412}`}
                onError={handleImageError}
                alt="RAV organics"
              />
            </div>
            <div className="cart_line-item-right">
              {Checkout ? (
                <span>{name}</span>
              ) : (
                <span
                  onClick={() => handleDetails(item)}
                  style={{ cursor: "pointer" }}
                  className="line-item-title"
                >
                  {name}
                </span>
              )}
              {(item?.OfferId !== "0" || !item?.OfferId) && (item?.OfferId != item.ProductId) && (
                <div className="price-list">
                  <span className="line-item">{item?.OfferName}</span>
                  <PreviewImage
                    style={{
                      height: "25px",
                      maxWidth: "25px",
                      borderRadius: "50%",
                    }}
                    newPic={info}
                    imgwithUrl={`https://api.ravorganics.com/api/ImageMengement/ResizeOfferImageFromUrl?imageName=${item?.OfferImage}&&height=${600}&&q=${100}&&width=${600}`}
                  />
                </div>
              )}
              <div className="price-list">
                <span className="line-item">₹{price ?? 0}</span>

                {price != mrp ? <>
                  <span className="price-compare">₹{mrp ?? 0}</span>
                  <span className="item-saving">{discount ?? 0} % OFF</span>

                </> : <span style={{ fontSize: "12px" }} className="m-0 ">
                  &nbsp;&nbsp;QTY :{" "}
                  <span className="fw-bold text-success">{item?.quantity}</span>{" "}
                  Total :
                  <span className="fw-bold text-success">
                    {price * Number(item?.quantity)}
                  </span>
                </span>}
              </div>
              {price != mrp && <p style={{ fontSize: "12px" }} className="m-0 ">
                QTY :{" "}
                <span className="fw-bold text-success">{item?.quantity}</span>{" "}
                Total :
                <span className="fw-bold text-success">
                  {price * Number(item?.quantity)}
                </span>
              </p>}


              {!Checkout && (
                <div
                  className="product-bottom-action"
                  style={{ position: "relative", zIndex: 2 }}
                >
                  <div className="cart-edits">
                    <QuantityCounter cartdata={item} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {!Checkout && (
          <div
            className="qnty-bottom d-flex justify-content-between"
            style={{ position: "relative", zIndex: 2 }}
          >
            {!["COMBO", "COMBOOFFER"].includes(subname) && (
              <span
                className="line-item-wishlist"
                onClick={() => handleAddWishlist(item.ProductId)}
                style={{ cursor: "pointer" }}
              >
                {wishlist?.some((it) => it.ProductId === item.ProductId) ? (
                  <i style={{ color: "red" }} className="fa-solid fa-heart"></i>
                ) : (
                  <i
                    style={{ color: "#fff" }}
                    className="fa-solid fa-heart"
                  ></i>
                )}
              </span>
            )}
            <span className="line-item-wishlist" style={{ cursor: "pointer" }}>
              <a onClick={() => handleDeleteProduct(item)}>
                <i className="fa-sharp fa-regular fa-trash"></i>
              </a>
            </span>
          </div>
        )}

        {loading && <Loader />}
      </li>
    </>
  );
};

export default CartComp;
