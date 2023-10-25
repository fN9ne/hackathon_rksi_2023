import { AnimatePresence } from "framer-motion";
import { Routes, Route, useLocation, Navigate, useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import { useEffect } from "react";

import api from "../api";
import routes from "../routes";
import appRoutes from "../appRoutes";

import AppLayout from "../layouts/AppLayout";
import LogOut from "./Modal/LogOut";

import { setBoards, setUsers } from "../redux/data";
import { setUser } from "../redux/user";

import Board from "../pages/Board/Board";
import { setActiveProject, setActiveRoom } from "../redux/sidebar";

const App = () => {
	const location = useLocation();
	const pathname = location.pathname;

	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		const ftUser = localStorage.getItem("ft_user");

		if (ftUser) {
			dispatch(setUser(JSON.parse(ftUser)));
		} else {
			navigate("/");
		}

		api("GET").then((response) => {
			const result = response.record;
			dispatch(setUsers(result.users));
			dispatch(setBoards(result.boards));
			dispatch(setActiveProject(result.boards[0].name));
			dispatch(setActiveRoom(result.boards[0].rooms[0].name));
		});
	}, []);

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
					</Route>
				</Routes>
			</AnimatePresence>
			<LogOut />
		</>
	);
};

export default App;
