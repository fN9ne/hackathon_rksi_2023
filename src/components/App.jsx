import { AnimatePresence, motion } from "framer-motion";
import { Routes, Route, useLocation } from "react-router-dom";
import routes from "../routes";

const App = () => {
	const location = useLocation();
	const pathname = location.pathname;

	return (
		<AnimatePresence mode="wait" initial={false}>
			<Routes location={location} key={pathname}>
				{routes.map((route, index) => (
					<Route key={index} path={route.path} element={route.element} />
				))}
			</Routes>
		</AnimatePresence>
	);
};

export default App;
