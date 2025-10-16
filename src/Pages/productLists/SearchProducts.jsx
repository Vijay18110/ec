import React, { useEffect, useRef, useState } from "react";
import useApiRequest from "../../Hooks/apiReq";
import SectionTitle from "../../Components/SectionTitle/SectionTitle";
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
// import { MdKeyboardArrowDown, MdKeyboardArrowRight } from "react-icons/md";
import { useLocation } from "react-router-dom";
import imgForNoProductsFound from "../../assets/Images/logo.png";
// import { VirtuosoGrid } from "react-virtuoso";
import ProductNotFound from "../../Components/ProductNotFound";
import LatestProducts from "../../Components/LatestProducts/LatestProducts";
// import LazyProductCard from "../../Widgets/LazyProductCard";
// import { categories } from "../../StaticData/CategoriesList";
import useWindowWidth from "../../Hooks/useWindowWidth";
const responsive = {
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
const SearchProducts = () => {
    const width = useWindowWidth()
    const { search } = useLocation();
    const searchData = new URLSearchParams(search);
    let searchId = atob(searchData.get("id"));
    const [id, setID] = useState(searchId ? searchId : "")
    const debounceRef = useRef();
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
    const [banner, setBanner] = useState({});
    // const [width, setWidth] = useState(window.innerWidth);
    // const handleResize = () => {
    //   setWidth(window.innerWidth);
    // };

    // window.addEventListener("resize", handleResize);
    const getresponce = async () => {
        const responce = await getWishlist();
        dispatch(wishlistActions.setWishlist(responce?.obj?.Response?.lstWishData));
    };
    // dropdown data
    const {
        error: groupListError,
        loading: groupListLoading,
        response: responce,
        sendApiRequest: groupListSendApiRequest,
        status: groupListStatus,
    } = useApiRequest();
    const {
        error: SubCatError,
        loading: SubCatLoading,
        response: SubCatRes,
        sendApiRequest: SubCatesendApiRequest,
        status: SubCatStatus,
    } = useApiRequest();
    const getCategoryList = (categoryID) => {
        // alert(categoryID)
        groupListSendApiRequest("POST", "/GetCategoryList", { DeviceType: "Web" }, {
            onSuccess: (res) => {
                // console.log("categories", res);
                setBanner((pre) => {
                    const ctg = res?.lstCategory.find((category, index) => category?.CategoryID === (categoryID || id))
                    // console.log(ctg)
                    return { bannerWeb: ctg?.CategoryBannerImage, bannerApp: ctg?.MobileCategoryBannerImage }
                })
            }
        });
    };
    const getSubCategoryList = (categoryID) => {
        SubCatesendApiRequest("POST", "/GetSubCategoryList", { CategoryId: categoryID || id }, {
            onSuccess: (res) => {
                // console.log("SubCategories", res);
            }
        });
    };
    const {
        error: PError,
        loading: PLoading,
        response: PRes,
        sendApiRequest: PsendApiRequest,
        status: PStatus,
    } = useApiRequest();
    useEffect(() => {
        if (!id) return;
        getCategoryList();
        getSubCategoryList();
    }, []);
    const [isChecked, setIsChecked] = useState(false);
    const handleSubmit = (Id, searching = "", subCategoryId = "") => {
        try {
            setIsChecked(subCategoryId);
            if (isChecked === subCategoryId) {
                setIsChecked(null);
                return;
            }
            // if (subCategoryId) {
            //   console.log(subCategoryId)
            //   const filterdata = PRes?.lstProduct.filter((item, index) => (item?.SubCategoryId === subCategoryId))
            //   setData(filterdata);
            //   console.log("filterdata", filterdata)
            //   return
            // }
            const newdata = {
                SearchParam: searching,
                CategoryId: Id,
                SubCategoryId: subCategoryId ? subCategoryId : "",
            };
            console.log(newdata)
            PsendApiRequest("POST", "/ProductsList", newdata, {
                onSuccess: (res) => {
                    // console.log(res)
                    setData(res?.lstProduct);
                    if (res?.lstProduct[0]?.CategoryId && (res?.lstProduct[0]?.CategoryId !== id)) {
                        setID(res?.lstProduct[0]?.CategoryId)
                        getCategoryList(res?.lstProduct[0]?.CategoryId)
                        getSubCategoryList(res?.lstProduct[0]?.CategoryId)
                    }

                }
            })
            // console.log("newdata", newdata)
        } catch (error) {
            console.log(error);
        } finally {
            // setLoading(false);
        }
    };
    // useEffect(() => {
    //   handleSubmit(id ? searching ? "" : id : "", searching);
    // }, []);
    useEffect(() => {
        if (searching || id) {
            handleSubmit(id ? searching ? "" : id : "", searching);
        }
    }, [searching]);
    // console.log(id);
    const debounceHandleSubmit = (id, search, subCat) => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            handleSubmit(id, search, subCat);
        }, 300);
    };
    return (
        <>
            {Object.keys(banner).length !== 0 && <div className="page-heading" style={{
                backgroundImage: `url(${width <= 768 ? banner?.bannerApp : banner?.bannerWeb})`,
                backgroundSize: "cover"
            }}>
                <div className="container">&nbsp;</div>
            </div>}
            <div className="subcategorylist">
                <div
                    style={data?.length < 1 ? { marginBottom: "180px" } : { undefined }}
                    className="container"
                >
                    {
                        <div className="row">
                            <div className="col-lg-3 col-sm-12 col-xs-12">
                                {SubCatRes?.lstSubCategory?.length > 0 && <div className="side-menu-wrapper"
                                >
                                    <div className="side-menu-title">Browse With SubCategories
                                    </div>
                                    <ul className="p-2">
                                        {SubCatRes?.lstSubCategory?.length > 0 &&
                                            SubCatRes?.lstSubCategory?.map((item, index) => (
                                                <li
                                                    style={{ cursor: "pointer" }}
                                                    className="mb-1"
                                                    key={index}
                                                >
                                                    <div
                                                        className="collapsed"
                                                        data-bs-toggle="collapse"
                                                        data-bs-target={`#${item?.PKSubCategoryID}-started-collapse`}
                                                    >
                                                        <i>
                                                            {(
                                                                <input
                                                                    type="checkbox"
                                                                    onChange={() =>
                                                                        debounceHandleSubmit(id, "", item?.PKSubCategoryID, "")
                                                                    }
                                                                    checked={
                                                                        isChecked == item?.PKSubCategoryID
                                                                            ? true
                                                                            : false
                                                                    }
                                                                    name="subgroup"
                                                                    id="shubgroup"
                                                                    value={item?.PKSubCategoryID}
                                                                />
                                                            )}
                                                            <span className="ms-2"
                                                                onClick={() =>
                                                                    handleSubmit(id, "", item?.PKSubCategoryID, "")
                                                                }
                                                            >{item?.Name}</span>
                                                        </i>
                                                    </div>
                                                </li>
                                            ))}
                                    </ul>
                                </div>}
                                <div class="side-menu-wrapper">
                                    <div className="side-menu-title">
                                        LATEST PRODUCTS
                                    </div>
                                    <div class="similar-products">
                                        <LatestProducts responsive={responsive} isFromProductList={true} handleAddWishlist={handleAddWishlist} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-9 col-sm-12 col-xs-12">
                                <div className="row">
                                    {
                                        data?.length > 0
                                            // PRes?.lstProduct?.length > 0
                                            ?
                                            data?.map((item, index) => {
                                                // PRes?.lstProduct?.map((item, index) => {
                                                return (
                                                    <div className="col-lg-3 col-sm-6 col-xs-12 " key={index}>
                                                        <ProductCard
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
                                                    </div>
                                                );
                                            })
                                            // <div className="prdoct">
                                            //   <VirtuosoGrid
                                            //     totalCount={data?.length}
                                            //     listClassName="row"
                                            //     itemClassName="col-lg-3 col-sm-6 col-xs-12"
                                            //     style={{position:"relative",height:"auto"}}
                                            //     itemContent={(index) => {
                                            //       const item = data[index];
                                            //       return (
                                            //         <ProductCard
                                            //           mrp={item.MRP}
                                            //           discount={item.DiscountPercent}
                                            //           price={item.Price}
                                            //           img={item.ProductThumbnail}
                                            //           name={item.ProductName}
                                            //           cartdata={item}
                                            //           subCatName={item.SubCategoryName}
                                            //           handleAddWishlist={handleAddWishlist}
                                            //           rating={item.ProductRating}
                                            //         />
                                            //       );
                                            //     }}
                                            //   />
                                            // </div>

                                            : !loading && (
                                                <div className="text-danger    text-center d-flex align-items-center justify-content-center w-100 ">
                                                    {!PLoading && <ProductNotFound altText="Friendly product-not-found illustration" />}
                                                </div>
                                            )}
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div >
            {PLoading && <Loader />}
        </>
    );
};
export default SearchProducts;
