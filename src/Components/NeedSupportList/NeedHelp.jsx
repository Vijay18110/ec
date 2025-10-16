import React, { useCallback, useEffect, useState } from "react";
import useApiRequest from "../../Hooks/apiReq";
import "./NeedHelp.css";
import SupportTicketForm from "../CreateSupportTicket/CreateSupportTicket";
import pic from "../../assets/Images/need-support1.png";
import pic1 from "../../assets/Images/pending.icon.png";
import Button from "../../Shared/Button/Button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaStar } from "react-icons/fa";

import { chatAction } from "../../Redux/Slices/chatSlice";
import Loader from "../../ExternalLib/Loader/Loader";
import ProductNotFound from "../ProductNotFound";
import MainPortal from "../MainPortal/MainPortal";
import RateUs from "./RateUs/RateUs";
const NeedHelpList = () => {
  const [openModal, setOpenModal] = useState(false);
  const [ticketNo, setTicketNo] = useState("");
  const [updatedCardId, setUpdatedCardId] = useState();
  const { error, loading, response, sendApiRequest, status } = useApiRequest();
  const [isHelpping, setIsHelpping] = useState(false);
  const dispatch = useDispatch()
  const isOpenSupportTicketForm = useSelector(state => state.chatreducer.isOpenSupportTicketForm)
  const navigate = useNavigate()
  const getSupporTicketList = () => {
    const loggedInUserData = JSON.parse(sessionStorage.getItem("loggedInUser"));
    if (loggedInUserData) {
      sendApiRequest("POST", "/GetSupportTicketList", {
        FkCustomerId: loggedInUserData?.CustomerId,
        PAGESIZE: "",
        PAGENO: "",
        bigintCreatedBy: loggedInUserData?.CustomerId,
        Status: "",
        DeviceType: "Web",
        AppVersion: "1.0",
        LoginToken: loggedInUserData?.LoginToken,
      });
    }
  };
  // const tabs = useSelector((state) => state.uireducer.tabs);
  useEffect(() => {
    getSupporTicketList();
  }, [isOpenSupportTicketForm]);

  const handleChat = (id) => {
    navigate(`/chat?id=${id}`);
  };
  // console.log(isOpenSupportTicketForm)
  const handleRateOpenModal = useCallback((p) => {
    setTicketNo(p);
    setOpenModal((pre) => (!pre));
  }, [])
  const rateNo = [1, 2, 3, 4, 5];
  return (
    <>
      <div className="container mt-5">
        <div className="mb-3 d-flex justify-content-end">
          <Button click={() => navigate("/create-support-ticket")}>
            Create new ticket
          </Button>
        </div>
        {response?.SupportTicketListData.length > 0 ?
          response?.SupportTicketListData?.map((item, index) => (
            <div className="support-list" key={index}>
              {console.log("item", item)}
              <div className={` ${item?.Status === "Opened" ? "status" : "status"}`}>
                <span style={item?.Status === "Opened" ? {} : { background: "red" }}>Status: {item?.Status}</span>
                <p style={{ color: "#8a934f" }}>Your support request has met its happy ending.</p>
              </div>
              <div className="status-box">
                <ul>
                  <li>
                    <strong>Support Ticket ID :</strong>
                    <span className=" fw-bold" onClick={() => handleChat(item?.TicketNo)} style={{ cursor: "pointer", color: "#8a934f" }}>
                      #{item?.TicketNo}
                    </span>
                  </li>
                  <li>
                    <strong>Subject :</strong>
                    <span>{item?.Subject}</span>
                  </li>
                  <li>
                    <strong>Type : </strong>
                    <span>{item?.SupportType}</span>
                  </li>
                  <li>
                    <strong>Created On:</strong>
                    <span>{item?.CreatedOn}</span>
                  </li>
                  <li>
                    <strong>Last Reply:</strong>
                    <span >{item?.LastUpdated}</span>
                  </li>
                  {item?.feedback && <li>
                    <strong>Feedback:</strong> <span style={{ color: "#8a934f", fontWeight: "500", maxWidth: "600px" }}>{item?.feedback}     </span>
                  </li>}
                </ul>
                {/* {item?.Status === "Opened" ? <img loading="lazy" src={pic} alt="" /> : <img loading="lazy" src={pic1} alt="" />} */}
                <div class='need-support'>
                  {item?.Status === "Opened" ? <img src={pic} alt='' /> : <img src={pic1} alt='' />}
                  {(item?.Status !== "Opened" && !(item?.starRating)) ? <div onClick={() => handleRateOpenModal(item.TicketNo)} class='rate5'>
                    <strong>   Need Support </strong><span className="my-3">Rate Us</span>
                  </div> :
                    item?.Status !== "Opened" &&
                    <p className=' d-flex align-items-center justify-content-center flex-wrap
                    '>
                      <span>

                        {rateNo.map((rateNo, index) => (rateNo <= Number(item?.starRating) ? <FaStar key={index} style={(item?.starRating) > index ? { color: "gold" } : { color: "black" }}></FaStar> : <FaStar key={index} style={(item?.starRating) > index ? { color: "gold" } : { color: "black" }}></FaStar>))}
                      </span>
                    </p>
                  }
                </div>


              </div>
            </div>
          )) : <ProductNotFound  fromSupportTicket={true} altText="Friendly product-not-found illustration" />
        }
        {loading && <Loader />}
      </div>
      {openModal && <MainPortal handleCloseModal={handleRateOpenModal}>
        <RateUs setUpdatedCardId={setUpdatedCardId} ticketNo={ticketNo} handleCloseModal={handleRateOpenModal} RefetchSupportTicketDetails={getSupporTicketList} />
      </MainPortal>}
      {/* {loading1 && <Loader />} */}
    </>
  );
};

export default NeedHelpList;

