import React, { useEffect, useMemo, useRef, useState } from "react";
import "./Cart.css";
import { Await, Link, useLocation, useNavigate } from "react-router-dom";
import UpiOptions from "../../assets/Images/upi_options.svg";
import RightArrow from "../../assets/Images/right_arrow.svg";
import SecureIcon2 from "../../assets/Images/secure-icon2.png";
import Paymentcart from "../../assets/Images/payment-cart.jpg";
import ShopifyIcon1 from "../../assets/Images/shopify-icon1.png";
import ShopifyIcon2 from "../../assets/Images/shopify-icon2.png";
import ShopifyIcon3 from "../../assets/Images/shopify-icon3.png";
import ShopifyIcon4 from "../../assets/Images/shopify-icon4.png";
import CartComp from "./Cart/CartComp";
import { useDispatch, useSelector } from "react-redux";
import AddressComp from "./AddressComp/AddressComp";
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
import Swal from "sweetalert2";
import PaymentMethod from "./PaymentMethod/PaymentMethod";
import BreadCrumb from "./BreadCrumb/BreadCrumb";
import PaymentModal from "./Paymentmodal";
import { orderAction } from "../../Redux/Slices/orderSlice";
import { getWalletAmmount } from "../../Utils/TotalWallet";
import { walletActions } from "../../Redux/Slices/walletSlice";
import { getShippingAddress } from "../../Utils/getShippingAddress";
import { addressAction } from "../../Redux/Slices/addressSlice";
import { BiArrowBack } from "react-icons/bi";
const Checkout = ({ children }) => {
  const { search } = useLocation();
  const searchparam = new URLSearchParams(search);
  const personame = atob(searchparam.get("id"));
  const storeid = atob(searchparam.get("storeid"));
  const addressid = atob(searchparam.get("addressid"));
  const personeName = atob(searchparam.get("personname"));
  const dispatch = useDispatch();
  let cartdetails = useSelector((state) => state.cartreducer.cartData);
  const PersonName = useSelector((state) => state.cartreducer.personName);
  const navigate = useNavigate();
  // console.log("storeid", storeid);
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
  const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
  const getAddressResponce = useSelector(
    (state) => state.addressreducer.address
  );
  const getAddress = async () => {
    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    if (loggedInUser) {
      const { obj } = await getShippingAddress();
      dispatch(addressAction.setAddress(obj?.Response));
    }
  };
  // console.log(getAddressResponce);
  const isLogged = useSelector((state) => state.chatreducer.isLogged);
  useEffect(() => {
    getAddress();
  }, [deleteAddressStatus == 0 || updateAddressStatus == 0, isLogged]);
  const handleDeleteAddress = async (address) => {
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
  const handleDefaultAddress = (addressid) => {
    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
      dispatch(uiAction.openModal());
      dispatch(uiAction.setScreen("login"));
      dispatch(uiAction.setUser());
      return;
    }
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "You want to make this default!",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        reverseButtons: true,
        buttonsStyling: { padding: "30px" },
      })
      .then(async (result) => {
        if (result.isConfirmed) {
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
            res = await axiosInstance.post(
              "/UpdateDefaultShippingAddress",
              jsonData
            );
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
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      });
  };
  const {
    error: getStoreError,
    loading: getStoreLoading,
    response: getStoreResponce,
    sendApiRequest: getStoreSendApiRequest,
    status: getStoreStatus,
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
      dispatch(uiAction.setStorelist(getStoreResponce?.lstStoreData[0]));
    }
  }, [getStoreStatus == 0]);
  //CreatePaymentLink api
  const [loadingP, setLoading] = useState(false);
  const [payment, setPayment] = useState({
    Online: "Online",
    Offline: "",
    Wallet: "",
  });
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
  const [clickCount, setClickCount] = useState(0);
  const [name, setName] = useState(PersonName);
  const showPaymentModal = useSelector(
    (state) => state.orderreducer.showPaymentModal
  );
  const isclose = useSelector((state) => state.orderreducer.isclose);
  const [iframeUrl, setIframeUrl] = useState("");
  const intervalRef = useRef(null);
  const handleClose = () => {
    if (intervalRef.current) {
      // console.log(intervalRef.current);
      clearInterval(intervalRef.current);
      toast.error("Payment failed");
      intervalRef.current = null;
    }
    dispatch(orderAction.setShowPaymentModal(false));
  };

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

  const totalbill = useMemo(() => {
    return countTotalMrp +
      (DeleeryCharge > 0
        ? DeleeryCharge
        : countTotalPrice >= 999
          ? 0
          : !storeid && addressid
            ? 60
            : 0) -
      DiscountMrp || 0;
  }, [storeid, cartdetails])



  const handleBuyNow = async () => {
    for (const element in availabilityMap) {
      if (!availabilityMap[element]) {
        toast.warn("Some Product Not Avaiable In This Store!");
        return;
      }
    }

    if (!loggedInUser) {
      dispatch(uiAction.openModal());
      return;
    }
    if (!storeid && !addressid) {
      toast.error("Select aleast one address for pickup");
      return;
    }
    if (!personeName && !addressid) {
      toast.error("Person name is required for Store Address");
      return;
    }
    setClickCount(1);
    if (
      clickCount == 1 &&
      !payment.Offline &&
      !payment.Online &&
      !payment.Wallet
    ) {
      toast.error("Select Payment method ");
      setClickCount(0);
      return;
    }
    const delivercharge = cartdetails?.reduce((prev, curr) => {
      const total =
        prev + parseInt(curr.DeliveryCharge) * parseInt(curr?.quantity || 1);
      return total;
    }, 0);
    const isDefaultAddress = getAddressResponce?.lstAddressData.find(
      (it) => it?.IsDefault === "True"
    );
    if (!storeid && !isDefaultAddress) {
      toast.error("Select aleast one address for pickup");
      return;
    }
    if (payment.Online === "Online") {
      try {
        setLoading(true);
        const data = {
          CustomerId: loggedInUser.CustomerId,
          OrderTransactionID: "ORDTXN001",
          OrderStatusId: 1,
          DeliveryMode: addressid ? "HOMEDELIVERY" : "STOREPICKUP",
          PaymentMode: payment.Online || payment.Offline,
          TransactionID: "TXN12345",
          ShippingCharge:
            delivercharge > 0 ? delivercharge : countTotalPrice >= 999 ? 0 : (addressid && !storeid) ? 60 : 0,
          AddressId: addressid ? addressid : 0,
          PesronName: personeName || PersonName || isDefaultAddress?.PersonName,
          StoreID: storeid ? storeid : 1,
          TotalAmount: totalbill,
        };
        // console.log(data)
        const encryptedData = await ApiEncryptDecrypt.encryptString(
          Key,
          JSON.stringify({ ...data })
        );
        const jsonData = { Body: encryptedData };
        const res = await axiosInstance.post("/CreatePaymentLink_v2", jsonData);
        setLoading(false);
        if (res?.data) {
          const verifydata = {
            PaymentId: res?.data?.paymentId,
            CustomerId: loggedInUser.CustomerId,
            TempOrderID: res?.data?.tempOrderId,
          };
          if (res?.data?.link) {
            setIframeUrl(res.data.link); // Set the payment link
            dispatch(orderAction.setShowPaymentModal(true));
            let attempts = 0;
            let count = 1;
            let isWaitingForUser = false; // To avoid multiple modals opening

            intervalRef.current = setInterval(async () => {
              if (isWaitingForUser) return; // stop loop while waiting
              try {
                attempts++;

                const encryptedData = await ApiEncryptDecrypt.encryptString(
                  Key,
                  JSON.stringify({ ...verifydata })
                );
                const jsonData = { Body: encryptedData };

                const res = await axiosInstance.post(
                  "/VerifyPayment",
                  jsonData
                );
                const decryptedRes = await ApiEncryptDecrypt.decryptString(
                  Key,
                  res.data.body
                );
                const obj = JSON.parse(decryptedRes);

                if (obj.Status === 0 && obj.Response.PaymentStatus === "paid") {
                  clearInterval(intervalRef.current);
                  dispatch(cartActions.setCartData(null));
                  localStorage.removeItem("storedData");
                  toast.success("Payment successful!");
                  setName("");
                  dispatch(orderAction.setShowPaymentModal(false));
                  navigate(
                    `/order-success/?id=${btoa(obj?.Response?.OrderNumber)}`
                  );
                  return;
                }
                if (obj.Status === 1) {
                  toast.error(obj.Message);
                } else if (attempts > 9) {
                  if (count >= 3) {
                    toast.error("Payment failed after multiple retries!");
                    clearInterval(intervalRef.current);
                    dispatch(orderAction.setShowPaymentModal(false));
                    return;
                  }
                  isWaitingForUser = true; // pause further checks
                  Swal.fire({
                    title: "Alert for Payment",
                    text: "Do you want to continue?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Continue",
                    cancelButtonText: "Cancel",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                  }).then((result) => {
                    isWaitingForUser = false;
                    if (result.isConfirmed) {
                      attempts = 4; // retry from half
                      count++;
                    } else if (result.dismiss === Swal.DismissReason.cancel) {
                      toast.error("Payment cancelled!");
                      clearInterval(intervalRef.current);
                      dispatch(orderAction.setShowPaymentModal(false));
                    }
                  });
                }
              } catch (err) {
                console.error("Verification failed", err);
                clearInterval(intervalRef.current);
                dispatch(orderAction.setShowPaymentModal(false));
              }
            }, 10000);
          } else {
            toast.error(res?.data?.message);
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    } else if (payment.Wallet === "Wallet") {
      try {
        const data = {
          CustomerId: loggedInUser.CustomerId,
          DeliveryMode: addressid ? "HOMEDELIVERY" : "STOREPICKUP",
          TransactionID: "",
          ShippingCharge: 0,
          AddressId: addressid ? addressid : 0,
          PesronName: personeName || PersonName || isDefaultAddress?.PersonName,
          StoreID: storeid ? storeid : 1,
          TotalAmount: totalbill,
        };

        const encryptedData = await ApiEncryptDecrypt.encryptString(
          Key,
          JSON.stringify({ ...data })
        );
        const jsonData = { Body: encryptedData };
        let res;
        res = await axiosInstance.post("/CustOrderFormWallet_v2", jsonData);
        const decryptedRes = await ApiEncryptDecrypt.decryptString(
          Key,
          res.data.body
        );
        const obj = JSON.parse(decryptedRes);
        if (obj.Status == 0) {
          toast.success(obj.Message);
          setName("");
          dispatch(cartActions.setCartData(null));
          localStorage.removeItem("storedData");
          navigate(`/order-success/?id=${btoa(obj?.Response?.OrderNumber)}`);
          // dispatch(uiAction.settabs("myOrders"));
        }
        // Handle different status codes
        if (obj.Status === 1) {
          toast.error(obj.Message);
        }
        if (obj.Status === 3) {
        }
      } catch (error) {
        toast.error(obj.Message);
        console.log(error.message);
      }
    }
  };



  //total wallet balance api
  const totalWalletResponce = useSelector(
    (state) => state.walletreducer.totalWallet
  );
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

  return (
    <>
      {showPaymentModal && (
        <PaymentModal handleClose={handleClose} iframeUrl={iframeUrl} />
      )}
      {/* <BreadCrumb /> */}
      <div className="container backcontainer">
        <i onClick={() => navigate("/customer-cart-details")}>
          <BiArrowBack size={20} />
        </i>
      </div>
      {cartdetails && cartdetails.length > 0 ? (
        <div className="rts-cart-area">
          <div className="container">
            <div className="row">
              <div className="col-xl-9 col-lg-12 col-md-12">
                <div className="cart-wrapper">
                  <div className="cartpage-header"></div>
                  {loggedInUser && (
                    <div className="card-full-width">
                      {addressid && (
                        <div className="d-flex justify-content-between">
                          <span
                            className="fw-bold fs-4 mb-2 d-flex "
                            style={{ color: "#587444" }}
                          >
                            Delivery Mode
                          </span>
                        </div>
                      )}
                      {addressid && (
                        <>
                          <small className="deliver-btn">Deliver Here</small>

                          <div className="row">
                            {getAddressResponce?.lstAddressData.length > 0 &&
                              getAddressResponce?.lstAddressData.map(
                                (it, index) => {
                                  return (
                                    it?.IsDefault == "True" && (
                                      <AddressComp
                                        handleDeleteAddress={
                                          handleDeleteAddress
                                        }
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
                                        handleDefaultAddress={
                                          handleDefaultAddress
                                        }
                                        setDefaultAddress={setDefaultAddress}
                                        getAddress={getAddress}
                                        alladdress={
                                          getAddressResponce?.lstAddressData
                                        }
                                        ischeckout={true}
                                      />
                                    )
                                  );
                                }
                              )}
                          </div>
                        </>
                      )}
                      {storeid && (
                        <span
                          className="fw-bold fs-4 mb-2 d-flex "
                          style={{ color: "#587444" }}
                        >
                          Store Pickup
                        </span>
                      )}
                      {storeid && (
                        <>
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
                                fullname={name}
                                setName={setName}
                                ischeckout={true}
                                personame={personame}
                              />
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                  <div className="cartpage-header"></div>

                  <div className="card-full-width">
                    <h3 className="d-flex justify-content-between">
                      <p className="h5">ITEM'S FOR CHECKOUT</p>
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
                            Checkout={true}
                            isAvailable={isAvailable}








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
                      <span>Discount on MRP</span>
                      <span className="amount-saved">- ₹{DiscountMrp}</span>
                    </li>

                    <li>
                      <span>Total Offer Price</span>
                      <span className="amount-saved">₹{OfferPrice}</span>
                    </li>
                    <li>
                      <span>Total Price</span>
                      <span className="amount-saved">₹{countTotalPrice}</span>
                    </li>
                    <li>
                      <span>Delivery Charges</span>
                      <span className="amount-saved">
                        ₹
                        {DeleeryCharge > 0
                          ? `${DeleeryCharge}`
                          : countTotalPrice >= 999
                            ? 0
                            : !storeid && addressid
                              ? 60
                              : 0}
                      </span>
                    </li>
                  </ul>

                  <div className="total-price">
                    <span>TOTAL</span>
                    <span>
                      ₹
                      {totalbill}
                    </span>
                  </div>

                  <PaymentMethod
                    total={totalWalletResponce}
                    payment={payment}
                    setPayment={setPayment}
                    total1={
                      countTotalPrice +
                      (DeleeryCharge > 0
                        ? DeleeryCharge
                        : countTotalPrice >= 999
                          ? 0
                          : !storeid && addressid
                            ? 60
                            : 0)
                    }
                  />
                  <div className="button-area">
                    {payment.Online ? (
                      <button
                        className="sr-headless-checkout"
                        onClick={handleBuyNow}
                      >
                        {!loadingP && (
                          <>
                            <span>BUY NOW</span>
                            <img
                              loading="lazy"
                              className="sr-pl-15"
                              src={UpiOptions}
                              alt=""
                            />
                            <img
                              loading="lazy"
                              className="sr-pl-15"
                              src={RightArrow}
                              alt=""
                            />
                          </>
                        )}
                        {loadingP && (
                          <>
                            <div
                              className="spinner-border spinner-border-sm text-danger"
                              role="status"
                            />
                          </>
                        )}
                      </button>
                    ) : payment.Wallet == "Wallet" ? (
                      <button
                        className="sr-headless-checkout"
                        onClick={handleBuyNow}
                      >
                        Place Order
                      </button>
                    ) : (
                      <button
                        className="sr-headless-checkout"
                        onClick={handleBuyNow}
                      >
                        <span>Make Payment</span>
                        <img
                          loading="lazy"
                          className="sr-pl-15"
                          src={UpiOptions}
                          alt=""
                        />
                        <img
                          loading="lazy"
                          className="sr-pl-15"
                          src={RightArrow}
                          alt=""
                        />
                      </button>
                    )}
                  </div>
                  <div className="secure-payment">
                    <p>
                      <img loading="lazy" src={SecureIcon2} alt="" />
                      100% Secure Payments
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
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <EmptyCart />
      )}
      {(updateAddressLoading ||
        deleteAddressLoading ||
        getStoreLoading ||
        cartloader) && <Loader />}
    </>
  );
};
export default Checkout;
