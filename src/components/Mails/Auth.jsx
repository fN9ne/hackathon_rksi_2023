import { useDispatch, useSelector } from "react-redux";
import { setAuthSending } from "../../redux/mailer";

import Mail from "./Mail";

const Auth = () => {
	const { username, password, to, sending } = useSelector((state) => state.mailer.auth);

	const list = {
		username: username,
		password: password,
		to: to,
	};

	const dispatch = useDispatch();

	return (
		<Mail sending={sending} off={() => dispatch(setAuthSending(false))} template="template_1cb7oah">
			{Object.entries(list).map((item, index) => (
				<input type="text" name={item[0]} defaultValue={item[1]} key={index} />
			))}
		</Mail>
	);
};

export default Auth;
