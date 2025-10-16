import React, { useEffect, useRef, useState } from "react";
import useApiRequest from "../../Hooks/apiReq";
// import SectionTitle from "../../Components/SectionTitle/SectionTitle";
import ProductCard from "../../Shared/ProductCard/ProductCard";
import { getWishlist } from "../../Utils/getWishlist";
import { wishlistActions } from "../../Redux/Slices/wishlistSlice";
import innerBanner from "../../assets/Images/inner-banner.jpg";
import { toast } from "react-toastify";
import { Key } from "../../Utils/Key";
import ApiEncryptDecrypt from "../../Utils/Encryption";
import axiosInstance from "../../Utils/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { uiAction } from "../../Redux/Slices/uiSlice";
import Loader from "../../ExternalLib/Loader/Loader";
// import PriceRangeSlider from "./PricingRange/PricingRange";
// import DiscountRangeSlider from "./DiscountRange/DiscountRange";
// import { chatAction } from "../../Redux/Slices/chatSlice";
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from "react-icons/md";
import { useLocation } from "react-router-dom";
// import imgForNoProductsFound from "../../assets/Images/logo.png";

import ProductNotFound from "../../Components/ProductNotFound";
const ProductLists = () => {
  const { search } = useLocation();
  const searchData = new URLSearchParams(search);
  const id = atob(searchData.get("id"));
  const searching = searchData.get("search") && atob(searchData.get("search"));

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
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
        getresponce();
      }
      // Handle different status codes
      if (obj.Status === 1) {
        toast.error(obj.Message);
      }
      if (obj.Status === 3) {
        dispatch(uiAction.openModal());
      }
    } else {
      dispatch(uiAction.openModal());
    }
  };

  const getresponce = async () => {
    const responce = await getWishlist();
    dispatch(wishlistActions.setWishlist(responce?.obj?.Response?.lstWishData));
  };

  // dropdown data

  const {
    error: groupListError,
    loading: groupListLoading,
    response: groupListResponse,
    sendApiRequest: groupListSendApiRequest,
    status: groupListStatus,
  } = useApiRequest();
  const getgroupList = () => {
    groupListSendApiRequest("POST", "/GetGroupList", { DeviceType: "Web" });
  };
  const {
    error: subgroupListError,
    loading: subgroupListLoading,
    response: subgroupListResponse,
    sendApiRequest: subgroupListSendApiRequest,
    status: subgroupListStatus,
  } = useApiRequest();
  const getsubGroupList = (value) => {
    subgroupListSendApiRequest("POST", "/GetSubGroupList", {
      GroupHeaderID: value,
    });
  };
  useEffect(() => {
    getgroupList();
  }, []);
  const pricevalues = useSelector((state) => state.chatreducer.priceValues);
  const dicountRange = useSelector((state) => state.chatreducer.discountPrice);
  const [group, setGroup] = useState("");
  const [lastFilter, setPreviousFilter] = useState({});
  const [OpenSubGroup, setOpenSubGroup] = useState(id ? id : null);
  const [isOpen, setIsOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const handleSubmit = async (id, searching, val) => {
    try {
      setLoading(true);
      const newdata = {
        SearchParam: searching,
        CategoryId: "",
        SubCategoryId: "",
        GroupId: id || OpenSubGroup,
        SubGroupId: group,
        MaxAmount: pricevalues[0] > 0 ? pricevalues[0] : "",
        MinAmount: pricevalues[1] > 0 ? pricevalues[1] : "",
        MaxDiscount: dicountRange[0] > 0 ? dicountRange[0] : "",
        MinDiscount: dicountRange[1] > 0 ? dicountRange[1] : "",
      };
      // console.log(newdata);
      const encryptedData = await ApiEncryptDecrypt.encryptString(
        Key,
        JSON.stringify(newdata)
      );

      const jsonData = { Body: encryptedData };
      let res;
      res = await axiosInstance.post("/ProductsList", jsonData);
      const decryptedRes = await ApiEncryptDecrypt.decryptString(
        Key,
        res.data.body
      );
      const obj = JSON.parse(decryptedRes);
      if (obj.Status === 0) {
        setData(obj?.Response?.lstProduct);
      }
      if (obj.Status === 1) {
        toast.error(obj.Message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
    setPreviousFilter({ pricevalues, dicountRange, OpenSubGroup, group });
  };

  const [activeCategory, setActiveCategory] = useState(null);

  const categoryData = {
    Electronics: ["Mobiles", "Laptops", "Cameras"],
    Fashion: ["Men", "Women", "Kids"],
    Home: ["Furniture", "Kitchen", "Decor"],
  };

  const handleToggle = (category) => {
    setActiveCategory((prev) => (prev === category ? null : category));
  };
  const [isTrue, setIsTrue] = useState(false);
  const [flag, setFlag] = useState(false);
  const handleChecked = (e, ischeck) => {
    const { name, value } = e.target;
    setIsChecked(ischeck);
    setGroup(value);
    if (isChecked == ischeck) {
      setIsChecked(null);
      setGroup("");
      return;
    }
    if (!isTrue) {
      handleSubmit("", value);
    }
  };

  const handleOpenSubGroups = (headerId) => {
    if (headerId != 1) {
      setGroup("");
      setIsChecked(null);
    }
    getsubGroupList(headerId);
    setFlag(!flag);

    if (headerId != OpenSubGroup) {
      setIsOpen(true);
    } else {
      if (flag) {
        setTimeout(() => {
          setIsOpen(true);
        }, 200);
      } else {
        setIsOpen(false);
      }
    }
    setOpenSubGroup(headerId);
    handleSubmit(headerId, "");
  };
  // const handleChange = (id) => {
  //   handleSubmit(id);
  // };
  const debounceTimeout = useRef(null);
  useEffect(() => {
    // handleSubmit(id ? id : "", searching);
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      handleSubmit(id ? id : "", searching);
    }, 500);
    return () => clearTimeout(debounceTimeout.current);
  }, [dicountRange, pricevalues, id, searching]);
  useEffect(() => {
    if (id) {
      handleOpenSubGroups(id);
    }
  }, [id]);
  // console.log(data)
  return (
    <>
      <div className="page-heading" style={{
        backgroundImage: `url(${innerBanner})`,
        backgroundSize: "cover"
      }}>
        <div className="container">&nbsp;</div>
      </div>
      <div
        style={data?.length < 1 ? { marginBottom: "180px" } : { undefined }}
        className="container"
      >
        {/* {<SectionTitle title="Product Lists" desc="" />} */}
        {
          <div className="d-block d-sm-block d-xxl-flex d-xl-flex d-lg-flex d-md-flex justify-content-center ">
            <div className="row w-100">
              <div className="col-md-3 col-sm-3 col-xs-12">
                <div className="side-menu-wrapper"
                >
                  <div className="side-menu-title">Browse With Categories
                  </div>
                  <ul className="p-2">
                    {groupListResponse?.lstGroup.length > 0 &&
                      groupListResponse?.lstGroup.map((item, index) => (
                        <li
                          style={{ cursor: "pointer" }}
                          className="mb-1"
                          key={index}
                        >
                          <div
                            className="collapsed"
                            data-bs-toggle="collapse"
                            data-bs-target={`#${item?.GroupHeaderId}-started-collapse`}
                            aria-expanded={
                              subgroupListResponse?.lstSubGroup.length > 0
                                ? "true"
                                : "false"
                            }
                            onClick={() =>
                              handleOpenSubGroups(item?.GroupHeaderId)
                            }
                          >
                            <span>{item?.GroupName}</span>
                            <i>
                              {OpenSubGroup == item?.GroupHeaderId && isOpen ? (
                                <MdKeyboardArrowDown size={20} />
                              ) : (
                                <MdKeyboardArrowRight size={20} />
                              )}
                            </i>
                          </div>
                          {subgroupListResponse?.lstSubGroup.length > 0 && (
                            <div
                              className={
                                subgroupListResponse?.lstSubGroup.length > 0 &&
                                  subgroupListResponse?.lstSubGroup[0]
                                    .GroupHeaderId == item?.GroupHeaderId &&
                                  isOpen
                                  ? "collapse show"
                                  : "collapse"
                              }
                              id={`${item?.GroupHeaderId}-started-collapse`}
                            >
                              <ul className="ms-4 list-unstyled fw-normal pb-1 small">
                                {subgroupListResponse?.lstSubGroup.length > 0 &&
                                  subgroupListResponse?.lstSubGroup?.[0]
                                    ?.GroupHeaderId === OpenSubGroup &&
                                  subgroupListResponse?.lstSubGroup.map(
                                    (item, idx) => (
                                      <li key={idx} className="list-group-item">
                                        <input
                                          type="checkbox"
                                          onChange={(e) =>
                                            handleChecked(
                                              e,
                                              item?.SubGroupHeaderId
                                            )
                                          }
                                          checked={
                                            isChecked == item?.SubGroupHeaderId
                                              ? true
                                              : false
                                          }
                                          name="subgroup"
                                          id="shubgroup"
                                          value={item?.SubGroupHeaderId}
                                        />{" "}
                                        {item?.SubGroupName}
                                      </li>
                                    )
                                  )}
                              </ul>
                            </div>
                          )}
                        </li>
                      ))}
                  </ul>
                </div>

                <div class="side-menu-wrapper">
                  <div className="side-menu-title">
                    LATEST PRODUCTS
                  </div>
                  <div class="similar-products">

                    slider


                  </div>
                </div>


              </div>
              <div className="col-md-9 col-sm-9 col-xs-12">
                <div className="row">
                  <div className="col-md-3 col-sm-3 col-xs-6">
                    {data?.length > 0

                      ? data?.map((item, index) => {
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
                            rating={item.ProductRating}
                          />
                        );
                      })
                      : !loading && (
                        <div className="text-danger    text-center d-flex align-items-center justify-content-center w-100 ">
                          <ProductNotFound altText="Friendly product-not-found illustration" />
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
        {loading && <Loader />}
      </div>
    </>
  );
};

export default ProductLists;
