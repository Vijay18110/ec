import { createSlice } from "@reduxjs/toolkit";

const addressSlice = createSlice({
    name: "addressSlice",
    initialState: { address: null, deleteloader: false },
    reducers: {
        setAddress: (state, action) => {
            state.address = action.payload
        },
        setDeleteLoader: (state, action) => {
            state.deleteloader = action.payload
        }
    }
})
export default addressSlice.reducer
export const addressAction = addressSlice.actions