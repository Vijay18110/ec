import React, { useEffect, useState } from "react";
import MyOrdersimg from "../../../assets/Images/my-orders.png";
import LoyaltyProgramme from "../../../assets/Images/loyalty-programme.jpg";
import ReferFriend from "../../../assets/Images/refer-a-friend.jpg";
import MyAddresses from "../../../assets/Images/my-addresses.jpg";
import MyWishlist from "../../../assets/Images/my-wishlist.jpg";
import NeedHelp from "../../../assets/Images/need-help.jpg";
import PreviewImage from "../../../ExternalLib/PreviewImage/PreviewImage.jsx";
import Tooltip from "../../ToolTip/ToolTip.jsx";
import { MdOutlineEdit, MdOutlineMail } from "react-icons/md";
import { IoMdCall } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import ApiEncryptDecrypt from "../../../Utils/Encryption.js";
import { Key } from "../../../Utils/Key.js";
import axiosInstance from "../../../Utils/axiosInstance.js";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { uiAction } from "../../../Redux/Slices/uiSlice.jsx";
import { cartActions } from "../../../Redux/Slices/cartSlice.jsx";
import { wishlistActions } from "../../../Redux/Slices/wishlistSlice.jsx";
import { chatAction } from "../../../Redux/Slices/chatSlice.jsx";
import { orderAction } from "../../../Redux/Slices/orderSlice.jsx";
import { getWishlist } from "../../../Utils/getWishlist.js";
import { validateFileType1 } from "../../../Utils/CheckFileValidation.jsx";
import UserDefaultPic from "../../../assets/Images/userDefaultImg.webp";
const UserSlider = () => {
  const tabs = useSelector((state) => state.uireducer.tabs);
  const [response, setResponce] = useState([]);
  const dispatch = useDispatch();
  const [pincode, setpincode] = useState(null);
  const loggedInUserData = JSON.parse(sessionStorage.getItem("loggedInUser"));
  const getProfileData = async () => {
    const userData = {
      CustomerId: loggedInUserData?.CustomerId,
      LoginToken: loggedInUserData?.LoginToken,
      DeviceType: "Web",
      AppVersion: "1.0",
    };
    const encryptedData = await ApiEncryptDecrypt.encryptString(
      Key,
      JSON.stringify({ ...userData })
    );
    const jsonData = { Body: encryptedData };
    let res;

    res = await axiosInstance.post("/CustomerDetail", jsonData);

    const decryptedRes = await ApiEncryptDecrypt.decryptString(
      Key,
      res.data.body
    );
    const obj = JSON.parse(decryptedRes);

    if (obj.Status === 0) {
      setResponce(obj?.Response);
    }
    if (obj.Status === 1) {
      toast.error(obj.Message);
    }
    if (obj.Status === 3) {
      dispatch(uiAction.openModal());
    }
  };
  const navigate = useNavigate();
  useEffect(() => {
    getProfileData();
  }, []);

  const getCartAndWishlist = () => {
    dispatch(cartActions.setResponceData([]));
    dispatch(wishlistActions.setWishlist([]));
  };
  const handleLogout = () => {
    sessionStorage.removeItem("loggedInUser");
    getCartAndWishlist();
    dispatch(uiAction.setUser());
    dispatch(cartActions.setCartData(null));
    navigate("/");
  };
  const handleSetTab = async (tabsName) => {
    if (tabsName === "SupportTicketList") {
      dispatch(chatAction.setIsOpenSupportTicketForm(false));
    }

    dispatch(uiAction.settabs(tabsName));
    dispatch(wishlistActions.setIsOrderDetail(false));
    dispatch(orderAction.setIsReturn(false));
  };
  const lists = useSelector((state) => state.wishlistreducer.wishlist);
  const getresponce = async () => {
    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    if (loggedInUser) {
      const responce = await getWishlist();
      dispatch(
        wishlistActions.setWishlist(responce?.obj?.Response?.lstWishData)
      );
    }
  };
  useEffect(() => {
    getresponce();
  }, []);
  const handleMyAccount = () => {
    if (loggedInUserData) {
      dispatch(
        uiAction.setCustomer({
          field: "solutation",
          value: response?.Solutation,
        })
      );
      dispatch(
        uiAction.setCustomer({ field: "mobile", value: response?.Mobile })
      );
      dispatch(
        uiAction.setCustomer({ field: "email", value: response?.CustomerEmail })
      );
      dispatch(
        uiAction.setCustomer({ field: "address", value: response?.Address })
      );
      dispatch(uiAction.setCustomer({ field: "city", value: response?.City }));
      dispatch(
        uiAction.setCustomer({ field: "country", value: response?.Country })
      );
      dispatch(
        uiAction.setCustomer({ field: "state", value: response?.State })
      );
      dispatch(
        uiAction.setCustomer({
          field: "fullName",
          value: response?.CustomerName,
        })
      );
      setpincode(response?.Pincode);
      dispatch(uiAction.settabs("myAccount"));
    }
  };
  // update profilefullName: "",
  const customer = useSelector((state) => state.uireducer.customer);
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isUpload, setIsUpload] = useState(false);
  const [file, setFile] = useState(null);
  const handleChangeFile = (e) => {
    const file = e.target.files[0];
    console.log("file", file)
    if (!validateFileType1(file)) {
      return;
    }
    setIsUpload(true);
    if (!file) return;
    setFile(file);
    setImageSrc(file);
  };
  const handleUploadFile = async () => {
    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    try {
      const formdata = new FormData();
      formdata.append("File", file);
      const data = {
        CustomerId: loggedInUser?.CustomerId,
      };
      if (!file) {
        toast.error("Please select profile");
        return;
      }
      setLoading(true);
      const encryptedData = await ApiEncryptDecrypt.encryptString(
        Key,
        JSON.stringify({
          ...data,
        })
      );
      formdata.append("Body", encryptedData);

      const result = await axiosInstance.post(
        "/UpdateCustomerProfile",
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
        setIsUpload(false);
        getProfileData();
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  const [isSlider, setIsSlider] = useState(false);
  const handleResize = () => {
    if (window.innerWidth <= 991) {
      setIsSlider(true);
    } else {
      setIsSlider(false);
    }
  };
  // Listen for resize events
  window.addEventListener("resize", handleResize);
  return (
    <>
      <div class="offcanvas offcanvas-start" tabindex="-1" id="leftSidebar">
        <div class="offcanvas-header">
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div class="offcanvas-body">
          <div className=" mb-4">
            <div className="card p-3 text-center">
              <label
                className="rounded-circle bg-light mx-auto d-flex align-items-center justify-content-center mb-2"
                style={{ width: 60, height: 60, position: "relative" }}
              >
                {imageSrc ? (
                  <PreviewImage
                    style={{
                      height: "60px",
                      maxWidth: "60px",
                      borderRadius: "50%",
                    }}
                    imgurl={imageSrc}
                    thumnail={true}
                  />
                ) : (
                  <Tooltip text="Click To View Profile">
                    <PreviewImage
                      style={{
                        height: "60px",
                        maxWidth: "60px",
                        borderRadius: "50%",
                      }}
                      imgwithUrl={response?.ProfilePic
                        ? response?.ProfilePic
                        : UserDefaultPic}
                      thumnail={true}
                    />
                  </Tooltip>
                )}
              </label>
              {isUpload ? (
                <button
                  style={{
                    backgroundColor: "#629d23",
                    border: "none",
                    borderRadius: "5px",
                    fontSize: "12px",
                    maxWidth: "120px",
                    cursor: "pointer",
                    margin: "0 auto",
                  }}
                  className="px-4 py-1 text-white fs-8 "
                  onClick={handleUploadFile}
                >
                  {loading ? "Uploading" : "Upload"}
                </button>
              ) : (
                <label
                  htmlFor="file"
                  style={{
                    backgroundColor: "#629d23",
                    border: "none",
                    borderRadius: "5px",
                    fontSize: "12px",
                    maxWidth: "120px",
                    cursor: "pointer",
                    margin: "0 auto",
                  }}
                  className="px-4 py-1 text-white fs-8"
                >
                  <input
                    onChange={handleChangeFile}
                    type="file"
                    id="file"
                    hidden
                  />
                  Change
                </label>
              )}
              <p className="fw-bold mb-1 ">
                Hello, {response?.CustomerName}
                <i
                  style={{ cursor: "pointer" }}
                  className=" pt-0  d-inline-block"
                  onClick={handleMyAccount}
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"
                >
                  <MdOutlineEdit size={20} />
                </i>
              </p>
              <small className="text-muted">(#{response?.CustomerCode})</small>
              <small className="text-muted">
                <i>
                  <MdOutlineMail />
                </i>{" "}
                <a href={`mailto:${response?.CustomerEmail}`}>
                  <span> {response?.CustomerEmail}</span>
                </a>
              </small>
              <small className="text-muted">
                {" "}
                <i>
                  <IoMdCall />
                </i>{" "}
                <a href={`tel:${response?.Mobile}`}>
                  <span>+91 {response?.Mobile}</span>
                </a>
              </small>
              {/* <span className="badge bg-light text-wrap text-dark mt-2">
                      You have 200 reward seeds 🌱
                    </span> */}
            </div>
            <div className="mt-4">
              {/* <p className="fw-semibold text-uppercase small text-muted">
                Shopping
              </p> */}
              <ul className="list-group list-group-flush mb-3 ">
                <li
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"
                  onClick={() => handleSetTab("myOrders")}
                  className={` ${tabs === "myOrders" ? "active" : undefined}`}
                >
                  <div className="img-icon">
                    {" "}
                    <img loading="lazy" src={MyOrdersimg} alt="RAV organics" />
                  </div>
                  <span> My Orders</span>
                  <i className="fa-solid fa-angle-right"></i>
                </li>

                <li
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"
                  onClick={() => handleSetTab("Reward")}
                  className={` ${tabs === "Reward" ? "active" : undefined}`}
                >
                  <div className="img-icon">
                    <img loading="lazy" src={ReferFriend} alt="RAV organics" />
                  </div>
                  <span> Coupons/Vouchers</span>{" "}
                  <i className="fa-solid fa-angle-right"></i>
                </li>

                <li
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"
                  onClick={() => handleSetTab("change password")}
                  className={` ${tabs === "change password" ? "active" : undefined
                    }`}
                >
                  <div className="img-icon">
                    <img loading="lazy" src={NeedHelp} alt="RAV organics" />
                  </div>
                  <span>Change Password</span>{" "}
                  <i className="fa-solid fa-angle-right"></i>
                </li>
                <li
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"
                  onClick={() => handleSetTab("address")}
                  className={` ${tabs === "address" ? "active" : undefined}`}
                >
                  <div className="img-icon">
                    <img loading="lazy" src={MyAddresses} alt="RAV organics" />
                  </div>
                  <span> My Addresses</span>{" "}
                  <i className="fa-solid fa-angle-right"></i>
                </li>
                {/* <li
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"
                  onClick={() => handleSetTab("Wishlist")}
                  className={` ${tabs === "Wishlist" ? "active" : undefined}`}
                >
                  <div className="img-icon">
                    <img loading="lazy" src={MyWishlist} alt="RAV organics" />
                  </div>
                  <span> My Wishlist</span>{" "}
                  <i className="fa-solid fa-angle-right"></i>
                </li> */}
                <li
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"
                  onClick={() => handleSetTab("my wallet")}
                  className={`  ${tabs === "my wallet" ? "active" : undefined}`}
                >
                  <div className="img-icon">
                    <img loading="lazy" src={NeedHelp} alt="RAV organics" />
                  </div>
                  <span>My Wallet</span>{" "}
                  <i className="fa-solid fa-angle-right"></i>
                </li>
                <li
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"
                  onClick={() => navigate("/support")}
                  className={` ${tabs === "SupportTicketList" ? "active" : undefined
                    }`}
                >
                  <div className="img-icon">
                    {" "}
                    <img loading="lazy" src={NeedHelp} alt="RAV organics" />
                  </div>
                  <span data-bs-dismiss="offcanvas" aria-label="Close">
                    Need help
                  </span>{" "}
                  <i className="fa-solid fa-angle-right"></i>
                </li>
              </ul>
              <div
                style={{
                  cursor: "pointer",
                  width: "100%",
                  display: "display: inline-block;",
                }}
                onClick={handleLogout}
                className=""
              >
                <span
                  className="logoutclass"
                  style={{ display: "inline-block" }}
                >
                  {" "}
                  Logout
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserSlider;
