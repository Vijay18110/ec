import React from "react";
import SectionTitle from "../../SectionTitle/SectionTitle";
import ProductCard from "../../../Shared/ProductCard/ProductCard";
import Slider from "../../../ExternalLib/Carousel/Carousel";
const SimilarProduct = ({ similarProductResponce }) => {
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
        {similarProductResponce?.lstProduct.length > 0 && (
          <SectionTitle title="Similar Products" Link={true} />
        )}
        {similarProductResponce?.lstProduct && (
          <Slider responsive={responsive1} showDot={"false"}>
            {similarProductResponce?.lstProduct?.map((item) => {
              return (
                <ProductCard
                  cartdata={item}
                  name={item.ProductName}
                  price={item.Price}
                  subCatName={item?.SubCategoryName}
                  mrp={item.MRP}
                  discount={item.DiscountPercent}
                  img={item.ProductThumbnail}
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

export default SimilarProduct;
