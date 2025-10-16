import React, { useEffect } from "react";
import "./AddressComp.css";
import InputBox from "../../../Widgets/InputBox/InputBox";
import { cartActions } from "../../../Redux/Slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { uiAction } from "../../../Redux/Slices/uiSlice";
import { handleOnlyInputNumber } from "../../../Utils/handleOnlyInputNumber";
import AddressModal from "./addessModal";
import Loader from "../../../ExternalLib/Loader/Loader";
const AddressComp = ({
  addressType,
  name,
  address,
  city,
  state,
  country,
  pincode,
  landmark,
  mobile,
  item,
  handleDeleteAddress,
  handleSaveAddress,
  handleDefaultAddress,
  email,
  isList,
  isdefault,
  handleChangeStore,
  getAddress,
  fullname,
  setName,
  alladdress,
  ischeckout,
  personame, myAddressess, loaderMakeDefault
}) => {
  const dispatch = useDispatch();
  const addresss = useSelector((state) => state.cartreducer.address);
  const pincodee = useSelector((state) => state.cartreducer.pincode);
  const handleChange = (e) => {
    const { id, value } = e.target;
    dispatch(cartActions.setMultipleFields({ [id]: value }))
    setName(value);
  };
  const handlePincodeChange = async (e) => {
    dispatch(cartActions.setPinCode(e.target.value));
    if (e.target.value.length == 6) {
      const res = await fetch(
        `https://api.tantrash.com/API/Pincode/TTPLPincode?pincode=${e.target.value}`
      );
      const data = await res.json();
      dispatch(
        cartActions.setMultipleFields({
          city: data?.pincodeList[0]?.districtName || "",
          state: data?.pincodeList[0]?.stateName || "",
          country: "India",
        })
      );
    } else {
      dispatch(cartActions.setMultipleFields({ city: "", state: "" }));
    }
  };
  const handleEditAddress = (address) => {
    dispatch(
      cartActions.setMultipleFields({
        address: address?.Address,
        addressType: address?.AddressType,
        city: address?.City,
        fullName: address?.PersonName,
        isDefault: address?.IsDefault,
        landMark: address?.Landmark,
        mobile: address?.AddressContactNo,
        state: address?.State,
        country: address?.Country,
      })
    );

    dispatch(cartActions.setPinCode(address?.Pincode));
  };
  const navigate = useNavigate();
  const handleStoreList = (storeid) => {
    navigate(`/store-lists?id=${btoa(storeid)}`);
    dispatch(uiAction.setStoreid(storeid));
  };
  const addressid = useSelector((state) => state.uireducer.addressid);
  const storeid = useSelector((state) => state.uireducer.storeid);

  useEffect(() => {
    if (item.AddressId) {
      dispatch(uiAction.setAddressid(item.AddressId));
    }
  }, []);
  const handleStoreId = (id) => {
    dispatch(uiAction.setStoreid(id));
    dispatch(uiAction.setAddressid(""));
  };
  const handleAddressId = (id) => {
    dispatch(uiAction.setAddressid(id));
    dispatch(uiAction.setStoreid(""));
  };
  const handleCloseUpdateAddress = () => {
    dispatch(
      cartActions.setMultipleFields({
        address: "",
        addressType: "",
        city: "",
        fullName: "",
        isDefault: false,
        landMark: "",
        mobile: "",
        state: "",
      })
    );
    dispatch(cartActions.setPinCode(null));
  };
  return (
    <>
      <div
        className={"col-lg-12"}
        onClick={() =>
          !item.AddressId
            ? handleStoreId(item.StoreID)
            : item.IsDefault == "True" && handleAddressId(item.AddressId)
        }
      >
        <div
          className={
            (item.IsDefault == "True" || ischeckout) && !storeid
              ? "addaddress defaultaddr"
              : email
                ? storeid && isdefault
                  ? " addaddress defaultaddr"
                  : "addaddress bg-light"
                : "addaddress bg-light"
          }
          onClick={() => email && !isdefault && handleChangeStore(item)}
        >
          <div className="address-left text-capitalize">
            <strong className={email && "text-black"}>{name}</strong>
            {personame && <strong className="text-success">{personame}</strong>}
            {addressType && <strong className="addresstype">{addressType}</strong>}
            <span>{mobile}</span><span>{email}</span>
            <p className="mainaddress" style={{ marginTop: "3px" }}>
              {address}, {landmark}
            </p>
            <p className="mainaddress">,{city} , <span>{state}</span><strong>- {pincode}</strong>
            </p>
          </div>
          {(!isList && email && storeid && !ischeckout) && (
            <div className="addaddress-btn addaddress-btn2">
              {<button
                type="button"
                className="btn1"
                style={{ margin: "0" }}
                onClick={() => handleStoreList(item?.StoreID)}
              >
                Change Pickup Point
              </button>}
            </div>
          )}
          {(!email && !ischeckout) && (
            <div className="addaddress-btn">
              <button
                type="button"
                className="btn1"
                onClick={() => handleEditAddress(item)}
                data-bs-toggle="modal"
                data-bs-target="#staticBackdrop"
              >
                <i className="fa-solid fa-pen-to-square"></i>
              </button>
              <button
                className="btn1"
                onClick={() => handleDeleteAddress(item)}
              >
                <i className="fa-solid fa-trash-can"></i>
              </button>
              {!myAddressess && <AddressModal
                handleDefaultAddress={handleDefaultAddress}
                addresses={alladdress}
              />}
              {item.IsDefault != "True" && (
                <button
                  className="btn btn-success"
                  onClick={() => handleDefaultAddress(item.AddressId)}
                >
                  Make Default
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <div
        style={{ margin: "0", padding: "0 0 0 0" }}
        className="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">
                Update Address
              </h1>
              <button
                onClick={handleCloseUpdateAddress}
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <InputBox
                handleChange={handleChange}
                id="fullName"
                isRequired={true}
                placeholder="Full Name"
                type="text"
                value={addresss?.fullName}
              />
              <InputBox
                handleChange={handleChange}
                id="address"
                isRequired={true}
                placeholder="Address*"
                type="text"
                value={addresss?.address}
              />
              <InputBox
                handleChange={handleChange}
                id="addressType"
                isRequired={true}
                placeholder="Address Type*"
                type="text"
                value={addresss?.addressType}
              />
              <InputBox
                handleChange={handleChange}
                id="landMark"
                placeholder="Apartment/Suite etc. (optional)"
                type="text"
                value={addresss?.landMark}
              />
              <div className="row">
                <div className="col-md-6 mb-1">
                  <InputBox
                    handleChange={handlePincodeChange}
                    maxLength="6"

                    type="text"
                    onKeyDown={handleOnlyInputNumber}
                    isRequired={true}
                    placeholder="Pincode*"
                    value={pincodee}
                  />
                </div>
                <div className="col-md-6">
                  <InputBox
                    isRequired={true}
                    placeholder="City*"
                    type="text"
                    value={addresss?.city}
                    isReadonly={true}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 ">
                  <InputBox
                    id="state"
                    isRequired={true}
                    isReadonly={true}
                    placeholder="state*"
                    type="text"
                    value={addresss?.state}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <InputBox
                    handleChange={handleChange}
                    id="country"
                    isRequired={true}
                    isReadonly={true}
                    placeholder="City*"
                    type="text"
                    value={addresss?.country}
                  />
                </div>
              </div>
              <div className="mb-3 d-flex">
                <span className="input-group-text">+91</span>
                <input
                  type="text"
                  className="form-control"
                  onChange={handleChange}
                  maxLength={10}
                  id="mobile"
                  onKeyDown={handleOnlyInputNumber}
                  placeholder="Phone Number"
                  value={addresss?.mobile}
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={handleCloseUpdateAddress}
              >
                Close
              </button>
              <button
                type="button"
                data-bs-dismiss="modal"
                onClick={() => handleSaveAddress(item, "/UpdateShippingAddress")}

                className="btn btn-primary"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
      {loaderMakeDefault && <Loader />}
    </>
  );
};

export default AddressComp;
