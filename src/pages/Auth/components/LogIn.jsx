import WindowLayout from "./WindowLayout";

import { openSignUp } from "../../../redux/auth";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import Input from "../../../components/Input";
import { useNavigate } from "react-router-dom";
import api from "../../../api";
import CryptoJS from "crypto-js";
import { setUser } from "../../../redux/user";

const LogIn = ({}) => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const [isFormValid, setFormValid] = useState("");
	const [fetching, setFetching] = useState(false);
	const [error, setError] = useState("");

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const swapWindow = (event) => {
		event.preventDefault();
		dispatch(openSignUp());
	};

	const sendForm = (event) => {
		event.preventDefault();

		if (isFormValid) {
			setFetching(true);

			api("GET")
				.then((response) => {
					const users = response.record.users;

					const userData = users.filter((user) => user.username === username && user.password === CryptoJS.MD5(password) + "");

					if (userData.length > 0) {
						setError("");
						return userData;
					} else {
						setError("Неверное имя пользователя или пароль");
						setFetching(false);
					}
				})
				.then((response) => {
					if (response) {
						dispatch(
							setUser({
								username: username,
								firstName: response[0].firstName,
								lastName: response[0].lastName,
								teams: response[0].teams,
							})
						);
						setFetching(false);
						navigate("/board");
					}
				});
		}
	};

	const text = {
		submit: "Войти",
		change: "Нет аккаунта? ",
		link: "Зарегистрироваться",
	};

	useEffect(() => {
		setFormValid(username.length && password.length);
	}, [username, password]);

	return (
		<WindowLayout
			fetching={fetching}
			onSubmit={sendForm}
			error={error}
			isFormValid={isFormValid}
			title="Вход"
			text={text}
			swapWindow={swapWindow}
		>
			<Input value={username} onChange={setUsername} type="text" placeholder=" Юзернейм" />
			<Input value={password} onChange={setPassword} type="password" placeholder=" Пароль" />
		</WindowLayout>
	);
};

export default LogIn;
