import { configureStore } from "@reduxjs/toolkit";
import uiSlice from "../Slices/uiSlice";
import cartSlice from "../Slices/cartSlice";
import wishlistSlice from "../Slices/wishlistSlice";
import walletSlice from "../Slices/walletSlice";
import orderSlice from "../Slices/orderSlice";
import chatSlice from "../Slices/chatSlice";
import addressSlice from "../Slices/addressSlice";

import scrollReducer from "../Slices/scrollSlice";
const store = configureStore({
  reducer: {
    uireducer: uiSlice,
    cartreducer: cartSlice,
    wishlistreducer: wishlistSlice,
    walletreducer: walletSlice,
    orderreducer: orderSlice,
    chatreducer: chatSlice,
    addressreducer: addressSlice,
    scroll: scrollReducer,
  },
});
export default store;
