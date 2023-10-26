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
};

const mailerSlice = createSlice({
	name: "mailer",
	initialState,
	reducers: {
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

export const { setAppointment, setAppointmentSending } = mailerSlice.actions;
export default mailerSlice.reducer;
