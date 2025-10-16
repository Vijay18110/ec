import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import "./ChatBox.css";
import {
  FaRegCommentDots,
  FaChevronDown,
  FaPaperPlane,
  FaPaperclip,
} from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useDispatch } from "react-redux";
import useApiRequest from "../../Hooks/apiReq";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PreviewImage from "../../ExternalLib/PreviewImage/PreviewImage.jsx";
import pdfIcon from "../../assets/Images/pdf.png";
import Swal from "sweetalert2";
import ApiEncryptDecrypt from "../../Utils/Encryption";
import { Key } from "../../Utils/Key";
import axiosInstance from "../../Utils/axiosInstance";
import { toast } from "react-toastify";
import { validateFileType } from "../../Utils/CheckFileValidation.jsx";
import ChatBoxLoader from "./ChatBoxLoader.jsx";
import Container from "../../Container/Container.jsx";

const ChatBox = () => {
  const [message, setMessage] = useState("");
  const getLoaggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
  const {
    error,
    loading,
    response: Details,
    sendApiRequest: SupportTicketDetailsApiReq,
  } = useApiRequest();
  const {
    error: chaterror,
    loading: Chatloading,
    response: ChatDetails,
    sendApiRequest: SupportTicketChatDetailsApiReq,
  } = useApiRequest();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [ChatSendloading, setChatSendloading] = useState(false);
  const dispatch = useDispatch();
  const chatEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const date = new Date();
  const time = date
    .toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata", // Change to your desired timezone
    })
    .toLowerCase();
  const navigate = useNavigate();
  const loacation = useLocation();
  const queryData = new URLSearchParams(loacation.search);
  const id = queryData.get("id");
  const GetSupportTicketDetails = () => {
    if (getLoaggedInUser) {
      const ReqData = {
        TicketNo: id,
        AutoId: getLoaggedInUser.CustomerId,
        DeviceType: "Web",
        AppVersion: "1.0",
        LoginToken: getLoaggedInUser.LoginToken,
      };
      SupportTicketDetailsApiReq("POST", "/GetSupportTicketDetail", ReqData);
    }
  };
  const GetSupportTicketChatDetails = () => {
    if (getLoaggedInUser) {
      const ReqData = {
        TicketNo: id,
        AutoId: getLoaggedInUser.CustomerId,
        DeviceType: "Web",
        AppVersion: "1.0",
        LoginToken: getLoaggedInUser.LoginToken,
      };
      SupportTicketChatDetailsApiReq(
        "POST",
        "/GetSupportTicketChatDetail",
        ReqData
      );
    }
  };
  const sendChat = async () => {
    try {
      setChatSendloading(true);
      if (!selectedFiles.length) {
        if (!message) {
          Swal.fire({
            text: "Please Write Some Message!",
            icon: "warning",
          });
          return;
        }
      }
      const formData = new FormData();
      Array.from(selectedFiles).forEach((file) =>
        formData.append("File", file)
      );
      if (getLoaggedInUser) {
        const ReqData = {
          TicketNo: id,
          Message: message,
          AutoId: getLoaggedInUser.CustomerId,
          DeviceType: "Web",
          AppVersion: "1.0",
          LoginToken: getLoaggedInUser.LoginToken,
          Attachments: "",
        };
        const encryptedData = await ApiEncryptDecrypt.encryptString(
          Key,
          JSON.stringify(ReqData)
        );
        formData.append("Body", encryptedData);
        const res = await axiosInstance.post(
          "/SendAssociateSupportMessage",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        const decryptedRes = await ApiEncryptDecrypt.decryptString(
          Key,
          res.data.body
        );
        const obj = JSON.parse(decryptedRes);
        if (obj.Status === 0) {
          GetSupportTicketChatDetails();
          setSelectedFiles([]);
          setMessage("");
        } else {
          toast.error(obj.Message || "Error submitting ticket");
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setChatSendloading(false);
    }
  };
  useEffect(() => {
    GetSupportTicketDetails();
  }, []);
  useEffect(() => {
    GetSupportTicketChatDetails();
  }, []);

  const renderFiles = (Attachments, BASEURL) => {
    if (!Attachments) {
      return null;
    }
    if (Attachments == ("NA" || "N")) {

      return
    }
    const filesData = JSON.parse(Attachments);
    return filesData.map((messageFile, index) => (
      <div key={index} className=" d-flex">
        {messageFile?.FileType === "PDF" ? (
          <a
            target="_blank"
            className=""
            href={BASEURL + messageFile?.FileName}
          >
            <img src={pdfIcon}></img>
          </a>
        ) : (
          <PreviewImage imgwithUrl={BASEURL + messageFile?.FileName} />
        )}
      </div>
    ));
  };
  // console.log("Details",Details)
  const renderFilePreview = () => {
    if (selectedFiles.length === 0) return null;
    return Array.from(selectedFiles).map((file, index) => (
      <div
        key={index}
        className="position-relative renderFilePreview"
        style={{ display: "inline-block", position: "relative" }}
      >
        <span
          className="bg-danger px-2"
          style={{ position: "absolute", right: "0%", top: "0%" }}
          onClick={() => handleRemoveReview(index)}
        >
          X
        </span>
        {file.type.startsWith("image/") ? (
          <PreviewImage imgurl={file} />
        ) : file.type === "application/pdf" ? (
          <a
            key={index}
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
    const updatedFiles = Array.from(selectedFiles).filter(
      (_, index) => index !== fileIndex
    );
    setSelectedFiles(updatedFiles); // Update the state with the new array
  };
  const handleChange1 = (e) => {
    const { id, value, files } = e.target;

    if (files) {
      if (Array.from(files).some((file) => !validateFileType(file))) return;
      setSelectedFiles(files)
    }
  };
  const handleChange = (e) => {
    const { id, value, files } = e.target;
    setMessage(value)
  };
  let reversearr;
  if (ChatDetails) {
    reversearr = [...ChatDetails?.SupportTicketChatData].reverse();
  }

  const isUserNearBottom = () => {
    const threshold = 100; // px
    const position =
      chatContainerRef.current.scrollTop +
      chatContainerRef.current.clientHeight;
    const height = chatContainerRef.current.scrollHeight;
    return height - position < threshold;
  };

  useLayoutEffect(() => {
    if (isUserNearBottom()) {
      chatEndRef.current?.scrollIntoView();
    }
  }, [ChatDetails, selectedFiles]);

  return (
    <Container>
      <div className="scroll1111" ref={chatContainerRef}>
        <div className="chatheader position-sticky top-0 z-2">
          <div className="chatbox">
            <div className="chatbox-top">
              <div className="arrow-left">
                <Link to={"/support"}>
                  <IoMdArrowRoundBack size={30} />
                </Link>
              </div>

              <div className="got-questions">
                <h2>Chat Box</h2>
                <span>
                  Got questions? <br />
                  We’ve got answers...let’s chat!
                </span>
                <div></div>
              </div>
            </div>
          </div>
        </div>
        <div className="chatbox ">
          <div className="messaging">
            <div className="messaging-chat">
              <h3>Chat For:</h3>
              <ul>
                <li>
                  <strong>Type:</strong>
                  <span>{Details?.SupportType}</span>
                </li>
                <li>
                  <strong>For :</strong>
                  <span>{Details?.SupportFor}</span>
                </li>
                <li>
                  <strong>Subject :</strong>
                  <span>{Details?.Subject}</span>
                </li>
                <li>
                  <strong>Support Ticket Id:</strong>
                  <span>{Details?.TicketNo}</span>
                </li>
                <li>
                  <strong>Create at:</strong>
                  <span>{Details?.CreateDate}</span>
                </li>
                <li>
                  <strong>Last reply:</strong>
                  <span>{Details?.LastUpdatedOn}</span>
                </li>
              </ul>
            </div>
            <div className="chat-content  ">
              <div className="message-overflow">
                <ul>
                  {reversearr?.length &&
                    reversearr.map(
                      (chat, index) =>
                        (chat?.Attachments || chat?.Message) && (
                          <li
                            index={index}
                            className={`  ${chat?.MessageBy === "Customer"
                              ? "messaging-right"
                              : undefined
                              }`}
                          >
                            <div className="chat-right">
                              {chat?.Message && (
                                <div className="chat-msg">
                                  <div className="chat-profile-name">
                                    <h4> {chat?.MessageByName} </h4>
                                  </div>
                                  <p>{chat?.Message}</p>
                                </div>
                              )}
                              {chat?.Attachments && (
                                <div className="d-flex column-gap-1 imgCont flex-wrap">
                                  {renderFiles(chat?.Attachments, chat?.BASEURL)}
                                </div>
                              )}
                              <span>{chat?.CreatedDate}</span>
                            </div>
                          </li>
                        )
                    )}
                  <div className="d-flex column-gap-1 imgCont flex-wrap justify-content-center">
                    {ChatSendloading ? <ChatBoxLoader /> : renderFilePreview()}
                  </div>

                  <div ref={chatEndRef} />
                </ul>
              </div>
              {<div className="row d-flex justify-content-center align-items-center me-0">
                <div className="chat-footer  col-md-12 col-12">
                  <label
                    className="input-group-text bg-white border-0"
                    htmlFor="file-upload"
                    style={{ cursor: "pointer" }}
                    disabled={Details?.Status === "Closed"}

                  >
                    <FaPaperclip />
                  </label>
                  <textarea
                    disabled={Details?.Status === "Closed"}
                    className="form-control border-0 chat_form  onFocus"
                    id="Message"
                    onChange={handleChange}
                    value={message}
                  ></textarea>
                  <div className="form-buttons">
                    <div className="input-group border rounded-pill overflow-hidden">
                      {/* Upload file */}

                      <input
                        type="file"
                        id="file-upload"
                        hidden
                        onChange={handleChange1}
                        multiple
                        disabled={Details?.Status === "Closed"}
                      />

                      {/* Text input */}

                      {/* Send button */}
                      <button disabled={Details?.Status === "Closed"} className="btn btn-light" onClick={sendChat}>
                        <FaPaperPlane />
                      </button>
                    </div>
                  </div>
                </div>
              </div>}
            </div>
          </div>
        </div>

        {/* MESSAGES */}
        <div
          className="p-2"
          style={{
            maxHeight: "370px",
            overflowY: "scroll",
            scrollbarWidth: "thin",
          }}
        >
          {/* <div className="d-flex align-items-center gap-2 ">
          <img loading="lazy" src={logo} style={{ height: "20px" }} alt="logo" />
          <div
            className="bg-white p-2 border  mb-2"
            style={{ maxWidth: "70%", borderRadius: "25px 10px 25px 10px" }}
          >
            Hello Welcome to RAV Organics - the world of harmonious living rooted deeply in Indian origin! 👍
            <div className="text-muted small">{time}</div>
          </div>
        </div> */}
          {/* <div className="d-flex align-items-center gap-2">
          <img loading="lazy" src={logo} style={{ height: "20px" }} alt="logo" />
          <div
            className="bg-white border p-3 "
            style={{ maxWidth: "70%", borderRadius: "25px 10px 25px 10px" }}
          >
            Glad to have you join our movement towards sustainable living, where
            every choice counts. 🍁 ✨
            <br />
            <br />
            Please choose who you are to proceed. 😊
            <div className="text-muted small">{time}</div>
          </div>
        </div> */}
        </div>
        {ChatDetails && ChatDetails?.SupportTicketChatData.length > 0 && (
          <div
            className="p-2"
            style={{
              maxHeight: "370px",
              overflowY: "scroll",
              scrollbarWidth: "thin",
            }}
          >
            {/* {ChatDetails?.SupportTicketChatData.map((chat, index) => (
          (chat?.Attachments || chat?.Message) &&
          <div index={index} className={`d-flex align-items-center gap-2 ${chat?.MessageBy === "Customer" ? "justify-content-end" : undefined}`}>
            <img loading="lazy" src={chat?.ProfileImage} style={{ height: "20px" }} alt="logo" />
            {chat?.Message && <div
              className="bg-white p-2 border  mb-2"
              style={{ maxWidth: "70%", borderRadius: "25px 10px 25px 10px" }}
            >
              {chat?.Message && chat?.Message}

              <div className="text-muted small">{chat?.CreatedDate}</div>
            </div>
            }
            {chat?.Attachments && <div
              className="bg-white p-2 border  mb-2"
              style={{ maxWidth: "70%", borderRadius: "25px 10px 25px 10px" }}
            >

              {renderFiles(chat?.Attachments, chat?.BASEURL)}
              <div className="text-muted small">{chat?.CreatedDate}</div>
            </div>
            }
          </div>
        ))} */}
            {/* {<div className=" d-flex justify-content-end">{renderFilePreview()}</div>} */}
          </div>
        )}
        {/* INPUT WITH FILE UPLOAD */}

        {/* FOOTER */}
      </div>
    </Container>
  );
};

export default ChatBox;
