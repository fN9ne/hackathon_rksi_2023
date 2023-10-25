import Auth from "./pages/Auth/Auth";
import Welcome from "./pages/Welcome/Welcome";

const routes = [
	{
		text: "Главная",
		path: "/welcome",
		element: <Welcome />,
	},
	{
		text: "Авторизация",
		path: "/auth",
		element: <Auth />,
	},
];

export default routes;
