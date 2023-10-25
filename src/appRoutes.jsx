import Board from "./pages/Board/Board";

const appRoutes = [
	{
		text: "Доска",
		path: "board:boardname",
		element: <Board />,
	},
];

export default appRoutes;
