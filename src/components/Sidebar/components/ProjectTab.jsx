import { closeAll, setActiveProject, setActiveRoom } from "../../../redux/sidebar";
import TabContent from "./TabContent";
import { useDispatch, useSelector } from "react-redux";

const ProjectTab = () => {
	const { projects, activeProject } = useSelector((state) => state.sidebar);

	const dispatch = useDispatch();

	const { role } = useSelector((state) => state.user);
	const { boards } = useSelector((state) => state.data);

	return (
		<TabContent condition={projects}>
			<div className="tab-content__header">
				<h2 className="tab-content__title">Проекты</h2>
				{role === "admin" && <div className="tab-content__newproject">+</div>}
			</div>
			<div className="tab-content__main">
				<ul className="tab-content__list">
					{boards.map((board, index) => (
						<li
							onClick={() => {
								dispatch(setActiveProject(board.name));
								dispatch(setActiveRoom(board.rooms[0].name));
								dispatch(closeAll());
							}}
							key={index}
							className={`tab-content__item${board.name === activeProject ? " tab-content__item_active" : ""}`}
						>
							{board.name}
						</li>
					))}
				</ul>
			</div>
		</TabContent>
	);
};

export default ProjectTab;
