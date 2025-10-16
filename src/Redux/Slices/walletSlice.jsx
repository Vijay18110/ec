import { createSlice } from "@reduxjs/toolkit";

const walletSlice = createSlice({
    name:"walletSlice",
    initialState:{totalWallet:0,loader:false},
    reducers:{
        setTotalWallet:(state,action)=>{
            state.totalWallet=action.payload
        },
        setLoader:(state,action)=>{
            state.loader=action.payload
        }
    }
});
export default walletSlice.reducer
export const walletActions = walletSlice.actions