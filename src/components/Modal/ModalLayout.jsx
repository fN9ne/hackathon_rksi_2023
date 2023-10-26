import "./Modal.scss";

import { AnimatePresence, motion } from "framer-motion";

import { opacity, slide } from "../../animations";

const ModalLayout = ({ condition, className, children, close }) => {
	return (
		<AnimatePresence>
			{condition && (
				<motion.div
					onClick={(event) => {
						if (!event.target.closest(".modal__content")) close();
					}}
					className="modal"
					{...opacity}
				>
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
