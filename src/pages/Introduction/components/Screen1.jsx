import { useDispatch, useSelector } from "react-redux";

import Input from "../../../components/Input";
import Screen from "./Screen";
import Continue from "./Continue";

import { setProject } from "../../../redux/intro";

const Screen1 = () => {
	const dispatch = useDispatch();

	const { project } = useSelector((state) => state.intro);

	return (
		<Screen title="Поздравляем!" text="Самое время для вашего первого проекта!" step="1">
			<div className="intro-screen__body">
				<Input
					type="text"
					placeholder=" Название проекта"
					value={project || ""}
					onChange={(value) => dispatch(setProject(value))}
				/>
			</div>
			<div className="intro-screen__footer">
				<div />
				<Continue disabled={project ? project.length < 5 : true} />
			</div>
		</Screen>
	);
};

export default Screen1;
