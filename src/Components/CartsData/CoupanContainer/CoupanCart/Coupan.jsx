import React from "react";
import { IoPricetagsSharp } from "react-icons/io5";
const Coupan = ({ data, handleApplyCoupan }) => {
  return (
    <>
      <div className="col-lg-4">
        <div
          className="d-flex mb-2 bg-white shadow-sm overflow-hidden"
        >
          <div
            className="d-flex justify-content-center align-items-center text-white px-2 font-semibold-btn"
            style={{
              writingMode: "vertical-rl",
              transform: "rotate(360deg)",
              minWidth: "50px",
              borderBottomLeftRadius: "10px",
              borderTopLeftRadius: "10px",
              fontSize: "21px",
              height: "auto",
              backgroundColor: "#000"
            }}
          >
            ₹{parseInt(data?.CouponValue)}
          </div>

          <div className={data?.coupnST == "ACTIVE" ? "flex-grow-1 redeemed active" : "flex-grow-1 redeemed"}>
            <div className="">
              <div>
                <div className="align-items-center justify-content-between gap-2">
                  <div className="d-flex align-items-center gap-2">
                    <i>
                      <IoPricetagsSharp size={20} />
                    </i>

                    <span className="text-uppercase fw-bold text-dark fs-5">
                      {data?.CouponCode}
                    </span>
                  </div>
                  <span className="btn-new" style={data?.coupnST != "ACTIVE" ? { cursor: "default" } : undefined}>
                    {data?.coupnST}
                  </span>

                </div>
                <div
                  className=" mt-2 pb-3"
                  style={{ borderBottom: "1px dashed gray" }}
                >
                  {data?.coupnST == "REDEEMED" ?
                    <>
                      <p className=" text-success fs-5 mb-0">
                        Purchased On : {data?.PurchaseDate}{" "}
                      </p>
                      <p className=" text-success fs-5 mb-0">
                        Redeemed On  : {data?.RedeemOn}{" "}
                      </p>
                    </>
                    :
                    <>
                      <p className=" text-success fs-5 mb-0">
                        Purchased On: {data?.PurchaseDate}{" "}
                      </p>
                      <p className=" text-success fs-5 mb-0">
                        Redeemed On  :      <button
                          className={data?.coupnST == "ACTIVE" ? "btn  p-0 text-primary small" : "btn cursor-default p-0 text-danger cursor small"}
                          onClick={() => data?.coupnST == "ACTIVE" ? handleApplyCoupan(data?.numCBautoID) : undefined}
                          style={data?.coupnST != "ACTIVE" ? { cursor: "default" } : undefined}
                        >
                          Redeem Now
                        </button>
                      </p>
                    </>
                  }

                </div>
              </div>
            </div>
            <p className="text-muted small mb-0">

              ADMIN PURCHASE : {data?.PurchaseTransactionId}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Coupan;
