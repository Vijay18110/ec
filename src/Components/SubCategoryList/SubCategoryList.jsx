import React, { useEffect } from "react";
import "./SubCategoryList.css";

import { Link, useLocation, useNavigate } from "react-router-dom";
import Slider from "../../ExternalLib/Carousel/Carousel";
import ApiEncryptDecrypt from "../../Utils/Encryption";
import { Key } from "../../Utils/Key";
import axiosInstance from "../../Utils/axiosInstance";
import { getWishlist } from "../../Utils/getWishlist";
import { wishlistActions } from "../../Redux/Slices/wishlistSlice";
import { toast } from "react-toastify";
import Loader from "../../ExternalLib/Loader/Loader";
import { uiAction } from "../../Redux/Slices/uiSlice";
import useApiRequest from "../../Hooks/apiReq";
import { useDispatch, useSelector } from "react-redux";
const CategoryCard = React.lazy(() => import("../../Shared/CategoryCard/CategoryCard"))
const ProductCard = React.lazy(() => import("../../Shared/ProductCard/ProductCard"))
const SectionTitle = React.lazy(() => import("../SectionTitle/SectionTitle"))
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
    slidesToSlide: 1,
  },
};
const responsive = {
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
const SubCategoryList = () => {
  const { search } = useLocation();
  const queryData = new URLSearchParams(search);
  const headerid = atob(queryData.get("id"));

  const {
    error: subCategoryError,
    loading: subCategoryLoading,
    response: subCategoryResponse,
    sendApiRequest: subCategorySendApiRequest,
  } = useApiRequest();
  const {
    error: ProductError,
    loading: ProductLoading,
    response: productResponce,
    sendApiRequest: productSendApiRequest,
  } = useApiRequest();
  const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const handleAddWishlist = async (productid) => {
    if (loggedInUser) {
      const encryptedData = await ApiEncryptDecrypt.encryptString(
        Key,
        JSON.stringify({
          CustomerId: loggedInUser?.CustomerId,
          ProductID: productid,
        })
      );
      const jsonData = { Body: encryptedData };
      let res;
      res = await axiosInstance.post("/AddCustomerWish", jsonData);

      const decryptedRes = await ApiEncryptDecrypt.decryptString(
        Key,
        res.data.body
      );
      const obj = JSON.parse(decryptedRes);
      if (obj.Status === 0) {
        const responce = await getWishlist();
        dispatch(
          wishlistActions.setWishlist(responce?.obj?.Response?.lstWishData)
        );
      }
      // Handle different status codes
      if (obj.Status === 1) {
        toast.error(obj.Message);
      }
      if (obj.Status === 3) {
        dispatch(uiAction.openModal())
      }
    } else {
      dispatch(uiAction.openModal())
    }
  };

  useEffect(() => {
    subCategorySendApiRequest("POST", "/GetSubGroupList", {
      GroupHeaderID: headerid,
    });
    productSendApiRequest("POST", "/GroupWiseProductList", {
      GroupHeaderID: headerid,
    });
  }, [headerid]);
  return (
    <>
      <div className="container-fluid my-4">
        <div className="row">
          <div className="col-lg-12">
            {subCategoryResponse?.lstSubGroup.length > 0 ? (
              <Slider responsive={responsive1} showDot="false">
                {subCategoryResponse?.lstSubGroup.length > 0 &&
                  subCategoryResponse?.lstSubGroup.map((ctg, index) => (
                    <CategoryCard
                      key={index}
                      img={ctg?.SubGroupThumbnail}
                      subname={ctg?.SubGroupName}
                      name={ctg?.GroupName}
                    />
                  ))}
              </Slider>
            ) : (
              <p className=" text-danger text-center">No Record Found:)</p>
            )}
          </div>
        </div>
      </div>
      <div className="shop-grid-sidebar-area">
        <div className="container-fluid">

          {productResponce?.lstGroupDetail
            .length > 0 && (
              <Slider responsive={responsive} showDot={"false"}>
                {productResponce?.lstGroupDetail
                  .map((item, index) => {
                    return (
                      <ProductCard
                        name={item?.ProductName}
                        img={item?.ProductThumbnail}
                        price={item.Price}
                        discount={item?.DiscountPercent}
                        mrp={item?.MRP}
                        subCatName={item?.SubGroupName}
                        cartdata={item}
                        handleAddWishlist={handleAddWishlist}
                      />
                    );
                  })}
              </Slider>
            )}
        </div>
      </div>

      <div className="products-discount">
        <div className="container-fluid">
          {productResponce?.lstGroupDetail
            .length > 0 && (
              <>
                <SectionTitle link={`subcategory-lists?id=${btoa(headerid)}`} title="Products on discount" />
                <Slider responsive={responsive} showDot={"false"}>
                  {productResponce?.lstGroupDetail
                    .map((item, index) => {
                      return (
                        <ProductCard
                          name={item?.ProductName}
                          img={item?.ProductThumbnail}
                          price={item.Price}
                          discount={item?.DiscountPercent}
                          mrp={item?.MRP}
                          subCatName={item?.SubGroupName}
                          cartdata={item}
                          handleAddWishlist={handleAddWishlist}
                        />
                      );
                    })}
                </Slider>
              </>
            )}
        </div>
        {/* {(subCategoryLoading || ProductLoading) && <Loader />} */}
      </div>
    </>
  );
};

export default SubCategoryList;
