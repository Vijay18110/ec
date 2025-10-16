import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddressComp from "../CartsData/AddressComp/AddressComp";
import { uiAction } from "../../Redux/Slices/uiSlice";
import { wishlistActions } from "../../Redux/Slices/wishlistSlice";
import { getWishlist } from "../../Utils/getWishlist";
import useApiRequest from "../../Hooks/apiReq";
import { useNavigate } from "react-router-dom";

const StoreList = () => {
  const Storelist = useSelector((state) => state.uireducer.storelist);
  const allStorelist = useSelector((state) => state.uireducer.allStoreLists);
  const dispatch = useDispatch();

  // store list api
  const {
    error: getStoreError,
    loading: getStoreLoading,
    response: getStoreResponce,
    sendApiRequest: getStoreSendApiRequest,
    status: getStoreStatus,
  } = useApiRequest();
  const getstoredetails = async () => {
    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    getStoreSendApiRequest("POST", "/GetStoreList");
    if (loggedInUser) {
      const responce = await getWishlist();
      dispatch(wishlistActions.setWishlist(responce?.obj?.Response?.lstWishData));
    }
  };
  useEffect(() => {
    getstoredetails();
  }, []);
  const StoreData = JSON.parse(localStorage.getItem("storelist"))

  useEffect(() => {
    if (getStoreResponce) {
      dispatch(uiAction.setAllStoreLists(getStoreResponce?.lstStoreData));
    }
    if (StoreData) {
      dispatch(uiAction.setStorelist(StoreData));
      return;
    }
    if (getStoreResponce?.lstStoreData.length > 0) {
      const filteraddress = getStoreResponce?.lstStoreData.find(it => {
        return parseInt(it?.StoreID) === 2
      })
      dispatch(uiAction.setStorelist(filteraddress));

    }
  }, [getStoreStatus == 0]);
  const navigate = useNavigate()
  const handleChangeStore = (item) => {
    dispatch(uiAction.setStorelist(item));
    localStorage.setItem("storelist", JSON.stringify(item));
    navigate("/customer-cart-details")
  };
  return (
    <>
      <div className="rts-navigation-area-breadcrumb">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="navigator-breadcrumb-wrapper">
                <a href="#">Home</a>
                <i className="fa-regular fa-chevron-right"></i>
                <a className="current" href="#">
                  Store Lists
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="rts-cart-area">
        <div className="container">
          <div className="row">
            <div className="col-xl-12 col-lg-12 col-md-12">
              <div className="cart-wrapper">
                <div className="cartpage-header">
                  <h3>Store Lists</h3>
                </div>
                <div className="card-full-width">

                  <div className="row">
                    {allStorelist && allStorelist?.length > 0 ? (
                      allStorelist.map((it, index) => {
                        return (
                          <AddressComp
                            key={index}
                            isdefault={it?.StoreID == Storelist?.StoreID}
                            item={it}
                            address={it?.StoreAddress}
                            name={it?.StoreName}
                            city={it?.StoreCity}
                            country={it?.StoreCountry}
                            mobile={it?.StoreMobile}
                            pincode={it?.StorePincode}
                            state={it?.StoreState}
                            email={it?.StoreEmail}
                            isList={true}
                            handleChangeStore={handleChangeStore}
                          />
                        );
                      })
                    ) : (
                      <div className="d-flex justify-content-center">
                        <p>No Store List</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StoreList;
