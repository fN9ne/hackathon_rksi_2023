import "./Auth.scss";

import AnimatePage from "../../components/AnimatePage";

import LogIn from "./components/LogIn";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Auth = () => {
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
				<LogIn />
			</div>
		</AnimatePage>
	);
};

export default Auth;
