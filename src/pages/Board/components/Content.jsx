import { useDispatch, useSelector } from "react-redux";

import SadEmoji from "../../../assets/icons/sad_emoji.png";
import DateIcon from "../../../assets/icons/date.svg?react";
import MoreIcon from "../../../assets/icons/more.svg?react";

import { AnimatePresence, motion } from "framer-motion";
import { opacity } from "../../../animations";
import { task } from "../../../instances";

import { date, getMonthName } from "../../../functions";
import { useEffect, useRef, useState } from "react";
import DateTimePicker from "react-datetime-picker";
import Calendar from "react-calendar";
import { changeCol, createNewTask, editTask, removeTask, setTask } from "../../../redux/board";
import api from "../../../api";
import { setTaskVisibility } from "../../../redux/modals";
import DeleteIcon from "../../../assets/icons/delete.svg?react";
import Loader from "../../../components/Loader/Loader";
import { setActiveRoom } from "../../../redux/sidebar";
import { setBoards } from "../../../redux/data";

const Content = () => {
	const { activeProject, activeRoom } = useSelector((state) => state.sidebar);
	const { data } = useSelector((state) => state.board);

	const { role } = useSelector((state) => state.user);
	const board = useSelector((state) => state.board.data);

	const [currentBoard, setCurrentBoard] = useState({ content: [] });

	useEffect(() => {
		if (activeProject && activeRoom && data) {
			setCurrentBoard(data.rooms.filter((room) => room.name === activeRoom)[0]);
		}
	}, [activeProject, activeRoom, data]);

	const [fetching, setFetching] = useState(false);

	const dispatch = useDispatch();

	const removeRoom = () => {
		setFetching(true);
		api("GET").then((response) => {
			const result = response.record;

			const body = {
				...result,
				boards: result.boards.map((board) => {
					if (board.name === data.name) {
						return {
							...board,
							rooms: board.rooms.filter((room) => room.name !== activeRoom),
						};
					}

					return board;
				}),
			};

			console.log(body.boards[0].rooms[0]); // HOT_FIXES: если надо будет всё-таки делать проекты отдельные, то вот это меняй
			api("PUT", body).then(() => {
				dispatch(setActiveRoom(body.boards[0].rooms[0].name));
				dispatch(setBoards(body.boards));
				setFetching(false);
			});
		});
	};

	const [roomName, setRoomName] = useState(activeRoom);

	useEffect(() => {
		setRoomName(activeRoom);
	}, [activeRoom]);

	return (
		<>
			<AnimatePresence>
				{fetching && (
					<motion.div className="loader" {...opacity}>
						<Loader />
					</motion.div>
				)}
			</AnimatePresence>
			{role === "admin" ? (
				<div className="board__room">
					<form
						onSubmit={(event) => {
							event.preventDefault();

							api("GET")
								.then((response) => {
									const result = response.record;
									return result;
								})
								.then((response) => {
									dispatch(setActiveRoom(roomName));

									const body = {
										...response,
										boards: response.boards.map((board) => {
											if (board.name === activeProject) {
												return {
													...board,
													rooms: board.rooms.map((room) => {
														if (room.name === activeRoom) {
															return { ...room, name: roomName };
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
						className="board__roomhead"
					>
						<h3 className="board__roomnamesub">Текущая комната: </h3>
						<input
							type="text"
							className="board__roomname"
							value={roomName}
							onChange={(event) => setRoomName(event.target.value)}
						/>
					</form>
					{board.rooms.length > 1 && (
						<button onClick={removeRoom} className="button board__remove">
							<DeleteIcon />
							<span>Удалить комнату</span>
						</button>
					)}
				</div>
			) : null}
			<div className="board__content">
				{currentBoard.content.map((column, index) => (
					<Column room={currentBoard.name} data={column} key={index} />
				))}
			</div>
		</>
	);
};

export default Content;

const Column = ({ room, data }) => {
	const { username, firstName, lastName } = useSelector((state) => state.user);

	const board = useSelector((state) => state.board.data);
	const boards = useSelector((state) => state.data.boards);

	const [send, setSend] = useState(false);

	const dispatch = useDispatch();

	const newTask = () => {
		dispatch(
			createNewTask({
				room: room,
				status: data.tag,
				newTaskData: {
					status: data.tag,
					creator: `${username}, ${firstName} ${lastName}`,
				},
			})
		);
	};

	useEffect(() => {
		if (send) {
			const newBoards = boards.map((newBoard) => {
				if (newBoard.name === board.name) {
					return board;
				}
				return newBoard;
			});

			api("GET").then((response) => {
				const result = response.record;

				const body = {
					...result,
					boards: newBoards,
				};

				api("PUT", body).then(() => console.log("Данные успешно изменены!"));
			});

			setSend(false);
		}
	}, [send]);

	return (
		<div className="board-column">
			<header className="board-column__header">
				<div>
					<div className={`board-column__status board-column__status_${data.tag}`}></div>
					<h2 className="board-column__name">{data.name}</h2>
					{data.tasks.length > 0 && <div className="board-column__amount">{data.tasks.length}</div>}
				</div>
				<div>
					<button onClick={newTask} className="board-column__minibutton">
						+
					</button>
				</div>
			</header>
			<div className="board-column__body">
				<AnimatePresence mode="wait" initial={false}>
					{data.tasks.length === 0 && (
						<motion.div key="empty" {...opacity} className="board-column-empty">
							<div>
								<img src={SadEmoji} alt="sad emoji" />
								<span>Эта колонка пока-что пуста</span>
							</div>
							<button onClick={newTask} className="board-column-empty__new">
								+ Добавить задачу
							</button>
						</motion.div>
					)}
					{data.tasks.length !== 0 && (
						<motion.ul key="list" {...opacity} className="board-column__list">
							{data.tasks.map((task, index) => (
								<Task setSend={setSend} room={room} data={data} task={task} key={index} />
							))}
						</motion.ul>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
};

const Task = ({ room, data, task, setSend }) => {
	const handleEditTask = ({ id, newData }) => dispatch(editTask({ room: room, status: data.tag, id: id, newData: newData }));

	const dispatch = useDispatch();

	const boardName = useSelector((state) => state.board.data);

	const [deadline, setDeadline] = useState();
	const [deadlineString, setDeadlineString] = useState(task.deadline ? task.deadline : "");
	const [isDeadlineEmpty, setDeadlineEmpty] = useState(!task.deadline ? true : false);
	const [isDeadlineActive, setDeadlineActive] = useState(false);
	const [deadlineFormat, setDeadlineFormat] = useState(
		!task.deadline
			? new Date()
			: new Date(`${task.deadline.split(" ")[0]} ${getMonthName(task.deadline.split(" ")[1], false, true)}`)
	);

	const [isMoreActive, setMoreActive] = useState(false);

	useEffect(() => {
		if (!isDeadlineEmpty) {
			setDeadlineString(date(new Date(deadlineFormat), false));
			setDeadline(date(new Date(deadlineFormat), false));
			setSend(true);
		}
	}, [deadlineFormat]);

	return (
		<li
			className={`board-task board-task_${task.priority} board-task_${task.weight}`}
			onClick={(event) => {
				if (!event.target.closest(".board-task-datepicker")) setDeadlineActive(false);
				if (!event.target.closest(".board-task-more-content, .board-task__more")) setMoreActive(false);
				dispatch(setTask({ ...task, board: boardName.name, room: room, oldStatus: task.status }));
				dispatch(setTaskVisibility(true));
			}}
		>
			<div className="board-task__header">
				<div className={`board-task__status board-column__status board-column__status_${task.status}`} />
				<button
					onClick={(event) => {
						event.stopPropagation();
						setMoreActive((prev) => !prev);
					}}
					className="board-task__more"
				>
					<MoreIcon />
				</button>
				<div
					onClick={(event) => {
						event.stopPropagation();
					}}
					className={`board-task-more-content${isMoreActive ? " board-task-more-content_active" : ""}`}
				>
					<button
						onClick={() => {
							dispatch(removeTask({ room: room, status: data.tag, id: task.id }));
							setMoreActive(false);
							setSend(true);
						}}
						className="board-task-more-content__item"
					>
						Удалить
					</button>
					<h3 className="board-task-more-content__title">Переместить в</h3>
					<button
						onClick={() => {
							if (data.tag !== "todo") {
								dispatch(changeCol({ room: room, status: data.tag, id: task.id, newStatus: "todo" }));
								setSend(true);
							}
							setMoreActive(false);
						}}
						className="board-task-more-content__item"
					>
						<div className={`board-column__status board-column__status_todo`}></div>
						<span>Нужно сделать</span>
					</button>
					<button
						onClick={() => {
							if (data.tag !== "fix") {
								dispatch(changeCol({ room: room, status: data.tag, id: task.id, newStatus: "fix" }));
								setSend(true);
							}
							setMoreActive(false);
						}}
						className="board-task-more-content__item"
					>
						<div className={`board-column__status board-column__status_fix`}></div>
						<span>Нужно исправить</span>
					</button>
					<button
						onClick={() => {
							if (data.tag !== "progress") {
								dispatch(changeCol({ room: room, status: data.tag, id: task.id, newStatus: "progress" }));
								setSend(true);
							}
							setMoreActive(false);
						}}
						className="board-task-more-content__item"
					>
						<div className={`board-column__status board-column__status_progress`}></div>
						<span>В процессе</span>
					</button>
					<button
						onClick={() => {
							if (data.tag !== "complete") {
								dispatch(changeCol({ room: room, status: data.tag, id: task.id, newStatus: "complete" }));
								setSend(true);
							}
							setMoreActive(false);
						}}
						className="board-task-more-content__item"
					>
						<div className={`board-column__status board-column__status_complete`}></div>
						<span>Выполнено</span>
					</button>
				</div>
			</div>
			<textarea
				onClick={(event) => {
					event.stopPropagation();
				}}
				spellCheck={false}
				maxLength={100}
				onChange={(event) =>
					handleEditTask({
						id: task.id,
						newData: {
							name: event.target.value,
						},
					})
				}
				value={task.name ? task.name : ""}
				placeholder=" Новая задача"
			/>
			<div className="board-task__footer">
				<div className="board-task-datepicker">
					<AnimatePresence>
						{isDeadlineActive && (
							<motion.div
								onClick={(event) => {
									event.stopPropagation();
								}}
								className="board-task-datepicker__body"
								{...opacity}
							>
								<Calendar
									onChange={setDeadlineFormat}
									onClickDay={(event) => {
										setDeadlineEmpty(false);
										setDeadlineActive(false);
										handleEditTask({
											id: task.id,
											newData: {
												deadline: date(new Date(event), false),
											},
										});
									}}
									value={deadlineFormat}
								/>
							</motion.div>
						)}
					</AnimatePresence>
					{deadlineString.length ? (
						<div
							onClick={(event) => {
								event.stopPropagation();
								setDeadlineActive((prev) => !prev);
							}}
							className="board-task-datepicker__value"
						>
							{deadlineString}
						</div>
					) : (
						<div
							onClick={(event) => {
								event.stopPropagation();
								setDeadlineActive((prev) => !prev);
							}}
							className="board-task-datepicker__label"
						>
							<DateIcon />
						</div>
					)}
				</div>
				{task.new ? (
					<div onClick={(event) => event.stopPropagation()} className="board-task__buttons">
						<button
							onClick={() => dispatch(removeTask({ room: room, status: data.tag, id: task.id }))}
							className="board-task__create board-task__create_remove"
						>
							Удалить
						</button>
						<button
							onClick={() => {
								dispatch(
									editTask({
										room: room,
										status: data.tag,
										id: task.id,
										newData: {
											new: false,
										},
									})
								);
								setSend(true);
							}}
							className="board-task__create"
						>
							Создать
						</button>
					</div>
				) : null}
				{task.executors.length > 0 ? <div className="board-task__executors">{task.executors.join(", ")}</div> : null}
			</div>
			{task.categories.length > 0 ? (
				<div className="board-task__categories">
					{task.categories.map((category, index) => (
						<li className="board-task__category" key={index}>
							{category}
						</li>
					))}
				</div>
			) : null}
		</li>
	);
};
