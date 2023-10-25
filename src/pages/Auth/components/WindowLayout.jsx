import Loader from "../../../components/Loader/Loader";

import { AnimatePresence, motion } from "framer-motion";
import { opacity } from "../../../animations";

const WindowLayout = ({ error, fetching, onSubmit, isFormValid, title, text, swapWindow, children }) => {
	return (
		<div className="auth">
			<h2 className="auth__title">{title}</h2>
			<div className="auth__delimiter"></div>
			<form onSubmit={(event) => onSubmit(event)} action="#" className="auth-form">
				<div className="auth-form__body">{children}</div>
				<AnimatePresence>
					{error.length && <motion.div {...opacity} className="auth-form__error" children={error} />}
				</AnimatePresence>
				<div className="auth-form__footer">
					<button disabled={!isFormValid} type="submit" className="button">
						{text.submit}
					</button>
					<div className="auth-form__change">
						{text.change}
						<a className="auth-form__link" href="#swapWindow" onClick={swapWindow}>
							{text.link}
						</a>
					</div>
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
