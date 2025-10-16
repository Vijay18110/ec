import React, { useEffect, useRef } from "react";
const AddressModal = ({ addresses, handleDefaultAddress }) => {
  const modalRef = useRef(null);

  const openModal = () => {
    const modal = new window.bootstrap.Modal(modalRef.current);
    modal.show();
  };
  // console.log("addresses", addresses);
  return (
    <>
      <button style={{ fontSize: "12px", borderRadius: "5px" }} className="btn btn-success py-1 px-2" onClick={openModal}>
        Change Address
      </button>

      <div
        className="modal fade"
        ref={modalRef}
        id="addressModal"
        tabIndex="-1"
        aria-labelledby="addressModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Select Delivery Address</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div
              style={{ maxHeight: "400px", overflowY: "scroll" }}
              className="modal-body"
            >
              {addresses?.map((item, idx) => (
                <div
                  key={idx}
                  className={item?.IsDefault == "True" ? "address-cardmodaldefault p-3 mb-3  border rounded shadow-sm" : "address-cardmodal p-3 mb-3  border rounded shadow-sm"}
                  style={{ cursor: "pointer" }}
                  onClick={item.IsDefault != "True" ? () => handleDefaultAddress(item.AddressId) : undefined}
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <div className="address-left1">
                    <strong className={" text-success "}>{item?.PersonName}</strong>&nbsp;
                    <strong>{item?.AddressType}</strong>
                    <p className="mainaddress mb-0 fs-6">
                      {item?.Address} {item?.City}, <span>{item?.State}</span>{" "}
                      <span>{item?.Country}</span>
                      &nbsp;
                      <span>{item?.Pincode}</span>
                    </p>
                    <p className="landmark mb-0 fs-6">{item?.Landmark}</p>
                    {item.Email && (
                      <p className="mb-0 fs-6">
                        Email: <span>{item.Email}</span>
                      </p>
                    )}
                    <p className="mb-0 fs-6">
                      Phone: <span>{item?.AddressContactNo}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddressModal;
