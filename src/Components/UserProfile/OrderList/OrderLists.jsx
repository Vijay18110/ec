import React, { useState } from "react";
import {
  FaCheckCircle,
  FaRegFilePdf,
  FaShippingFast
} from "react-icons/fa";
import {
  FaArrowRight,
  FaRegCopy
} from "react-icons/fa6";
import { FiArrowUpRight, FiShoppingBag } from "react-icons/fi";
import { ImTruck } from "react-icons/im";
import { MdArrowOutward } from "react-icons/md";
import { Link } from "react-router-dom";

const OrderLists = ({ handleOrderDetails, item }) => {
  const [selectedTrackItem, setSelectedTrackItem] = useState(null);

  const isNew =
    item?.OrderDate &&
    new Date(item.OrderDate) > new Date(Date.now() - 3600 * 1000 * 3);

  // console.log(item)
  return (
    <>
      {/* Modal */}
      <div
        className="modal fade slide-modal"
        id={`${item?.OrderId}`}
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered p-0">
          <div className="modal-content animate-slide">
            <div className="modal-header">
              <h5 className="modal-title">Track Orders</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body p-2">
              {selectedTrackItem?.TrackingURL &&
                (() => {
                  try {
                    const parsed = JSON.parse(selectedTrackItem.TrackingURL);
                    return parsed.map((it, idx) => (
                      <div
                        key={idx}
                        className="mb-2 d-flex align-items-center justify-content-between tracking-paragraph"
                        style={{
                          background: "linear-gradient(135deg, #f0f4f8, #ffffff)",
                          padding: "12px 18px",
                          borderRadius: "12px",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                          fontSize: "1rem",
                          borderLeft: "4px solid #198754",
                          transition: "all 0.3s ease-in-out",
                          cursor: "pointer"
                        }}
                      >
                        <span className="d-flex align-items-center gap-3">
                          <FaShippingFast
                            className="text-success track-icon"
                            size={22}
                            style={{
                              minWidth: "22px",
                              transition: "transform 0.3s ease"
                            }}
                          />
                          <a
                            href={it?.TrackingURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-decoration-none tracking-link"
                            style={{
                              fontWeight: 600,
                              color: "#0d6efd",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              maxWidth: "200px",
                              transition: "color 0.3s ease"
                            }}
                          >
                            {it?.TrackNo || "Track Now"}
                          </a>
                        </span>
                        <Link
                          title="Go to tracking page"
                          to={it?.TrackingURL}
                          target="_blank"
                          className="track-icon-button text-success"
                          style={{
                            width: "25px",
                            height: "25px",
                            borderRadius: "50%",
                            backgroundColor: "#e8f0fe",
                            color: "#0d6efd",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            transition: "all 0.3s linear"
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#d3e3fd";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "#e8f0fe";
                          }}
                        >
                          <FiArrowUpRight size={18} />
                        </Link>
                      </div>
                    ));
                  } catch (e) {
                    return <div>Error parsing tracking data.</div>;
                  }
                })()}
            </div>
          </div>
        </div>
      </div>

      {/* Order Card */}
      <div
        className="mb-3"
        style={{ cursor: "pointer" }}
        onClick={() => handleOrderDetails(item?.OrderId, item?.OrderStatus)}
      >
        <div
          style={{ position: "relative" }}
          className="d-flex align-items-center justify-content-between rounded border onHover1 p-3 bg-light"
        >
          {item?.TrackingURL && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                setSelectedTrackItem(item);
              }}
              data-bs-toggle="modal"
              data-bs-target={`#${item?.OrderId}`}
              className={`track-order-tag-modern ${isNew ? "pulse" : ""}`}
              title="Track Order"
            >
              <FaShippingFast className="me-1" size={13} />
              Track Order
            </div>
          )}

          <div className="d-flex gap-3 align-items-center">
            <i>
              <FiShoppingBag color="#567343" size={40} />
            </i>

            <div>
              <span style={{ color: "#597544", fontWeight: "500" }}>
                <strong className="text-dark">Order No </strong> : #{item?.OrderNo}
              </span>
              <p className="m-0">
                {item?.DeliveryType},{item?.PaymentType}
              </p>

              {["Placed", "Packed", "Delivered", "Not Delivered", "Dispatched", "Confirmed", "Cancelled", "Returned"].map(status => (
                item?.OrderStatus === status && (
                  <span key={status}>
                    <strong className="text-success">Status </strong>:&nbsp;
                    <small className={`text-${status === "Cancelled" || status === "Returned" ? "danger" : "light"
                      } bg-${status === "Placed" ? "primary" :
                        status === "Packed" ? "secondary" :
                          status === "Delivered" ? "success" :
                            status === "Not Delivered" ? "danger" :
                              status === "Dispatched" ? "info" :
                                status === "Confirmed" ? "info" :
                                  status === "Cancelled" ? "warning" :
                                    status === "Returned" ? "dark" : "light"
                      } py-1 px-3 rounded-1`}>
                      {item?.OrderStatus}
                    </small>
                  </span>
                )
              ))}

              <p className="mb-0">
                <strong>Ordered </strong>: {item?.OrderDate}
              </p>
              {["Packed", "Dispatched", "Delivered"].includes(item?.OrderStatus) && (
                <Link
                  onClick={(e) => e.stopPropagation()}
                  target="_blank"
                  to={`https://erp.ravbiz.in/Ecommerce/NSaveInvoicePdf?OrderId=${item?.OrderId}`}
                  className="invoice-download-box"
                  title="Download Invoice"
                >
                  <div className="invoice-icon-circle">
                    <FaRegFilePdf size={13} />
                  </div>
                  <span className="invoice-text">Download Invoice</span>
                </Link>
              )}
            </div>
          </div>
          <span className="fw-bolder fs-5" style={{ color: "#567343" }}>
            ₹{parseInt(item?.Total)}
          </span>
        </div>
      </div>
    </>
  );
};

export default OrderLists;
