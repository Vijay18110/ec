import React, { useEffect } from 'react'
import SectionTitle from '../../SectionTitle/SectionTitle';
import ProductCard from '../../../Shared/ProductCard/ProductCard';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import useApiRequest from '../../../Hooks/apiReq';
import ApiEncryptDecrypt from '../../../Utils/Encryption';
import { Key } from '../../../Utils/Key';
import axiosInstance from '../../../Utils/axiosInstance';
import { wishlistActions } from '../../../Redux/Slices/wishlistSlice';
import { getWishlist } from '../../../Utils/getWishlist';
import { toast } from 'react-toastify';
import { uiAction } from '../../../Redux/Slices/uiSlice';

const SubCategoryLists = () => {
    const { search } = useLocation();
  const queryData = new URLSearchParams(search);
  const headerid = atob(queryData.get("id"));
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
        // navigate && navigate("/my-team-tree-view");
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
     
      productSendApiRequest("POST", "/SubGroupWiseProductList", {
        GroupHeaderID: headerid,
      });
    }, [headerid]);
  return (
    <>
    <div className="container">
          {productResponce?.lstSubGroupDetail.length>0 && (
            <>
              <SectionTitle link={false} title="Products on discount" />
              <div className=" d-flex row-cols-lg-4 flex-wrap row-cols-md-2 row-cols-sm-2 row-cols-1">
                {productResponce?.lstSubGroupDetail.map((item, index) => {
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
              </div>
            </>
          )}
        </div>
    </>
  )
}

export default SubCategoryLists