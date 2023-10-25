import { useDispatch } from "react-redux";
import { listScreen } from "../../../redux/intro";

const Back = () => {
	const dispatch = useDispatch();

	return (
		<button onClick={() => dispatch(listScreen(-1))} type="button" className="button button_back">
			Вернуться назад
		</button>
	);
};

export default Back;
