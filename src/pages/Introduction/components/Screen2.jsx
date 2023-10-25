import { useDispatch, useSelector } from "react-redux";

import Input from "../../../components/Input";
import Screen from "./Screen";
import Continue from "./Continue";

import { setTeam } from "../../../redux/intro";
import Back from "./Back";

const Screen2 = () => {
	const dispatch = useDispatch();

	const { team } = useSelector((state) => state.intro);

	return (
		<Screen title="Команда" text="Как вы с товарищами себя называете?" step="2">
			<div className="intro-screen__body">
				<Input type="text" placeholder=" Название команды" value={team || ""} onChange={(value) => dispatch(setTeam(value))} />
			</div>
			<div className="intro-screen__footer">
				<Back />
				<Continue disabled={team ? team.length < 2 : true} />
			</div>
		</Screen>
	);
};

export default Screen2;
