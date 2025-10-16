import { createSlice } from "@reduxjs/toolkit";
import Swal from "sweetalert2";
import ApiEncryptDecrypt from "../../Utils/Encryption";
import { Key } from "../../Utils/Key";
import axiosInstance from "../../Utils/axiosInstance";
import { toast } from "react-toastify";
import { uiAction } from "./uiSlice";
import { getProductCartData } from "../../Utils/getCartList";
export const handleRemoveProductFromCart = async (alldata) => {
  const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
  const newObj = {
    CustomerId: loggedInUser?.CustomerId || "",
    MainCartId: alldata?.MainCartId,
    CartId: alldata?.CartId,
  };
  const encryptedData = await ApiEncryptDecrypt.encryptString(
    Key,
    JSON.stringify(newObj)
  );
  const jsonData = { Body: encryptedData };
  let res;
  res = await axiosInstance.post("/DeleteCustomerCart", jsonData);
  const decryptedRes = await ApiEncryptDecrypt.decryptString(
    Key,
    res.data.body
  );
  const obj = JSON.parse(decryptedRes);
  if (obj.Status === 0) {
    // toast.success(obj.Message)
  }
  if (obj.Status === 1) {
    toast.error(obj.Message);
  }
  if (obj.Status === 3) {
    dispatch(uiAction.openModal());
  }
};
const addloggedincartData = async (cartData, payload, flag) => {
  const maincartid = localStorage.getItem("maincartid");
  const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
  try {
    if (loggedInUser) {
      if (flag == "increament") {
        const isExist =
          cartData &&
          cartData?.find((it) => {
            return it.ProductId === payload.ProductId;
          });
        if ((payload?.CategoryName || payload?.OfferType) !== "COMBOOFFER") {
          if (Number(isExist?.quantity) >= Number(isExist?.AvailQty)) {
            Swal.fire(`You’ve already added the maximum available stock`);
            return;
          }
        }
        if (cartData.length > 0) {
          if (isExist) {
            const newdata = {
              CustomerId: loggedInUser.CustomerId,
              ProductID: payload.ProductId,
              OfferId: "",
              OfferType: "",
              MainCartId: 0,
              CartId: isExist?.CartId,
            };
            const encryptedData = await ApiEncryptDecrypt.encryptString(
              Key,
              JSON.stringify(newdata)
            );
            const jsonData = { Body: encryptedData };
            let res;
            res = await axiosInstance.post("/IncrementCustomerCart", jsonData);
            const decryptedRes = await ApiEncryptDecrypt.decryptString(
              Key,
              res.data.body
            );
            const obj = JSON.parse(decryptedRes);
            if (obj.Status === 0) {
            }
            if (obj.Status === 1) {
              toast.error(obj.Message);
            }
          } else {
            const newdata = {
              CustomerId: loggedInUser.CustomerId,
              ProductID: payload.ProductId,
              OfferId: "",
              OfferType: "",
              MainCartId: 0,
            };
            const encryptedData = await ApiEncryptDecrypt.encryptString(
              Key,
              JSON.stringify(newdata)
            );
            const jsonData = { Body: encryptedData };
            let res;
            res = await axiosInstance.post("/UpdateCustomerCart_v2", jsonData);
            const decryptedRes = await ApiEncryptDecrypt.decryptString(
              Key,
              res.data.body
            );
            const obj = JSON.parse(decryptedRes);
            if (obj.Status === 0) {
            }
            if (obj.Status === 1) {
              toast.error(obj.Message);
            }
          }
        } else {
          let newdata = {
            CustomerId: loggedInUser.CustomerId,
            ProductID: payload.ProductId,
            ProductQty: 1,
            OfferId: "",
            OfferType: "",
            MainCartId: 0,
          };
          const encryptedData = await ApiEncryptDecrypt.encryptString(
            Key,
            JSON.stringify(newdata)
          );
          const jsonData = { Body: encryptedData };
          let res;
          res = await axiosInstance.post("/AddCustomerCart_v2", jsonData);
          const decryptedRes = await ApiEncryptDecrypt.decryptString(
            Key,
            res.data.body
          );
          const obj = JSON.parse(decryptedRes);
          if (obj.Status === 0) {
          }
          if (obj.Status === 1) {
            toast.error(obj.Message);
          }
        }
      } else {
        const isExist =
          cartData &&
          cartData?.find((it) => {
            return it.ProductId === payload.ProductId;
          });
        if (isExist) {
          if (isExist?.quantity <= 1 && flag != "increament") {
            handleRemoveProductFromCart(isExist);
            return;
          }
          const newdata = {
            CustomerId: loggedInUser?.CustomerId,
            MainCartId: 0,
            ProductID: isExist.ProductId,
          };
          const encryptedData = await ApiEncryptDecrypt.encryptString(
            Key,
            JSON.stringify(newdata)
          );
          const jsonData = { Body: encryptedData };
          let res;
          res = await axiosInstance.post("/CustomerDecrementCart", jsonData);
          const decryptedRes = await ApiEncryptDecrypt.decryptString(
            Key,
            res.data.body
          );
          const obj = JSON.parse(decryptedRes);
          // console.log("logged decrease", obj);
          if (obj.Status === 0) {
          }
          if (obj.Status === 1) {
            toast.error(obj.Message);
          }
        }
      }
    } else {
      if (flag != "increament") {
        const isExist =
          cartData &&
          cartData?.find((it) => {
            return it.ProductId === payload.ProductId;
          });
        if (isExist) {
          if (isExist?.quantity <= 1 && flag != "increament") {
            handleRemoveProductFromCart(isExist);
            return;
          }
          const newdata = {
            MainCartId: isExist.MainCartId,
            ProductID: isExist.ProductId,
          };
          const encryptedData = await ApiEncryptDecrypt.encryptString(
            Key,
            JSON.stringify(newdata)
          );
          const jsonData = { Body: encryptedData };
          let res;
          res = await axiosInstance.post("/CustomerDecrementCart", jsonData);
          const decryptedRes = await ApiEncryptDecrypt.decryptString(
            Key,
            res.data.body
          );
          const obj = JSON.parse(decryptedRes);
          // console.log("decreament", newdata, obj);
          if (obj.Status === 0) {
          }
          if (obj.Status === 1) {
            toast.error(obj.Message);
          }
        }
      } else {
        const isExist =
          cartData &&
          cartData?.find((it) => {
            return it.ProductId === payload.ProductId;
          });

        if (Number(isExist?.quantity) >= Number(isExist?.AvailQty)) {
          Swal.fire(`You’ve already added the maximum available stock`);
          return;
        }
        if (isExist) {
          const newdata = {
            CustomerId: loggedInUser.CustomerId,
            ProductID: payload.ProductId,
            OfferId: "",
            OfferType: "",
            MainCartId: 0,
          };
          // console.log("logg updatecart", newdata);
          const encryptedData = await ApiEncryptDecrypt.encryptString(
            Key,
            JSON.stringify(newdata)
          );
          const jsonData = { Body: encryptedData };
          let res;
          res = await axiosInstance.post("/UpdateCustomerCart", jsonData);
          const decryptedRes = await ApiEncryptDecrypt.decryptString(
            Key,
            res.data.body
          );
          const obj = JSON.parse(decryptedRes);

          if (obj.Status === 0) {
          }
          if (obj.Status === 1) {
            toast.error(obj.Message);
          }
        } else {
          let newdata = {
            CustomerId: loggedInUser.CustomerId,
            ProductID: payload.ProductId,
            ProductQty: 1,
            OfferId: "",
            OfferType: "",
            MainCartId: 0,
          };

          const encryptedData = await ApiEncryptDecrypt.encryptString(
            Key,
            JSON.stringify(newdata)
          );
          // console.log("logg add", newdata);

          const jsonData = { Body: encryptedData };
          let res;
          res = await axiosInstance.post("/AddCustomerCart_v2", jsonData);
          const decryptedRes = await ApiEncryptDecrypt.decryptString(
            Key,
            res.data.body
          );
          const obj = JSON.parse(decryptedRes);
          if (obj.Status === 0) {
          }
          if (obj.Status === 1) {
            toast.error(obj.Message);
          }
        }
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};
const addnotLoggedincartData = async (CartData, cartdata) => {
  try {
    const maincartid = localStorage.getItem("maincartid");
    const isExist =
      CartData &&
      CartData?.find((it) => {
        return it.ProductId === cartdata.ProductId;
      });
    if (Number(isExist?.quantity) >= Number(isExist?.AvailQty)) {
      Swal.fire(`You’ve already added the maximum available stock`);
      return;
    }
    if (maincartid && CartData.length > 0) {
      if (isExist) {
        const newdata = {
          ProductID: cartdata.ProductId,
          OfferId: "",
          OfferType: "",
          MainCartId: maincartid,
          CartId: isExist?.CartId,
        };
        const encryptedData = await ApiEncryptDecrypt.encryptString(
          Key,
          JSON.stringify(newdata)
        );
        // console.log("not logg updatecart", newdata);
        const jsonData = { Body: encryptedData };
        let res;
        res = await axiosInstance.post("/IncrementCustomerCart", jsonData);
        const decryptedRes = await ApiEncryptDecrypt.decryptString(
          Key,
          res.data.body
        );
        const obj = JSON.parse(decryptedRes);
        if (obj.Status === 0) {
        }
        if (obj.Status === 1) {
          toast.error(obj.Message);
        }
      } else {
        const newdata = {
          ProductID: cartdata.ProductId,
          OfferId: "",
          OfferType: "",
          MainCartId: maincartid,
        };
        const encryptedData = await ApiEncryptDecrypt.encryptString(
          Key,
          JSON.stringify(newdata)
        );
        // console.log("not logg updatecart", newdata);
        const jsonData = { Body: encryptedData };
        let res;
        res = await axiosInstance.post("/UpdateCustomerCart", jsonData);
        const decryptedRes = await ApiEncryptDecrypt.decryptString(
          Key,
          res.data.body
        );
        const obj = JSON.parse(decryptedRes);
        if (obj.Status === 0) {
        }
        if (obj.Status === 1) {
          toast.error(obj.Message);
        }
      }
    } else {
      const newdata = {
        ProductID: cartdata.ProductId,
        ProductQty: 1,
        OfferId: "",
        OfferType: "",
      };
      const encryptedData = await ApiEncryptDecrypt.encryptString(
        Key,
        JSON.stringify(newdata)
      );
      // console.log("not logg addcart", newdata);
      const jsonData = { Body: encryptedData };
      let res;
      res = await axiosInstance.post("/AddCustomerCart_v2", jsonData);
      const decryptedRes = await ApiEncryptDecrypt.decryptString(
        Key,
        res.data.body
      );
      const obj = JSON.parse(decryptedRes);
      console.log("addcart", obj)
      if (obj.Status === 0) {
        localStorage.getItem("maincartid");
        localStorage.setItem("maincartid", obj?.Response?.MainCartId);
      }
      if (obj.Status === 1) {
        toast.error(obj.Message);
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};
const addloggedincomboData = async (cartData, payload, flag) => {
  const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
  // console.log(payload)
  try {
    if (loggedInUser) {
      if (flag == "increament") {
        const isExist =
          cartData &&
          cartData?.find((it) => {
            return (
              it.ProductId ===
              (payload.bigIntPKComboOfferId || payload.ProductId)
            );
          });

        // if (isExist?.quantity >= isExist?.AvailQty) {
        //   Swal.fire(`You’ve already added the maximum available stock`);
        //   return;
        // }
        // console.log(cartData, payload, isExist);
        if (cartData.length > 0) {
          if (isExist) {
            const newdata = {
              CustomerId: loggedInUser.CustomerId,
              ProductID: payload.bigIntPKComboOfferId || payload.ProductId,
              OfferId: payload.bigIntPKComboOfferId || payload.ProductId,
              OfferType: payload?.CategoryName || payload.OfferType,
              MainCartId: 0,
              CartId: isExist?.CartId,
            };

            const encryptedData = await ApiEncryptDecrypt.encryptString(
              Key,
              JSON.stringify(newdata)
            );
            const jsonData = { Body: encryptedData };
            let res;
            res = await axiosInstance.post("/IncrementCustomerCart", jsonData);
            const decryptedRes = await ApiEncryptDecrypt.decryptString(
              Key,
              res.data.body
            );
            const obj = JSON.parse(decryptedRes);

            if (obj.Status === 0) {
            }
            if (obj.Status === 1) {
              toast.error(obj.Message);
            }
          } else {
            const newdata = {
              CustomerId: loggedInUser.CustomerId,
              ProductID: payload.bigIntPKComboOfferId || payload.ProductId,
              OfferId: payload.bigIntPKComboOfferId || payload.ProductId,
              OfferType: payload?.CategoryName || payload.OfferType,
              MainCartId: 0,
            };

            const encryptedData = await ApiEncryptDecrypt.encryptString(
              Key,
              JSON.stringify(newdata)
            );
            const jsonData = { Body: encryptedData };
            let res;
            res = await axiosInstance.post("/UpdateCustomerCart_v2", jsonData);
            const decryptedRes = await ApiEncryptDecrypt.decryptString(
              Key,
              res.data.body
            );
            const obj = JSON.parse(decryptedRes);

            if (obj.Status === 0) {
            }
            if (obj.Status === 1) {
              toast.error(obj.Message);
            }
          }
        } else {
          let newdata = {
            CustomerId: loggedInUser.CustomerId,
            ProductID: payload.bigIntPKComboOfferId,
            ProductQty: 1,
            OfferId: payload.bigIntPKComboOfferId,
            OfferType: payload.OfferType,
            MainCartId: 0,
          };

          const encryptedData = await ApiEncryptDecrypt.encryptString(
            Key,
            JSON.stringify(newdata)
          );

          const jsonData = { Body: encryptedData };
          let res;
          res = await axiosInstance.post("/AddCustomerCart_v2", jsonData);
          const decryptedRes = await ApiEncryptDecrypt.decryptString(
            Key,
            res.data.body
          );
          const obj = JSON.parse(decryptedRes);
          if (obj.Status === 0) {
          }
          if (obj.Status === 1) {
            toast.error(obj.Message);
          }
        }
      } else {
        const isExist =
          cartData &&
          cartData?.find((it) => {
            return it.ProductId === payload.ProductId;
          });
        if (isExist) {
          if (isExist?.quantity <= 1 && flag != "increament") {
            handleRemoveProductFromCart(isExist);
            return;
          }
          const newdata = {
            CustomerId: loggedInUser?.CustomerId,
            MainCartId: 0,
            ProductID: isExist.ProductId,
          };
          const encryptedData = await ApiEncryptDecrypt.encryptString(
            Key,
            JSON.stringify(newdata)
          );
          const jsonData = { Body: encryptedData };
          let res;
          res = await axiosInstance.post("/CustomerDecrementCart", jsonData);
          const decryptedRes = await ApiEncryptDecrypt.decryptString(
            Key,
            res.data.body
          );
          const obj = JSON.parse(decryptedRes);
          // console.log("logged decrease", obj);
          if (obj.Status === 0) {
          }
          if (obj.Status === 1) {
            toast.error(obj.Message);
          }
        }
      }
    } else {
      if (flag != "increament") {
        const isExist = cartData && cartData?.find((it) => { });
        if (isExist) {
          if (isExist?.quantity <= 1 && flag != "increament") {
            handleRemoveProductFromCart(isExist);
            return;
          }
          const newdata = {
            MainCartId: isExist.MainCartId,
            ProductID: isExist.ProductId,
          };
          const encryptedData = await ApiEncryptDecrypt.encryptString(
            Key,
            JSON.stringify(newdata)
          );
          const jsonData = { Body: encryptedData };
          let res;
          res = await axiosInstance.post("/CustomerDecrementCart", jsonData);
          const decryptedRes = await ApiEncryptDecrypt.decryptString(
            Key,
            res.data.body
          );
          const obj = JSON.parse(decryptedRes);
          // console.log("decreament", newdata, obj);
          if (obj.Status === 0) {
          }
          if (obj.Status === 1) {
            toast.error(obj.Message);
          }
        }
      } else {
        const isExist =
          cartData &&
          cartData?.find((it) => {
            return it.ProductId === payload.ProductId;
          });

        // if (isExist?.quantity >= isExist?.AvailQty) {
        //   Swal.fire(`You’ve already added the maximum available stock`);
        //   return;
        // }
        if (isExist) {
          const newdata = {
            CustomerId: loggedInUser.CustomerId,
            ProductID: payload.ProductId,
            OfferId: payload.ProductId,
            OfferType: payload.OfferType,
            MainCartId: 0,
          };
          // console.log("logg updatecart", newdata);

          const encryptedData = await ApiEncryptDecrypt.encryptString(
            Key,
            JSON.stringify(newdata)
          );
          const jsonData = { Body: encryptedData };
          let res;
          res = await axiosInstance.post("/UpdateCustomerCart", jsonData);
          const decryptedRes = await ApiEncryptDecrypt.decryptString(
            Key,
            res.data.body
          );
          const obj = JSON.parse(decryptedRes);

          if (obj.Status === 0) {
          }
          if (obj.Status === 1) {
            toast.error(obj.Message);
          }
        } else {
          let newdata = {
            CustomerId: loggedInUser.CustomerId,
            ProductID: payload.bigIntPKComboOfferId,
            ProductQty: 1,
            OfferId: payload.bigIntPKComboOfferId,
            OfferType: payload.OfferType,
            MainCartId: 0,
          };

          const encryptedData = await ApiEncryptDecrypt.encryptString(
            Key,
            JSON.stringify(newdata)
          );
          // console.log("logg add", newdata);

          const jsonData = { Body: encryptedData };
          let res;
          res = await axiosInstance.post("/AddCustomerCart_v2", jsonData);
          const decryptedRes = await ApiEncryptDecrypt.decryptString(
            Key,
            res.data.body
          );
          const obj = JSON.parse(decryptedRes);
          if (obj.Status === 0) {
          }
          if (obj.Status === 1) {
            toast.error(obj.Message);
          }
        }
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};
const addnotLoggedincomboData = async (CartData, cartdata) => {
  try {
    const maincartid = localStorage.getItem("maincartid");
    const isExist =
      CartData &&
      CartData?.find((it) => {
        return it.ProductId === cartdata.ProductId;
      });

    if (maincartid && CartData.length > 0) {
      if (isExist) {
        const newdata = {
          ProductID: cartdata.bigIntPKComboOfferId || cartdata.ProductId,
          OfferId: cartdata.bigIntPKComboOfferId || cartdata.ProductId,
          OfferType: cartdata.OfferType,
          MainCartId: maincartid,
          CartId: isExist?.CartId,
        };
        const encryptedData = await ApiEncryptDecrypt.encryptString(
          Key,
          JSON.stringify(newdata)
        );
        const jsonData = { Body: encryptedData };
        let res;
        res = await axiosInstance.post("/IncrementCustomerCart", jsonData);
        const decryptedRes = await ApiEncryptDecrypt.decryptString(
          Key,
          res.data.body
        );
        const obj = JSON.parse(decryptedRes);
        if (obj.Status === 0) {
        }
        if (obj.Status === 1) {
          toast.error(obj.Message);
        }
      } else {
        const newdata = {
          ProductID: cartdata.bigIntPKComboOfferId || cartdata.ProductId,
          OfferId: cartdata.bigIntPKComboOfferId || cartdata.ProductId,
          OfferType: cartdata.OfferType,
          MainCartId: maincartid,
        };
        const encryptedData = await ApiEncryptDecrypt.encryptString(
          Key,
          JSON.stringify(newdata)
        );
        const jsonData = { Body: encryptedData };
        let res;
        res = await axiosInstance.post("/UpdateCustomerCart", jsonData);
        const decryptedRes = await ApiEncryptDecrypt.decryptString(
          Key,
          res.data.body
        );
        const obj = JSON.parse(decryptedRes);
        if (obj.Status === 0) {
        }
        if (obj.Status === 1) {
          toast.error(obj.Message);
        }
      }
    } else {
      const newdata = {
        ProductID: cartdata.bigIntPKComboOfferId,
        ProductQty: 1,
        OfferId: cartdata.bigIntPKComboOfferId,
        OfferType: cartdata.OfferType,
      };
      const encryptedData = await ApiEncryptDecrypt.encryptString(
        Key,
        JSON.stringify(newdata)
      );
      const jsonData = { Body: encryptedData };
      let res;
      res = await axiosInstance.post("/AddCustomerCart_v2", jsonData);
      const decryptedRes = await ApiEncryptDecrypt.decryptString(
        Key,
        res.data.body
      );
      const obj = JSON.parse(decryptedRes);
      if (obj.Status === 0) {
        localStorage.getItem("maincartid");
        localStorage.setItem("maincartid", obj?.Response?.MainCartId);
      }
      if (obj.Status === 1) {
        toast.error(obj.Message);
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};
const cartSlice = createSlice({
  name: "cartSlice",
  initialState: {
    quantity: 0,
    cartData: [],
    address: {
      fullName: "",
      address: "",
      addressType: "",
      landMark: "",
      city: "",
      state: "",
      country: "India",
      mobile: "",
      isDefault: false,
    },
    pincode: null,
    editAddress: {},
    responceData: null,
    personName: "",
    availabilityMap: {},
    offerPrice: null
  },
  reducers: {
    handleAddProduct: (state, action) => {
      const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
      const { CartData, cartdata, combo } = action.payload;
      if (combo) {
        if (loggedInUser) {
          addloggedincomboData(CartData, cartdata, "increament");
        } else {
          addnotLoggedincomboData(CartData, cartdata);
        }
      } else {
        if (loggedInUser) {
          addloggedincartData(CartData, cartdata, "increament");
        } else {
          addnotLoggedincartData(CartData, cartdata);
        }
      }
    },
    handledecreamentQty: (state, action) => {
      const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
      const { CartData, cartdata, combo } = action.payload;
      if (combo) {
        if (loggedInUser) {
          addloggedincomboData(CartData, cartdata, "decreament");
        } else {
          addloggedincomboData(CartData, cartdata, "decreament");
        }
      } else {
        if (loggedInUser) {
          addloggedincartData(CartData, cartdata, "decreament");
        } else {
          addloggedincartData(CartData, cartdata, "decreament");
        }
      }
    },
    setCartData: (state, action) => {
      state.cartData = action.payload;
    },
    setAddress: (state, action) => {
      const { field, value } = action.payload;
      state.address[field] = value;
    },
    setMultipleFields: (state, action) => {
      state.address = { ...state.address, ...action.payload };
    },
    setPinCode: (state, action) => {
      state.pincode = action.payload;
    },
    setEditAddress: (state, action) => {
      state.editAddress = action.payload;
    },
    setResponceData: (state, action) => {
      state.responceData = action.payload;
    },
    setStorePersonName: (state, action) => {
      state.personName = action.payload;
    },
    setOfferPrice: (state, action) => {
      state.offerPrice = action.payload;
    },
    setAvailableProducts: (state, action) => {
      const { OfferType, OfferId, ProductTID, Status } = action.payload;
      const isAvailable = Status === "AVAILABLE";
      if (OfferType === "COMBOOFFER") {
        // If it's already marked as unavailable, do not overwrite
        if (state.availabilityMap[OfferId] === false) {
          console.log("Already unavailable for OfferId:", OfferId);
          return;
        }
        state.availabilityMap[OfferId] = isAvailable;
      } else {
        state.availabilityMap[ProductTID] = isAvailable;
      }
    },
    resetAvailabilityMap: (state) => {
      state.availabilityMap = {};
    },
  },
});

export default cartSlice.reducer;
export const cartActions = cartSlice.actions;
