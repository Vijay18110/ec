import React, { useEffect, useMemo, useState } from "react";
import useApiRequest from "../../Hooks/apiReq";
import Loader from "../../ExternalLib/Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { walletActions } from "../../Redux/Slices/walletSlice";
import DatePicker1 from "../../ExternalLib/DatePicker/DatePicker";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { uiAction } from "../../Redux/Slices/uiSlice";
import { toast } from "react-toastify";
import { getWalletAmmount } from "../../Utils/TotalWallet";
import { VscLightbulb } from "react-icons/vsc";
import { convertToINRFormat } from "../../Utils/INRConvert";

const MyWallet = () => {
  const navigate = useNavigate();
  const { error, loading, response, sendApiRequest, status } = useApiRequest();
  const formatdate = (date) => {
    if (!date) return ""; // Handle null or undefined values
    const day = date.date(); // Get day (1-31)
    const month = date.month() + 1; // Get month (0-11, so we add 1)
    const year = date.year(); // Get full year

    // Format day and month with leading zeros if necessary
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;

    return `${formattedDay}-${formattedMonth}-${year}`;
  };
  const now = new Date();
  const from = dayjs(new Date());
  const to = dayjs(new Date());
  const [FromDate, setFromDate] = useState(from);
  const [ToDate, setToDate] = useState(to);
  const [lastFilter, setLastFilter] = useState({});
  const getWallet = () => {
    if (
      JSON.stringify({
        FromDate: FromDate,
        ToDate: ToDate,
      }) === JSON.stringify(lastFilter)
    ) {
      toast.info("No changes in filters. Data already fetched.", {
        toastId: "jk",
      });
      return;
    }
    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    if (loggedInUser) {
      const fromdate = formatdate(FromDate);
      const todate = formatdate(ToDate);

      try {
        sendApiRequest("POST", "/CustomerWalletDetail", {
          CustomerId: loggedInUser?.CustomerId,
          FromDate: fromdate,
          ToDate: todate,
        });
        setLastFilter({
          FromDate: FromDate,
          ToDate: ToDate,
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const dispatch = useDispatch();

  // Calculate totals

  const handleFromDate = (event) => {
    setFromDate(event);
  };

  const handleToDate = async (event) => {
    setToDate(event);
  };
  const handleFilterwallete = () => {
    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    if (loggedInUser) {
      getWallet();
    } else {
      dispatch(uiAction.openModal());
    }
  };

  //total wallet balance api

  const totalWalletResponce = useSelector(
    (state) => state.walletreducer.totalWallet
  );
  const getTotalWalletAmmount = async () => {
    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    if (loggedInUser) {
      const { obj } = await getWalletAmmount();
      dispatch(walletActions.setTotalWallet(obj?.Response));
    }
    // totalWalletSendApiRequest("POST", "/TotalCustomerWallet", {
    //   CustomerId: loggedInUser?.CustomerId,
    // });
  };
  useEffect(() => {
    getWallet();
    getTotalWalletAmmount();
  }, []);
  return (
    <>
      <div className="w-100 p-0 p-xl-4">
        <h5 className="mb-4">My Wallet</h5>
        <div className="container-fluid  pb-5  pt-2">
          <div className="row justify-content-center">
            <div className="col-md-12">
              {/* Wallet Summary */}
              <div className="bg-white p-2 rounded shadow-sm mb-4">
                <div
                  className="date3 flex-wrap d-flex align-items-center border-bottom justify-content-center gap-3"
                  style={{ marginBottom: "20px", paddingBottom: "20px" }}
                >
                  <label>
                    From&nbsp;&nbsp;
                    <DatePicker1
                      value={FromDate}
                      handleChange={handleFromDate}
                      max={to}
                    />
                  </label>
                  <label>
                    To&nbsp;&nbsp;
                    <DatePicker1
                      max={to}
                      value={ToDate}
                      handleChange={handleToDate}
                    />
                  </label>
                  <button
                    onClick={handleFilterwallete}
                    className="btn btn-outline-primary py-0  px-4 fs-5"
                  >
                    Filter
                  </button>
                </div>
                <div className="row text-center">
                  <div className="col-md-4">
                    <h5 className="text-muted">Total Credited</h5>
                    <h3 className="text-success">
                      +{convertToINRFormat(response?.TotalAmountCr)}
                    </h3>
                  </div>
                  <div className="col-md-4">
                    <h5 className="text-muted">Total Balance</h5>
                    <h3 className="text-primary">
                      {convertToINRFormat(totalWalletResponce?.TotalBalance??"0")}
                    </h3>
                  </div>
                  <div className="col-md-4">
                    <h5 className="text-muted">Total Debited</h5>
                    <h3 className="text-danger">
                      -{convertToINRFormat(response?.TotalAmountDr)}
                    </h3>
                  </div>
                </div>
              </div>
              {/* Transaction List */}
              <div
                className="bg-white p-4 rounded shadow-sm"
                style={{
                  maxHeight: "410px",
                  overflowY: "scroll",
                  scrollbarWidth: "thin",
                }}
              >
                <h5 className="mb-3">Transaction History</h5>
                {response?.lstWalletLedger.map((tx, index) => (
                  <div
                    key={index}
                    className="d-flex justify-content-between align-items-center border-bottom py-3"
                  >
                    <div>
                      <strong>{tx.Description}</strong>
                      <div className="text-muted small">
                        {tx.TransactionDate}
                      </div>
                    </div>
                    <div
                      className={
                        parseInt(tx.AmountCr) > 0
                          ? "text-primary"
                          : parseInt(tx.AmountDr) > 0
                            ? "text-danger"
                            : "text-gray"
                      }
                    >
                      {parseInt(tx.AmountCr) > 0
                        ? "+"
                        : parseInt(tx.AmountDr) > 0
                          ? "-"
                          : ""}
                      ₹
                      {parseInt(tx.AmountCr) > 0
                        ? parseInt(tx.AmountCr)
                        : parseInt(tx.AmountDr) > 0
                          ? parseInt(tx.AmountDr)
                          : 0}
                      <div className="small text-muted text-end">
                        {parseInt(tx.AmountCr) > 0
                          ? "Credited"
                          : parseInt(tx.AmountDr) > 0
                            ? "Debited"
                            : ""}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyWallet;
