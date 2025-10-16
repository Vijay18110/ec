import React, { useEffect, useMemo, useRef, useState } from "react";
import "./Cart.css";
import { Await, Link, useLocation, useNavigate } from "react-router-dom";
const CartComp = React.lazy(() => import("./Cart/CartComp"));
import { useDispatch, useSelector } from "react-redux";
const AddressComp = React.lazy(() => import("./AddressComp/AddressComp"));
import useApiRequest from "../../Hooks/apiReq";
import { cartActions } from "../../Redux/Slices/cartSlice";
import { validateAddressForm } from "../../Validation/ValidateAddressForm";
import ApiEncryptDecrypt from "../../Utils/Encryption";
import axiosInstance from "../../Utils/axiosInstance";
import { Key } from "../../Utils/Key";
import { toast } from "react-toastify";
import EmptyCart from "./EmptyCart/EmptyCart";
import Loader from "../../ExternalLib/Loader/Loader";
import { uiAction } from "../../Redux/Slices/uiSlice";
import { getWishlist } from "../../Utils/getWishlist";
import { wishlistActions } from "../../Redux/Slices/wishlistSlice";
import BreadCrumb from "./BreadCrumb/BreadCrumb";
import { convertToINRFormat } from "../../Utils/INRConvert";
import { IoTrash } from "react-icons/io5";
import { getloggedCartList } from "../../Utils/getLoggedCartList";
import { getProductCartData } from "../../Utils/getCartList";
import PaymentModal from "./Paymentmodal";
import { getWalletAmmount } from "../../Utils/TotalWallet";
import { walletActions } from "../../Redux/Slices/walletSlice";
import { getShippingAddress } from "../../Utils/getShippingAddress";
import { addressAction } from "../../Redux/Slices/addressSlice";
import AddressModal from "./AddressComp/addessModal";
import SecureIcon2 from "../../assets/Images/secure-icon2.png";
import Paymentcart from "../../assets/Images/payment-cart.jpg";
import ShopifyIcon1 from "../../assets/Images/shopify-icon1.png";
import ShopifyIcon2 from "../../assets/Images/shopify-icon2.png";
import ShopifyIcon3 from "../../assets/Images/shopify-icon3.png";
import ShopifyIcon4 from "../../assets/Images/shopify-icon4.png";
import AddAddressModal from "./AddressModal";
import InputBox from "../../Widgets/InputBox/InputBox";
import ConfettiBackground, { FreeDeliveryMessage } from "./ConfeteBackground";
import offernotfound from "../../assets/offernotfound.png";
import Swal from "sweetalert2";
import info from "../../assets/info.webp";
import offerpic from "../../assets/offerpic.png";
import PreviewImage from "../../ExternalLib/PreviewImage/PreviewImage.jsx";
import noimage from "../../assets/Images/noimage.avif";
import { showOfferPopup } from "./OfferPopup/OfferPopup.jsx";

const Cart = ({ children }) => {
  const [name, setName] = useState("");
  const [Border, setBorder] = useState("#8a934f");
  const dispatch = useDispatch();
  let cartdetails = useSelector((state) => state.cartreducer.cartData);
  let offerPriceFromRedux = useSelector((state) => state.cartreducer.offerPrice);

  const navigate = useNavigate();
  const {
    error: deleteAddressError,
    loading: deleteAddressLoading,
    response: deleteAddressResponce,
    sendApiRequest: deleteAddressSendApiRequest,
    status: deleteAddressStatus,
  } = useApiRequest();
  const {
    error: updateAddressError,
    loading: updateAddressLoading,
    response: updateAddressResponce,
    sendApiRequest: updateAddressSendApiRequest,
    status: updateAddressStatus,
  } = useApiRequest();
  const {
    error: AError,
    loading: Aloading,
    response: Ares,
    sendApiRequest: ASendApiReq,
    status: Astatus,
  } = useApiRequest();
  const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
  const getAddressResponce = useSelector(
    (state) => state.addressreducer.address
  );
  const addressid = useSelector((state) => state.uireducer.addressid);
  const getAddress = async () => {
    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    if (loggedInUser) {
      const { obj } = await getShippingAddress();
      dispatch(addressAction.setAddress(obj?.Response));
    }
  };
  const isLogged = useSelector((state) => state.chatreducer.isLogged);
  useEffect(() => {
    getAddress();
  }, [deleteAddressStatus == 0 || updateAddressStatus == 0, isLogged]);
  const handleDeleteAddress = async (address) => {
    dispatch(uiAction.setAddressid(null));
    deleteAddressSendApiRequest(
      "POST",
      "/DeleteShippingAddress",
      {
        AddressId: address.AddressId,
        CustomerId: address.CustomerId,
        PesronName: address.PesronName,
        AddressName: address.AddressName,
        AddressType: address.AddressType,
        IsDefaultAddress: address.IsDefaultAddress,
        AddressContactNo: address.AddressContactNo,
        State: address.State,
        City: address.City,
        Country: address.Country,
        PinCode: address.PinCode,
        Address1: address.Address1,
        Landmark: address.Landmark,
      },
      "",
      true
    );
    getAddress();
  };
  const addresss = useSelector((state) => state.cartreducer.address);
  const pincodee = useSelector((state) => state.cartreducer.pincode);
  const availabilityMap = useSelector(
    (state) => state.cartreducer.availabilityMap
  );
  const handleSaveAddress = async (data) => {
    if (validateAddressForm(addresss)) {
      updateAddressSendApiRequest(
        "POST",
        "/UpdateShippingAddress",
        {
          AddressId: data?.AddressId,
          CustomerId: data?.CustomerId,
          PesronName: addresss.fullName,
          AddressName: addresss.address,
          AddressType: addresss.addressType,
          IsDefaultAddress: addresss.isDefault,
          AddressContactNo: addresss.mobile,
          State: addresss.state,
          City: addresss.city,
          Country: addresss.country,
          PinCode: pincodee,
          Address1: "",
          Landmark: addresss.landMark,
        },
        "",
        true
      );
      dispatch(
        cartActions.setMultipleFields({
          address: "",
          addressType: "",
          city: "",
          fullName: "",
          isDefault: false,
          landMark: "",
          mobile: "",
          state: "",
        })
      );
      dispatch(cartActions.setPinCode(null));
    }
    getAddress();
  };
  const handleAddWishlist = async (productid) => {
    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));

    if (loggedInUser) {
      const encryptedData = await ApiEncryptDecrypt.encryptString(
        Key,
        JSON.stringify({
          CustomerId: loggedInUser?.CustomerId,
          ProductID: productid,
        })
      );
      const jsonData = { Body: encryptedData };
      let res;
      res = await axiosInstance.post("/AddCustomerWish", jsonData);
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
      }
      if (obj.Status === 1) {
        toast.error(obj.Message);
      }
      if (obj.Status === 3) {
        dispatch(uiAction.openModal());
      }
    } else {
      if (!loggedInUser) {
        dispatch(uiAction.openModal());
        dispatch(uiAction.setScreen("login"));
        dispatch(uiAction.setUser());
        return;
      }
    }
  };
  const handleDefaultAddress = async (addressid) => {
    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
      dispatch(uiAction.openModal());
      dispatch(uiAction.setScreen("login"));
      dispatch(uiAction.setUser());
      return;
    }
    if (loggedInUser) {
      const encryptedData = await ApiEncryptDecrypt.encryptString(
        Key,
        JSON.stringify({
          CustomerId: loggedInUser?.CustomerId,
          AddressId: addressid,
        })
      );
      const jsonData = { Body: encryptedData };
      let res;
      res = await axiosInstance.post("/UpdateDefaultShippingAddress", jsonData);
      const decryptedRes = await ApiEncryptDecrypt.decryptString(
        Key,
        res.data.body
      );
      const obj = JSON.parse(decryptedRes);
      if (obj.Status === 0) {
        getAddress();
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
  };
  const {
    error: getStoreError,
    loading: getStoreLoading,
    response: getStoreResponce,
    sendApiRequest: getStoreSendApiRequest,
    status: getStoreStatus,
  } = useApiRequest();
  const {
    error: OfferError,
    loading: OfferLoading,
    response: OfferRes,
    sendApiRequest: OfferReq,
    status: OfferStatus,
  } = useApiRequest();
  const getstoredetails = async () => {
    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    getStoreSendApiRequest("POST", "/GetStoreList");
    if (loggedInUser) {
      const responce = await getWishlist();
      dispatch(
        wishlistActions.setWishlist(responce?.obj?.Response?.lstWishData)
      );
    }
  };
  useEffect(() => {
    getstoredetails();
    getAddress();
  }, [isLogged]);
  const storeList = useSelector((state) => state.uireducer.storelist);
  const StoreData = JSON.parse(localStorage.getItem("storelist"));
  useEffect(() => {
    if (getStoreResponce) {
      dispatch(uiAction.setAllStoreLists(getStoreResponce?.lstStoreData));
      if (StoreData) {
        dispatch(uiAction.setStorelist(StoreData));
        return;
      }
      if (getStoreResponce?.lstStoreData.length > 0) {
        const filteraddress = getStoreResponce?.lstStoreData.find((it) => {
          return parseInt(it?.StoreID) === 2;
        });
        dispatch(uiAction.setStorelist(filteraddress));
      }
    }
  }, [getStoreStatus == 0]);
  const [loadingP, setLoading] = useState(false);
  const [defaultAddress, setDefaultAddress] = useState();
  const TotalAmount = useMemo(
    () =>
      cartdetails?.reduce(
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
    [cartdetails]
  );
  const storeid = useSelector((state) => state.uireducer.storeid);

  const showPaymentModal = useSelector(
    (state) => state.orderreducer.showPaymentModal
  );
  const [iframeUrl, setIframeUrl] = useState("");
  const countTotalMrp = useMemo(() => {
    return (
      cartdetails?.reduce(
        (prev, curr) =>
          prev + parseInt(Number(curr?.MRP ?? 0)) * curr?.quantity,
        0
      ) ?? 0
    );
  }, [cartdetails]);
  const countTotalPrice = useMemo(() => {
    return (
      cartdetails?.reduce(
        (prev, curr) =>
          prev + parseInt(Number(curr?.BillPrice ?? 0)) * curr?.quantity,
        0
      ) ?? 0
    );
  }, [cartdetails]);
  const DiscountMrp = useMemo(() => {
    return (
      cartdetails?.reduce(
        (acc, item) =>
          acc +
          Math.round(
            parseInt(Number(item?.MRP ?? 0)) * parseInt(item.quantity) -
            parseInt(Number(item?.BillPrice ?? 0)) * parseInt(item.quantity)
          ),
        0
      ) ?? 0
    );
  }, [cartdetails]);
  const OfferPrice = useMemo(() => {
    return cartdetails?.length > 0
      ? cartdetails?.reduce((acc, item) => {
        if (item?.OfferType === "GRANDOFFER") {
          return acc + parseInt(item?.BillPrice ?? 0);
        }
        return acc;
      }, 0)
      : 0;
  }, [cartdetails]);
  const DeleeryCharge = useMemo(
    () =>
      cartdetails?.reduce(
        (prev, curr) =>
          prev + parseInt(curr?.DeliveryCharge) * parseInt(curr?.quantity || 1),
        0
      ),
    [cartdetails]
  );
  const [loader, setLoader] = useState(false);
  const handleDeleteAllproduct = async () => {
    try {
      setLoader(true);
      if (loggedInUser) {
        const data = { CustomerId: loggedInUser.CustomerId };

        const encryptedData = await ApiEncryptDecrypt.encryptString(
          Key,
          JSON.stringify({ ...data })
        );

        const jsonData = { Body: encryptedData };
        let res;

        res = await axiosInstance.post("/AllDeleteCustomerCart", jsonData);

        const decryptedRes = await ApiEncryptDecrypt.decryptString(
          Key,
          res.data.body
        );
        const obj = JSON.parse(decryptedRes);
        if (obj.Status == 0) {
          const { obj } = await getloggedCartList();
          dispatch(cartActions.setCartData(obj?.Response?.lstCartData));
        }
        if (obj.Status === 1) {
          toast.error(obj.Message);
        }
        if (obj.Status === 3) {
        }
      } else {
        const maincartid = localStorage.getItem("maincartid");
        const data = { MainCartId: maincartid };

        const encryptedData = await ApiEncryptDecrypt.encryptString(
          Key,
          JSON.stringify({ ...data })
        );

        const jsonData = { Body: encryptedData };
        let res;

        res = await axiosInstance.post("/AllDeleteCustomerCart", jsonData);

        const decryptedRes = await ApiEncryptDecrypt.decryptString(
          Key,
          res.data.body
        );
        const obj = JSON.parse(decryptedRes);
        if (obj.Status == 0) {
          const responce = await getProductCartData();
          dispatch(cartActions.setCartData(responce?.Response?.lstCartData));
        }
        if (obj.Status === 1) {
          toast.error(obj.Message);
        }
        if (obj.Status === 3) {
        }
      }
    } catch (error) {
      toast.error(error.Message);
      console.log(error.message);
    } finally {
      setLoader(false);
    }
  };
  const getTotalWalletAmmount = async () => {
    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    if (loggedInUser) {
      const { obj } = await getWalletAmmount();
      dispatch(walletActions.setTotalWallet(obj?.Response));
    }
  };
  useEffect(() => {
    getTotalWalletAmmount();
  }, []);
  const cartloader = useSelector((state) => state.walletreducer.loader);
  const PersonName = useSelector((state) => state.cartreducer.personName);
  const handleCheckout = () => {
    for (const element in availabilityMap) {
      if (!availabilityMap[element]) {
        toast.warn("Some Product Not Available In This Store!");
        return;
      }
    }
    const isLoggedIn = JSON.parse(sessionStorage.getItem("loggedInUser"));
    if (!isLoggedIn) {
      dispatch(uiAction.openModal());
      return;
    }
    if (
      !storeid &&
      (getAddressResponce?.lstAddressData.length < 1 || !addressid)
    ) {
      toast.error("Select aleast one address for pickup");
      return;
    }
    if (storeid) {
      if (PersonName.trim()) {
        navigate(
          `/checkout?id=${btoa(name || PersonName)}&addressid=${btoa(
            ""
          )}&storeid=${btoa(storeid)}&personname=${btoa(PersonName)}`
        );
      } else {
        setBorder(() => "#dc3545")
        toast.error("Pickup person name is required");
      }
    } else {
      navigate(`/checkout/?addressid=${btoa(addressid)}&storeid=${btoa("")}`);
    }
  };
  const deleteloader = useSelector(
    (state) => state.addressreducer.deleteloader
  );
  const handleChange = (e) => {
    const { id, value } = e.target;
    if (Border === "#dc3545" && value.trim()) {
      setBorder("#8a934f")
    }
    setName(value);
    dispatch(cartActions.setStorePersonName(value));
  };
  const checkAvailability = () => {
    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    if (cartdetails.length > 0 && storeid && !addressid) {
      ASendApiReq("POST", "/CheckAvailability", {
        CustomerId: loggedInUser?.CustomerId,
        StoreID: storeid,
      });
    } else {
      dispatch(cartActions?.resetAvailabilityMap());
    }
  };
  const checkaddressAvailability = () => {
    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    if (cartdetails.length > 0 && addressid && !storeid) {
      ASendApiReq("POST", "/CheckAvailability", {
        CustomerId: loggedInUser?.CustomerId,
        StoreID: addressid && 1,
      });
    } else {
      dispatch(cartActions?.resetAvailabilityMap());
    }
  };
  useEffect(() => {

    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    if (loggedInUser) {
      checkAvailability();
    }
  }, [storeid]);
  useEffect(() => {

    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    if (loggedInUser) {
      checkaddressAvailability();
    }
  }, [addressid, storeid]);
  useEffect(() => {
    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    if (loggedInUser) {
      dispatch(cartActions?.resetAvailabilityMap());
      Ares?.lstCheckAvailabilityData?.forEach((item) => {
        dispatch(cartActions.setAvailableProducts(item));
      });
    }
  }, [Ares]);
  const renderTotalDiscountMessage = ({
    DeleeryCharge,
    DiscountMrp,
    countTotalPrice,
    storeid,
    addressid
  }) => {
    const deliveryChargeToUse =
      DeleeryCharge > 0
        ? DeleeryCharge
        : countTotalPrice >= 999
          ? !storeid && addressid
            ? 60
            : 0
          : 0;
    const totalSaving = DiscountMrp + deliveryChargeToUse;
    if (totalSaving <= 0) return null;
    return (
      <p className="page-total-discount-message text-success">
        You’re saving{" "}
        <span className="total-saving-amt" total-saving-amt={totalSaving}>
          {Number(countTotalPrice) > 999 && !storeid && loggedInUser
            ? `delivery charge ₹60 + discount ₹${DiscountMrp}  = ₹${totalSaving}`
            : `₹${totalSaving}`}
        </span>{" "}
      </p>
    );
  };
  const [isPreviousCall, setPreViousCall] = useState(false);
  const [offerPrice, setOfferPrice] = useState(null)
  const testImage = (url) =>
    new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  const getIsAnyOfferAtTotalPrice = () => {
    if (offerPriceFromRedux?.OFFERPrice) {
      return;
    }
    const Data = {
      CartPrice: countTotalPrice +
        (DeleeryCharge > 0
          ? DeleeryCharge
          : countTotalPrice >= 999
            ? 0
            : !storeid && addressid
              ? 60
              : 0)
    }
    OfferReq("POST", "/CheckCartPriceOffer", Data, {
      onSuccess: async (res) => {
        // console.log(res)
        if (res.OFFERPrice) {
          sessionStorage.setItem("OFFERPrice", res?.OFFERPrice)
          setOfferPrice(res?.OFFERPrice);
          dispatch(cartActions.setOfferPrice(res))
        }
        const isValidImage = await testImage(`https://api.ravorganics.com/api/ImageMengement/ResizeOfferImageFromUrl?imageName=${res?.OfferImage}&&height=${600}&&q=${100}&&width=${600}`);
        const imageToUse = isValidImage ? `https://api.ravorganics.com/api/ImageMengement/ResizeOfferImageFromUrl?imageName=${res?.OfferImage}&&height=${600}&&q=${100}&&width=${600}` : offernotfound;
        if (res?.IsCartPriceOffer !== "False") {

          showOfferPopup(res?.OfferDescription, res?.OfferName, `Offer found at Total Price Worth  : ₹${parseInt(res?.OFFERPrice)}`, imageToUse)
        }
      }
    });
  }
  useEffect(() => {
    if (offerPriceFromRedux?.OFFERPrice > countTotalPrice +
      (DeleeryCharge > 0
        ? DeleeryCharge
        : countTotalPrice >= 999
          ? 0
          : !storeid && addressid
            ? 60
            : 0)) {
      setOfferPrice(null);
      dispatch(cartActions.setOfferPrice(null))
    }

    getIsAnyOfferAtTotalPrice();

  }, [countTotalPrice])
  const [isFreeDelivery, setisFreeDelivery] = useState(false)
  const [isError, setIsError] = useState(false);
  const handleImageError = () => {
    setIsError(!isError);
  };
  useEffect(() => {
    if (isFreeDelivery && Number(countTotalPrice) >= 999) {
      return;
    }
    if (!isFreeDelivery && Number(countTotalPrice) >= 999 && !storeid) {
      setisFreeDelivery(true)
    } else {
      setisFreeDelivery(false)
    }
  }, [countTotalPrice])
  const showOffer = (res) => {

    return (<div className="price-list">

      <PreviewImage
        style={{
          height: "25px",
          maxWidth: "25px",
          borderRadius: "50%",
        }}
        newPic={info}
        imgwithUrl={`https://api.ravorganics.com/api/ImageMengement/ResizeOfferImageFromUrl?imageName=${res?.OfferImage}&&height=${600}&&q=${100}&&width=${600}`}
      />
    </div>)
    return (
      <li className={`base-class`}>
        <div
          style={{
            position: "relative",
            zIndex: 0,
            pointerEvents: "auto",
          }}
        >
          <div className="cart_line-item-top">
            <div className="cart_line-item-left">

              <img
                loading="lazy"
                src={isError ? noimage : res?.OfferImage}
                onError={handleImageError}
                alt="RAV organics"
                style={{ display: "none" }}
              />
              <PreviewImage

                // newPic={info}
                imgwithUrl={isError ? noimage : res?.OfferImage}
              />
            </div>
            <div className="cart_line-item-right">
              <span>{res?.OfferName}</span>
              <div>
                <span>{`Offer Found at Total Price Above ${convertToINRFormat(res?.OFFERPrice)}`}</span>
              </div>
              <div className="price-list">
                <span className="line-item">₹0</span>
              </div>
              {/* <p style={{ fontSize: "12px" }} className="m-0 ">
                QTY :{" "}
                <span className="fw-bold text-success">1</span>{" "}
              </p> */}


            </div>
          </div>
        </div>
        {/* 
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
        )} */}


      </li>
    )
    // alert("sdfjks")
  }
  return (
    <>
      {isFreeDelivery && (
        <>
          <ConfettiBackground trigger={true} />
          <FreeDeliveryMessage isFreeDelivery={isFreeDelivery} />

        </>
      )}
      {showPaymentModal && <PaymentModal iframeUrl={iframeUrl} />}
      <BreadCrumb />
      {!deleteloader && cartdetails?.length > 0 ? (
        <div className="rts-cart-area">
          <div className="container">
            <div className="row">
              <div className="col-xl-9 col-lg-12 col-md-12">
                <div className="cart-wrapper">
                  <div className="cartpage-header"></div>
                  {loggedInUser && (
                    <div className="card-full-width">
                      <div className="d-flex mb-0 justify-content-between">
                        <span
                          className="fw-bold fs-4  d-flex "
                          style={{ color: "#587444" }}
                        >
                          Delivery Mode
                        </span>
                        <AddAddressModal />
                      </div>
                      {getAddressResponce?.lstAddressData?.length > 0 && (
                        <>
                          {/* Check if default exists */}
                          {getAddressResponce.lstAddressData.some(
                            (it) => it?.IsDefault === "True"
                          ) ? (
                            // If default exists, show only "Deliver Here"
                            getAddressResponce.lstAddressData.map((it, index) =>
                              it?.IsDefault === "True" ? (
                                <small
                                  key={index}
                                  className="deliver-btn"
                                >
                                  Deliver Here
                                </small>
                              ) : null
                            )
                          ) : (
                            // If no default, show AddressModal only once
                            <AddressModal

                              handleDefaultAddress={handleDefaultAddress}
                              addresses={getAddressResponce.lstAddressData}
                            />
                          )}
                        </>
                      )}
                      <div className="row">
                        {getAddressResponce?.lstAddressData.length > 0 &&
                          getAddressResponce?.lstAddressData.map(
                            (it, index) => {
                              return (
                                it?.IsDefault == "True" && (
                                  <AddressComp
                                    handleDeleteAddress={handleDeleteAddress}
                                    item={it}
                                    address={it?.Address}
                                    addressType={it?.AddressType}
                                    name={it?.PersonName}
                                    city={it?.City}
                                    country={it?.Country}
                                    landmark={it?.Landmark}
                                    mobile={it?.AddressContactNo}
                                    pincode={it.Pincode}
                                    state={it.State}
                                    key={index}
                                    handleSaveAddress={handleSaveAddress}
                                    handleDefaultAddress={handleDefaultAddress}
                                    setDefaultAddress={setDefaultAddress}
                                    getAddress={getAddress}
                                    setName={setName}
                                    alladdress={
                                      getAddressResponce?.lstAddressData
                                    }
                                  />
                                )
                              );
                            }
                          )}
                      </div>
                      <span
                        className="fw-bold fs-4 d-flex"
                        style={{ color: "#587444" }}
                      >
                        Store Pickup
                      </span>
                      <small className="deliver-btn">Our Stores</small>
                      <div className="row">
                        {getStoreResponce?.lstStoreData.length > 0 && (
                          <AddressComp
                            handleDeleteAddress={handleDeleteAddress}
                            item={storeList}
                            address={storeList?.StoreAddress}
                            name={storeList?.StoreName}
                            isdefault={true}
                            city={storeList?.StoreCity}
                            country={storeList?.StoreCountry}
                            mobile={storeList?.StoreMobile}
                            pincode={storeList?.StorePincode}
                            state={storeList?.StoreState}
                            email={storeList?.StoreEmail}
                            handleSaveAddress={handleSaveAddress}
                            handleDefaultAddress={handleDefaultAddress}
                          />
                        )}
                        {storeid && (
                          <InputBox
                            handleChange={handleChange}
                            id="name"
                            isRequired={true}
                            placeholder="Person Name"
                            type="text"
                            value={PersonName}
                            Border={`${Border} 2px solid`}
                          />
                        )}
                      </div>
                    </div>
                  )}
                  {!storeid &&
                    addressid &&
                    (countTotalPrice +
                      (DeleeryCharge > 0
                        ? DeleeryCharge
                        : countTotalPrice >= 999
                          ? 0
                          : !storeid && addressid
                            ? 60
                            : 0) <
                      999 ? (
                      <div className="card-body bg-white p-3 mb-3 border rounded">
                        <div className="congratulations">
                          <h4 className="fw-bold fs-5">
                            <i
                              className="fa fa-check-circle"
                              aria-hidden="true"
                            ></i>{" "}
                            Add more{" "}
                            <b className=" text-danger">

                              {convertToINRFormat(999 - countTotalPrice)}
                            </b>{" "}
                            to get free home delivery !!
                          </h4>
                        </div>
                      </div>
                    ) : (
                      <div className="card-body bg-white p-3 mb-3 border rounded">
                        <div className="congratulations">
                          <h4 className="fw-bold fs-5">
                            <i
                              className="fa fa-check-circle"
                              aria-hidden="true"
                            ></i>{" "}
                            free home delivery !!
                          </h4>
                        </div>
                      </div>
                    ))}

                  <div className="cartpage-header"></div>
                  <div className="card-full-width">
                    <h3 className="d-flex justify-content-between">
                      <p className="h5 d-flex ms-2">
                        My Cart
                        <span className="text-secondary">
                          (Your Cart has<span> {cartdetails.length} items</span>
                          )

                        </span>
                        <Link title={offerPriceFromRedux?.OfferName}>
                          {offerPriceFromRedux?.IsCartPriceOffer === "True" && showOffer(offerPriceFromRedux)}
                        </Link>
                      </p>
                      {cartdetails.length > 0 && (
                        <p>
                          <i
                            onClick={handleDeleteAllproduct}
                            style={{ cursor: "pointer" }}
                            className="text-danger d-inline-block p-1 bg-danger-subtle border rounded"
                          >
                            <IoTrash size={20} />
                          </i>
                        </p>
                      )}
                    </h3>
                    <ul>

                      {cartdetails.map((item, index) => {
                        const isAvailable = availabilityMap[item.ProductId];
                        return (
                          <CartComp
                            key={index}
                            item={item}
                            img={item?.ProductThumbnail}
                            name={item?.ProductName}
                            price={Number(item?.BillingPrice ?? 0)}
                            mrp={Number(item?.MRP ?? 0)}
                            discount={Number(item?.DiscountPercent ?? 0)}
                            subname={item?.SubcategoryName}
                            handleAddWishlist={handleAddWishlist}
                            isAvailable={isAvailable}
                            checkAvailability={checkAvailability}
                          />
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-12 col-md-12">
                <div className="price-details">
                  <h3>Order details</h3>
                  <ul>
                    <li>
                      <span>
                        Order Total MRP({cartdetails.length ?? 0} items)
                      </span>
                      <span>₹{countTotalMrp}</span>
                    </li>
                    <li>
                      <span> Your Discount</span>
                      <span className="amount-saved">- ₹{DiscountMrp}</span>
                    </li>


                    <li>
                      <span>Total Price</span>
                      <span>₹{countTotalPrice}</span>
                    </li>
                    {!storeid && <li>
                      <span>Delivery Charges</span>
                      <span className="amount-saved">

                        {DeleeryCharge > 0
                          ? `${DeleeryCharge}`
                          : countTotalPrice >= 999
                            ? <span>  <del className="text-danger">  ₹60 </del>  Free </span>
                            : !storeid && addressid
                              ? "₹60"
                              : <span><del className="text-danger"> ₹60 </del> Free</span>}
                      </span>
                    </li>}
                  </ul>
                  <div className="total-price">
                    <span>TOTAL</span>
                    <span>
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

                  {renderTotalDiscountMessage({
                    DeleeryCharge,
                    DiscountMrp,
                    countTotalPrice,
                    storeid,
                    addressid
                  })}

                  <div className="button-area">
                    <button
                      className="sr-headless-checkout"
                      onClick={handleCheckout}
                    >
                      Checkout
                      {loadingP && (
                        <>
                          <div
                            className="spinner-border spinner-border-sm text-danger"
                            role="status"
                          />
                        </>
                      )}
                    </button>
                  </div>
                  <div className="secure-payment">
                    <p>
                      <img loading="lazy" src={SecureIcon2} alt="" /> 100%
                      Secure Payments
                    </p>
                  </div>
                  <div className="payment-list-centered">
                    <img loading="lazy" src={Paymentcart} alt="" />
                  </div>
                  <div className="icons-with-text">
                    <ul>
                      <li>
                        <div className="icon">
                          <img loading="lazy" src={ShopifyIcon1} alt="" />
                        </div>
                        <div className="title-content">
                          Free delivery across India
                        </div>
                      </li>
                      <li>
                        <div className="icon">
                          <img loading="lazy" src={ShopifyIcon2} alt="" />
                        </div>
                        <div className="title-content">Easy replacement</div>
                      </li>
                      <li>
                        <div className="icon">
                          <img loading="lazy" src={ShopifyIcon3} alt="" />
                        </div>
                        <div className="title-content">
                          Strict COVID-safety measures
                        </div>
                      </li>
                      <li>
                        <div className="icon">
                          <img loading="lazy" src={ShopifyIcon4} alt="" />
                        </div>
                        <div className="title-content">Secure payments</div>
                      </li>
                    </ul>
                  </div>
                  <div className="itrust-factors">
                    <Link to="/return-policy">Cancellation policy</Link>
                    <Link to="/return-policy">Returns policy</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        !deleteloader && <EmptyCart />
      )}
      {(updateAddressLoading ||
        deleteAddressLoading ||
        getStoreLoading ||
        cartloader ||
        loader ||
        Aloading ||
        deleteloader) && <Loader />}
    </>
  );
};

export default Cart;
