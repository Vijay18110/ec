import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cartActions } from "../Redux/Slices/cartSlice";
import { getProductCartData } from "../Utils/getCartList";
import { uiAction } from "../Redux/Slices/uiSlice";
import { getloggedCartList } from "../Utils/getLoggedCartList";

const QuantityCounter = ({ cartdata, handleAddProduct, isCombo }) => {
  const dispatch = useDispatch();
  const CartData = useSelector((state) => state.cartreducer.cartData);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("storedData")) || [];
    const found = stored.find((it) => it?.ProductId === cartdata?.ProductId);
    dispatch(uiAction.setQty(found?.qty || 0));
  }, [cartdata?.productId]); // re-run when productId changes
  const [loader, setLoader] = useState(false);
  const handleInCreament = async (cartdata) => {
    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    if (isCombo) {
      try {
        if (loggedInUser) {
          setLoader(true);
          dispatch(
            cartActions.handleAddProduct({ CartData, cartdata, combo: "combo" })
          );
          const getdata = async () => {
            const { obj } = await getloggedCartList();
            dispatch(cartActions.setCartData(obj?.Response?.lstCartData));
            setTimeout(() => {
              setLoader(false);
            }, 300);
          };
          setTimeout(() => {
            getdata();
          }, 500);
        } else {
          setLoader(true);
          // console.log("singlecombo", cartdata);
          dispatch(
            cartActions.handleAddProduct({ CartData, cartdata, combo: "combo" })
          );
          const getdata = async () => {
            const responce = await getProductCartData();
            dispatch(cartActions.setCartData(responce?.Response?.lstCartData));
            setTimeout(() => {
              setLoader(false);
            }, 300);
          };
          setTimeout(() => {
            getdata();
          }, 500);
        }
      } catch (error) {
        console.log(error.message);
      }
    } else {
      try {
        if (loggedInUser) {
          setLoader(true);
          dispatch(cartActions.handleAddProduct({ CartData, cartdata }));
          const getdata = async () => {
            const { obj } = await getloggedCartList();
            dispatch(cartActions.setCartData(obj?.Response?.lstCartData));
            setTimeout(() => {
              setLoader(false);
            }, 300);
          };
          setTimeout(() => {
            getdata();
          }, 500);
        } else {
          setLoader(true);

          dispatch(cartActions.handleAddProduct({ CartData, cartdata }));
          const getdata = async () => {
            const responce = await getProductCartData();
            dispatch(cartActions.setCartData(responce?.Response?.lstCartData));
            setTimeout(() => {
              setLoader(false);
            }, 300);
          };
          setTimeout(() => {
            getdata();
          }, 500);
        }
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  const handleDecrement = async () => {
    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    if (isCombo) {
      try {
        if (loggedInUser) {
          setLoader(true);
          dispatch(
            cartActions.handledecreamentQty({
              CartData,
              cartdata,
              combo: "combo",
            })
          );
          const getdata = async () => {
            const { obj } = await getloggedCartList();
            dispatch(cartActions.setCartData(obj?.Response?.lstCartData));
            setTimeout(() => {
              setLoader(false);
            }, 300);
          };
          setTimeout(() => {
            getdata();
          }, 500);
        } else {
          setLoader(true);
          dispatch(
            cartActions.handledecreamentQty({
              CartData,
              cartdata,
              combo: "combo",
            })
          );
          const getdata = async () => {
            const responce = await getProductCartData();
            dispatch(cartActions.setCartData(responce?.Response?.lstCartData));
            setTimeout(() => {
              setLoader(false);
            }, 300);
          };
          setTimeout(() => {
            getdata();
          }, 500);
        }
      } catch (error) {
        console.log(error.message);
      }
    } else {
      try {
        setLoader(true);
        if (loggedInUser) {
          dispatch(cartActions.handledecreamentQty({ CartData, cartdata }));
          const getdata = async () => {
            const { obj } = await getloggedCartList();
            dispatch(cartActions.setCartData(obj?.Response?.lstCartData));
            setTimeout(() => {
              setLoader(false);
            }, 300);
          };
          setTimeout(() => {
            getdata();
          }, 500);
        } else {
          setLoader(true);
          dispatch(cartActions.handledecreamentQty({ CartData, cartdata }));
          const getdata = async () => {
            const responce = await getProductCartData();
            dispatch(cartActions.setCartData(responce?.Response?.lstCartData));
            setTimeout(() => {
              setLoader(false);
            }, 300);
          };
          setTimeout(() => {
            getdata();
          }, 500);
        }
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  const result = CartData.find((it) => it?.ProductId === cartdata?.ProductId);
  const TotalQty = useMemo(() => {
    const result = CartData.find((it) => it?.ProductId === cartdata?.ProductId);
    return result?.quantity;
  }, [result?.quantity]);
  const Comboresult = CartData.find(
    (it) => it?.ProductId === cartdata?.ProductId
  );
  const TotalComboQty = useMemo(() => {
    const result = CartData.find((it) => it?.ProductId === cartdata?.ProductId);
    return result?.quantity;
  }, [Comboresult?.quantity]);
  return (
    <div className="w-100 d-inline-flex justify-content-center align-items-center">
      <div
        className="  d-inline-flex align-items-center justify-content-between border rounded px-1 py-1 mt-2   bg-white overflow-hidden text-center"
        style={{ width: "122px", margin: "0 auto" }}
      >
        {/* Minus Button */}
        <button
          onClick={() => handleDecrement(cartdata)}
          type="button"
          aria-label="Remove"
          disabled={loader ? true : false}
          className="btn btn-light border-0   d-flex align-items-center justify-content-center"
          style={
            loader
              ? {
                  backgroundColor: "#FF32691A",
                  height: "36px",
                  width: "30px",
                  cursor: "progress",
                }
              : {
                  backgroundColor: "#FF32691A",
                  height: "36px",
                  width: "30px",
                  cursor: "pointer",
                }
          }
        >
          <svg
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            viewBox="0 0 24 24"
            style={{ height: "1rem", width: "1rem", color: "#FF3269" }}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 12H4"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </button>
        {/* Quantity */}

        {loader ? (
          <div
            className="spinner-border spinner-border-sm text-danger"
            role="status"
          />
        ) : (
          <p
            className="text-danger fw-bold mb-0"
            style={{ fontSize: "0.875rem" }}
          >
            {/* {cartdata.qty} */}
            {isCombo
              ? JSON.parse(sessionStorage.getItem("loggedInUser"))
                ? TotalComboQty
                : TotalComboQty
              : JSON.parse(sessionStorage.getItem("loggedInUser"))
              ? TotalQty
              : TotalQty}
          </p>
        )}
        {/* Plus Button */}
        <button
          type="button"
          aria-label="Add"
          className="btn btn-light border-0 p-1 d-flex align-items-center justify-content-center"
          style={
            loader
              ? {
                  backgroundColor: "#FF32691A",
                  height: "36px",
                  width: "30px",
                  cursor: "progress",
                }
              : {
                  backgroundColor: "#FF32691A",
                  height: "36px",
                  width: "30px",
                  cursor: "pointer",
                }
          }
          disabled={loader ? true : false}
          onClick={() => handleInCreament(cartdata)}
        >
          <svg
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            viewBox="0 0 24 24"
            style={{ height: "1rem", width: "1rem", color: "#FF3269" }}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 4v16m8-8H4"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default QuantityCounter;
