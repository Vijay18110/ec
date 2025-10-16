import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
    name:"orderSlice",
    initialState:{isReturn:false,returnOrder:[],returnref:false,showPaymentModal:false},
    reducers:{
        setReturnOrder:(state,action)=>{
            state.returnOrder=action.payload
        },
        setIsReturn:(state,action)=>{
            state.isReturn = action.payload
        },
        setReturnref:(state,action)=>{
            state.returnref=action.payload
        },
        setShowPaymentModal:(state,action)=>{
            state.showPaymentModal=action.payload
        }
        
    }
})
export default orderSlice.reducer;
export const orderAction = orderSlice.actions