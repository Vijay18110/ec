import React, { useEffect } from "react";
import useApiRequest from "../../Hooks/apiReq";
import ProductCard from "../../Shared/ProductCard/ProductCard";
import SectionTitle from "../SectionTitle/SectionTitle";
import Slider from "../../ExternalLib/Carousel/Carousel";
const responsive1 = {
  desktop: {
    breakpoint: { max: 3000, min: 1424 },
    items: 6,
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
const LatestProducts = ({ handleAddWishlist, responsive, isFromProductList }) => {
  const { error, loading, response, sendApiRequest } = useApiRequest();
  useEffect(() => {
    sendApiRequest("POST", "/LatestProduct", {
      DeviceType: "Web",
    });
  }, []);
  return (
    <div className="container-fluid">
      {response?.lstLatestProduct.length > 0 && (
        !isFromProductList && <SectionTitle title="Latest Products" desc="" link="product-lists" />
      )}
      {response?.lstLatestProduct && (
        <Slider responsive={responsive ? responsive : responsive1} showDot={"false"}>
          {response?.lstLatestProduct.map((item, index) => {
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
  );
};

export default LatestProducts;
