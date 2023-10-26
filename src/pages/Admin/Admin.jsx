import "./Admin.scss";

import AnimatePage from "../../components/AnimatePage";
import { LineChartScreen } from "./components/Charts";

import SignUp from "../Auth/components/SignUp";
import { useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { slide } from "../../animations";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Admin = () => {
	const { users } = useSelector((state) => state.data);

	const { role } = useSelector((state) => state.user);

	const navigate = useNavigate();

	useEffect(() => {
		if (role !== "admin") {
			navigate("/");
		}
	}, [role]);

	return (
		<AnimatePage className="admin">
			<div className="admin__container">
				<Wrapper title="Статистика выполнения по комнатам">
					<LineChartScreen height={450} width={565} />
				</Wrapper>
				<SignUp />
				<div className="admin__users">
					<AnimatePresence>
						{users.map((item, id) => (
							<motion.div key={id} {...slide} className="admin__user">
								<div className="admin__fio">{`${item.firstName} ${item.lastName}`}</div>
								<div className="admin__username">{item.username}</div>
								<div className="admin__email">{item.email}</div>
							</motion.div>
						))}
					</AnimatePresence>
				</div>
			</div>
		</AnimatePage>
	);
};

export default Admin;

const Wrapper = ({ title, children }) => {
	return (
		<div className="chart-wrapper">
			<h2 className="chart-title">{title}</h2>
			{children}
		</div>
	);
};
