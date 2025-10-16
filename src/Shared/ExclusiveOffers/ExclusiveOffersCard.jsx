import React from "react";
import ExclusiveOffers from "../../assets/Images/immunity-boosting.jpg";
import styles from "./Exclusive.module.css";
const ExclusiveOffersCard = () => {
  return (
    <div className={styles.class_exclusive_img}>
      <img
        loading="lazy"
        className="hover-img"
        src={ExclusiveOffers}
        alt="RAV organics"
      />
    </div>
  );
};
export default ExclusiveOffersCard;
