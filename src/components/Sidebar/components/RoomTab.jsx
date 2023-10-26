import TabContent from "./TabContent";

import { useDispatch, useSelector } from "react-redux";

import EditIcon from "../../../assets/icons/edit.svg?react";
import { useRef, useState } from "react";
import api from "../../../api";
import { closeAllSidebar, setActiveRoom } from "../../../redux/sidebar";
import { setBoards } from "../../../redux/data";
import { room } from "../../../instances";
import { AnimatePresence, motion } from "framer-motion";
import Loader from "../../Loader/Loader";
import { opacity } from "../../../animations";
import { useNavigate } from "react-router-dom";

const RoomTab = () => {
	const { rooms, activeRoom, activeProject } = useSelector((state) => state.sidebar);

	const { role } = useSelector((state) => state.user);
	const { boards } = useSelector((state) => state.data);
	const [isNewRoom, setNewRoom] = useState(false);

	const dataRooms = boards.length > 0 ? boards.filter((board) => board.name === activeProject)[0].rooms : [];

	const dispatch = useDispatch();

	const [newRoomValue, setNewRoomValue] = useState("");

	const newRoomRef = useRef();

	const [fetching, setFetching] = useState(false);

	return (
		<TabContent condition={rooms}>
			<AnimatePresence>
				{fetching && (
					<motion.div {...opacity} className="loader">
						<Loader />
					</motion.div>
				)}
			</AnimatePresence>
			<div className="tab-content__header">
				<h2 className="tab-content__title">Комнаты</h2>
				{role === "admin" && (
					<div
						onClick={() => {
							setNewRoom(true);
							setNewRoomValue("");
							setTimeout(() => newRoomRef.current.focus(), 10);
						}}
						className="tab-content__newproject"
					>
						+
					</div>
				)}
			</div>
			<div className="tab-content__current">
				Проект:{" "}
				{activeProject
					? activeProject.split("-").join(" ").slice(0, 1).toUpperCase() + activeProject.split("-").join(" ").slice(1)
					: ""}
			</div>
			<div className="tab-content__main">
				<ul className="tab-content__list">
					{dataRooms.map((room, index) => (
						<Item room={room} key={index} activeRoom={activeRoom} />
					))}
					{isNewRoom && (
						<form
							onSubmit={(event) => {
								event.preventDefault();
								setFetching(true);
								api("GET").then((response) => {
									const result = response.record;

									const body = {
										...result,
										boards: result.boards.map((board) => {
											if (board.name === activeProject) {
												return {
													...board,
													rooms: [...board.rooms, room(newRoomValue)],
												};
											}

											return board;
										}),
									};

									api("PUT", body).then(() => {
										setFetching(false);
										setNewRoom(false);
										dispatch(setBoards(body.boards));
									});
								});
							}}
							className="tab-content__item"
						>
							<input
								ref={newRoomRef}
								type="text"
								onChange={(event) => setNewRoomValue(event.target.value)}
								value={newRoomValue}
							/>
						</form>
					)}
				</ul>
			</div>
		</TabContent>
	);
};

export default RoomTab;

const Item = ({ room, activeRoom }) => {
	const [value, setValue] = useState(room.name);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { activeProject } = useSelector((state) => state.sidebar);

	return (
		<form
			className={`tab-content__item${room.name === activeRoom ? " tab-content__item_active" : ""}`}
			onClick={() => {
				dispatch(setActiveRoom(room.name));
				dispatch(closeAllSidebar());
				navigate("/app/board");
			}}
		>
			<div className="tab-content__item_text">{room.name}</div>
		</form>
	);
};
