import "./Board.scss";

import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { opacity } from "../../animations";
import Loader from "../../components/Loader/Loader";
import Content from "./components/Content";
import TaskModal from "../../components/Modal/TaskModal";

const Board = () => {
	const [fetching, setFetching] = useState(true);

	const { boards } = useSelector((state) => state.data);
	const { activeProject, activeRoom } = useSelector((state) => state.sidebar);

	const { data, task } = useSelector((state) => state.board);

	const { role } = useSelector((state) => state.user);

	useEffect(() => {
		if (boards.length > 0 && activeProject && activeRoom) {
			setFetching(false);
		}
	}, [boards, activeProject, activeRoom]);

	useEffect(() => {
		if (Object.entries(data).length > 0) {
			// console.log("Board changed!");
		}
	}, [data]);

	return (
		<div className="board">
			<TaskModal task={task} />
			<AnimatePresence mode="wait" initial={false}>
				{fetching && (
					<motion.div key="loader" {...opacity} className="loader">
						<Loader />
					</motion.div>
				)}
				{!fetching && (
					<motion.div key="content" {...opacity} className="board__container">
						{role === "admin" && <header className="board__header"></header>}
						<Content />
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default Board;
