import React from "react";

const ComboProduct = ({ item }) => {
  return (
    <>
      <div className="combo-list" >
        <div className="combo-list2">
          <div className="combo-list3">
            <div className="axil-product">
              <div className="thumbnail">
                <img loading="lazy" src={item?.ProductThumbnail} alt="RAV organics" />
              </div>
              <div className="product-content">
                <div className="inner">
                  <a href="javascript:void(0);">
                    <strong title="Sundara Black &amp; Red Flower Stud Earring">
                      {item?.ProductName}
                    </strong>
                  </a>
                  <div className="product-price-variant">
                    <span className="price current-price">
                      ₹{parseInt(item?.Price)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="axil-product">
              <div className="thumbnail">
                <img loading="lazy" src={item?.ProductThumbnail} alt="RAV organics" />
              </div>
              <div className="product-content">
                <div className="inner">
                  <a href="javascript:void(0);">
                    <strong title="Sundara Black &amp; Red Flower Stud Earring">
                      {item?.ProductName}
                    </strong>
                  </a>
                  <div className="product-price-variant">
                    <span className="price current-price">
                      ₹{parseInt(item?.Price)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="product-price-variant variant">
            <span className="price current-price1">
              ₹{parseInt(item?.Price) * 2}
            </span>
            <span className="price old-price">₹{parseInt(item?.MRP) * 2}</span>{" "}
            <span className="price save">
              Save ₹{parseInt(item?.MRP) * 2 - parseInt(item?.Price) * 2}
            </span>
            <div className="addbtn">
              <button type="button" className="btn">
                Add to cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ComboProduct;
