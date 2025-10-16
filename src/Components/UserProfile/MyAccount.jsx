import React from "react";
import InputBox from "../../Widgets/InputBox/InputBox";
import { uiAction } from "../../Redux/Slices/uiSlice";
import { useDispatch, useSelector } from "react-redux";

const MyAccount = ({pincode,handlePincodeChange,handleSaveDetails}) => {
    const dispatch = useDispatch()
    const handleChange = (e) => {
        const { id, value } = e.target;
    
        dispatch(uiAction.setCustomer({ field: id, value }))
      };
    const customer = useSelector(state => state.uireducer.customer)
  return (
    <>
      <div className="">
        <h4 className="mb-4">My Account</h4>
        <div className="card p-4">
          <div className="row">
            <div className="col-lg-6">
        <div class="input-group flex-nowrap mb-3">
          <select class="input-group-text" onChange={handleChange} id="solutation">
           <option value="Mr.">Mr.</option>
           <option value="Mss.">Mss.</option>
          </select>
          <input
            type="text"
            class="form-control"
            id="fullName"
            onChange={handleChange}
            value={customer.fullName}
            placeholder="Full Name"
            aria-label="Username"
            aria-describedby="solutation"
          />
        </div>
        </div>
        <div className="col-lg-6">
        <div class="input-group flex-nowrap ">
          <span class="input-group-text mb-3" id="addon-wrapping">
          +91
          </span>
          <input
            type="text"
            class="form-control mb-3"
            id="mobile"
            value={customer.mobile}
            onChange={handleChange}
            placeholder="Mobile Number"
            aria-label="Username"
            aria-describedby="addon-wrapping"
          />
        </div>
        </div>
         <div className="col-lg-6 mb-3">
        <InputBox
            handleChange={handleChange}
          id="email"
          isRequired={true}
          placeholder="Email*"
          type="email"
            value={customer?.email}
        />
</div>
<div className="col-lg-6 mb-3">
        <InputBox
            handleChange={handleChange}
          id="address"
          isRequired={true}
          placeholder="Address*"
          type="text"
            value={customer?.address}
        />
</div>
   
          <div className="col-md-6 mb-3">
            <InputBox
                handleChange={handlePincodeChange}
              maxLe="6"
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
                value={customer?.city}
              isReadonly={true}
            />
          </div>
      

          <div className="col-md-6 mb-3">
            <InputBox
              id="state"
              isRequired={true}
              isReadonly={true}
              placeholder="state*"
              type="text"
              value={customer?.state}
            />
          </div>
          <div className="col-md-6 mb-3">
            <InputBox
                handleChange={handleChange}
              id="country"
              isRequired={true}
              isReadonly={true}
              placeholder="Country*"
              type="text"
                value={customer?.country}
            />
          </div>
       

       <div className="col-lg-12">

        <button
          type="submit"
          className="btn text-white w-100"
          style={{backgroundColor:"rgb(89, 117, 69)"}}
            onClick={handleSaveDetails}
        >
          Save Changes
        </button>
        </div>
      </div>
      </div>
      </div>
    </>
  );
};

export default MyAccount;
