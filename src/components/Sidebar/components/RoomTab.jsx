import TabContent from "./TabContent";

import { useDispatch, useSelector } from "react-redux";

import EditIcon from "../../../assets/icons/edit.svg?react";
import { useRef, useState } from "react";
import api from "../../../api";

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
						const board = response.boards.filter((board) => board.name === activeProject)[0];
						const room = board.rooms.filter((room) => room.name === activeRoom)[0];

						const body = {
							...response,
							boards: [
								...response.boards.filter((board) => board.name !== activeProject),
								{
									...board,
									rooms: [
										...board.rooms.filter((room) => room.name !== activeRoom),
										{
											...room,
											name: value,
										},
									],
								},
							],
						};

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
