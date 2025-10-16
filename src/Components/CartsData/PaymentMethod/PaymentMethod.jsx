import React, { useState } from "react";
import { convertToINRFormat } from "../../../Utils/INRConvert";
const PaymentMethod = ({ setPayment, payment, total, total1 }) => {

  const handleChange = (e) => {
    const { id } = e.target;
    if (id == "Online") {
      setPayment({ Online: "Online", Wallet: "" })
    } else if (id == "Wallet") {
      setPayment({ Online: "", Wallet: "Wallet" })
    }
  }
  const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
  return (
    <>
      <div className="">
        <div className="bg-white rounded-3">
          <div className=" mt-3 p-3 bg-white border rounded-3 choose-payment-method">
            <h3 className="h5 fw-medium text-dark d-none d-md-block mb-0">Choose Payment Method</h3>
            <div className="form-check d-flex align-items-center">
              <input
                className=" me-2"
                type="radio"
                name="paymentMethod"
                id="Wallet"
                onChange={handleChange}
                value={payment.Wallet}
                disabled={total1 > total?.TotalBalance}
              // defaultChecked={payment.Wallet ? true : false}
              />
              <label className="form-check-label" for="paymentCOD">
                Wallet {loggedInUser && <span>({convertToINRFormat(total?.TotalBalance)})</span>}
              </label>
            </div>
            <div className="form-check  d-flex align-items-center">
              <input
                className="me-2"
                type="radio"
                name="paymentMethod"
                id="Online"
                value={payment.Online}
                onChange={handleChange}
                defaultChecked={true}
              />
              <label
                className="form-check-label d-flex flex-wrap align-items-center"
                for="paymentOnline"
              >
                Online
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default PaymentMethod;
