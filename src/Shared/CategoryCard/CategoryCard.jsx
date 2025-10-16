import React from "react";
import styles from "./categoryCard.module.css";
const CategoryCard = ({ name, img, id, handleClick, subname }) => {
  return (
    <>
      <div
        className={styles.class_caregory_are}
        onClick={() => handleClick(id)}
      >
        <img loading="lazy"
          className=" img-thumbnail"
          src={img}
          alt="RAV organics"
        />
      </div>
      <span className="d-flex justify-content-center w-100">{name}</span>
      {subname && <span className="d-flex justify-content-center w-100">{subname}</span>}
    </>
  );
};
export default CategoryCard;
