import { AnimatePresence } from "framer-motion";
import { Routes, Route, useLocation, Navigate, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import api from "../api";
import routes from "../routes";
import appRoutes from "../appRoutes";

import AppLayout from "../layouts/AppLayout";
import LogOut from "./Modal/LogOut";

import { setBoards, setUsers } from "../redux/data";
import { setUser } from "../redux/user";

import Board from "../pages/Board/Board";
import { setActiveProject, setActiveRoom } from "../redux/sidebar";
import { setData, setSave } from "../redux/board";
import Test from "../pages/Test";
import Appointment from "./Mails/Appointment";
import { setAppointment, setAppointmentSending } from "../redux/mailer";
import Admin from "../pages/Admin/Admin";
import Auth from "./Mails/Auth";

const App = () => {
	const location = useLocation();
	const pathname = location.pathname;

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { activeProject } = useSelector((state) => state.sidebar);
	const { boards, users } = useSelector((state) => state.data);
	const { data, save } = useSelector((state) => state.board);

	const [oldData, setOldData] = useState([]);

	const compareArrays = (arr1, arr2) => {
		let oldExecutors = [];
		let newExecutors = [];

		for (let i = 0; i < arr1.length; i++) {
			let task1 = arr1[i];
			let task2 = arr2[i];

			if (!arraysEqual(task1.executors, task2.executors)) {
				oldExecutors.push(task1);
				newExecutors.push(task2);
			}
		}
		return { oldExecutors, newExecutors };
	};

	const arraysEqual = (arr1, arr2) => {
		if (arr1.length !== arr2.length) return false;

		for (let i = 0; i < arr1.length; i++) {
			if (arr1[i] !== arr2[i]) return false;
		}

		return true;
	};

	useEffect(() => {
		if (Object.entries(data).length > 0 && save) {
			const allTasks = [];

			data.rooms.forEach((room) => room.content.forEach((content) => content.tasks.forEach((task) => allTasks.push(task))));

			const { oldExecutors, newExecutors } = compareArrays(oldData, allTasks);

			if (
				oldData.length > 0 &&
				oldExecutors.length !== 0 &&
				oldExecutors[0].executors.length < newExecutors[0].executors.length
			) {
				const executor = newExecutors[0].executors.filter((item) => !oldExecutors[0].executors.includes(item));
				const task_name = newExecutors[0].name;
				const deadline = newExecutors[0].deadline ? newExecutors[0].deadline : "Не установлен";
				const room = newExecutors[0].room;

				executor.forEach(async (item) => {
					await new Promise((resolve) => setTimeout(resolve, 1000));

					dispatch(
						setAppointment({
							task_name: task_name,
							deadline: deadline,
							to: users.filter((user) => user.username === item)[0].email,
							room: room,
						})
					);
					dispatch(setAppointmentSending(true));
				});
			}

			setOldData(allTasks);

			dispatch(setSave(false));
		}
	}, [data]);

	useEffect(() => {
		const ftUser = localStorage.getItem("ft_user");

		if (ftUser) {
			dispatch(setUser(JSON.parse(ftUser)));
		} else {
			navigate("/welcome");
		}

		api("GET").then((response) => {
			const result = response.record;
			dispatch(setUsers(result.users));
			dispatch(setBoards(result.boards));
			dispatch(setActiveProject(result.boards[0].name));
			dispatch(setActiveRoom(result.boards[0].rooms[0].name));
			dispatch(setData(result.boards[0]));
		});
	}, []);

	useEffect(() => {
		if (boards.length > 0 && activeProject) {
			dispatch(setData(boards.filter((board) => board.name === activeProject)[0]));
		}
	}, [boards, activeProject]);

	return (
		<>
			<AnimatePresence mode="wait" initial={false}>
				<Routes location={location} key={pathname}>
					<Route index element={<Navigate to="/welcome" />} />
					{routes.map((route, index) => (
						<Route key={index} path={route.path} element={route.element} />
					))}
					<Route path="app" element={<AppLayout />}>
						<Route path="board" element={<Board />} />
						<Route path="admin" element={<Admin />} />
					</Route>
					<Route path="/test" element={<Test />} />
				</Routes>
			</AnimatePresence>
			<LogOut />
			<Auth />
			<Appointment />
		</>
	);
};

export default App;
