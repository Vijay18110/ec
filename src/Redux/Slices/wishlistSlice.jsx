import { createSlice } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
    name:"wishlistSlice",
    initialState:{wishlist:[],isOrderDetail:false},
    reducers:{
        setWishlist:(state,action)=>{
            state.wishlist = action.payload
        },
        setIsOrderDetail:(state,action)=>{
            state.isOrderDetail=action.payload
        }
    }
})

export default wishlistSlice.reducer;
export const wishlistActions = wishlistSlice.actions;