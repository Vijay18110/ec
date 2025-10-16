import React from "react";
import SectionTitle from "../SectionTitle/SectionTitle";
import ProductCard from "../../Shared/ProductCard/ProductCard";
import Slider from "../../ExternalLib/Carousel/Carousel";

const WealthSupply = ({response,handleAddWishlist}) => {
  const responsive1 = {
    desktop: {
      breakpoint: { max: 3000, min: 1424 },
      items: 4,
      slidesToSlide: 1, // optional, default to 1.
    },
    laptop: {
      breakpoint: { max: 1424, min: 1024 },
      items: 3,
      slidesToSlide: 1, // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
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
      <div className="container">
        <SectionTitle title="Health & Wellness Supplies" link="health-and-wellness-supply" />
        {response?.lstProductCategory && (
          <Slider responsive={responsive1} showDot={"false"}>
          {response?.lstProductCategory.map((item, index) => {
            return (
              <ProductCard
                mrp={item.MRP}
                discount={item.DiscountPercent}
                price={item.Price}
                img={item.ProductThumbnail}
                name={item.ProductName}
                subCatName={item.SubCategoryName}
                cartdata={item}
                handleAddWishlist={handleAddWishlist}
              />
            );
          })}
        </Slider>
        )}
      </div>
    </>
  );
};

export default WealthSupply;
