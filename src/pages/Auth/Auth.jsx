import "./Auth.scss";

import AnimatePage from "../../components/AnimatePage";

import { useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import SignUp from "./components/SignUp";
import { slide } from "../../animations";
import LogIn from "./components/LogIn";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Auth = () => {
	const { signUpActive, logInActive } = useSelector((state) => state.auth);

	const { username } = useSelector((state) => state.user);

	const navigate = useNavigate();

	useEffect(() => {
		if (username) {
			navigate("/app/board");
		}
	}, [username]);

	return (
		<AnimatePage className="authpage">
			<div className="authpage__content">
				<AnimatePresence mode="wait" initial={false}>
					{signUpActive && (
						<motion.div {...slide} key="signUp" className="authpage__item">
							<SignUp />
						</motion.div>
					)}
					{logInActive && (
						<motion.div {...slide} key="logIn" className="authpage__item">
							<LogIn />
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</AnimatePage>
	);
};

export default Auth;
