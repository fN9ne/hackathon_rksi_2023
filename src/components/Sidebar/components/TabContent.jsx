import { AnimatePresence, motion } from "framer-motion";
import { slide } from "../../../animations";

const TabContent = ({ condition, children }) => {
	return (
		<AnimatePresence>
			{condition && (
				<motion.div className="tab-content" {...slide}>
					<div className="tab-content__body">{children}</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default TabContent;
