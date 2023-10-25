import { useDispatch, useSelector } from "react-redux";

import Input from "../../../components/Input";
import Screen from "./Screen";
import Continue from "./Continue";

import { setTeam } from "../../../redux/intro";
import Back from "./Back";
import { useEffect, useState } from "react";

const Screen2 = () => {
	const dispatch = useDispatch();

	const { team } = useSelector((state) => state.intro);
	const { teams } = useSelector((state) => state.data);

	const [error, setError] = useState("");

	useEffect(() => {
		if (teams.includes(team)) {
			setError("Такая команда уже существует.");
		} else {
			setError("");
		}
	}, [team, teams]);

	return (
		<Screen title="Команда" text="Как вы с товарищами себя называете?" step="2">
			<div className="intro-screen__body">
				<Input type="text" placeholder=" Название команды" value={team || ""} onChange={(value) => dispatch(setTeam(value))} />
			</div>
			{error.length && <div className="intro-screen__error">{error}</div>}
			<div className="intro-screen__footer">
				<Back />
				<Continue disabled={team ? (team.length < 2 ? true : error.length ? true : false) : true} />
			</div>
		</Screen>
	);
};

export default Screen2;
