import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import useApiRequest from "../../Hooks/apiReq";
import { useNavigate } from "react-router-dom";
import ProductCard from "../../Shared/ProductCard/ProductCard";
import CategoryList from "../../Components/Categoies";
import SpinnerLoader from "../../Components/SpinnerLoader";
import Banner from "../../Components/BannerComponets/Banner";
import Slider from "../../ExternalLib/Carousel/Carousel";



const HomePage = () => {
  const [productsList, setProductsList] = useState([])
  const [categoriesList, setCatList] = useState([])
  const [bannerList, setBannerList] = useState([])
  const [subcategoriesList, setsubtList] = useState([])
  const { error, loading, recallRequest, response, sendApiRequest, status } = useApiRequest()

  const navigate = useNavigate();
  const getProducts = () => {
    sendApiRequest("GET", "/product/getAllProducts", "", {
      onSuccess: (res) => {
        setProductsList(res);
      },
      onError: (res) => {
        navigate("/login");
      }
    })
  }
  const getSubCategories = () => {
    sendApiRequest("GET", "/getAllsubcategories", "", {
      onSuccess: (res) => {
        setsubtList(res);
      },
      onError: (res) => {
        navigate("/login");
      }
    })
  }
  const getCategories = () => {
    sendApiRequest("GET", "/getAllCategories", "", {
      onSuccess: (res) => {
        setCatList(res);
      },
      onError: (res) => {
        navigate("/login");
      }
    })
  }
  const getBanner = () => {
    sendApiRequest("GET", "/getBanner", "", {
      onSuccess: (res) => {
        setBannerList(res);
      },
      onError: (res) => {
        navigate("/login");
      }
    })
  }
  useEffect(() => {
    getProducts();
    getSubCategories();
    getCategories();
    getBanner();
  }, [])
  console.log("productsList", productsList)
  console.log("cat", categoriesList)
  console.log("banner", bannerList)
  return (
    <div className="container py-1">
      {bannerList.length > 0 && <Slider>

        {bannerList?.map((banner, index) => <Banner key={index} buttonText={""} image={banner?.bannerUrl} />)}
      </Slider>}
      <CategoryList categories={categoriesList} />
      <h4 className=" mb-4 fw-bold text-uppercase">Our Products</h4>
      {loading && <SpinnerLoader />}

      <div className="row g-4">
        {productsList.map((product, idx) => (
          <div key={product.id} className="col-sm-6 col-md-4 col-lg-3">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
      <style>{`
        .product-card {
          transition: all 0.3s ease;
          border-radius: 0.75rem;
        }
        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
        }
      `}</style>

    </div>
  );
};

export default HomePage;
