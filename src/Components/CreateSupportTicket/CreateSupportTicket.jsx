import React, { useState } from "react";
import { useGetDropDownData } from "../../Hooks/DropDown";
import ApiEncryptDecrypt from "../../Utils/Encryption";
import { Key } from "../../Utils/Key";
import axiosInstance from "../../Utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { supportTicketvalidation } from "../../Validation/SupportTicketValidation";
import PreviewImage from "../../ExternalLib/PreviewImage/PreviewImage.jsx";
import pdfIcon from "../../assets/Images/pdf.png";
import pic from "../../assets/Images/logo.png";
import { validateFileType } from "../../Utils/CheckFileValidation.jsx";
import { MdOutlineFileUpload } from "react-icons/md";
import { useDispatch } from "react-redux";
import { chatAction } from "../../Redux/Slices/chatSlice.jsx";
import Loader from "../../ExternalLib/Loader/Loader.jsx";
import { IoMdArrowRoundBack } from "react-icons/io";
const SupportTicketForm = ({ setIsHelpping }) => {
  const navigate = useNavigate()
  const styling = {
    padding: "15px",
    background: "#6c5876",
    borderRadius: "13px",
    width: "310px",
    border: "none",
    color: "#fff",
    position: "relative",
  };
  const { dropData, error, loading } = useGetDropDownData();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    SupportForId: "",
    SupportTypeId: "",
    Subject: "",
    Query: "",
    Priority: "High",
  });

  const renderFilePreview = () => {
    if (selectedFiles?.length === 0) return null;
    return Array?.from(selectedFiles)?.map((file, index) => (
      <div
        key={index}
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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      if (Array.from(files).some((file) => !validateFileType(file))) return;
    }
    setForm({
      ...form,
      [name]: files ? setSelectedFiles(files) : value,
      Combfilename: "",
    });
  };
  const handlePriorityChange = (level) => {
    setForm({ ...form, Priority: level });
  };
  const [loader, setLoader] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoader(true);
      if (supportTicketvalidation(form)) {
        const getLoggedInUser = JSON.parse(
          sessionStorage.getItem("loggedInUser")
        );
        const data = {
          LoginToken: getLoggedInUser.LoginToken,
          AutoId: getLoggedInUser.CustomerId,
          DeviceType: "Web",
          AppVersion: "1.0",
          Combfilename: "",
          ...form,
        };
        const formData = new FormData();
        if (selectedFiles.length > 0) {
          Array.from(selectedFiles).forEach((file) =>
            formData.append("File", file)
          );
        }
        const encryptedData = await ApiEncryptDecrypt.encryptString(
          Key,
          JSON.stringify(data)
        );
        formData.append("Body", encryptedData);
        const res = await axiosInstance.post("/CreateSupportTicket", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const decryptedRes = await ApiEncryptDecrypt.decryptString(
          Key,
          res.data.body
        );
        const obj = JSON.parse(decryptedRes);
        if (obj.Status === 0) {
          toast.success("Ticket submitted successfully!");
          setForm({
            Priority: "High",
            Query: "",
            Subject: "",
            SupportForId: "",
            SupportTypeId: "",
          });
          setSelectedFiles(null);
          // setIsHelpping(false);
          navigate('/support')
          dispatch(chatAction.setIsOpenSupportTicketForm(false));
        } else {
          toast.error(obj.Message || "Error submitting ticket");
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="support-page">
      <div className="container">
        <div className="row">
          <div className="col my-2 px-4">
            <span className="shadow py-1" onClick={() => navigate("/support")}>
              <IoMdArrowRoundBack size={25} />
            </span>
          </div>
        </div>
        <h4 className="mb-3">Support Ticket</h4>
        <div className="card p-4">
          <div className="row">
            <div className="col-md-12">
              <div className="text-center mb-4">
                <img
                  style={{ maxWidth: "150px" }}
                  loading="lazy"
                  src={pic}
                  alt="Support"
                  className="mb-3 "
                />
                <h3 className="fw-bold">Help is Just a Click Away!</h3>
                <p className="text-muted">
                  We’ll try to fix it faster than your morning coffee kicks in!
                </p>
              </div>
              <div className="row">
                <div className="col-lg-6">
                  <div className="mb-3">
                    <label className="form-label">Support Type *</label>
                    <select
                      className="form-select"
                      name="SupportTypeId"
                      value={form.SupportTypeId}
                      onChange={handleChange}
                    >
                      {loading ? (
                        <option value="">loading...</option>
                      ) : (
                        dropData.map((item) => (
                          <option key={item.Id} value={item.Id}>
                            {item.Name}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="mb-3">
                    <label className="form-label">Subject *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="Subject"
                      value={form.Subject}
                      onChange={handleChange}
                      placeholder="Give your ticket a title - make it catchy!"
                      autoComplete="off"
                    />
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="mb-3">
                    <label className="form-label">Query</label>
                    <textarea
                      className="form-control"
                      name="Query"
                      value={form.Query}
                      onChange={handleChange}
                      rows="4"
                    ></textarea>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="mb-3">
                    <label className="form-label me-3">Priority *</label>
                    <div className="btn-group" role="group">
                      {["Low", "Medium", "High"].map((priority) => (
                        <div className="priority-switch-group" role="group">
                          <input
                            type="radio"
                            onChange={() => handlePriorityChange(priority)}
                            checked={form.Priority === priority}
                            id={priority}
                            name={priority}
                          />
                          <label
                            htmlFor={priority}
                            className={`switch ${priority}`}
                          >
                            {priority.charAt(0).toUpperCase() + priority.slice(1)}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="form-group">
                    <label htmlFor="Combfilename">Attachment</label>
                    <label
                      htmlFor="Combfilename"
                      className="p-2 rounded d-flex justify-content-center align-items-center mt-2"
                      style={{
                        backgroundColor: "#959e53",
                        height: "100%",
                        maxWidth: "100%",
                        display: "block",
                      }}
                    >
                      <i>
                        <MdOutlineFileUpload size="20" />
                      </i>
                      Upload File
                      <input
                        id="Combfilename"
                        type="file"
                        name="file"
                        multiple
                        hidden
                        onChange={handleChange}
                      />
                    </label>
                    <div className=" pt-1 ">
                      <div className="d-flex flex-wrap  align-items-center column-gap-1 w-100">
                        {renderFilePreview()}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 mt-3">
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="btn btn-success mt-3 w-100 fw-bold"
                  >
                    Raise My Ticket!
                  </button>
                </div>
              </div>
              {loader && <Loader />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportTicketForm;
