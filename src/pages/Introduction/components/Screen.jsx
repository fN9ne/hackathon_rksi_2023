import { useDispatch } from "react-redux";
import { listScreen } from "../../../redux/intro";

const Screen = ({ title, text, step, children, finish = false }) => {
	const dispatch = useDispatch();

	const nextScreen = (event, finish) => {
		event.preventDefault();

		if (!finish) {
			dispatch(listScreen(1));
		}
	};

	return (
		<form action="#" onSubmit={(event) => nextScreen(event, finish)} className="intro-screen">
			<h2 className="intro-screen__title">{title}</h2>
			<div className="text text_center">{text}</div>
			<div className="intro-screen__delimiter">
				<span></span>
				<div className="intro-screen__step">Шаг {step}</div>
				<span></span>
			</div>
			<div className="intro-screen__content">{children}</div>
		</form>
	);
};

export default Screen;
