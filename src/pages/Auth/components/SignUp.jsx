import WindowLayout from "./WindowLayout";
import Input from "./Input";

import { openLogIn } from "../../../redux/auth";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";

const SignUp = ({}) => {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const [isFormValid, setFormValid] = useState("");
	const [fetching, setFetching] = useState(false);

	const dispatch = useDispatch();

	const swapWindow = (event) => {
		event.preventDefault();
		dispatch(openLogIn());
	};

	const sendForm = (event) => {
		event.preventDefault();

		if (isFormValid) {
			setFetching(true);
		}
	};

	const text = {
		submit: "Зарегистрироваться",
		change: "Уже есть аккаунт? ",
		link: "Войти",
	};

	useEffect(() => {
		setFormValid(firstName.length && lastName.length && username.length && password.length);
	}, [firstName, lastName, username, password]);

	return (
		<WindowLayout onSubmit={sendForm} isFormValid={isFormValid} title="Регистрация" text={text} swapWindow={swapWindow}>
			<Input value={firstName} onChange={setFirstName} type="text" placeholder=" Имя" />
			<Input value={lastName} onChange={setLastName} type="text" placeholder=" Фамилия" />
			<Input value={username} onChange={setUsername} type="text" placeholder=" Юзернейм" />
			<Input value={password} onChange={setPassword} type="password" placeholder=" Пароль" />
		</WindowLayout>
	);
};

export default SignUp;
