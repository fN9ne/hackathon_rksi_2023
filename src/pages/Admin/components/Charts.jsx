import { useSelector } from "react-redux";
import { BarChart, Legend, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from "recharts";

export const LineChartScreen = ({ ...props }) => {
	const rooms = useSelector((state) => state.board);

	const data = rooms.data &&
		Object.entries(rooms.data).length > 0 && [
			...rooms.data.rooms.map((room) => {
				return {
					name: room.name,
					...room.content.reduce((acc, col) => {
						acc[col.tag] = col.tasks.length;
						return acc;
					}, {}),
				};
			}),
		];

	return (
		rooms.data && (
			<BarChart {...props} data={data}>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="name" />
				<Tooltip />
				<Legend />
				<Bar dataKey="todo" fill="#F64949" />
				<Bar dataKey="fix" fill="#F69C49" />
				<Bar dataKey="progress" fill="#FBFF32" />
				<Bar dataKey="complete" fill="#9BFE79" />
			</BarChart>
		)
	);
};
