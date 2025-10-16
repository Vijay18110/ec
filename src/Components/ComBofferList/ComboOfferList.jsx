

import React, { useEffect } from "react";
import useApiRequest from "../../Hooks/apiReq";
import ProductCard from "../../Shared/ProductCard/ProductCard";
import { Link } from "react-router-dom";
import SectionTitle from "../SectionTitle/SectionTitle";
import Slider from "../../ExternalLib/Carousel/Carousel";
import comboImg from '../../assets/Images/mindful-img1.jpg'
import ComboProductCard from "./ComboProductCard";
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
const ComboList = ({ handleAddWishlist, response }) => {

    return (
        <div className="container-fluid">
          {response?.lstComboOffer?.length>0 &&  <SectionTitle title="Combo Offers" desc=""  />}
            {response?.lstComboOffer?.length>0 && (
                <Slider responsive={responsive1} showDot={"false"}>
                    {response?.lstComboOffer?.map((offer) => (
                        <ComboProductCard  cartdata={offer} />
                    ))}
                </Slider>
            )}
        </div>
    );
};

export default ComboList;
