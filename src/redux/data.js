import { createSlice } from "@reduxjs/toolkit";

const dataSlice = createSlice({
	name: "data",
	initialState: {
		users: [],
		teams: [],
	},
	reducers: {
		setUsers(state, action) {
			state.users = action.payload;
		},
		setTeams(state, action) {
			state.teams = action.payload;
		},
	},
});

export const { setUsers, setTeams } = dataSlice.actions;
export default dataSlice.reducer;
