import React from "react";
import AddAddress from "../UserProfile/AddAddress";
import { RxCross1 } from "react-icons/rx";

const AddAddressModal = () => {
  return (
    <>
      <button
        type="button"
        className="btn btn-success"
        data-bs-toggle="modal"
        data-bs-target="#exampleModalCenter"
      >
        Add Address
      </button>
      <div
        className="modal"
        id="exampleModalCenter"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header d-flex align-items-center justify-content-between">
              <h4 className="mb-0">Add Address</h4>

              <i style={{ cursor: "pointer" }} data-bs-dismiss="modal">
                <RxCross1 size={20} />
              </i>
              <button
                type="button"
                className="close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <AddAddress isaddress={true} isfromcart={true} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddAddressModal;
