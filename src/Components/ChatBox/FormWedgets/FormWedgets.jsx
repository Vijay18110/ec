import React, { useState } from "react";
import { FaChevronDown, FaRegCommentDots } from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import { TbRefresh } from "react-icons/tb";
import { chatFormValidation } from "../../../Validation/ChatFormValidation";
import { useDispatch } from "react-redux";
import { uiAction } from "../../../Redux/Slices/uiSlice";

const FormWedgets = () => {
  const [chatDetails, setChatDetails] = useState({
    name: "",
    email: "",
    mobile: "",
    message: "",
  });
  const dispatch = useDispatch();
  const handleChange = (e) => {
    const { id, value } = e.target;
    setChatDetails((prev) => ({ ...prev, [id]: value }));
  };
  const handleSubmitForm = () => {
    if (chatFormValidation(chatDetails)) {
      sessionStorage.setItem("ChatDetails", JSON.stringify(chatDetails));
      dispatch(uiAction.setisChat(true));
    }
  };
  const handleClose = () => {
    dispatch(uiAction.setWelcome(false));
  };
  return (
    <>
      <div className="container mt-4" style={{ maxWidth: "400px" }}>
        <div
          className="border rounded shadow-sm d-flex flex-column"
          style={{ backgroundColor: "#f9f9f9" }}
        >
          <div
            className="d-flex align-items-center justify-content-between p-2 px-3"
            style={{
              backgroundColor: "#4A4A1F",
              color: "white",
              borderTopLeftRadius: "6px",
              borderTopRightRadius: "6px",
            }}
          >
            <div className="d-flex align-items-center gap-2">
              <div
                className="bg-white rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: "30px", height: "30px" }}
              >
                <FaRegCommentDots className="text-dark" />
              </div>
              <div>
                <div className="fw-bold">RAV Organics</div>
                <small>Typically replies in a few minutes</small>
              </div>
            </div>
            <div className="dropdown ">
              <button
                className="btn btn-sm btn-light d-flex align-items-center gap-1"
                type="button"
              >
                <p className="d-inline-flex gap-1 mb-0">
                  <i>
                    <TbRefresh size={20} />
                  </i>
                  <span>Restart </span>
                </p>
                <i onClick={handleClose}>
                  <IoIosArrowDown size={20} />
                </i>
              </button>
            </div>
          </div>
          <div
            className="form p-3"
            style={{
              maxHeight: "370px",
              overflowY: "hidden",
              scrollbarWidth: "thin",
              background: "rgb(250, 250, 242)",
            }}
          >
            <div className="mb-3">
              <label className="form-label fw-semibold" for="fullName">
                Full Name
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                onChange={handleChange}
                value={chatDetails.name}
                autoComplete="off"
              />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold" for="email">
                  Email Address
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  onChange={handleChange}
                  value={chatDetails.email}
                  autoComplete="off"
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold" for="phone">
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="form-control"
                  id="mobile"
                  onChange={handleChange}
                  value={chatDetails.mobile}
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold" for="message">
                Message
              </label>
              <textarea
                className="form-control"
                id="message"
                rows="4"
                placeholder="Please enter your message"
                onChange={handleChange}
                value={chatDetails.message}
              ></textarea>
            </div>

            <button
              onClick={handleSubmitForm}
              className="btn w-100 text-white d-flex justify-content-center gap-3 align-items-center"
              style={{
                backgroundColor: "#5A5328",
                border: "1px solid #5A5328",
                boxShadow: "0 2px 6px #5A532860",
              }}
            >
              <span>Start Conversation</span>
              <i>
                <FaArrowRightLong />
              </i>
            </button>
          </div>
          {/* FOOTER */}
          <div className="text-center p-2 border-top bg-white">
            <a
              href="https://limechat.ai?utm_source=widget_branding"
              target="_blank"
              rel="noopener noreferrer"
              className="text-decoration-none text-muted small d-flex align-items-center justify-content-center gap-1"
            >
              Powered by LimeChat
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default FormWedgets;
