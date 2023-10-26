import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";

const Charts = () => {
	const chartData = [
		{ name: "2017", react: 1, angular: 37, vue: 60 },
		{ name: "2018", react: 5, angular: 32, vue: 62 },
		{ name: "2019", react: 10, angular: 50, vue: 50 },
		{ name: "2020", react: 15, angular: 16, vue: 40 },
		{ name: "2021", react: 20, angular: 30, vue: 32 },
	];

	return (
		<LineChart width={600} height={300} data={chartData}>
			<Line type="monotone" dataKey="react" stroke="blue" />
			<Line type="monotone" dataKey="angular" stroke="red" />
			<Line type="monotone" dataKey="vue" stroke="green" />
			<XAxis dataKey="name" stroke="white" />
			<YAxis stroke="white" />
			<Tooltip />
			<CartesianGrid stroke="#ccc" />
		</LineChart>
	);
};

export default Charts;
