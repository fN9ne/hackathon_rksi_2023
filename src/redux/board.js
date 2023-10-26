import { createSlice } from "@reduxjs/toolkit";
import { task } from "../instances";

const boardSlice = createSlice({
	name: "board",
	initialState: {
		data: [],
		task: {},
	},
	reducers: {
		setTask(state, action) {
			state.task = action.payload;
		},
		clearTask(state) {
			state.task = {};
		},
		setData(state, action) {
			state.data = action.payload;
		},
		changeName(state, action) {
			state.data.name = action.payload;
		},
		createNewTask(state, action) {
			return {
				task: state.task,
				data: {
					...state.data,
					rooms: state.data.rooms.map((room) => {
						if (room.name === action.payload.room) {
							return {
								...room,
								content: room.content.map((column) => {
									if (column.tag === action.payload.status) {
										return {
											...column,
											tasks: [
												...column.tasks,
												{ id: new Date().getTime(), ...task({ ...action.payload.newTaskData }), new: true },
											],
										};
									}

									return column;
								}),
							};
						}

						return room;
					}),
				},
			};
		},
		editTask(state, action) {
			return {
				task: state.task,
				data: {
					...state.data,
					rooms: state.data.rooms.map((room) => {
						if (room.name === action.payload.room) {
							return {
								...room,
								content: room.content.map((column) => {
									if (column.tag === action.payload.status) {
										return {
											...column,
											tasks: column.tasks.map((editedTask) => {
												if (editedTask.id === action.payload.id) {
													return {
														...editedTask,
														...action.payload.newData,
													};
												}

												return editedTask;
											}),
										};
									}

									return column;
								}),
							};
						}

						return room;
					}),
				},
			};
		},
		removeTask(state, action) {
			return {
				task: state.task,
				data: {
					...state.data,
					rooms: state.data.rooms.map((room) => {
						if (room.name === action.payload.room) {
							return {
								...room,
								content: room.content.map((column) => {
									if (column.tag === action.payload.status) {
										return {
											...column,
											tasks: column.tasks.filter((task) => task.id !== action.payload.id),
										};
									}

									return column;
								}),
							};
						}

						return room;
					}),
				},
			};
		},
		changeCol(state, action) {
			const task = state.data.rooms
				.filter((room) => room.name === action.payload.room)[0]
				.content.filter((column) => column.tag === action.payload.status)[0]
				.tasks.filter((task) => task.id === action.payload.id)[0];

			return {
				task: state.task,
				data: {
					...state.data,
					rooms: state.data.rooms.map((room) => {
						if (room.name === action.payload.room) {
							return {
								...room,
								content: room.content.map((column) => {
									if (column.tag === action.payload.status) {
										return {
											...column,
											tasks: column.tasks.filter((task) => task.id !== action.payload.id),
										};
									}
									if (column.tag === action.payload.newStatus) {
										return {
											...column,
											tasks: [
												...column.tasks,
												{
													...task,
													status: action.payload.newStatus,
												},
											],
										};
									}
									return column;
								}),
							};
						}

						return room;
					}),
				},
			};
		},
	},
});

export const { setData, changeName, createNewTask, editTask, removeTask, changeCol, setTask, clearTask } = boardSlice.actions;
export default boardSlice.reducer;
