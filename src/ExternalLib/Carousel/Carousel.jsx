import React, { useEffect } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
const Slider = ({ children, showDot, banner }) => {

  const responsive1 = {
    desktop: {
      breakpoint: { max: 3000, min: 1424 },
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
    },
    laptop: {
      breakpoint: { max: 1424, min: 1024 },
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 768 },
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
    },
  };
  return (
    <>
      <Carousel
        swipeable={false}
        draggable={true}
        // showDots={showDot === "false" ? false : true}
        responsive={responsive1}
        ssr={true} // means to render carousel on server-side.
        infinite={true}
        autoPlaySpeed={2000}
        autoPlay={true}
        removeArrowOnDeviceType={["tablet", "mobile"]}
        dotListClass="custom-dot-list-style"
        itemClass="carousel-item-padding-40-px"

      >
        {children}
      </Carousel>

    </>
  );
};

export default Slider;
