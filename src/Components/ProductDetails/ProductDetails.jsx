// import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
// import "./ProductDetails.css";
// import { Link, useLocation, useParams } from "react-router-dom";
// import useApiRequest from "../../Hooks/apiReq";
// import Loader from "../../ExternalLib/Loader/Loader";
// import { useDispatch, useSelector } from "react-redux";
// import { cartActions } from "../../Redux/Slices/cartSlice";
// import { getProductCartData } from "../../Utils/getCartList";
// import ApiEncryptDecrypt from "../../Utils/Encryption";
// import { Key } from "../../Utils/Key";
// import axiosInstance from "../../Utils/axiosInstance";
// import { toast } from "react-toastify";
// import { getWishlist } from "../../Utils/getWishlist";
// import { wishlistActions } from "../../Redux/Slices/wishlistSlice";
// import { uiAction } from "../../Redux/Slices/uiSlice";
// import { getloggedCartList } from "../../Utils/getLoggedCartList";
// import ProductCard from "../../Shared/ProductCard/ProductCard";
// import Slider from "../../ExternalLib/Carousel/Carousel";
// import ProDetails from "./Details/ProDetails";
// import SimilarProduct from "./SimilarProduct/SimilarProduct";
// import QuantityCounter from "../../Shared/QtyCounter";
// import StarRating from "./RatingPage/Rating";
// import ProductGallery from "./ProductGallery";
// import { Helmet } from "react-helmet";
// import { setAllMetaTags } from "../../Utils/setAllMetaTags";
// import PreviewImage from "../../ExternalLib/PreviewImage/PreviewImage.jsx";
// import info from "../../assets/info.webp";
// import offerpic from "../../assets/offerpic.png";
// import { imageBaseURL } from "../../Utils/ImageBaseURL.js";
// const responsive1 = {
//   desktop: {
//     breakpoint: { max: 3000, min: 1424 },
//     items: 4,
//     slidesToSlide: 1,
//   },
//   laptop: {
//     breakpoint: { max: 1424, min: 1024 },
//     items: 4,
//     slidesToSlide: 1,
//   },
//   tablet: {
//     breakpoint: { max: 1024, min: 464 },
//     items: 2,
//     slidesToSlide: 1,
//   },
//   mobile: {
//     breakpoint: { max: 464, min: 0 },
//     items: 1,
//     slidesToSlide: 1,
//   },
// };
// const ProductDetails = ({ children }) => {
//   const { search } = useLocation();
//   const urldata = new URLSearchParams(search);
//   const { Id } = useParams();
//   const id = atob(Id);
//   const { error, loading, response, sendApiRequest } = useApiRequest();
//   const [product, setProduct] = useState({});
//   const {
//     error: similarProductError,
//     loading: similarProductLoading,
//     response: similarProductResponce,
//     sendApiRequest: similarProductSendApiRequiest,
//   } = useApiRequest();
//   const {
//     error: comboProductError,
//     loading: comboProductLoading,
//     response: comboProductResponce,
//     sendApiRequest: comboProductSendApiRequiest,
//     status: combostatus,
//   } = useApiRequest();

//   useEffect(() => {
//     window.scroll({ top: "0", behavior: "smooth" });
//   }, [id]);
//   const cartData = useSelector((state) => state.cartreducer.cartData);
//   const dispatch = useDispatch();
//   const [loader, setLoader] = useState(false);
//   const handleProduct = async (data) => {
//     try {
//       const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
//       if (loggedInUser) {
//         setLoader(true);
//         dispatch(
//           cartActions.handleAddProduct({ CartData: cartData, cartdata: data })
//         );
//         const getdata = async () => {
//           const { obj } = await getloggedCartList();
//           dispatch(cartActions.setCartData(obj?.Response?.lstCartData));
//           setTimeout(() => {
//             setLoader(false);
//           }, 400);
//         };
//         setTimeout(() => {
//           getdata();
//         }, 400);
//       } else {
//         setLoader(true);
//         dispatch(
//           cartActions.handleAddProduct({ CartData: cartData, cartdata: data })
//         );
//         const getdata = async () => {
//           const responce = await getProductCartData();
//           dispatch(cartActions.setCartData(responce?.Response?.lstCartData));
//           setTimeout(() => {
//             setLoader(false);
//           }, 400);
//         };
//         setTimeout(() => {
//           getdata();
//         }, 400);
//       }
//     } catch (error) {
//       toast.error(error.Message);
//       console.log(error.Message);
//     }
//     finally {
//       setLoader(false);
//     }
//   };
//   const handleMessage = () => {
//     toast.warning("Product Not Available");
//   };
//   const wishlist = useSelector((state) => state.wishlistreducer.wishlist);
//   const handleAddWishlist = async (productid) => {
//     const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
//     if (loggedInUser) {
//       const encryptedData = await ApiEncryptDecrypt.encryptString(
//         Key,
//         JSON.stringify({
//           CustomerId: loggedInUser?.CustomerId,
//           ProductID: productid,
//         })
//       );
//       const jsonData = { Body: encryptedData };
//       let res;
//       res = await axiosInstance.post("/AddCustomerWish", jsonData);

//       const decryptedRes = await ApiEncryptDecrypt.decryptString(
//         Key,
//         res.data.body
//       );
//       const obj = JSON.parse(decryptedRes);
//       if (obj.Status === 0) {
//         getresponce();
//       }
//       if (obj.Status === 1) {
//         toast.error(obj.Message);
//       }
//       if (obj.Status === 3) {
//         dispatch(uiAction.openModal());
//       }
//     } else {
//       dispatch(uiAction.openModal());
//     }
//   };
//   const getresponce = async () => {
//     const responce = await getWishlist();
//     dispatch(wishlistActions.setWishlist(responce?.obj?.Response?.lstWishData));
//   };
//   const handleShare = () => {
//     if (navigator.share) {
//       navigator
//         .share({
//           title: "My App",
//           text: "Check out this cool link!",
//           url: window.location.href,
//         })
//         .then(() => console.log("Shared successfully"))
//         .catch((err) => console.error("Error sharing", err));
//     } else {
//       toast.error("Web Share API is not supported in your browser.");
//     }
//   };
//   const [productdetails, setProductDetails] = useState();
//   // const expensiveValue = useMemo(() => {
//   //   if (response?.lstProductDetail?.length > 0) {
//   //     setProductDetails(JSON.parse(response.lstProductDetail[0]?.jsonDetail));
//   //   }
//   // }, [response?.lstProductDetail[0]]);
//   useEffect(() => {
//     if (response?.lstProductDetail?.length > 0) {
//       setProductDetails(JSON.parse(response.lstProductDetail[0]?.jsonDetail));
//     }
//   }, [response?.lstProductDetail]);
//   // console.log("combo", comboProductResponce);
//   const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
//   useEffect(() => {
//     const checkScreen = () => {
//       setIsMobileOrTablet(window.innerWidth <= 992); // ≤ 992px = tablet/mobile
//     };
//     checkScreen(); // initial check
//     window.addEventListener("resize", checkScreen); // update on resize
//     return () => window.removeEventListener("resize", checkScreen);
//   }, []);
//   const {
//     error: recentproductError,
//     loading: recentproductLoading,
//     response: recentproductResponse,
//     sendApiRequest: recentproductSendApiRequest,
//     status,
//   } = useApiRequest();
//   const getRecentlyViewedProducts = () => {
//     const alldata = JSON.parse(localStorage.getItem("viewproduct"));
//     if (alldata?.length > 0) {
//       const data = alldata?.map((item) => {
//         return { ProductId: item.ProductId };
//       });

//     }
//   };
//   useEffect(() => {
//     getRecentlyViewedProducts();
//   }, []);

//   console.log(response)

//   return response?.lstProductDetail.length < 1 &&
//     !similarProductLoading &&
//     !loading &&
//     !loader ? (
//     <p className=" text-bg-danger px-3 py-2 text-center">
//       {" "}
//       No Details Avaiable For this Products{" "}
//     </p>
//   ) : (
//     <>
//       <div
//         key={response?.lstProductDetail?.[0]?.SEOTitle}
//         className="rts-chop-details-area py-5"
//       >
//         <div className="container">
//           {response?.lstProductDetail.length > 0 && (
//             <div className="row">
//               <div className="col-xl-6 col-lg-6 col-md-12 p-0">
//                 <div className="product-details-img  position-relative">
//                   {showOfferImg(response?.lstProductDetail[0])}
//                   {
//                     <ProductGallery
//                       images={ImagesArrray(
//                         response?.lstProductDetail[0]?.ImageJson, `${imageBaseURL}/ResizeImageFromUrl?imageName=${response?.lstProductDetail[0]?.ProductThumbnail}&&height=${400}&&q=${100}&&width=${400}`
//                       )
//                       }
//                     />
//                   }
//                 </div>
//               </div>
//               <div className="col-xl-6 col-lg-6 col-md-12 mt-4">
//                 <div className="product-details-popup">
//                   <div className="details-product-area">
//                     <h2 className="product-title">
//                       {response?.lstProductDetail[0]?.ProductName}
//                     </h2>
//                     {showOffer(response?.lstProductDetail[0])}
//                     <p className="d-flex mb-2 align-content-center">
//                       <a>
//                         {" "}
//                         {response?.lstProductDetail[0]?.Description}
//                       </a>{" "}
//                     </p>
//                     <StarRating
//                       rating={Number(
//                         response?.lstProductDetail[0]?.ProductRating
//                       )}
//                     />
//                     <span style={{ fontSize: "20px" }}>
//                       ({response?.lstProductDetail[0]?.ProductRating})
//                     </span>
//                     <div className="product-price">
//                       ₹{isOffer(response?.lstProductDetail[0]) ? parseInt(isOffer(response?.lstProductDetail[0])) : parseInt(response?.lstProductDetail[0]?.Price)}
//                       {!isOffer(response?.lstProductDetail[0]) && <span className="old-price ml--15">
//                         MRP ₹{parseInt(response?.lstProductDetail[0]?.MRP)}
//                       </span>}
//                       {!isOffer(response?.lstProductDetail[0]) && <span className="product-label product-label--p-sale">
//                         {parseInt(
//                           response?.lstProductDetail[0]?.DiscountPercent
//                         )}
//                         % OFF
//                       </span>}
//                     </div>
//                     {/* <p className="mt-0 fs-4 mb-3">
//                       {" "}
//                       Tax Rate :{" "}
//                       {parseInt(response?.lstProductDetail[0]?.TaxRate)}%{" "}
//                     </p> */}
//                     <div className=" fs-3 mb-5 align-items-center gap-2 d-flex">
//                       <strong>SKU</strong>
//                       <span>#{response?.lstProductDetail[0]?.SKUCode}</span>
//                     </div>
//                     <div className="product-uniques d-flex ">
//                       {response?.OfferType != "COMBOOFFER" && (
//                         <div
//                           className="icon"
//                           style={{ cursor: "pointer" }}
//                           onClick={() =>
//                             handleAddWishlist(
//                               response?.lstProductDetail[0]?.ProductId
//                             )
//                           }
//                         >
//                           {wishlist?.filter(
//                             (item) =>
//                               item.ProductId ===
//                               response?.lstProductDetail[0]?.ProductId
//                           ).length > 0 ? (
//                             <i
//                               style={{ color: "red" }}
//                               className="fa-solid fa-heart"
//                             ></i>
//                           ) : (
//                             <i className="fa-regular fa-heart"></i>
//                           )}
//                         </div>
//                       )}
//                       <div className="icon" onClick={handleShare} style={{ cursor: "pointer" }}>
//                         <i
//                           className="fa-regular  fa-share-nodes"


//                         ></i>
//                       </div>
//                       {response?.lstProductDetail[0]?.AvailQty < 1 ? (
//                         <button
//                           onClick={handleMessage}
//                           className="add-with-icon"
//                         >
//                           Not Available
//                         </button>
//                       ) : sessionStorage.getItem("loggedInUser") && JSON.parse(sessionStorage.getItem("loggedInUser")) ? (
//                         cartData?.find(
//                           (it) =>
//                             it?.ProductId ===
//                             response?.lstProductDetail[0]?.ProductId
//                         ) ? (
//                           <div style={{ maxWidth: "200px" }}>
//                             <QuantityCounter
//                               cartdata={cartData.find(
//                                 (it) =>
//                                   it?.ProductId ===
//                                   response?.lstProductDetail[0]?.ProductId
//                               )}
//                             />
//                           </div>
//                         ) : response?.lstProductDetail[0]?.IsCommingSoon ===
//                           "True" ? (
//                           <button className="addtocart1" disabled={true}>
//                             {loading ? (
//                               <div
//                                 className="spinner-border spinner-border-sm text-danger"
//                                 role="status"
//                               />
//                             ) : response?.lstProductDetail[0]?.IsCommingSoon ==
//                               "True" ? (
//                               "Comming Soon "
//                             ) : (
//                               "Comming Soon"
//                             )}
//                           </button>
//                         ) : (
//                           <button
//                             onClick={() =>
//                               handleProduct(response?.lstProductDetail[0])
//                             }
//                             className="addtocart"
//                             disabled={loading ? true : false}
//                             style={
//                               loading
//                                 ? { cursor: "progress" }
//                                 : { cursor: "pointer" }
//                             }
//                           >
//                             {loading ? (
//                               <div
//                                 className="spinner-border spinner-border-sm text-danger"
//                                 role="status"
//                               />
//                             ) : response?.lstProductDetail[0]?.IsCommingSoon ==
//                               "True" ? (
//                               "Comming Soon "
//                             ) : (
//                               "Add to cart"
//                             )}
//                           </button>
//                         )
//                       ) : cartData?.find(
//                         (it) =>
//                           it.ProductId ===
//                           response?.lstProductDetail[0]?.ProductId
//                       )?.qty > 0 ? (
//                         <div style={{ maxWidth: "200px" }}>
//                           <QuantityCounter
//                             cartdata={response?.lstProductDetail[0]}
//                           />
//                         </div>
//                       ) : cartData?.find(
//                         (it) =>
//                           it?.ProductId ===
//                           response?.lstProductDetail[0]?.ProductId
//                       ) ? (
//                         <div style={{ maxWidth: "200px" }}>
//                           <QuantityCounter
//                             cartdata={cartData.find(
//                               (it) =>
//                                 it?.ProductId ===
//                                 response?.lstProductDetail[0]?.ProductId
//                             )}
//                           />
//                         </div>
//                       ) : response?.lstProductDetail[0]?.IsCommingSoon ===
//                         "True" ? (
//                         <button className="addtocart1" disabled={true}>
//                           {loading ? (
//                             <div
//                               className="spinner-border spinner-border-sm text-danger"
//                               role="status"
//                             />
//                           ) : response?.lstProductDetail[0]?.IsCommingSoon ==
//                             "True" ? (
//                             "Comming Soon "
//                           ) : (
//                             "Comming Soon"
//                           )}
//                         </button>
//                       ) : (
//                         <button
//                           onClick={() =>
//                             handleProduct(response?.lstProductDetail[0])
//                           }
//                           className="addtocart"
//                           disabled={loading ? true : false}
//                           style={
//                             loading
//                               ? { cursor: "progress" }
//                               : { cursor: "pointer" }
//                           }
//                         >
//                           {loading ? (
//                             <div
//                               className="spinner-border spinner-border-sm text-danger"
//                               role="status"
//                             />
//                           ) : response?.lstProductDetail[0]?.IsCommingSoon ==
//                             "True" ? (
//                             "Comming Soon "
//                           ) : (
//                             "Add to cart"
//                           )}
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="container">
//         {productdetails && <ProDetails productdetails={productdetails} />}
//         <div className="similar-products">
//           <SimilarProduct similarProductResponce={similarProductResponce} />
//           {(loading || similarProductLoading) && <Loader />}
//         </div>
//       </div>
//       <div className="container">
//         <div className="row my-3">
//           {recentproductResponse?.lstRecentProduct.length > 0 && (
//             <div className="col-lg-12">
//               <h3 className="ms-2 my-2" style={{ textAlign: "left" }}>
//                 Recently Viewed
//               </h3>
//             </div>
//           )}

//           <div className="viewproductsfd">
//             {recentproductResponse?.lstRecentProduct.length > 0 && (
//               <Slider responsive={responsive1} showDot={"false"}>
//                 {recentproductResponse?.lstRecentProduct.map((item) => {
//                   return (
//                     <ProductCard
//                       w="100%"
//                       mrp={item.MRP}
//                       discount={item.DiscountPercent}
//                       price={item.Price}
//                       img={item.ProductThumbnail}
//                       name={item.ProductName}
//                       subCatName={item.SubCategoryName}
//                       cartdata={item}
//                       handleAddWishlist={handleAddWishlist}
//                       rating={item?.ProductRating}
//                     />
//                   );
//                 })}
//               </Slider>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ProductDetails;
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Badge, Table, Button, Tab, Nav } from "react-bootstrap";
import useApiRequest from "../../Hooks/apiReq";
import { useLocation, useParams } from "react-router-dom";

const ProductDetails = () => {
  const { search } = useLocation();
  const urldata = new URLSearchParams(search);
  const { Id } = useParams();
  const id = atob(Id);
  const [product, setProduct] = useState({})
  const { error, loading, response, sendApiRequest } = useApiRequest();
  useEffect(() => {
    sendApiRequest("GET", `/product/getProductById/${id}`, "", {
      onSuccess: (res) => {
        console.log(res)
      }
    });
  }, [id]);
  useEffect(() => {
    setProduct(response)
  }, [response, id])
  if (!product) return <p>Loading...</p>;



  return (
    <Container className="my-4">
      <Row>
        {/* Left Section: Image */}
        <Col md={5}>
          <Card className="shadow-sm">
            <Card.Img variant="top" src={product.thumbnail} alt={product.title} />
            <Card.Body className="text-center">
              <Button variant="success" className="w-100 mb-2">
                {product.availabilityStatus}
              </Button>
              <Button variant="primary" className="w-100">
                Add to Cart
              </Button>
            </Card.Body>
          </Card>
          <div className="d-flex mt-3 flex-wrap">
            {product.images?.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`product-${idx}`}
                className="img-thumbnail m-1"
                style={{ width: "80px", height: "80px", objectFit: "cover" }}
              />
            ))}
          </div>
        </Col>

        {/* Right Section: Details */}
        <Col md={7}>
          <h3>{product.title}</h3>
          <p className="text-muted">{product.brand}</p>

          <div className="d-flex align-items-center mb-3">
            <h4 className="text-success me-3">₹{product.price}</h4>
            <span className="text-muted text-decoration-line-through me-2">
              ₹{(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
            </span>
            <Badge bg="danger">{product.discountPercentage}% OFF</Badge>
          </div>

          <p>{product.description}</p>

          <div className="mb-2">
            <strong>Category:</strong> {product.category}
          </div>
          <div className="mb-2">
            <strong>Stock:</strong> {product.stock} units
          </div>
          <div className="mb-2">
            <strong>Minimum Order Quantity:</strong> {product.minimumOrderQuantity}
          </div>
          <div className="mb-2">
            <strong>Rating:</strong> ⭐ {product.rating}
          </div>

          <Badge bg="info" className="me-2">
            SKU: {product.sku}
          </Badge>
          <Badge bg="secondary">Order No: {product.orderNo}</Badge>

          {/* Tabs Section */}
          <Tab.Container defaultActiveKey="info" className="mt-4">
            <Nav variant="tabs">
              <Nav.Item>
                <Nav.Link eventKey="info">Info</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="order">Order</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="meta">Meta</Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content className="p-3 border border-top-0 rounded-bottom">
              <Tab.Pane eventKey="info">
                <p><strong>Warranty:</strong> {product.warrantyInformation}</p>
                <p><strong>Return Policy:</strong> {product.returnPolicy}</p>
                <p><strong>Shipping:</strong> {product.shippingInformation}</p>
                <p><strong>Weight:</strong> {product.weight} kg</p>
                <p>
                  <strong>Dimensions:</strong> {product?.dimensions?.width} x {product?.dimensions?.height} x{" "}
                  {product?.dimensions?.depth} cm
                </p>
                <p><strong>Tags:</strong> {product?.tags?.join(", ")}</p>
              </Tab.Pane>

              <Tab.Pane eventKey="order">
                <Table bordered>
                  <tbody>
                    <tr>
                      <td><strong>Customer</strong></td>
                      <td>{product.customerName} ({product.customerCode})</td>
                    </tr>
                    <tr>
                      <td><strong>Order Date</strong></td>
                      <td>{product.orderDate}</td>
                    </tr>
                    <tr>
                      <td><strong>Status</strong></td>
                      <td>{product.orderStatus}</td>
                    </tr>
                    <tr>
                      <td><strong>Value</strong></td>
                      <td>₹{product.orderValue}</td>
                    </tr>
                    <tr>
                      <td><strong>PV</strong></td>
                      <td>{product.orderPV}</td>
                    </tr>
                  </tbody>
                </Table>
              </Tab.Pane>

              <Tab.Pane eventKey="meta">
                <p><strong>Barcode:</strong> {product?.meta?.barcode}</p>
                <img src={product?.meta?.qrCode} alt="QR Code" width="100" />
                <p><strong>Created:</strong> {product?.meta?.createdAt}</p>
                <p><strong>Updated:</strong> {product?.meta?.updatedAt}</p>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetails;
