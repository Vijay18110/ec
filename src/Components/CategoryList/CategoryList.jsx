

import React, { useEffect } from "react";
import CategoryCard from "../../Shared/CategoryCard/CategoryCard";
import useApiRequest from "../../Hooks/apiReq";
import Slider from "../../ExternalLib/Carousel/Carousel";
import CategoryImg from "../../assets/Images/HW.webp";

import { Link, useNavigate } from "react-router-dom";
import { categories } from "../../StaticData/CategoriesList";
const responsive1 = {
  desktop: {
    breakpoint: { max: 3000, min: 1300 },
    items: 6,
    slidesToSlide: 1, // optional, default to 1.
  },
  laptop: {
    breakpoint: { max: 1300, min: 1024 },
    items: 4,
    slidesToSlide: 1, // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 3,
    slidesToSlide: 1, // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 2,
    slidesToSlide: 1, // optional, default to 1.
  },
};
const CategoryList = ({ response }) => {
  const navigate = useNavigate();
  const handleHeaderId = (id) => {
    navigate(`/product-lists?id=${btoa(id)}`);
  };
  // console.log("categoryList", response)
  return (
    // <div className="container-fluid">
    //   <div className="row">
    //     <div className="col-lg-12">
    //       {response?.lstGroup && <Slider responsive={responsive1} showDot="false">
    //         {response?.lstGroup && (
    //           response?.lstGroup.length > 0 &&
    //           response?.lstGroup.map((ctg, index) => (
    //             <CategoryCard
    //               key={index}
    //               img={ctg?.GroupThumbnail}
    //               handleClick={handleHeaderId}
    //               id={ctg?.GroupHeaderId}
    //               name={ctg?.GroupName}
    //             />
    //           ))
    //         )}
    //       </Slider>}
    //     </div>
    //   </div>
    // </div>
    <div className="shop-categories">
      <div className="container-fluid">
        <div className="categories-bg">
          {
            response?.lstCategory && response?.lstCategory?.length > 0 &&
            response?.lstCategory?.map((cat, index) =>
            (
              <div className="categories-list" key={index}>
                <div className="cate-thumb" onClick={() => handleHeaderId(cat?.CategoryID)}>
                  <Link>
                    <img loading="lazy" src={cat?.CategoryImage} alt="" /></Link>
                </div>
              </div>
            )
            )}
        </div>
      </div>
    </div>
  );
};

export default CategoryList;
