import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  toSlide: false, 
};


const slidingSlice =createSlice({
    name:"slide",
    initialState:initialState,

    reducers:{
        setSlide(state){
            state.toSlide=!state.toSlide;
        }
    }


})

export const {setSlide} = slidingSlice.actions;

export default slidingSlice.reducer;