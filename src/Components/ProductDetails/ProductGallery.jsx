// import React, { useState, useEffect } from "react";
// import InnerImageZoom from "react-inner-image-zoom";
// import "../../../node_modules/react-inner-image-zoom/lib/styles.min.css";
// export default function ProductGallery({ images }) {
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [activeImage, setActiveImage] = useState(images[0]);
//   // 🔁 Auto image switch every 5 seconds
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setActiveIndex((prev) => {
//         const nextIndex = (prev + 1) % images.length;
//         setActiveImage(images[nextIndex]);
//         return nextIndex;
//       });
//     }, 5000);
//     return () => clearInterval(interval);
//   }, []);
//   return (
//     <div className="IMGZOOMCONT">
//       <div style={{ marginRight: "10px" }}

//       >
//         {images.map((img, i) => (
//           <img
//             key={i}
//             src={img}
//             alt=""
//             onClick={() => {
//               setActiveIndex(i);
//               setActiveImage(img);
//             }}
//             style={{
//               width: 60,
//               cursor: "pointer",
//               height: 60,
//               marginBottom: 8,
//               border:
//                 i === activeIndex ? "2px solid #597546" : "1px solid #ccc",
//             }}
//           />
//         ))}
//       </div>
//       <div style={{ width: 500 }}>
//         <InnerImageZoom
//           src={activeImage}
//           zoomSrc={activeImage}
//           zoomType="hover"
//           zoomScale={1.5}
//           zoomPreload={true}
//           hasSpacer={true}
//           width={600}
//           height={400}
//           fadeDuration={200}
//           hideHint={true}
//         />
//       </div>
//     </div>
//   );
// // }
// import React, { useState, useEffect, useRef } from "react";
// import InnerImageZoom from "react-inner-image-zoom";
// import "../../../node_modules/react-inner-image-zoom/lib/styles.min.css";

// export default function ProductGallery({ images }) {
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [activeImage, setActiveImage] = useState(images[0]);
//   const intervalRef = useRef(null);
//   const isZoomingRef = useRef(false);

//   // ✅ Auto image switch function
//   const startInterval = () => {
//     intervalRef.current = setInterval(() => {
//       if (!isZoomingRef.current) {
//         setActiveIndex((prev) => {
//           const nextIndex = (prev + 1) % images.length;
//           setActiveImage(images[nextIndex]);
//           return nextIndex;
//         });
//       }
//     }, 5000);
//   };

//   const stopInterval = () => clearInterval(intervalRef.current);

//   // ✅ Start interval on mount
//   useEffect(() => {
//     startInterval();
//     return stopInterval; // Clean up on unmount
//   }, []);

//   return (
//     <div className="IMGZOOMCONT" style={{ display: "flex" }}>
//       <div style={{ marginRight: "10px" }}>
//         {images.map((img, i) => (
//           <img
//             key={i}
//             src={img}
//             alt=""
//             onClick={() => {
//               setActiveIndex(i);
//               setActiveImage(img);
//             }}
//             style={{
//               width: 60,
//               cursor: "pointer",
//               height: 60,
//               marginBottom: 8,
//               border:
//                 i === activeIndex ? "2px solid #597546" : "1px solid #ccc",
//             }}
//           />
//         ))}
//       </div>
//       <div
//         style={{ width: 500 }}
//         onMouseEnter={() => {
//           isZoomingRef.current = true;
//           stopInterval(); // 🛑 Pause auto-change
//         }}
//         onMouseLeave={() => {
//           isZoomingRef.current = false;
//           startInterval(); // 🔁 Resume auto-change
//         }}
//       >
//         <InnerImageZoom
//           src={activeImage}
//           zoomSrc={activeImage}
//           zoomType="hover"
//           zoomScale={1.5}
//           zoomPreload={true}
//           hasSpacer={true}
//           width={600}
//           height={400}
//           fadeDuration={200}
//           hideHint={true}
//         />
//       </div>
//     </div>
//   );
// }
import React, { useState, useEffect, useRef } from "react";
import InnerImageZoom from "react-inner-image-zoom";
import "../../../node_modules/react-inner-image-zoom/lib/styles.min.css";
export default function ProductGallery({ images, style }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef(null);
  const isZoomingRef = useRef(false);
  const activeImage = images[activeIndex];
  // 🔁 Start auto image slide
  const startAutoSlide = () => {
    intervalRef.current = setInterval(() => {
      if (!isZoomingRef.current) {
        setActiveIndex((prev) => (prev + 1) % images.length);
      }
    }, 5000);
  };
  const stopAutoSlide = () => {
    clearInterval(intervalRef.current);
  };
  useEffect(() => {
    startAutoSlide();
    return stopAutoSlide;
  }, []);
  return (
    <div className="IMGZOOMCONT" style={{ display: "flex" }}>
      {/* Thumbnail list */}
      <div style={{ marginRight: "12px", maxHeight: "600px", overflow: "scroll", scrollbarWidth: "none", msOverflowStyle: "none", padding: "25px", maxWidth: "500px" }}>
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt=""
            onClick={() => setActiveIndex(i)}
            style={{
              width: 100,
              height: 100,
              objectFit: "cover",
              marginBottom: 8,
              cursor: "pointer",
              border: i === activeIndex ? "2px solid #8a934f" : "1px solid #ccc",
              borderRadius: 4,
              ...style
            }}
          />
        ))}
      </div>
      {/* Zoom Image Viewer */}
      <div
        style={{ maxWidth: 600, maxHeight: 600 }}
        onMouseEnter={() => {
          isZoomingRef.current = true;
          stopAutoSlide();
        }}
        onMouseLeave={() => {
          isZoomingRef.current = false;
          startAutoSlide();
        }}
      >
        <InnerImageZoom
          src={activeImage}
          zoomSrc={activeImage} // use higher-res if available
          zoomType="hover"
          zoomScale={1.5}
          hideHint
          zoomPreload
          hasSpacer
          style={{ width: "100%", objectFit: "contain", borderRadius: 8, }}
        />
      </div>
    </div>
  );
}

