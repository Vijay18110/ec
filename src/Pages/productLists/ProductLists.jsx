import React, { lazy, useEffect, useMemo, useRef, useState } from "react";
import useApiRequest from "../../Hooks/apiReq";
const ProductCard = lazy(() => import("../../Shared/ProductCard/ProductCard"))
import { getWishlist } from "../../Utils/getWishlist";
import { wishlistActions } from "../../Redux/Slices/wishlistSlice";
import ApiEncryptDecrypt from "../../Utils/Encryption";
import axiosInstance from "../../Utils/axiosInstance";
const ProductNotFound = lazy(() => import("../../Components/ProductNotFound"));
const LatestProducts = lazy(() => import("../../Components/LatestProducts/LatestProducts"));
import { toast } from "react-toastify";
import { Key } from "../../Utils/Key";
import { useDispatch, useSelector } from "react-redux";
import { uiAction } from "../../Redux/Slices/uiSlice";
import { useLocation, useSearchParams } from "react-router-dom";
import { MdFilterList } from "react-icons/md";
import useWindowWidth from "../../Hooks/useWindowWidth";
import Loader from "../../ExternalLib/Loader/Loader";
import Container from "../../Container/Container";
const SortBy = lazy(() => import("../SortBy"))
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
const ProductLists = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchBySUBCatLoading, setSearchSubcategoryLoading] = useState(false)
  const [TotalCount, setTotalCount] = useState(null)
  const [loadingSort, setLoadingSort] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const width = useWindowWidth()
  const { search } = useLocation();
  const [subCategoriesOnSeachByText, setSubCategoriesOnSeachByText] = useState([])
  const [searchParams1, setSearchParams] = useSearchParams();
  const [id, setID] = useState("");
  const [searching, setSearching] = useState("");
  const debounceRef = useRef();
  const [searchLoading, setSearchLoading] = useState(false);
  const searchParams = new URLSearchParams(location.search);
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const idParam = searchParams.get("id");
    const searchParam = searchParams.get("search");
    // setSearchParams(searchParams1);
    setSearchLoading(true)
    setID(idParam ? atob(idParam) : "");
    setSearching(searchParam ? atob(searchParam) : "");
  }, [location.search]);
  const [showFilter, setShowfilter] = useState(false);
  const [data, setData] = useState({});
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
  const [sortType2, setSortType] = useState();
  const lastElementRef = useRef(null);
  const [hasMore, setHasMore] = useState(true)
  const observer = useRef();
  const getresponce = async () => {
    const responce = await getWishlist();
    dispatch(wishlistActions.setWishlist(responce?.obj?.Response?.lstWishData));
  };
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
    groupListSendApiRequest("POST", "/GetCategoryList", { DeviceType: "Web" }, {
      onSuccess: (res) => {
        setBanner((pre) => {
          const ctg = res?.lstCategory.find((category, index) => category?.CategoryID === (categoryID || id))
          return { bannerWeb: ctg?.CategoryBannerImage, bannerApp: ctg?.MobileCategoryBannerImage }
        })
      }
    });
  };
  const getSubCategoryList = (categoryID) => {
    SubCatesendApiRequest("POST", "/GetSubCategoryList", { CategoryId: categoryID || id }, {
      onSuccess: (res) => {
        // console.log(res)


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
  }, [id]);
  const [allData, setAllData] = useState([]);
  const [visibleData, setVisibleData] = useState([]);
  const [itemsToShow, setItemsToShow] = useState(16);
  const [isChecked, setIsChecked] = useState(null);
  const [subCategoryId, setSubCategoryId] = useState(null);
  const [preSerachParams, setpreSerachParams] = useState("");
  const handleSubmit = (Id, searching = "", subCategoryId = "", no = "") => {
    try {
      // const newParams = new URLSearchParams(searchParams);
      // if (Id || subCategoryId) {
      //   newParams.set("search", ""); // Remove the 'search' param
      //   if (Id) newParams.set("id", btoa(Id));




      //   // if (subCategoryId) newParams.set("subCategoryId", subCategoryId);
      // }

      setIsChecked(subCategoryId);
      if (isChecked === subCategoryId && !no && !searching) {
        // alert("handleSubmit called with Id: " + Id + ", searching: " + searching + ", subCategoryId: " + subCategoryId + ", no: " + no);
        setIsChecked(null);
        return;
      }

      const newdata = {
        SearchParam: searching,
        CategoryId: Id,
        SubCategoryId: subCategoryId ? subCategoryId : "",
        PAGENO: no ? no : String(no),
        PAGESIZE: "20"
      };
      // console.log(newdata)
      PsendApiRequest("POST", "/ProductsList", newdata, {
        onSuccess: (res) => {
          // console.log(res)
          if (!res?.lstProduct.length) {
            setVisibleData([]);
            setData([]);
            return;
          }
          if (searching && !Id && !subCategoryId) {
            setID();
            setpreSerachParams(searching)
            if (TotalCount !== res?.TotalRecord) {
              setTotalCount(res?.TotalRecord);
            }
            setSubCategoriesOnSeachByText((pre) => {
              const raw = res.lstProduct;
              const data = raw
                .map((item) => {
                  return {
                    PKSubCategoryID: item.SubCategoryId,
                    Name: item.SubCategoryName,
                    cateId: item?.CategoryId
                  }
                })
                .filter(
                  (item, index, self) =>
                    index === self.findIndex(
                      (t) => t.PKSubCategoryID === item.PKSubCategoryID
                    )
                );
              return data;
            });
            if (!subCategoryId && (res?.lstProduct?.[0]?.CategoryId !== id)) {
              setID(res?.lstProduct[0]?.CategoryId);
              getCategoryList(res?.lstProduct[0]?.CategoryId);
              getSubCategoryList(res?.lstProduct[0]?.CategoryId);
            }
            if (preSerachParams === searching) {
              // alert("fdgdfgdf")
              setData((pre) => ({ ...pre, [no]: res?.lstProduct }));
            }
            else {
              setData((pre) => ({ 1: res?.lstProduct }));
              // console.log(res)
              setPageNo(1)
            }
          }
          window.scrollTo({
            top: "500",
            behavior: 'smooth'
          })
          setSearchLoading(false);
          let sortedData = [];
          switch (sortType2) {
            case "popularity":
              sortedData = res?.lstProduct.slice().sort((a, b) => Number(b.ProductRating) - Number(a.ProductRating));
              break;
            case "priceLowToHigh":
              sortedData = res?.lstProduct.slice().sort((a, b) => Number(a.Price) - Number(b.Price));
              break;
            case "priceHighToLow":
              sortedData = res?.lstProduct.slice().sort((a, b) => Number(b.Price) - Number(a.Price));
              break;
            case "discount":
              sortedData = res?.lstProduct.slice().sort((a, b) => Number(b.DiscountPercent) - Number(a.DiscountPercent));
              break;
            default:
              sortedData = res?.lstProduct;
          }
          setData((pre) => ({ ...pre, [no ? no : 1]: sortedData }));
          if (TotalCount !== res?.TotalRecord) {
            setTotalCount(res?.TotalRecord);
          }
          if (!subCategoryId && (res?.lstProduct?.[0]?.CategoryId !== id)) {
            setID(res?.lstProduct[0]?.CategoryId)
            getCategoryList(res?.lstProduct[0]?.CategoryId)
            getSubCategoryList(res?.lstProduct[0]?.CategoryId)
          }
        }
      })
    } catch (error) {
      console.log(error);
    } finally {
      setSearchLoading(false)
    }
  };
  useEffect(() => {
    // alert("handleSubmit called with Id: " + id + ", searching: " + searching);
    const searchParams = new URLSearchParams(location.search);
    const idParam = searchParams.get("id");
    if (searching || idParam) {
      handleSubmit(idParam ? searching ? "" : idParam ? atob(idParam) : "" : "", searching);
    }
  }, [searching]);
  // useEffect(() => {
  //   handleSubmit(id, searching, "", 1);
  // }, [searching]);
  useEffect(() => {
    getresponce();
  }, [])
  // console.log(id);
  const debounceHandleSubmit = (id, search, subCat) => {
    try {
      const newParams1 = new URLSearchParams(searchParams);
      newParams1.set("search", ""); // Remove the 'search' param
      newParams1.set("id", btoa(id));
      // if (id) {
      // }
      if (isChecked === subCat) {
        return
      }
      setSearchParams(newParams1);
      setSearchSubcategoryLoading(true)
      setPageNo(1)
      setVisibleData([])
      // setAllData([])
      setData({})
      if (width < 1024) {
        handleShowFilter();
      }
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        handleSubmit(id, "", subCat, 1);
        setSearchSubcategoryLoading(false)
      }, 300);
    } catch (error) {
    }
  };
  const handleShowFilter = () => {
    setShowfilter((prev) => (!prev));
  }
  const HandleSort = (sortType) => {
    setLoadingSort(true); // Start loader
    handleShowFilter();
    setSortType(sortType);
    setTimeout(() => {
      let sortedData = [];
      switch (sortType) {
        case "popularity":
          sortedData = data[pageNo].slice().sort((a, b) => Number(b.ProductRating) - Number(a.ProductRating));
          break;
        case "priceLowToHigh":
          sortedData = data[pageNo].slice().sort((a, b) => Number(a.Price) - Number(b.Price));
          break;
        case "priceHighToLow":
          sortedData = data[pageNo].slice().sort((a, b) => Number(b.Price) - Number(a.Price));
          break;
        case "discount":
          sortedData = data[pageNo].slice().sort((a, b) => Number(b.DiscountPercent) - Number(a.DiscountPercent));
          break;
        default:
          sortedData = data[pageNo];
      }
      setData((pre) => ({ ...pre, [pageNo]: sortedData }));
      setLoadingSort(false);
    }); // Optional delay for smoother UX
  };
  // console.log(data)
  useEffect(() => {
    if (Object.entries(data).length > 0) {
      setAllData((pre) => {
        return [...pre, ...data[pageNo]]
      });
      setVisibleData((pre) => [...data[pageNo]]);
    }
  }, [data]);
  const handlePage = (no) => {
    if (data[no]) {
      // console.log(data[no])
      setVisibleData(data[no])
      setPageNo(no);
      setIsLoading(false);
      window.scrollTo({
        top: "500",
        behavior: 'smooth'
      })
      return;
    }
    if (no === pageNo) {
      toast.info("You are already on this page", {
        toastId: "page"
      });
      return;
    }
    if (no >= 1 && no <= Math.ceil(TotalCount / 20)) {
      handleSubmit(searching ? "" : id, "", isChecked ? isChecked : "", no);
      setPageNo(no);
      setIsLoading(false); // Reset after API is triggered
    }
  };
  const renderPages = () => {
    const TotalCount1 = Math.ceil(TotalCount / 20);
    if (TotalCount1 <= 1) return null;
    const pages = [];
    const start = Math.max(2, pageNo - 1);
    const end = Math.min(TotalCount1 - 1, pageNo + 1);
    // First page
    pages.push(
      <button
        key={1}
        onClick={() => handlePage(1)}
        className={pageNo === 1 ? 'active11' : ''}
      >
        1
      </button>
    );

    // Left ellipsis
    if (start > 2) pages.push(<span className="fs-3" key="left-ellipsis">...</span>);

    // Middle pages
    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePage(i)}
          className={pageNo === i ? 'active11' : ''}
        >
          {i}
        </button>
      );
    }

    // Right ellipsis
    if (end < TotalCount1 - 1) pages.push(<span className="fs-3" key="right-ellipsis">...</span>);

    // Last page
    if (TotalCount1 > 1) {
      pages.push(
        <button
          key={TotalCount1}
          onClick={() => handlePage(TotalCount1)}
          className={pageNo === TotalCount1 ? 'active11' : ''}
        >
          {TotalCount1}
        </button>
      );
    }

    // Manual input field
    pages.push(
      <span key="manual-input" className="manual-page-input">
        <input
          type="number"
          min={1}
          max={TotalCount1}
          placeholder="Go to page"
          style={{ width: '80px', marginLeft: '10px' }}
          onKeyDown={(e) => {
            if (Number(e.target.value) && e.key !== 'Enter') {
              toast.info("Press Enter Key to go to the desired page", {
                toastId: "info"
              });
            }
            if (e.key === 'Enter') {
              const value = Number(e.target.value);

              if (value > TotalCount1) {
                toast.warn(`Input Value Should be less than or equal to ${TotalCount1}`, {
                  toastId: "warn"
                });
              }
              if (value >= 1 && value <= TotalCount1) {
                handlePage(value);
                e.target.value = '';
              }
            }
          }}
        />
      </span>
    );
    return pages;
  };
  // console.log(data)
  // console.log("subCategoriesOnSeachByText", subCategoriesOnSeachByText)
  // console.log(id);
  return (
    <Container>
      {(banner?.bannerApp || banner?.bannerWeb) && !searching && Object.keys(banner).length !== 0 && <div className="page-heading" style={{
        backgroundImage: `url(${width <= 768 ? banner?.bannerApp : banner?.bannerWeb})`,
        backgroundSize: "cover"
      }}>
        <div className="container">&nbsp;</div>
      </div>}
      <div className="subcategorylist">
        <div
          style={Object.entries(data)?.length < 1 ? { marginBottom: "180px" } : { undefined }}
          className="container"
        >
          {
            <div className="row">
              <div className={`col-lg-3 col-sm-12 col-xs-12 ${width >= 1024 ? "position-relative" : undefined}`}
                style={width >= 1024 ? {} : {
                  position: "sticky", top: "67px", zIndex: 83,
                  backgroundColor: "white",
                }}
              >
                <div style={width >= 1024 ? {
                  position: "sticky", top: "85px",
                  backgroundColor: "white",
                } : {
                }}>
                  {
                    (width >= 1024 || showFilter) &&
                    SubCatRes?.lstSubCategory?.length > 0 &&
                    <div className="side-menu-wrapper"
                    >
                      <div className="side-menu-title">Browse With SubCategories
                      </div>
                      <ul className="p-2">
                        {SubCatRes?.lstSubCategory?.length > 0 &&
                          [...subCategoriesOnSeachByText, ...SubCatRes?.lstSubCategory]?.filter(
                            (item, index, self) =>
                              index === self.findIndex(
                                (t) => t.PKSubCategoryID === item.PKSubCategoryID
                              )
                          ).map((item, index) => (
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
                                        debounceHandleSubmit(item?.cateId ? item?.cateId : id, "", item?.PKSubCategoryID, "")
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
                                      debounceHandleSubmit(item?.cateId ? item?.cateId : id, "", item?.PKSubCategoryID, "")
                                    }
                                  >{item?.Name}</span>
                                </i>
                              </div>
                            </li>
                          ))}
                      </ul>
                      {!(width >= 1024) && <div className="mx-3"  >
                        <SortBy
                          onSortChange={(sortType) => HandleSort(sortType)}
                        />
                      </div>}
                    </div>
                  }
                  {width >= 1024 ?
                    <div class="side-menu-wrapper">
                      <div className="side-menu-title">
                        LATEST PRODUCTS
                      </div>
                      <div class="similar-products">
                        <LatestProducts responsive={responsive} isFromProductList={true} handleAddWishlist={handleAddWishlist} />
                      </div>
                    </div>
                    :
                    <div className="position-relative">
                      <div className="d-flex justify-content-between position-sticky align-items-center"  >
                        {!searching ? <div class="side-menu-wrapper w-50 mt-1">
                          <div className="side-menu-title">Serach Result</div>
                        </div> :
                          isChecked ? <div class="side-menu-wrapper w-50 mt-1">
                            <div className="side-menu-title">Serach Result</div>
                          </div> : <p style={width <= 480 ? { fontSize: "12px" } : {}} className=" fw-bold">Showing {20 * (pageNo - 1) + 1} – {20 * pageNo < TotalCount ? 20 * pageNo : TotalCount} of {TotalCount} results for <strong className=" fw-bolder text-black">"{searching}"</strong></p>
                        }
                        <button onClick={handleShowFilter} type="button" class="btn btn-outline-success mb-4 d-flex align-items-center justify-content-center">
                          <span style={width <= 480 ? { fontSize: "10px" } : {}}> Sort And Filter</span> <span class="badge badge-light "><MdFilterList size={width <= 480 ? 14 : 22} color={"#000"} /></span>
                        </button>
                      </div>
                    </div>
                  }
                </div>
              </div>
              {
                <div className="col-lg-9 col-sm-12 col-xs-12 my-2 my-lg-0 position-relative">
                  {width >= 1024 && PRes && PRes.lstProduct.length > 0 > 0 && <div className="position-sticky bg-white py-1" style={{ top: "81px", zIndex: 83, }}>
                    {searching && !isChecked && <p className="fs-5 fw-bold">Showing {20 * (pageNo - 1) + 1} – {20 * pageNo < TotalCount ? 20 * pageNo : TotalCount} of {TotalCount} results for <strong className=" fw-bolder text-black">"{searching}"</strong></p>}
                    <SortBy
                      dataCount={visibleData.length > 0 && TotalCount}
                      onSortChange={(sortType) => HandleSort(sortType)}
                    />
                  </div>}
                  {Object.entries(data).length > 0 ? <div className="" style={{ width: '100%' }}>
                    <div className="row mt-1">
                      {Object.entries(data).length > 0 ?
                        visibleData.map((item, index) => <div className="col-lg-3 col-sm-6 col-xs-12 " key={index}>
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
                        </div>) : ((searchLoading) && (
                          <div className="text-center py-3">
                            <span className="spinner-border text-success"></span>
                          </div>
                        ))}
                      <div ref={lastElementRef} />
                      {(PLoading || searchLoading) && (
                        <div className="text-center py-3">
                          <span className="spinner-border text-success"></span>
                        </div>
                      )}
                      {(Object.entries(data).length > 0 && visibleData.length > 0 && (TotalCount / 20) > 1 && !searchLoading) && <div className="pagination-wrap">
                        <div className="pagination">
                          <button
                            className="prevposts-link"
                            onClick={() => handlePage(pageNo - 1)}
                            style={{
                              cursor: pageNo > 1 ? 'pointer' : 'not-allowed',
                              opacity: pageNo > 1 ? 1 : 0.5,
                            }}
                          >
                            <i className="fa fa-caret-left" />
                          </button>
                          {renderPages()}
                          <button
                            className="nextposts-link"
                            onClick={() => handlePage(pageNo + 1)}
                            style={{
                              cursor: pageNo < Math.ceil(TotalCount / 20) ? 'pointer' : 'not-allowed',
                              opacity: pageNo < Math.ceil(TotalCount / 20) ? 1 : 0.5,
                            }}
                          >
                            <i className="fa fa-caret-right" />
                          </button>
                        </div>
                      </div>}
                    </div>
                  </div>
                    : PLoading ? <div className="text-center py-3 d-flex justify-content-center align-items-center h-100">
                      {/* <span className="spinner-border text-success"></span> */}
                    </div> : !visibleData.length && !searchBySUBCatLoading && (
                      <div className="text-danger  text-center d-flex align-items-center justify-content-center w-100 ">
                        {<ProductNotFound vh={true} altText="Friendly product-not-found illustration" />}
                      </div>
                    )}
                </div>
              }
            </div>
          }
        </div>
      </div >
      {(PLoading || searchBySUBCatLoading) && <Loader />}
    </Container>
  );
};
export default ProductLists;
