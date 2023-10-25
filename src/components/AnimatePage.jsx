import { motion } from "framer-motion";
import { slide } from "../animations";

const AnimatePage = (props) => {
	return <motion.div {...props} {...slide} transition={{ duration: 0.25, ease: "easeInOut" }} />;
};

export default AnimatePage;
