import React from "react";
import './DetailBanner.css'
const DetailBanner = ({title}) => {
  return (
    <>
      <div className="privacy-policy bg_image">
        <div className="container">
          <div className="row">
            <div className="co-lg-12">
              <div className="contact-banner-content">
                <h1 className="title">{title}</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailBanner;
