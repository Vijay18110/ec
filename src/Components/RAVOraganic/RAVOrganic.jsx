import React from "react";
import ProductCard from "../../Shared/ProductCard/ProductCard";
import SectionTitle from "../SectionTitle/SectionTitle";
import Slider from "../../ExternalLib/Carousel/Carousel";

const RAVOrganic = ({ response, handleAddWishlist }) => {
  const responsive1 = {
    desktop: {
      breakpoint: { max: 3000, min: 1424 },
      items: 5,
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
  console.log(response)
  return (
    <>
      <div className="container">
        {response?.lstProductCategory.length > 0 && (
          <SectionTitle
            title="RAV Organics"
            link={`product-lists`}
          />
        )}
        {response?.lstProductCategory.length > 0 && (
          <Slider responsive={responsive1} showDot={"false"} >
            {response?.lstProductCategory.map((item, index) => {
              return (
                <ProductCard
                  key={index}
                  mrp={item.MRP}
                  discount={item.DiscountPercent}
                  price={item.Price}
                  img={item.ProductThumbnail}
                  name={item.ProductName}
                  subCatName={item.SubCategoryName}
                  cartdata={item}
                  handleAddWishlist={handleAddWishlist}
                  rating={item?.ProductRating}
                />
              );
            })}
          </Slider>
        )}
      </div>
    </>
  );
};

export default RAVOrganic;
