import React, { useState } from "react";
import styles from "./CartSlider.module.css";
import { IoTrashSharp } from "react-icons/io5";
import offerpic from "../../assets/offerpic.png";
import info from "../../assets/info.webp";
import PreviewImage from "../../ExternalLib/PreviewImage/PreviewImage.jsx";
import { imageBaseURL } from "../../Utils/ImageBaseURL.js";
const CartSliderCart = ({
  img,
  title,
  price,
  mrp,
  offer,
  item,
  quantity,
  handleDeleteProduct,
}) => {
  return (
    <>
      <div className={styles.wishlistcart}>
        <div
          style={{ position: "relative" }}
          className={styles.wishlistimgcontainer}
        >
          {(item?.OfferId !== "0" || !item?.OfferId) &&
            item?.OfferId != item.ProductId && (
              <div
                style={{ left: "60%" }}
                className="offertag position-absolute "
              >
                <img style={{ width: "100%" }} src={offerpic} alt="offerpic" />
              </div>
            )}
          <img src={`${imageBaseURL}/ResizeImageFromUrl?imageName=${img}&&height=${312}&&q=${100}&&width=${312}`} alt="wishlistimg" />
        </div>
        <div className={styles.wishlistcontentcontainer}>
          <h5 className={styles.title}>{title}</h5>
          {mrp != price && (
            <>
              MRP :<span className={styles.previous}> ₹{mrp}</span>&nbsp;&nbsp;
            </>
          )}
          <span className={styles.current}>₹{price}</span>


          {mrp == price && <>&nbsp;&nbsp; <span>Qty : {quantity}</span></>}
          {mrp != price && (
            <p className={styles.offerprice}>
              <span>Qty : {quantity}</span> &nbsp;&nbsp;
              <span className="text-success">Discount {offer} % OFF</span>
            </p>
          )}
          {(item?.OfferId !== "0" || !item?.OfferId) &&
            item?.OfferId != item.ProductId && (
              <span className={styles.offerprice}>
                {(item?.OfferId !== "0" || !item?.OfferId) &&
                  item?.OfferId != item.ProductId && (
                    <div className="price-list ">
                      <span className="line-item pe-2 fw-bold">
                        {item?.OfferName}
                      </span>
                      <PreviewImage
                        style={{
                          height: "20px",
                          maxWidth: "20px",
                          borderRadius: "50%",
                        }}
                        newPic={info}
                        imgwithUrl={`https://api.ravorganics.com/api/ImageMengement/ResizeOfferImageFromUrl?imageName=${item?.OfferImage}&&height=${600}&&q=${100}&&width=${600}`}
                      />
                    </div>
                  )}
              </span>
            )}
        </div>
        <div className={styles.wishlistdeletebutton}>
          <i
            className="fa-solid text-danger d-inline-block p-2 ms-1 bg-danger-subtle border rounded fa-trash-can"
            onClick={() => handleDeleteProduct(item)}
          ></i>
        </div>
      </div>
    </>
  );
};

export default CartSliderCart;
