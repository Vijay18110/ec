import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "uiSlice",
  initialState: {
    isModalOpen: false,
    screen: "login",
    search: null,
    searchText: null,
    searchArr: [],
    searchModal: false,
    address: false,
    user: false,
    tabs: "myOrders",
    forgotPassScreen: "forgot",
    customer: {
      fullName: "",
      solutation: "Mr.",
      mobile: "",
      email: "",
      address: "",
      city: "",
      state: "",
      country: "India",
    },
    storelist: [],
    productData: [],
    qty: 0,
    allStoreLists: [],
    isChat: false,
    welcome: false,
    storeid: "",
    addressid: ""


  },
  reducers: {
    openModal: (state, action) => {
      state.isModalOpen = !state.isModalOpen;
    },
    setScreen: (state, action) => {
      state.screen = action.payload;
    },

    setSearchArr: (state, action) => {
      const newItems = Array.isArray(action.payload)
        ? action.payload
        : [action.payload];
      const combined = [...state.searchArr, ...newItems];
      state.searchArr = Array.from(new Set(combined));
    },
    setSearchModal: (state, action) => {
      state.searchModal = !state.searchModal;
    },
    setaddresss: (state, action) => {
      state.address = !state.address;
    },
    setUser: (state, action) => {
      state.user = !state.user;
    },
    settabs: (state, action) => {
      state.tabs = action.payload;
    },
    setCustomer: (state, action) => {
      const { field, value } = action.payload;
      state.customer[field] = value;
    },
    setMultipleFields: (state, action) => {
      state.customer = { ...state.customer, ...action.payload };
    },
    setStorelist: (state, action) => {
      state.storelist = action.payload
    },
    setAllStoreLists: (state, action) => {
      state.allStoreLists = action.payload
    },
    setQty: (state, action) => {
      state.qty = action.payload
    },
    setisChat: (state, action) => {
      state.isChat = action.payload
    },
    setWelcome: (state, action) => {
      state.welcome = action.payload
    },
    setStoreid: (state, action) => {
      state.storeid = action.payload
    },
    setAddressid: (state, action) => {
      state.addressid = action.payload
    },
    setProductData: (state, action) => {
      state.productData = [...state.productData, action.payload]
    },
    resetProductsData: (state) => {
      state.productData = [];
    },
    setSearchText: (state, action) => {
      state.searchText = action.payload;
    },
    setForgotPassScreen: (state, action) => {
      state.forgotPassScreen = action.payload;
    }
  },
});

export default uiSlice.reducer;
export const uiAction = uiSlice.actions;
