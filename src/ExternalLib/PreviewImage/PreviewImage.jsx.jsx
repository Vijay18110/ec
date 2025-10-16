
import noimage from "../../assets/Images/noimage.avif";


import { useState, useMemo, useEffect } from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

import { FaTimesCircle, FaFilePdf } from "react-icons/fa";

export default function PreviewImage({
  imgurl,
  thumnail,
  style,
  imgwithUrl,
  w,
  rounded,
  handleRemoveReivew,
  isPreview,
  filetype, pdfHeight,
  className,
  onMouseOut, onMouseOver, ratio
}) {
  const [isError, setIsError] = useState(false);

  // 1) reset error whenever source changes
  useEffect(() => {
    setIsError(false);
  }, [imgwithUrl, isPreview]);

  // 2) optionally pre-validate the image URL (prevents transient onError)
  useEffect(() => {
    const candidate = isPreview || imgwithUrl;
    if (!candidate) { setIsError(true); return; }
    if (filetype === "application/pdf" || String(candidate).toLowerCase().endsWith(".pdf")) {
      setIsError(false);
      return; // handled by PDF branch
    }
    let alive = true;
    const img = new Image();
    img.onload = () => alive && setIsError(false);
    img.onerror = () => alive && setIsError(true);
    img.src = candidate;
    return () => { alive = false; };
  }, [imgwithUrl, isPreview, filetype]);

  const isPdf = useMemo(() => {
    if (filetype === "application/pdf") return true;
    return typeof imgwithUrl === "string" && imgwithUrl.toLowerCase().endsWith(".pdf");
  }, [filetype, imgwithUrl]);
  const imageSrc = useMemo(() => {
    if (isPdf) return null; // handled separately
    if (isPreview) return isPreview; // preview mode
    return imgwithUrl; // normal mode
  }, [isPdf, isPreview, imgwithUrl]);

  // Final src for <img>
  const finalSrc = isError ? noimage : imageSrc;
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {isPreview && (
        <button
          type="button"
          onClick={() => handleRemoveReivew?.(imgurl)}
          style={{ position: "absolute", top: 0, right: 0, background: "transparent", border: "none", cursor: "pointer", zIndex: 2 }}
        >
          <FaTimesCircle size={18} color="red" />
        </button>
      )}

      {isPdf ? (
        <a
          href={imgwithUrl}
          target="_blank"

          rel="noopener noreferrer"
          style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", textDecoration: "none", color: "red", marginTop: 5, border: "1px dashed green", padding: "2px 12px", borderRadius: 6, cursor: "pointer", height: pdfHeight }}
        >
          <FaFilePdf size={60} className="mt-1" />
          <span className=" headingColor" style={{ fontSize: "0.80rem" }}>View PDF</span>
        </a>
      ) : (
        <PhotoProvider>
          <PhotoView src={imageSrc}>
            <img
              style={style || {
                aspectRatio: `${ratio ? "2" : "1"}/1`,
                objectFit: "cover",
                borderRadius: rounded ? "50%" : 6,
                marginTop: "5px",
                cursor: "pointer",
                transition: "transform 0.3s ease",
              }}
              loading="lazy"
              width={w || 100}
              className={thumnail ? "img-thumbnail" : className ? className : undefined}
              src={finalSrc}
              alt="preview"
              title="Click To View"
              onMouseOut={onMouseOut}
              onMouseOver={onMouseOver}
              onError={() => setIsError(true)}
            />
          </PhotoView>
        </PhotoProvider>
      )}
    </div>
  );
}
