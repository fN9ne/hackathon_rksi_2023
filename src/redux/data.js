import { createSlice } from "@reduxjs/toolkit";

const dataSlice = createSlice({
	name: "data",
	initialState: {
		users: [],
		boards: [],
	},
	reducers: {
		setUsers(state, action) {
			state.users = action.payload;
		},
		setBoards(state, action) {
			state.boards = action.payload;
		},
	},
});

export const { setUsers, setBoards } = dataSlice.actions;
export default dataSlice.reducer;
