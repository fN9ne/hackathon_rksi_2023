import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	logOutActive: false,
	taskActive: false,
};

const modalsSlice = createSlice({
	name: "modals",
	initialState,
	reducers: {
		setLogOutVisibility(state, action) {
			state.logOutActive = action.payload;
		},
		setTaskVisibility(state, action) {
			state.taskActive = action.payload;
		},
		closeAll() {
			return initialState;
		},
	},
});

export const { setLogOutVisibility, setTaskVisibility, closeAll } = modalsSlice.actions;
export default modalsSlice.reducer;
