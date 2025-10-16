import React, { useRef, useState } from "react";
import "./ImageZoom.css";
import comboImg from "../../assets/nofound.jpg";

function AppWithZoomCustomization({ img, previewImg }) {
    const [isError, setIsError] = useState(false);
    const handleDefault = () => {
      setIsError(true);
    };
  const imgRef = useRef();
  const zoomRef = useRef();
  const [showZoom, setShowZoom] = useState(false);

  const handleMouseMove = (e) => {
    const img = imgRef.current;
    const zoom = zoomRef.current;
    const rect = img.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xPercent = (x / img.offsetWidth) * 100;
    const yPercent = (y / img.offsetHeight) * 100;

    // Move zoom background
    zoom.style.backgroundPosition = `${xPercent??0}% ${yPercent??0}%`;
  };
  return (
    <div className="zoom-wrapper">
      <div
        className="zoom-img-container"
        onMouseEnter={() => setShowZoom(true)}
        onMouseLeave={() => setShowZoom(false)}
        onMouseMove={handleMouseMove}
      >
        <img loading="lazy"
          ref={imgRef}
          src={isError?comboImg:img}
          onError={handleDefault}
          alt="Zoomable"
          className="main-img"
          style={{cursor:"crosshair"}}
        />
      </div>

      {showZoom && (
        <div
          ref={zoomRef}
          className="zoom-box"
          style={{ backgroundImage: `url(${previewImg})` }}
        />
      )}
    </div>
  );
}

function ImageZoomer({ img, previewImg }) {
  return <AppWithZoomCustomization img={img}  previewImg={previewImg} />;
}
export default ImageZoomer;
