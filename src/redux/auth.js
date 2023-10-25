import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
	name: "auth",
	initialState: {
		signUpActive: true,
		logInActive: false,
	},
	reducers: {
		openSignUp(state) {
			state.signUpActive = true;
			state.logInActive = false;
		},
		openLogIn(state) {
			state.signUpActive = false;
			state.logInActive = true;
		},
	},
});

export const { openSignUp, openLogIn } = authSlice.actions;
export default authSlice.reducer;
