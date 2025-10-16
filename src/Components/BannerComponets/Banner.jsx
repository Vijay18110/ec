import React from "react";
import "./Banner.css";

const Banner = ({ image, title, subtitle, buttonText, onButtonClick }) => {
    return (
        <div
            className="banner-container"
            style={{
                backgroundImage: `url(${image})`,
            }}
        >
            {title || subtitle || buttonText && <div className="banner-overlay">
                {title && <h1 className="banner-title">{title}</h1>}
                {subtitle && <p className="banner-subtitle">{subtitle}</p>}
                {buttonText && (
                    <button className="banner-btn" onClick={onButtonClick}>
                        {buttonText}
                    </button>
                )}
            </div>}
        </div>
    );
};

export default Banner;
