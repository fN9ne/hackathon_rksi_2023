import "./Modal.scss";

import { AnimatePresence, motion } from "framer-motion";

import { opacity, slide } from "../../animations";

const ModalLayout = ({ condition, className, children }) => {
	return (
		<AnimatePresence>
			{condition && (
				<motion.div className="modal" {...opacity}>
					<div className="modal__body">
						<motion.div {...slide} className={`modal__content${className ? ` ${className}` : ""}`}>
							{children}
						</motion.div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default ModalLayout;
