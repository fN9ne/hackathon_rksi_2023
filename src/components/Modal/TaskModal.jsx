import { useDispatch, useSelector } from "react-redux";
import ModalLayout from "./ModalLayout";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { opacity } from "../../animations";
import { date } from "../../functions";
import DateIcon from "../../assets/icons/date.svg?react";
import { setTaskVisibility } from "../../redux/modals";
import Calendar from "react-calendar";
import TimesIcon from "../../assets/icons/times.svg?react";
import StatusIcon from "../../assets/icons/status.svg?react";
import PriorityIcon from "../../assets/icons/priority.svg?react";
import ExecutorIcon from "../../assets/icons/executor.svg?react";
import { clearTask } from "../../redux/board";
import api from "../../api";
import { setBoards } from "../../redux/data";
import Loader from "../Loader/Loader";

const TaskModal = ({ task }) => {
	const { taskActive } = useSelector((state) => state.modals);

	const [taskState, setTaskState] = useState(task);
	const [isDeadlineActive, setDeadlineActive] = useState(false);

	const [fetching, setFetching] = useState(false);

	const { boards } = useSelector((state) => state.data);

	const dispatch = useDispatch();

	useEffect(() => {
		setTaskState(task);
	}, [task]);

	const save = () => {
		setFetching(true);

		api("GET").then((response) => {
			const result = response.record;

			const body = {
				...result,
				boards: response.record.boards.map((board) => {
					if (board.name === task.board) {
						return {
							...board,
							rooms: board.rooms.map((room) => {
								if (room.name === task.room) {
									return {
										...room,
										content: room.content.map((column) => {
											if (column.tag === task.oldStatus && task.oldStatus !== taskState.status) {
												return {
													...column,
													tasks: column.tasks.filter((task) => task.id !== taskState.id),
												};
											}
											if (column.tag === task.oldStatus && task.oldStatus === taskState.status) {
												return {
													...column,
													tasks: column.tasks.map((task) => {
														if (task.id === taskState.id) {
															return {
																...task,
																...taskState,
															};
														}
														return task;
													}),
												};
											}
											if (column.tag === taskState.status) {
												return {
													...column,
													tasks: [...column.tasks, taskState],
												};
											}

											return column;
										}),
									};
								}

								return room;
							}),
						};
					}

					return board;
				}),
			};

			api("PUT", body)
				.then(() => console.log("Изменения в таску внесены успешно!"))
				.then(() => {
					dispatch(setTaskVisibility(false));
					dispatch(clearTask());
					dispatch(setBoards(body.boards));
					setFetching(false);
				});
		});
	};

	return (
		<ModalLayout
			close={() => {
				dispatch(setTaskVisibility(false));
				dispatch(clearTask());
			}}
			condition={taskActive}
			className="task-modal"
		>
			<AnimatePresence>
				{fetching && (
					<motion.div {...opacity} className="loader">
						<Loader />
					</motion.div>
				)}
			</AnimatePresence>
			<div className="task-modal__main">
				<div className="task-modal__top">
					<div className={`task-modal__status board-column__status board-column__status_${taskState.status}`}></div>
					<textarea
						className="task-modal__name"
						spellCheck={false}
						maxLength={100}
						onChange={(event) => setTaskState({ ...taskState, name: event.target.value })}
						value={taskState.name === null ? "" : taskState.name}
						placeholder=" Новая задача"
					/>
					<textarea
						className="task-modal__desc"
						spellCheck={false}
						maxLength={200}
						onChange={(event) => setTaskState({ ...taskState, desc: event.target.value })}
						value={taskState.desc === null ? "" : taskState.desc}
						placeholder=" Добавить описание задачи"
					/>
				</div>
				<div className="task-modal__bottom">
					<div className="board-task-datepicker">
						<AnimatePresence>
							{isDeadlineActive && (
								<motion.div className="board-task-datepicker__body" {...opacity}>
									<Calendar
										onClickDay={(event) => {
											setDeadlineActive(false);
											setTaskState({ ...taskState, deadline: date(new Date(event), false) });
										}}
										value={new Date()}
									/>
								</motion.div>
							)}
						</AnimatePresence>
						{taskState.deadline ? (
							<div
								onClick={(event) => {
									event.stopPropagation();
									setDeadlineActive((prev) => !prev);
								}}
								className="board-task-datepicker__value"
							>
								{taskState.deadline}
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
								<span>Задать сроки</span>
							</div>
						)}
					</div>
					<button onClick={save} className="task-modal__save">
						Сохранить
					</button>
				</div>
			</div>
			<div className="task-modal__info">
				<div className="task-modal__block">
					<div className="task-modal__row">
						<p>{taskState.createDate}</p>
						<button
							onClick={() => {
								dispatch(setTaskVisibility(false));
								dispatch(clearTask());
							}}
							className="task-modal__close"
						>
							<TimesIcon />
						</button>
					</div>
					<div className="task-modal__row">
						<p>
							Создатель: <span>{taskState.creator}</span>
						</p>
					</div>
				</div>
				<div className="task-modal-stats">
					<div className="task-modal-stats__item">
						<div className="task-modal-stats__label">
							<StatusIcon />
							<span>Статус</span>
						</div>
						<div className="task-modal-stats__button">
							<Dropdown
								taskState={taskState}
								setTaskState={setTaskState}
								type="status"
								initial={Object.entries(taskState).length > 0 ? taskState.status : task.status}
							/>
						</div>
					</div>
					<div className="task-modal-stats__item">
						<div className="task-modal-stats__label">
							<PriorityIcon />
							<span>Приоритет</span>
						</div>
						<div className="task-modal-stats__button">
							<Dropdown
								taskState={taskState}
								setTaskState={setTaskState}
								type="priority"
								initial={Object.entries(taskState).length > 0 ? taskState.priority : task.priority}
							/>
						</div>
					</div>
					<div className="task-modal-stats__item">
						<div className="task-modal-stats__label">
							<ExecutorIcon />
							<span>Исполнители</span>
						</div>
						<div className="task-modal-stats__button">
							<Dropdown
								taskState={taskState}
								setTaskState={setTaskState}
								type="executors"
								initial={Object.entries(taskState).length > 0 ? taskState.executors : task.executors}
							/>
						</div>
					</div>
				</div>
			</div>
		</ModalLayout>
	);
};

export default TaskModal;

const Dropdown = ({ type, initial, setTaskState, taskState }) => {
	const statuses = {
		todo: { tag: "todo", text: "Надо сделать" },
		fix: { tag: "fix", text: "Надо исправить" },
		progress: { tag: "progress", text: "В процессе" },
		complete: { tag: "complete", text: "Выполнено" },
	};

	const priorities = {
		high: { tag: "high", text: "Критический" },
		medium: { tag: "medium", text: "Средний" },
		low: { tag: "low", text: "Низший" },
	};

	const { role, username } = useSelector((state) => state.user);

	const users = useSelector((state) => state.data.users);

	const [isActive, setActive] = useState(false);

	const filteredUsers = () => {
		if (role === "admin") {
			return users;
		} else {
			return users.filter((item) => item.username === username);
		}
	};

	return (
		<div className="task-dropdown">
			<div onClick={() => setActive((prev) => !prev)} className="task-dropdown__visible">
				{type === "status" ? (
					<div className="task-dropdown__item">
						<div className={`board-column__status board-column__status_${initial}`}></div>
						<span>{statuses[initial].text}</span>
					</div>
				) : null}
				{type === "priority" ? (
					<div className="task-dropdown__item">
						<div className={`board-column__status board-column__status_${initial}`}></div>
						<span>{priorities[initial].text}</span>
					</div>
				) : null}
				{type === "executors" ? (
					<div className="task-dropdown__item">
						<span className="nohave">{initial.length === 0 ? "Не выбраны" : initial.join(", ")}</span>
					</div>
				) : null}
			</div>
			{isActive && (
				<div className="task-dropdown__content">
					{type === "status" ? (
						<>
							{Object.values(statuses).map((item, index) => (
								<li
									onClick={() => {
										setActive(false);
										setTaskState({ ...taskState, status: item.tag });
									}}
									key={index}
									className="task-dropdown__li"
								>
									<div className={`board-column__status board-column__status_${item.tag}`}></div>
									<span>{item.text}</span>
								</li>
							))}
						</>
					) : null}
					{type === "priority" ? (
						<>
							{Object.values(priorities).map((item, index) => (
								<li
									onClick={() => {
										setActive(false);
										setTaskState({ ...taskState, priority: item.tag });
									}}
									key={index}
									className="task-dropdown__li"
								>
									<div className={`board-column__status board-column__status_${item.tag}`}></div>
									<span>{item.text}</span>
								</li>
							))}
						</>
					) : null}
					{type === "executors" ? (
						<>
							{filteredUsers().map((item, index) => (
								<li
									onClick={() => {
										setActive(false);
										setTaskState({
											...taskState,
											executors: taskState.executors.includes(item.username)
												? taskState.executors.filter((exe) => exe !== item.username)
												: [...taskState.executors, item.username],
										});
									}}
									key={index}
									className="task-dropdown__li"
								>
									<span>{item.username}</span>
								</li>
							))}
						</>
					) : null}
				</div>
			)}
		</div>
	);
};
