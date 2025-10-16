import React from "react";
import styles from "./WishlistCart.module.css";
import { IoTrashSharp } from "react-icons/io5";
import { imageBaseURL } from "../../../Utils/ImageBaseURL";
const WishlistCart = ({
  img,
  title,
  price,
  mrp,
  offer,
  handleMoveTocart,
  handleDeleteWishlists,
  item,
}) => {
  return (
    <>
      <div className={styles.wishlistcart}>
        <div className={styles.wishlistimgcontainer}>
          <img src={`${imageBaseURL}/ResizeImageFromUrl?imageName=${img}&&height=${412}&&q=${100}&&width=${412}`} alt="wishlistimg" />
        </div>
        <div className={styles.wishlistcontentcontainer}>
          <h5 className={styles.title}>{title}</h5>
          MRP :<span className={styles.previous}> ₹{mrp}</span>&nbsp;&nbsp;
          <span className={styles.current}>₹{price}</span>
          <p className={styles.offerprice}>{offer} % OFF</p>
          {item?.IsCommingSoon !== "True" && (
            <button
              onClick={() => handleMoveTocart(item)}
              className={styles.sliderbutton}
            >
              Move to cart
            </button>
          )}
        </div>
        <div className={styles.wishlistdeletebutton}>
          <i onClick={() => handleDeleteWishlists(item.ProductId)}>
            <IoTrashSharp size={25} color="red" />
          </i>
        </div>
      </div>
    </>
  );
};

export default WishlistCart;
