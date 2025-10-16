import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaStar } from "react-icons/fa";
import useApiRequest from "../../../Hooks/apiReq";
const RateUs = (({ handleCloseModal, ticketNo, RefetchSupportTicketDetails, setUpdatedCardId }) => {
    const { error, loading, response, sendApiRequest, status } = useApiRequest();
    const [ticket, setTicketNo] = useState(ticketNo && ticketNo);
    const [rate, setRate] = useState(0);
    const [fMessage, setfMessage] = useState("");
    const handleRate = (p) => {
        setRate(p);
    }
    const handleRateReqAPI = async () => {
        if (!rate) {
            toast.error("Please Rate First!", {
                toastId: "rate"
            });
            return;
        }
        const getLoaggedInUser = await JSON.parse(sessionStorage.getItem("loggedInUser"));
        const ReqData = {
            TicketNo: ticket,
            RatingNumber: rate,
            Feedback: fMessage,
            AutoId: getLoaggedInUser.CustomerId,
            LoginToken: getLoaggedInUser.LoginToken,
            DeviceType: "Web",
            // AppVersion: JSON.parse(sessionStorage.getItem("loggedInUser"))?.AppVersion
        }
        console.log(ReqData)
        await sendApiRequest("POST", "/SaveSupportTicketfeedBack", ReqData);
        handleCloseModal()
        RefetchSupportTicketDetails();
        setUpdatedCardId(ticketNo);
    };
    const rateNo = [1, 2, 3, 4, 5];
    // console.log(response);

    return (
        <div className='rate'>
            {/* <button onClick={handleCloseModal} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> */}
            <h4>How did we do?</h4>
            <div className='my-2'>
                {
                    rateNo.map((no, index) => (<Link key={index} onClick={() => handleRate(no)}  ><FaStar size={25} color={rate > index ? "gold" : ""}  ></FaStar></Link>))
                }
            </div>
            <textarea onInput={(e) => setfMessage(e.target.value)} cols="40" rows="5" placeholder="Anything to say?" aria-required="true"></textarea>
            <button onClick={handleRateReqAPI} type="submit" className="btn  btn-outline-secondary">{loading ? "Sending.." : "Send your rating"}</button>
        </div>
    );
});

export default RateUs;