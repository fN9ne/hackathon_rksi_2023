import Loader from "../../../components/Loader/Loader";

import { AnimatePresence, motion } from "framer-motion";
import { opacity } from "../../../animations";

const WindowLayout = ({ success, error, fetching, onSubmit, isFormValid, title, text, children }) => {
	return (
		<div className="auth">
			<h2 className="auth__title">{title}</h2>
			<div className="auth__delimiter"></div>
			<form onSubmit={(event) => onSubmit(event)} action="#" className="auth-form">
				<div className="auth-form__body">{children}</div>
				<AnimatePresence>
					{error.length && <motion.div {...opacity} className="auth-form__error" children={error} />}
				</AnimatePresence>
				<AnimatePresence>
					{success.length && <motion.div {...opacity} className="auth-form__success" children={success} />}
				</AnimatePresence>
				<div className="auth-form__footer">
					<button disabled={!isFormValid} type="submit" className="button">
						{text.submit}
					</button>
				</div>
			</form>
			<AnimatePresence>
				{fetching && (
					<motion.div {...opacity} className="loader">
						<Loader />
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default WindowLayout;
