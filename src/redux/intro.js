import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	project: null,
	team: null,
	members: [],
	screen: 0,
};

const introSlice = createSlice({
	name: "intro",
	initialState,
	reducers: {
		setProject(state, action) {
			state.project = action.payload;
		},
		setTeam(state, action) {
			state.team = action.payload;
		},
		addMember(state, action) {
			state.members = [...state.members, action.payload];
		},
		removeMember(state, action) {
			state.members = state.members.filter((member) => member.username !== action.payload);
		},
		setScreen(state, action) {
			state.screen = action.payload;
		},
		listScreen(state, action) {
			state.screen += action.payload;
		},
	},
});

export const { setProject, setTeam, addMember, removeMember, setScreen, listScreen } = introSlice.actions;
export default introSlice.reducer;
