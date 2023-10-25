import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	firstName: null,
	lastName: null,
	username: null,
	role: null,
};

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setUser(state, action) {
			localStorage.setItem("ft_user", JSON.stringify(action.payload));
			return {
				...state,
				...action.payload,
			};
		},
		throwUser() {
			localStorage.removeItem("ft_user");
			return initialState;
		},
	},
});

export const { setUser, throwUser } = userSlice.actions;
export default userSlice.reducer;
