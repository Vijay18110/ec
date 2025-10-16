import React from "react";
import './SecondDetailBanner.css'
const SecondDetailBanner = ({title,desc}) => {
  return (
    <>
      <div className="rts-contact-main-wrapper-banner .about-banner-area-bg bg_image">
        <div className="container">
          <div className="row">
            <div className="co-lg-12">
              <div className="contact-banner-content">
                <h1 className="title">{title}</h1>

                <p className="disc">
                  {desc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SecondDetailBanner;
