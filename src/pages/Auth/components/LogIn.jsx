import WindowLayout from "./WindowLayout";

import { openSignUp } from "../../../redux/auth";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import Input from "./Input";

const LogIn = ({}) => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const [isFormValid, setFormValid] = useState("");

	const dispatch = useDispatch();

	const swapWindow = (event) => {
		event.preventDefault();
		dispatch(openSignUp());
	};

	const text = {
		submit: "Войти",
		change: "Нет аккаунта? ",
		link: "Войти",
	};

	useEffect(() => {
		setFormValid(username.length && password.length);
	}, [username, password]);

	return (
		<WindowLayout isFormValid={isFormValid} title="Вход" text={text} swapWindow={swapWindow}>
			<Input value={username} onChange={setUsername} type="text" placeholder=" Юзернейм" />
			<Input value={password} onChange={setPassword} type="password" placeholder=" Пароль" />
		</WindowLayout>
	);
};

export default LogIn;
