// import React, { useEffect, useState } from "react";
// import { data, Link, useNavigate } from "react-router-dom";
// import useApiRequest from "../../Hooks/apiReq";
// import noCartImg from "../../assets/Images/product/product-oder.jpg";
// import { useDispatch, useSelector } from "react-redux";
// import { wishlistActions } from "../../Redux/Slices/wishlistSlice";
// import { toast } from "react-toastify";
// import DatePicker1 from "../../ExternalLib/DatePicker/DatePicker";
// import { uiAction } from "../../Redux/Slices/uiSlice";
// import dayjs from "dayjs";
// import OrderDetails from "../OrderDetails/OrderDetails";
// import OrderLists from "./OrderList/OrderLists";
// import { orderAction } from "../../Redux/Slices/orderSlice";
// import ProductCard from "../../Shared/ProductCard/ProductCard";
// import ApiEncryptDecrypt from "../../Utils/Encryption";
// import { Key } from "../../Utils/Key";
// import axiosInstance from "../../Utils/axiosInstance";
// import { getWishlist } from "../../Utils/getWishlist";
// import Loader from "../../ExternalLib/Loader/Loader";
// import OrderFilterDropdown from "./OrderFilter/OrderFilterDropdown";
// const MyOrders = () => {
//   const dispatch = useDispatch();
//   const wishlist = useSelector((state) => state.wishlistreducer.wishlist);
//   const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
//   const from = dayjs(new Date());
//   const to = dayjs(new Date());
//   const today = new Date();
//   //get orders list
//   const now = new Date();
//   const [FromDate, setFromDate] = useState(
//     new Date(today.getFullYear(), today.getMonth() - 3, 1)
//   );
//   const [ToDate, setToDate] = useState(
//     new Date(today.getFullYear(), today.getMonth(), 0)
//   );
//   const handleFromDate = (event) => {
//     setFromDate(event);
//   };
//   const [lastFilter, setPreviousFilter] = useState({});

//   const handleToDate = async (event) => {
//     setToDate(event);
//   };
//   const formatdate = (date) => {
//     if (isCustome) {
//       if (!date) return ""; // Handle null or undefined values
//       const day = date.date(); // Get day (1-31)
//       const month = date.month() + 1; // Get month (0-11, so we add 1)
//       const year = date.year(); // Get full year

//       // Format day and month with leading zeros if necessary
//       const formattedDay = day < 10 ? `0${day}` : day;
//       const formattedMonth = month < 10 ? `0${month}` : month;

//       return `${formattedDay}-${formattedMonth}-${year}`;
//     } else {
//       if (!date || !(date instanceof Date)) return ""; // Handle invalid or null inputs

//       const day = date.getDate(); // 1-31
//       const month = date.getMonth() + 1; // 0-11 → 1-12
//       const year = date.getFullYear(); // 4-digit year

//       const formattedDay = day < 10 ? `0${day}` : `${day}`;
//       const formattedMonth = month < 10 ? `0${month}` : `${month}`;

//       return `${formattedDay}-${formattedMonth}-${year}`;
//     }
//   };
//   const navigate = useNavigate();
//   const {
//     error: orderListError,
//     loading: orderListLoading,
//     response: orderListResponce,
//     sendApiRequest: orderListSendApiRequest,
//     status: orderListStatus,
//   } = useApiRequest();
//   const getFormattedYearRange = (year) => {
//     if (year == 2025) {
//       const currentYear = new Date().getFullYear();
//       const from = new Date(year, 0, 1); // Jan 1st
//       const to =
//         year === currentYear
//           ? new Date() // today's date if current year
//           : new Date(year, 11, 31); // Dec 31 if past/future year
//       const formattedfromdate = formatdate(from);
//       const formatedtodate = formatdate(to);
//       return { formattedfromdate, formatedtodate };
//     } else {
//       const from = new Date(year, 0, 1); // January 1st
//       const to = new Date(year, 11, 31); // December 31st

//       const formattedfromdate = formatdate(from);
//       const formatedtodate = formatdate(to);
//       return { formattedfromdate, formatedtodate };
//     }
//   };
//   const [isCustome, setIsCustome] = useState(false);

//   const getOrderList = (name, year) => {
//     if (name == "Last Three Months") {
//       const fromdate = formatdate(
//         new Date(today.getFullYear(), today.getMonth() - 3, 1)
//       );
//       const todate = formatdate(
//        new Date()
//       );
//       orderListSendApiRequest("POST", "/CustomerOrderList", {
//         CustomerId: loggedInUser?.CustomerId,
//         FromDate: fromdate,
//         ToDate: todate,
//       });
//     } else if (name == "year") {
//       const [filterdata] = [2021, 2022, 2023, 2024, 2025].filter((item) => {
//         return item == year;
//       });
//       const { formattedfromdate, formatedtodate } =
//         getFormattedYearRange(filterdata);
//       orderListSendApiRequest("POST", "/CustomerOrderList", {
//         CustomerId: loggedInUser?.CustomerId,
//         FromDate: formattedfromdate,
//         ToDate: formatedtodate,
//       });
//     } else {
//       const fromdate = formatdate(FromDate);
//       const todate = formatdate(ToDate);
//       orderListSendApiRequest("POST", "/CustomerOrderList", {
//         CustomerId: loggedInUser?.CustomerId,
//         FromDate: fromdate || "",
//         ToDate: todate || "",
//       });
//     }
//     setPreviousFilter({ FromDate, ToDate });
//   };

//   const [selectedFilter, setSelectedFilter] = useState("Last Three Months");
//   const handleFilterwallete = (filter) => {
//     if (loggedInUser) {
//       setSelectedFilter(filter);
//       if (filter == "Last Three Months") {
//         getOrderList("Last Three Months");
//         setIsCustome(false);
//       } else if (filter == "2025") {
//         setIsCustome(false);

//         getOrderList("year", 2025);
//       } else if (filter == "2024") {
//         setIsCustome(false);

//         getOrderList("year", 2024);
//       } else if (filter == "2023") {
//         setIsCustome(false);

//         getOrderList("year", 2023);
//       } else if (filter == "2022") {
//         setIsCustome(false);

//         getOrderList("year", 2022);
//       } else if (filter == "2021") {
//         setIsCustome(false);

//         getOrderList("year", 2021);
//       } else if (filter == "Custome") {
//         setIsCustome(true);
//         setToDate(from);
//         setFromDate(to);
//         getOrderList("Custome");
//       }
//     } else {
//       dispatch(uiAction.openModal());
//     }
//   };
//   const tabs = useSelector((state) => state.uireducer.tabs);
//   const isOrderDetail = useSelector(
//     (state) => state.wishlistreducer.isOrderDetail
//   );
//   const retrunref = useSelector((state) => state.orderreducer.returnref);
//   useEffect(() => {
//     if (loggedInUser) {
//       getOrderList("Last Three Months");
//       dispatch(wishlistActions.setIsOrderDetail(false));
//     } else {
//       dispatch(uiAction.openModal());
//     }
//   }, [tabs == "myOrders", retrunref]);

//   //order details handler
//   const {
//     error: orderDetailsError,
//     loading: orderDetailsLoading,
//     response: orderDetailsResponce,
//     sendApiRequest: orderDetailsSendApiRequest,
//     status: orderDetailsStatus,
//   } = useApiRequest();
//   const [isstatus, setIsStatus] = useState();

//   const handleOrderDetails = (orderid, status) => {
//     // console.log(orderid);
//     localStorage.setItem("returnid", orderid);
//     setIsStatus(status);
//     dispatch(wishlistActions.setIsOrderDetail(true));
//     orderDetailsSendApiRequest("POST", "/CustomerOrderDetails", {
//       OrderId: orderid,
//       CustomerId: loggedInUser.CustomerId,
//     });
//   };
//   const handleAddWishlist = async (productid) => {
//     const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));

//     if (loggedInUser) {
//       const encryptedData = await ApiEncryptDecrypt.encryptString(
//         Key,
//         JSON.stringify({
//           CustomerId: loggedInUser?.CustomerId,
//           ProductID: productid,
//         })
//       );

//       const jsonData = { Body: encryptedData };
//       let res;

//       res = await axiosInstance.post("/AddCustomerWish", jsonData);

//       const decryptedRes = await ApiEncryptDecrypt.decryptString(
//         Key,
//         res.data.body
//       );
//       const obj = JSON.parse(decryptedRes);
//       if (obj.Status === 0) {
//         const responce = await getWishlist();
//         dispatch(
//           wishlistActions.setWishlist(responce?.obj?.Response?.lstWishData)
//         );
//       }
//       // Handle different status codes
//       if (obj.Status === 1) {
//         toast.error(obj.Message);
//       }
//       if (obj.Status === 3) {
//         dispatch(uiAction.openModal());
//       }
//     } else {
//       if (!loggedInUser) {
//         dispatch(uiAction.openModal());
//         dispatch(uiAction.setScreen("login"));
//         dispatch(uiAction.setUser());
//         return;
//       }
//     }
//   };
//   // console.log(isOrderDetail)
//   return (
//     <div className="orderdate w-100">
//       {orderListResponce && orderListResponce?.lstOrderList?.length > 0 ? (
//         isOrderDetail ? (
//           <OrderDetails detail={orderDetailsResponce} status={isstatus} />
//         ) : (
//           <div>
//             <OrderFilterDropdown
//               selectedFilter={selectedFilter}
//               setFromDate={setFromDate}
//               setToDate={setToDate}
//               handleFilterwallete={handleFilterwallete}
//               isCustome={isCustome}
//             >
//               <div
//                 className="date3 m-2 flex-wrap d-flex align-items-center border-bottom justify-content-center gap-3"
//                 style={{ marginBottom: "20px" }}
//               >
//                 <label>
//                   From&nbsp;&nbsp;
//                   <DatePicker1
//                     max={from}
//                     value={FromDate}
//                     handleChange={handleFromDate}
//                   />
//                 </label>
//                 <label>
//                   To&nbsp;&nbsp;
//                   <DatePicker1
//                     max={to}
//                     value={ToDate}
//                     handleChange={handleToDate}
//                   />
//                 </label>
//                 <button
//                   onClick={getOrderList}
//                   className="btn btn-outline-primary py-0  px-4 fs-5"
//                 >
//                   Filter
//                 </button>
//               </div>
//             </OrderFilterDropdown>
//             <div className="card p-4">
//               {orderListResponce?.lstOrderList.length > 0 ? (
//                 orderListResponce?.lstOrderList?.map((item, index) => {
//                   // console.log(item)
//                   return (
//                     <OrderLists
//                       handleOrderDetails={handleOrderDetails}
//                       item={item}
//                       key={index}
//                     />
//                   );
//                 })
//               ) : (
//                 <p className="text-danger text-center mt-5">No Reorder Found</p>
//               )}
//             </div>
//           </div>
//         )
//       ) : (
//         !(orderListLoading || orderDetailsLoading) && (
//           <>
//             <OrderFilterDropdown
//               selectedFilter={selectedFilter}
//               setFromDate={setFromDate}
//               setToDate={setToDate}
//               handleFilterwallete={handleFilterwallete}
//               isCustome={isCustome}
//             >
//               <div
//                 className="date3 m-2 flex-wrap d-flex align-items-center border-bottom justify-content-center gap-3"
//                 style={{ marginBottom: "20px" }}
//               >
//                 <label>
//                   From&nbsp;&nbsp;
//                   <DatePicker1
//                     max={from}
//                     value={FromDate}
//                     handleChange={handleFromDate}
//                   />
//                 </label>
//                 <label>
//                   To&nbsp;&nbsp;
//                   <DatePicker1
//                     max={to}
//                     value={ToDate}
//                     handleChange={handleToDate}
//                   />
//                 </label>
//                 <button
//                   onClick={getOrderList}
//                   className="btn btn-outline-primary py-0  px-4 fs-5"
//                 >
//                   Filter
//                 </button>
//               </div>
//             </OrderFilterDropdown>
//             <div className="card text-center p-4">
//               <img
//                 loading="lazy"
//                 // https://cdn-icons-png.flaticon.com/512/4076/4076549.png
//                 src={noCartImg}
//                 alt="No Orders"
//                 style={{ width: "400px", margin: "auto" }}
//               />
//               <h5 className="mt-4 fw-bold">No Orders Yet!</h5>
//               <p className="text-muted px-md-5">
//                 Explore our mindful collection that align with your values and
//                 start your sustainable journey with us today.
//               </p>
//               <Link to="/home">
//                 <button className="btn btn-outline-success mt-2 px-4">
//                   Continue Shopping
//                 </button>
//               </Link>
//             </div>
//           </>
//         )
//       )}
//       {(orderListLoading || orderDetailsLoading) && <Loader />}
//     </div>
//   );
// };

// export default MyOrders;

import React, { useEffect, useState } from "react";
import { data, Link, useNavigate } from "react-router-dom";
import useApiRequest from "../../Hooks/apiReq";
import noCartImg from "../../assets/Images/product/product-oder.jpg";
import { useDispatch, useSelector } from "react-redux";
import { wishlistActions } from "../../Redux/Slices/wishlistSlice";
import DatePicker1 from "../../ExternalLib/DatePicker/DatePicker";
import { uiAction } from "../../Redux/Slices/uiSlice";
import dayjs from "dayjs";
import OrderDetails from "../OrderDetails/OrderDetails";
import OrderLists from "./OrderList/OrderLists";
import Loader from "../../ExternalLib/Loader/Loader";
import OrderFilterDropdown from "./OrderFilter/OrderFilterDropdown";
const MyOrders = () => {
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlistreducer.wishlist);

  const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));

  const from = dayjs(new Date());
  const to = dayjs(new Date());
  const today = new Date();

  //get orders list
  const now = new Date();
  const [FromDate, setFromDate] = useState(
    new Date(today.getFullYear(), today.getMonth() - 3, 1)
  );
  const [ToDate, setToDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 0)
  );
  const handleFromDate = (event) => {
    setFromDate(event);
  };
  const [lastFilter, setPreviousFilter] = useState({});

  const handleToDate = async (event) => {
    setToDate(event);
  };
  const formatdate = (date, isCustome) => {
    if (isCustome) {
      if (!date) return ""; // Handle null or undefined values
      const day = date.date(); // Get day (1-31)
      const month = date.month() + 1; // Get month (0-11, so we add 1)
      const year = date.year(); // Get full year
      // Format day and month with leading zeros if necessary
      const formattedDay = day < 10 ? `0${day}` : day;
      const formattedMonth = month < 10 ? `0${month}` : month;

      return `${formattedDay}-${formattedMonth}-${year}`;
    } else {
      if (!date || !(date instanceof Date)) return ""; // Handle invalid or null inputs

      const day = date.getDate(); // 1-31
      const month = date.getMonth() + 1; // 0-11 → 1-12
      const year = date.getFullYear(); // 4-digit year

      const formattedDay = day < 10 ? `0${day}` : `${day}`;
      const formattedMonth = month < 10 ? `0${month}` : `${month}`;

      return `${formattedDay}-${formattedMonth}-${year}`;
    }
  };
  const {
    error: orderListError,
    loading: orderListLoading,
    response: orderListResponce,
    sendApiRequest: orderListSendApiRequest,
    status: orderListStatus,
  } = useApiRequest();
  const getFormattedYearRange = (year) => {
    if (year == 2025) {
      const currentYear = new Date().getFullYear();
      const from = new Date(year, 0, 1); // Jan 1st
      const to =
        year === currentYear
          ? new Date() // today's date if current year
          : new Date(year, 11, 31); // Dec 31 if past/future year
      const formattedfromdate = formatdate(from);
      const formatedtodate = formatdate(to);
      return { formattedfromdate, formatedtodate };
    } else {
      const from = new Date(year, 0, 1); // January 1st
      const to = new Date(year, 11, 31); // December 31st

      const formattedfromdate = formatdate(from);
      const formatedtodate = formatdate(to);
      return { formattedfromdate, formatedtodate };
    }
  };

  const getOrderList = (name, year) => {
    console.log(name, year);

    if (name == "Last Three Months") {
      const fromdate = formatdate(
        new Date(today.getFullYear(), today.getMonth() - 3, 1),
        false
      );
      const todate = formatdate(new Date(), false);
      orderListSendApiRequest("POST", "/CustomerOrderList", {
        CustomerId: loggedInUser?.CustomerId,
        FromDate: fromdate,
        ToDate: todate,
      });
    } else if (name == "year") {
      const [filterdata] = [2021, 2022, 2023, 2024, 2025].filter((item) => {
        return item == year;
      });
      const { formattedfromdate, formatedtodate } =
        getFormattedYearRange(filterdata);
      orderListSendApiRequest("POST", "/CustomerOrderList", {
        CustomerId: loggedInUser?.CustomerId,
        FromDate: formattedfromdate,
        ToDate: formatedtodate,
      });
    } else {
      let from, to;
      if (year?.from && year?.to) {
        ({ from, to } = year); // Destructure safely
      }
      const fromdate = formatdate(from || FromDate, true);
      const todate = formatdate(to || ToDate, true);
      orderListSendApiRequest("POST", "/CustomerOrderList", {
        CustomerId: loggedInUser?.CustomerId,
        FromDate: fromdate || "",
        ToDate: todate || "",
      });
    }
    setPreviousFilter({ FromDate, ToDate });
  };

  const [selectedFilter, setSelectedFilter] = useState("Last Three Months");
  const handleFilterwallete = (filter) => {
    if (loggedInUser) {
      setSelectedFilter(filter);
      if (filter == "Last Three Months") {
        getOrderList("Last Three Months");
      } else if (filter == "2025") {
        getOrderList("year", 2025);
      } else if (filter == "2024") {
        getOrderList("year", 2024);
      } else if (filter == "2023") {
        getOrderList("year", 2023);
      } else if (filter == "2022") {
        getOrderList("year", 2022);
      } else if (filter == "2021") {
        getOrderList("year", 2021);
      } else if (filter == "Custome") {
        setToDate(from);
        setFromDate(to);
        getOrderList("Custome", { from, to });
      }
    } else {
      dispatch(uiAction.openModal());
    }
  };
  const tabs = useSelector((state) => state.uireducer.tabs);
  const isOrderDetail = useSelector(
    (state) => state.wishlistreducer.isOrderDetail
  );
  const retrunref = useSelector((state) => state.orderreducer.returnref);
  useEffect(() => {
    if (loggedInUser) {
      getOrderList("Last Three Months");
      dispatch(wishlistActions.setIsOrderDetail(false));
    } else {
      dispatch(uiAction.openModal());
    }
  }, [tabs == "myOrders", retrunref]);

  //order details handler
  const {
    error: orderDetailsError,
    loading: orderDetailsLoading,
    response: orderDetailsResponce,
    sendApiRequest: orderDetailsSendApiRequest,
    status: orderDetailsStatus,
  } = useApiRequest();
  const [isstatus, setIsStatus] = useState();

  const handleOrderDetails = (orderid, status) => {
    localStorage.setItem("returnid", orderid);
    setIsStatus(status);
    dispatch(wishlistActions.setIsOrderDetail(true));
    orderDetailsSendApiRequest("POST", "/CustomerOrderDetails", {
      OrderId: orderid,
      CustomerId: loggedInUser.CustomerId,
    });
  };

  return (
    <div className="orderdate w-100">
      {orderListResponce && orderListResponce?.lstOrderList?.length > 0 ? (
        isOrderDetail ? (
          <OrderDetails detail={orderDetailsResponce} status={isstatus} />
        ) : (
          <div>
            <OrderFilterDropdown
              selectedFilter={selectedFilter}
              setFromDate={setFromDate}
              setToDate={setToDate}
              handleFilterwallete={handleFilterwallete}
            >
              <div
                className="date3 m-2 flex-wrap d-flex align-items-center border-bottom justify-content-center gap-3"
                style={{ marginBottom: "20px" }}
              >
                <label>
                  From&nbsp;&nbsp;
                  <DatePicker1
                    max={from}
                    value={FromDate}
                    handleChange={handleFromDate}
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
                  onClick={getOrderList}
                  className="btn btn-outline-primary py-0  px-4 fs-5"
                >
                  Filter
                </button>
              </div>
            </OrderFilterDropdown>
            <div className="card p-4">
              {orderListResponce?.lstOrderList.length > 0 ? (
                orderListResponce?.lstOrderList?.map((item, index) => {
                  return (
                    <OrderLists
                      handleOrderDetails={handleOrderDetails}
                      item={item}
                      key={index}
                    />
                  );
                })
              ) : (
                <p className="text-danger text-center mt-5">No Reorder Found</p>
              )}
            </div>
          </div>
        )
      ) : (
        !(orderListLoading || orderDetailsLoading) && (
          <>
            <OrderFilterDropdown
              selectedFilter={selectedFilter}
              setFromDate={setFromDate}
              setToDate={setToDate}
              handleFilterwallete={handleFilterwallete}
            >
              <div
                className="date3 m-2 flex-wrap d-flex align-items-center border-bottom justify-content-center gap-3"
                style={{ marginBottom: "20px" }}
              >
                <label>
                  From&nbsp;&nbsp;
                  <DatePicker1
                    max={from}
                    value={FromDate}
                    handleChange={handleFromDate}
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
                  onClick={getOrderList}
                  className="btn btn-outline-primary py-0  px-4 fs-5"
                >
                  Filter
                </button>
              </div>
            </OrderFilterDropdown>
            <div className="card text-center p-4">
              <img
                loading="lazy"
                // https://cdn-icons-png.flaticon.com/512/4076/4076549.png
                src={noCartImg}
                alt="No Orders"
                style={{ width: "400px", margin: "auto" }}
              />
              <h5 className="mt-4 fw-bold">No Orders Yet!</h5>
              <p className="text-muted px-md-5">
                Explore our mindful collection that align with your values and
                start your sustainable journey with us today.
              </p>
              <Link to="/home">
                <button className="btn btn-outline-success mt-2 px-4">
                  Continue Shopping
                </button>
              </Link>
            </div>
          </>
        )
      )}
      {(orderListLoading || orderDetailsLoading) && <Loader />}
    </div>
  );
};

export default MyOrders;
