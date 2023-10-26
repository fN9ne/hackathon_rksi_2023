import "./Sidebar.scss";

import { useDispatch, useSelector } from "react-redux";
import { setLogOutVisibility } from "../../redux/modals";
import { closeAll, setProjectTabVisibility, setRoomsTabVisibility } from "../../redux/sidebar";

import LogoutIcon from "../../assets/icons/logout.svg?react";
import ProjectIcon from "../../assets/icons/projects.svg?react";
import RoomsIcon from "../../assets/icons/rooms.svg?react";
import AdminIcon from "../../assets/icons/admin.svg?react";
import ProjectTab from "./components/ProjectTab";
import { useNavigate } from "react-router-dom";
import RoomTab from "./components/RoomTab";

const Sidebar = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const openLogOutModal = () => dispatch(setLogOutVisibility(true));

	const { role } = useSelector((state) => state.user);
	const sidebarState = useSelector((state) => state.sidebar);

	const tabs = [
		{
			title: "Проект",
			icon: <ProjectIcon />,
			tag: "projects",
			onClick: () => dispatch(setProjectTabVisibility(!sidebarState.projects)),
		},
		{ title: "Комнаты", icon: <RoomsIcon />, tag: "rooms", onClick: () => dispatch(setRoomsTabVisibility(!sidebarState.rooms)) },
		{ title: "Панель администратора", icon: <AdminIcon />, admin: true, onClick: () => navigate("/app/admin") },
	];

	const isTabActive = (tab, state) => {
		if (tab.tag && state) {
			return "sidebar__tab_active";
		}
		return "";
	};

	const filteredTabs = tabs.filter((tab) => {
		if (tab.admin && role !== "admin") {
			return false;
		}
		return true;
	});

	return (
		<aside className="sidebar">
			<div className="sidebar__content">
				<ul className="sidebar__tabs">
					{filteredTabs.map((tab, index) => (
						<li
							title={tab.title}
							key={index}
							onClick={() => {
								dispatch(closeAll());
								tab.onClick();
							}}
							className={`sidebar__tab ${isTabActive(tab, sidebarState[tab.tag])}`}
						>
							<button className="sidebar-item">{tab.icon}</button>
						</li>
					))}
				</ul>
				<div className="sidebar__logout">
					<button title="Выйти" onClick={openLogOutModal} className="sidebar-item sidebar-item__logout">
						<LogoutIcon />
					</button>
				</div>
			</div>
			<ProjectTab />
			<RoomTab />
		</aside>
	);
};

export default Sidebar;
