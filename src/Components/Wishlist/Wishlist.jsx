import React from "react";
import "./Wishlist.css";
import { Link, useNavigate } from "react-router-dom";
import pic from "../../assets/Images/shop/1.jpg";
import { RxCrossCircled } from "react-icons/rx";
import { FaCircleXmark } from "react-icons/fa6";
import Button from "../../Shared/Button/Button";
import { toast } from "react-toastify";
import { Key } from "../../Utils/Key";
import ApiEncryptDecrypt from "../../Utils/Encryption";
import axiosInstance from "../../Utils/axiosInstance";
import { getWishlist } from "../../Utils/getWishlist";
import { wishlistActions } from "../../Redux/Slices/wishlistSlice";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { cartActions } from "../../Redux/Slices/cartSlice";
import { getProductCartData } from "../../Utils/getCartList";
import { uiAction } from "../../Redux/Slices/uiSlice";
const Wishlist = ({ list }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartData = useSelector((state) => state.cartreducer.cartData);

  const handleAddWishlist = () => {
    navigate("/home");
  };
  const handleDeleteWishlists = async (productid) => {
    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    const encryptedData = await ApiEncryptDecrypt.encryptString(
      Key,
      JSON.stringify({
        CustomerId: loggedInUser?.CustomerId,
        ProductID: productid,
      })
    );
    const jsonData = { Body: encryptedData };
    let res;
    res = await axiosInstance.post("/DeleteCustomerWish", jsonData);
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
      dispatch(uiAction.openModal());
    }
  };
  const handleMoveTocart = async (data) => {
    const isExist = cartData.find((item) => item.ProductId == data.ProductId);
    if (isExist) {
      Swal.fire({
        icon: "warning",
        text: "Already added to cart",
      });
      return;
    }
    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    if (loggedInUser) {
      dispatch(
        cartActions.handleAddProduct({ CartData: cartData, cartdata: data })
      );
      const getdata = async () => {
        const { obj } = await getloggedCartList();
        dispatch(cartActions.setCartData(obj?.Response?.lstCartData));
      };
      setTimeout(() => {
        getdata();
      }, 400);
    }
    handleDeleteWishlists(data.ProductId);
  };
  function generateSlug(productName) {
    return encodeURIComponent(
      productName
        .toLowerCase()
        .replace(/'/g, "") // Remove apostrophes
        .replace(/[^a-z0-9\s-]/g, "") // Remove other special chars
        .replace(/\s+/g, "-") // Replace spaces with hyphens
    );
  }
  return (
    <div className="w-100">
      <div className="h2 ps-2 my-4">Wishlist</div>
      <div className="card p-4">
      {list.length > 0 ? (
        <div className=" wishlists ">
          {list.map((item, index) => {
            return (
              <div key={index} className="wishlistbox mb-3">
                <div className="wishlist-product">
                  <Link
                    to={`/product-details/${btoa(item.ProductId)}/${item?.URLText
                      ? generateSlug(item?.URLText)
                      : null || generateSlug(item?.ProductName)
                      }`}
                    className="product-item"
                  >
                    <img
                      loading="lazy"
                      className="default-img mt-1 w-100"
                      src={item?.ProductThumbnail}
                      alt="RAV organics"
                    />
                  </Link>
                  <div
                    className="quicklook-list"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleDeleteWishlists(item.ProductId)}
                  >
                    <FaCircleXmark size={30} />
                  </div>
                  <div className="body-content">
                    <Link to={`/product-details/${btoa(item.ProductId)}/${item?.URLText
                      ? generateSlug(item?.URLText)
                      : null || generateSlug(item?.ProductName)
                      }`}>
                      <h4 className="title">{item?.ProductName}</h4>
                    </Link>
                    <span className="one-liveing">{item?.SubCatName}</span>
                    <div className="price-area">
                      <span className="current">₹{parseInt(item?.Price)}</span>
                      <div className="previous">
                        MRP ₹ {parseInt(item?.MRP)}
                      </div>
                      <div className="offer-price">
                        {parseInt(item?.DiscountPercent)} % OFF
                      </div>
                    </div>

                    <button
                      className="addtocartwishlist"
                      onClick={() => handleMoveTocart(item)}
                    >
                      Move to cart
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="d-flex justify-content-center align-items-center">
          <Button children="Add wishlist" click={handleAddWishlist} />
        </div>
      )}
    </div>
    </div>
  );
};

export default Wishlist;
