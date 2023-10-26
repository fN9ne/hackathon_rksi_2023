import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	appointment: {
		task_name: "",
		deadline: "",
		to: "",
		room: "",
		team: "TaskFlow",
		sending: false,
	},
	auth: {
		username: "",
		password: "",
		to: "",
		team: "TaskFlow",
		sending: false,
	},
};

const mailerSlice = createSlice({
	name: "mailer",
	initialState,
	reducers: {
		setAuthSending(state, action) {
			state.auth.sending = action.payload;
		},
		setAuth(state, action) {
			return {
				...state,
				auth: {
					...state.auth,
					...action.payload,
				},
			};
		},
		setAppointmentSending(state, action) {
			state.appointment.sending = action.payload;
		},
		setAppointment(state, action) {
			return {
				...state,
				appointment: {
					...state.appointment,
					...action.payload,
				},
			};
		},
	},
});

export const { setAppointment, setAppointmentSending, setAuth, setAuthSending } = mailerSlice.actions;
export default mailerSlice.reducer;
