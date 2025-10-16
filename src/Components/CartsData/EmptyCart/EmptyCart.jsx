import React from "react";
import Button from "../../../Shared/Button/Button";
import pic from "../../../assets/Images/emptycart.svg";
import styles from "./EmptyCart.module.css";
import { useNavigate } from "react-router-dom";
import { convertToINRFormat } from "../../../Utils/INRConvert";
const EmptyCart = () => {
  const navigate = useNavigate();
  const handleclick = () => {
    navigate("/home");
  };
  return (
    <>
      <div className={styles.emptycart}>
        <div className="fs-3 mb-4">My cart</div>
        <img loading="lazy" className="pt-8" src={pic} />
        <p className=" fw-bold fs-2 py-3 md:text-3xl">Your cart is empty</p>
        <p className="pt-0 color-[#090909b3]">
          {" "}
          <span className="font-extrabold mt-0">Add more products </span>{" "}
          {/* <span className="font-light">
            worth <span className="rupee-symbol"></span> */}
            {/* <strong>{convertToINRFormat(1000)}</strong> to get free delivery{" "} */}
          {/* </span> */}
        </p>
        <Button click={handleclick} children="Shop Now" />
      </div>
    </>
  );
};

export default EmptyCart;
