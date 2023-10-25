import Auth from "./pages/Auth/Auth";
import Welcome from "./pages/Welcome/Welcome";
import Introduction from "./pages/Introduction/Introduction";

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
	{
		text: "Вступление",
		path: "/introduction",
		element: <Introduction />,
	},
];

export default routes;
