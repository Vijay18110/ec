// src/Redux/Slices/scrollSlice.js
import { createSlice } from "@reduxjs/toolkit";

const scrollSlice = createSlice({
    name: "scroll",
    initialState: {
        target: null,
    },
    reducers: {
        setScrollTarget: (state, action) => {
            state.target = action.payload;
        },
        clearScrollTarget: (state) => {
            state.target = null;
        },
    },
});

export const { setScrollTarget, clearScrollTarget } = scrollSlice.actions;
export default scrollSlice.reducer;
