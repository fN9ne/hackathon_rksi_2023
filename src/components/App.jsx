import { AnimatePresence } from "framer-motion";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import routes from "../routes";
import { useDispatch } from "react-redux";
import { setUsers } from "../redux/users";
import { useEffect } from "react";
import api from "../api";
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
		});
	}, []);

	return (
		<AnimatePresence mode="wait" initial={false}>
			<Routes location={location} key={pathname}>
				<Route index element={<Navigate to="welcome" />} />
				{routes.map((route, index) => (
					<Route key={index} path={route.path} element={route.element} />
				))}
			</Routes>
		</AnimatePresence>
	);
};

export default App;
