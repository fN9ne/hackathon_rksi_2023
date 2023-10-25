import CryptoJS from "crypto-js";

import WindowLayout from "./WindowLayout";
import Input from "../../../components/Input";

import { openLogIn } from "../../../redux/auth";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";

import api from "../../../api";
import { useNavigate } from "react-router-dom";
import { setUser } from "../../../redux/user";

const SignUp = ({}) => {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const [isFormValid, setFormValid] = useState("");
	const [fetching, setFetching] = useState(false);
	const [error, setError] = useState("");

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const swapWindow = (event) => {
		event.preventDefault();
		dispatch(openLogIn());
	};

	const sendForm = (event) => {
		event.preventDefault();

		if (isFormValid) {
			setFetching(true);

			api("GET")
				.then((response) => {
					const users = response.record.users;

					if (users.filter((user) => user.username === username).length > 0) {
						setError("Пользователь с таким юзернеймом уже зарегистрирован");
						setFetching(false);
					} else {
						setError("");

						return response.record;
					}
				})
				.then((response) => {
					if (response) {
						const body = {
							...response,
							users: [
								...response.users,
								{
									firstName: firstName,
									lastName: lastName,
									username: username,
									password: CryptoJS.MD5(password) + "",
									teams: [],
								},
							],
						};

						api("PUT", body)
							.then(() => setFetching(false))
							.then(() => {
								dispatch(setUser({ firstName: firstName, lastName: lastName, username: username, teams: [] }));
							})
							.then(() => {
								navigate("/introduction");
							});
					}
				});
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
		<WindowLayout
			fetching={fetching}
			onSubmit={sendForm}
			isFormValid={isFormValid}
			title="Регистрация"
			text={text}
			swapWindow={swapWindow}
			error={error}
		>
			<Input value={firstName} onChange={setFirstName} type="text" placeholder=" Имя" />
			<Input value={lastName} onChange={setLastName} type="text" placeholder=" Фамилия" />
			<Input value={username} onChange={setUsername} type="text" placeholder=" Юзернейм" />
			<Input value={password} onChange={setPassword} type="password" placeholder=" Пароль" />
		</WindowLayout>
	);
};

export default SignUp;
