import "./Introduction.scss";

import AnimatePage from "../../components/AnimatePage";

import Screen1 from "./components/Screen1";

import { setScreen } from "../../redux/intro";

import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { slide } from "../../animations";
import Screen2 from "./components/Screen2";
import Screen3 from "./components/Screen3";

const Introduction = () => {
	const { project, team, members, screen } = useSelector((state) => state.intro);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(setScreen(1));
	}, []);

	return (
		<AnimatePage className="intro">
			<div className="intro__content">
				<AnimatePresence mode="wait" initial={false}>
					{screen === 1 && (
						<motion.div key={1} className="intro__item" {...slide}>
							<Screen1 />
						</motion.div>
					)}
					{screen === 2 && (
						<motion.div key={2} className="intro__item" {...slide}>
							<Screen2 />
						</motion.div>
					)}
					{screen === 3 && (
						<motion.div key={3} className="intro__item" {...slide}>
							<Screen3 />
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</AnimatePage>
	);
};

export default Introduction;
