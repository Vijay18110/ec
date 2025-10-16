import { useState } from "react";
import { toast } from "react-toastify";
import ApiEncryptDecrypt from "../Utils/Encryption";
import axiosInstance from "../Utils/axiosInstance";
import { Key } from "../Utils/Key";
const useFetchProductList = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchProductList = async ({ searching = "", id = "" }, { onSuccess }) => {
        try {
            if (loading) {
                return;
            }
            if (!id) {
                return;
            }
            setLoading(true);
            const newdata = {
                SearchParam: searching,
                CategoryId: id,
                SubCategoryId: "",
                PAGENO: "1",
                PAGESIZE: "5"
            };
            // console.log("newdata", newdata);
            const encryptedData = await ApiEncryptDecrypt.encryptString(
                Key,
                JSON.stringify(newdata)
            );
            const jsonData = { Body: encryptedData };
            const res = await axiosInstance.post("/ProductsList", jsonData);

            const decryptedRes = await ApiEncryptDecrypt.decryptString(
                Key,
                res.data.body
            );

            const obj = JSON.parse(decryptedRes);
            // console.log("productList", obj);

            if (obj.Status === 0) {
                setData(obj?.Response?.lstProduct || []);
                onSuccess?.(obj?.Response?.lstProduct)
            } else if (obj.Status === 1) {
                toast.error(obj.Message);
            }
        } catch (error) {
            console.error("Fetch error:", error);
            toast.error("Something went wrong while fetching products.");
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, fetchProductList };
};

export default useFetchProductList;
