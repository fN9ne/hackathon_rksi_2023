import CryptoJS from "crypto-js";

import WindowLayout from "./WindowLayout";
import Input from "../../../components/Input";

import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";

import api from "../../../api";
import { setUser } from "../../../redux/user";
import { setAuth, setAuthSending } from "../../../redux/mailer";
import { setUsers } from "../../../redux/data";
import { genereatePassword } from "../../../functions";

const SignUp = ({}) => {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");

	const [isFormValid, setFormValid] = useState("");
	const [fetching, setFetching] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const dispatch = useDispatch();

	const swapWindow = (event) => {
		event.preventDefault();
		dispatch(openLogIn());
	};

	const sendForm = (event) => {
		event.preventDefault();

		const password = genereatePassword();

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
									email: email,
									role: "executor",
								},
							],
						};

						api("PUT", body)
							.then(() => setFetching(false))
							.then(() => {
								dispatch(setUsers(body.users));
								setSuccess("Пользователь успешно зарегистрирован! Логин и пароль для авторизации отправленые ему на почту!");
								dispatch(setAuth({ username: username, password: password, to: email }));
								dispatch(setAuthSending(true));
							});
					}
				});
		}
	};

	const text = {
		submit: "Зарегистрировать",
		change: "Уже есть аккаунт? ",
		link: "Войти",
	};

	genereatePassword();

	useEffect(() => {
		setFormValid(firstName.length && email.length && lastName.length && username.length);
	}, [firstName, lastName, username, email]);

	return (
		<WindowLayout
			fetching={fetching}
			onSubmit={sendForm}
			isFormValid={isFormValid}
			title="Зарегистрировать участника"
			text={text}
			swapWindow={swapWindow}
			error={error}
			success={success}
		>
			<Input value={firstName} onChange={setFirstName} type="text" placeholder=" Имя" />
			<Input value={lastName} onChange={setLastName} type="text" placeholder=" Фамилия" />
			<Input value={username} onChange={setUsername} type="text" placeholder=" Юзернейм" />
			<Input value={email} onChange={setEmail} type="text" placeholder=" Email" />
		</WindowLayout>
	);
};

export default SignUp;
