import { AnimatePresence } from "framer-motion";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import { useEffect } from "react";

import api from "../api";
import routes from "../routes";
import appRoutes from "../appRoutes";

import AppLayout from "../layouts/AppLayout";

import { setTeams, setUsers } from "../redux/data";
import { setUser } from "../redux/user";

const App = () => {
	const location = useLocation();
	const pathname = location.pathname;

	const dispatch = useDispatch();

	useEffect(() => {
		const ftUser = localStorage.getItem("ft_user");

		if (ftUser) {
			dispatch(setUser(JSON.parse(ftUser)));
		}

		api("GET").then((response) => {
			dispatch(setUsers(response.record.users));
			dispatch(setTeams(response.record.teams));
		});
	}, []);

	return (
		<AnimatePresence mode="wait" initial={false}>
			<Routes location={location} key={pathname}>
				<Route index element={<Navigate to="/welcome" />} />
				{routes.map((route, index) => (
					<Route key={index} path={route.path} element={route.element} />
				))}
				<Route path="app" element={<AppLayout />}>
					{appRoutes.map((route, index) => (
						<Route key={index} path={route.path} element={route.element} />
					))}
				</Route>
			</Routes>
		</AnimatePresence>
	);
};

export default App;
