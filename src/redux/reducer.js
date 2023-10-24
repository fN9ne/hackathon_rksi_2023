import { createSlice } from "@reduxjs/toolkit";

const initailState = {};

const someSlice = createSlice({
	name: "name",
	initailState,
	reducers: {
		func(state) {
			state.value = 0;
		},
	},
});

export const { func } = someSlice.actions;
export default someSlice.reducer;
