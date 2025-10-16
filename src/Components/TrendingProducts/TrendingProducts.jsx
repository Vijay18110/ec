import React, { lazy, useEffect } from "react";
import useApiRequest from "../../Hooks/apiReq";
import ProductCard from "../../Shared/ProductCard/ProductCard";
import { Link } from "react-router-dom";
import SectionTitle from "../SectionTitle/SectionTitle";
// import Slider from "../../ExternalLib/Carousel/Carousel";
const Slider = lazy(() => import("../../ExternalLib/Carousel/Carousel"));
const responsive1 = {
  desktop: {
    breakpoint: { max: 3000, min: 1424 },
    items: 5,
    slidesToSlide: 1, // optional, default to 1.
  },
  laptop: {
    breakpoint: { max: 1424, min: 1024 },
    items: 4,
    slidesToSlide: 1, // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 768 },
    items: 3,
    slidesToSlide: 1, // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1, // optional, default to 1.
  },
};
const TrendingProducts = ({ handleAddWishlist, title, response, id }) => {
  return (
    <div className="container">
      {response?.length > 0 && (
        <SectionTitle
          title={title}
          desc=""
          link="product-lists"
          id={id}
        />
      )}
      {response?.length && (
        <Slider responsive={responsive1} showDot={"false"}>
          {response.map((item, index) => {
            return (
              <ProductCard
                key={index}
                mrp={item.MRP}
                discount={item.DiscountPercent}
                price={item.Price}
                img={item.ProductThumbnail}
                name={item.ProductName}
                cartdata={item}
                subCatName={item.SubCategoryName}
                handleAddWishlist={handleAddWishlist}
                rating={item?.ProductRating}
              />
            );
          })}
        </Slider>
      )
      }
    </div>
  );
};

export default TrendingProducts;
