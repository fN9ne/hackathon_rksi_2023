import { useDispatch, useSelector } from "react-redux";
import { setAppointmentSending } from "../../redux/mailer";

import Mail from "./Mail";

const Appointment = () => {
	const { task_name, room, deadline, to, sending } = useSelector((state) => state.mailer.appointment);

	const list = {
		task_name: task_name,
		deadline: deadline,
		room: room,
		to: to,
		team: "TaskFlow",
	};

	const dispatch = useDispatch();

	return (
		<Mail sending={sending} off={() => dispatch(setAppointmentSending(false))} template="template_8bqxx4a">
			{Object.entries(list).map((item, index) => (
				<input type="text" name={item[0]} defaultValue={item[1]} key={index} />
			))}
		</Mail>
	);
};

export default Appointment;
