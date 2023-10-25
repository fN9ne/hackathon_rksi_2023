import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	logOutActive: false,
};

const modalsSlice = createSlice({
	name: "modals",
	initialState,
	reducers: {
		setLogOutVisibility(state, action) {
			state.logOutActive = action.payload;
		},
		closeAll() {
			return initialState;
		},
	},
});

export const { setLogOutVisibility, closeAll } = modalsSlice.actions;
export default modalsSlice.reducer;
