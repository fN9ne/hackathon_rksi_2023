import { date } from "./functions";

export const board = ({ project }) => {
	return {
		name: project,
		purpose: "",
		deadline: "",
		rooms: [room("Комната 1")],
	};
};

export const room = (name) => {
	return {
		name: name,
		content: [
			column("todo", "Нужно сделать"),
			column("fix", "Нужно исправить"),
			column("progress", "В процессе"),
			column("complete", "Выполнено"),
		],
	};
};

export const column = (tag, name) => {
	return {
		name: name,
		tag: tag,
		tasks: [],
	};
};

export const task = ({
	status = null,
	name = null,
	desc = null,
	deadline = null,
	deadlineFormat = null,
	createDate = date(new Date(), false, true),
	creator,
	priority = "medium",
	executors = [],
	weight = "good",
	categories = [],
	chat = [],
}) => {
	return {
		status: status,
		name: name,
		desc: desc,
		deadline: deadline,
		deadlineFormat: deadlineFormat,
		createDate: createDate,
		creator: creator,
		priority: priority,
		executors: executors,
		weight: weight,
		categories: categories,
		chat: chat,
	};
};
