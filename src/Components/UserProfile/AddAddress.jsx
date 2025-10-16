import React, { useEffect, useState } from "react";
import InputBox from "../../Widgets/InputBox/InputBox";
import { validateAddressForm } from "../../Validation/ValidateAddressForm";
import useApiRequest from "../../Hooks/apiReq";
import { useDispatch, useSelector } from "react-redux";
import { uiAction } from "../../Redux/Slices/uiSlice";
import { cartActions } from "../../Redux/Slices/cartSlice";
import Loader from "../../ExternalLib/Loader/Loader";
import { getShippingAddress } from "../../Utils/getShippingAddress";
import { addressAction } from "../../Redux/Slices/addressSlice";
import AddressModal from "../CartsData/AddressComp/addessModal";
import { IoMdArrowRoundBack } from "react-icons/io";
import AddressComp from "../CartsData/AddressComp/AddressComp";
import ApiEncryptDecrypt from "../../Utils/Encryption";
import axiosInstance from "../../Utils/axiosInstance";
import { Key } from "../../Utils/Key";
import { toast } from "react-toastify";
import ProductNotFound from "../ProductNotFound";
const AddAddress = ({ isaddress, isfromcart }) => {
  const address = useSelector((state) => state.cartreducer.address);
  const dispatch = useDispatch();
  const pincode = useSelector((state) => state.cartreducer.pincode);
  const handleChange = (e) => {
    const { id, value } = e.target;
    console.log(e)
    dispatch(cartActions.setAddress({ field: id, value }));
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
  const { error, loading, response, sendApiRequest, status } = useApiRequest();
  const getstate = useSelector((state) => state.uireducer.address);
  const [loader, setLoader] = useState(false)
  const getAddressResponce = useSelector(
    (state) => state.addressreducer.address
  );
  const getAddress = async () => {
    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    if (loggedInUser) {
      const { obj } = await getShippingAddress();
      dispatch(addressAction.setAddress(obj?.Response));
    }
  };
  useEffect(() => {
    getAddress()
  }, [status])
  const isDefault = getAddressResponce?.lstAddressData.find(item => {
    return item?.IsDefault == "True"
  })
  const [addAddress, setAddAdress] = useState(false);
  const handleSaveAddress = (editData, endPoint) => {
    console.log("editData", editData)
    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    try {
      setLoader(true)
      if (validateAddressForm(address)) {
        sendApiRequest(
          "POST",
          endPoint ? endPoint : "/AddEditShippingAddress",
          {
            AddressId: editData?.AddressId,
            CustomerId: loggedInUser.CustomerId,
            PesronName: address.fullName,
            AddressName: address.address,
            AddressType: address.addressType,
            IsDefaultAddress: isDefault ? address.isDefault : "True",
            AddressContactNo: address.mobile,
            State: address.state,
            City: address.city,
            Country: address.country,
            PinCode: pincode,
            Address1: "",
            Landmark: address.landMark,
          },
          {
            showToast: true, onSuccess: () => {
              getAddress()
              setAddAdress(false);
              dispatch(uiAction.setaddresss());
              dispatch(cartActions.setPinCode(null));
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
            }
          }
        );


      }
    } catch (error) {
      console.log(error.message)
    } finally {
      setLoader(false)
    }
  };
  const handleAddAddress = () => {
    setAddAdress((pre) => !pre)
  }
  // const getAddressResponce = useSelector(
  //   (state) => state.addressreducer.address
  // );
  const {
    error: deleteAddressError,
    loading: deleteAddressLoading,
    response: deleteAddressResponce,
    sendApiRequest: deleteAddressSendApiRequest,
    status: deleteAddressStatus,
  } = useApiRequest();
  const handleDeleteAddress = async (address) => {
    dispatch(uiAction.setAddressid(null))
    deleteAddressSendApiRequest(
      "POST",
      "/DeleteShippingAddress",
      {
        AddressId: address.AddressId,
        CustomerId: address.CustomerId,
        PesronName: address.PesronName,
        AddressName: address.AddressName,
        AddressType: address.AddressType,
        IsDefaultAddress: address.IsDefaultAddress,
        AddressContactNo: address.AddressContactNo,
        State: address.State,
        City: address.City,
        Country: address.Country,
        PinCode: address.PinCode,
        Address1: address.Address1,
        Landmark: address.Landmark,
      },
      {
        onSuccess: () => {
          getAddress();
        }
      }
    );

  };
  const handleDefaultAddress = async (addressid) => {
    setLoader(true)

    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    if (!loggedInUser) {

      dispatch(uiAction.openModal());
      dispatch(uiAction.setScreen("login"));
      dispatch(uiAction.setUser());
      return;
    }
    if (loggedInUser) {
      const encryptedData = await ApiEncryptDecrypt.encryptString(
        Key,
        JSON.stringify({
          CustomerId: loggedInUser?.CustomerId,
          AddressId: addressid,
        })
      );
      const jsonData = { Body: encryptedData };
      let res;
      res = await axiosInstance.post("/UpdateDefaultShippingAddress", jsonData);
      const decryptedRes = await ApiEncryptDecrypt.decryptString(
        Key,
        res.data.body
      );
      const obj = JSON.parse(decryptedRes);
      if (obj.Status === 0) {
        setLoader(false)

        getAddress();
      }
      // Handle different status codes
      if (obj.Status === 1) {
        toast.error(obj.Message);
        setLoader(false)

      }
      if (obj.Status === 3) {
        dispatch(uiAction.openModal());
        setLoader(false)

      }
    } else {
      dispatch(uiAction.openModal());
    }
  };
  return (

    isfromcart ? (
      <div className="my-4">
        {!isfromcart && <div style={{ width: "40px", height: "40px", borderRadius: "50%" }}>
          <span className="shadow py-1" >
            <IoMdArrowRoundBack size={25} onClick={handleAddAddress} />
          </span>
        </div>}
        {

          !isaddress && <h4 className="mb-4">Add Address</h4>
        }
        <div className="card p-4">
          <InputBox
            handleChange={handleChange}
            id="fullName"
            isRequired={true}
            placeholder="Full Name"
            type="text"
            value={address?.fullName}
          />
          <InputBox
            handleChange={handleChange}
            id="address"
            isRequired={true}
            placeholder="Address*"
            type="text"
            value={address?.address}
          />
          <InputBox
            handleChange={handleChange}
            id="addressType"
            isRequired={true}
            placeholder="Address Type*"
            type="text"
            value={address?.addressType}
          />
          <InputBox
            handleChange={handleChange}
            id="landMark"
            placeholder="Apartment/Suite etc. (optional)"
            type="text"
            value={address?.landMark}
          />
          <div className="row">
            <div className="col-md-6 mb-1">
              <InputBox
                handleChange={handlePincodeChange}
                max={6}
                isRequired={true}
                placeholder="Pincode*"
                type="number"
                value={pincode}
              />
            </div>
            <div className="col-md-6">
              <InputBox
                isRequired={true}
                placeholder="City*"
                type="text"
                value={address?.city}
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
                value={address?.state}
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
                value={address?.country}
              />
            </div>
          </div>

          <div className="mb-3 d-flex">
            <span className="input-group-text border-end-0 rounded-end-0 mb-3">
              +91
            </span>

            <input
              type="text"
              className="form-control rounded-start-0 mb-3"
              onChange={handleChange}
              id="mobile"
              placeholder="Phone Number"
              value={address?.mobile}
              required
              maxLength={10}
              onKeyDown={(e) => {
                if (
                  !/[0-9]/.test(e.key) &&
                  e.key !== "Backspace" &&
                  e.key !== "Delete" &&
                  e.key !== "ArrowLeft" &&
                  e.key !== "ArrowRight"
                ) {
                  e.preventDefault(); // block non-numeric keys
                }
              }}
            />
          </div>
          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="isDefault"
              checked={address?.isDefault}
              onChange={(e) =>
                dispatch(
                  cartActions.setAddress({
                    field: e.target.id,
                    value: e.target.checked,
                  })
                )
              }
            />
            <label className="form-check-label" htmlFor="defaultAddress">
              Set as default address
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100" style={{ backgroundColor: "#8a934f" }}
            data-bs-dismiss="modal"
            onClick={handleSaveAddress}
          >
            Save Address
          </button>
          {(loader || deleteAddressLoading) && <Loader />}
        </div>
      </div>) :
      addAddress ?
        (
          <div className="my-4">
            <div style={{ width: "40px", height: "40px", borderRadius: "50%" }}>
              <span className="shadow py-1" >
                <IoMdArrowRoundBack size={25} onClick={handleAddAddress} />
              </span>
            </div>
            {

              !isaddress && <h4 className="mb-4">Add Address</h4>
            }
            <div className="card p-4">
              <InputBox
                handleChange={handleChange}
                id="fullName"
                isRequired={true}
                placeholder="Full Name"
                type="text"
                value={address?.fullName}
              />
              <InputBox
                handleChange={handleChange}
                id="address"
                isRequired={true}
                placeholder="Address*"
                type="text"
                value={address?.address}
              />
              <InputBox
                handleChange={handleChange}
                id="addressType"
                isRequired={true}
                placeholder="Address Type*"
                type="text"
                value={address?.addressType}
              />
              <InputBox
                handleChange={handleChange}
                id="landMark"
                placeholder="Apartment/Suite etc. (optional)"
                type="text"
                value={address?.landMark}
              />
              <div className="row">
                <div className="col-md-6 mb-1">
                  <InputBox
                    handleChange={handlePincodeChange}
                    max={6}
                    isRequired={true}
                    placeholder="Pincode*"
                    type="number"
                    value={pincode}
                  />
                </div>
                <div className="col-md-6">
                  <InputBox
                    isRequired={true}
                    placeholder="City*"
                    type="text"
                    value={address?.city}
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
                    value={address?.state}
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
                    value={address?.country}
                  />
                </div>
              </div>

              <div className="mb-3 d-flex">
                <span className="input-group-text border-end-0 rounded-end-0 mb-3">
                  +91
                </span>

                <input
                  type="text"
                  className="form-control rounded-start-0 mb-3"
                  onChange={handleChange}
                  id="mobile"
                  placeholder="Phone Number"
                  value={address?.mobile}
                  required
                  maxLength={10}
                  onKeyDown={(e) => {
                    if (
                      !/[0-9]/.test(e.key) &&
                      e.key !== "Backspace" &&
                      e.key !== "Delete" &&
                      e.key !== "ArrowLeft" &&
                      e.key !== "ArrowRight"
                    ) {
                      e.preventDefault(); // block non-numeric keys
                    }
                  }}
                />
              </div>
              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="isDefault"
                  checked={address?.isDefault}
                  onChange={(e) =>
                    dispatch(
                      cartActions.setAddress({
                        field: e.target.id,
                        value: e.target.checked,
                      })
                    )
                  }
                />
                <label className="form-check-label" htmlFor="defaultAddress">
                  Set as default address
                </label>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100" style={{ backgroundColor: "#8a934f" }}
                data-bs-dismiss="modal"
                onClick={handleSaveAddress}
              >
                Save Address
              </button>
              {loader && <Loader />}
            </div>
          </div>) :
        (
          <div
            style={{ maxHeight: "600px", overflowY: "scroll", scrollbarWidth: "none" }}
            className="modal-body"
          >
            <div className=" d-flex justify-content-end my-3  ">
              <button onClick={handleAddAddress} className=" btn btn-outline-success">
                Add Address
              </button>
            </div>
            {getAddressResponce?.lstAddressData?.length ? getAddressResponce?.lstAddressData?.map((item, idx) => (
              // <div
              //   key={idx}
              //   className={" p-3 mb-3  border rounded shadow-sm address-cardmodal p-3 mb-3  border rounded shadow-sm"}
              //   style={{ cursor: "pointer" }}
              //   data-bs-dismiss="modal"
              //   aria-label="Close"
              // >
              //   <div className="address-left1">
              //     <strong className={" text-success "}>{item?.PersonName}</strong>&nbsp;
              //     <strong>{item?.PersonName}</strong>
              //     <p className="mainaddress mb-0 fs-6">
              //       {item?.Address} {item?.City}, <span>{item?.State}</span>{" "}
              //       <span>{item?.Country}</span>
              //       &nbsp;
              //       <span>{item?.Pincode}</span>
              //     </p>
              //     <p className="landmark mb-0 fs-6">{item?.Landmark}</p>
              //     {item.Email && (
              //       <p className="mb-0 fs-6">
              //         Email: <span>{item.Email}</span>
              //       </p>
              //     )}
              //     <p className="mb-0 fs-6">
              //       Phone: <span>{item?.AddressContactNo}</span>
              //     </p>
              //   </div>
              // </div>
              <AddressComp
                key={idx}
                handleDeleteAddress={handleDeleteAddress}
                item={item}
                address={item?.Address}
                name={item?.PersonName}
                city={item?.City}
                country={item?.Country}
                mobile={item?.AddressContactNo}
                pincode={item?.Pincode}
                state={item?.State}
                email={item?.Email}
                handleSaveAddress={handleSaveAddress}
                myAddressess={true}
                personame={item?.AddressType}
                handleDefaultAddress={handleDefaultAddress}
                loaderMakeDefault={loader}
              />
            ))
              : <ProductNotFound fromSupportTicket={true} altText="Friendly product-not-found illustration" />
            }

          </div>
        )
  );
};

export default AddAddress;
