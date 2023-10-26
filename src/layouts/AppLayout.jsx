import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar/Sidebar";
import AnimatePage from "../components/AnimatePage";
import { useDispatch } from "react-redux";
import { closeAll } from "../redux/sidebar";

const AppLayout = () => {
	const dispatch = useDispatch();

	return (
		<AnimatePage
			/* onClick={(event) => {
				if (!event.target.closest(".sidebar")) {
					dispatch(closeAll());
				}
			}} */
			className="app"
		>
			<Sidebar />
			<div className="body">
				<Outlet />
			</div>
		</AnimatePage>
	);
};

export default AppLayout;
