import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name:"chatSlice",
    initialState:{isOpenSupportTicketForm:false,priceValues:[0,0],discountPrice:[0,0],zoompic:null,isLogged:false},
    reducers:{
        setIsOpenSupportTicketForm:(state,action)=>{
            state.isOpenSupportTicketForm=action.payload
        },
        setPriceValues:(state,action)=>{
            state.priceValues=action.payload
        },
        setDiscountValues:(state,action)=>{
            state.discountPrice=action.payload
        },
        setZoomPic:(state,action)=>{
            state.zoompic=action.payload
        },
        setIsLogged:(state,action)=>{
            state.isLogged = action.payload
        }
    }
})
export default chatSlice.reducer;
export const chatAction=chatSlice.actions