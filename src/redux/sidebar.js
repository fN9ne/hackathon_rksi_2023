import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	projects: false,
	rooms: false,
	activeProject: null,
	activeRoom: null,
};

const sidebarSlice = createSlice({
	name: "modals",
	initialState,
	reducers: {
		setProjectTabVisibility(state, action) {
			state.projects = action.payload;
		},
		setRoomsTabVisibility(state, action) {
			state.rooms = action.payload;
		},
		setActiveProject(state, action) {
			state.activeProject = action.payload;
		},
		setActiveRoom(state, action) {
			state.activeRoom = action.payload;
		},
		closeAll(state) {
			return {
				...state,
				projects: false,
				rooms: false,
			};
		},
	},
});

export const { setProjectTabVisibility, setRoomsTabVisibility, setActiveProject, setActiveRoom, closeAll } = sidebarSlice.actions;
export default sidebarSlice.reducer;
