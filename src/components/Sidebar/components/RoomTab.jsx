import TabContent from "./TabContent";

import { useDispatch, useSelector } from "react-redux";

import EditIcon from "../../../assets/icons/edit.svg?react";
import { useRef, useState } from "react";
import api from "../../../api";
import { setActiveRoom } from "../../../redux/sidebar";
import { setBoards } from "../../../redux/data";

const RoomTab = () => {
	const { rooms, activeRoom, activeProject } = useSelector((state) => state.sidebar);

	const { role } = useSelector((state) => state.user);
	const { boards } = useSelector((state) => state.data);

	const dataRooms = boards.length > 0 ? boards.filter((board) => board.name === activeProject)[0].rooms : [];

	return (
		<TabContent condition={rooms}>
			<div className="tab-content__header">
				<h2 className="tab-content__title">Комнаты</h2>
				{role === "admin" && <div className="tab-content__newproject">+</div>}
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
				</ul>
			</div>
		</TabContent>
	);
};

export default RoomTab;

const Item = ({ room, activeRoom }) => {
	const [readOnly, setReadOnly] = useState(true);
	const [value, setValue] = useState(room.name);

	const dispatch = useDispatch();

	const ref = useRef();

	const { rooms, activeProject } = useSelector((state) => state.sidebar);

	const onChange = (event) => {
		setValue(event.target.value);
	};

	return (
		<form
			onSubmit={(event) => {
				event.preventDefault();
				setReadOnly(true);

				api("GET")
					.then((response) => {
						const result = response.record;
						return result;
					})
					.then((response) => {
						dispatch(setActiveRoom(value));

						const body = {
							...response,
							boards: response.boards.map((board) => {
								if (board.name === activeProject) {
									return {
										...board,
										rooms: board.rooms.map((room) => {
											if (room.name === activeRoom) {
												return { ...room, name: value };
											}
											return room;
										}),
									};
								}
								return board;
							}),
						};

						dispatch(setBoards(body.boards));

						api("PUT", body).then(() => console.log("Название команты изменено успешно!"));
					});
			}}
			className={`tab-content__item${room.name === activeRoom ? " tab-content__item_active" : ""}`}
		>
			<input ref={ref} type="text" readOnly={readOnly} onChange={onChange} value={value} />
			<button
				type="button"
				onClick={(event) => {
					event.stopPropagation();
					setReadOnly((prev) => !prev);
					ref.current.focus();
				}}
				className="tab-content__edit"
			>
				<EditIcon />
			</button>
		</form>
	);
};
