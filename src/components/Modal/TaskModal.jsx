import { useDispatch, useSelector } from "react-redux";
import ModalLayout from "./ModalLayout";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { opacity } from "../../animations";
import { date } from "../../functions";
import DateIcon from "../../assets/icons/date.svg?react";
import { setTaskVisibility } from "../../redux/modals";
import Calendar from "react-calendar";
import TimesIcon from "../../assets/icons/times.svg?react";
import StatusIcon from "../../assets/icons/status.svg?react";
import WeightIcon from "../../assets/icons/weight.svg?react";
import PriorityIcon from "../../assets/icons/priority.svg?react";
import ExecutorIcon from "../../assets/icons/executor.svg?react";
import { clearTask, setSave, setTask } from "../../redux/board";
import api from "../../api";
import { setBoards } from "../../redux/data";
import Loader from "../Loader/Loader";

const TaskModal = ({ task }) => {
	const { taskActive } = useSelector((state) => state.modals);

	const [taskState, setTaskState] = useState(task);
	const [isDeadlineActive, setDeadlineActive] = useState(false);

	const [fetching, setFetching] = useState(false);

	const { boards } = useSelector((state) => state.data);

	const { firstName, lastName, username } = useSelector((state) => state.user);

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
					dispatch(setSave(true));
					setFetching(false);
				});
		});
	};

	const messageRef = useRef();
	const trackRef = useRef();

	const categories = ["#воспитательная_работа", "#проектная_работа", "#профориентационная_работа"];

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
					<div className="task-modal__general">
						<div className="task-modal__heading">
							<div className={`task-modal__status board-column__status board-column__status_${taskState.status}`}></div>
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
						</div>
						<textarea
							className="task-modal__name"
							spellCheck={false}
							maxLength={100}
							onChange={(event) => setTaskState({ ...taskState, name: event.target.value })}
							value={taskState.name === null ? "" : taskState.name}
							placeholder=" Новая задача"
						/>
						<div className="counter">
							Символов ({taskState.name !== null && Object.entries(taskState).length > 0 ? taskState.name.length : 0}/100)
						</div>
						<textarea
							className="task-modal__desc"
							spellCheck={false}
							maxLength={300}
							onChange={(event) => setTaskState({ ...taskState, desc: event.target.value })}
							value={taskState.desc === null ? "" : taskState.desc}
							placeholder=" Добавить описание задачи"
						/>
						<div className="counter">
							Символов ({taskState.desc !== null && Object.entries(taskState).length > 0 ? taskState.desc.length : 0}/300)
						</div>
						<div className="chat">
							<div className="chat__track" ref={trackRef}>
								{Object.entries(taskState).length > 0 &&
									taskState.chat.map((message, index) => (
										<div key={index} className={`chat-item${message.username === username ? " chat-item_right" : ""}`}>
											<div className="chat-item__header">
												<div>
													<div className="chat-item__fio">{message.fio}</div>
													<div className="chat-item__nick">(@{message.username})</div>
												</div>
												<div className="chat-item__date">{message.date}</div>
											</div>
											<div className="chat-item__body">{message.message}</div>
										</div>
									))}
							</div>
							<form
								action="#"
								onSubmit={(event) => {
									event.preventDefault();

									const message = {
										fio: `${firstName} ${lastName}`,
										username: `${username}`,
										date: date(new Date(), false, true),
										message: event.target.message.value,
									};

									setTaskState({ ...taskState, chat: [...taskState.chat, message] });

									setTimeout(() => {
										trackRef.current.scrollBy({ top: 10000, behavior: "smooth" });
									}, 0);

									if (event.target.message.value !== "" && event.target.message.value !== " ") {
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
																			if (column.tag === taskState.status) {
																				return {
																					...column,
																					tasks: column.tasks.map((task) => {
																						if (task.id === taskState.id) {
																							return {
																								...task,
																								chat: [...task.chat, message],
																							};
																						}
																						return task;
																					}),
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

											api("PUT", body).then(() => {
												setFetching(false);
												dispatch(setBoards(body.boards));
											});
										});
									}

									messageRef.current.value = "";
								}}
								className="chat__input"
							>
								<input ref={messageRef} name="message" type="text" placeholder=" Написать сообщение..." />
								<button type="submit">Отправить</button>
							</form>
						</div>
					</div>
				</div>
				<div className="task-modal__bottom">
					<div className="task-modal__categories">
						{categories.map((item, index) => (
							<li
								className={Object.entries(taskState).length > 0 && taskState.categories.includes(item) ? "active" : ""}
								onClick={() =>
									setTaskState({
										...taskState,
										categories: taskState.categories.includes(item)
											? taskState.categories.filter((category) => category !== item)
											: [...taskState.categories, item],
									})
								}
								key={index}
							>
								{item}
							</li>
						))}
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
							<WeightIcon />
							<span>Вес</span>
						</div>
						<div className="task-modal-stats__button">
							<Dropdown
								taskState={taskState}
								setTaskState={setTaskState}
								type="weight"
								initial={Object.entries(taskState).length > 0 ? taskState.weight : task.weight}
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

	const weight = {
		biggest: { tag: "biggest", text: "Огромный" },
		big: { tag: "big", text: "Большой" },
		good: { tag: "good", text: "Хороший" },
		small: { tag: "small", text: "Малый" },
		tiny: { tag: "tiny", text: "Нисшевый" },
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
				{type === "weight" ? (
					<div className="task-dropdown__item">
						<div className={`board-column__status board-column__status_${initial}`}></div>
						<span>{weight[initial].text}</span>
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
					{type === "weight" ? (
						<>
							{Object.values(weight).map((item, index) => (
								<li
									onClick={() => {
										setActive(false);
										setTaskState({ ...taskState, weight: item.tag });
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
