import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar/Sidebar";
import AnimatePage from "../components/AnimatePage";

const AppLayout = () => {
	return (
		<AnimatePage>
			<Sidebar />
			<div className="body">
				<Outlet />
			</div>
		</AnimatePage>
	);
};

export default AppLayout;
