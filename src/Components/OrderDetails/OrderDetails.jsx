import React, { useEffect, useMemo, useState } from "react";
import "./OrderDetails.css";
import Shippedorders from "../../assets/Images/Shipped_orders.svg";
import Prdimg1 from "../../assets/Images/product/details-img1.jpg";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { orderAction } from "../../Redux/Slices/orderSlice";
import UiImage from "../../Widgets/UiVerseImage/UiImage";
import useApiRequest from "../../Hooks/apiReq";
import { toast } from "react-toastify";
import ApiEncryptDecrypt from "../../Utils/Encryption";
import axiosInstance from "../../Utils/axiosInstance";
import { Key } from "../../Utils/Key";
import { wishlistActions } from "../../Redux/Slices/wishlistSlice";
import { VscLightbulb } from "react-icons/vsc";
import PreviewImage from "../../ExternalLib/PreviewImage/PreviewImage.jsx";
import pdfIcon from "../../assets/Images/pdf.png";
import { IoIosStar, IoMdArrowRoundBack } from "react-icons/io";
import { uiAction } from "../../Redux/Slices/uiSlice.jsx";
import MainPortal from "../MainPortal/MainPortal.jsx";
import RateAndReview from "../RateUs/RateAndReview.jsx";
import Navigation from "./Navigation/Navigation.jsx";
import { FaRegFilePdf } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import { imageBaseURL } from "../../Utils/ImageBaseURL.js";
const OrderDetails = ({ detail, status }) => {


  // return order
  const isReturn = useSelector((state) => state.orderreducer.isReturn);
  const [retun, setReturn] = useState({ damage: "damage", other: "" });
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const dispatch = useDispatch();
  const [isTrack, setIsTrack] = useState(false);
  const [returnProduct, setReturnProduct] = useState([] || {});
  const handleReturnOrderPage = (productid, orderid) => {
    localStorage.setItem("id", orderid);
    localStorage.setItem("pkid", productid);

    const filterdata = detail?.lstOrderDetailList?.find((item) => {
      return Number(item?.FkProductID) == Number(productid);
    });

    setReturnProduct(filterdata);
    const finddata = JSON.parse(localStorage.getItem("ReturnProduct")) || [];
    const isExist = finddata.find((item) => {
      return item?.FkProductID == productid;
    });
    dispatch(orderAction.setIsReturn(true));
    setIsTrack(false);
    if (!isExist) {
      finddata.push(filterdata);
      localStorage.setItem("ReturnProduct", JSON.stringify(finddata));
      getReturnProduct(filterdata);
    } else {
      const storedProducts =
        JSON.parse(localStorage.getItem("ReturnProduct")) || [];
      // Step 2: Find the index of the product with matching productId
      const index = storedProducts.findIndex(
        (p) => p.FkProductID === productid
      );

      // Step 3: Replace the object if found
      if (index !== -1) {
        storedProducts[index] = filterdata;
      }
      localStorage.setItem("ReturnProduct", JSON.stringify(storedProducts));
      getReturnProduct(storedProducts);
    }
  };

  const handleChecked = (e) => {
    const { id } = e.target;
    if (id == "damage") {
      setReturn({ damage: "damage", other: "" });
    } else if (id == "other") {
      setReturn({ other: "other", damage: "" });
    }
  };

  //file preview
  const [imageSrc, setImageSrc] = useState([]);

  const handleChangeFile = (e) => {
    const { files } = e.target;
    if (!files) return;
    setFile(files);
    // const reader = new FileReader();
    // reader.onloadend = () => {
    setImageSrc(files);
    // };
    // reader.readAsDataURL(files);
  };

  const renderFilePreview = () => {
    if (imageSrc.length === 0) return null;
    return Array.from(imageSrc).map((file, index) => (
      <div
        key={index}
        style={{ display: "inline-block", position: "relative" }}
      >
        <span
          className="bg-danger px-2"
          style={{ position: "absolute", right: "0%", top: "0%" }}
          onClick={() => handleRemoveReview(index)}
        // style={{ top: 5, right: 5, cursor: "pointer", background: "white", padding: "2px 6px", borderRadius: "50%" }}
        >
          X
        </span>
        {file.type.startsWith("image/") ? (
          <PreviewImage imgurl={file} />
        ) : [
          "application/msword", // .doc
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
          "video/mp4",
        ].includes(file.type) ? (
          <a
            href={URL.createObjectURL(file)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={pdfIcon}
              alt="PDF preview"
              width="100"
              className="imgPreview"
              style={{
                aspectRatio: "1/1",
                objectFit: "contain",
                background: "#f5f5f5",
                padding: "10px",
                borderRadius: 6,
              }}
            />
          </a>
        ) : (
          <p style={{ fontSize: "12px" }}>Unsupported file</p>
        )}
      </div>
    ));
  };
  const handleRemoveReview = (fileIndex) => {
    // Create a new array without the file that needs to be removed
    const updatedFiles = Array.from(imageSrc).filter(
      (_, index) => index !== fileIndex
    );
    setImageSrc(updatedFiles); // Update the state with the new array
  };
  const navigate = useNavigate();
  const handleReturnProduct = async () => {
    if (!retun.damage && !retun.other) {
      toast.error("Choose atleast one options");
      return;
    }
    if (imageSrc.length < 1) {
      toast.error("Product Image Required!");
      return;
    }
    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    const orderid = localStorage.getItem("returnid");
    try {
      if (loggedInUser) {
        const formdata = new FormData();
        formdata.append("File", file);
        const data = {
          OrderId: orderid,
          ProductID: returnProduct?.FkProductID,
          ReturnOptionID: (retun.damage && 1) || (retun.other && 4),
          OtherDiscription: description,
          ReturnImage: "",
          CustomerId: loggedInUser?.CustomerId,
        };
        if (!(retun.damage || retun.other)) {
          toast.error("Please Fill All Fields");
          return;
        }

        const encryptedData = await ApiEncryptDecrypt.encryptString(
          Key,
          JSON.stringify({
            ...data,
          })
        );
        // const jsonData = { Body: encryptedData };
        formdata.append("Body", encryptedData);

        const result = await axiosInstance.post(
          "/ReturnRequestByCustomer",
          formdata,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
        const decryptedRes = await ApiEncryptDecrypt.decryptString(
          Key,
          result.data.body
        );
        let obj = JSON.parse(decryptedRes);
        if (obj.Status == 1 && obj.Response == null) {
          toast.error(obj.Message);
        }
        if (obj.Status == 0) {
          dispatch(orderAction.setIsReturn(false));
          setImageSrc([]);
          setDescription("");
          dispatch(orderAction.setIsReturn(false));
          dispatch(orderAction.setReturnref(true));
          toast.success(obj.Message);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getReturnProduct = (data) => {
    setIsTrack(false);
    const returnproduct =
      JSON.parse(localStorage.getItem("ReturnProduct")) || [];

    const filterdata = (data ? data : returnproduct).find((item) => {
      if (localStorage.getItem("pkid")) {
        return item?.FkProductID == localStorage.getItem("pkid");
      } else {
        return item?.FkOrderId == localStorage.getItem("id");
      }
    });
    if (filterdata) {
      setReturnProduct(filterdata);
    }
  };

  // useEffect(() => {
  //   getReturnProduct();
  // }, []);

  // navigating functions
  const moveOrderDetails = () => {
    dispatch(orderAction.setIsReturn(false));
    setIsTrack(false);
  };

  const moveOrderlists = () => {
    dispatch(wishlistActions.setIsOrderDetail(false));
  };

  // handleTrack Order
  const [istranckpid, setTrackPId] = useState("");

  const handleTrackOrder = (productid) => {

    const filterdata = detail?.lstOrderDetailList?.find((item) => {
      return item?.FkProductID == productid;
    });

    const storedProducts =
      JSON.parse(localStorage.getItem("ReturnProduct")) || [];

    // Step 2: Find the index of the product with matching productId
    const index = storedProducts.findIndex(
      (p) => p.FkProductID === productid
    );

    // Step 3: Replace the object if found
    if (index !== -1) {
      storedProducts[index] = filterdata;
    }
    localStorage.setItem("ReturnProduct", JSON.stringify(storedProducts));

    if (filterdata) {
      setReturnProduct(filterdata);
      getTrackStatus(filterdata);
    }
    setTrackPId(productid);
    setIsTrack(true);
    localStorage.removeItem("pkid");
  };

  const [trackStatus, setTrackStatus] = useState(null);
  const getTrackStatus = (data) => {
    if (data?.IsAccepted === "" && data?.ReturnRMA !== "") {
      setTrackStatus("Request Genrated For This Product");
    }
    if (data?.IsAccepted === "0" && data?.ReturnRMA !== "") {
      setTrackStatus("Request Genrated For This Product is Rejected");
    }
    if (
      data?.IsAccepted === "1" &&
      data?.ReturnRMA !== "" &&
      data?.IsOutForRecieve === "False"
    ) {
      setTrackStatus("Requested Accepted For This product");
    }
    if (data?.IsRecieved === "True") {
      setTrackStatus("Returned Order");
    }
    if (
      data?.IsAccepted === "1" &&
      data?.ReturnRMA !== "" &&
      data?.IsOutForRecieve === "True" &&
      data?.IsRecieved === "False"
    ) {
      setTrackStatus("Person is out for Recieving Product");
    }
  };

  const isOrderDetail = useSelector(
    (state) => state.wishlistreducer.isOrderDetail
  );

  //handle Rate Us Modal
  const [isRate, setIsRate] = useState(false);
  const [orderId, setOrderId] = useState();
  const [productId, setproductId] = useState();
  const handleRateUsModal = (orderid, productid) => {
    setShowModal(true);
    setOrderId(orderid);
    setproductId(productid);
    setIsRate(!isRate);
  };
  const handleCloseModal = () => {
    setIsRate(!isRate);
  };
  const blockedOffers = ["BNGN", "GRANDOFFER", "COMBOOFFER", "CARTPRICEOFFER"];
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => {
    setShowModal(false);
    handleCloseModal();
  };
  const backToOrder = () => {
    // dispatch(uiAction.settabs("myOrders"));
    dispatch(wishlistActions.setIsOrderDetail(false));
  };
  const backToDetails = () => {
    dispatch(orderAction.setIsReturn(false));
    setIsTrack(false);
  };
  const [Reviews, setReviews] = useState("");
  const handleReviewItems = (item) => {
    setReviews(item);
  };
  return (
    <>
      {isRate && (
        <MainPortal
          children={
            <RateAndReview
              // setIsRate={setIsRate}
              orderId={orderId}
              productId={productId}
              show={showModal}
              handleClose={handleClose}
            />
          }
          handleCloseModal={handleCloseModal}
        />
      )}
      <div className="rts-cart-area">
        <div className="container">
          {isTrack && (
            <Navigation
              moveOrderDetails={moveOrderDetails}
              moveOrderlists={moveOrderlists}
              isReturn={isReturn}
              isTrack={isTrack}
            />
          )}
          {isReturn ? (
            returnProduct && (
              <div
                style={{ border: "1px solid #ededed" }}
                className="container  "
              >
                <div className="row    rounded">
                  <span className="shadow py-1" onClick={backToDetails}>
                    <IoMdArrowRoundBack size={25} />
                  </span>
                  <div className="cart_line-item-top d-flex justify-content-start p-2 bg-white align-items-center   mb-0">
                    <div style={{ width: "150px" }} className="cart_left">
                      <img
                        loading="lazy"
                        src={`${imageBaseURL}/ResizeImageFromUrl?imageName=${
                          returnProduct?.ProductThumbnail
                        }&&height=${412}&&q=${100}&&width=${412}`}
                        style={{ width: "100%" }}
                        alt="Shippe dorders"
                      />
                    </div>
                    <div className="cart_right">
                      <strong>{returnProduct?.ProductName}</strong>
                      <p className="mb-0">{returnProduct?.SubcategoryName}</p>
                      <div className="price-list">
                        <span className="line-item">
                          ₹{parseInt(returnProduct?.Price)}
                        </span>
                        &nbsp;&nbsp;&nbsp;
                        <span className="line-item text-decoration-line-through text-success">
                          ₹{parseInt(returnProduct?.MRP)}
                        </span>
                        <p className="line-item mb-0">
                          ₹{parseInt(returnProduct?.Discount)} Off
                        </p>
                        {/* <span className="price-compare">
                          Pack Size: Single Pack
                        </span> */}
                        <span className="price-compare mt-0">
                          Qty:{returnProduct?.Qty}
                        </span>
                        <p className="price-compare my-0">
                          {[1, 2, 3, 4, 5].map((it) => {
                            return returnProduct?.OverAllProductRating >=
                              parseInt(it) ? (
                              <i style={{ color: "gold" }}>
                                {" "}
                                <IoIosStar size={20} />
                              </i>
                            ) : (
                              <i>
                                {" "}
                                <IoIosStar size={20} />
                              </i>
                            );
                          })}
                        </p>
                        {Number(returnProduct?.ProductRating) < 1 ? (
                          detail?.FKOrderStatusID == "5" && (
                            <span
                              style={{ cursor: "pointer" }}
                              className="price-compare text-success"
                              onClick={() =>
                                handleRateUsModal(
                                  returnProduct?.FkOrderId,
                                  returnProduct?.FkProductID
                                )
                              }
                            >
                              <i className="fa-regular fa-circle-info"></i>
                              RateUs
                            </span>
                          )
                        ) : (
                          <span
                            style={{ cursor: "pointer" }}
                            data-bs-toggle="modal"
                            data-bs-target="#myreturn"
                            className="ourratings"
                            onClick={() => handleReviewItems(returnProduct)}
                          >
                            <i className="fa-regular fa-circle-info"></i>Our
                            Rating
                          </span>
                        )}
                        <div
                          className="modal fade"
                          id="myreturn"
                          tabindex="-1"
                          role="dialog"
                          aria-labelledby="exampleModalCenterTitle"
                          aria-hidden="true"
                        >
                          <div
                            className="modal-dialog modal-dialog-centered"
                            role="document"
                          >
                            <div className="modal-content">
                              <div className="modal-header">
                                <h5
                                  className="modal-title"
                                  id="exampleModalLongTitle"
                                >
                                  My Review
                                </h5>
                                <i data-bs-dismiss="modal">
                                  <RxCross1 size={20} />
                                </i>
                                <button
                                  type="button"
                                  className="close"
                                  data-dismiss="modal"
                                  aria-label="Close"
                                >
                                  <span aria-hidden="true">&times;</span>
                                </button>
                              </div>
                              <div className="modal-body">
                                <div className="customer-review">
                                  <div className="description">
                                    <h1>{Reviews?.ReviewerName}</h1>
                                    <p>
                                      <span>
                                        Gender : {Reviews?.ReviewerGender}
                                      </span>
                                      <br />
                                      <span>
                                        Age : {Reviews?.ReviewAge ?? 0}
                                      </span>
                                    </p>
                                    {[1, 2, 3, 4, 5].map((it) => {
                                      return it <= Reviews?.ProductRating ? (
                                        <i style={{ color: "gold" }}>
                                          {" "}
                                          <IoIosStar size={20} />
                                        </i>
                                      ) : (
                                        <i>
                                          <IoIosStar size={20} />
                                        </i>
                                      );
                                    })}

                                    <div className="meta">
                                      {Reviews?.ReviewAttachment &&
                                        Reviews?.ReviewAttachment?.split(
                                          ","
                                        ).map((item) => {
                                          return (
                                            <img
                                              className="photo"
                                              src={
                                                `${Reviews?.BaseUrl}${item}` ||
                                                pdfIcon
                                              }
                                              alt="Review Image"
                                            />
                                          );
                                        })}
                                    </div>
                                    <div className="date">
                                      {Reviews?.ReviewDate && (
                                        <p>
                                          <strong>Date : </strong>
                                          {Reviews?.ReviewDate}
                                        </p>
                                      )}
                                      <p>
                                        <strong>Mail Id :</strong>
                                        {Reviews?.ReviewEmail}
                                      </p>
                                    </div>
                                    <h2
                                      title="Review Tital"
                                      className="text-center"
                                    >
                                      {Reviews?.ReviewTitle}
                                    </h2>
                                    <p title="Review Description">
                                      {Reviews?.Review}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row bg-light py-3">
                  <div className="col-12 bg-white p-4">
                    <div className="d-flex justify-content-between">
                      <div
                        style={{ position: "relative" }}
                        className="left col-7"
                      >
                        <p className="mb-3 mt-4">
                          Choose a reason to return your order
                        </p>
                        <div className="form-check mb-3">
                          <input
                            className="form-check-input"
                            type="radio"
                            id="damage"
                            value={retun.damage}
                            name="checks"
                            defaultChecked={retun.damage ? true : false}
                            onChange={handleChecked}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="defaultAddress"
                          >
                            Product Damage
                          </label>
                        </div>
                        <div className="form-check mb-3">
                          <input
                            className="form-check-input"
                            type="radio"
                            id="other"
                            value={retun.other}
                            name="checks"
                            onChange={handleChecked}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="defaultAddress"
                          >
                            Other
                          </label>
                        </div>
                        {retun.other && (
                          <textarea
                            className="form-control  mb-5"
                            placeholder="write a message"
                            id="exampleFormControlTextarea1"
                            rows="3"
                            onChange={(e) => setDescription(e.target.value)}
                            value={description}
                          ></textarea>
                        )}
                        <div
                          style={{
                            backgroundColor: "#629d23",
                            border: "none",
                            borderRadius: "5px",
                            fontSize: "16px",
                            display: "block",
                            cursor: "pointer",

                            width: "100%",
                            marginTop: "20px",
                          }}
                          className="px-4 py-2 text-center text-white fs-8 "
                          onClick={handleReturnProduct}
                        >
                          Return Order
                        </div>
                      </div>
                      <div style={{ position: "relative" }} className="right">
                        <UiImage
                          handleChangeFile={handleChangeFile}
                          img={imageSrc}
                          renderFilePreview={renderFilePreview}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          ) : isTrack ? (
            <div className="border rounded pb-3">
              <div className="container  ">
                <div className="row    rounded">
                  <span className="shadow py-1" onClick={backToDetails}>
                    <IoMdArrowRoundBack size={25} />
                  </span>
                  <div className="cart_line-item-top  d-flex justify-content-start p-2 bg-white align-items-center   mb-0">
                    <div className="cart_left " style={{ width: "150px" }}>
                      <img
                        loading="lazy"
                        style={{ width: "100%" }}
                        src={`${imageBaseURL}/ResizeImageFromUrl?imageName=${
                          returnProduct?.ProductThumbnail
                        }&&height=${412}&&q=${100}&&width=${412}`}
                        alt="Shippe dorders"
                      />
                    </div>
                    <div className="cart_right">
                      <strong>{returnProduct?.ProductName}</strong>
                      <p className="mb-0">{returnProduct?.SubcategoryName}</p>
                      <div className="price-list">
                        <span className="line-item">
                          ₹{parseInt(returnProduct?.Price)}
                        </span>
                        &nbsp;&nbsp;&nbsp;
                        {parseInt(returnProduct?.Discount) > 0 && <span className="line-item text-decoration-line-through text-success">
                          ₹{parseInt(returnProduct?.MRP)}
                        </span>}
                        {parseInt(returnProduct?.Discount) > 0 && <p className="line-item mb-0">
                          ₹{parseInt(returnProduct?.Discount)} Off
                        </p>}
                        <span className="price-compare mt-0">
                          Qty:{returnProduct?.Qty}
                        </span>
                        <p className="price-compare mt-0">
                          {[1, 2, 3, 4, 5].map((it) => {
                            return returnProduct?.OverAllProductRating >=
                              parseInt(it) ? (
                              <i style={{ color: "gold" }}>
                                {" "}
                                <IoIosStar size={20} />
                              </i>
                            ) : (
                              <i>
                                {" "}
                                <IoIosStar size={20} />
                              </i>
                            );
                          })}
                        </p>
                        {/* <span className="price-compare mt-0">
                          Qty:{returnProduct?.Qty}
                        </span> */}
                        {/* <p>{returnProduct?.ProductRating}</p> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="tracking">
                <div className="row justify-content-start">
                  <div
                    className={
                      [
                        "Request Genrated For This Product",
                        "Request Genrated For This Product is Rejected",
                        "Requested Accepted For This product",
                        "Person is out for Recieving Product",
                        "Returned Order",
                      ].find((it) => it == trackStatus)
                        ? "order-tracking completed"
                        : "order-tracking"
                    }
                  >
                    <span className="is-complete"></span>
                    <p>{"Request Genrated For This Product"}</p>
                  </div>
                  <div
                    className={
                      [
                        "Request Genrated For This Product is Rejected",
                        "Requested Accepted For This product",
                        "Person is out for Recieving Product",
                        "Returned Order",
                      ].find((it) => it == trackStatus)
                        ? "order-tracking completed"
                        : "order-tracking"
                    }
                  >
                    <span
                      className={
                        ["Request Genrated For This Product is Rejected"].find(
                          (it) => it == trackStatus
                        )
                          ? "not-complete"
                          : "is-complete"
                      }
                    ></span>
                    <p>
                      {trackStatus ==
                        "Request Genrated For This Product is Rejected"
                        ? "Request Genrated For This Product is Rejected"
                        : "Requested Accepted For This product"}
                    </p>
                  </div>
                  <div
                    className={
                      [
                        "Person is out for Recieving Product",
                        "Returned Order",
                      ].find((it) => it == trackStatus)
                        ? "order-tracking completed"
                        : "order-tracking"
                    }
                  >
                    <span className="is-complete"></span>
                    <p>{"Person is out for Recieving Product"}</p>
                  </div>
                  <div
                    className={
                      ["Returned Order"].find((it) => it == trackStatus)
                        ? "order-tracking completed"
                        : "order-tracking"
                    }
                  >
                    <span className="is-complete"></span>
                    <p>{"Returned Order"}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="row">
              <div className="col-xl-12 col-lg-12 col-md-12">
                <div className="order-details">
                  <div className=" d-flex justify-content-between px-3 align-items-center">
                    {" "}
                    <span className="shadow" onClick={backToOrder}>
                      <IoMdArrowRoundBack size={25} />
                    </span>
                    <h4>Order Details</h4>
                  </div>
                  <div className="ordered-on">
                    <strong>Ordered on {detail?.dtOrderOn}</strong>
                    <span className="text-success fw-bold">
                      #{detail?.lstOrderDetailList[0]?.OrderNumber}
                    </span>
                  </div>

                  <div className="order-shipped">
                    {detail?.lstOrderDetailList?.length > 0 &&
                      detail?.lstOrderDetailList?.map((Item, index) => {
                        return (
                          <div
                            className={
                              detail?.DeliveredDays <= detail?.ValidDays &&
                                detail?.FKOrderStatusID == "5"
                                ? "cart_line-item-top d-xxl-flex d-xl-flex d-lg-flex d-md-flex d-block d-sm-block justify-content-between p-2 align-items-center border rounded mb-0"
                                : "cart_line-item-top  border rounded mb-0"
                            }
                            key={index}
                          >
                            <div className="cart_left">
                              <img
                                loading="lazy"
                                src={`${imageBaseURL}/ResizeImageFromUrl?imageName=${
                                  Item?.ProductThumbnail
                                }&&height=${312}&&q=${100}&&width=${312}`}
                                alt="Shippe dorders"
                              />
                            </div>
                            <div className="cart_right">
                              <strong>{Item?.ProductName}</strong>
                              <span>{Item?.SubcategoryName}</span>
                              <div className="price-list">
                                <span className="line-item">
                                  ₹{parseInt(Item?.Price)}
                                </span>
                                &nbsp;&nbsp;&nbsp;
                                {parseInt(Item?.Discount) > 0 && <span className="line-item text-decoration-line-through text-success">
                                  ₹{parseInt(Item?.MRP)}
                                </span>}
                                {parseInt(Item?.Discount) > 0 && <p className="line-item mb-0">
                                  ₹{parseInt(Item?.Discount)} Off
                                </p>}
                                {/* <span className="price-compare">
                          Pack Size: Single Pack
                        </span> */}
                                <span className="price-compare mt-0">
                                  Qty:{Item?.Qty}
                                </span>
                                <p className="price-compare my-0">
                                  {[1, 2, 3, 4, 5].map((it) => {
                                    return Item?.OverAllProductRating >=
                                      parseInt(it) ? (
                                      <i style={{ color: "gold" }}>
                                        {" "}
                                        <IoIosStar size={20} />
                                      </i>
                                    ) : (
                                      <i>
                                        {" "}
                                        <IoIosStar size={20} />
                                      </i>
                                    );
                                  })}
                                </p>
                                {Number(Item?.ProductRating) < 1 ? (
                                  detail?.FKOrderStatusID == "5" && (
                                    <span
                                      style={{ cursor: "pointer" }}
                                      className="price-compare text-success"
                                      onClick={() =>
                                        handleRateUsModal(
                                          Item?.FkOrderId,
                                          Item?.FkProductID
                                        )
                                      }
                                    >
                                      <i className="fa-regular fa-circle-info"></i>
                                      RateUs
                                    </span>
                                  )
                                ) : (
                                  <span
                                    style={{ cursor: "pointer" }}
                                    data-bs-toggle="modal"
                                    data-bs-target="#myreview"
                                    className="ourratings"
                                    onClick={() => handleReviewItems(Item)}
                                  >
                                    <i className="fa-regular fa-circle-info"></i>
                                    Our Rating
                                  </span>
                                )}
                                <div
                                  className="modal fade"
                                  id="myreview"
                                  tabindex="-1"
                                  role="dialog"
                                  aria-labelledby="exampleModalCenterTitle"
                                  aria-hidden="true"
                                >
                                  <div
                                    className="modal-dialog modal-dialog-centered"
                                    role="document"
                                  >
                                    <div className="modal-content">
                                      <div className="modal-header">
                                        <h5
                                          className="modal-title"
                                          id="exampleModalLongTitle"
                                        >
                                          My Review
                                        </h5>
                                        <i data-bs-dismiss="modal">
                                          <RxCross1 size={20} />
                                        </i>
                                        <button
                                          type="button"
                                          className="close"
                                          data-dismiss="modal"
                                          aria-label="Close"
                                        >
                                          <span aria-hidden="true">
                                            &times;
                                          </span>
                                        </button>
                                      </div>
                                      <div className="modal-body">
                                        <div className="customer-review">
                                          <div className="description">
                                            <h1>{Reviews?.ReviewerName}</h1>
                                            <p>
                                              <span>
                                                Gender :{" "}
                                                {Reviews?.ReviewerGender}
                                              </span>
                                              <br />
                                              <span>
                                                Age : {Reviews?.ReviewAge ?? 0}
                                              </span>
                                            </p>
                                            {[1, 2, 3, 4, 5].map((it) => {
                                              return it <=
                                                Reviews?.ProductRating ? (
                                                <i style={{ color: "gold" }}>
                                                  {" "}
                                                  <IoIosStar size={20} />
                                                </i>
                                              ) : (
                                                <i>
                                                  <IoIosStar size={20} />
                                                </i>
                                              );
                                            })}

                                            <div className="meta">
                                              {Reviews?.ReviewAttachment &&
                                                Reviews?.ReviewAttachment?.split(
                                                  ","
                                                ).map((item) => {
                                                  return (
                                                    item && <img
                                                      className="photo"
                                                      src={
                                                        `${Reviews?.BaseUrl}${item}` ||
                                                        pdfIcon
                                                      }
                                                      alt="Review Image"
                                                    />
                                                  );
                                                })}
                                            </div>
                                            <div className="date">
                                              {Reviews?.ReviewDate && (
                                                <p>
                                                  <strong>Date : </strong>
                                                  {Reviews?.ReviewDate}
                                                </p>
                                              )}
                                              <p>
                                                <strong>Mail Id :</strong>
                                                {Reviews?.ReviewEmail}
                                              </p>
                                            </div>
                                            <h2
                                              title="Review Tital"
                                              className="text-center"
                                            >
                                              {Reviews?.ReviewTitle}
                                            </h2>
                                            <p title="Review Description">
                                              {Reviews?.Review}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                           {detail?.FKOrderStatusID == "5" &&
                              Item?.ReturnRMA === "" &&
                              Number(detail?.DeliveredDays) <=
                                Number(detail?.ValidDays) && (
                                <div
                                  style={{ display: "block" }}
                                  className="cartmiddle"
                                >
                                  {!blockedOffers.includes(Item.OfferType) && (
                                    <button
                                      style={{
                                        backgroundColor: "#629d23",
                                        border: "none",
                                        borderRadius: "5px",
                                        fontSize: "16px",
                                        display: "block",
                                        cursor: "pointer",
                                      }}
                                      className="px-4 py-2 text-white fs-8 "
                                      onClick={() =>
                                        handleReturnOrderPage(
                                          Item?.FkProductID,
                                          Item?.FkOrderId
                                        )
                                      }
                                    >
                                      Return
                                    </button>
                                  )}
                                </div>
                              )}
                            {detail?.FKOrderStatusID == "5" &&
                              Item?.ReturnRMA !== "" && (
                                <div
                                  style={{ display: "block" }}
                                  className="cartmiddle"
                                >
                                  {!blockedOffers.includes(Item.OfferType) && (
                                    <button
                                      style={{
                                        backgroundColor: "#629d23",
                                        border: "none",
                                        borderRadius: "5px",
                                        fontSize: "16px",
                                        display: "block",
                                        cursor: "pointer",
                                      }}
                                      className="px-4 py-2 text-white fs-8 "
                                      onClick={() =>
                                        handleTrackOrder(Item?.FkProductID)
                                      }
                                    >
                                      Return Track
                                    </button>
                                  )}
                                </div>
                              )}
                          </div>
                        );
                      })}

                    <div className="tracking">
                      <div
                        className={
                          detail?.DeliveryType == "STOREPICKUP"
                            ? "row flex-column flex-md-row justify-content-start "
                            : "row flex-column flex-md-row justify-content-start"
                        }
                      >
                        {detail?.LstStatusData[0]?.Status && (
                          <div
                            className={
                              detail?.LstStatusData[0]?.JSONValue != ""
                                ? detail?.DeliveryType == "STOREPICKUP"
                                  ? "order-track completed"
                                  : "order-tracking completed"
                                : detail?.DeliveryType == "STOREPICKUP"
                                  ? "order-track"
                                  : "order-tracking"
                            }
                          >
                            <span className="is-complete"></span>
                            <p>{detail?.LstStatusData[0]?.Status}</p>
                            {detail?.LstStatusData[0]?.JSONValue && (
                              <p
                                style={{ fontSize: "small" }}
                                className="pt-0 my-0"
                              >
                                {
                                  JSON.parse(detail?.LstStatusData[0].JSONValue)
                                    .CreatedOn
                                }
                              </p>
                            )}
                          </div>
                        )}

                        {detail?.LstStatusData[1]?.Status && (
                          <div
                            className={
                              detail?.LstStatusData[1]?.JSONValue != ""
                                ? detail?.DeliveryType == "STOREPICKUP"
                                  ? "order-track completed"
                                  : "order-tracking completed"
                                : detail?.DeliveryType == "STOREPICKUP"
                                  ? "order-track"
                                  : "order-tracking"
                            }
                          >
                            <span
                              className={
                                detail?.LstStatusData[1]?.Status == "Cancelled"
                                  ? "not-complete"
                                  : "is-complete"
                              }
                            ></span>
                            {detail?.LstStatusData[1]?.Status == "Cancelled" ? (
                              <p>{detail?.LstStatusData[1]?.Status}</p>
                            ) : (
                              <p>{detail?.LstStatusData[1]?.Status}</p>
                            )}
                            {detail?.LstStatusData[1]?.JSONValue && (
                              <p
                                style={{ fontSize: "small" }}
                                className="pt-0 my-0"
                              >
                                {
                                  JSON.parse(detail?.LstStatusData[1].JSONValue)
                                    .CreatedOn
                                }
                              </p>
                            )}
                          </div>
                        )}
                        {detail?.LstStatusData[2]?.Status && (
                          <div
                            className={
                              detail?.LstStatusData[2]?.JSONValue != ""
                                ? detail?.DeliveryType == "STOREPICKUP"
                                  ? "order-track completed"
                                  : "order-tracking completed"
                                : detail?.DeliveryType == "STOREPICKUP"
                                  ? "order-track"
                                  : "order-tracking"
                            }
                          >
                            <span className="is-complete"></span>
                            <p>{detail?.LstStatusData[2]?.Status}</p>
                            {detail?.LstStatusData[2]?.JSONValue && (
                              <p
                                style={{ fontSize: "small" }}
                                className="pt-0 my-0"
                              >
                                {
                                  JSON.parse(detail?.LstStatusData[2].JSONValue)
                                    .CreatedOn
                                }
                              </p>
                            )}
                          </div>
                        )}
                        {detail?.LstStatusData[3]?.Status && (
                          <div
                            className={
                              detail?.LstStatusData[3]?.JSONValue != ""
                                ? detail?.DeliveryType == "STOREPICKUP"
                                  ? "order-track completed"
                                  : "order-tracking completed"
                                : detail?.DeliveryType == "STOREPICKUP"
                                  ? "order-track"
                                  : "order-tracking"
                            }
                          >
                            <span
                              className={
                                detail?.LstStatusData[3]?.Status != "Delivered"
                                  ? "not-complete"
                                  : "is-complete"
                              }
                            ></span>
                            {detail?.LstStatusData[3]?.Status == "Delivered" ? (
                              <p>{detail?.LstStatusData[3]?.Status}</p>
                            ) : (
                              <p>{detail?.LstStatusData[3]?.Status}</p>
                            )}
                            {detail?.LstStatusData[3]?.JSONValue && (
                              <p
                                style={{ fontSize: "small" }}
                                className="pt-0 my-0"
                              >
                                {
                                  JSON.parse(detail?.LstStatusData[3].JSONValue)
                                    .CreatedOn
                                }
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="  price-details1">
                      <h3>Price details</h3>
                      <ul>
                        <li>
                          <span>
                            Order Total MRP({detail?.lstOrderDetailList?.length}{" "}
                            items)
                          </span>
                          <span>₹{parseInt(detail?.TotalAmount)}</span>
                        </li>
                        <li>
                          <span>Discount on MRP</span>
                          <span className="amount-saved text-success">
                            - ₹
                            {parseInt(detail?.TotalAmount) -
                              parseInt(detail?.NetPayAmount)}
                          </span>
                        </li>
                        <li>
                          <span>Total Price</span>
                          <span className="amount-saved">
                            ₹{parseInt(detail?.NetPayAmount)}
                          </span>
                        </li>
                        <li>
                          <span>Delivery Charges</span>
                          {parseInt(detail?.DeliveryCharge) > 0 ? (
                            <span className="amount-saved text-success">
                              {" "}
                              ₹{parseInt(detail?.DeliveryCharge)}{" "}
                            </span>
                          ) : (
                            <span className="amount-saved">₹ 0</span>
                          )}
                        </li>
                      </ul>

                      <div className="total-price">
                        <span>TOTAL</span>
                        <span>
                          ₹
                         {parseInt(detail?.NetPayAmount) +
                            parseInt(detail?.DeliveryCharge || 0)
                           }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OrderDetails;
